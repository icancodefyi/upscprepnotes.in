import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { topperImageSrc } from "@/lib/utils";
import BrandShell from "@/components/brand/BrandShell";
import { card } from "@/components/brand/ui";
import MarksDB, { type Row } from "./_components/MarksDB";

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

type Raw = { firstName?: string; lastName?: string; rank?: number; year?: number; optionalSubject?: string; slug?: string; ProfileImage?: string; marks?: Record<string, number | undefined> };

/** Every topper, as stored, sorted by rank: the same rows the original table showed. */
async function load(): Promise<Row[]> {
  await connectDB();
  const toppers = (await TopperModel.find({}).select("firstName lastName rank year optionalSubject slug marks ProfileImage").sort({ rank: 1 }).lean()) as Raw[];
  return toppers.map((t) => {
    const m = t.marks ?? {};
    const v = (k: string) => m[k] || 0;
    return {
      slug: t.slug ?? "",
      name: `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim(),
      rank: t.rank ?? 0,
      year: t.year ?? 0,
      optional: t.optionalSubject || "",
      avatar: topperImageSrc({ slug: t.slug, ProfileImage: t.ProfileImage, firstName: t.firstName ?? "", lastName: t.lastName ?? "" }),
      full: true,
      essay: v("essay"),
      gs1: v("gs1"),
      gs2: v("gs2"),
      gs3: v("gs3"),
      gs4: v("gs4"),
      opt1: v("optional1"),
      opt2: v("optional2"),
      written: v("written"),
      interview: v("interview"),
      total: v("total"),
    };
  });
}

export default async function MarksDatabasePage() {
  const toppers = await load();

  const avg = (k: "total" | "written" | "interview") => {
    const xs = toppers.filter((t) => t[k]);
    return Math.round(toppers.reduce((s, t) => s + (t[k] || 0), 0) / xs.length);
  };
  const avgTotal = avg("total");
  const avgWritten = avg("written");
  const avgInterview = avg("interview");

  const years = [...new Set(toppers.map((t) => t.year).filter(Boolean))].sort((a, b) => b - a);
  const optCounts = new Map<string, number>();
  for (const t of toppers) if (t.optional) optCounts.set(t.optional, (optCounts.get(t.optional) ?? 0) + 1);
  const optionals = [...optCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <BrandShell>
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Marks Database</span>
          </nav>

          {/* Hero */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="t-display text-h1">UPSC Topper Marks &amp; Scores Database</h1>
              <p className="mt-2 text-s font-bold text-[var(--muted)]">UPSC Marks Database</p>
              <p className="mt-4 max-w-[46rem] text-m leading-[1.6] text-[var(--ink-2)]">
                Complete marksheets of {toppers.length}+ UPSC rank holders — sortable by every subject. See how the toppers scored across GS papers, essay, optional, written, and interview. Free data for your UPSC prep strategy.
              </p>
            </div>

            {/* Stats Summary */}
            <dl className={`${card} grid grid-cols-2 divide-[var(--line)] sm:grid-cols-4 sm:divide-x lg:w-[520px]`}>
              {[
                { label: "Toppers", value: toppers.length, sub: "rank holders" },
                { label: "Avg Total", value: avgTotal, sub: "marks" },
                { label: "Avg Written", value: avgWritten, sub: "marks" },
                { label: "Avg Interview", value: avgInterview, sub: "marks" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-4">
                  <dd className="t-display tab text-l leading-none">{s.value.toLocaleString()}</dd>
                  <dt className="mt-1.5 text-s text-[var(--muted)]">{`${s.label} · ${s.sub}`}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Interactive Table */}
          <div className="mt-10">
            <MarksDB rows={toppers} years={years} optionals={optionals} />
          </div>

          {/* SEO Text */}
          <div className="mx-auto mt-16 max-w-[46rem] space-y-4">
            <Link href="/toppers/highest-marks-in-upsc" data-track="marksdb-highest-marks" className={`${card} group mb-8 flex flex-col gap-1 p-6 sm:p-7`}>
              <span className="text-m font-bold group-hover:text-[var(--accent)]">Highest marks in UPSC, paper by paper &rarr;</span>
              <span className="text-s leading-[1.55] text-[var(--ink-2)]">The record in every paper, what a typical topper scores, AIR 1 against the cut-off, and a free PDF handbook of all of it.</span>
            </Link>
            <h2 className="t-head text-l">Why This Marks Data Matters for Your UPSC Prep</h2>
            <p className="text-m leading-[1.7] text-[var(--ink-2)]">
              Understanding how UPSC toppers scored across individual papers is the key to building your own target score. This database gives you real marks data from actual rank holders — not hypotheticals.
            </p>
            <p className="text-m leading-[1.7] text-[var(--ink-2)]">
              Look for patterns: which GS papers do top scorers dominate? How much do optional subject marks vary between ranks? What&apos;s the typical written-to-interview ratio? Use the sortable table above to find these insights.
            </p>
            <p className="text-m leading-[1.7] text-[var(--ink-2)]">
              Each topper&apos;s name links to their full profile page with downloadable answer copies — so you can see not just <em>what</em> they scored but <em>how</em> they wrote their answers.
            </p>

            <div className={`${card} mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
              <div>
                <h3 className="text-m font-bold">Want All Answer Copies in One Place?</h3>
                <p className="mt-1 text-s leading-[1.5] text-[var(--ink-2)]">
                  Get the Complete Compilation — 50+ topper answer copies in a single PDF bundle with marks insights, handwriting analysis, and time management strategies.
                </p>
              </div>
              <Link href="/store" className="btn btn-blue h-11 shrink-0 self-start px-5 [--btn-fs:14px] sm:self-center">
                Browse Store &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
