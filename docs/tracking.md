# Tracking

Every user interaction we need for curation goes into one MongoDB collection, **`tracking`** (model `models/tracking.model.ts`). It is separate from `analyticsevents` and PostHog, which keep working as before.

## How it flows
- **Browser:** `components/Tracker.tsx` (mounted once in `AppShell`) captures interactions globally; `lib/track.ts` queues them and sends batches to `POST /api/track` every 4 seconds, at 20 events, and with `sendBeacon` when the tab hides.
- **Server:** `lib/tracking/server.ts` → `trackServer()` writes checkout and payment events directly.
- **Not recorded:** bots and crawlers, `/admin`, visitors with Do Not Track or Global Privacy Control, and anything sent from `localhost` (set `TRACK_LOCAL=1` to test locally).
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
| `js_error` | Uncaught error (max 5 per page) | `message`, `source` / `kind` |

`checkout_started` and `purchase` share `props.ref`, so a purchase can be joined back to the visitor and everything they did before it.

To label something for analysis, add `data-track="name"` to the element; to capture typing in a non-search input, add `data-track-input`; to keep an element out, add `data-track-ignore`.

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
