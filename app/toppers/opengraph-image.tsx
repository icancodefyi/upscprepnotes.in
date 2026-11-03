import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { OgSheet, ogImage } from "@/lib/og";

export const alt = "UPSC toppers: marksheets and answer copies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image() {
  await connectDB();
  const count = await TopperModel.countDocuments();
  return ogImage({
    title: `${count} UPSC toppers, [paper by paper]`,
    sub: "Marksheets, answer copies and optionals of rank holders, CSE 2022–2025.",
    art: <OgSheet mark="137" out="/250" caption="Ishita Kishore · AIR 1" />,
  });
}
