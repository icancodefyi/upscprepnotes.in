# UPSCPrepNotes — Brand Identity (v1.0)

## 1. What we are
**The archive of real topper work.** Marksheets, answer booklets and paper-by-paper marks of UPSC rank holders, shown as they are.

- **One-line promise:** Learn from the real thing.
- **We are not:** a coaching institute, a notes mill, or a motivation channel.
- **Proof we lead with:** a real booklet, a real mark, a real name. Never a claim we can't show.

## 2. Brand idea: "The Booklet"
Every UPSC aspirant knows the answer booklet: ruled lines, a margin you mustn't write in, an index table of marks, a blue pen, and an examiner's red. The interface borrows that object, quietly:

| Booklet element | Where it shows up in the UI |
|---|---|
| Ruled lines | Faint 1px rules that divide sections |
| "Don't write in this area" margin | A narrow left margin column that holds small meta (year, rank, source) |
| Index table of marks | Every number is set in tabular figures, in a table rhythm |
| Blue ballpoint | The single accent (`--accent`). Reserved for the student's work and the primary action |
| Examiner's red | `--mark`. Used **only** for marks awarded and corrections. Never decoration |

## 3. Personality and voice
The senior who kept every copy. Calm, exact, generous.

- Say the number. "121 in GS I" beats "excellent GS performance".
- Short sentences. No hype words (elevate, unlock, game-changer, journey).
- No fake urgency, no countdowns, no invented reviews.
- No eyebrow labels above headings. A heading stands on its own.
- Always label a source. If we don't know who wrote a page, we say so.

## 4. Typography
One typeface, two weights, three sizes, plus one page-title size for the H1.

**Face:** Funnel Sans (the text cut of Funnel Display, our original display face), loaded in `components/brand/fonts.ts` with weights 400 and 700 only. Chosen over Inter, Plus Jakarta Sans, Instrument Sans and Figtree for keeping the brand voice in headings while staying legible in 14px tables.

| Size | Class | Value | Leading | Use |
|---|---|---|---|---|
| Small | `text-s` | 14px | 1.45 | Labels, meta, chips, table cells, captions |
| Medium | `text-m` | 17px | 1.55 | Body, buttons, card and tile titles (bold), inputs |
| Large | `text-l` | 28–40px (fluid) | 1.12 | Section headings, headline figures (a mark, a count), long page titles. Not card titles |
| Page title | `text-h1` | 38–60px (fluid) | 1.02 | The one H1 per page, when it is short (a name, a page name). The only exception to three sizes, so the title always outranks section headings |

| Weight | Class | Use |
|---|---|---|
| Regular 400 | (default) / `font-normal` | Body, meta, secondary text |
| Bold 700 | `font-bold`, `t-head`, `t-display` | Headings, names, key numbers, buttons |

Rules:
- Never use an arbitrary size (`text-[15px]`) or another weight (500, 600). Pick one of the three.
- Buttons are medium by default; a compact button uses small via `[--btn-fs:14px]`.
- Hierarchy comes from weight, colour (`--ink` vs `--ink-2` vs `--muted`) and space, not from more sizes.
- The ladder inside a section: heading `text-l`, then a card or tile title `text-m` bold, then its description `text-s`. A headline figure inside a card may be `text-l`; a card title never is, or the cards outrank the section they sit in.
- Tabular figures for every number; `text-wrap: balance` on headings; body measure 55–70 characters.
- Max marks are written "of 2,025 marks", never "/ 2,025", which reads as the year 2025.
- Graphic badges (the rank stamp, the footer seal) scale their lettering with the artwork and are exempt.

## 5. Colour
Three brand colours carry everything: **ballpoint blue, paper white, highlighter yellow.** Examiner red is an accent for marks only.

| Role | Token | Hex | Use |
|---|---|---|---|
| **Ballpoint blue** (primary) | `--accent` | `#1F3FD6` | Primary buttons, links, key words in headings, full-bleed story panels |
| Blue, pressed / hover | `--accent-ink` | `#172FA3` | Hover and active states |
| Blue, deep | `--accent-deep` | `#13238A` | Text on pale blue, dark accents |
| Blue tint | — | `#E9EDFF` | Pale blue cards and surfaces |
| Blue wash | `--accent-soft` | `rgba(31,63,214,0.08)` | Hover backgrounds, ruled lines |
| **Paper white** | `--paper` | `#FFFFFF` | Page and card background |
| Canvas | `--canvas` | `#F4F5F9` | Section panels, quiet fills |
| **Highlighter yellow** | `--hl` | `#FFE45C` | Highlighter swipes, price stickers, active rows, footer panel |
| Yellow ink | `--hl-ink` | `#5C4A00` | Small text on yellow |
| Ink | `--ink` | `#0B0C10` | Headings, body text, dark panels, ink buttons |
| Ink 2 | `--ink-2` | `#3F4450` | Secondary text |
| Muted | `--muted` | `#858A96` | Meta, captions |
| Rule | `--line` | `rgba(11,12,16,0.08)` | Borders and dividers |
| Examiner red | `--mark` | `#FF4A3D` (deep `#D9342A`) | Marks awarded, rings, rank stamps. Never decoration |

Folder stock (optional-subject tabs only): `#FFE45C`, `#DBE2FF`, `#FFD8CF`, `#D4F1DF`, `#EBE2FF`, `#FDE9C4`.

**Gradients:** only when they are in a brand colour and do a job, such as the blue ruled lines on index cards, or the white fade that tucks the booklet fan into the page. No decorative glows, mesh backgrounds or sheens.

