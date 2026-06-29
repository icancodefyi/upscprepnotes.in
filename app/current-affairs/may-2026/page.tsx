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

      {/* Hero */}
      <section className="bg-white border-b border-[#e6e6e6]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <span className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-[#f6f5f4] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#615d59]">
            Monthly Edition
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            {MAY_2026.month} {MAY_2026.year}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#615d59]">
            UPSC Monthly Current Affairs — {MAY_2026.sections.length} sections, {totalTopics} topics.
            Each topic includes key facts, data points, and context structured for quick revision.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/api/generate-current-affairs?month=may-2026"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Link>
            <Link href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-6 py-2.5 text-sm font-semibold text-[#615d59] transition hover:text-black">
              Browse Store
            </Link>
            <a
              href="https://t.me/+VYMxrig-a8AzZmNl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#0088cc]/30 bg-[#e8f4fd] px-5 py-2.5 text-sm font-semibold text-[#0088cc] transition hover:bg-[#d4edfc]"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </a>
          </div>
        </div>
      </section>

      <CurrentAffairsClient />

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
