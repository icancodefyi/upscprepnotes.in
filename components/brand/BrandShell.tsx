import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { PRODUCTS } from "@/lib/store-products";
import Nav, { type NavProduct } from "./Nav";
import Footer from "./Footer";
import AdRail from "./AdRail";
import ShellRail from "./ShellRail";
import QuizToast from "./QuizToast";
import { QUIZ_LIVE } from "@/lib/quiz/config";
import { PITCH } from "@/lib/rail";
import { brandFonts } from "./fonts";
import "./brand.css";

export type FooterData = { counts: { toppers: number }; featured: { href: string; label: string }[] };

const titleCase = (s: string) => s.trim().replace(/\b([A-Z])([A-Z]+)\b/g, (_: string, a: string, b: string) => a + b.toLowerCase());

/** Live numbers and featured toppers for the footer. Pages that already hold them can pass them in. */
export async function getFooterData(): Promise<FooterData> {
  await connectDB();
  // Names and links only: the footer must not pull whole topper documents on every page.
  const [toppers, featured] = await Promise.all([
    TopperModel.countDocuments(),
    TopperModel.find({ isFeatured: true }, { firstName: 1, lastName: 1, slug: 1, rank: 1 }).sort({ rank: 1 }).limit(10).lean() as Promise<{ firstName: string; lastName: string; slug: string }[]>,
  ]);
  return {
    counts: { toppers },
    featured: featured.map((t) => ({ href: `/upsc-topper/${t.slug}`, label: titleCase(`${t.firstName} ${t.lastName}`) })),
  };
}

/** One store link above the footer, on every page in the shell. Tracked by campaign. */
function StoreStrip() {
  return (
    <section className="px-4 py-10 text-center">
      <p>Topper answer copies, marks analysis and notes, in one store.</p>
      <a
        href="/store?utm_source=site&utm_medium=strip&utm_campaign=brand_shell"
        data-track="store-strip"
        className="btn btn-blue mt-4 inline-flex"
      >
        See the store
      </a>
    </section>
  );
}

/**
 * The frame every redesigned page sits in: brand tokens and fonts, pill nav, yellow footer.
 */
/** The store dropdown: live products from the catalogue, best seller first. */
function navProducts(): NavProduct[] {
  const lead = "answer-copies-compilation";
  return PRODUCTS.filter((p) => !p.comingSoon)
    .sort((a, b) => Number(b.slug === lead) - Number(a.slug === lead))
    .map((p) => ({ slug: p.slug, title: p.title, price: p.price, image: p.image || p.images?.[0] }));
}

export default async function BrandShell({ children, footer }: { children: React.ReactNode; footer?: FooterData }) {
  const data = footer ?? (await getFooterData());
  const keys = Object.keys(PITCH);
  const rails = Object.fromEntries(keys.map((k) => [k, <AdRail key={k} page={k} product={k} />]));
  const inlineRails = Object.fromEntries(keys.map((k) => [k, <AdRail key={k} page={k} product={k} inline />]));
  return (
    <div className={`up ${brandFonts}`}>
      <Nav products={navProducts()} toppers={data.counts.toppers} />
      <ShellRail rails={rails} inlineRails={inlineRails}>{children}</ShellRail>
      <StoreStrip />
      <Footer counts={data.counts} featured={data.featured} />
      {QUIZ_LIVE && <QuizToast />}
    </div>
  );
}
