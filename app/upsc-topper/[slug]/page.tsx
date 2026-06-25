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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { topperImageSrc } from "@/lib/utils";
import TrackingProvider from "./TrackingProvider";
import { FreeDownloadSection } from "@/components/topper/FreeDownloadSection";
import AnswerCopyPreview from "@/components/topper/AnswerCopyPreview";
import PurchaseSidebar from "@/components/topper/PurchaseSidebar";
import ExitPopup from "@/components/topper/ExitPopup";
import LiveCounter from "@/components/topper/LiveCounter";
import ReportButton from "@/components/ReportButton";
import StrategyPaywall from "@/components/topper/StrategyPaywall";

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
  const gs1 = topper.marks?.gs1 ?? "";
  const gs2 = topper.marks?.gs2 ?? "";
  const gs3 = topper.marks?.gs3 ?? "";
  const gs4 = topper.marks?.gs4 ?? "";
  const essay = topper.marks?.essay ?? "";
  const opt1 = topper.marks?.optional1 ?? "";

  const total = topper.marks?.total ?? "";
  let desc = `${name} AIR ${rank} UPSC marksheet: Total ${total}`;
  if (essay) desc += ` · Essay ${essay}`;
  if (gs1) desc += ` · GS1 ${gs1}`;
  if (gs2) desc += ` · GS2 ${gs2}`;
  if (gs3) desc += ` · GS3 ${gs3}`;
  if (gs4) desc += ` · GS4 ${gs4}`;
  if (opt1 && subject) desc += ` · ${subject} ${opt1}`;
  desc += `. See the full marks breakdown across all papers & download a free answer copy PDF.`;
  if (subject) desc += ` Optional: ${subject}.`;

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
    title: `${topper.firstName} ${topper.lastName} Answer Copy PDF — Free Download, UPSC Marksheet & Strategy (AIR ${topper.rank}, ${topper.year})`,
    description: buildMetaDescription(topper),
    alternates: {
      canonical: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
    },
    openGraph: {
      title: `${topper.firstName} ${topper.lastName} — UPSC Marksheet, Answer Copy & Strategy (AIR ${topper.rank})`,
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

  // FAQ Schema — expanded for entity search intent
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What was ${topper.firstName} ${topper.lastName}'s UPSC rank?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        name: `What was ${topper.firstName} ${topper.lastName}'s optional subject?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} chose ${topper.optionalSubject} as the optional subject for UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        name: `What were ${topper.firstName} ${topper.lastName}'s interview marks?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} scored ${topper.marks.interview} marks in the UPSC personality test (interview).`,
        },
      },
      {
        "@type": "Question",
        name: `What were ${topper.firstName} ${topper.lastName}'s total marks in UPSC?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} ${topper.lastName} scored a total of ${topper.marks.total} marks in UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        name: `What were ${topper.firstName} ${topper.lastName}'s GS1 marks?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} scored ${topper.marks.gs1} marks in GS1 paper.`,
        },
      },
      {
        "@type": "Question",
        name: `What were ${topper.firstName} ${topper.lastName}'s essay marks?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} scored ${topper.marks.essay} marks in the essay paper.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I download ${topper.firstName} ${topper.lastName}'s answer copy PDF?`,
        acceptedAnswer: {
          "@type": "Answer",
              text: `Yes. Get a free sample answer copy of ${topper.firstName} ${topper.lastName} by entering your email — we will send the download link instantly. The full set is in the store — Starting at ₹99.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I find ${topper.firstName} ${topper.lastName} answer copy?`,
        acceptedAnswer: {
          "@type": "Answer",
              text: `Download a free sample of ${topper.firstName} ${topper.lastName}'s UPSC answer copy directly from the topper page — enter your email and we will send the PDF. The full set is available in the store — Starting at ₹99.`,
        },
      },
      {
        "@type": "Question",
        name: `What were ${topper.firstName} ${topper.lastName}'s ethics (GS4) marks?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} scored ${topper.marks.gs4} marks in the GS4 (Ethics) paper of UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        name: `What were ${topper.firstName} ${topper.lastName}'s optional subject marks?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} scored ${topper.marks.optional1} in ${topper.optionalSubject} Paper 1 and ${topper.marks.optional2} in Paper 2, totaling ${topper.marks.optional1 + topper.marks.optional2} marks in the optional subject for UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        name: `How did ${topper.firstName} ${topper.lastName} prepare for UPSC?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} ${topper.lastName}'s UPSC preparation strategy is detailed on their topper page, covering subject-wise approach, optional strategy, and interview preparation for UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${topper.firstName} ${topper.lastName}'s educational background?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year} with ${topper.optionalSubject} as optional subject. The detailed educational background and graduation details are covered in the strategy section on their topper page.`,
        },
      },
    ],
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

  // Person Schema with rich marks data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${topper.firstName} ${topper.lastName}`,
    description: buildMetaDescription(topper),
    jobTitle: `UPSC CSE ${topper.year} AIR ${topper.rank}`,
    url: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
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
      <main className="min-h-screen">
      <TrackingProvider name={`${topper.firstName} ${topper.lastName}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* BREADCRUMB */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground" data-track="topper-breadcrumb-home">Home</Link>
          <span>/</span>
          <Link href={`/year/${topper.year}`} className="transition hover:text-foreground" data-track="topper-breadcrumb-year">{topper.year}</Link>
          <span>/</span>
          <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} className="transition hover:text-foreground" data-track="topper-breadcrumb-optional">{topper.optionalSubject}</Link>
        </div>

        {/* HERO */}
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* LEFT */}
          <div>
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card">
              <div className="aspect-[3/4]">
                <img
                  src={topperImageSrc(topper)}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  className="h-full w-full bg-muted object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.08]"
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">AIR</p>
                <p className="text-xl font-bold text-primary">{topper.rank}</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{topper.marks.total}</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Year</p>
                <p className="text-xl font-bold">{topper.year}</p>
              </div>
            </div>

            {/* Purchase CTA */}
            <PurchaseSidebar topperName={`${topper.firstName} ${topper.lastName}`} />
          </div>

          {/* RIGHT */}
          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {topper.firstName} {topper.lastName} — UPSC Marksheet, {topper.optionalSubject || "Optional Subject"} Answer Copy &amp; Strategy
            </h1>
            <p className="mt-1 text-lg text-primary font-medium">
              AIR {topper.rank} &middot; {topper.marks.total} Total Marks
            </p>

            {/* MARKS AT A GLANCE — visible above fold for marksheet intent */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Written", value: topper.marks.written, show: topper.marks.written > 0 },
                { label: "Interview", value: topper.marks.interview, show: topper.marks.interview > 0 },
                { label: "Total", value: topper.marks.total, show: topper.marks.total > 0, highlight: true },
                { label: "Essay", value: topper.marks.essay, show: topper.marks.essay > 0 },
                { label: "Best GS", value: Math.max(topper.marks.gs1 || 0, topper.marks.gs2 || 0, topper.marks.gs3 || 0, topper.marks.gs4 || 0), show: (topper.marks.gs1 || topper.marks.gs2 || topper.marks.gs3 || topper.marks.gs4) > 0 },
                { label: topper.optionalSubject?.split(" ").slice(0, 2).join(" ") || "Optional", value: topper.marks.optional1 || topper.marks.optional2, show: (topper.marks.optional1 || topper.marks.optional2) > 0 },
              ].filter(c => c.show).slice(0, 6).map((c) => (
                <div key={c.label} className={`rounded-lg border ${c.highlight ? "border-emerald-200 bg-emerald-50" : "border-border/50 bg-card"} p-2.5 text-center`}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className={`text-base font-bold ${c.highlight ? "text-emerald-700" : ""}`}>{c.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {topper.firstName} {topper.lastName} UPSC marksheet — AIR {topper.rank} ({topper.year}) with {topper.optionalSubject} optional. Download actual UPSC Mains answer copy PDF with marks breakdown across GS Papers and essay.
            </p>

            {/* QUICK FACTS — structured for AI overviews */}
            <div className="mt-4 rounded-xl border border-border/50 bg-card p-4 text-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quick Facts</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  ["Name", `${topper.firstName} ${topper.lastName}`],
                  ["Rank", `AIR ${topper.rank}`],
                  ["Year", `${topper.year}`],
                  ["Optional", `${topper.optionalSubject}`],
                  ["Written Total", `${topper.marks.written}`],
                  ["Interview", `${topper.marks.interview}`],
                  ["Total Marks", `${topper.marks.total}`],
                ].filter(r => r[1] && r[1] !== "0").map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm leading-6">
              <Link href="/store" className="text-emerald-600 font-semibold hover:underline" data-track="topper-compilation-body">
                Shop Now →
              </Link>
              <span className="text-muted-foreground"> — Starting at ₹99.</span>
            </p>
            {topper.bio && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {topper.bio}
              </p>
            )}

            {/* Social proof */}
            <div className="mt-4 flex items-center text-xs">
              <LiveCounter />
            </div>

            {/* WIKI TABLE */}
            <div className="mt-5 rounded-xl border border-border/50 bg-card">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border/30">
                  {[
                    { label: "Name", value: `${topper.firstName} ${topper.lastName}` },
                    { label: "Rank", value: `AIR ${topper.rank}` },
                    { label: "Year", value: topper.year },
                    { label: "Optional Subject", value: topper.optionalSubject },
                    { label: "Essay Marks", value: topper.marks.essay },
                    { label: "Written Total", value: topper.marks.written },
                    { label: "Interview", value: topper.marks.interview },
                    { label: "Total Marks", value: topper.marks.total },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 text-muted-foreground font-medium w-1/3">{row.label}</td>
                      <td className="px-4 py-2.5 font-semibold">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ASK AI */}
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/5 hover:text-primary text-sm">
                <Link href={`/ask?q=Tell me about ${topper.firstName} ${topper.lastName}'s UPSC strategy`} data-track="topper-ask-ai">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Ask AI about {topper.firstName}
                  <span className="ml-1.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">New</span>
                </Link>
              </Button>
            </div>

            {/* REPORT */}
            <div className="mt-3">
              <ReportButton topperName={`${topper.firstName} ${topper.lastName}`} />
            </div>
          </div>
        </div>

        <FreeDownloadSection
          topperName={`${topper.firstName} ${topper.lastName}`}
          topperSlug={topper.slug}
          optionalSubject={topper.optionalSubject}
          freeAnswerCopyUrl={topper.freeAnswerCopyUrl}
          freeAnswerCopyUrls={topper.freeAnswerCopyUrls}
        />

        {/* STRATEGY — moved up, first 2 sections visible, rest blurred */}
        {topper.strategy && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">How Did {topper.firstName} {topper.lastName} Prepare for UPSC?</h2>
            <p className="mt-1 text-sm text-muted-foreground">How they prepared for UPSC CSE {topper.year}</p>
            <div className="mt-4 rounded-xl border border-border/50 bg-card p-6">
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-7 prose-p:text-sm prose-headings:text-base">
                {Object.keys(structuredStrategy).length > 0 ? (
                  <>
                    {/* First 4 sections — fully visible for SEO depth */}
                    {Object.entries(structuredStrategy).slice(0, 4).map(
                      ([heading, content], i) => (
                        <section key={heading} className={i > 0 ? "mt-8 border-l-2 border-l-primary pl-5" : ""}>
                          <h3 className="font-bold">{resolveHeading(heading, topper)}</h3>
                          <div className="mt-2">
                            <ReactMarkdown>
                              {deduplicateContent(content)}
                            </ReactMarkdown>
                          </div>
                        </section>
                      ),
                    )}
                    {/* Remaining sections — blurred with paywall */}
                    {Object.keys(structuredStrategy).length > 4 && (
                      <div className="relative mt-4">
                        <div className="overflow-hidden" style={{ maxHeight: "320px" }}>
                          <div className="blur-sm opacity-30 pointer-events-none select-none">
                            {Object.entries(structuredStrategy).slice(4).map(
                              ([heading, content], i) => (
                                <section key={heading} className={i > 0 ? "mt-8 border-l-2 border-l-primary pl-5" : ""}>
                                  <h3 className="font-bold">{resolveHeading(heading, topper)}</h3>
                                  <div className="mt-2">
                                    <ReactMarkdown>
                                      {deduplicateContent(content)}
                                    </ReactMarkdown>
                                  </div>
                                </section>
                              ),
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                        </div>
                        <StrategyPaywall
                          topperName={`${topper.firstName} ${topper.lastName}`}
                          topperSlug={topper.slug}
                          blurredCount={Object.keys(structuredStrategy).length - 4}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <ReactMarkdown>{topper.strategy}</ReactMarkdown>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FALLBACK STRATEGY — for toppers without strategy data */}
        {!topper.strategy && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">How Did {topper.firstName} {topper.lastName} Prepare for UPSC?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Preparation overview for UPSC CSE {topper.year}</p>
            <div className="mt-4 rounded-xl border border-border/50 bg-card p-6">
              <div className="prose prose-zinc max-w-none prose-p:leading-7 prose-p:text-sm">
                <p>{topper.firstName} {topper.lastName} secured AIR {topper.rank} in the UPSC Civil Services Examination {topper.year} with {topper.optionalSubject} as the optional subject. A total of {topper.marks.total} marks was achieved in the final merit list, with {topper.marks.written} marks in the written examination and {topper.marks.interview} marks in the interview round.</p>
                <p>In the General Studies papers, {topper.firstName} scored {topper.marks.gs1} in GS1, {topper.marks.gs2} in GS2, {topper.marks.gs3} in GS3, and {topper.marks.gs4} in GS4 (Ethics). The essay paper contributed {topper.marks.essay} marks to the total score. In the optional subject ({topper.optionalSubject}), the candidate scored {topper.marks.optional1} in Paper 1 and {topper.marks.optional2} in Paper 2.</p>
                <p>To explore {topper.firstName}&apos;s detailed preparation strategy including study plan, book list, coaching details, and answer writing approach, check the complete strategy guide available in the UPSCPrepNotes store along with actual answer copy PDFs and marksheets. The full compilation includes GS1-4 essays, optional papers, and the interview transcript.</p>
                {topper.bio && <p>{topper.bio}</p>}
              </div>
            </div>
          </section>
        )}

        {/* GREAT WEEKEND SALE */}
        <section className="mt-12">
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Offer</span>
                <h3 className="mt-2 text-lg font-bold text-white">
                  Starting at ₹99
                </h3>
                <p className="mt-1 text-sm text-emerald-200/80">
                  Starting at ₹99 · Instant download.
                </p>
              </div>
              <Link
                href="/store"
                data-track="topper-compilation-upsell-body"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                Shop Now &rarr;
              </Link>
            </div>
          </div>
        </section>

        <AnswerCopyPreview topper={topper} />

        {/* MARKS TABLE */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">What Were {topper.firstName} {topper.lastName}'s Marks in Each Paper?</h2>
          <p className="mt-1 text-sm text-muted-foreground">All India Rank {topper.rank} — UPSC CSE {topper.year}</p>

          {/* STRONGEST PAPER */}
          {(() => {
            const papers = [
              { label: "GS1", value: topper.marks.gs1 },
              { label: "GS2", value: topper.marks.gs2 },
              { label: "GS3", value: topper.marks.gs3 },
              { label: "GS4", value: topper.marks.gs4 },
              { label: "Essay", value: topper.marks.essay },
            ].filter((p) => p.value > 0);
            const sorted = [...papers].sort((a, b) => b.value - a.value);
            const best = sorted[0];
            return best ? (
              <div className="mt-4 rounded-xl border border-border/50 bg-primary/5 p-4">
                <p className="text-sm font-semibold">Strongest Paper: {best.label} ({best.value} marks)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topper.firstName} scored highest in {best.label}
                  {sorted.length > 1 ? ` — ${best.value - sorted[1].value} marks ahead of their next best paper` : ""}
                </p>
              </div>
            ) : null;
          })()}

          <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-left">Paper</th>
                  <th className="px-4 py-3 font-semibold text-right">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  { label: "GS1", marks: topper.marks.gs1 },
                  { label: "GS2", marks: topper.marks.gs2 },
                  { label: "GS3", marks: topper.marks.gs3 },
                  { label: "GS4 (Ethics)", marks: topper.marks.gs4 },
                  { label: "Essay", marks: topper.marks.essay },
                  { label: `${topper.optionalSubject} Paper 1`, marks: topper.marks.optional1 },
                  { label: `${topper.optionalSubject} Paper 2`, marks: topper.marks.optional2 },
                  { label: "Written Total", marks: topper.marks.written },
                  { label: "Interview", marks: topper.marks.interview },
                ]
                  .filter((r) => r.marks > 0)
                  .map((row) => (
                    <tr key={row.label} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                      <td className="px-4 py-3 font-semibold text-right">{row.marks}</td>
                    </tr>
                  ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right">{topper.marks.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* RESOURCE AVAILABILITY — which answer copies exist */}
        {(() => {
          const copies = topper.answerCopies || {};
          const available = Object.entries({
            Essay: copies.essay,
            "GS1": copies.gs1,
            "GS2": copies.gs2,
            "GS3": copies.gs3,
            "GS4": copies.gs4,
          }).filter(([, urls]) => urls && urls.length > 0);
          const totalPapers = 5;
          const availableCount = available.length;
          return (
            <section className="mt-12">
              <h2 className="text-xl font-semibold">{topper.firstName} {topper.lastName} Answer Copy Availability</h2>
              <p className="mt-1 text-sm text-muted-foreground">Which answer copies are available for this topper</p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                {["Essay", "GS1", "GS2", "GS3", "GS4"].map((paper) => {
                  const key = paper.toLowerCase() === "essay" ? "essay" : paper.toLowerCase();
                  const urls = copies[key as keyof typeof copies];
                  const isAvailable = Array.isArray(urls) && urls.length > 0;
                  return (
                    <div key={paper} className={`rounded-xl border p-4 text-center ${isAvailable ? "border-emerald-200 bg-emerald-50" : "border-border/50 bg-card opacity-60"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isAvailable ? "text-emerald-700" : "text-muted-foreground"}`}>
                        {isAvailable ? "Available" : "Coming Soon"}
                      </p>
                      <p className="mt-1 text-sm font-bold">{paper}</p>
                      {isAvailable && (
                        <p className="mt-0.5 text-[10px] text-emerald-600">{urls.length} copy{urls.length > 1 ? "ies" : "y"}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {availableCount === totalPapers
                  ? `All ${totalPapers} answer copies are available for ${topper.firstName} ${topper.lastName}.`
                  : `${availableCount} of ${totalPapers} paper copies available for ${topper.firstName} ${topper.lastName}${availableCount > 0 ? ". Download a free sample above" : " — check back soon"}.`}
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground/50">
                Copies are sourced from topper contributions, coaching records, and verified compilations. Each copy is cross-referenced for consistency with published marksheets.
              </p>
            </section>
          );
        })()}

        {/* MARKS IN CONTEXT */}
        {(() => {
          const m = topper.marks;
          const papers = [
            { label: "Essay", value: m.essay },
            { label: "GS1", value: m.gs1 },
            { label: "GS2", value: m.gs2 },
            { label: "GS3", value: m.gs3 },
            { label: "GS4", value: m.gs4 },
          ].filter(p => p.value > 0);
          if (papers.length === 0) return null;
          const sorted = [...papers].sort((a, b) => b.value - a.value);
          const best = sorted[0];
          const weakest = sorted[sorted.length - 1];
          const gap = best.value - weakest.value;
          return (
            <section className="mt-12">
              <h2 className="text-xl font-semibold">{topper.firstName} {topper.lastName} Marks Intelligence</h2>
              <p className="mt-1 text-sm text-muted-foreground">Paper-wise breakdown and performance analysis</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Strongest</p>
                  <p className="mt-1 text-lg font-bold">{best.label}</p>
                  <p className="text-sm text-emerald-700">{best.value} marks</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Scope to Improve</p>
                  <p className="mt-1 text-lg font-bold">{weakest.label}</p>
                  <p className="text-sm text-amber-700">{weakest.value} marks</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Marks Gap</p>
                  <p className="mt-1 text-lg font-bold">{gap} marks</p>
                  <p className="text-sm text-blue-700">Between best &amp; weakest paper</p>
                </div>
              </div>
              {topper.optionalSubject && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {topper.firstName} scored {m.optional1 + m.optional2} marks in {topper.optionalSubject} optional (Paper 1: {m.optional1}, Paper 2: {m.optional2}) — this contributed {(m.optional1 + m.optional2) > 0 ? Math.round((m.optional1 + m.optional2) / m.total * 100) : 0}% of total marks.
                </p>
              )}
            </section>
          );
        })()}

        {/* RELATED TOPPERS — moved higher for internal linking value */}
        {sameYearToppers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">UPSC {topper.year} Toppers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Browse answer copies and strategies of other UPSC {topper.year} rank holders</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sameYearToppers.map((t: any) => (
                <Link
                  key={t.slug}
                  href={`/upsc-topper/${t.slug}`}
                  data-track={`topper-related-${t.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition hover:-translate-y-px hover:border-primary/20"
                >
                  <img src={topperImageSrc(t)} alt={`${t.firstName} ${t.lastName}`} className="h-12 w-12 shrink-0 rounded-xl border border-border/50 bg-muted" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">AIR {t.rank}</p>
                    <p className="text-sm font-semibold truncate">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.optionalSubject}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/year/${topper.year}`} data-track="topper-view-all-year" className="text-sm text-primary font-medium hover:underline">
                View All UPSC {topper.year} Toppers &rarr;
              </Link>
            </div>
          </section>
        )}

        {sameRankToppers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Also AIR {topper.rank} Holders</h2>
            <p className="mt-1 text-sm text-muted-foreground">Other UPSC toppers who secured AIR {topper.rank}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sameRankToppers.map((t: any) => (
                <Link
                  key={t.slug}
                  href={`/upsc-topper/${t.slug}`}
                  data-track={`topper-samerank-${t.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition hover:-translate-y-px hover:border-primary/20"
                >
                  <img src={topperImageSrc(t)} alt={`${t.firstName} ${t.lastName}`} className="h-12 w-12 shrink-0 rounded-xl border border-border/50 bg-muted" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{t.year}</p>
                    <p className="text-sm font-semibold truncate">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.optionalSubject}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedToppers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Related {topper.optionalSubject} Toppers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Toppers who chose {topper.optionalSubject} as their optional subject</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedToppers.map((related: any) => (
                <Link
                  key={related.slug}
                  href={`/upsc-topper/${related.slug}`}
                  data-track={`topper-related-${related.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition hover:-translate-y-px hover:border-primary/20"
                >
                  <img src={topperImageSrc(related)} alt={`${related.firstName} ${related.lastName}`} className="h-12 w-12 shrink-0 rounded-xl border border-border/50 bg-muted" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">AIR {related.rank} &bull; {related.year}</p>
                    <p className="text-sm font-semibold truncate">{related.firstName} {related.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{related.optionalSubject}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href={`/optional/${getSubjectSlug(topper.optionalSubject)}`}
                data-track="topper-explore-related"
                className="text-sm text-primary font-medium hover:underline"
              >
                View All {topper.optionalSubject} Toppers &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* INSIGHTS */}
        {topper.insights?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">{topper.firstName} {topper.lastName} Key Insights</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {topper.insights.map((insight: string, index: number) => (
                <div key={index} className="rounded-xl border border-border/50 bg-card p-4">
                  <p className="text-sm leading-6">{insight}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Frequently Asked Questions about {topper.firstName} {topper.lastName}</h2>
          <div className="mt-4 divide-y divide-black/10">
            {[
              {
                q: `What was ${topper.firstName} ${topper.lastName}'s UPSC rank?`,
                a: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.`,
              },
              {
                q: `What was ${topper.firstName} ${topper.lastName}'s optional subject?`,
                a: `${topper.firstName} chose ${topper.optionalSubject} as the optional subject for UPSC CSE ${topper.year}.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s total marks in UPSC?`,
                a: `${topper.firstName} obtained a total of ${topper.marks.total} marks in UPSC CSE ${topper.year}.`,
              },
              {
                q: `Can I download ${topper.firstName} ${topper.lastName}'s answer copy PDF?`,
                a: `Yes. Get a <strong>free</strong> sample answer copy of ${topper.firstName} ${topper.lastName} by entering your email on this page — we will send the download link instantly. The full set of ${topper.firstName}'s copies across all papers is available in the <a href="/store" class="text-emerald-600 font-semibold underline">Shop Now</a> — Starting at ₹99.`,
              },
              {
                q: `Where can I find ${topper.firstName} ${topper.lastName} answer copy?`,
                a: `You can <strong>download a free sample</strong> of ${topper.firstName} ${topper.lastName}'s UPSC answer copy directly from this page — enter your email and we will send the PDF. The full set is in the <a href="/store" class="text-emerald-600 font-semibold underline">Shop Now</a> — Starting at ₹99.`,
              },
              {
                q: `How did ${topper.firstName} ${topper.lastName} prepare for UPSC?`,
                a: topper.strategy
                  ? `${topper.firstName} ${topper.lastName}'s preparation strategy is detailed above on this page.`
                  : `Detailed preparation strategy for ${topper.firstName} ${topper.lastName} is not yet available.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s ethics (GS4) marks?`,
                a: `${topper.firstName} scored ${topper.marks.gs4} marks in the GS4 (Ethics) paper of UPSC CSE ${topper.year}.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s optional subject marks?`,
                a: `${topper.firstName} scored ${topper.marks.optional1} in ${topper.optionalSubject} Paper 1 and ${topper.marks.optional2} in Paper 2, totaling ${topper.marks.optional1 + topper.marks.optional2} marks in the optional.`,
              },
              {
                q: `What is ${topper.firstName} ${topper.lastName}'s educational background?`,
                a: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}. Details about their graduation and educational background are mentioned in the strategy section above.`,
              },
              {
                q: `Which coaching did ${topper.firstName} ${topper.lastName} join for UPSC?`,
                a: topper.strategy?.toLowerCase().includes("coaching") || topper.strategy?.toLowerCase().includes("class")
                  ? `${topper.firstName}'s coaching details are mentioned in the preparation strategy section above.`
                  : `Coaching details for ${topper.firstName} ${topper.lastName} are not available. Many UPSC toppers rely on self-study and mock test series.`,
              },
              {
                q: `How many attempts did ${topper.firstName} ${topper.lastName} take for UPSC?`,
                a: `The number of attempts ${topper.firstName} ${topper.lastName} took for UPSC CSE is covered in their preparation journey — refer to the strategy section above for attempt details and timeline.`,
              },
              {
                q: `What books did ${topper.firstName} ${topper.lastName} use for UPSC preparation?`,
                a: topper.strategy?.toLowerCase().includes("book") || topper.strategy?.toLowerCase().includes("ncert") || topper.strategy?.toLowerCase().includes("standard")
                  ? `${topper.firstName}'s book list and recommended resources are detailed in the preparation strategy section above.`
                  : `Book recommendations for ${topper.firstName} ${topper.lastName} are not separately listed. Check the strategy section for their subject-wise preparation approach.`,
              },
              {
                q: `Did ${topper.firstName} ${topper.lastName} take any coaching for UPSC?`,
                a: topper.strategy?.toLowerCase().includes("coaching")
                  ? `${topper.firstName}'s coaching details are covered in the preparation strategy section.`
                  : `Coaching details for ${topper.firstName} ${topper.lastName} are not explicitly mentioned. Many top-ranked toppers, especially those with AIR under 50, rely on a combination of self-study and test series.`,
              },
              {
                q: `What was ${topper.firstName} ${topper.lastName}'s GS1 strategy?`,
                a: `${topper.firstName} ${topper.lastName} scored ${topper.marks.gs1} marks in GS1 (Indian Heritage & Culture, History, Geography). ${topper.strategy?.toLowerCase().includes("gs1") ? "Their GS1 preparation approach is covered in the strategy section above." : "For GS1 preparation strategies, refer to the detailed approach outlined in the strategy section."}`,
              },
              {
                q: `How many hours did ${topper.firstName} ${topper.lastName} study daily?`,
                a: `Daily study hours for ${topper.firstName} ${topper.lastName} are discussed in the preparation strategy section above when available. Most UPSC toppers maintain 6-8 hours of focused study during peak preparation, with variations based on their work status and personal circumstances.`,
              },
              {
                q: `What was ${topper.firstName} ${topper.lastName}'s optional subject preparation strategy?`,
                a: `${topper.firstName} chose ${topper.optionalSubject} as their optional subject. ${topper.strategy?.toLowerCase().includes(topper.optionalSubject?.toLowerCase() || "") ? "Their optional subject strategy is covered in the preparation section above." : `The strategy section above details ${topper.firstName}'s overall approach, including optional subject preparation where available.`} ${topper.optionalSubject} has produced strong results in UPSC CSE — for more toppers who opted for this subject, visit the <a href="/optional/${getSubjectSlug(topper.optionalSubject)}" class="text-emerald-600 font-semibold underline">${topper.optionalSubject} optional page</a>.`,
              },
              {
                q: `Where is ${topper.firstName} ${topper.lastName} now?`,
                a: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}. After selection, UPSC toppers typically undergo training at Lal Bahadur Shastri National Academy of Administration (LBSNAA), Mussoorie, followed by service-specific training. Their current posting and service allocation details are updated when available.`,
              },
              {
                q: `How do I know these answer copies are authentic?`,
                a: `Every answer copy on UPSCPrepNotes is sourced from topper contributions, coaching institute records, or verified compilations. We cross-reference each copy against published marksheets, interview transcripts, and topper interviews for consistency. While UPSC itself does not publicly release answer books, the copies we host are checked for structural and content alignment with the topper's known performance. If you have specific concerns about a copy, use the <strong>Report</strong> button on this page to flag it for review.`,
              },
            ].map((faq, index) => (
              <div key={index} className="py-3 first:pt-0 last:pb-0">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <div className="mt-1 text-sm leading-6 text-muted-foreground prose prose-zinc max-w-none prose-a:text-emerald-600 prose-a:font-semibold">
                  <ReactMarkdown>{faq.a}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ALSO VIEW — interlinks top 5 winning pages */}
        {[{
          name: "Divya Tanwar", slug: "divya-tanwar", rank: 52, year: 2024,
        }, {
          name: "Garima Lohia", slug: "garima-lohia", rank: 2, year: 2024,
        }, {
          name: "Uma Harathi", slug: "uma-harathi-n", rank: 3, year: 2024,
        }, {
          name: "Ayan Jain", slug: "ayan-jain", rank: 56, year: 2024,
        }, {
          name: "Shruti Sharma", slug: "shruti-sharma", rank: 1, year: 2021,
        }].filter(t => t.slug !== topper.slug).slice(0, 4).length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Also View These UPSC Toppers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Popular topper pages — answer copies, marksheets &amp; strategies</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{
                name: "Divya Tanwar", slug: "divya-tanwar", rank: 52, year: 2024,
              }, {
                name: "Garima Lohia", slug: "garima-lohia", rank: 2, year: 2024,
              }, {
                name: "Uma Harathi", slug: "uma-harathi-n", rank: 3, year: 2024,
              }, {
                name: "Ayan Jain", slug: "ayan-jain", rank: 56, year: 2024,
              }, {
                name: "Shruti Sharma", slug: "shruti-sharma", rank: 1, year: 2021,
              }].filter(t => t.slug !== topper.slug).slice(0, 4).map((t) => (
                <Link
                  key={t.slug}
                  href={`/upsc-topper/${t.slug}`}
                  data-track={`topper-also-view-${t.slug}`}
                  className="rounded-xl border border-border/50 bg-card p-4 text-center transition hover:-translate-y-px hover:border-primary/20"
                >
                  <p className="text-xs text-muted-foreground">AIR {t.rank} &middot; {t.year}</p>
                  <p className="mt-1 text-sm font-semibold">{t.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* EXPLORE MORE */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Explore More</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/store" data-track="topper-explore-compilation">Shop Now — ₹99 &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} data-track="topper-explore-optional">All {topper.optionalSubject} Toppers &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href={`/year/${topper.year}`} data-track="topper-explore-year">UPSC {topper.year} Toppers &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/content/how-to-write-upsc-mains-answers" data-track="topper-explore-answer-writing">How to Write UPSC Answers &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/content/upsc-topper-answer-copies" data-track="topper-explore-guide">Topper Answer Copies Guide &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/free-materials?category=optional" data-track="topper-explore-subject-materials">Free {topper.optionalSubject} Materials &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/free-materials" data-track="topper-explore-free-materials">All Free Study Material &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/ask" data-track="topper-ask-ai-mentor">Ask AI Mentor &rarr;</Link>
            </Button>
          </div>
        </section>
      </div>
      </main>
      <ExitPopup />
    </>
  );
}
