import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import BrandShell from "@/components/brand/BrandShell";
import { CATEGORY, getCollections } from "@/lib/materials";
import Library from "./_components/Library";

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

/** Original category copy. */
const CATEGORIES = [
  { key: "test-series", label: "Test Series", description: "Vision IAS, Forum IAS, Insights IAS, Shankar IAS, and more — full-length prelims & mains test papers with solutions." },
  { key: "notes", label: "Notes & Material", description: "Handwritten and compiled notes by top educators — Drishti IAS, MK Yadav, Forum IAS Ethics, Sriram IAS Economy, and more." },
  { key: "books", label: "Books", description: "Standard UPSC reference books — Manorama Yearbook, PMF IAS Environment, Oxford Atlas, Arihant Essays, and more." },
  { key: "magazines", label: "Magazines", description: "Monthly magazine compilations — Yojana, Kurukshetra, Insights Prime, Vision IAS Monthly, Pratiyogita Darpan." },
  { key: "current-affairs", label: "Current Affairs", description: "Daily current affairs compilations, yearly compilations, and monthly current affairs PDFs in Hindi & English." },
  { key: "optional", label: "Optional Subjects", description: "Subject-specific materials for Sociology, PSIR, Anthropology, Geography, Mathematics, Philosophy, and more." },
];

export default async function FreeMaterialsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const collections = await getCollections();
  const active = category && CATEGORY[category] ? category : null;
  const activeCategory = active ? CATEGORIES.find((c) => c.key === active) : null;

  const totalResources = collections.reduce((s, c) => s + c.files, 0);
  const downloads = collections.reduce((s, c) => s + c.requests, 0);
  const popular = [...collections].sort((a, b) => b.requests - a.requests).filter((c) => c.requests > 0).slice(0, 3);
  const categories = CATEGORIES.map((cat) => ({ ...cat, count: collections.filter((c) => c.category === cat.key).reduce((s, c) => s + c.files, 0) }));

  return (
    <BrandShell>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Free Study Material", href: "/free-materials" }]} />
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Free Study Material</span>
          </nav>

          {/* HERO */}
          <header className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-[40rem]">
              <h1 className="t-display text-h1">Free UPSC Study Material</h1>
              <p className="mt-2 text-s font-bold text-[var(--muted)]">Free Resource Library</p>
              <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
                Download free UPSC study material curated from top coaching institutes. Test series, notes, books, magazines — all in one place.
                <span className="mt-1 block text-s text-[var(--muted)]">{`${totalResources.toLocaleString()} individual resources available`}</span>
              </p>
            </div>
            {popular.length > 0 && (
              <div className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)] lg:w-[340px]">
                <p className="text-m font-bold">Most downloaded</p>
                <ol className="mt-3 space-y-1">
                  {popular.map((c, i) => (
                    <li key={c.slug}>
                      <Link href={`/free-materials/${c.slug}`} data-track="free-materials-popular" className="group flex items-center gap-3 rounded-[12px] px-2 py-2 hover:bg-[var(--canvas)]">
                        <span className="t-display tab w-5 text-m text-[var(--accent)]">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-s font-bold group-hover:text-[var(--accent)]">{c.title}</span>
                          <span className="block text-s text-[var(--muted)]">{`${fmt(c.requests)} downloads`}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 border-t border-[var(--line)] pt-3 text-s text-[var(--muted)]">{`${fmt(downloads)} downloads so far.`}</p>
              </div>
            )}
          </header>

          {/* CATEGORIES */}
          <section className="mt-12">
            {activeCategory ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/free-materials" data-track="free-materials-back-categories" className="text-s font-bold text-[var(--muted)] hover:text-[var(--ink)]">
                  &larr; All Categories
                </Link>
                <span aria-hidden className="text-[var(--line-2)]">/</span>
                <span className="text-m font-bold">{activeCategory.label}</span>
                <span className="rounded-full bg-[var(--canvas)] px-2.5 py-0.5 text-s text-[var(--ink-2)]">{`${collections.filter((c) => c.category === active).length} PDFs`}</span>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const tone = CATEGORY[cat.key] ?? CATEGORY.other;
                  return (
                    <Link
                      key={cat.key}
                      href={`/free-materials?category=${cat.key}`}
                      data-track={`free-materials-category-${cat.key}`}
                      className="group rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span aria-hidden className="h-8 w-11 rounded-[8px]" style={{ background: tone.tone, boxShadow: `inset 0 0 0 1px ${tone.ink}22` }} />
                        <span className="text-s font-bold" style={{ color: tone.ink }}>{`${cat.count} items`}</span>
                      </div>
                      <h2 className="mt-4 text-m font-bold group-hover:text-[var(--accent)]">{cat.label}</h2>
                      <p className="mt-2 text-s leading-[1.6] text-[var(--ink-2)]">{cat.description}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* PDF LIST */}
          <section className="mt-14">
            <h2 className="t-head text-l">{activeCategory ? activeCategory.label : "All Materials"}</h2>
            <div className="mt-5">
              <Library collections={collections} active={active} />
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 rounded-[28px] bg-[var(--ink)] p-8 text-center text-white sm:p-12">
            <h2 className="t-head text-l">Want Actual Topper Answer Copies Too?</h2>
            <p className="mx-auto mt-3 max-w-md text-m leading-[1.6] text-white/70">
              The ₹799 compilation includes 50+ verified topper answer copies plus 21 strategy guides.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/store" data-track="pdf-hub-cta" className="btn btn-blue">
                Browse Store &rarr;
              </Link>
              <Link href="/toppers" data-track="pdf-hub-toppers" className="btn bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] hover:bg-white/15">
                Browse Topper Profiles &rarr;
              </Link>
              <a href="https://t.me/+2eV0YCTGdNcyNmFl" target="_blank" rel="noopener noreferrer" className="btn bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] hover:bg-white/15">
                Join Telegram — Daily Current Affairs
              </a>
            </div>
          </section>

          <section className="mx-auto mt-16 max-w-3xl text-center">
            <h2 className="text-m font-bold">Can&apos;t find what you need?</h2>
            <p className="mt-2 text-s text-[var(--ink-2)]">Ask our AI Mentor to recommend the best free resources for your current preparation stage.</p>
            <Link href="/ask" data-track="ai-mentor-cta" className="btn btn-ink mt-5">
              Ask AI Mentor &rarr;
            </Link>
          </section>
        </div>
      </div>
    </BrandShell>
  );
}
