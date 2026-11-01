import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import BrandShell from "@/components/brand/BrandShell";
import { CATEGORY, getCollections } from "@/lib/materials";
import Library from "./_components/Library";
import { connectDB } from "@/lib/mongodb";
import { PYQModel } from "@/models/pyq.model";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export const metadata: Metadata = {
  title: "Free UPSC Study Material — Test Series, Notes, Books & Magazines",
  description:
    "Download free UPSC study material PDFs including test series from Vision IAS, Forum IAS, Insights IAS, notes by MK Yadav, Drishti IAS, and more. Updated daily.",
  alternates: { canonical: "https://upscprepnotes.in/free-materials" },
  openGraph: {
    title: "Free UPSC Study Material — Test Series, Notes, Books & Magazines",
    description: "Download free UPSC study material: test series, coaching notes, books, magazines, and current affairs compilations.",
    url: "https://upscprepnotes.in/free-materials",
  },
};

const fmt = (n: number) => n.toLocaleString("en-IN");

export default async function FreeMaterialsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const collections = await getCollections();
  await connectDB();
  const pyqs = await PYQModel.countDocuments();
  const active = category && CATEGORY[category] ? category : null;

  const files = collections.reduce((s, c) => s + c.files, 0);
  const downloads = collections.reduce((s, c) => s + c.requests, 0);
  const popular = [...collections].sort((a, b) => b.requests - a.requests).filter((c) => c.requests > 0).slice(0, 3);
  const publishers = new Set(collections.map((c) => c.brand).filter(Boolean)).size;

  return (
    <BrandShell>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Free Study Material", href: "/free-materials" }]} />
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Free study material</span>
          </nav>

          <header className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-[40rem]">
              <h1 className="t-display text-h1">
                Free UPSC study material, <span className="swipe">in one shelf.</span>
              </h1>
              <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
                {`${fmt(files)} PDFs in ${collections.length} collections from ${publishers} publishers: test series, notes, books, magazines and current affairs. Free to download; we only ask for an email once per collection.`}
              </p>
            </div>
            {popular.length > 0 && (
              <div className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)] lg:w-[340px]">
                <p className="t-meta">MOST DOWNLOADED</p>
                <ol className="mt-3 space-y-1">
                  {popular.map((c, i) => (
                    <li key={c.slug}>
                      <Link href={`/free-materials/${c.slug}`} data-track="free-materials-popular" className="group flex items-center gap-3 rounded-[12px] px-2 py-2 hover:bg-[var(--canvas)]">
                        <span className="t-display tab w-5 text-m text-[var(--accent)]">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-s font-bold group-hover:text-[var(--accent)]">{c.title}</span>
                          <span className="block text-s text-[var(--muted)]">{`${fmt(c.requests)} downloads · ${fmt(c.files)} ${c.files === 1 ? "file" : "files"}`}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 border-t border-[var(--line)] pt-3 text-s text-[var(--muted)]">{`${fmt(downloads)} downloads so far, counted by unique email.`}</p>
              </div>
            )}
          </header>

          <div className="mt-12">
            <Library collections={collections} active={active} />
          </div>

          {/* Cross-links: what this audience reads next */}
          <div className="mt-20 grid gap-4 md:grid-cols-3">
            <Link href="/toppers/toppers-copy-compilation" className="group rounded-[24px] bg-[var(--accent)] p-6 text-white shadow-[0_12px_30px_-16px_rgba(31,63,214,0.7)] md:col-span-2">
              <p className="t-head text-l">Coaching notes tell you what to study. Topper copies show how it was written.</p>
              <p className="mt-2 text-m text-white/75">Real handwritten Mains answer booklets from rank holders, free to read.</p>
              <span className="btn mt-5 bg-white text-[var(--accent)] group-hover:bg-white/90">
                Read topper answer copies <span className="knob bg-[var(--accent-soft)]">↗</span>
              </span>
            </Link>
            <Link href="/pyq" className="group flex flex-col justify-between rounded-[24px] bg-[#FFE45C] p-6">
              <p className="t-display tab text-l leading-none">{fmt(pyqs)}</p>
              <p className="mt-4 text-m font-bold">UPSC Mains previous year questions, by year and paper →</p>
            </Link>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
