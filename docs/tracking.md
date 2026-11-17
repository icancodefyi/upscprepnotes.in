# Tracking

Every user interaction we need for curation goes into one MongoDB collection, **`tracking`** (model `models/tracking.model.ts`). It is the only analytics system: Google Analytics, Microsoft Clarity, PostHog and the old `analyticsevents` collector were removed. `analyticsevents` stays as frozen, read-only history (Audience, Technology, and `/advertise` until `tracking` has 30 days).

## How it flows
- **Browser:** `components/Tracker.tsx` (mounted once in `AppShell`) captures interactions globally; `lib/track.ts` queues them and sends batches to `POST /api/track` every 4 seconds, at 20 events, and with `sendBeacon` when the tab hides.
- **Server:** `lib/tracking/server.ts` → `trackServer()` writes checkout and payment events directly.
- **Production only:** the browser does not send, and `/api/track` + `trackServer` do not write, unless `NODE_ENV=production` (and, on Vercel, `VERCEL_ENV=production`, so previews are excluded). Dev and local runs never record (`lib/tracking/env.ts`).
- **Not recorded:** bots and crawlers, `/admin`, localhost, visitors with Do Not Track or Global Privacy Control, and your own browser after you open any page with `?optex=1` (`?optex=0` re-enables).
- **Privacy:** emails and phone numbers are stripped from all free text; password, email and phone fields are never read as text; IPs are stored only as a salted hash (`TRACKING_SALT`, falls back to `AUTH_SECRET`). An email is stored only on `identify`, in its own field. Events expire after about 13 months.

## Every document
`event`, `source` (client/server), `ts`, `clientTs`, `visitorId` (the `_vid` cookie, shared with the old analytics), `sessionId`, `path`, `referrer`, `utm` (this session's source: utm_*, gclid, fbclid, ref, landing page, external referrer), `firstTouch` (the visitor's first ever source), `device` (type, viewport, user agent), `lang`, `tz`, `country`/`region`/`city` (on Vercel), `ipHash`, `props`, and `email` (identify only).

## Events
| Event | When | `props` |
|---|---|---|
| `page_view` | Every route | `title`, `from` (previous path) |
| `page_leave` | Leaving a page or hiding the tab | `duration_ms`, `max_scroll` |
| `scroll_depth` | First time past 25/50/75/90% | `depth` |
| `click` | Any link, button, tab, summary or `data-track` element | `track` (the `data-track` label), `tag`, `text`, `href`, `outbound`, `state` (expanded/selected), `section` |
| `form_submit` | Any form | `form`, `fields` (names only), `section` |
| `identify` | A form with an email is submitted; Google sign-in on /ask | `source` (+ `email` field) |
| `search` | Typing in a search box (debounced) or submitting one | `query`, `source`, `live` / `submitted` |
| `select` | A dropdown changes | `name`, `value`, `section` |
| `ask_question` | A question is sent to the AI mentor | `question` (up to 1,000 chars), `length`, `web_search`, `conversation` |
| `ask_retry` | A question is retried | `length` |
| `product_view` | A product page opens | `slug`, `price`, `category` |
| `buy_click` | Any Buy / Pay / Buy both button | `items`, `amount`, `tracking`, `has_email` |
| `checkout_redirect` | Leaving for the payment page | `items`, `amount`, `tracking` |
| `checkout_started` | Server, order created | `ref`, `total`, `items` |
| `purchase` | Server, payment succeeded | `ref`, `total`, `items`, `payment` |
| `js_error` | Uncaught error (max 5 per page). Skips noise that is not ours: browser extensions, wallet apps (`ethereum`) and empty cross-origin "Script error." | `message`, `source` / `kind`, `translated` (the page was machine-translated by the browser) |
| `session_start` | First page of each browser session | `visit_number`, `returning`, `days_since_last`, `days_since_first`, `screen`, `langs`, `tz_offset`, `connection`, `dark`, `reduced_motion`, `standalone`, `cores`, `memory` |
| `web_vitals` | Tab hidden after a hard page load | `lcp`, `cls`, `fcp`, `inp`, `ttfb` (ms; cls unitless), `nav_type` |
| `form_start` / `form_abandon` | First field focused / left the page without submitting | `form`, `section` |
| `rage_click` | 3 clicks within 1s in the same spot | `tag`, `text`, `section` |
| `copy` | Text selected and copied | `length` (never the text) |
| `section_view` | An element marked `data-track-view="name"` is half on screen | `name` |
| `ask_answer` | Server: the AI answered | `path` (`fast` = topper answer from the database, `model`), `ms`, `chars`, `sources`, `web_search`, `signed_in` |
| `ask_error` / `ask_limit` | Server: the model failed / the free limit blocked a question | `code`, `status`, `ms` / `authenticated` |
| `quiz_install_prompt` | Quiz results: "Add Gilu's quiz to home screen" clicked (Android prompt opens) | — |
| `quiz_install_choice` | The browser's answer to that prompt | `outcome` (`accepted` / `dismissed`), `platform` |
| `quiz_install_ios_seen` | An iPhone user sees the Share → Add to Home Screen steps (home screen or results) | — |
| `quiz_install_android_steps_seen` | Android browser without the install prompt: the ⋮ menu steps are shown (home screen or results) | — |
| `quiz_installed` | The app was installed (browser `appinstalled`) | — |

