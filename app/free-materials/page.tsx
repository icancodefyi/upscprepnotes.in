import Link from "next/link";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { PDFModel } from "@/models/pdf.model";
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
    title: "Free UPSC Study Material — UPSCPrepNotes",
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
        </section>
      </div>
    </main>
  );
}
