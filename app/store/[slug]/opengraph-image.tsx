import { getProductBySlug } from "@/lib/store-products";
import { OgCover, OgSheet, ogImage, ogSrc } from "@/lib/og";

export const alt = "UPSCPrepNotes store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return ogImage({ title: "Everything a topper used, [in one place.]", sub: "Answer copies, strategy reports and notes, delivered instantly.", art: <OgSheet /> });
  const words = p.title.split(" ");
  const title = words.length > 2 ? `${words.slice(0, -2).join(" ")} [${words.slice(-2).join(" ")}]` : `[${p.title}]`;
  return ogImage({
    title,
    sub: p.tagline || p.description.slice(0, 90),
    art: p.image ? <OgCover src={await ogSrc(p.image)} price={`₹${p.price}`} /> : <OgSheet />,
  });
}
