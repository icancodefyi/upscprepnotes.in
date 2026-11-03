import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { median, n, optTotal, type LeanTopper } from "@/lib/topper-stats";
import { OgRows, OgSheet, ogImage } from "@/lib/og";

export const alt = "UPSC optional subject marks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}

/** Kept in step with SUBJECT_DATA in page.tsx: the name used to match toppers, and the short name for the headline. */
const SUBJECTS: Record<string, [string, string]> = {
  psir: ["Political Science & International Relations", "PSIR"],
  "public-administration": ["Public Administration", "Public Administration"],
  mathematics: ["Mathematics", "Mathematics"],
  sociology: ["Sociology", "Sociology"],
  anthropology: ["Anthropology", "Anthropology"],
  geography: ["Geography", "Geography"],
  history: ["History", "History"],
  "commerce-accountancy": ["Commerce & Accountancy", "Commerce"],
  philosophy: ["Philosophy", "Philosophy"],
};
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function Image({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const s = SUBJECTS[subject.toLowerCase()];
  if (!s) return ogImage({ title: "UPSC optional [marks]", sub: "Optional subject marks of UPSC toppers.", art: <OgSheet /> });
  const [full, short] = s;
  await connectDB();
  const match = subject === "psir" ? /psir|political science/i : new RegExp(esc(full), "i");
  const toppers = (await TopperModel.find({ optionalSubject: match }).select("rank marks").lean()) as LeanTopper[];
  const scored = toppers.filter((t) => n(t, "optional1") > 0 && n(t, "optional2") > 0 && optTotal(t) <= 500);
  const rows: [string, string][] = [["Toppers", `${toppers.length}`]];
  if (scored.length) {
    rows.push(["Highest", `${Math.max(...scored.map(optTotal))} / 500`]);
    rows.push(["Median", `${median(scored.map(optTotal))} / 500`]);
  }
  const best = toppers.map((t) => t.rank ?? 0).filter((r) => r > 0);
  if (best.length) rows.push(["Best rank", `AIR ${Math.min(...best)}`]);
  return ogImage({
    title: `${short} optional: [topper marks]`,
    sub: `What ${toppers.length} UPSC toppers scored in ${short}, with booklists and strategy.`,
    art: <OgRows rows={rows} note="Paper I + Paper II · published marks" />,
  });
}
