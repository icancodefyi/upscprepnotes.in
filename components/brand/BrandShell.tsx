import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { getFeaturedToppers } from "@/services/topper.service";
import Nav from "./Nav";
import Footer from "./Footer";
import { brandFonts } from "./fonts";
import "./brand.css";

export type FooterData = { counts: { toppers: number }; featured: { href: string; label: string }[] };

const titleCase = (s: string) => s.trim().replace(/\b([A-Z])([A-Z]+)\b/g, (_: string, a: string, b: string) => a + b.toLowerCase());

/** Live numbers and featured toppers for the footer. Pages that already hold them can pass them in. */
export async function getFooterData(): Promise<FooterData> {
  await connectDB();
  const [toppers, featured] = await Promise.all([TopperModel.countDocuments(), getFeaturedToppers()]);
  return {
    counts: { toppers },
    featured: featured.map((t) => ({ href: `/upsc-topper/${t.slug}`, label: titleCase(`${t.firstName} ${t.lastName}`) })),
  };
}

/**
 * The frame every redesigned page sits in: brand tokens and fonts, pill nav, yellow footer.
 */
export default async function BrandShell({ children, footer }: { children: React.ReactNode; footer?: FooterData }) {
  const data = footer ?? (await getFooterData());
  return (
    <div className={`up ${brandFonts}`}>
      <Nav />
      <main>{children}</main>
      <Footer counts={data.counts} featured={data.featured} />
    </div>
  );
}
