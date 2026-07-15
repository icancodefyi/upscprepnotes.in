import Link from "next/link";
import { getAllToppersWithMarks } from "@/services/topper.service";
import MarksTable from "@/components/topper/MarksTable";

export const metadata = {
  title: "UPSC Topper Marks Database — Optional, GS1-4, Essay & Interview Scores",
  description:
    "Search and sort marks of 50+ UPSC toppers across all subjects — GS1, GS2, GS3, GS4, Essay, Optional (PSIR, Sociology, Anthropology, etc.), Written, Interview, and Total marks. Free access to every rank holder's marksheet.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers/marks-database",
  },
  openGraph: {
    title: "UPSC Topper Marks Database — Optional, GS1-4 & Interview Scores",
    description:
      "Search and sort marks of 50+ UPSC toppers across GS1-4, Essay, Optional, Written, Interview, and Total. Free access to every rank holder's marksheet.",
    url: "https://upscprepnotes.in/toppers/marks-database",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

export default async function MarksDatabasePage() {
  const toppers = await getAllToppersWithMarks();

  const avgTotal = Math.round(toppers.reduce((s, t) => s + (t.marks.total || 0), 0) / toppers.filter(t => t.marks.total).length);
  const avgWritten = Math.round(toppers.reduce((s, t) => s + (t.marks.written || 0), 0) / toppers.filter(t => t.marks.written).length);
  const avgInterview = Math.round(toppers.reduce((s, t) => s + (t.marks.interview || 0), 0) / toppers.filter(t => t.marks.interview).length);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-muted-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/toppers" className="hover:text-muted-foreground transition-colors">Toppers</Link>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">Marks Database</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            UPSC Marks Database
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            UPSC Topper Marks &amp; Scores Database
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
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
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-foreground">{s.value.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Interactive Table */}
        <div className="rounded-2xl bg-white border border-border/50 p-4 sm:p-6">
          <MarksTable toppers={toppers} />
        </div>

        {/* SEO Text */}
        <div className="mt-12 max-w-3xl mx-auto text-sm leading-relaxed text-muted-foreground space-y-4">
          <h2 className="text-lg font-bold text-foreground">Why This Marks Data Matters for Your UPSC Prep</h2>
          <p>
            Understanding how UPSC toppers scored across individual papers is the key to building your own target score. This database gives you real marks data from actual rank holders — not hypotheticals.
          </p>
          <p>
            Look for patterns: which GS papers do top scorers dominate? How much do optional subject marks vary between ranks? What&apos;s the typical written-to-interview ratio? Use the sortable table above to find these insights.
          </p>
          <p>
            Each topper&apos;s name links to their full profile page with downloadable answer copies — so you can see not just <em>what</em> they scored but <em>how</em> they wrote their answers.
          </p>

          <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-muted p-6 sm:p-8">
            <h3 className="text-base font-bold text-foreground">Want All Answer Copies in One Place?</h3>
            <p className="mt-2 text-sm text-brand">
              Get the Complete Compilation — 50+ topper answer copies in a single PDF bundle with marks insights, handwriting analysis, and time management strategies.
            </p>
            <Link
              href="/store"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand transition-colors"
            >
              Browse Store &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
