import Link from "next/link";
import type { Metadata } from "next";
import BrandShell from "@/components/brand/BrandShell";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export const metadata: Metadata = {
  title: "Current Affairs PDF – Free Monthly & Yearly Download for UPSC",
  description:
    "Download free current affairs PDF for UPSC preparation. Monthly editions (July 2026) with 60 topics across 12 sections. Yearly compilation (2025) with 400+ events. Free PDF downloads for UPSC Prelims, Mains & Interview.",
  openGraph: {
    title: "Current Affairs PDF – Free Monthly & Yearly Download for UPSC",
    description:
      "Download free current affairs PDF for UPSC. Monthly editions with 60 topics. Yearly compilation 2025 with 400+ events. Free PDF downloads.",
  },
  alternates: {
    canonical: "https://upscprepnotes.in/current-affairs/download",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
    { "@type": "ListItem", position: 2, name: "Current Affairs", item: "https://upscprepnotes.in/current-affairs" },
    { "@type": "ListItem", position: 3, name: "Current Affairs PDF Download", item: "https://upscprepnotes.in/current-affairs/download" },
  ],
};

const editions = [
  { month: "July 2026", slug: "july-2026", label: "July 2026 Edition", desc: "Latest edition — 12 sections, 60 topics, with quiz" },
  { month: "May 2026", slug: "may-2026", label: "May 2026 Edition", desc: "11 sections, 55 topics, with quiz" },
  { month: "2025 Yearly", slug: "2025", label: "2025 Yearly Compilation", desc: "12 months (Jan–Dec) — ~850+ events across 11 sections" },
];

export default async function CurrentAffairsDownloadPage() {
  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/current-affairs" className="hover:text-[var(--ink)]">Current Affairs</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">Free Download</span>
        </nav>
        <h1 className="t-display mt-8 text-h1">Current Affairs PDF – Monthly & Yearly Editions</h1>
        <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
          Download free current affairs PDFs for UPSC preparation. Each monthly edition covers 12 sections — National News, International Relations, Economy, Environment, Science & Tech, Schemes, Reports, Awards, Appointments, Obituaries, Sports, and Summits & Important Days — with 5 topics per section. The yearly compilation covers all 12 months of 2025 with ~850+ key events.
        </p>

        <div className="mt-10 space-y-3">
          {editions.map((ed) => (
            <div key={ed.slug} className={`${card} flex items-center justify-between gap-4 p-5`}>
              <div>
                <p className="text-m font-bold">{ed.label}</p>
                <p className="text-s text-[var(--muted)]">{ed.desc}</p>
              </div>
              <Link href={`/api/generate-current-affairs?month=${ed.slug}`} className="btn btn-blue h-10 shrink-0 px-4 [--btn-fs:14px]">
                Download PDF ↓
              </Link>
            </div>
          ))}
        </div>

        <div className={`${card} mt-10 p-6`}>
          <h2 className="text-m font-bold">What&apos;s inside each edition</h2>
          <ul className="mt-4 grid gap-2 text-s text-[var(--ink-2)] sm:grid-cols-2">
            {["National News", "International Relations", "Economy & Finance", "Environment & Ecology", "Science & Technology", "Government Schemes", "Important Reports", "Awards & Honours", "Appointments", "Obituaries", "Sports", "Summits & Important Days"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Related Resources */}
        <div className={`${card} mt-6 p-6`}>
          <h2 className="text-m font-bold">More UPSC Resources</h2>
          <div className="mt-4 grid gap-2 text-s sm:grid-cols-2">
            {[
              { href: "/current-affairs", label: "Current Affairs Hub — All Editions" },
              { href: "/current-affairs/july-2026", label: "Read July 2026 Edition Online" },
              { href: "/store", label: "Premium Notes & Test Series" },
              { href: "/toppers", label: "Topper Strategies & Marks" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-[12px] bg-[var(--canvas)] px-4 py-3 text-[var(--ink-2)] hover:text-[var(--ink)]">
                {l.label} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/current-affairs" className="text-s font-bold text-[var(--accent)] hover:underline">
            ← Read online instead
          </Link>
        </div>
      </div>
    </BrandShell>
  );
}
