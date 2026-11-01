/**
 * Shared marks maths for the redesigned pages. Everything here is computed from published UPSC marks;
 * nothing is estimated. A marksheet only enters a comparison pool when it is complete (see isComplete).
 */

export type LeanTopper = {
  firstName?: string;
  lastName?: string;
  rank?: number;
  year?: number;
  slug?: string;
  optionalSubject?: string;
  marks?: Record<string, number | undefined>;
  freeAnswerCopyUrls?: string[];
  freeAnswerCopyUrl?: string;
  answerCopies?: Record<string, string[] | undefined>;
  ProfileImage?: string;
};

export const n = (t: LeanTopper, k: string) => t.marks?.[k] ?? 0;

/** Some names are stored in capitals ("UMA Harathi"); show them in normal case. */
export const displayName = (t: { firstName?: string; lastName?: string }) =>
  `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim().replace(/\b([A-Z])([A-Z]+)\b/g, (_, a: string, b: string) => a + b.toLowerCase());

/** PSIR is stored under two spellings; everything else is trimmed. */
export const subjectOf = (s?: string) => {
  if (!s) return "";
  if (/political science/i.test(s)) return "PSIR";
  // "Literature of Hindi" / "kannada Literature" → "Hindi Literature" / "Kannada Literature"
  const t = s.trim().replace(/^literature of (\w+)$/i, "$1 Literature");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const optTotal = (t: LeanTopper) => n(t, "optional1") + n(t, "optional2");

/** Total out of 2,025. Some records store a broken total, so fall back to written + interview. */
export const totalOf = (t: LeanTopper) => {
  const tot = n(t, "total");
  const sum = n(t, "written") + n(t, "interview");
  return tot >= sum || sum === 0 ? tot : sum;
};

export function isComplete(t: LeanTopper) {
  const tot = n(t, "total");
  return (
    tot > 800 && tot <= 2025 &&
    ["essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2"].every((k) => n(t, k) > 0 && n(t, k) <= 250) &&
    n(t, "interview") > 0 && n(t, "interview") <= 275 &&
    // Placeholder records repeat one number across papers (e.g. 100 everywhere); real sheets never do.
    new Set(["essay", "gs1", "gs2", "gs3", "gs4"].map((k) => n(t, k))).size > 2
  );
}

/** True when a record repeats one number across the GS papers: a placeholder, not a real marksheet. */
export const isPlaceholder = (t: LeanTopper) => {
  const v = ["essay", "gs1", "gs2", "gs3", "gs4"].map((k) => n(t, k)).filter((x) => x > 0);
  return v.length >= 4 && new Set(v).size <= 2;
};

export const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

export type PaperDef = { key: string; label: string; short: string; max: number; get: (t: LeanTopper) => number };

export const PAPERS: PaperDef[] = [
  { key: "essay", label: "Essay", short: "Essay", max: 250, get: (t) => n(t, "essay") },
  { key: "gs1", label: "GS Paper I", short: "GS I", max: 250, get: (t) => n(t, "gs1") },
  { key: "gs2", label: "GS Paper II", short: "GS II", max: 250, get: (t) => n(t, "gs2") },
  { key: "gs3", label: "GS Paper III", short: "GS III", max: 250, get: (t) => n(t, "gs3") },
  { key: "gs4", label: "GS Paper IV · Ethics", short: "GS IV", max: 250, get: (t) => n(t, "gs4") },
  { key: "optional", label: "Optional · Papers I + II", short: "Optional", max: 500, get: optTotal },
  { key: "interview", label: "Personality Test", short: "Interview", max: 275, get: (t) => n(t, "interview") },
];

export type PaperStat = {
  key: string;
  label: string;
  short: string;
  max: number;
  score: number;
  median: number;
  low: number;
  high: number;
  /** 1 = highest in the pool. Ties share a position. */
  position: number;
  of: number;
  /** Share of the pool this score beats, 0–100. */
  beats: number;
};

/** One topper's papers against a pool of complete marksheets. Papers the topper has no mark for are left out. */
export function paperStats(t: LeanTopper, pool: LeanTopper[]): PaperStat[] {
  return PAPERS.flatMap((p) => {
    const score = p.get(t);
    if (score <= 0 || score > p.max) return [];
    const values = pool.map(p.get);
    if (!values.length) return [];
    const others = pool.filter((x) => x.slug !== t.slug).map(p.get);
    return [{
      key: p.key,
      label: p.label,
      short: p.short,
      max: p.max,
      score,
      median: median(values),
      low: Math.min(...values),
      high: Math.max(...values),
      position: values.filter((v) => v > score).length + 1,
      of: values.length,
      beats: others.length ? Math.round((others.filter((v) => v < score).length / others.length) * 100) : 0,
    }];
  });
}

/** Only ImageKit / http photos are real. Hash-only records have no usable photo, so we show a monogram instead of a cartoon avatar. */
export const realPhoto = (img?: string) => (img && /^https?:\/\//.test(img) ? img : null);

/** Booklet scans hosted on ImageKit, by slug prefix. Harshita Goyal's preview carries a reseller's watermark and is left out. */
export const PREVIEW_PREFIXES = ["ishita-kishore", "garima-lohia", "uma-harathi", "divya-tanwar", "ayan-jain", "shivani-ettaboyina", "vaishali-chopra"];

export const previewFor = (slug?: string) => {
  const prefix = PREVIEW_PREFIXES.find((p) => slug?.startsWith(`${p}-rank-`));
  return prefix ? `https://ik.imagekit.io/impiclabs/previews/${prefix}.png` : null;
};

export const freeCopiesOf = (t: LeanTopper) =>
  t.freeAnswerCopyUrls?.length ? t.freeAnswerCopyUrls : t.freeAnswerCopyUrl ? [t.freeAnswerCopyUrl] : [];

/**
 * Many older profiles carry a first-person "strategy" that was machine-written, not said by the topper.
 * We only show strategy text written in the third person from sources.
 */
export const isFirstPersonStrategy = (md?: string) => /(^|\n)\s*(I|I've|I'm|My)\b/.test(md ?? "");

/** Optional subject → /optional/[slug]. */
export function optionalSlug(subject?: string) {
  if (!subject) return "";
  const s = subject.toLowerCase().trim();
  const map: Record<string, string> = {
    "political science & international relations": "psir",
    "political science and international relations": "psir",
    "political science": "psir",
    psir: "psir",
    "public administration": "public-administration",
    "commerce & accountancy": "commerce-accountancy",
    commerce: "commerce-accountancy",
  };
  return map[s] ?? s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const fmt = (x: number) => x.toLocaleString("en-IN");
