import Link from "next/link";
import type { Metadata } from "next";
import { CA_2025 } from "@/lib/current-affairs-2025";
import YearlyTOC from "./YearlyTOC";

const totalEvents = (() => {
  let count = 0;
  for (const m of CA_2025) {
    for (const s of m.sections) {
      count += s.events.length;
    }
  }
  return count;
})();

export const metadata: Metadata = {
  title: "Current Affairs 2025 – Complete Yearly Compilation (All 12 Months) for UPSC",
  description:
    `Complete current affairs 2025 compilation for UPSC preparation covering all 12 months (January to December 2025) with ${totalEvents}+ important events across 11 sections: national news, international relations, economy, environment, science & tech, schemes, reports, awards, appointments, sports. Free PDF download.`,
  openGraph: {
    title: "Current Affairs 2025 – Complete Yearly Compilation (All 12 Months) for UPSC",
    description:
      `Complete current affairs 2025 compilation covering all 12 months with ${totalEvents}+ events across 11 sections. Free PDF download.`,
  },
  alternates: {
    canonical: "https://upscprepnotes.in/current-affairs/2025",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
    { "@type": "ListItem", position: 2, name: "Current Affairs", item: "https://upscprepnotes.in/current-affairs" },
    { "@type": "ListItem", position: 3, name: "Current Affairs 2025", item: "https://upscprepnotes.in/current-affairs/2025" },
  ],
};

