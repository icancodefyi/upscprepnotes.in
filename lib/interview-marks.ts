import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { median, n, subjectOf, type LeanTopper } from "@/lib/topper-stats";
import { cleanName } from "@/lib/marks-handbook";

/**
 * Interview (Personality Test) marks of rank holders, computed from the marksheets in the database.
 * Used by the free interview-marks page and the Interview Pack PDF.
 *
 * The pool is wider than the handbook's "complete marksheet" pool: a record counts here when its
 * interview mark is valid (1–275) and it has a rank and year. Comparisons that need written marks
 * use only records whose written total is plausible (600–1,200).
 */

export type IVTopper = { name: string; slug: string; rank: number; year: number; optional: string; interview: number; written: number | null; total: number | null };

const WRITTEN_KEYS = ["essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2"];

function writtenOf(t: LeanTopper): number | null {
  const stored = n(t, "written");
  if (stored >= 600 && stored <= 1200) return stored;
  const parts = WRITTEN_KEYS.map((k) => n(t, k));
  if (parts.every((p) => p > 0 && p <= 250)) {
    const sum = parts.reduce((a, b) => a + b, 0);
    if (sum >= 600 && sum <= 1200) return sum;
  }
  return null;
}

const pct = (sorted: number[], p: number) => sorted[Math.round(p * (sorted.length - 1))];

function corr(a: number[], b: number[]) {
  const ma = a.reduce((x, y) => x + y, 0) / a.length;
  const mb = b.reduce((x, y) => x + y, 0) / b.length;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
}

export const IV_BANDS = [
  { label: "AIR 1–10", lo: 1, hi: 10 },
  { label: "AIR 11–50", lo: 11, hi: 50 },
  { label: "AIR 51–100", lo: 51, hi: 100 },
  { label: "AIR 101–300", lo: 101, hi: 300 },
  { label: "AIR 301–600", lo: 301, hi: 600 },
  { label: "AIR 601 and below", lo: 601, hi: 5000 },
];

export function buildInterview(raw: LeanTopper[]) {
  const pool: IVTopper[] = raw
    .filter((t) => n(t, "interview") > 0 && n(t, "interview") <= 275 && (t.rank ?? 0) > 0 && (t.year ?? 0) > 2000)
    .map((t) => {
      const written = writtenOf(t);
      return {
        name: cleanName(t),
        slug: t.slug ?? "",
        rank: t.rank!,
        year: t.year!,
        optional: /^optional subject$/i.test(subjectOf(t.optionalSubject)) ? "" : subjectOf(t.optionalSubject),
        interview: n(t, "interview"),
        written,
        total: written ? written + n(t, "interview") : null,
      };
    });

  const scores = pool.map((t) => t.interview).sort((a, b) => a - b);
  const byScore = [...pool].sort((a, b) => b.interview - a.interview || a.rank - b.rank);
  const best = byScore[0].interview;

  const years = [...new Set(pool.map((t) => t.year))].sort();
  const perYear = years.map((year) => {
    const s = pool.filter((t) => t.year === year).map((t) => t.interview);
    return { year, n: s.length, median: median(s), best: Math.max(...s), lowest: Math.min(...s) };
  });

  const bands = IV_BANDS.map((b) => {
    const s = pool.filter((t) => t.rank >= b.lo && t.rank <= b.hi).map((t) => t.interview).sort((x, y) => x - y);
    return { label: b.label, n: s.length, median: s.length ? median(s) : 0, p10: s.length ? pct(s, 0.1) : 0, p90: s.length ? pct(s, 0.9) : 0 };
  }).filter((b) => b.n > 0);

  // 10-mark buckets for a distribution chart.
  const lo = Math.floor(scores[0] / 10) * 10;
  const hi = Math.floor(scores[scores.length - 1] / 10) * 10;
  const buckets: { from: number; count: number }[] = [];
  for (let f = lo; f <= hi; f += 10) buckets.push({ from: f, count: scores.filter((s) => s >= f && s < f + 10).length });

  const withWritten = pool.filter((t) => t.written !== null);
  const correlation = corr(withWritten.map((t) => t.written!), withWritten.map((t) => t.interview));

  // Pairs from the same year with near-identical written marks and very different interviews.
  const pairs: { a: IVTopper; b: IVTopper; gap: number; ranks: number }[] = [];
  const used = new Set<string>();
  const candidates: { a: IVTopper; b: IVTopper; gap: number }[] = [];
  for (const a of withWritten)
    for (const b of withWritten)
      if (a !== b && a.year === b.year && Math.abs(a.written! - b.written!) <= 3 && a.interview - b.interview >= 45)
        candidates.push({ a, b, gap: a.interview - b.interview });
  candidates.sort((x, y) => y.gap - x.gap);
  for (const c of candidates) {
    if (used.has(c.a.slug) || used.has(c.b.slug)) continue;
    used.add(c.a.slug); used.add(c.b.slug);
    pairs.push({ ...c, ranks: c.b.rank - c.a.rank });
    if (pairs.length === 4) break;
  }

  // Very strong written, weak interview: proof that Mains marks do not carry the interview.
  const strongWrittenWeakIv = withWritten
    .filter((t) => t.written! >= 830 && t.interview <= 150)
    .sort((a, b) => b.written! - a.written!)
    .slice(0, 4);

  const optionals = Object.entries(
    pool.reduce<Record<string, number[]>>((acc, t) => {
      if (t.optional) (acc[t.optional] ||= []).push(t.interview);
      return acc;
    }, {}),
  )
    .filter(([, s]) => s.length >= 8)
    .map(([subject, s]) => ({ subject, n: s.length, median: median(s), best: Math.max(...s) }))
    .sort((a, b) => b.n - a.n);

  const share = median(withWritten.map((t) => (t.interview / (t.written! + t.interview)) * 100));

  return {
    n: pool.length,
    years,
    yearsLabel: `${years[0]}–${String(years[years.length - 1]).slice(-2)}`,
    perYear,
    median: median(scores),
    p10: pct(scores, 0.1),
    p90: pct(scores, 0.9),
    best,
    bestHolders: byScore.filter((t) => t.interview === best),
    lowest: scores[0],
    lowestHolders: byScore.filter((t) => t.interview === scores[0]),
    top: byScore.slice(0, 12),
    bottom: [...byScore].reverse().slice(0, 6),
    count200: scores.filter((s) => s >= 200).length,
    countUnder160: scores.filter((s) => s < 160).length,
    countUnder150: scores.filter((s) => s < 150).length,
    top100: (() => {
      const t = pool.filter((x) => x.rank <= 100);
      return { n: t.length, lowest: Math.min(...t.map((x) => x.interview)), under170: t.filter((x) => x.interview < 170).length };
    })(),
    bands,
    buckets,
    correlation,
    pairs,
    strongWrittenWeakIv,
    optionals,
    share: Math.round(share * 10) / 10,
  };
}

export type InterviewData = ReturnType<typeof buildInterview>;

export async function getInterviewData() {
  await connectDB();
  const raw = (await TopperModel.find({}).select("firstName lastName rank year optionalSubject slug marks").lean()) as unknown as LeanTopper[];
  return buildInterview(raw);
}

export const INTERVIEW_URL = "/toppers/upsc-interview-marks";
export const INTERVIEW_PACK_SLUG = "upsc-interview-pack";
