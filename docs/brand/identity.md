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
One family, two cuts.

| Role | Face | Size / weight | Tracking | Leading |
|---|---|---|---|---|
| Display | Geist | 56–104px / 600 | -0.045em | 1.0 |
| Heading | Geist | 28–40px / 600 | -0.03em | 1.1 |
| Body | Geist | 17–19px / 400 | -0.011em | 1.55 |
| UI | Geist | 13–15px / 500 | -0.005em | 1.4 |
| Data & meta | Geist Mono | 11–13px / 400 | 0 | 1.4 |

Rules: tabular figures for every number; `text-wrap: balance` on headings; body measure 55–70 characters.

## 5. Colour (structure now, final hues later)
Neutral-first. Colour is earned by meaning.

| Token | Value (placeholder) | Use |
|---|---|---|
| `--paper` | #FFFFFF | Page |
| `--canvas` | #F5F6F8 | Section grounds, cards at rest |
| `--ink` | #0A0B0D | Text, primary buttons |
| `--ink-2` | #41464F | Secondary text |
| `--muted` | #8A8F98 | Meta, captions |
| `--line` | rgba(10,11,13,.08) | Rules and borders |
| `--accent` | #2340C8 | Ballpoint: links, focus, highlighted words |
| `--mark` | #D5372B | Examiner: marks awarded only |

Swap the two hues later; nothing else needs to change.

## 6. Shape, depth, spacing
- **Radius scale:** 8 / 12 / 20 / 28. Nested corners are concentric (inner = outer − padding).
- **Borders:** 1px `--line`. **Shadows:** layered and soft, never a single dark drop.
- **Spacing:** 4px base; sections 120–160px apart; content width 1200px.

## 7. Motion
Borrowed from Emil Kowalski / Rauno Freiberg practice.
- UI responds in < 200ms with strong ease-out (`cubic-bezier(.23,1,.32,1)`); press = `scale(.97)`.
- Entrances: 8–12px rise + fade, 60–80ms stagger, once.
- Only `transform` and `opacity` animate. Hover effects only on fine pointers.
- Signature moves: **the examiner's circle** (a red ring drawn round a final mark) and **the lens** (magnify real handwriting).
- Everything respects `prefers-reduced-motion`.

## 8. Imagery
Real scans and real numbers only. No stock photos, no AI illustrations, no avatars of people who aren't who they claim to be. Scans keep their watermarks; we never crop out a source. Pages carrying another reseller's watermark are not used.
