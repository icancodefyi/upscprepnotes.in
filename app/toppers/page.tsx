import Link from "next/link";
import { getAllToppersList } from "@/services/topper.service";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { topperImageSrc } from "@/lib/utils";
import BrandShell from "@/components/brand/BrandShell";
import ToppersSearch from "./ToppersSearch";

export const metadata = {
  title: "UPSC Toppers List — Search All Rank Holders by Name, Rank, Year & Optional Subject",
  description:
    "Browse and search 280+ UPSC toppers. Search by name, rank, year, or optional subject. Access marks breakdowns, answer copies, and preparation strategies for every topper.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers",
  },
  openGraph: {
    title: "UPSC Toppers List — Search All Rank Holders",
    description:
      "Browse and search 280+ UPSC toppers by name, rank, year, or optional subject. Access marks breakdowns, answer copies, and strategies.",
    url: "https://upscprepnotes.in/toppers",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export default async function ToppersPage() {
  const list = await getAllToppersList();
  // Photos for the cards (real photo where we have one, the same avatar the profile uses otherwise).
  await connectDB();
  const photos = new Map(
    ((await TopperModel.find({}, { slug: 1, ProfileImage: 1 }).lean()) as unknown as { slug: string; ProfileImage?: string }[]).map((t) => [t.slug, t.ProfileImage]),
  );
  const toppers = list.map((t) => ({ ...t, avatar: topperImageSrc({ ...t, ProfileImage: photos.get(t.slug) }) }));

  return (
    <BrandShell>
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Toppers</span>
          </nav>

          <header className="mt-8 max-w-[44rem]">
            <h1 className="t-display text-h1">Browse All UPSC Toppers</h1>
            <p className="mt-4 text-m leading-[1.6] text-[var(--ink-2)]">
              Search {toppers.length}+ rank holders by name, rank, year, or optional subject. View marks, answer copies, and preparation strategies.
            </p>
          </header>

          <div className="mt-10">
            <ToppersSearch toppers={toppers} />
          </div>

          {/* Free Materials CTA */}
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <div className={`${card} flex flex-col p-6 sm:p-7`}>
              <h2 className="text-m font-bold">Free UPSC Study Material</h2>
              <p className="mt-1 flex-1 text-s leading-[1.55] text-[var(--ink-2)]">
                2,700+ resources from top coaching institutes — test series, notes, books, magazines. All free to download.
              </p>
              <Link href="/free-materials" data-track="toppers-free-materials-cta" className="btn btn-blue mt-5 self-start [--btn-fs:14px]">
                Browse Free Materials &rarr;
              </Link>
            </div>
            <Link href="/toppers/marks-database" data-track="toppers-marks-database" className={`${card} group flex flex-col p-6 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5 sm:p-7`}>
              <h2 className="text-m font-bold group-hover:text-[var(--accent)]">UPSC Topper Marks Database</h2>
              <p className="mt-1 flex-1 text-s leading-[1.55] text-[var(--ink-2)]">
                Sortable marksheets for 50+ rank holders — compare GS papers, optional scores, interview marks, and totals.
              </p>
              <span aria-hidden className="mt-5 text-m text-[var(--accent)] transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
