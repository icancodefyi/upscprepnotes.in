# Brand icons

One icon set for the whole site, drawn in Gilu's style: a bold dark outline, flat colour, a soft white highlight. No icon fonts and no text characters (✓ ↓ →) standing in for icons.

## In the app

All icons live in `components/brand/icons/`.

```tsx
import { ZipIcon, FileIcon, MailIcon, ChatIcon, DownloadIcon, Medal, Flame, Mark, TrackIcon } from "@/components/brand/icons";
import { BrandIcon } from "@/components/brand/icons";

<ZipIcon size={48} />
<BrandIcon name="medal-topper" size={56} />
```

| File | What is in it |
| --- | --- |
| `commerce.tsx` | ZIP, file, mail, chat, download (orders, downloads, emails) |
| `quiz.tsx` | Medals, track tokens, streak flame, right/wrong marks |
| `index.tsx` | One import point, the `BrandIcon` by-name component, the list of names |

## Outside the app

Every icon is also a static file in `public/icons/`, for emails (Gmail strips inline SVG, so use the PNG), social images, Telegram posts and docs:

- `https://upscprepnotes.in/icons/<name>.svg`
- `https://upscprepnotes.in/icons/<name>.png` (128 px, transparent)

Names: `zip`, `file`, `mail`, `chat`, `download`, `flame`, `check`, `cross`, `track-shield`, `track-gift`, `medal-first`, `medal-hattrick`, `medal-clean`, `medal-perfect`, `medal-topper`, `medal-streak3`, `medal-speed`.

The files are generated from the same components, so they cannot drift from the app:

```
pnpm icons:export
```

Run it after changing or adding an icon, and commit the updated files.

## Adding an icon

1. Draw it in `commerce.tsx` (or `quiz.tsx`) using the shared colours and a 2–3 px dark outline.
2. Add its name to `BrandIconName`, `BRAND_ICON_NAMES` and the `BrandIcon` switch in `index.tsx`.
3. Run `pnpm icons:export` and commit the new files.
