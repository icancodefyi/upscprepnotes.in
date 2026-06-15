import type { Metadata } from "next";
import Link from "next/link";
import CurrentAffairsClient from "./CurrentAffairsClient";

export const metadata: Metadata = {
  title: "Current Affairs May 2026 – Latest Monthly Current Affairs for UPSC | UPSCPrepNotes",
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
