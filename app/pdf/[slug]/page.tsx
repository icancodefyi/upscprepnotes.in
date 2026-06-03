import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { PDFModel } from "@/models/pdf.model";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const pdf = await PDFModel.findOne({ slug }).lean();
  if (!pdf) return { title: "PDF Not Found" };
  const p = pdf as any;
  return {
    title: `${p.title} — Free PDF Download | UPSCPrepNotes`,
    description: p.description || `Download ${p.title} free PDF. ${p.brand ? `${p.brand} — ` : ""}UPSC study material for Prelims and Mains preparation.`,
    alternates: { canonical: `https://upscprepnotes.in/pdf/${slug}` },
    openGraph: {
      title: `${p.title} — Free PDF Download`,
      description: p.description,
      url: `https://upscprepnotes.in/pdf/${slug}`,
    },
  };
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  "test-series": { label: "Test Series", icon: "📝" },
  "notes": { label: "Notes & Material", icon: "📓" },
  "books": { label: "Books", icon: "📚" },
  "magazines": { label: "Magazines", icon: "📰" },
  "current-affairs": { label: "Current Affairs", icon: "📰" },
  "optional": { label: "Optional Subjects", icon: "🎯" },
  "other": { label: "Resources", icon: "📄" },
};

export default async function PDFDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const doc = await PDFModel.findOne({ slug }).lean();
  if (!doc) notFound();

  const p = doc as any;
  const cat = CATEGORY_META[p.category] || CATEGORY_META.other;
  const downloadUrl = p.imagekitUrl || "#";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
        {/* BREADCRUMB */}
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-800 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/pdf" className="hover:text-zinc-800 transition-colors">PDF Library</Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">{p.title}</span>
        </nav>

        {/* HEADER */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{cat.icon}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              {cat.label}
            </span>
            {p.brand && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {p.brand}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {p.title}
          </h1>
          {p.description && (
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
              {p.description}
            </p>
          )}
          {p.fileSize && (
            <p className="mt-2 text-sm text-zinc-400">
              File size: {p.fileSize} {p.pageCount ? `· ${p.pageCount} pages` : ""}
            </p>
          )}
        </section>

        {/* DOWNLOAD SECTION */}
        <section className="mb-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white border border-zinc-200 shrink-0">
              <span className="text-3xl">{cat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-zinc-800">Download Free PDF</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Click the button to download {p.title} instantly.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 rounded-full bg-zinc-900 px-8 text-sm font-bold text-white hover:bg-zinc-800 shadow-lg"
            >
              <a
                href={downloadUrl}
                download
                data-track={`pdf-download-${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF &rarr;
              </a>
            </Button>
          </div>
        </section>

        {/* BUNDLE UPSELL */}
        <section className="mb-16 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 shrink-0">
              <span className="text-3xl">⭐</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-emerald-900">Want More? Get the Complete Bundle</h2>
              <p className="mt-1 text-sm text-emerald-700">
                50+ verified topper answer copies + 21 strategy guides + interview prep + ethics case studies — all at ₹799.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 rounded-full bg-emerald-600 px-8 text-sm font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/25"
            >
              <Link href="/toppers/toppers-copy-compilation" data-track={`pdf-upsell-${p.slug}`}>
                Get Bundle ₹799 &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* RELATED PDFs — same category */}
        <PDFRelated category={p.category} currentSlug={p.slug} currentTitle={p.title} />
      </div>
    </main>
  );
}

async function PDFRelated({
  category,
  currentSlug,
  currentTitle,
}: {
  category: string;
  currentSlug: string;
  currentTitle: string;
}) {
  await connectDB();
  const related = await PDFModel.find({
    category,
    slug: { $ne: currentSlug },
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  if (related.length === 0) return null;

  return (
    <section className="border-t border-zinc-100 pt-12">
      <h2 className="text-lg font-bold text-zinc-800 mb-6">More {CATEGORY_META[category]?.label || "Resources"}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((r: any) => (
          <Link
            key={r._id}
            href={`/pdf/${r.slug}`}
            className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <h3 className="text-sm font-semibold text-zinc-800 group-hover:text-black transition-colors truncate">
              {r.title}
            </h3>
            {r.brand && (
              <p className="mt-0.5 text-xs text-zinc-400">{r.brand}</p>
            )}
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{r.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
