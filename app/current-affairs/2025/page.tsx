import Link from "next/link";
import type { Metadata } from "next";
import { CA_2025 } from "@/lib/current-affairs-2025";
import AskLink from "@/components/AskLink";
import YearlyTOC from "./YearlyTOC";
import BrandShell from "@/components/brand/BrandShell";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

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

export default async function CurrentAffairs2025Page() {
  const events = CA_2025.reduce((a, m) => a + m.sections.reduce((b, sec) => b + sec.events.length, 0), 0);
  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className="mx-auto max-w-[1180px] px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/current-affairs" className="hover:text-[var(--ink)]">Current Affairs</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">2025</span>
        </nav>

        {/* Hero */}
        <header className="mt-8 max-w-[48rem]">
          <h1 className="t-display text-h1">Current Affairs 2025 — Complete Yearly Compilation</h1>
          <p className="mt-2 text-s font-bold text-[var(--muted)]">Yearly Compilation</p>
          <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
            A complete month-by-month compilation of major events in 2025 relevant for UPSC Prelims, Mains, and Interview. Covers all 12 months (January to December 2025) with {totalEvents}+ key events across 11 UPSC-relevant sections. Free PDF download included.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-s text-[var(--ink-2)]">
            <span className="rounded-full bg-white px-3 py-1 shadow-[0_0_0_1px_var(--line-2)]">{CA_2025.length} months</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-[0_0_0_1px_var(--line-2)]">{events} events</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-[0_0_0_1px_var(--line-2)]">11 sections per month</span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/current-affairs/july-2026" className="btn btn-blue">
              Latest: July 2026 →
            </Link>
            <Link href="/api/generate-current-affairs?month=2025" className="btn btn-paper">
              Download PDF <span className="knob">↓</span>
            </Link>
            <a href="#sections" className="btn btn-paper">
              Browse by month
            </a>
          </div>
        </header>

        {/* Mobile TOC */}
        <nav className="mt-12 lg:hidden">
          <h2 className="text-m font-bold">Jump to Month</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CA_2025.map((m) => (
              <a key={m.slug} href={`#${m.slug}`} className="rounded-full bg-white px-3.5 py-1.5 text-s text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]">
                {m.month}
              </a>
            ))}
          </div>
        </nav>

        {/* Main + sidebar */}
        <div id="sections" className="mt-14 flex gap-12">
          <div className="min-w-0 flex-1 space-y-24">
            {CA_2025.map((month) => (
              <section key={month.slug} id={month.slug} className="scroll-mt-28">
                <div className="flex items-center gap-4 border-b border-[var(--line)] pb-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--ink)] text-s font-bold text-white">{month.month.split(" ")[0].slice(0, 3)}</span>
                  <div>
                    <h2 className="t-head text-l">{month.month}</h2>
                    <p className="text-s text-[var(--muted)]">{month.sections.reduce((a, sec) => a + sec.events.length, 0)} events across 11 sections</p>
                  </div>
                  <a href={`#${month.slug}`} aria-label={`Link to ${month.month}`} className="ml-auto text-s text-[var(--muted)] hover:text-[var(--accent)]">#</a>
                </div>

                <div className="mt-8 space-y-10">
                  {month.sections.map((section) => (
                    <div key={section.title}>
                      <div className="flex items-baseline gap-2">
                        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                        <h3 className="text-m font-bold">{section.title}</h3>
                        <span className="text-s text-[var(--muted)]">({section.events.length} events)</span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {section.events.map((event, ei) => (
                          <div key={ei} className={`${card} p-4`}>
                            <span className="tab inline-block rounded-[6px] bg-[var(--canvas)] px-2 py-0.5 text-s text-[var(--ink-2)]">{event.date}</span>
                            <p className="mt-2 text-m font-bold leading-snug">{event.title}</p>
                            <p className="mt-1 text-s leading-[1.55] text-[var(--ink-2)]">{event.description}</p>
                            <AskLink query={`Tell me more about: ${event.title} (UPSC)`} className="mt-2 inline-flex text-s font-bold text-[var(--accent)] hover:underline">
                              Ask AI →
                            </AskLink>
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
        <section className={`${card} mt-24 p-8 sm:p-10`}>
          <h2 className="t-head text-l">2025 at a Glance</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { v: events, k: "Total events covered" },
              { v: CA_2025.length, k: "Months (Jan–Dec 2025)" },
              { v: CA_2025.length * 11, k: "Section × month combinations" },
            ].map((x) => (
              <div key={x.k}>
                <p className="t-display tab text-l leading-none">{x.v}</p>
                <p className="mt-1.5 text-s text-[var(--muted)]">{x.k}</p>
              </div>
            ))}
          </div>
          <Link href="/current-affairs/july-2026" className="mt-6 inline-block text-s font-bold text-[var(--accent)] hover:underline">
            View the latest month (July 2026) →
          </Link>
        </section>

        {/* Related Resources */}
        <section className={`${card} mt-8 p-6 sm:p-8`}>
          <h2 className="text-m font-bold">More UPSC Resources</h2>
          <div className="mt-4 grid gap-2 text-s sm:grid-cols-2">
            {[
              { href: "/current-affairs", label: "Current Affairs Hub — All Editions" },
              { href: "/current-affairs/july-2026", label: "Latest: July 2026 Edition" },
              { href: "/current-affairs/download", label: "Download Current Affairs PDFs" },
              { href: "/toppers", label: "Topper Strategies & Marks" },
              { href: "/store", label: "Premium Notes & Test Series" },
              { href: "/ask", label: "Ask AI — UPSC Query Assistant" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-[12px] bg-[var(--canvas)] px-4 py-3 text-[var(--ink-2)] hover:text-[var(--ink)]">
                {l.label} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-12 border-t border-[var(--line)] pt-6 text-center text-s text-[var(--muted)]">
          UPSCPrepNotes · Current Affairs 2025 Compilation · Download free monthly PDFs at{" "}
          <Link href="/current-affairs/download" className="underline underline-offset-4 hover:text-[var(--accent)]">/current-affairs/download</Link>
        </p>
      </article>
    </BrandShell>
  );
}
