/**
 * The brand icon set. One home for every custom icon on the site: a bold dark outline, flat colour
 * and a soft white highlight, the same style as Gilu. Nothing in here is a text character or an
 * icon-font glyph.
 *
 * In the app:      import { ZipIcon, Medal } from "@/components/brand/icons";
 * By name:         <BrandIcon name="zip" size={48} />
 * Outside the app: every icon is also exported as /icons/<name>.svg and /icons/<name>.png
 *                  (emails, social images, docs). Regenerate with `pnpm icons:export`.
 */
import type { ReactElement } from "react";
import { ChatIcon, DownloadIcon, FileIcon, MailIcon, ZipIcon } from "./commerce";
import { Flame, Mark, Medal, TrackIcon } from "./quiz";

export { ChatIcon, DownloadIcon, FileIcon, MailIcon, ZipIcon } from "./commerce";
export { Flame, Mark, Medal, TrackIcon } from "./quiz";

/** Badge ids that have a medal. */
export const MEDAL_IDS = ["first", "hattrick", "clean", "perfect", "topper", "streak3", "speed"] as const;

type SimpleName = "zip" | "file" | "mail" | "chat" | "download" | "flame" | "check" | "cross" | "track-shield" | "track-gift";
export type BrandIconName = SimpleName | `medal-${(typeof MEDAL_IDS)[number]}`;

/** Every icon name, in the order they appear in the exported asset folder. */
export const BRAND_ICON_NAMES: BrandIconName[] = [
  "zip", "file", "mail", "chat", "download",
  "flame", "check", "cross", "track-shield", "track-gift",
  ...MEDAL_IDS.map((id) => `medal-${id}` as const),
];

/** Renders any brand icon by name. Prefer the named components when you know which icon you need. */
export function BrandIcon({ name, size = 48, className }: { name: BrandIconName; size?: number; className?: string }): ReactElement {
  if (name.startsWith("medal-")) return <Medal id={name.slice(6)} size={size} />;
  switch (name) {
    case "zip": return <ZipIcon size={size} className={className} />;
    case "file": return <FileIcon size={size} className={className} />;
    case "mail": return <MailIcon size={size} className={className} />;
    case "chat": return <ChatIcon size={size} className={className} />;
    case "download": return <DownloadIcon size={size} className={className} />;
    case "flame": return <Flame on size={size} />;
    case "check": return <Mark kind="check" size={size} />;
    case "cross": return <Mark kind="cross" size={size} />;
    case "track-shield": return <TrackIcon id="m3" got size={size} />;
    case "track-gift": return <TrackIcon id="m7" got size={size} />;
    default: return <ZipIcon size={size} className={className} />;
  }
}
