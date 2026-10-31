import rawManifest from "./download-manifest.json";

export interface ManifestFile {
  /** Path of the PDF relative to the product folder on the CDN. */
  p: string;
  /** Size in bytes. */
  s: number;
}

export interface ProductFiles {
  /** Folder name on the CDN under /files/. */
  folder: string;
  count: number;
  size: number;
  files: ManifestFile[];
}

export const DOWNLOAD_MANIFEST = rawManifest as Record<string, ProductFiles>;

/** Path prefixes that add no meaning for a customer. */
const NOISE_SEGMENTS = new Set(["answer-copies-build"]);

export const CDN_BASE = normalizeBase(process.env.VPS_URL);

/** Accept "cdn.example.com", "https://cdn.example.com/" and bare IPs without breaking. */
function normalizeBase(raw?: string): string {
  const value = (raw || "https://cdn.upscprepnotes.in").trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function getProductFiles(slug: string): ProductFiles | null {
  const entry = DOWNLOAD_MANIFEST[slug];
  return entry && entry.files.length > 0 ? entry : null;
}

/** Absolute CDN URL for one file, encoding each path segment. */
export function fileUrl(folder: string, path: string): string {
  const encoded = path
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  return `${CDN_BASE}/files/${encodeURIComponent(folder)}/${encoded}`;
}

/** Whole-bundle ZIP, still available as a one-click option. */
export function zipUrl(folder: string): string {
  return `${CDN_BASE}/${encodeURIComponent(folder)}.zip`;
}

/** Collapse repeated folder segments and drop known noise prefixes. */
function cleanSegments(path: string): string[] {
  const parts = path.split("/").filter(Boolean);
  const collapsed = parts.filter((seg, i) => i === 0 || seg !== parts[i - 1]);
  while (collapsed.length > 1 && NOISE_SEGMENTS.has(collapsed[0])) collapsed.shift();
  return collapsed;
}

export interface FileGroup {
  title: string;
  files: { name: string; path: string; size: number }[];
}

/**
 * Group files by their folder so a 81-file bundle reads as 5 sections
 * instead of one long wall of PDF names.
 */
export function groupFiles(files: ManifestFile[]): FileGroup[] {
  const groups = new Map<string, FileGroup>();

  for (const file of files) {
    const segments = cleanSegments(file.p);
    const name = segments[segments.length - 1] || file.p;
    const title = segments.slice(0, -1).join(" / ") || "Files";

    let group = groups.get(title);
    if (!group) {
      group = { title, files: [] };
      groups.set(title, group);
    }
    group.files.push({ name, path: file.p, size: file.s });
  }

  return [...groups.values()];
}

/** Decimal units, so the page matches the sizes quoted on product pages. */
export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1000 * 1000) return `${Math.round(bytes / 1000)} KB`;
  if (bytes < 1000 * 1000 * 1000) return `${Math.round(bytes / (1000 * 1000))} MB`;
  return `${(bytes / (1000 * 1000 * 1000)).toFixed(1)} GB`;
}
