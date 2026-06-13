import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
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

export const revalidate = 86400;

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

  return {
    title: `${topper.firstName} ${topper.lastName} Answer Copy PDF — Free Download, UPSC Marksheet & Strategy (AIR ${topper.rank}, ${topper.year})`,
    description: buildMetaDescription(topper),
    alternates: {
      canonical: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
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
    };
    if (slugMap[s]) return slugMap[s];
    return s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
          text: `Yes. Get a free sample answer copy of ${topper.firstName} ${topper.lastName} by entering your email — we will send the download link instantly. The full set with all papers is in the Complete Compilation with 50+ topper copies at ₹11 per copy.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I find ${topper.firstName} ${topper.lastName} answer copy?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Download a free sample of ${topper.firstName} ${topper.lastName}'s UPSC answer copy directly from the topper page — enter your email and we will send the PDF. The full compilation with all papers is available at ₹799.`,
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

      <div className="mx-auto max-w-6xl px-6 py-10">
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
              {topper.firstName} {topper.lastName} UPSC marksheet — AIR {topper.rank} ({topper.year}) with {topper.optionalSubject} optional. Download actual UPSC Mains answer copy PDF with marks breakdown across GS Papers, essay and {topper.optionalSubject}.
            </p>
            <p className="mt-2 text-sm leading-6">
              <Link href="/toppers/toppers-copy-compilation" className="text-emerald-600 font-semibold hover:underline" data-track="topper-compilation-body">
                Get the Complete Compilation →
              </Link>
              <span className="text-muted-foreground"> — all {topper.firstName}&apos;s answer copies + 50+ toppers across GS1–4, Essay &amp; Optional. ₹799 only.</span>
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
            <h2 className="text-xl font-semibold">{topper.firstName} {topper.lastName} Preparation Strategy</h2>
            <p className="mt-1 text-sm text-muted-foreground">How they prepared for UPSC CSE {topper.year}</p>
            <div className="mt-4 rounded-xl border border-border/50 bg-card p-6">
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-7 prose-p:text-sm prose-headings:text-base">
                {Object.keys(structuredStrategy).length > 0 ? (
                  <>
                    {/* First 2 sections — fully visible */}
                    {Object.entries(structuredStrategy).slice(0, 2).map(
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
                    {Object.keys(structuredStrategy).length > 2 && (
                      <div className="relative mt-4">
                        <div className="overflow-hidden" style={{ maxHeight: "320px" }}>
                          <div className="blur-sm opacity-30 pointer-events-none select-none">
                            {Object.entries(structuredStrategy).slice(2).map(
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
                          blurredCount={Object.keys(structuredStrategy).length - 2}
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

        {/* VISIBLE COMPILATION UPSELL — money page link, visible without dialog interaction */}
        <section className="mt-12">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Complete Compilation</span>
                <h2 className="mt-2 text-lg font-bold text-gray-900">
                  {topper.firstName}&apos;s Answer Copies + 50+ Toppers
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Every paper (GS1-4, Essay, Optional) of {topper.firstName} plus 50+ other toppers. All at just ₹11 per copy.
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">₹799</span>
                  <span className="text-sm text-gray-500 line-through">₹4,999</span>
                  <span className="text-xs text-emerald-700 font-semibold">83% off</span>
                </div>
              </div>
              <Link
                href="/toppers/toppers-copy-compilation"
                data-track="topper-compilation-upsell-body"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Get the Complete Compilation &rarr;
              </Link>
            </div>
          </div>
        </section>

        <AnswerCopyPreview topper={topper} />

        {/* MARKS TABLE */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">{topper.firstName} {topper.lastName} Marks Breakdown</h2>
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

        {/* RELATED TOPPERS — moved higher for internal linking value */}
        {sameYearToppers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">UPSC {topper.year} Toppers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Browse answer copies and strategies of other UPSC {topper.year} rank holders</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          <h2 className="text-xl font-semibold">FAQs about {topper.firstName} {topper.lastName}</h2>
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
                a: `Yes. Get a <strong>free</strong> sample answer copy of ${topper.firstName} ${topper.lastName} by entering your email on this page — we will send the download link instantly. The full set of ${topper.firstName}'s copies across all papers is available in the <a href="/toppers/toppers-copy-compilation" class="text-emerald-600 font-semibold underline">Complete Compilation</a> with 50+ topper copies at just ₹11 per copy (₹799 total).`,
              },
              {
                q: `Where can I find ${topper.firstName} ${topper.lastName} answer copy?`,
                a: `You can <strong>download a free sample</strong> of ${topper.firstName} ${topper.lastName}'s UPSC answer copy directly from this page — enter your email and we will send the PDF. The full compilation with all papers (GS1-4, Essay, Optional) is in the <a href="/toppers/toppers-copy-compilation" class="text-emerald-600 font-semibold underline">Topper Answer Copy Compilation</a> at ₹799.`,
              },
              {
                q: `How did ${topper.firstName} ${topper.lastName} prepare for UPSC?`,
                a: topper.strategy
                  ? `${topper.firstName} ${topper.lastName}'s preparation strategy is detailed above on this page.`
                  : `Detailed preparation strategy for ${topper.firstName} ${topper.lastName} is not yet available.`,
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

        {/* EXPLORE MORE */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Explore More</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/toppers/toppers-copy-compilation" data-track="topper-explore-compilation">Complete Compilation (₹799) &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} data-track="topper-explore-optional">All {topper.optionalSubject} Toppers &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href={`/year/${topper.year}`} data-track="topper-explore-year">UPSC {topper.year} Toppers &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/how-to-write-upsc-mains-answers" data-track="topper-explore-answer-writing">How to Write UPSC Answers &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/upsc-topper-answer-copies" data-track="topper-explore-guide">Topper Answer Copies Guide &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/free-materials?category=optional" data-track="topper-explore-subject-materials">Free {topper.optionalSubject} Materials &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/free-materials" data-track="topper-explore-free-materials">All Free Study Material &rarr;</Link>
            </Button>
          </div>
        </section>
      </div>
      </main>
      <ExitPopup />
    </>
  );
}
