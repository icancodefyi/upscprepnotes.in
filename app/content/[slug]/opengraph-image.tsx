import { getPage } from "@/data/content/registry";
import { OgSheet, ogImage } from "@/lib/og";

export const alt = "UPSCPrepNotes guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}

/** First sentence of the description, kept short enough for two lines. */
const short = (s: string) => {
  const first = s.split(/(?<=[.?!।])\s/)[0];
  return first.length > 110 ? first.slice(0, 107).replace(/\s+\S*$/, "") + "…" : first;
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getPage(slug);
  const page = mod ? (await mod()).default : null;
  if (!page) return ogImage({ title: "UPSC [guides]", sub: "Built from real topper marks and answer copies.", art: <OgSheet /> });
  // Headline: the title before any dash, colon or bar, with the last two words highlighted.
  const head = page.title.split(/\s[—–|:-]\s|:\s/)[0].trim();
  const words = head.split(/\s+/);
  const title = words.length > 3 ? `${words.slice(0, -2).join(" ")} [${words.slice(-2).join(" ")}]` : `[${head}]`;
  return ogImage({ title, sub: short(page.description), art: <OgSheet /> });
}
