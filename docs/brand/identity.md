# UPSCPrepNotes — Brand Identity (v0.1, draft)

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
One typeface, two weights, three sizes. Nothing else.

**Face:** Funnel Sans (the text cut of Funnel Display, our original display face), loaded in `components/brand/fonts.ts` with weights 400 and 700 only. Chosen over Inter, Plus Jakarta Sans, Instrument Sans and Figtree for keeping the brand voice in headings while staying legible in 14px tables.

| Size | Class | Value | Leading | Use |
|---|---|---|---|---|
| Small | `text-s` | 14px | 1.45 | Labels, meta, chips, table cells, captions |
| Medium | `text-m` | 17px | 1.55 | Body, buttons, card titles, inputs |
| Large | `text-l` | 28–40px (fluid) | 1.12 | Page titles, section headings, headline numbers |

| Weight | Class | Use |
|---|---|---|
| Regular 400 | (default) / `font-normal` | Body, meta, secondary text |
| Bold 700 | `font-bold`, `t-head`, `t-display` | Headings, names, key numbers, buttons |

Rules:
- Never use an arbitrary size (`text-[15px]`) or another weight (500, 600). Pick one of the three.
- Buttons are medium by default; a compact button uses small via `[--btn-fs:14px]`.
- Hierarchy comes from weight, colour (`--ink` vs `--ink-2` vs `--muted`) and space, not from more sizes.
- Tabular figures for every number; `text-wrap: balance` on headings; body measure 55–70 characters.
- Max marks are written "of 2,025 marks", never "/ 2,025", which reads as the year 2025.
- Graphic badges (the rank stamp, the footer seal) scale their lettering with the artwork and are exempt.

## 5. Colour (v1, in use on /try)
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

## 9. Building a page on the brand
Shared pieces live in `components/brand/`:

| File | What it is |
|---|---|
| `BrandShell.tsx` | Wrap a page in it: brand tokens, fonts, pill nav, yellow footer |
| `routes.ts` | Add the route to `BRAND_ROUTES` so the old header, footer and banner stay off it |
| `brand.css` | Tokens and utilities (`.btn`, `.panel`, `.h-sec`, `.swipe`, `.paper`…), scoped to `.up` |
| `SectionHead.tsx` | The one section heading pattern: title, lead, optional action |
| `Props.tsx` | Push pin (`red`, `blue`, `yellow`) and paperclip |
| `Lens.tsx` | Magnifier over a real scan |
