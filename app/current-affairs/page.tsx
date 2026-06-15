import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current Affairs for UPSC 2026 – Free Monthly & Yearly Compilations | UPSCPrepNotes",
  description:
    "Free current affairs for UPSC preparation 2026. Monthly editions with 55 topics across 11 sections, daily quizzes, AI-powered reading, and downloadable PDFs. Yearly compilation covering 2025 events for UPSC Prelims, Mains & Interview.",
  openGraph: {
    title: "Current Affairs for UPSC – Free Monthly & Yearly Compilations",
    description:
      "Free current affairs for UPSC preparation. Monthly editions with 55 topics, daily quizzes, and AI-powered reading. Yearly compilation covering all of 2025. Downloadable PDFs included.",
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
        text: "Each monthly edition covers 11 UPSC-relevant sections: National News, International Relations, Economy & Finance, Environment & Ecology, Science & Technology, Government Schemes, Important Reports, Awards & Honours, Appointments, Obituaries, and Sports — with 5 topics per section (55 topics total). Yearly compilations cover all months with 400+ events.",
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

export default function CurrentAffairsHub() {
  return (
    <main className="min-h-screen bg-[#f6f5f4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        {/* Hero */}
        <div className="max-w-3xl">
          <span className="rounded-full bg-[#0075de]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.125em] text-[#0075de]">
            Current Affairs
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.625px] text-[#000000e8] sm:text-4xl lg:text-5xl">
            Current Affairs for UPSC — Free Monthly & Yearly Compilations
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#615d59] sm:text-base">
            Free monthly and yearly current affairs compilations for UPSC preparation. Every edition covers
            11 UPSC-relevant sections with 55 topics, daily quizzes, AI-powered explanations, and
            downloadable PDFs. Updated regularly with the latest events for Prelims, Mains & Interview.
          </p>
        </div>

        {/* Editorial Intro */}
        <div className="mt-12 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] sm:p-8">
          <h2 className="text-sm font-bold text-[#000000e8]">Why Current Affairs Matter for UPSC</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#615d59]">
            <p>
              Current affairs form the backbone of UPSC preparation. With 30-40% of Prelims questions, 
              every Mains General Studies paper, and the entire Interview stage drawing from recent events, 
              a structured current affairs strategy can make the difference between qualifying and 
              ranking. Yet most aspirants struggle with information overload — reading multiple newspapers, 
              following too many sources, and failing to connect events to the syllabus.
            </p>
            <p>
              That is why we built UPSCPrepNotes current affairs differently. Each monthly edition distills 
              thousands of news items into 55 tightly curated topics across 11 UPSC-relevant sections — 
              National News, International Relations, Economy, Environment, Science &amp; Technology, 
              Government Schemes, Important Reports, Awards, Appointments, Obituaries, and Sports. 
              Every topic includes key facts, data points, and context structured for quick revision. 
              No fluff, no filler — just what you need for Prelims, Mains, and Interview.
            </p>
            <p>
              Beyond monthly compilations, we offer AI-powered explanations that break down complex 
              events, interactive quizzes for self-assessment, and downloadable PDFs for offline study. 
              Our 2025 yearly compilation brings together all 12 months in one place — over 850 events 
              tagged by section for targeted revision. Whether you are preparing for the 2026 cycle or 
              building your foundation for 2027, our current affairs coverage adapts to your pace.
            </p>
          </div>
        </div>

        {/* Editions */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/current-affairs/may-2026"
            className="group rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] transition hover:shadow-[0_0.175px_1.041px_rgba(0,0,0,0.01),0_0.8px_2.925px_rgba(0,0,0,0.02),0_2.025px_7.847px_rgba(0,0,0,0.027),0_4px_18px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000e8] text-sm font-bold text-white">M</span>
              <div>
                <p className="text-sm font-bold text-[#000000e8] group-hover:text-[#0075de] transition">May 2026 Edition</p>
                <p className="text-xs text-[#615d59]">Latest · 11 sections · 55 topics · with quiz & AI</p>
              </div>
              <span className="ml-auto rounded-full bg-[#1aae39]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#1aae39]">New</span>
            </div>
            <div className="mt-4 flex gap-2 text-xs text-[#615d59]">
              <span>Interactive reading</span>
              <span>·</span>
              <span>Daily quiz</span>
              <span>·</span>
              <span>PDF download</span>
            </div>
          </Link>

          <Link
            href="/current-affairs/2025"
            className="group rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] transition hover:shadow-[0_0.175px_1.041px_rgba(0,0,0,0.01),0_0.8px_2.925px_rgba(0,0,0,0.02),0_2.025px_7.847px_rgba(0,0,0,0.027),0_4px_18px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dd5b00]/15 text-sm font-bold text-[#dd5b00]">25</span>
              <div>
                <p className="text-sm font-bold text-[#000000e8] group-hover:text-[#0075de] transition">2025 Yearly Compilation</p>
                <p className="text-xs text-[#615d59]">12 months · ~850+ events · 11 sections per month</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 text-xs text-[#615d59]">
              <span>All 12 months · Jan–Dec 2025</span>
              <span>·</span>
              <span>Server-rendered</span>
              <span>·</span>
              <span>PDF download</span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 ring-1 ring-[#e6e6e6]">
            <p className="text-2xl font-black tracking-[-0.5px] text-[#000000e8]">11</p>
            <p className="text-xs text-[#615d59] mt-0.5">Sections per edition</p>
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-[#e6e6e6]">
            <p className="text-2xl font-black tracking-[-0.5px] text-[#000000e8]">55</p>
            <p className="text-xs text-[#615d59] mt-0.5">Topics per month</p>
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-[#e6e6e6]">
            <p className="text-2xl font-black tracking-[-0.5px] text-[#000000e8]">Free</p>
            <p className="text-xs text-[#615d59] mt-0.5">Always free to read & download</p>
          </div>
        </div>

        {/* Sections preview */}
        <div className="mt-12 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] sm:p-8">
          <h2 className="text-sm font-bold text-[#000000e8]">11 UPSC-Relevant Sections Covered Every Edition</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-[#615d59]">
            {[
              ["🇮🇳", "National News"],
              ["🌐", "International Relations"],
              ["💰", "Economy & Finance"],
              ["🌿", "Environment & Ecology"],
              ["🔬", "Science & Technology"],
              ["📋", "Schemes & Policies"],
              ["📊", "Important Reports"],
              ["🏆", "Awards & Honours"],
              ["👤", "Appointments"],
              ["🕊️", "Obituaries"],
              ["🏏", "Sports"],
            ].map(([emoji, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span>{emoji as string}</span>
                <span>{label as string}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-12 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] sm:p-8">
          <h2 className="text-sm font-bold text-[#000000e8]">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-4 text-sm text-[#615d59]">
            <div>
              <p className="font-semibold text-[#000000e8]">What is covered in UPSCPrepNotes current affairs?</p>
              <p className="mt-1 leading-relaxed">Each monthly edition covers 11 UPSC-relevant sections: National News, International Relations, Economy & Finance, Environment & Ecology, Science & Technology, Government Schemes, Important Reports, Awards & Honours, Appointments, Obituaries, and Sports — with 5 topics per section (55 topics total). Yearly compilations cover all months with 400+ events.</p>
            </div>
            <div>
              <p className="font-semibold text-[#000000e8]">Is the current affairs content free?</p>
              <p className="mt-1 leading-relaxed">Yes, all current affairs content on UPSCPrepNotes is completely free to read online. PDF downloads are also free. We also offer an AI-powered reading experience and interactive quiz for every edition.</p>
            </div>
            <div>
              <p className="font-semibold text-[#000000e8]">Can I download current affairs as PDF?</p>
              <p className="mt-1 leading-relaxed">Yes, every monthly edition and the yearly compilation is available as a free downloadable PDF. Visit the <Link href="/current-affairs/download" className="text-[#0075de] hover:underline">Current Affairs PDF download page</Link> to get your copy.</p>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="mt-12 rounded-xl bg-white p-6 ring-1 ring-[#e6e6e6] sm:p-8">
          <h2 className="text-sm font-bold text-[#000000e8]">More Resources for UPSC Preparation</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <Link href="/toppers" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🏆</span>
              <span>Toppers Strategies & Marks</span>
            </Link>
            <Link href="/store" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📚</span>
              <span>Premium Notes & Test Series</span>
            </Link>
            <Link href="/pyq" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>📝</span>
              <span>Previous Year Questions (PYQ)</span>
            </Link>
            <Link href="/ask" className="flex items-center gap-2 rounded-lg bg-[#f6f5f4] px-4 py-3 text-[#615d59] hover:text-[#000000e8] transition">
              <span>🤖</span>
              <span>Ask AI — UPSC Query Assistant</span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/current-affairs/may-2026"
            className="inline-flex items-center gap-2 rounded-full bg-[#000000e8] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Read May 2026 Edition →
          </Link>
          <Link
            href="/current-affairs/download"
            className="inline-flex items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-6 py-2.5 text-sm font-medium text-[#615d59] transition hover:text-[#000000e8]"
          >
            Download PDFs
          </Link>
        </div>

        <footer className="mt-16 border-t border-[#e6e6e6] pt-6 text-center text-xs text-[#a39e98]">
          <p>UPSCPrepNotes · Monthly &amp; Yearly Current Affairs for UPSC · Free PDF Downloads</p>
        </footer>
      </div>
    </main>
  );
}
