import type { Metadata } from "next";
import Link from "next/link";
import CurrentAffairsClient from "./CurrentAffairsClient";
import { MAY_2026 } from "@/lib/current-affairs-content";

export const metadata: Metadata = {
  title: "Current Affairs May 2026 – Latest Monthly Current Affairs for UPSC",
  description:
    "Current affairs May 2026 for UPSC preparation. Latest edition with 55 topics across 11 sections covering national news, international relations, economy, environment, science & tech, schemes, awards, sports. Includes interactive quiz, AI explanations, and free PDF download. Updated daily.",
  openGraph: {
    title: "Current Affairs May 2026 – Latest Monthly Current Affairs for UPSC",
    description:
      "Current affairs May 2026 with 55 topics across 11 sections, interactive quiz, AI explanations, and free PDF download for UPSC preparation.",
  },
  alternates: {
    canonical: "https://upscprepnotes.in/current-affairs/may-2026",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
    { "@type": "ListItem", position: 2, name: "Current Affairs", item: "https://upscprepnotes.in/current-affairs" },
    { "@type": "ListItem", position: 3, name: "Current Affairs May 2026", item: "https://upscprepnotes.in/current-affairs/may-2026" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is covered in the May 2026 current affairs edition?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The May 2026 current affairs edition covers 55 topics across 11 UPSC-relevant sections: National News, International Relations, Economy & Finance, Environment & Ecology, Science & Technology, Government Schemes, Important Reports, Awards & Honours, Appointments, Obituaries, and Sports.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the May 2026 current affairs PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the May 2026 current affairs edition is available as a free downloadable PDF from the Current Affairs download page.",
      },
    },
    {
      "@type": "Question",
      name: "Does the May 2026 edition include a quiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the May 2026 edition includes an interactive quiz feature that generates practice questions from the current affairs content with instant explanations.",
      },
    },
  ],
};

const totalTopics = MAY_2026.sections.reduce((a, s) => a + s.items.length, 0);

export default function May2026Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Server-rendered hero for SEO */}
      <section className="relative overflow-hidden bg-[#213183]">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 10% 20%, rgba(255,255,255,0.6), transparent),
                            radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.4), transparent),
                            radial-gradient(1.5px 1.5px at 50% 15%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 70% 45%, rgba(255,255,255,0.3), transparent),
                            radial-gradient(1.5px 1.5px at 85% 75%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 40% 85%, rgba(255,255,255,0.3), transparent),
                            radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.4), transparent),
                            radial-gradient(1.5px 1.5px at 15% 85%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.25), transparent),
                            radial-gradient(1.5px 1.5px at 45% 35%, rgba(255,255,255,0.4), transparent)`
        }} />
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 relative">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-white">
            Monthly Edition
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl sm:tracking-tighter">
            {MAY_2026.month} {MAY_2026.year}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
            UPSC Monthly Current Affairs — {MAY_2026.sections.length} sections, {totalTopics} topics.
            Each topic includes key facts, data points, and context structured for quick revision.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/api/generate-current-affairs?month=may-2026"
              className="inline-flex items-center gap-2 rounded-full bg-[#0075de] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-95 active:scale-90">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Link>
            <Link href="/store"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-95 active:scale-90 shadow-sm">
              Browse Store
            </Link>
          </div>
        </div>
      </section>

      <CurrentAffairsClient hideHero />

      {/* Internal links section rendered server-side under the client component */}
      <section className="bg-[#f6f5f4]">
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] sm:p-8">
            <h2 className="text-sm font-bold text-[#000000e8]">More Resources for UPSC Preparation</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <Link href="/current-affairs/2025" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
                <span>📅</span>
                <span>2025 Yearly Compilation — All 12 Months</span>
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
