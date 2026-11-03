import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { displayName, fmt, isComplete, median, n, totalOf, type LeanTopper } from "@/lib/topper-stats";
import { OgRows, ogImage } from "@/lib/og";

export const alt = "UPSC toppers by year";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseInt(year, 10);
  await connectDB();
  const toppers = (await TopperModel.find({ year: y }).select("firstName lastName rank marks").sort({ rank: 1 }).lean()) as LeanTopper[];
  const full = toppers.filter(isComplete);
  const rows: [string, string][] = [];
  if (toppers[0]) rows.push(["AIR 1", displayName(toppers[0])]);
  rows.push(["Toppers", `${toppers.length}`]);
  if (full.length) {
    rows.push(["Highest total", fmt(Math.max(...full.map(totalOf)))]);
    rows.push(["Median total", fmt(median(full.map(totalOf)))]);
    rows.push(["Median interview", `${median(full.map((t) => n(t, "interview")))}`]);
  }
  return ogImage({
    title: `UPSC ${y} toppers, [paper by paper]`,
    sub: `Marks of ${toppers.length} rank holders: essay, GS, optional and interview.`,
    art: <OgRows rows={rows} note={`UPSC CSE ${y} · published marks`} />,
  });
}
