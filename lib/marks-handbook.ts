import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { isComplete, median, n, subjectOf, optionalSlug, type LeanTopper } from "@/lib/topper-stats";

/**
 * Everything behind the Topper Marks Handbook (page and PDF), computed from the marksheets in the
 * database. Nothing here is typed in by hand except the official cut-offs, which UPSC publishes
 * separately and which are listed with their source.
 */

export type HBTopper = { name: string; rank: number; year: number; optional: string; slug: string; score: number; total: number };
export type HBRecord = {
  key: PaperKey;
  label: string;
  short: string;
  max: number;
  best: number;
  holders: HBTopper[];
  top: HBTopper[];
  median: number;
  top10: number;
  /** How many marksheets crossed the "strong" line for this paper. */
  strongLine: number;
  strongCount: number;
  guide?: { href: string; label: string };
};

export type PaperKey = "essay" | "gs1" | "gs2" | "gs3" | "gs4" | "optional" | "interview" | "written" | "total";

const PAPERS: { key: PaperKey; label: string; short: string; max: number; strong: number; get: (t: LeanTopper) => number; guide?: { href: string; label: string } }[] = [
  { key: "essay", label: "Essay", short: "Essay", max: 250, strong: 140, get: (t) => n(t, "essay") },
  { key: "gs1", label: "GS Paper I", short: "GS I", max: 250, strong: 110, get: (t) => n(t, "gs1"), guide: { href: "/content/how-to-score-130-plus-in-gs1", label: "How to score 130+ in GS Paper I" } },
  { key: "gs2", label: "GS Paper II", short: "GS II", max: 250, strong: 120, get: (t) => n(t, "gs2"), guide: { href: "/content/how-to-score-120-plus-in-gs2", label: "How to score 120+ in GS Paper II" } },
  { key: "gs3", label: "GS Paper III", short: "GS III", max: 250, strong: 100, get: (t) => n(t, "gs3"), guide: { href: "/content/how-to-score-120-plus-in-gs3", label: "How to score 120+ in GS Paper III" } },
  { key: "gs4", label: "GS Paper IV (Ethics)", short: "Ethics", max: 250, strong: 130, get: (t) => n(t, "gs4"), guide: { href: "/content/how-to-score-100-plus-in-gs4", label: "How to score 100+ in Ethics" } },
  { key: "optional", label: "Optional (Papers I + II)", short: "Optional", max: 500, strong: 300, get: (t) => n(t, "optional1") + n(t, "optional2"), guide: { href: "/content/upsc-optional-subject-marks-analysis", label: "Optional subject marks analysis" } },
  { key: "interview", label: "Interview (Personality Test)", short: "Interview", max: 275, strong: 200, get: (t) => n(t, "interview") },
  { key: "written", label: "Written total (Mains)", short: "Written", max: 1750, strong: 850, get: (t) => ["essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2"].reduce((a, k) => a + n(t, k), 0) },
  { key: "total", label: "Final total", short: "Total", max: 2025, strong: 1050, get: (t) => ["essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2", "interview"].reduce((a, k) => a + n(t, k), 0) },
];

/** Optional subjects that have their own /optional/[subject] page. */
const OPTIONAL_PAGES = new Set(["psir", "public-administration", "mathematics", "sociology", "anthropology", "geography", "history", "commerce-accountancy", "philosophy"]);

/** Official General-category cut-offs, as published by UPSC with each final result (marks of the last recommended candidate). */
export const CUTOFFS: { year: number; mains: number; final: number }[] = [
  { year: 2022, mains: 748, final: 960 },
  { year: 2023, mains: 741, final: 953 },
  { year: 2024, mains: 729, final: 947 },
];