## 6. Shape, depth, spacing
- **Radius scale:** 8 / 12 / 20 / 28. Nested corners are concentric (inner = outer − padding).
- **Borders:** 1px `--line`. **Shadows:** short and crisp under the object; no wide blurred haze.
- **Spacing:** 4px base; sections 96–128px apart; content width 1120px; coloured panels max 1360px, inset 24px from the edge, 40px radius.

## 7. Motion
Borrowed from Emil Kowalski / Rauno Freiberg practice.
- UI responds in < 200ms with strong ease-out (`cubic-bezier(.23,1,.32,1)`); press = `scale(.97)`.
- Entrances: 8–12px rise + fade, 60–80ms stagger, once.
- Only `transform` and `opacity` animate. Hover effects only on fine pointers.
- Signature moves: **the examiner's circle** (a red ring drawn round a final mark) and **the lens** (magnify real handwriting).
- Everything respects `prefers-reduced-motion`.

## 8. Imagery
Real scans and real numbers only. No stock photos, no AI illustrations, no avatars of people who aren't who they claim to be. Scans keep their watermarks; we never crop out a source. Pages carrying another reseller's watermark are not used.

**Line illustrations** (`components/brand/Outline.tsx`) are the one kind of drawn art we allow: a single faint outline (envelope, shield, calendar, pen, book, file, chat) set large and low-contrast in the corner of a coloured band or call-to-action, hinting at what the section is for. Stroke only, 6 units on a 200×150 grid, white at 6–12% on dark or blue, accent at 7–12% on light. Never a gradient, never filled, never behind body text at a strength that hurts legibility, never more than two per band. Decorative: `aria-hidden`.

## 9. Logo and icons
The mark is the booklet: an ink rounded square, an examiner-red margin rule, two white lines of writing and a last line in pale ballpoint blue. The wordmark is **UPSCPrepNotes** in Funnel Sans Bold, set tight (`-0.02em`), never split, never recoloured.

| Asset | File | Use |
|---|---|---|
| Tab icon (vector) | `public/icon.svg` | Browser tab; sharp at any size |
| Favicon | `app/favicon.ico` | 16, 32 and 48px for browsers that ask for `/favicon.ico` |
| Logo | `public/logo.png` | 1024px, transparent corners. Organisation schema logo, fallback share image |
| Apple touch icon | `public/apple-touch-icon.png` | 180px, full-bleed (iOS rounds it itself) |
| In-app mark | `Mark` in `components/brand/Nav.tsx` | The same drawing as a React component, sized by prop |

Clear space: half the mark's width on every side. Minimum size: 16px (the favicon). Do not put the mark on a photograph, rotate it, or add a shadow. The nav mark tilts 6 degrees on hover; that is the only motion.

## 10. Share images
Every page that has no image of its own shares one of four 1200×630 images in `public/og/`: `default.png`, `store.png`, `ask.png`, `advertise.png`. Same template: mark and wordmark top left, a two or three line headline in bold with one highlighter swipe, one sentence beneath, the domain bottom left, and one piece of art on the right (paper sheets with a red-circled mark; real product covers with a price sticker; a chat; the three ad slots). White background, no gradients. Headlines use the same words as the page's H1.

## 11. Navigation
`components/brand/Nav.tsx`: a floating pill. Left: mark and wordmark. Centre: **Toppers**, **Study**, **Ask AI**, **More**. Right: search and the **Store** button.

- Toppers and Study open mega-menus, More a list, Store a product list with covers and prices. Panels are anchored to the bar (centre; Store aligns to the right edge).
- Open on hover with a 140ms close delay, or on click or Arrow Down; close on Escape, outside click, route change or tabbing out.
- A pale pill slides under whichever top-level item the pointer is on. The section you are in carries a 3px blue underline (and a dot in the mobile drawer). The current page is blue inside the panels.
- Panel entrance: 8px rise and fade with a 24ms stagger on the items; `transform` and `opacity` only. Reduced motion turns it all off.
- Below 1024px a drawer replaces the links: Ask AI first, then one-open accordion groups (Toppers, Study, Store, More), then Search and Store.
- Store products come from `lib/store-products.ts` through `BrandShell`, best seller first; images load only after the Store menu is first opened.
- Ask AI is a direct link, not a menu. Links added here must exist: there is no `/compare` index, so the compare pages are reached from topper profiles only.

## 12. Building a page on the brand
Shared pieces live in `components/brand/`:

| File | What it is |
|---|---|
| `BrandShell.tsx` | Wrap a page in it: brand tokens, fonts, navbar, yellow footer. Every route except `/ask` and `/admin` is inside it, including the 404 |
| `Nav.tsx` | The navbar and the `Mark` |
| `Footer.tsx` | The yellow footer |
| `brand.css` | Tokens and utilities (`.btn`, `.panel`, `.h-sec`, `.swipe`, `.paper`, `.nav-panel`…), scoped to `.up` |
| `SectionHead.tsx` | The one section heading pattern: title, lead, optional action |
| `Props.tsx` | Push pin (`red`, `blue`, `yellow`) and paperclip |
| `Outline.tsx` | The faint line illustrations for bands and CTAs |
| `Lens.tsx` | Magnifier over a real scan |

`/ask` is the one full-height app: it has its own frame in `AppShell` and `app/ask/ask.css` (`.ask-brand` remaps the shadcn theme variables to the brand palette).

## 13. Still to bring onto the brand
- **Emails** (`emails/*.html`, order and download emails): still the old green palette and wording.
- **Admin panel**: internal, not branded.
- **PDF products**: covers and interiors are the sellers' own.
