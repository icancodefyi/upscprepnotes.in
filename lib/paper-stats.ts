import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { displayName, isComplete, median, n, subjectOf, type LeanTopper } from "@/lib/topper-stats";

/**
 * Live statistics for one paper, computed from every complete marksheet in the database.
 * Strategy guides render these instead of hand-typed numbers, so a guide can never quote a
 * score that isn't in the data.
 */

export type PaperKey = "essay" | "gs1" | "gs2" | "gs3" | "gs4" | "psir";

export const PAPER_META: Record<PaperKey, { label: string; short: string; max: number; sort: string }> = {
  essay: { label: "Essay", short: "Essay", max: 250, sort: "essay" },
  gs1: { label: "GS Paper I", short: "GS I", max: 250, sort: "gs1" },
  gs2: { label: "GS Paper II", short: "GS II", max: 250, sort: "gs2" },
  gs3: { label: "GS Paper III", short: "GS III", max: 250, sort: "gs3" },
  gs4: { label: "GS Paper IV (Ethics)", short: "GS IV", max: 250, sort: "gs4" },
  psir: { label: "PSIR optional (Papers I + II)", short: "PSIR", max: 500, sort: "opt1" },
};

export type Scorer = { slug: string; name: string; rank: number; year: number; optional: string; score: number; total: number };

export type PaperStats = {
  key: PaperKey;
  label: string;
  max: number;
  n: number;
  median: number;
  top10: number;
  top25: number;
  best: number;
  low: number;
  top: Scorer[];
  bands: { label: string; count: number }[];
  byRank: { label: string; median: number; n: number }[];
  years: string;
  /** Every score in the pool, for token counts. */
  values: number[];
};

const valueOf = (key: PaperKey) => (t: LeanTopper) => (key === "psir" ? n(t, "optional1") + n(t, "optional2") : n(t, key));

/** Score at the given top share, e.g. 0.1 = the lowest score still inside the top 10%. */
const cutoff = (desc: number[], share: number) => desc[Math.max(0, Math.ceil(desc.length * share) - 1)] ?? 0;

function bandsFor(key: PaperKey, values: number[]) {
  const edges = key === "psir" ? [300, 280, 260, 240] : [130, 120, 110, 100, 90];
  const out: { label: string; count: number }[] = [];
  let upper = Infinity;
  for (const e of edges) {
    out.push({ label: upper === Infinity ? `${e}+` : `${e}–${upper - 1}`, count: values.filter((v) => v >= e && v < upper).length });
    upper = e;
  }
  out.push({ label: `Below ${upper}`, count: values.filter((v) => v < upper).length });
  return out;
}

export async function getPaperStats(key: PaperKey): Promise<PaperStats | null> {
  await connectDB();
  const all = (await TopperModel.find({}, { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1 }).lean()) as LeanTopper[];
  const get = valueOf(key);
  const pool = all.filter(isComplete).filter((t) => key !== "psir" || subjectOf(t.optionalSubject) === "PSIR");
  if (!pool.length) return null;
  const values = pool.map(get);
  const desc = [...values].sort((a, b) => b - a);
  const years = [...new Set(pool.map((t) => t.year ?? 0))].sort();
  const band = (lo: number, hi: number, label: string) => {
    const xs = pool.filter((t) => (t.rank ?? 0) >= lo && (t.rank ?? 0) <= hi).map(get);
    return { label, median: median(xs), n: xs.length };
  };
  return {
    key,
    label: PAPER_META[key].label,
    max: PAPER_META[key].max,
    n: pool.length,
    median: median(values),
    top10: cutoff(desc, 0.1),
    top25: cutoff(desc, 0.25),
    best: desc[0],
    low: desc[desc.length - 1],
    top: [...pool]
      .sort((a, b) => get(b) - get(a) || (a.rank ?? 0) - (b.rank ?? 0))
      .slice(0, 10)
      .map((t) => ({
        slug: t.slug ?? "",
        name: displayName(t),
        rank: t.rank ?? 0,
        year: t.year ?? 0,
        optional: subjectOf(t.optionalSubject),
        score: get(t),
        total: n(t, "written") + n(t, "interview"),
      })),
    bands: bandsFor(key, values),
    byRank: [band(1, 100, "AIR 1–100"), band(101, 300, "AIR 101–300"), band(301, 600, "AIR 301–600"), band(601, 2000, "AIR 601+")].filter((b) => b.n >= 5),
    years: years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]),
    values,
  };
}

/**
 * Fills {{median}}, {{top10}}, {{top25}}, {{best}}, {{low}}, {{n}}, {{years}}, {{bestName}},
 * {{atLeast:120}} and {{share:120}} in guide text with live values.
 */
/** Site-wide facts any guide can quote: {{profiles}}, {{marksheets}}, {{compPrice}}, {{compSheets}}, {{compPapers}}, {{compHref}}. */
export type SiteFacts = { profiles: number; marksheets: number; compPrice: number | null; compSheets: string; compPapers: string; compHref: string };

