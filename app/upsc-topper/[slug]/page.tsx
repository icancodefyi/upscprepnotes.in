import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  getAllIndexedToppers,
  getRelatedToppers,
  getTopperBySlug,
  getToppersByRank,
  getToppersByYear,
} from "@/services/topper.service";
import { topperImageSrc } from "@/lib/utils";
import TrackingProvider from "./TrackingProvider";
import { FreeDownloadSection } from "@/components/topper/FreeDownloadSection";
import AnswerCopyPreview from "@/components/topper/AnswerCopyPreview";
import ExitPopup from "@/components/topper/ExitPopup";
import LiveCounter from "@/components/topper/LiveCounter";
import { TopperLeadCapture } from "@/components/topper/TopperLeadCapture";
import ReportButton from "@/components/ReportButton";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const toppers = await getAllIndexedToppers();
    return toppers.map((t: any) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

function buildMetaDescription(topper: Record<string, any>): string {
  const name = `${topper.firstName} ${topper.lastName}`;
  const rank = topper.rank;
  const year = topper.year;
  const subject = topper.optionalSubject || "";

  let desc = `${name} (AIR ${rank}) — See their complete UPSC ${year} marksheet`;
  if (subject) desc += ` with ${subject}`;
  desc += `. Download the free answer copy PDF, compare paper-wise scores (GS1-4, Essay, Optional), and read their preparation strategy.`;

  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  return desc;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const topper = await getTopperBySlug(slug);

  if (!topper) {
    return {
      title: "Topper Not Found",
    };
  }

  const topperImage = topperImageSrc(topper);
  const ogImage = topperImage?.startsWith("http")
    ? topperImage
    : `https://upscprepnotes.in${topperImage || "/logo.png"}`;

  return {
    title: `${topper.firstName} ${topper.lastName} UPSC Marksheet, Answer Copy PDF & ${topper.optionalSubject || "Optional Subject"} — Free Download (AIR ${topper.rank}, ${topper.year})`,
    description: buildMetaDescription(topper),
    alternates: {
      canonical: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
    },
    openGraph: {
      title: `${topper.firstName} ${topper.lastName} — UPSC Marksheet, Answer Copy, ${topper.optionalSubject || "Optional Subject"} & Strategy (AIR ${topper.rank})`,
      description: buildMetaDescription(topper),
      url: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
      siteName: "UPSCPrepNotes",
      images: [{ url: ogImage, width: 788, height: 1050 }],
    },
  };
}

export default async function TopperPage({ params }: Props) {
  const { slug } = await params;

  const topper = await getTopperBySlug(slug);

  if (!topper) {
    notFound();
  }

  const relatedToppers = await getRelatedToppers(
    topper.optionalSubject,
    topper.slug,
  );

  const sameRankToppers = await getToppersByRank(topper.rank, topper.slug);

  const sameYearToppers = await getToppersByYear(topper.year, topper.slug);

  function getSubjectSlug(subject: string) {
    if (!subject) return "";
    const s = subject.toLowerCase().trim();
    const slugMap: Record<string, string> = {
      "political science & international relations": "psir",
      "political science": "psir",
      psir: "psir",
      "public administration": "public-administration",
      mathematics: "mathematics",
      sociology: "sociology",
      geography: "geography",
      philosophy: "philosophy",
      anthropology: "anthropology",
      history: "history",
      law: "law",
      "commerce & accountancy": "commerce-accountancy",
      commerce: "commerce-accountancy",
    };
    if (slugMap[s]) return slugMap[s];
    return s.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  // Strategy section restructuring
  function extractSections(markdown: string) {
    if (!markdown) return {} as Record<string, string>;

    const headingRegex = /^(#{1,6})\s*(.+)$/gm;
    const matches = [...markdown.matchAll(headingRegex)];

    if (matches.length === 0) return {} as Record<string, string>;

    const parts: Record<string, string> = {};
    const lines = markdown.split(/\r?\n/);
    let current: string | null = null;
    let buffer: string[] = [];

    for (const line of lines) {
      const m = line.match(/^(#{1,6})\s*(.+)$/);
      if (m) {
        if (current) parts[current] = buffer.join("\n").trim();
        current = m[2].trim();
        buffer = [];
      } else {
        buffer.push(line);
      }
    }

    if (current) parts[current] = buffer.join("\n").trim();

    return parts;
  }

  function resolveHeading(heading: string, t: typeof topper): string {
    const lower = heading.toLowerCase();
    if (!t) return heading;
    if (lower.includes("background"))
      return `${t.firstName} ${t.lastName}'s Background`;
    if (
      lower.includes("educational") ||
      lower.includes("education") ||
      lower.includes("journey")
    )
      return `${t.firstName} ${t.lastName}'s Education & Journey`;
    if (lower.includes("attempt"))
      return `${t.firstName} ${t.lastName}'s UPSC Attempts`;
    if (lower.includes("prelim"))
      return `${t.firstName} ${t.lastName}'s Prelims Strategy`;
    if (lower.includes("mains") || lower.includes("written"))
      return `${t.firstName} ${t.lastName}'s Mains Strategy`;
    if (lower.includes("optional") || lower.includes("subject"))
      return `${t.firstName} ${t.lastName} ${t.optionalSubject} Strategy`;
    if (lower.includes("essay"))
      return `${t.firstName} ${t.lastName}'s Essay Preparation`;
    if (lower.includes("interview") || lower.includes("personality"))
      return `${t.firstName} ${t.lastName}'s Interview Preparation`;
    if (
      lower.includes("mistake") ||
      lower.includes("learning") ||
      lower.includes("key takeaway")
    )
      return `Key Takeaways from ${t.firstName} ${t.lastName}`;
    return heading;
  }

  const structuredStrategy = extractSections(topper.strategy || "");

  // Deduplicate repeated paragraphs within strategy content
  const deduplicateContent = (markdown: string): string => {
    const seen = new Set<string>();
    return markdown
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) return true;
        if (seen.has(trimmed)) return false;
        seen.add(trimmed);
        return true;
      })
      .join("\n");
  };

  // Build FAQ items — DB FAQs first, then generic fallbacks
  const dbFaqs = (topper.faqs || []).slice(0, 5).map((f: { question: string; answer: string }) => ({
    "@type": "Question" as const,
    name: f.question,
    acceptedAnswer: { "@type": "Answer" as const, text: f.answer },
  }));

  const genericFaqs = [
    {
      "@type": "Question" as const,
      name: `What was ${topper.firstName} ${topper.lastName}'s UPSC rank?`,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.`,
      },
    },
    {
      "@type": "Question" as const,
      name: `What was ${topper.firstName} ${topper.lastName}'s optional subject?`,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: `${topper.firstName} chose ${topper.optionalSubject} as the optional subject for UPSC CSE ${topper.year}.`,
      },
    },
    {
      "@type": "Question" as const,
      name: `What were ${topper.firstName} ${topper.lastName}'s total marks in UPSC?`,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: `${topper.firstName} ${topper.lastName} scored a total of ${topper.marks.total} marks in UPSC CSE ${topper.year}.`,
      },
    },
    {
      "@type": "Question" as const,
      name: `Can I download ${topper.firstName} ${topper.lastName}'s answer copy PDF?`,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: `Yes. Get a free sample answer copy of ${topper.firstName} ${topper.lastName} by entering your email — we will send the download link instantly. The full set is in the store — Starting at ₹99.`,
      },
    },
    {
      "@type": "Question" as const,
      name: `How did ${topper.firstName} ${topper.lastName} prepare for UPSC?`,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: `${topper.firstName} ${topper.lastName}'s UPSC preparation strategy is detailed on their topper page, covering subject-wise approach, optional strategy, and interview preparation for UPSC CSE ${topper.year}.`,
      },
    },
  ] as const;

  // FAQ Schema — Speakable + per-topper FAQs + generic fallbacks
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...dbFaqs, ...genericFaqs],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-section"],
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://upscprepnotes.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `UPSC ${topper.year} Toppers`,
        item: `https://upscprepnotes.in/year/${topper.year}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${topper.optionalSubject} Toppers`,
        item: `https://upscprepnotes.in/optional/${getSubjectSlug(topper.optionalSubject)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `AIR ${topper.rank} ${topper.firstName} ${topper.lastName}`,
        item: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
      },
    ],
  };

  // Person Schema with rich marks data + Wikidata entity linking
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${topper.firstName} ${topper.lastName}`,
    description: buildMetaDescription(topper),
    jobTitle: `UPSC CSE ${topper.year} AIR ${topper.rank}`,
    url: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    about: {
      "@id": "https://en.wikipedia.org/wiki/Union_Public_Service_Commission",
      name: "UPSC",
    },
    knowsAbout: [
      { "@type": "Thing", name: `UPSC CSE ${topper.year}` },
      { "@type": "Thing", name: topper.optionalSubject },
    ],
    succeeding: [
      {
        "@type": "Person",
        name: `UPSC ${topper.year} Rank ${topper.rank} Holder`,
      },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Civil Servant",
      occupationLocation: { "@type": "Country", name: "India" },
    },
  };

  return (
    <>
      <main className="min-h-screen bg-background">
      <TrackingProvider name={`${topper.firstName} ${topper.lastName}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">Home</Link><span>/</span>
          <Link href={`/year/${topper.year}`} className="transition hover:text-foreground">UPSC {topper.year}</Link><span>/</span>
          <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} className="transition hover:text-foreground">{topper.optionalSubject}</Link><span>/</span>
          <span className="text-foreground font-medium">{topper.firstName} {topper.lastName}</span>
        </nav>

        {/* HERO — compact, image inline with content */}
        <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {topper.firstName} {topper.lastName}
        </h1>
        <p className="mt-1.5 text-base text-brand font-medium">
          AIR {topper.rank} · {topper.year} · {topper.optionalSubject}
        </p>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:gap-8">
          {/* Image */}
          <div className="sm:max-w-[180px] lg:max-w-[220px] shrink-0">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[3/4]">
                <img
                  src={topperImageSrc(topper)}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  loading="lazy"
                  className="h-full w-full bg-muted object-cover"
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <div className="rounded-lg border border-border bg-card p-2 text-center">
                <p className="text-[10px] font-medium text-muted-foreground">AIR</p>
                <p className="font-heading text-base font-bold text-brand tabular-nums">{topper.rank}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-2 text-center">
                <p className="text-[10px] font-medium text-muted-foreground">Total</p>
                <p className="font-heading text-base font-bold tabular-nums">{topper.marks.total}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-2 text-center">
                <p className="text-[10px] font-medium text-muted-foreground">Year</p>
                <p className="font-heading text-base font-bold tabular-nums">{topper.year}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {topper.bio && (
              <p className="text-sm leading-relaxed text-muted-foreground">{topper.bio}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/store"
                data-track="topper-hero-store"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90"
              >
                Browse store &rarr;
              </Link>
              <Link
                href={`/ask?q=Tell me about ${topper.firstName} ${topper.lastName}'s UPSC strategy`}
                data-track="topper-ask-ai"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Ask AI
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs">
              <LiveCounter />
              <ReportButton topperName={`${topper.firstName} ${topper.lastName}`} />
            </div>
          </div>
        </div>

        {/* MARKSHEET */}
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            UPSC Marksheet {topper.year}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Verified marks breakdown — sourced from UPSC.gov.in
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <caption className="sr-only">{topper.firstName} {topper.lastName} UPSC {topper.year} marksheet</caption>
              <tbody className="divide-y divide-border">
                {[
                  { label: "GS1", value: topper.marks.gs1, show: (topper.marks.gs1 || 0) > 0 },
                  { label: "GS2", value: topper.marks.gs2, show: (topper.marks.gs2 || 0) > 0 },
                  { label: "GS3", value: topper.marks.gs3, show: (topper.marks.gs3 || 0) > 0 },
                  { label: "GS4 (Ethics)", value: topper.marks.gs4, show: (topper.marks.gs4 || 0) > 0 },
                  { label: "Essay", value: topper.marks.essay, show: (topper.marks.essay || 0) > 0 },
                  { label: `${topper.optionalSubject?.split(" ").slice(0, 3).join(" ") || "Optional"} P1`, value: topper.marks.optional1, show: (topper.marks.optional1 || 0) > 0 },
                  { label: `${topper.optionalSubject?.split(" ").slice(0, 3).join(" ") || "Optional"} P2`, value: topper.marks.optional2, show: (topper.marks.optional2 || 0) > 0 },
                ].filter(r => r.show).map((row) => (
                  <tr key={row.label} className="hover:bg-muted/30">
                    <td className="px-5 py-3 text-muted-foreground">{row.label}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums">{row.value}</td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-secondary/30">
                  <td className="px-5 py-3 font-semibold text-muted-foreground">Written Total</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums">{topper.marks.written}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-muted-foreground">Interview</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums">{topper.marks.interview}</td>
                </tr>
                <tr className="border-t-2 border-brand/30 bg-brand-muted/50">
                  <td className="px-5 py-3 font-extrabold text-brand">Total</td>
                  <td className="px-5 py-3 text-right font-extrabold text-brand tabular-nums text-lg">{topper.marks.total}</td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-border px-5 py-2.5 text-xs text-muted-foreground">
              Source:{" "}
              <a href="https://upsc.gov.in" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline hover:text-brand">
                UPSC CSE {topper.year} Final Result
              </a>
            </div>
          </div>

          {/* Strongest paper highlight */}
          {(() => {
            const papers = [
              { label: "GS1", value: topper.marks.gs1 },
              { label: "GS2", value: topper.marks.gs2 },
              { label: "GS3", value: topper.marks.gs3 },
              { label: "GS4", value: topper.marks.gs4 },
              { label: "Essay", value: topper.marks.essay },
            ].filter(p => p.value > 0);
            if (papers.length < 2) return null;
            const sorted = [...papers].sort((a, b) => b.value - a.value);
            return (
              <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-2.5 text-xs sm:gap-4">
                <span className="text-muted-foreground">Strongest paper:</span>
                <span className="font-bold text-brand">{sorted[0].label} ({sorted[0].value})</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground">Needs work:</span>
                <span className="font-bold text-foreground">{sorted[sorted.length - 1].label} ({sorted[sorted.length - 1].value})</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="text-muted-foreground">Gap: <span className="font-bold text-foreground">{sorted[0].value - sorted[sorted.length - 1].value} marks</span></span>
              </div>
            );
          })()}
        </section>

        {/* ANSWER COPY */}
        <FreeDownloadSection
          topperName={`${topper.firstName} ${topper.lastName}`}
          topperSlug={topper.slug}
          optionalSubject={topper.optionalSubject}
          freeAnswerCopyUrl={topper.freeAnswerCopyUrl}
          freeAnswerCopyUrls={topper.freeAnswerCopyUrls}
        />

        {/* STRATEGY */}
        {topper.strategy && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              How {topper.firstName} Prepared for UPSC
            </h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-7 prose-p:text-sm prose-headings:text-base">
                {Object.keys(structuredStrategy).length > 0 ? (
                  Object.entries(structuredStrategy).map(([heading, content], i) => (
                    <section key={heading} className={i > 0 ? "mt-8 pt-8 border-t border-border" : ""}>
                      <h3 className="font-bold">{resolveHeading(heading, topper)}</h3>
                      <div className="mt-2">
                        <ReactMarkdown>{deduplicateContent(content)}</ReactMarkdown>
                      </div>
                    </section>
                  ))
                ) : (
                  <ReactMarkdown>{topper.strategy}</ReactMarkdown>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FALLBACK STRATEGY */}
        {!topper.strategy && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              How {topper.firstName} Prepared for UPSC
            </h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="prose prose-zinc max-w-none prose-p:leading-7 prose-p:text-sm">
                <p>{topper.firstName} {topper.lastName} secured AIR {topper.rank} in UPSC CSE {topper.year} with {topper.optionalSubject} optional. Total marks: {topper.marks.total} (Written: {topper.marks.written}, Interview: {topper.marks.interview}).</p>
                {topper.bio && <p>{topper.bio}</p>}
              </div>
            </div>
          </section>
        )}

        <AnswerCopyPreview topper={topper} />

        {/* FREE ANSWER COPY */}
        <section className="mt-12">
          <TopperLeadCapture topperName={`${topper.firstName} ${topper.lastName}`} topperSlug={topper.slug} />
        </section>

        {/* INSIGHTS */}
        {topper.insights?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Key insights</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {topper.insights.map((insight: string, index: number) => (
                <div key={index} className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed">{insight}</div>
              ))}
            </div>
          </section>
        )}

        {/* RELATED TOPPERS */}
        {(sameYearToppers.length > 0 || sameRankToppers.length > 0 || relatedToppers.length > 0) && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight">Related toppers</h2>

            {sameYearToppers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold text-muted-foreground">Same year — UPSC {topper.year}</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {sameYearToppers.map((t: any) => (
                    <Link key={t.slug} href={`/upsc-topper/${t.slug}`} data-track={`topper-related-${t.slug}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-foreground/20">
                      <img src={topperImageSrc(t)} alt={`${t.firstName} ${t.lastName}`} loading="lazy" className="h-10 w-10 shrink-0 rounded-lg border border-border bg-muted object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-muted-foreground">AIR {t.rank} · {t.optionalSubject}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {sameRankToppers.length > 0 && (
              <div className={sameYearToppers.length > 0 ? "mt-6" : "mt-4"}>
                <h3 className="text-sm font-bold text-muted-foreground">Same rank — AIR {topper.rank}</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {sameRankToppers.map((t: any) => (
                    <Link key={t.slug} href={`/upsc-topper/${t.slug}`} data-track={`topper-samerank-${t.slug}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-foreground/20">
                      <img src={topperImageSrc(t)} alt={`${t.firstName} ${t.lastName}`} loading="lazy" className="h-10 w-10 shrink-0 rounded-lg border border-border bg-muted object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-muted-foreground">{t.year} · {t.optionalSubject}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedToppers.length > 0 && (
              <div className={sameYearToppers.length > 0 || sameRankToppers.length > 0 ? "mt-6" : "mt-4"}>
                <h3 className="text-sm font-bold text-muted-foreground">Same optional — {topper.optionalSubject}</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedToppers.map((t: any) => (
                    <Link key={t.slug} href={`/upsc-topper/${t.slug}`} data-track={`topper-related-${t.slug}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-foreground/20">
                      <img src={topperImageSrc(t)} alt={`${t.firstName} ${t.lastName}`} loading="lazy" className="h-10 w-10 shrink-0 rounded-lg border border-border bg-muted object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-muted-foreground">AIR {t.rank} · {t.year}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        <section className="faq-section mt-12">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {(() => {
              const dbFaqs = (topper.faqs || []).slice(0, 5).map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }));
              const genericFaqs = [
                { q: `What was ${topper.firstName} ${topper.lastName}'s UPSC rank?`, a: `AIR ${topper.rank} in UPSC CSE ${topper.year}.` },
                { q: `What was ${topper.firstName} ${topper.lastName}'s optional subject?`, a: `${topper.optionalSubject}.` },
                { q: `What were ${topper.firstName} ${topper.lastName}'s total marks?`, a: `${topper.marks.total} marks out of 2025.` },
                { q: `Can I download ${topper.firstName} ${topper.lastName}'s answer copy?`, a: `Yes — enter your email on this page and we'll send a free sample. The full set (50+ copies) is in the <a href="/store" class="text-brand font-semibold no-underline hover:underline">store</a>.` },
                { q: `How did ${topper.firstName} ${topper.lastName} prepare for UPSC?`, a: topper.strategy ? `Detailed above on this page.` : `Strategy details are not yet available.` },
              ];
              return [...dbFaqs, ...genericFaqs];
            })().map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex cursor-pointer items-start justify-between gap-4 p-4 list-none">
                  <h3 className="text-sm font-bold">{faq.q}</h3>
                  <span className="mt-0.5 shrink-0 text-muted-foreground transition group-open:rotate-180">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                  <ReactMarkdown>{faq.a}</ReactMarkdown>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* EXPLORE MORE — compact */}
        <section className="mt-12 border-t border-border pt-8">
          <div className="flex flex-wrap gap-2">
            <Link href="/store" data-track="topper-explore-compilation" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-foreground/20">
              Store &rarr;
            </Link>
            <Link href={`/year/${topper.year}`} data-track="topper-explore-year" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-foreground/20">
              UPSC {topper.year} toppers &rarr;
            </Link>
            <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} data-track="topper-explore-optional" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-foreground/20">
              {topper.optionalSubject} toppers &rarr;
            </Link>
            <Link href="/ask" data-track="topper-explore-ai" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-foreground/20">
              Ask AI mentor &rarr;
            </Link>
            <Link href="/free-materials" data-track="topper-explore-free" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-foreground/20">
              Free study materials &rarr;
            </Link>
          </div>
        </section>

      </div>
      </main>
      <ExitPopup />
    </>
  );
}
