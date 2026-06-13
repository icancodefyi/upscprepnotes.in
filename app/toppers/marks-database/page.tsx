import Link from "next/link";
import { getAllToppersWithMarks } from "@/services/topper.service";
import MarksTable from "@/components/topper/MarksTable";

export const metadata = {
  title: "UPSC Topper Marks Database — 50+ Rank Holders' Marksheets & Scores",
  description:
    "Search and sort marks of 50+ UPSC toppers across all subjects — GS1, GS2, GS3, GS4, Essay, Optional, Written, Interview, and Total marks. Free access to every rank holder's marksheet.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers/marks-database",
  },
};

export default async function MarksDatabasePage() {
  const toppers = await getAllToppersWithMarks();

  const avgTotal = Math.round(toppers.reduce((s, t) => s + (t.marks.total || 0), 0) / toppers.filter(t => t.marks.total).length);
  const avgWritten = Math.round(toppers.reduce((s, t) => s + (t.marks.written || 0), 0) / toppers.filter(t => t.marks.written).length);
  const avgInterview = Math.round(toppers.reduce((s, t) => s + (t.marks.interview || 0), 0) / toppers.filter(t => t.marks.interview).length);

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/toppers" className="hover:text-gray-600 transition-colors">Toppers</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Marks Database</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
            UPSC Marks Database
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            UPSC Topper Marks &amp; Scores Database
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
            Complete marksheets of {toppers.length}+ UPSC rank holders — sortable by every subject. See how the toppers scored across GS papers, essay, optional, written, and interview. Free data for your UPSC prep strategy.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Toppers", value: toppers.length, sub: "rank holders" },
            { label: "Avg Total", value: avgTotal, sub: "marks" },
            { label: "Avg Written", value: avgWritten, sub: "marks" },
            { label: "Avg Interview", value: avgInterview, sub: "marks" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white border border-border/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Interactive Table */}
        <div className="rounded-2xl bg-white border border-border/50 p-4 sm:p-6">
          <MarksTable toppers={toppers} />
        </div>

        {/* SEO Text */}
        <div className="mt-12 max-w-3xl mx-auto text-sm leading-relaxed text-gray-500 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Why This Marks Data Matters for Your UPSC Prep</h2>
          <p>
            Understanding how UPSC toppers scored across individual papers is the key to building your own target score. This database gives you real marks data from actual rank holders — not hypotheticals.
          </p>
          <p>
            Look for patterns: which GS papers do top scorers dominate? How much do optional subject marks vary between ranks? What&apos;s the typical written-to-interview ratio? Use the sortable table above to find these insights.
          </p>
          <p>
            Each topper&apos;s name links to their full profile page with downloadable answer copies — so you can see not just <em>what</em> they scored but <em>how</em> they wrote their answers.
          </p>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8">
            <h3 className="text-base font-bold text-amber-900">Want All Answer Copies in One Place?</h3>
            <p className="mt-2 text-sm text-amber-700">
              Get the Complete Compilation — 50+ topper answer copies in a single PDF bundle with marks insights, handwriting analysis, and time management strategies.
            </p>
            <Link
              href="/toppers/toppers-copy-compilation"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition-colors"
            >
              Get the Complete Compilation &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
