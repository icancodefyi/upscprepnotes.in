import Link from "next/link";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { PDFModel } from "@/models/pdf.model";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import FreeMaterialsSearch from "@/components/FreeMaterialsSearch";

interface SearchParams {
  category?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
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

const CATEGORIES = [
  {
    key: "test-series",
    label: "Test Series",
    description: "Vision IAS, Forum IAS, Insights IAS, Shankar IAS, and more — full-length prelims & mains test papers with solutions.",
    icon: "📝",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
  },
  {
    key: "notes",
    label: "Notes & Material",
    description: "Handwritten and compiled notes by top educators — Drishti IAS, MK Yadav, Forum IAS Ethics, Sriram IAS Economy, and more.",
    icon: "📓",
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-700",
  },
  {
    key: "books",
    label: "Books",
    description: "Standard UPSC reference books — Manorama Yearbook, PMF IAS Environment, Oxford Atlas, Arihant Essays, and more.",
    icon: "📚",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-700",
  },
  {
    key: "magazines",
    label: "Magazines",
    description: "Monthly magazine compilations — Yojana, Kurukshetra, Insights Prime, Vision IAS Monthly, Pratiyogita Darpan.",
    icon: "📰",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-700",
  },
  {
    key: "current-affairs",
    label: "Current Affairs",
    description: "Daily current affairs compilations, yearly compilations, and monthly current affairs PDFs in Hindi & English.",
    icon: "📰",
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-700",
  },
  {
    key: "optional",
    label: "Optional Subjects",
    description: "Subject-specific materials for Sociology, PSIR, Anthropology, Geography, Mathematics, Philosophy, and more.",
    icon: "🎯",
    color: "bg-indigo-50 border-indigo-200",
    textColor: "text-indigo-700",
  },
];

export default async function PDFHubPage({ searchParams }: Props) {
  const { category } = await searchParams;
  await connectDB();

  const filter = category ? { category } : {};
  const pdfs = await PDFModel.find(filter).sort({ createdAt: -1 }).lean();
  const totalResources = pdfs.reduce((sum: number, p: any) => sum + (p.resources?.length || 1), 0);

  const categories = CATEGORIES.map((cat) => {
    const catPdfs = pdfs.filter((p: any) => p.category === cat.key);
    const itemCount = catPdfs.reduce((sum: number, p: any) => sum + Math.max(p.resources?.length || 0, 1), 0);
    return { ...cat, count: itemCount };
  });

  const activeCategory = category ? CATEGORIES.find((c) => c.key === category) : null;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Free Study Material", href: "/free-materials" },
        ]}
      />
      <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
        {/* HERO */}
        <section className="mb-16">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Free Resource Library
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Free UPSC Study Material
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
            Download free UPSC study material curated from top coaching institutes.
            Test series, notes, books, magazines — all in one place.
            <span className="block mt-1 text-sm text-zinc-400">{totalResources.toLocaleString()} individual resources available</span>
          </p>
        </section>

        {/* CATEGORIES GRID */}
        <section className="mb-20">
          {activeCategory && (
            <div className="mb-8 flex items-center gap-3">
              <Link
                href="/free-materials"
                data-track="free-materials-back-categories"
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                &larr; All Categories
              </Link>
              <span className="text-zinc-200">/</span>
              <span className="text-sm font-bold text-zinc-800">
                {activeCategory.icon} {activeCategory.label}
              </span>
              <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
                {pdfs.length} PDFs
              </span>
            </div>
          )}
          {!activeCategory && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/free-materials?category=${cat.key}`}
                  data-track={`free-materials-category-${cat.key}`}
                  className={`group rounded-xl border ${cat.color} p-6 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className={`text-xs font-semibold ${cat.textColor}`}>
                      {cat.count} items
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-800 mb-2 group-hover:text-black transition-colors">
                    {cat.label}
                  </h2>
                  <p className="text-sm leading-6 text-zinc-500">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* PDF LIST */}
        {pdfs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {activeCategory ? `${activeCategory.label}` : "All Materials"}
              </p>
            </div>
            <FreeMaterialsSearch pdfs={pdfs} />
          </section>
        )}

        {/* CTA */}
        <section className="mt-20 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Want Actual Topper Answer Copies Too?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
            The ₹799 compilation includes 50+ verified topper answer copies plus 21 strategy guides.
          </p>
          <Link
            href="/store"
            data-track="pdf-hub-cta"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
          >
            Browse Store &rarr;
          </Link>
          <Link
            href="/toppers"
            data-track="pdf-hub-toppers"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-2.5 text-xs font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white sm:mt-4"
          >
            Browse Topper Profiles &rarr;
          </Link>
          <a
            href="https://t.me/+VYMxrig-a8AzZmNl"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#0088cc]/40 bg-[#0088cc]/10 px-6 py-2.5 text-xs font-bold text-[#66c4ff] transition hover:bg-[#0088cc]/20 sm:mt-4"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram — Daily Current Affairs
          </a>
        </section>
      </div>
      <section className="py-12 bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-3xl text-center px-4">
        <h2 className="text-lg font-semibold text-zinc-800">Can't find what you need?</h2>
        <p className="mt-2 text-sm text-zinc-500">Ask our AI Mentor to recommend the best free resources for your current preparation stage.</p>
        <Link href="/ask" data-track="ai-mentor-cta" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800">
          Ask AI Mentor &rarr;
        </Link>
      </div>
    </section>
    </main>
    </>
  );
}
