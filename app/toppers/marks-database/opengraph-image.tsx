import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { fmt, isComplete, median, n, totalOf, type LeanTopper } from "@/lib/topper-stats";
import { OgRows, ogImage } from "@/lib/og";

export const alt = "UPSC topper marks database";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image() {
  await connectDB();
  const all = (await TopperModel.find({}).select("marks").lean()) as LeanTopper[];
  const full = all.filter(isComplete);
  const med = (k: string) => `${median(full.map((t) => n(t, k)))}`;
  return ogImage({
    title: "UPSC topper [marks database]",
    sub: `Essay, GS1–4, optional and interview marks of ${all.length} rank holders, searchable.`,
    art: (
      <OgRows
        rows={[
          ["Median essay", `${med("essay")} / 250`],
          ["Median GS2", `${med("gs2")} / 250`],
          ["Median interview", `${med("interview")} / 275`],
          ["Median total", `${fmt(median(full.map(totalOf)))} / 2,025`],
        ]}
        note={`${full.length} complete marksheets`}
      />
    ),
  });
}