export async function getSiteFacts(): Promise<SiteFacts> {
  await connectDB();
  const { PRODUCTS } = await import("@/lib/store-products");
  const all = (await TopperModel.find({}, { marks: 1 }).lean()) as LeanTopper[];
  const comp = PRODUCTS.find((p) => p.slug === "answer-copies-compilation" && !p.comingSoon);
  const spec = (label: string) => comp?.specs?.find((x) => x.label === label)?.value ?? "";
  return { profiles: all.length, marksheets: all.filter(isComplete).length, compPrice: comp?.price ?? null, compSheets: spec("Answer Sheets"), compPapers: spec("Papers Covered"), compHref: comp ? `/store/${comp.slug}` : "/store" };
}

export function fillTokens(text: string, s: PaperStats | null, site?: SiteFacts) {
  const values = s?.values ?? [];
  const top = s?.top[0];
  return text.replace(/\{\{(\w+)(?::(\d+))?\}\}/g, (m, k: string, arg?: string) => {
    const x = Number(arg);
    if (site) {
      if (k === "profiles") return String(site.profiles);
      if (k === "marksheets") return String(site.marksheets);
      if (k === "compPrice") return site.compPrice ? `₹${site.compPrice}` : "";
      if (k === "compSheets") return site.compSheets;
      if (k === "compPapers") return site.compPapers;
      if (k === "compHref") return site.compHref;
    }
    if (!s) return m;
    switch (k) {
      case "median": return String(s.median);
      case "top10": return String(s.top10);
      case "top25": return String(s.top25);
      case "best": return String(s.best);
      case "low": return String(s.low);
      case "n": return String(s.n);
      case "years": return s.years;
      case "bestName": return top ? `${top.name} (AIR ${top.rank}, CSE ${top.year})` : "";
      case "atLeast": return String(values.filter((v) => v >= x).length);
      case "share": return `${Math.round((values.filter((v) => v >= x).length / values.length) * 100)}%`;
      default: return m;
    }
  });
}

/** One row per optional with enough complete marksheets to compare. */
export type OptionalRow = { subject: string; slug: string; n: number; optMedian: number; optBest: number; bestName: string; totalMedian: number; gsMedian: number };
export type OptionalStats = { rows: OptionalRow[]; subjects: number; marksheets: number; corr: number; minN: number };

export async function getOptionalStats(minN = 5): Promise<OptionalStats> {
  await connectDB();
  const { optionalSlug, totalOf } = await import("@/lib/topper-stats");
  const all = (await TopperModel.find({}, { firstName: 1, lastName: 1, rank: 1, year: 1, optionalSubject: 1, marks: 1 }).lean()) as LeanTopper[];
  const full = all.filter(isComplete);
  const opt = (t: LeanTopper) => n(t, "optional1") + n(t, "optional2");
  const gs = (t: LeanTopper) => n(t, "gs1") + n(t, "gs2") + n(t, "gs3") + n(t, "gs4");
  const groups = new Map<string, LeanTopper[]>();
  for (const t of full) {
    const s = subjectOf(t.optionalSubject);
    if (s) groups.set(s, [...(groups.get(s) ?? []), t]);
  }
  const rows = [...groups]
    .filter(([, ts]) => ts.length >= minN)
    .map(([subject, ts]) => {
      const best = [...ts].sort((a, b) => opt(b) - opt(a))[0];
      return {
        subject,
        slug: optionalSlug(subject),
        n: ts.length,
        optMedian: median(ts.map(opt)),
        optBest: opt(best),
        bestName: `${displayName(best)} (AIR ${best.rank}, ${best.year})`,
        totalMedian: median(ts.map(totalOf)),
        gsMedian: median(ts.map(gs)),
      };
    })
    .sort((a, b) => b.optMedian - a.optMedian);
  // Pearson correlation between GS total and optional total across every complete marksheet.
  const xs = full.map(gs);
  const ys = full.map(opt);
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const mx = mean(xs);
  const my = mean(ys);
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const corr = cov / Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return { rows, subjects: groups.size, marksheets: full.length, corr: Math.round(corr * 100) / 100, minN };
}

/** Fills {{optHighest}}, {{optLowest}}, {{optMostChosen}}, {{optSubjects}}, {{optCompared}}, {{gsOptCorr}}, {{optMinN}}. */
export function fillOptionalTokens(text: string, o: OptionalStats | null) {
  if (!o || !o.rows.length) return text;
  const hi = o.rows[0];
  const lo = o.rows[o.rows.length - 1];
  const most = [...o.rows].sort((a, b) => b.n - a.n)[0];
  const map: Record<string, string> = {
    optHighest: `${hi.subject} (median ${hi.optMedian}/500, ${hi.n} toppers)`,
    optLowest: `${lo.subject} (median ${lo.optMedian}/500, ${lo.n} toppers)`,
    optMostChosen: `${most.subject} (${most.n} toppers)`,
    optSubjects: String(o.subjects),
    optCompared: String(o.rows.length),
    gsOptCorr: o.corr.toFixed(2),
    optMinN: String(o.minN),
  };
  return text.replace(/\{\{(opt\w+|gsOptCorr)\}\}/g, (m, k: string) => map[k] ?? m);
}
