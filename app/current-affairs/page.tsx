import Link from "next/link";
import type { Metadata } from "next";
import { MONTHS } from "@/lib/current-affairs-utils";
import BrandShell from "@/components/brand/BrandShell";
import { SponsorSlot } from "@/components/brand/AdRail";
import QuizTeaser from "@/components/quiz/QuizTeaser";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export const metadata: Metadata = {
  title: "Current Affairs for UPSC 2026 – Free Monthly & Yearly Compilations",
  description:
    "Free current affairs for UPSC preparation 2026. Monthly editions with 60 topics across 12 sections, daily quizzes, AI-powered reading, and downloadable PDFs. Yearly compilation covering 2025 events for UPSC Prelims, Mains & Interview.",
  openGraph: {
    title: "Current Affairs for UPSC – Free Monthly & Yearly Compilations",
    description:
      "Free current affairs for UPSC preparation. Monthly editions with 60 topics, daily quizzes, and AI-powered reading. Yearly compilation covering all of 2025. Downloadable PDFs included.",
  },
  alternates: {
    canonical: "https://upscprepnotes.in/current-affairs",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is covered in UPSCPrepNotes current affairs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each monthly edition covers 12 UPSC-relevant sections: National News, International Relations, Economy & Finance, Environment & Ecology, Science & Technology, Government Schemes, Important Reports, Awards & Honours, Appointments, Obituaries, Sports, and Summits & Important Days — with 5 topics per section (60 topics total). Yearly compilations cover all months with 400+ events.",
      },
    },
    {
      "@type": "Question",
      name: "Is the current affairs content free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all current affairs content on UPSCPrepNotes is completely free to read online. PDF downloads are also free. We also offer an AI-powered reading experience and daily quiz for every edition.",
      },
    },
    {
      "@type": "Question",
      name: "Which months are available for current affairs 2025?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 2025 yearly compilation covers all 12 months (January to December 2025) with over 850 events across 11 sections per month.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download current affairs as PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, every monthly edition and the yearly compilation is available as a free downloadable PDF. Visit the Current Affairs PDF download page to get your copy.",
      },
    },
    {
      "@type": "Question",
      name: "Does the current affairs include a quiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, each monthly edition includes a daily quiz feature that generates practice questions from the current affairs content. You can test your knowledge and get instant explanations.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
    { "@type": "ListItem", position: 2, name: "Current Affairs for UPSC", item: "https://upscprepnotes.in/current-affairs" },
  ],
};

