import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current Affairs PDF – Free Monthly & Yearly Download for UPSC",
  description:
    "Download free current affairs PDF for UPSC preparation. Monthly editions (May 2026) with 55 topics across 11 sections. Yearly compilation (2025) with 400+ events. Free PDF downloads for UPSC Prelims, Mains & Interview.",
  openGraph: {
    title: "Current Affairs PDF – Free Monthly & Yearly Download for UPSC",
    description:
      "Download free current affairs PDF for UPSC. Monthly editions with 55 topics. Yearly compilation 2025 with 400+ events. Free PDF downloads.",
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
  { month: "May 2026", slug: "may-2026", label: "May 2026 Edition", desc: "Latest edition — 11 sections, 55 topics, with quiz" },
  { month: "2025 Yearly", slug: "2025", label: "2025 Yearly Compilation", desc: "12 months (Jan–Dec) — ~850+ events across 11 sections" },
];

export default function CurrentAffairsDownloadPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <span className="rounded-full bg-[#1aae39]/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.125em] text-[#1aae39]">
          Free Download
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.625px] text-[#000000e8] sm:text-4xl">
          Current Affairs PDF – Monthly & Yearly Editions
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#615d59]">
          Download free current affairs PDFs for UPSC preparation. Each monthly edition covers 11 sections —
          National News, International Relations, Economy, Environment, Science & Tech, Schemes, Reports,
          Awards, Appointments, Obituaries, and Sports — with 5 topics per section. The yearly compilation
          covers all 12 months of 2025 with ~850+ key events.
        </p>

        <div className="mt-10 space-y-4">
          {editions.map((ed) => (
            <div
              key={ed.slug}
              className="flex items-center justify-between rounded-xl bg-white p-5 ring-1 ring-[#e6e6e6]"
            >
              <div>
                <p className="text-sm font-bold text-[#000000e8]">{ed.label}</p>
                <p className="text-xs text-[#615d59]">{ed.desc}</p>
              </div>
              <Link
                href={`/api/generate-current-affairs?month=${ed.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#000000e8] px-5 py-2 text-xs font-semibold text-white transition hover:opacity-90"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6]">
          <h2 className="text-sm font-bold text-[#000000e8]">What&apos;s inside each edition</h2>
          <ul className="mt-4 grid gap-2 text-sm text-[#615d59] sm:grid-cols-2">
            {[
              "🇮🇳 National News",
              "🌐 International Relations",
              "💰 Economy & Finance",
              "🌿 Environment & Ecology",
              "🔬 Science & Technology",
              "📋 Government Schemes",
              "📊 Important Reports",
              "🏆 Awards & Honours",
              "👤 Appointments",
              "🕊️ Obituaries",
              "🏏 Sports",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#e6e6e6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Related Resources */}
        <div className="mt-12 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6]">
          <h2 className="text-sm font-bold text-[#000000e8]">More UPSC Resources</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/current-affairs" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🏠</span>
              <span>Current Affairs Hub — All Editions</span>
            </Link>
            <Link href="/current-affairs/may-2026" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📖</span>
              <span>Read May 2026 Edition Online</span>
            </Link>
            <Link href="/store" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📚</span>
              <span>Premium Notes &amp; Test Series</span>
            </Link>
            <Link href="/toppers" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🏆</span>
              <span>Topper Strategies &amp; Marks</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/current-affairs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0075de] hover:text-[#005bab] transition"
          >
            ← Read online instead
          </Link>
        </div>
      </div>
    </main>
  );
}
