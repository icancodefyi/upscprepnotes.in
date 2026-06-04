import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  getRelatedToppers,
  getTopperBySlug,
  getToppersByRank,
  getToppersByYear,
} from "@/services/topper.service";
import AnswerCopyCard from "@/components/topper/AnswerCopyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { topperImageSrc } from "@/lib/utils";
import TrackingProvider from "./TrackingProvider";

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
  const total = topper.marks?.total ?? "";
  const written = topper.marks?.written ?? "";
  const interview = topper.marks?.interview ?? "";
  const gs1 = topper.marks?.gs1 ?? "";
  const gs2 = topper.marks?.gs2 ?? "";
  const gs3 = topper.marks?.gs3 ?? "";
  const gs4 = topper.marks?.gs4 ?? "";
  const essay = topper.marks?.essay ?? "";
  const opt1 = topper.marks?.optional1 ?? "";

  let desc = `UPSC ${name} marksheet — AIR ${rank} (${year})`;
  if (total) desc += ` scored ${total} marks total.`;
  if (subject) desc += ` Optional: ${subject}.`;
  desc += ` Written: ${written || "—"} Interview: ${interview || "—"}.`;
  if (gs1) desc += ` GS1:${gs1}`;
  if (gs2) desc += ` GS2:${gs2}`;
  if (gs3) desc += ` GS3:${gs3}`;
  if (gs4) desc += ` GS4:${gs4}`;
  if (essay) desc += ` Essay:${essay}`;
  if (opt1 && subject) desc += ` ${subject.replace(/\s+/g, "")}:${opt1}`;
  desc += ` Preparation strategy, biography & answer copies at ₹11/copy.`;

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
    title: `${topper.firstName} ${topper.lastName} — UPSC Marksheet, Strategy & Answer Copy (AIR ${topper.rank}, ${topper.year})`,
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

  const answerCopyPapers = [
    { key: "gs1", title: "GS1 Answer Copy", marks: topper.marks.gs1 },
    { key: "gs2", title: "GS2 Answer Copy", marks: topper.marks.gs2 },
    { key: "gs3", title: "GS3 Answer Copy", marks: topper.marks.gs3 },
    { key: "gs4", title: "GS4 (Ethics) Answer Copy", marks: topper.marks.gs4 },
    { key: "essay", title: "Essay Answer Copy", marks: topper.marks.essay },
    { key: "optional", title: `${topper.optionalSubject} Answer Copy`, marks: topper.marks.optional1 },
  ];

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
    <main className="min-h-screen">
      <TrackingProvider name={`${topper.firstName} ${topper.lastName}`} />
      {/* JSON-LD Schemas */}
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

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-10">
        {/* BREADCRUMB */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground" data-track="topper-breadcrumb-home">
            Home
          </Link>
          <span>•</span>
          <Link
            href={`/year/${topper.year}`}
            className="transition hover:text-foreground"
            data-track="topper-breadcrumb-year"
          >
            {topper.year}
          </Link>
          <span>•</span>
          <Link
            href={`/optional/${getSubjectSlug(topper.optionalSubject)}`}
            className="transition hover:text-foreground"
            data-track="topper-breadcrumb-optional"
          >
            {topper.optionalSubject}
          </Link>
        </div>

        {/* HERO */}
        <section className="mb-20">
          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* LEFT — Visual Identity */}
            <div className="lg:sticky lg:top-10 lg:h-fit">
              <div className="overflow-hidden rounded-[32px] border border-border/50 bg-card shadow-lg shadow-primary/5">
                <img
                  src={topperImageSrc(topper)}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  className="h-full w-full bg-muted"
                />
              </div>

              <div className="mt-4 space-y-3">
                <Card className="rounded-2xl border-border/50 text-center">
                  <CardContent className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      AIR
                    </p>
                    <p className="mt-1 text-5xl font-black tracking-tight text-primary">
                      {topper.rank}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-3">
                  <Card className="rounded-2xl border-border/50 text-center">
                    <CardContent className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Total
                      </p>
                      <p className="mt-0.5 text-lg font-bold">
                        {topper.marks.total}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/50 text-center">
                    <CardContent className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Year
                      </p>
                      <p className="mt-0.5 text-lg font-bold">{topper.year}</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/50 text-center">
                    <CardContent className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        Interview
                      </p>
                      <p className="mt-0.5 text-lg font-bold">
                        {topper.marks.interview}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* RIGHT — Identity + Authority */}
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge className="rounded-full px-4 py-1.5 text-xs font-medium">
                  {topper.optionalSubject}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  UPSC {topper.year}
                </Badge>
                {topper.marks.interview > 0 && (
                  <Badge
                    variant="outline"
                    className="rounded-full px-4 py-1.5 text-xs font-medium"
                  >
                    Interview {topper.marks.interview}
                  </Badge>
                )}
              </div>

              <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl leading-[1.05]">
                {topper.firstName} {topper.lastName} — Answer Copy &amp; Strategy
              </h1>
              <p className="mt-3 text-2xl font-medium text-primary">
                AIR {topper.rank} &middot; {topper.marks.total} Total Marks
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                Download {topper.firstName} {topper.lastName}&apos;s actual UPSC Mains answer copy PDF. See the exact answer sheets, marks breakdown, and preparation strategy for GS Papers and {topper.optionalSubject || "Optional Subject"}.
              </p>
              {topper.bio && (
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
                  {topper.bio}
                </p>
              )}

              {/* QUICK STATS */}
              <Card className="mt-8 overflow-hidden rounded-[30px] border-border/50">
                <CardContent className="grid p-0 md:grid-cols-4">
                  {[
                    { label: "Written", value: topper.marks.written },
                    { label: "Essay", value: topper.marks.essay },
                    { label: "Interview", value: topper.marks.interview },
                    { label: "Total", value: topper.marks.total },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="border-b border-border/50 p-6 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* PERCENTILE INSIGHT */}
              <Card className="mt-4 rounded-2xl border-border/50 bg-primary/5">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-sm font-bold text-primary">
                    &#9733;
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {topper.rank <= 10
                        ? "Elite Performer"
                        : topper.rank <= 50
                          ? "Top Tier Performer"
                          : "Top Performer"}
                    </p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Ranked <strong>#{topper.rank}</strong> nationally out of
                      ~1M aspirants.
                      {topper.marks.total > 0 && (
                        <>
                          {" "}
                          Scored <strong>{topper.marks.total}</strong> total
                          marks across all papers.
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* ASK AI ABOUT THIS TOPPER */}
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/5 hover:text-primary">
                  <Link href={`/ask?q=Tell me about ${topper.firstName} ${topper.lastName}'s UPSC strategy`} data-track="topper-ask-ai">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Ask AI about {topper.firstName}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* HERO CTA — convert right after seeing the topper */}
        <section className="mb-16 -mt-4">
          <Link
            href="/toppers/toppers-copy-compilation"
            data-track="topper-hero-cta"
            className="group block rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Get {topper.firstName}&apos;s Complete Answer Copy
                </p>
                <p className="mt-1 text-sm text-emerald-600">
                  All {topper.firstName}&apos;s papers + 50+ topper copies + 21 strategy guides — just <span className="font-bold">₹11/copy</span>
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition group-hover:bg-emerald-500">
                See Bundle at ₹799 &rarr;
              </span>
            </div>
          </Link>
        </section>

        {/* QUICK FACTS — machine-readable summary for LLM extraction */}
        <section className="mb-16">
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Quick Facts
            </p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="mt-0.5 font-semibold">
                  {topper.firstName} {topper.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Rank</dt>
                <dd className="mt-0.5 font-semibold">AIR {topper.rank}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Year</dt>
                <dd className="mt-0.5 font-semibold">{topper.year}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Optional</dt>
                <dd className="mt-0.5 font-semibold">
                  {topper.optionalSubject}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Essay</dt>
                <dd className="mt-0.5 font-semibold">{topper.marks.essay}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Written</dt>
                <dd className="mt-0.5 font-semibold">{topper.marks.written}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Interview</dt>
                <dd className="mt-0.5 font-semibold">
                  {topper.marks.interview}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Total</dt>
                <dd className="mt-0.5 font-semibold">{topper.marks.total}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* RESOURCE INTENT — answer copies listing */}
        <section className="mb-16">
          <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm">
            <span className="font-semibold text-emerald-800">₹11 per copy</span>
            <span className="text-emerald-700"> — all {topper.firstName}&apos;s answer sheets + 50+ topper copies &amp; 21 strategy guides in one bundle. </span>
            <Link href="/toppers/toppers-copy-compilation" data-track="topper-inline-bundle" className="font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-600">
              Get at ₹799 →
            </Link>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Answer Copies
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                {topper.firstName} {topper.lastName}&apos;s Answer Copies: See How They Scored AIR {topper.rank}
              </h2>
            </div>

            <div className="hidden max-w-sm text-sm leading-7 text-muted-foreground md:block">
              Every answer copy is inside the Complete Bundle — 50+ topper copies, 21 strategy guides &amp; more.
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {answerCopyPapers.map((p) => (
              <AnswerCopyCard
                key={p.key}
                title={p.title}
                marks={p.marks}
                topperName={`${topper.firstName} ${topper.lastName}`}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/toppers/toppers-copy-compilation"
              data-track="topper-copies-cta"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            >
              See Full Answer Copies in Bundle &rarr;
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              All 6 papers — GS1-4, Essay &amp; Optional — just <span className="font-bold text-primary">₹11/copy</span>
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">
              50+ topper copies + 21 strategy guides for ₹799
            </p>
          </div>
        </section>

        {/* MARKS */}
        <section className="mb-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Marks Intelligence
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                {topper.firstName} {topper.lastName} Marks Breakdown
              </h2>
            </div>

            <p className="hidden max-w-sm text-sm leading-7 text-muted-foreground lg:block">
              Structured marks analysis across General Studies, optional subject
              papers, essay, and personality test.
            </p>
          </div>

          {/* STRONGEST PAPER INSIGHT */}
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
              <Card className="mb-8 rounded-2xl border-border/50 bg-primary/5">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-lg font-bold text-primary">
                    {best.value}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Strongest Paper</p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      {topper.firstName} scored the highest in{" "}
                      <strong>{best.label}</strong> with{" "}
                      <strong>{best.value} marks</strong>
                      {sorted.length > 1 && (
                        <>
                          {" "}
                          — {best.value - sorted[1].value} marks ahead of their
                          next best paper.
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null;
          })()}

          <div className="overflow-hidden rounded-[36px] border border-border/50 bg-card">
            <div className="grid md:grid-cols-3">
              {/* GS */}
              <div className="border-b border-border/50 p-8 md:border-b-0 md:border-r">
                <h3 className="mb-8 text-lg font-semibold">
                  {topper.firstName} {topper.lastName} GS Marks
                </h3>

                <div className="space-y-5">
                  {[
                    {
                      label: "GS1",
                      value: topper.marks.gs1,
                    },
                    {
                      label: "GS2",
                      value: topper.marks.gs2,
                    },
                    {
                      label: "GS3",
                      value: topper.marks.gs3,
                    },
                    {
                      label: "GS4",
                      value: topper.marks.gs4,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>

                      <div className="h-[2px] bg-zinc-200">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(item.value / 150) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPTIONAL */}
              <div className="border-b border-border/50 p-8 md:border-b-0 md:border-r">
                <h3 className="mb-8 text-lg font-semibold">
                  {topper.firstName} {topper.lastName} {topper.optionalSubject}{" "}
                  Marks
                </h3>

                <div className="rounded-2xl bg-[#f6f6f6] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Subject
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {topper.optionalSubject}
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      label: "Paper 1",
                      value: topper.marks.optional1,
                    },
                    {
                      label: "Paper 2",
                      value: topper.marks.optional2,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>

                      <div className="h-[2px] bg-zinc-200">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(item.value / 180) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FINAL */}
              <div className="p-8">
                <h3 className="mb-8 text-lg font-semibold">
                  {topper.firstName} {topper.lastName} Final Scores
                </h3>

                <div className="space-y-5">
                  {[
                    {
                      label: "Essay",
                      value: topper.marks.essay,
                    },
                    {
                      label: "Written",
                      value: topper.marks.written,
                    },
                    {
                      label: "Interview",
                      value: topper.marks.interview,
                    },
                    {
                      label: "Total",
                      value: topper.marks.total,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-border/50 pb-4 last:border-b-0"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>

                      <span className="text-lg font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKS TABLE — structured data for LLM extraction */}
        <section className="mb-20">
          <div className="overflow-hidden rounded-2xl border border-border/50">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="p-4 font-semibold">Paper</th>
                  <th className="p-4 font-semibold">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  { label: "GS1", marks: topper.marks.gs1 },
                  { label: "GS2", marks: topper.marks.gs2 },
                  { label: "GS3", marks: topper.marks.gs3 },
                  { label: "GS4", marks: topper.marks.gs4 },
                  { label: "Essay", marks: topper.marks.essay },
                  {
                    label: `${topper.optionalSubject} Paper 1`,
                    marks: topper.marks.optional1,
                  },
                  {
                    label: `${topper.optionalSubject} Paper 2`,
                    marks: topper.marks.optional2,
                  },
                  { label: "Written Total", marks: topper.marks.written },
                  { label: "Interview", marks: topper.marks.interview },
                  { label: "Total", marks: topper.marks.total },
                ]
                  .filter((r) => r.marks > 0)
                  .map((row) => (
                    <tr key={row.label} className="hover:bg-muted/30">
                      <td className="p-4 text-muted-foreground">{row.label}</td>
                      <td className="p-4 font-semibold">{row.marks}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* INSIGHTS */}
        {topper.insights?.length > 0 && (
          <section className="mb-20">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Key Insights
            </p>

            <h2 className="mb-10 text-4xl font-semibold tracking-tight">
              {topper.firstName} {topper.lastName} Key Insights & Learnings
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {topper.insights.map((insight: string, index: number) => (
                <div
                  key={index}
                  className="rounded-3xl border border-border/50 bg-card p-6"
                >
                  <p className="leading-8 text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STRATEGY */}
        <section className="mb-20">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Strategy Archive
          </p>

          <h2 className="mb-10 text-4xl font-semibold tracking-tight">
            {topper.firstName} {topper.lastName} Preparation Strategy
          </h2>

          <article className="max-w-4xl">
            <div className="rounded-[36px] border border-border/50 bg-card p-8 md:p-12">
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-8">
                {Object.keys(structuredStrategy).length > 0 ? (
                  Object.entries(structuredStrategy).map(
                    ([heading, content], i) => (
                      <section
                        key={heading}
                        className={
                          i > 0 ? "mt-12 border-l-2 border-l-primary pl-6" : ""
                        }
                      >
                        <h3 className="text-2xl font-bold tracking-tight">
                          {resolveHeading(heading, topper)}
                        </h3>
                        <div className="mt-4">
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
          </article>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            FAQ
          </p>

          <h2 className="mb-10 text-4xl font-semibold tracking-tight">
            FAQs about {topper.firstName} {topper.lastName}
          </h2>

          <div className="divide-y divide-black/10">
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
                q: `What were ${topper.firstName} ${topper.lastName}'s interview marks?`,
                a: `${topper.firstName} scored ${topper.marks.interview} marks in the UPSC personality test (interview).`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s total marks in UPSC?`,
                a: `${topper.firstName} obtained a total of ${topper.marks.total} marks in UPSC CSE ${topper.year}.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s GS1 marks?`,
                a: `${topper.firstName} scored ${topper.marks.gs1} marks in GS1 paper.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s GS2 marks?`,
                a: `${topper.firstName} scored ${topper.marks.gs2} marks in GS2 paper.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s GS3 marks?`,
                a: `${topper.firstName} scored ${topper.marks.gs3} marks in GS3 paper.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s GS4 (Ethics) marks?`,
                a: `${topper.firstName} scored ${topper.marks.gs4} marks in GS4 (Ethics) paper.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s essay marks?`,
                a: `${topper.firstName} scored ${topper.marks.essay} marks in the essay paper.`,
              },
              {
                q: `What were ${topper.firstName} ${topper.lastName}'s optional subject marks?`,
                a: `${topper.firstName} scored ${topper.marks.optional1} in Paper 1 and ${topper.marks.optional2} in Paper 2 of ${topper.optionalSubject}.`,
              },
              {
                q: `What was ${topper.firstName} ${topper.lastName}'s written score?`,
                a: `${topper.firstName} scored ${topper.marks.written} marks in the written (mains) component.`,
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
                  ? `${topper.firstName} ${topper.lastName}'s preparation strategy is detailed in the Preparation Strategy section on this page.`
                  : `Detailed preparation strategy for ${topper.firstName} ${topper.lastName} is not yet available.`,
              },
            ].map((faq, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <h3 className="text-base font-semibold">{faq.q}</h3>
                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKS — SEO hub linking */}
        <section className="mb-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Explore More
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild className="rounded-full">
              <Link
                href={`/optional/${getSubjectSlug(topper.optionalSubject)}`}
                data-track="topper-explore-optional"
              >
                All {topper.optionalSubject} Toppers →
              </Link>
            </Button>

            <Button variant="outline" asChild className="rounded-full">
              <Link href={`/year/${topper.year}`} data-track="topper-explore-year">
                UPSC {topper.year} Toppers →
              </Link>
            </Button>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/" data-track="topper-explore-all">All UPSC Toppers →</Link>
            </Button>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/free-materials?category=optional" data-track="topper-explore-subject-materials">
                Free {topper.optionalSubject} Materials →
              </Link>
            </Button>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/free-materials" data-track="topper-explore-free-materials">
                All Free Study Material →
              </Link>
            </Button>
          </div>
        </section>

        {/* SAME RANK */}
        {sameRankToppers.length > 0 && (
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Comparable AIR {topper.rank} Profiles
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Candidates who secured the same rank across different years
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sameRankToppers.map((t: any) => (
                <Link
                  key={t.slug}
                  href={`/upsc-topper/${t.slug}`}
                  data-track={`topper-related-${t.slug}`}
                  className="group rounded-[28px] border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={topperImageSrc(t)}
                      alt={`${t.firstName} ${t.lastName}`}
                      className="h-16 w-16 shrink-0 rounded-2xl border border-border/50 bg-muted"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {t.year}
                        </p>
                        <Badge className="rounded-md px-1.5 py-0 text-[10px] leading-none">
                          AIR {topper.rank}
                        </Badge>
                      </div>
                      <h3 className="mt-1.5 text-lg font-semibold leading-snug">
                        {t.firstName} {t.lastName}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.optionalSubject}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SAME YEAR */}
        {sameYearToppers.length > 0 && (
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Year Rank Holders — UPSC {topper.year}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Top rank holders from the same year
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sameYearToppers.map((t: any) => (
                <Link
                  key={t.slug}
                  href={`/upsc-topper/${t.slug}`}
                  data-track={`topper-related-${t.slug}`}
                  className="group rounded-[28px] border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={topperImageSrc(t)}
                      alt={`${t.firstName} ${t.lastName}`}
                      className="h-16 w-16 shrink-0 rounded-2xl border border-border/50 bg-muted"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          AIR {t.rank}
                        </p>
                      </div>
                      <h3 className="mt-1.5 text-lg font-semibold leading-snug">
                        {t.firstName} {t.lastName}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.optionalSubject}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* RELATED (same optional) */}
        <section>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Related Profiles
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Related {topper.optionalSubject} Toppers
              </h2>
            </div>

            <Link
              href={`/optional/${getSubjectSlug(topper.optionalSubject)}`}
              className="hidden text-sm text-muted-foreground transition hover:text-foreground md:block"
            >
              View All {topper.optionalSubject} Toppers →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedToppers.map((related: any) => (
              <Link
                key={related.slug}
                href={`/upsc-topper/${related.slug}`}
                data-track={`topper-related-${related.slug}`}
                className="group rounded-[28px] border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={topperImageSrc(related)}
                    alt={`${related.firstName} ${related.lastName}`}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-border/50 bg-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        AIR {related.rank} &bull; {related.year}
                      </p>
                      <Badge
                        variant="outline"
                        className="rounded-md px-1.5 py-0 text-[9px] leading-none"
                      >
                        {related.optionalSubject}
                      </Badge>
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug">
                      {related.firstName} {related.lastName}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {related.optionalSubject}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PRODUCT CTA — Second banner (anchor text variety) */}
        <section className="mb-20 mt-20">
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-lg">
                <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                  See {topper.firstName} {topper.lastName}&apos;s Full Answer Copy
                </h2>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {topper.firstName}&apos;s answer sheets + 50+ topper copies across GS1–4,
                  Essay &amp; Optional. All papers, one bundle.
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">₹799</span>
                  <span className="text-sm text-gray-500 line-through">₹4,999</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Just ₹11/copy</span>
                </div>
              </div>
              <Button asChild size="lg" className="shrink-0 rounded-full bg-white px-8 text-sm font-semibold text-gray-900 shadow-lg shadow-black/10 hover:bg-gray-100">
                <Link href="/toppers/toppers-copy-compilation" data-track="topper-banner-cta">
                  Get Bundle at ₹799 →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