Clicks on links to files (`.pdf`, `.zip`…) and `/api/download` carry `download: true`. Marked sections so far: `home_lead_pack`, `topper_lead_form`, `topper_answer_copies`, `store_email_band`, `store_spotlight`, `product_buy_box`, `product_samples`, `product_reviews`. Free-material pages promote a product in three places, each with its own label for clicks (`click.track`) and views (`section_view.name`): `material-promo-top` (phones, under the download), `material-promo-side` (desktop sidebar) and `material-promo-bottom` (end of page). Click-through = clicks on the label / views of the label.

`checkout_started` and `purchase` share `props.ref`, so a purchase can be joined back to the visitor and everything they did before it.

To label something for analysis, add `data-track="name"` to the element; to capture typing in a non-search input, add `data-track-input`; to keep an element out, add `data-track-ignore`.

## Admin pages that read this data
`/admin` (dashboard) and `/admin/tracking/*`: **Traffic**, **Audience** (new vs returning, stickiness, weekly retention cohorts, time to first return, busiest hours), **Acquisition** (sources, campaigns, landing pages → emails and buyers), **Demand**, **Store funnel**, **Buyers** (lead → buyer, what buyers did first), **Leads** (list growth, sources, CSV export at `/api/admin/leads/export`), **AI mentor**, **Technology** (browsers, screens, languages, page speed), **Journeys** and **Live**. Audience and Technology use the long `analyticsevents` history, so they work before `tracking` has any data; the rest fill in once the site is live.

## Questions this answers (mongosh)
```js
// What do people ask the AI mentor? (last 30 days)
db.tracking.aggregate([{ $match: { event: "ask_question", ts: { $gte: new Date(Date.now() - 30*864e5) } } },
  { $project: { q: { $toLower: "$props.question" } } }, { $sortByCount: "$q" }, { $limit: 50 }])

// What do people search for, and where?
db.tracking.aggregate([{ $match: { event: "search" } }, { $sortByCount: { q: { $toLower: "$props.query" }, src: "$props.source" } }, { $limit: 50 }])

// Store funnel per product: views → buy clicks → paid
db.tracking.aggregate([{ $match: { event: { $in: ["product_view", "buy_click", "purchase"] } } },
  { $project: { event: 1, slug: { $ifNull: ["$props.slug", { $arrayElemAt: ["$props.items", 0] }] } } },
  { $group: { _id: { slug: "$slug", event: "$event" }, n: { $sum: 1 } } }, { $sort: { "_id.slug": 1 } }])

// Where buyers came from (first touch)
db.tracking.find({ event: "purchase" }, { email: 1, "props.ref": 1 })  // then look up the visitor's earliest event by ref/email

// Everything one visitor did, in order
db.tracking.find({ visitorId: "v..." }).sort({ ts: 1 })
```
