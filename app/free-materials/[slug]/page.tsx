import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { PDFModel } from "@/models/pdf.model";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import {
  generateWhatsIncluded,
  generateHowToUse,
  generateKeyTopics,
  generateStudyTips,
  generateFAQs,
  getCategoryLabel,
  generateEditorialContent,
} from "@/lib/pdf-content";
import ResourceSearch from "@/components/ResourceSearch";
import FreeMaterialDownload from "@/components/FreeMaterialDownload";

// Edward playbook: republish under new URL to get fresh indexing judgment
const V2_SLUGS = new Set([
  "vision-ias-test-series-2026-v2",
  "forum-ias-ethics-handouts-notes-v2",
  "manorama-year-book-2026-v2",
  "yojana-magazine-monthly-pdf-v2",
  "speedy-current-affairs-2026-book-v2",
  "psir-optional-test-series-upsc-v2",
  "drishti-ias-notes-2025-v2",
  "shankar-ias-environment-10th-edition-v2",
  "vision-ias-monthly-current-affairs-magazine-v2",
  "daily-current-affairs-2025-hindi-english-v2",
]);

function originalSlug(slug: string): string {
  return slug.endsWith("-v2") ? slug.slice(0, -3) : slug;
}

const V2_EXTRA_CONTENT: Record<string, string[]> = {
  "vision-ias-test-series-2026-v2": [
    "Vision IAS test series are among the most widely used mock tests by UPSC toppers. The 2026 edition includes updated papers reflecting the latest exam pattern changes — including the new emphasis on case-study based questions in GS4 and source-based questions in GS1. Many rank holders in 2024 and 2025 explicitly credited Vision IAS mocks for their prelims qualification and mains answer-writing speed.",
  ],
  "forum-ias-ethics-handouts-notes-v2": [
    "Forum IAS ethics handouts (GS4) are distinct because they move beyond theoretical ethics into applied moral reasoning — exactly what the UPSC ethics paper demands. The handouts organize the syllabus into 12 modules covering ethical dilemmas, case studies, moral thinkers, and governance ethics. Toppers who scored 130+ in GS4 in 2024 consistently referenced these handouts as their primary GS4 resource alongside the Lexicon.",
  ],
  "manorama-year-book-2026-v2": [
    "The Manorama Year Book 2026 is more than a facts compendium — its structured sections on India's economy, polity, environment, and international relations make it a one-stop reference for GS prelims. The 2026 edition includes updated chapters on India's G20 presidency outcomes, the National Education Policy 2020 implementation status, and key Supreme Court judgments from 2025. Many toppers use it alongside the India Year Book published by the Government of India.",
  ],
  "yojana-magazine-monthly-pdf-v2": [
    "Yojana magazine is directly published by the Government of India's Publications Division and carries policy-level articles written by domain experts — IAS officers, economists, and academics. Each monthly issue covers 8-12 themes aligned with the UPSC syllabus. The magazine's editorials on flagship government schemes like Ayushman Bharat, Jal Jeevan Mission, and PM-KISAN have appeared verbatim in UPSC GS questions. Toppers recommend reading Yojana for Paper-III (economy, environment) and essay writing.",
  ],
  "speedy-current-affairs-2026-book-v2": [
    "Speedy Current Affairs 2026 is organized chronologically by month, making it easy to revise in phases. Each monthly chapter covers national news, international relations, economy, environment, science & tech, schemes, awards, appointments, and sports — mirroring the 11-section structure that UPSC prelims current affairs questions follow. The book includes 500+ practice MCQs at the end, which have historically repeated in the actual prelims exam.",
  ],
  "psir-optional-test-series-upsc-v2": [
    "PSIR (Political Science & International Relations) is the most opted UPSC optional subject — over 600 candidates choose it annually. This test series covers Paper I (political theory and thought) and Paper II (comparative politics and IR) across 15 full-length mocks. Each test includes both the 250-word short-answer format and the 500-word essay-style questions that PSIR demands. The answer keys include model frameworks — how to structure a 500-word answer on 'Rawls vs Nozick on distributive justice' or 'India's Indo-Pacific strategy post-2024'.",
  ],
  "drishti-ias-notes-2025-v2": [
    "Drishti IAS notes are known for their bilingual presentation (Hindi and English side-by-side), making them the primary preparation resource for Hindi-medium aspirants who form nearly 40% of UPSC candidates. The 2025 edition covers the entire GS syllabus in 8 subject-wise volumes. Each chapter begins with the syllabus demand, followed by content, previous year questions, and practice exercises. The notes' strength is their exam-focused treatment — every paragraph is written with the question paper in mind.",
  ],
  "shankar-ias-environment-10th-edition-v2": [
    "Shankar IAS Environment is widely considered the single most important book for UPSC environment and ecology questions — both in prelims and mains. The 10th edition adds chapters on India's updated NDCs (Nationally Determined Contributions), the Green Credit Rules 2024, and the latest IUCN Red List classifications. The book's true value lies in its diagram-based explanations of ecological cycles, biodiversity hotspots, and conservation statuses — topics that UPSC has consistently asked through map-based and diagram-based questions.",
  ],
  "vision-ias-monthly-current-affairs-magazine-v2": [
    "Vision IAS Monthly Current Affairs is unique among current affairs sources because it organizes events by GS paper linkage — showing you exactly which paper and topic each news item belongs to. Each monthly edition covers 45-55 topics across 11 sections with analytical commentary, not just news summaries. The December 2025 issue, for example, linked the COP29 outcomes to GS3 environment and India's climate diplomacy to GS2 IR. Toppers consistently rank this as their primary current affairs source.",
  ],
  "daily-current-affairs-2025-hindi-english-v2": [
    "This bilingual daily current affairs compilation covers every major national and international event from January to December 2025. Each daily entry includes the news summary, GS paper mapping, probable UPSC questions, and key vocabulary. The compilation is particularly valuable for revision — instead of scanning multiple news sources, you get the entire year's relevant news in one structured document. Hindi-medium candidates especially benefit from the parallel English-Hindi presentation.",
  ],
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbSlug = originalSlug(slug);
  const isV2 = V2_SLUGS.has(slug);
  await connectDB();
  const pdf = await PDFModel.findOne({ slug: dbSlug }).lean();
  if (!pdf) return { title: "PDF Not Found" };
  const p = pdf as any;
  const metaDesc = generateWhatsIncluded(p).slice(0, 160);
  return {
    title: `${p.title} — Free PDF Download`,
    description: metaDesc,
    robots: { index: isV2 },
    alternates: { canonical: `https://upscprepnotes.in/free-materials/${slug}` },
    openGraph: {
      title: `${p.title} — Free Download`,
      description: metaDesc,
      url: `https://upscprepnotes.in/free-materials/${slug}`,
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og/default.png"],
    },
  };
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  "test-series": { label: "Test Series", icon: "📝" },
  "notes": { label: "Notes & Material", icon: "📓" },
  "books": { label: "Books", icon: "📚" },
  "magazines": { label: "Magazines", icon: "📰" },
  "current-affairs": { label: "Current Affairs", icon: "📰" },
  "optional": { label: "Optional Subjects", icon: "🎯" },
  "other": { label: "Resources", icon: "📄" },
};