export default function CurrentAffairs2025Page() {
  return (
    <main className="min-h-screen bg-[#f6f5f4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        {/* Hero */}
        <div className="max-w-3xl">
          <span className="rounded-full bg-[#dd5b00]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.125em] text-[#dd5b00]">
            Yearly Compilation
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.625px] text-[#000000e8] sm:text-4xl lg:text-5xl">
            Current Affairs 2025 — Complete Yearly Compilation
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#615d59] sm:text-base">
            A complete month-by-month compilation of major events in 2025 relevant for UPSC
            Prelims, Mains, and Interview. Covers all 12 months (January to December 2025)
            with {totalEvents}+ key events across 11 UPSC-relevant sections. Free PDF download included.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#615d59]">
            <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-[#e6e6e6]">{CA_2025.length} months</span>
            <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-[#e6e6e6]">
              {CA_2025.reduce((a, m) => a + m.sections.reduce((b, s) => b + s.events.length, 0), 0)} events
            </span>
            <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-[#e6e6e6]">11 sections per month</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/current-affairs/may-2026"
              className="inline-flex items-center gap-2 rounded-full bg-[#000000e8] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
                Latest: May 2026 →
              </Link>
              <Link
                href="/api/generate-current-affairs?month=2025"
                className="inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-6 py-2.5 text-sm font-medium text-[#615d59] transition hover:text-[#000000e8]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Link>
              <a
                href="#sections"
                className="inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-6 py-2.5 text-sm font-medium text-[#615d59] transition hover:text-[#000000e8]"
              >
                Browse by month
              </a>
          </div>
        </div>

        {/* Mobile TOC */}
        <nav className="mt-12 lg:hidden">
          <h2 className="text-xs font-semibold uppercase tracking-[0.125em] text-[#a39e98] mb-3">Jump to Month</h2>
          <div className="flex flex-wrap gap-2">
            {CA_2025.map((m) => (
              <a
                key={m.slug}
                href={`#${m.slug}`}
                className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#615d59] ring-1 ring-[#e6e6e6] transition hover:text-[#000000e8] hover:ring-[#000000e8]"
              >
                {m.month}
              </a>
            ))}
          </div>
        </nav>

        {/* Desktop: main + sidebar */}
        <div className="mt-12 flex gap-10">
          <div className="min-w-0 flex-1 space-y-32">
          {CA_2025.map((month) => (
            <section key={month.slug} id={month.slug}>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-[#e6e6e6]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000e8] text-sm font-bold text-white">
                  {month.month.split(" ")[0].slice(0, 3)}
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.625px] text-[#000000e8] sm:text-3xl">
                    {month.month}
                  </h2>
                  <p className="text-xs text-[#615d59]">
                    {month.sections.reduce((a, s) => a + s.events.length, 0)} events across 11 sections
                  </p>
                </div>
                <a
                  href={`#${month.slug}`}
                  className="ml-auto text-xs text-[#a39e98] hover:text-[#615d59] transition"
                >
                  #
                </a>
              </div>

              <div className="space-y-10">
                {month.sections.map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-base">{section.emoji}</span>
                      <h3 className="text-sm font-bold tracking-[-0.25px] text-[#000000e8]">
                        {section.title}
                      </h3>
                      <span className="text-xs text-[#a39e98]">({section.events.length} events)</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {section.events.map((event, ei) => (
                        <div
                          key={ei}
                          className="rounded-xl bg-white p-4 ring-1 ring-[#e6e6e6] transition hover:ring-[#000000e8]/10 hover:shadow-[0_0.175px_1.041px_rgba(0,0,0,0.01),0_0.8px_2.925px_rgba(0,0,0,0.02),0_2.025px_7.847px_rgba(0,0,0,0.027),0_4px_18px_rgba(0,0,0,0.04)]"
                        >
                          <div className="flex items-start gap-3">
                            <span className="shrink-0 rounded-md bg-[#f6f5f4] px-2 py-0.5 text-[10px] font-semibold tracking-tight text-[#615d59]">
                              {event.date}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-bold leading-snug text-[#000000e8]">{event.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#615d59]">{event.description}</p>
                          <Link
                            href={`/ask?q=${encodeURIComponent(`Tell me more about: ${event.title} (UPSC)`)}`}
                            className="mt-2 inline-flex text-[11px] font-medium text-[#0075de] hover:text-[#005bab] transition"
                          >
                            Ask AI →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <YearlyTOC />
      </div>

      {/* Stats Summary */}
        <section className="mt-24 rounded-xl bg-white p-8 ring-1 ring-[#e6e6e6] sm:p-10">
          <h2 className="text-lg font-bold tracking-[-0.25px] text-[#000000e8]">2025 at a Glance</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-black tracking-[-1px] text-[#000000e8]">
                {CA_2025.reduce((a, m) => a + m.sections.reduce((b, s) => b + s.events.length, 0), 0)}
              </p>
              <p className="text-xs text-[#615d59]">Total events covered</p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-[-1px] text-[#000000e8]">{CA_2025.length}</p>
              <p className="text-xs text-[#615d59]">Months (Jan–Dec 2025)</p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-[-1px] text-[#000000e8]">{CA_2025.length * 11}</p>
              <p className="text-xs text-[#615d59]">Section × month combinations</p>
            </div>
          </div>
          <Link
            href="/current-affairs/may-2026"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0075de] hover:text-[#005bab] transition"
          >
            View the latest month (May 2026) →
          </Link>
        </section>

        {/* Related Resources */}
        <section className="mt-16 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] sm:p-8">
          <h2 className="text-sm font-bold text-[#000000e8]">More UPSC Resources</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/current-affairs" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🏠</span>
              <span>Current Affairs Hub — All Editions</span>
            </Link>
            <Link href="/current-affairs/may-2026" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📖</span>
              <span>Latest: May 2026 Edition</span>
            </Link>
            <Link href="/current-affairs/download" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📥</span>
              <span>Download Current Affairs PDFs</span>
            </Link>
            <Link href="/toppers" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🏆</span>
              <span>Topper Strategies &amp; Marks</span>
            </Link>
            <Link href="/store" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📚</span>
              <span>Premium Notes &amp; Test Series</span>
            </Link>
            <Link href="/ask" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🤖</span>
              <span>Ask AI — UPSC Query Assistant</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#e6e6e6] pt-6 text-center text-xs text-[#a39e98]">
          <p>UPSCPrepNotes · Current Affairs 2025 Compilation · Download free monthly PDFs at <Link href="/current-affairs/download" className="underline underline-offset-4 decoration-[#e6e6e6] hover:decoration-[#000000e8]">/current-affairs/download</Link></p>
        </footer>
      </article>
    </main>
  );
}