/** Some stored names run words together ("GaganSingh Meena") or carry double spaces. Display only. */
export const cleanName = (t: { firstName?: string; lastName?: string }) =>
  `${t.firstName ?? ""} ${t.lastName ?? ""}`
    .replace(/\b([A-Z])([A-Z]+)\b/g, (_, a: string, b: string) => a + b.toLowerCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

const totalOf = PAPERS.find((p) => p.key === "total")!.get;

function person(t: LeanTopper, score: number): HBTopper {
  return { name: cleanName(t), rank: t.rank ?? 0, year: t.year ?? 0, optional: subjectOf(t.optionalSubject), slug: t.slug ?? "", score, total: totalOf(t) };
}

const desc = (xs: number[]) => [...xs].sort((a, b) => b - a);
const at = (sorted: number[], share: number) => sorted[Math.max(0, Math.ceil(sorted.length * share) - 1)] ?? 0;

export type Handbook = Awaited<ReturnType<typeof buildHandbook>>;

export function buildHandbook(raw: LeanTopper[]) {
  const pool = raw.filter(isComplete);
  const years = [...new Set(pool.map((t) => t.year ?? 0))].filter(Boolean).sort();
  const perYear = years.map((y) => ({ year: y, n: pool.filter((t) => t.year === y).length }));

  const records: HBRecord[] = PAPERS.map((p) => {
    const vals = pool.map(p.get);
    const sorted = desc(vals);
    const best = sorted[0] ?? 0;
    const ranked = [...pool].sort((a, b) => p.get(b) - p.get(a) || (a.rank ?? 0) - (b.rank ?? 0));
    return {
      key: p.key,
      label: p.label,
      short: p.short,
      max: p.max,
      best,
      holders: ranked.filter((t) => p.get(t) === best).map((t) => person(t, best)),
      top: ranked.slice(0, 5).map((t) => person(t, p.get(t))),
      median: median(vals),
      top10: at(sorted, 0.1),
      strongLine: p.strong,
      strongCount: vals.filter((v) => v >= p.strong).length,
      guide: p.guide,
    };
  });
  const rec = (k: PaperKey) => records.find((r) => r.key === k)!;
  const get = (k: PaperKey) => PAPERS.find((p) => p.key === k)!.get;

  // AIR 1 of every year we hold, including years where only written + interview are published.
  const air1 = [...new Set(raw.map((t) => t.year ?? 0))].filter(Boolean).sort().map((y) => {
    const t = raw.find((x) => x.year === y && x.rank === 1);
    if (!t) return null;
    const written = n(t, "written") || get("written")(t);
    const interview = n(t, "interview");
    if (!written || !interview) return null;
    const cut = CUTOFFS.find((c) => c.year === y);
    return { year: y, name: cleanName(t), slug: t.slug ?? "", optional: subjectOf(t.optionalSubject), written, interview, total: written + interview, cutoff: cut?.final ?? null, mainsCutoff: cut?.mains ?? null };
  }).filter((x): x is NonNullable<typeof x> => !!x);

  // Rank bands
  const BANDS: [number, number, string][] = [[1, 10, "AIR 1–10"], [11, 50, "AIR 11–50"], [51, 100, "AIR 51–100"], [101, 300, "AIR 101–300"], [301, 1100, "AIR 301 and below"]];
  const bandKeys: PaperKey[] = ["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview", "written", "total"];
  const bands = BANDS.map(([a, b, label]) => {
    const g = pool.filter((t) => (t.rank ?? 0) >= a && (t.rank ?? 0) <= b);
    return { label, n: g.length, med: Object.fromEntries(bandKeys.map((k) => [k, Math.round(median(g.map(get(k))))])) as Record<PaperKey, number> };
  }).filter((b) => b.n > 0);
  const topBand = bands[0];
  const lastBand = bands[bands.length - 1];
  const gaps = (["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview"] as PaperKey[])
    .map((k) => ({ key: k, short: rec(k).short, gap: topBand.med[k] - lastBand.med[k] }))
    .sort((a, b) => b.gap - a.gap);
  const gsGap = (["gs1", "gs2", "gs3", "gs4"] as PaperKey[]).reduce((a, k) => a + topBand.med[k] - lastBand.med[k], 0);

  // Top 10 ranks: which of the five common papers was their weakest?
  const top10 = pool.filter((t) => (t.rank ?? 99) <= 10);
  const five: PaperKey[] = ["essay", "gs1", "gs2", "gs3", "gs4"];
  const weakest = top10.map((t) => five.reduce((w, k) => (get(k)(t) < get(w)(t) ? k : w), five[0]));
  const gs3Weakest = weakest.filter((k) => k === "gs3").length;

  // Everyone has a weak paper
  const top100 = pool.filter((t) => (t.rank ?? 999) <= 100);
  const top100Below100 = top100.filter((t) => (["gs1", "gs2", "gs3", "gs4"] as PaperKey[]).some((k) => get(k)(t) < 100)).length;

  // The interview swing: two marksheets with (almost) the same written marks, far apart in rank.
  let swing: null | { a: HBTopper & { written: number; interview: number }; b: HBTopper & { written: number; interview: number }; ranks: number } = null;
  const byWritten = [...pool].sort((a, b) => get("written")(b) - get("written")(a));
  for (let i = 0; i < byWritten.length; i++) {
    for (let j = i + 1; j < byWritten.length; j++) {
      const a = byWritten[i], b = byWritten[j];
      if (a.year !== b.year) continue;
      if (get("written")(a) - get("written")(b) > 3) break;
      const gap = Math.abs((a.rank ?? 0) - (b.rank ?? 0));
      if (!swing || gap > swing.ranks) {
        const [hi, lo] = (a.rank ?? 0) < (b.rank ?? 0) ? [a, b] : [b, a];
        swing = {
          ranks: gap,
          a: { ...person(hi, 0), written: get("written")(hi), interview: n(hi, "interview") },
          b: { ...person(lo, 0), written: get("written")(lo), interview: n(lo, "interview") },
        };
      }
    }
  }

  // Optional subjects with enough marksheets to say something
  const bySubject = new Map<string, LeanTopper[]>();
  for (const t of pool) {
    const s = subjectOf(t.optionalSubject);
    if (!s || /^(optional subject|0|n\/a)$/i.test(s)) continue;
    bySubject.set(s, [...(bySubject.get(s) ?? []), t]);
  }
  const optionals = [...bySubject].filter(([, g]) => g.length >= 5).map(([subject, g]) => {
    const o = get("optional");
    const top = [...g].sort((a, b) => o(b) - o(a))[0];
    const slug = optionalSlug(subject);
    return { subject, slug: OPTIONAL_PAGES.has(slug) ? slug : null, n: g.length, median: Math.round(median(g.map(o))), best: o(top), bestBy: person(top, o(top)), top100: g.filter((t) => (t.rank ?? 999) <= 100).length };
  }).sort((a, b) => b.n - a.n);

  // Target marksheets: the median topper inside a rank range
  const targetFor = (maxRank: number) => {
    const g = pool.filter((t) => (t.rank ?? 9999) <= maxRank);
    return { maxRank, n: g.length, med: Object.fromEntries(bandKeys.map((k) => [k, Math.round(median(g.map(get(k))))])) as Record<PaperKey, number> };
  };
  const targets = [targetFor(100), targetFor(1100)];

  const essay150 = pool.filter((t) => get("essay")(t) >= 150).length;
  const optional320 = pool.filter((t) => get("optional")(t) >= 320).length;
  const interviewUnder160 = pool.filter((t) => n(t, "interview") < 160).length;

  return {
    n: pool.length,
    years,
    perYear,
    yearsLabel: years.length ? `${years[0]}–${String(years[years.length - 1]).slice(2)}` : "",
    records,
    air1,
    bands,
    gaps,
    gsGap,
    top10: { n: top10.length, gs3Weakest },
    top100: { n: top100.length, below100: top100Below100 },
    swing,
    optionals,
    counts: { essay150, optional320, interviewUnder160 },
    targets,
  };
}

/** Live version for the web page. */
export async function getHandbook() {
  await connectDB();
  const raw = (await TopperModel.find({}).select("firstName lastName rank year optionalSubject slug marks").lean()) as unknown as LeanTopper[];
  return buildHandbook(raw);
}

export const HANDBOOK_PDF = "/handbook/upsc-topper-marks-handbook.pdf";
export const HANDBOOK_URL = "/toppers/highest-marks-in-upsc";