export default async function PDFDetailPage({ params }: Props) {
  const { slug } = await params;
  const dbSlug = originalSlug(slug);
  await connectDB();
  const doc = await PDFModel.findOne({ slug: dbSlug }).lean();
  if (!doc) notFound();

  const p = doc as any;
  const cat = CATEGORY_META[p.category] || CATEGORY_META.other;
  const downloadUrl = p.downloadUrl || p.imagekitUrl || "#";
  const sourceUrl = p.sourceUrl || "";

  const whatsIncluded = generateWhatsIncluded(p);
  const howToUse = generateHowToUse(p);
  const keyTopics = generateKeyTopics(p);
  const studyTips = generateStudyTips(p);
  const faqs = generateFAQs(p);
  const editorial = generateEditorialContent(p);
  const v2Content = V2_EXTRA_CONTENT[slug];

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Free Materials", href: "/free-materials" },
          { name: p.title, href: `/free-materials/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
        {/* BREADCRUMB */}
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <Link href="/" data-track="pdf-detail-home" className="hover:text-zinc-800 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/free-materials" data-track="pdf-detail-free-materials" className="hover:text-zinc-800 transition-colors">Free Materials</Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">{p.title}</span>
        </nav>

        {/* HEADER */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{cat.icon}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              {cat.label}
            </span>
            {p.brand && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {p.brand}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {p.title}
          </h1>
          {p.description && (
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
              {p.description}
            </p>
          )}
          {p.fileSize && (
            <p className="mt-2 text-sm text-zinc-400">
              File size: {p.fileSize} {p.pageCount ? `· ${p.pageCount} pages` : ""}
            </p>
          )}
          <a
            href="https://t.me/+VYMxrig-a8AzZmNl"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#0088cc]/30 bg-[#e8f4fd] px-4 py-2 text-xs font-semibold text-[#0088cc] transition hover:bg-[#d4edfc]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram — Daily Current Affairs
          </a>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">
            What&rsquo;s Included
          </h2>
          <p className="text-base leading-8 text-zinc-700">
            {whatsIncluded}
          </p>
          {keyTopics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {keyTopics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs bg-zinc-100 text-zinc-600 rounded-full px-3 py-1"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* EDITORIAL CONTENT */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">
            About This Resource
          </h2>
          <p className="text-base leading-8 text-zinc-700">
            {editorial}
          </p>
          {v2Content && (
            <div className="mt-4 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
              {v2Content.map((para, i) => (
                <p key={i} className="text-sm leading-7 text-zinc-700">
                  {para}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* HOW TO USE */}
        <section className="mb-12 rounded-2xl bg-zinc-50 border border-zinc-200 p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">
            How to Use This for UPSC Prep
          </h2>
          <p className="text-base leading-8 text-zinc-700">
            {howToUse}
          </p>
          {studyTips.length > 0 && (
            <div className="mt-4 space-y-2">
              {studyTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <span className="text-emerald-600 mt-0.5 shrink-0">&#10003;</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RESOURCES LIST (multi-item collections like test series) */}
        {p.resources && p.resources.length > 0 && (
          <ResourceSearch resources={p.resources} slug={p.slug} />
        )}

        {/* DOWNLOAD SECTION (single item) */}
        {(!p.resources || p.resources.length === 0) && (
          <>
            <FreeMaterialDownload
              downloadUrl={downloadUrl}
              pdfSlug={p.slug}
              pdfTitle={p.title}
              category={p.category || "other"}
            />
            {sourceUrl && (
              <p className="mb-16 -mt-12 text-xs text-zinc-400 text-center sm:text-left">
                Source:{" "}
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" data-track="pdf-detail-source-link" className="underline hover:text-zinc-600">
                  pdfnotes.co
                </a>
              </p>
            )}
          </>
        )}

        {/* GREAT WEEKEND SALE */}
        <section className="mb-16 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 shrink-0">
              <span className="text-3xl">🎉</span>
            </div>
            <div className="flex-1">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Offer</span>
              <h2 className="mt-2 text-lg font-bold text-white">Starting at ₹99</h2>
              <p className="mt-1 text-sm text-emerald-200/80">
                Starting at ₹99 · Instant download.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 rounded-full bg-emerald-500 px-8 text-sm font-bold text-white hover:bg-emerald-400 shadow-lg"
            >
              <Link href="/store" data-track={`pdf-upsell-${p.slug}`}>
                Shop Now &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-lg font-bold text-zinc-800 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-zinc-200 bg-white overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer hover:bg-zinc-50 transition-colors list-none">
                    <span className="text-sm font-semibold text-zinc-800 pr-4">
                      {faq.q}
                    </span>
                    <svg
                      className="w-4 h-4 text-zinc-400 shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-zinc-100 px-5 py-4">
                    <p className="text-sm leading-7 text-zinc-600">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* EXPLORE MORE */}
        <section className="mb-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
            Explore More Free Resources
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/toppers"
              data-track="pdf-detail-toppers"
              className="flex items-center gap-3 rounded-xl bg-white border border-zinc-200 p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">Topper Answer Copies</p>
                <p className="text-xs text-zinc-500 mt-0.5">280+ verified topper profiles with marks and copies</p>
              </div>
            </Link>
            <Link
              href="/pyq"
              data-track="pdf-detail-pyq"
              className="flex items-center gap-3 rounded-xl bg-white border border-zinc-200 p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">Previous Year Questions</p>
                <p className="text-xs text-zinc-500 mt-0.5">310+ PYQ papers with detailed analysis</p>
              </div>
            </Link>
            <Link
              href="/free-materials"
              data-track="pdf-detail-more-free-materials"
              className="flex items-center gap-3 rounded-xl bg-white border border-zinc-200 p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">More Free Study Material</p>
                <p className="text-xs text-zinc-500 mt-0.5">2,700+ resources across test series, notes, books, magazines</p>
              </div>
            </Link>
            <Link
              href="/resources"
              data-track="pdf-detail-guides"
              className="flex items-center gap-3 rounded-xl bg-white border border-zinc-200 p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">UPSC Guides</p>
                <p className="text-xs text-zinc-500 mt-0.5">Full form, syllabus breakdown, free material guide</p>
              </div>
            </Link>
          </div>
        </section>

        {/* RELATED PDFs — same category */}
        <PDFRelated category={p.category} currentSlug={p.slug} currentTitle={p.title} />
      </div>
    </main>
  );
}

async function PDFRelated({
  category,
  currentSlug,
  currentTitle,
}: {
  category: string;
  currentSlug: string;
  currentTitle: string;
}) {
  await connectDB();
  const related = await PDFModel.find({
    category,
    slug: { $ne: currentSlug },
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  if (related.length === 0) return null;

  return (
    <section className="border-t border-zinc-100 pt-12">
      <h2 className="text-lg font-bold text-zinc-800 mb-6">More {CATEGORY_META[category]?.label || "Resources"}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((r: any) => (
          <Link
            key={r._id}
            href={`/free-materials/${r.slug}`}
            data-track={`pdf-detail-related-${r.slug}`}
            className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <h3 className="text-sm font-semibold text-zinc-800 group-hover:text-black transition-colors truncate">
              {r.title}
            </h3>
            {r.brand && (
              <p className="mt-0.5 text-xs text-zinc-400">{r.brand}</p>
            )}
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{r.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