export default async function CurrentAffairsHub() {
  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          {/* Hero */}
          <header className="max-w-[48rem]">
            <h1 className="t-display text-h1">Current Affairs for UPSC — Free Monthly & Yearly Compilations</h1>
            <p className="mt-2 text-s font-bold text-[var(--muted)]">Current Affairs</p>
            <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
              Free monthly and yearly current affairs compilations for UPSC preparation. Every edition covers 12 UPSC-relevant sections with 60 topics, daily quizzes, AI-powered explanations, and downloadable PDFs. Updated regularly with the latest events for Prelims, Mains & Interview.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/current-affairs/july-2026" className="btn btn-blue">
                Read July 2026 Edition →
              </Link>
              <Link href="/current-affairs/download" className="btn btn-paper">
                Download PDFs
              </Link>
            </div>
          </header>

          {/* Editions */}
          <section className="mt-14 grid gap-4 sm:grid-cols-2">
            {Object.entries(MONTHS).map(([slug, data], i) => {
              const labels: string[] = [];
              if (i === 0) labels.push("Latest");
              labels.push(`${data.sections.length} sections · ${data.sections.reduce((a, sec) => a + sec.items.length, 0)} topics`);
              labels.push("with quiz & AI");
              return (
                <Link key={slug} href={`/current-affairs/${slug}`} className={`${card} group p-6 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--ink)] text-m font-bold text-white">{data.month[0]}</span>
                    <div className="min-w-0">
                      <p className="text-m font-bold group-hover:text-[var(--accent)]">{data.month} {data.year} Edition</p>
                      <p className="text-s text-[var(--muted)]">{labels.slice(0, 2).join(" · ")}</p>
                    </div>
                    {i === 0 && <span className="ml-auto rounded-full bg-[#e3e8fb] px-2.5 py-0.5 text-s font-bold text-[#172fa3]">New</span>}
                  </div>
                  <p className="mt-4 text-s text-[var(--ink-2)]">Interactive reading · Daily quiz · PDF download</p>
                </Link>
              );
            })}
            <Link href="/current-affairs/2025" className={`${card} group p-6 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--hl)] text-m font-bold text-[var(--hl-ink)]">25</span>
                <div className="min-w-0">
                  <p className="text-m font-bold group-hover:text-[var(--accent)]">2025 Yearly Compilation</p>
                  <p className="text-s text-[var(--muted)]">12 months · ~850+ events · 11 sections per month</p>
                </div>
              </div>
              <p className="mt-4 text-s text-[var(--ink-2)]">All 12 months · Jan–Dec 2025 · Server-rendered · PDF download</p>
            </Link>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { v: "12", k: "Sections per edition" },
              { v: "60", k: "Topics per month" },
              { v: "Free", k: "Always free to read & download" },
            ].map((x) => (
              <div key={x.k} className={`${card} p-5`}>
                <p className="t-display tab text-l leading-none">{x.v}</p>
                <p className="mt-1.5 text-s text-[var(--muted)]">{x.k}</p>
              </div>
            ))}
          </section>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-14">
              {/* Editorial Intro */}
              <section>
                <h2 className="t-head text-l">Why Current Affairs Matter for UPSC</h2>
                <div className="mt-5 space-y-4 text-m leading-[1.7] text-[var(--ink-2)]">
                  <p>
                    Current affairs form the backbone of UPSC preparation. With 30-40% of Prelims questions, every Mains General Studies paper, and the entire Interview stage drawing from recent events, a structured current affairs strategy can make the difference between qualifying and ranking. Yet most aspirants struggle with information overload — reading multiple newspapers, following too many sources, and failing to connect events to the syllabus.
                  </p>
                  <p>
                    That is why we built UPSCPrepNotes current affairs differently. Each monthly edition distills thousands of news items into 60 tightly curated topics across 12 UPSC-relevant sections — National News, International Relations, Economy, Environment, Science &amp; Technology, Government Schemes, Important Reports, Awards, Appointments, Obituaries, Sports, and Summits &amp; Important Days. Every topic includes key facts, data points, and context structured for quick revision. No fluff, no filler — just what you need for Prelims, Mains, and Interview.
                  </p>
                  <p>
                    Beyond monthly compilations, we offer AI-powered explanations that break down complex events, interactive quizzes for self-assessment, and downloadable PDFs for offline study. Our 2025 yearly compilation brings together all 12 months in one place — over 850 events tagged by section for targeted revision. Whether you are preparing for the 2026 cycle or building your foundation for 2027, our current affairs coverage adapts to your pace.
                  </p>
                </div>
              </section>

              {/* FAQs */}
              <section>
                <h2 className="t-head text-l">Frequently Asked Questions</h2>
                <div className={`${card} mt-5 divide-y divide-[var(--line)]`}>
                  {[
                    { q: "What is covered in UPSCPrepNotes current affairs?", a: <>Each monthly edition covers 12 UPSC-relevant sections: National News, International Relations, Economy & Finance, Environment & Ecology, Science & Technology, Government Schemes, Important Reports, Awards & Honours, Appointments, Obituaries, Sports, and Summits & Important Days — with 5 topics per section (60 topics total). Yearly compilations cover all months with 400+ events.</> },
                    { q: "Is the current affairs content free?", a: <>Yes, all current affairs content on UPSCPrepNotes is completely free to read online. PDF downloads are also free. We also offer an AI-powered reading experience and interactive quiz for every edition.</> },
                    { q: "Can I download current affairs as PDF?", a: <>Yes, every monthly edition and the yearly compilation is available as a free downloadable PDF. Visit the <Link href="/current-affairs/download" className="font-bold text-[var(--accent)] hover:underline">Current Affairs PDF download page</Link> to get your copy.</> },
                  ].map((f, i) => (
                    <details key={f.q} open={i === 0} className="group px-6 py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-m font-bold">{f.q}</h3>
                        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                      </summary>
                      <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* Sections preview */}
              <div className={`${card} p-5`}>
                <h2 className="text-m font-bold">12 UPSC-Relevant Sections Covered Every Edition</h2>
                <ul className="mt-4 space-y-2 text-s text-[var(--ink-2)]">
                  {["National News", "International Relations", "Economy & Finance", "Environment & Ecology", "Science & Technology", "Schemes & Policies", "Important Reports", "Awards & Honours", "Appointments", "Obituaries", "Sports", "Summits & Important Days"].map((label) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Related Resources */}
              <div className={`${card} p-5`}>
                <h2 className="text-m font-bold">More Resources for UPSC Preparation</h2>
                <ul className="mt-3 space-y-1 text-s">
                  {[
                    { href: "/toppers", label: "Toppers Strategies & Marks" },
                    { href: "/store", label: "Premium Notes & Test Series" },
                    { href: "/pyq", label: "Previous Year Questions (PYQ)" },
                    { href: "/ask", label: "Ask AI — UPSC Query Assistant", track: "ai-mentor-cta" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} data-track={l.track} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                        {l.label} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a href="https://t.me/+2eV0YCTGdNcyNmFl" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-[10px] px-2 py-1.5 font-bold text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                      Join Telegram — Daily Current Affairs <span aria-hidden>↗</span>
                    </a>
                  </li>
                </ul>
              </div>
              <SponsorSlot page="current-affairs" />
            </aside>
          </div>

          {/* AI mentor */}
          <section className={`${card} mt-16 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
            <div>
              <h2 className="text-m font-bold">Connect current affairs to your syllabus</h2>
              <p className="mt-1 text-s text-[var(--ink-2)]">Ask our AI Mentor to map today&apos;s news to GS papers and PYQ themes.</p>
            </div>
            <Link href="/ask" className="btn btn-ink shrink-0 self-start sm:self-center">
              Ask AI Mentor &rarr;
            </Link>
          </section>

          <p className="mt-12 border-t border-[var(--line)] pt-6 text-center text-s text-[var(--muted)]">UPSCPrepNotes · Monthly &amp; Yearly Current Affairs for UPSC · Free PDF Downloads</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="current-affairs" />
      </div>
    </BrandShell>
  );
}
