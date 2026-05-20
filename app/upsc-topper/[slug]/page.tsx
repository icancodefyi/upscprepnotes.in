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

  // Compact data-dense format used by top-ranking competitors
  let desc = `${name} UPSC AIR ${rank} (${year})`;
  if (subject) desc += ` - ${subject}`;
  if (total) desc += `. Total: ${total}`;
  desc += ` | Written: ${written || "—"} | Interview: ${interview || "—"}.`;
  if (gs1) desc += ` GS1:${gs1}`;
  if (gs2) desc += ` GS2:${gs2}`;
  if (gs3) desc += ` GS3:${gs3}`;
  if (gs4) desc += ` GS4:${gs4}`;
  if (essay) desc += ` Essay:${essay}`;
  if (opt1 && subject) desc += ` ${subject.replace(/\s+/g, "")}:${opt1}`;
  desc += " Rank-wise strategy & answer copies.";

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
    title: `${topper.firstName} ${topper.lastName} UPSC AIR ${topper.rank} (${topper.year})`,
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
    topper.slug
  );

  const sameRankToppers = await getToppersByRank(
    topper.rank,
    topper.slug
  );

  const sameYearToppers = await getToppersByYear(
    topper.year,
    topper.slug
  );

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

  // Resource intent architecture — directly matches search queries
  const answerCopyPapers = [
    { key: "gs1", title: "GS1 Answer Copy", marks: topper.marks.gs1, available: (topper.resources?.gs1Links || []).length > 0 || (topper.answerCopies?.gs1 || []).length > 0, link: topper.resources?.gs1Links?.[0] || topper.answerCopies?.gs1?.[0] || null },
    { key: "gs2", title: "GS2 Answer Copy", marks: topper.marks.gs2, available: (topper.resources?.gs2Links || []).length > 0 || (topper.answerCopies?.gs2 || []).length > 0, link: topper.resources?.gs2Links?.[0] || topper.answerCopies?.gs2?.[0] || null },
    { key: "gs3", title: "GS3 Answer Copy", marks: topper.marks.gs3, available: (topper.resources?.gs3Links || []).length > 0 || (topper.answerCopies?.gs3 || []).length > 0, link: topper.resources?.gs3Links?.[0] || topper.answerCopies?.gs3?.[0] || null },
    { key: "gs4", title: "GS4 (Ethics) Answer Copy", marks: topper.marks.gs4, available: (topper.resources?.gs4Links || []).length > 0 || (topper.answerCopies?.gs4 || []).length > 0, link: topper.resources?.gs4Links?.[0] || topper.answerCopies?.gs4?.[0] || null },
    { key: "essay", title: "Essay Answer Copy", marks: topper.marks.essay, available: (topper.resources?.essayLinks || []).length > 0 || (topper.answerCopies?.essay || []).length > 0, link: topper.resources?.essayLinks?.[0] || topper.answerCopies?.essay?.[0] || null },
    { key: "optional", title: `${topper.optionalSubject} Answer Copy`, marks: topper.marks.optional1, available: Object.values(topper.resources || {}).some(arr => arr.length > 0) || Object.values(topper.answerCopies || {}).some(arr => arr.length > 0), link: null },
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
    if (lower.includes("background")) return `${t.firstName} ${t.lastName}'s Background`;
    if (lower.includes("educational") || lower.includes("education") || lower.includes("journey")) return `${t.firstName} ${t.lastName}'s Education & Journey`;
    if (lower.includes("attempt")) return `${t.firstName} ${t.lastName}'s UPSC Attempts`;
    if (lower.includes("prelim")) return `${t.firstName} ${t.lastName}'s Prelims Strategy`;
    if (lower.includes("mains") || lower.includes("written")) return `${t.firstName} ${t.lastName}'s Mains Strategy`;
    if (lower.includes("optional") || lower.includes("subject")) return `${t.firstName} ${t.lastName} ${t.optionalSubject} Strategy`;
    if (lower.includes("essay")) return `${t.firstName} ${t.lastName}'s Essay Preparation`;
    if (lower.includes("interview") || lower.includes("personality")) return `${t.firstName} ${t.lastName}'s Interview Preparation`;
    if (lower.includes("mistake") || lower.includes("learning") || lower.includes("key takeaway")) return `Key Takeaways from ${t.firstName} ${t.lastName}`;
    return heading;
  }

  const structuredStrategy = extractSections(topper.strategy || "");

  // Deduplicate repeated paragraphs within strategy content
  const deduplicateContent = (markdown: string): string => {
    const seen = new Set<string>();
    return markdown.split("\n").filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (seen.has(trimmed)) return false;
      seen.add(trimmed);
      return true;
    }).join("\n");
  };

  // FAQ Schema — expanded for entity search intent
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What was ${topper.firstName} ${topper.lastName}'s UPSC rank?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        "name": `What was ${topper.firstName} ${topper.lastName}'s optional subject?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} chose ${topper.optionalSubject} as the optional subject for UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        "name": `What were ${topper.firstName} ${topper.lastName}'s interview marks?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} scored ${topper.marks.interview} marks in the UPSC personality test (interview).`,
        },
      },
      {
        "@type": "Question",
        "name": `What were ${topper.firstName} ${topper.lastName}'s total marks in UPSC?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} ${topper.lastName} scored a total of ${topper.marks.total} marks in UPSC CSE ${topper.year}.`,
        },
      },
      {
        "@type": "Question",
        "name": `What were ${topper.firstName} ${topper.lastName}'s GS1 marks?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} scored ${topper.marks.gs1} marks in GS1 paper.`,
        },
      },
      {
        "@type": "Question",
        "name": `What were ${topper.firstName} ${topper.lastName}'s essay marks?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} scored ${topper.marks.essay} marks in the essay paper.`,
        },
      },
      {
        "@type": "Question",
        "name": `Where can I find ${topper.firstName} ${topper.lastName}'s answer copies?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Answer copies for ${topper.firstName} ${topper.lastName} are listed in the Answer Copies section above when available.`,
        },
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://upscprepnotes.in" },
      { "@type": "ListItem", "position": 2, "name": `UPSC ${topper.year} Toppers`, "item": `https://upscprepnotes.in/year/${topper.year}` },
      { "@type": "ListItem", "position": 3, "name": `${topper.optionalSubject} Toppers`, "item": `https://upscprepnotes.in/optional/${getSubjectSlug(topper.optionalSubject)}` },
      { "@type": "ListItem", "position": 4, "name": `AIR ${topper.rank} ${topper.firstName} ${topper.lastName}`, "item": `https://upscprepnotes.in/upsc-topper/${topper.slug}` },
    ],
  };

  // Person Schema with rich marks data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": `${topper.firstName} ${topper.lastName}`,
    "description": buildMetaDescription(topper),
    "jobTitle": `UPSC CSE ${topper.year} AIR ${topper.rank}`,
    "url": `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
    "knowsAbout": [
      { "@type": "Thing", "name": `UPSC CSE ${topper.year}` },
      { "@type": "Thing", "name": topper.optionalSubject },
    ],
    "succeeding": [{
      "@type": "Person",
      "name": `UPSC ${topper.year} Rank ${topper.rank} Holder`,
    }],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Civil Servant",
      "occupationLocation": { "@type": "Country", "name": "India" },
    },
  };

  return (
    <main className="min-h-screen">
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
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
          <span>•</span>
          <Link href={`/year/${topper.year}`} className="transition hover:text-foreground">
            {topper.year}
          </Link>
          <span>•</span>
          <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} className="transition hover:text-foreground">
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
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  className="h-full w-full bg-muted"
                />
              </div>

              <div className="mt-4 space-y-3">
                <Card className="rounded-2xl border-border/50 text-center">
                  <CardContent className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">AIR</p>
                    <p className="mt-1 text-5xl font-black tracking-tight text-primary">{topper.rank}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-3">
                  <Card className="rounded-2xl border-border/50 text-center">
                    <CardContent className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                      <p className="mt-0.5 text-lg font-bold">{topper.marks.total}</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/50 text-center">
                    <CardContent className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Year</p>
                      <p className="mt-0.5 text-lg font-bold">{topper.year}</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/50 text-center">
                    <CardContent className="p-3">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Interview</p>
                      <p className="mt-0.5 text-lg font-bold">{topper.marks.interview}</p>
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
                <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-medium">
                  UPSC {topper.year}
                </Badge>
                {topper.marks.interview > 0 && (
                  <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-medium">
                    Interview {topper.marks.interview}
                  </Badge>
                )}
              </div>

              <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl leading-[1.05]">
                {topper.firstName} {topper.lastName}
              </h1>
              <p className="mt-3 text-2xl font-medium text-primary">
                AIR {topper.rank} &middot; {topper.marks.total} Total Marks
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
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight">{item.value}</p>
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
                      {topper.rank <= 10 ? "Elite Performer" : topper.rank <= 50 ? "Top Tier Performer" : "Top Performer"}
                    </p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Ranked <strong>#{topper.rank}</strong> nationally out of ~1M aspirants.
                      {topper.marks.total > 0 && (
                        <> Scored <strong>{topper.marks.total}</strong> total marks across all papers.</>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* RESOURCE INTENT — answer copies listing */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Answer Copies
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                {topper.firstName} {topper.lastName} Answer Copies
              </h2>
            </div>

            <div className="hidden max-w-sm text-sm leading-7 text-muted-foreground md:block">
              Direct access to the answer copies that secured AIR {topper.rank}.
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {answerCopyPapers.map((p) => (
              <AnswerCopyCard
                key={p.key}
                title={p.title}
                marks={p.marks}
                available={p.available}
                href={p.link}
                topperName={`${topper.firstName} ${topper.lastName}`}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/toppers/toppers-copy-compilation"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            >
              Get Compilation of All Answer Copies &rarr;
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              Full compilation across all GS papers, Essay &amp; Optional
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
              Structured marks analysis across General Studies,
              optional subject papers, essay, and personality test.
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
            ].filter(p => p.value > 0);
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
                      {topper.firstName} scored the highest in <strong>{best.label}</strong> with <strong>{best.value} marks</strong>
                      {sorted.length > 1 && (
                        <> — {best.value - sorted[1].value} marks ahead of their next best paper.</>
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
                    {topper.firstName} {topper.lastName} {topper.optionalSubject} Marks
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
              {topper.insights.map(
                (insight: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-border/50 bg-card p-6"
                  >
                    <p className="leading-8 text-foreground">
                      {insight}
                    </p>
                  </div>
                )
              )}
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
                  Object.entries(structuredStrategy).map(([heading, content], i) => (
                    <section key={heading} className={i > 0 ? "mt-12 border-l-2 border-l-primary pl-6" : ""}>
                      <h3 className="text-2xl font-bold tracking-tight">{resolveHeading(heading, topper)}</h3>
                      <div className="mt-4">
                        <ReactMarkdown>{deduplicateContent(content)}</ReactMarkdown>
                      </div>
                    </section>
                  ))
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
                q: `Where can I find ${topper.firstName} ${topper.lastName} answer copies?`,
                a: (topper.answerCopies && Object.values(topper.answerCopies).some((arr: any[]) => arr && arr.length > 0)) ? `Answer copies for ${topper.firstName} ${topper.lastName} are listed in the Answer Copies section above.` : `Public answer copies for ${topper.firstName} ${topper.lastName} are not yet available. Check back soon.`,
              },
              {
                q: `How did ${topper.firstName} ${topper.lastName} prepare for UPSC?`,
                a: topper.strategy ? `${topper.firstName} ${topper.lastName}'s preparation strategy is detailed in the Preparation Strategy section on this page.` : `Detailed preparation strategy for ${topper.firstName} ${topper.lastName} is not yet available.`,
              },
            ].map((faq, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <h3 className="text-base font-semibold">
                  {faq.q}
                </h3>
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
              <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`}>
                All {topper.optionalSubject} Toppers →
              </Link>
            </Button>

            <Button variant="outline" asChild className="rounded-full">
              <Link href={`/year/${topper.year}`}>
                UPSC {topper.year} Toppers →
              </Link>
            </Button>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/">
                All UPSC Toppers →
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
                  className="group rounded-[28px] border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.firstName}-${t.lastName}`}
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
                  className="group rounded-[28px] border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.firstName}-${t.lastName}`}
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
                className="group rounded-[28px] border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${related.firstName}-${related.lastName}`}
                    alt={`${related.firstName} ${related.lastName}`}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-border/50 bg-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        AIR {related.rank} &bull; {related.year}
                      </p>
                      <Badge variant="outline" className="rounded-md px-1.5 py-0 text-[9px] leading-none">
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
      </div>
    </main>
  );
}