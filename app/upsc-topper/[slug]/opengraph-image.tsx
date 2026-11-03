import { getTopperBySlug } from "@/services/topper.service";
import { displayName, fmt, isPlaceholder, n, subjectOf, totalOf, type LeanTopper } from "@/lib/topper-stats";
import { OgRows, OgSheet, ogImage } from "@/lib/og";

export const alt = "UPSC topper marksheet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
/** Drawn on the first request for each topper, then cached. Nothing is built ahead of time. */
export async function generateStaticParams() {
  return [];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = (await getTopperBySlug(slug)) as LeanTopper | null;
  if (!t) return ogImage({ title: "UPSC topper [marksheets]", sub: "Real answer copies and marksheets of 290 UPSC toppers, CSE 2022–2025.", art: <OgSheet /> });

  const name = displayName(t);
  const opt = subjectOf(t.optionalSubject);
  const total = totalOf(t);
  const hasMarks = total > 0 && !isPlaceholder(t);
  const rows: [string, string][] = [["Rank", `AIR ${t.rank}`]];
  if (hasMarks) {
    if (n(t, "written") > 0) rows.push(["Written", `${fmt(n(t, "written"))} / 1,750`]);
    if (n(t, "interview") > 0) rows.push(["Interview", `${n(t, "interview")} / 275`]);
    rows.push(["Total", `${fmt(total)} / 2,025`]);
    const o = n(t, "optional1") + n(t, "optional2");
    if (o > 0) rows.push([opt ? `${opt.length > 16 ? "Optional" : opt}` : "Optional", `${o} / 500`]);
  } else {
    if (t.year) rows.push(["Exam", `CSE ${t.year}`]);
    if (opt) rows.push(["Optional", opt.length > 14 ? opt.slice(0, 13) + "…" : opt]);
  }

  return ogImage({
    title: `${name}, [AIR\u00a0${t.rank}]`,
    sub: `UPSC ${t.year} marksheet, answer copy${opt ? ` and ${opt} optional` : ""}, paper by paper.`,
    art: <OgRows rows={rows} note={`UPSC CSE ${t.year} · published marks`} />,
  });
}
