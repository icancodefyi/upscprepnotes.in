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

  let desc = `${name} UPSC Marksheet — AIR ${rank} (${year}). ${name} Answer Copies & Resources.`;
  if (essay) desc += ` ${name} Essay Copies — ${essay} Marks.`;
  if (gs1) desc += ` ${name} GS1 Copies — ${gs1} Marks.`;
  if (gs2) desc += ` ${name} GS2 Copies — ${gs2} Marks.`;
  if (gs3) desc += ` ${name} GS3 Copies — ${gs3} Marks.`;
  if (gs4) desc += ` ${name} GS4 Copies — ${gs4} Marks.`;
  if (opt1 && subject) desc += ` ${name} ${subject} Copies — ${opt1} Marks.`;
  desc += ` UPSC AIR ${rank} (${year}).`;
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
    title: `${topper.firstName} ${topper.lastName} — UPSC Marksheet, Optional Subject, Answer Copy & Strategy (AIR ${topper.rank}, ${topper.year})`,
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
          text: `Yes. ${topper.firstName} ${topper.lastName}'s actual UPSC Mains answer copy PDF is available in the Complete Bundle which includes answer sheets from 50+ toppers across GS1-4, Essay and Optional papers at just ₹11 per copy (₹799 total).`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I find ${topper.firstName} ${topper.lastName} answer copy?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topper.firstName} ${topper.lastName}'s UPSC answer copy is part of the Topper Answer Copy Compilation with 50+ verified copies across all GS papers, Essay and Optional subjects. Get the bundle at ₹799 — just ₹11 per copy.`,
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
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {topper.firstName} {topper.lastName} UPSC marksheet — AIR {topper.rank} ({topper.year}) with {topper.optionalSubject} optional. Download actual UPSC Mains answer copy PDF with marks breakdown across GS Papers, essay and {topper.optionalSubject}.
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
        />

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

        {/* STRATEGY */}
        {topper.strategy && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">{topper.firstName} {topper.lastName} Preparation Strategy</h2>
            <p className="mt-1 text-sm text-muted-foreground">How they prepared for UPSC CSE {topper.year}</p>
            <div className="mt-4 rounded-xl border border-border/50 bg-card p-6">
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-7 prose-p:text-sm prose-headings:text-base">
                {Object.keys(structuredStrategy).length > 0 ? (
                  Object.entries(structuredStrategy).map(
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
                  )
                ) : (
                  <ReactMarkdown>{topper.strategy}</ReactMarkdown>
                )}
              </div>
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
                a: `Yes. ${topper.firstName} ${topper.lastName}'s actual UPSC Mains answer copy PDF is available in the Complete Bundle — 50+ topper copies across GS1-4, Essay and Optional papers at just ₹11 per copy (₹799 total). Get the bundle to access the exact answer copy.`,
              },
              {
                q: `Where can I find ${topper.firstName} ${topper.lastName} answer copy?`,
                a: `${topper.firstName} ${topper.lastName}'s UPSC answer copy is part of the Topper Answer Copy Compilation — 50+ verified copies across all GS papers, Essay and Optional subjects. Get the entire bundle at ₹799 (just ₹11 per copy).`,
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
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EXPLORE MORE */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Explore More</h2>
          <div className="mt-4 flex flex-wrap gap-2">
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
              <Link href="/free-materials?category=optional" data-track="topper-explore-subject-materials">Free {topper.optionalSubject} Materials &rarr;</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full text-xs h-9">
              <Link href="/free-materials" data-track="topper-explore-free-materials">All Free Study Material &rarr;</Link>
            </Button>
          </div>
        </section>

        {/* RELATED TOPPERS */}
        {sameYearToppers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">UPSC {topper.year} Toppers</h2>
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
          </section>
        )}

        {relatedToppers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Related {topper.optionalSubject} Toppers</h2>
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
      </div>
      </main>
      <ExitPopup />
    </>
  );
}
