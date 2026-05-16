import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  getRelatedToppers,
  getTopperBySlug,
} from "@/services/topper.service";

export const revalidate = 86400;

interface Props {
  params: Promise<{
    slug: string;
  }>;
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
    description: topper.bio?.slice(0, 160),
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

  const resources = [
    {
      title: "Essay Copy",
      marks: topper.marks.essay,
    },
    {
      title: "GS1 Copy",
      marks: topper.marks.gs1,
    },
    {
      title: "GS2 Copy",
      marks: topper.marks.gs2,
    },
    {
      title: "GS3 Copy",
      marks: topper.marks.gs3,
    },
    {
      title: "GS4 Copy",
      marks: topper.marks.gs4,
    },
    {
      title: `${topper.optionalSubject} Paper`,
      marks: topper.marks.optional1,
    },
  ];

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

  // Resource intent architecture (near top)
  const resourceIntent = [
    { key: "essay", title: "Essay Strategy", available: (topper.resources?.essayLinks || []).length > 0 },
    { key: "gs1", title: "GS1 Insights", available: (topper.resources?.gs1Links || []).length > 0 },
    { key: "gs2", title: "GS2 Insights", available: (topper.resources?.gs2Links || []).length > 0 },
    { key: "ethics", title: "Ethics Preparation", available: false },
    { key: "optional", title: `${topper.optionalSubject} Notes`, available: ((topper.resources?.gs1Links || [])?.length > 0) || ((topper.answerCopies?.essay || [])?.length > 0) },
  ];

  // Strategy section restructuring
  const SECTION_TITLES = [
    "Background",
    "Educational Journey",
    "UPSC Attempts",
    "Prelims Strategy",
    "Mains Strategy",
    "Optional Subject Strategy",
    "Essay Preparation",
    "Interview Preparation",
    "Mistakes & Learnings",
    "Key Takeaways",
  ];

  function extractSections(markdown: string) {
    if (!markdown) return {} as Record<string, string>;

    // detect explicit headings first
    const headingRegex = /^(#{1,6})\s*(.+)$/gm;
    const matches = [...markdown.matchAll(headingRegex)];

    if (matches.length > 0) {
      // split by headings
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

      // map to desired titles
      const result: Record<string, string> = {};
      for (const t of SECTION_TITLES) {
        // find case-insensitive matching heading
        const key = Object.keys(parts).find((k) => k.toLowerCase().includes(t.toLowerCase()));
        if (key) result[t] = parts[key];
      }

      return result;
    }

    // fallback: split into paragraphs and assign sequentially
    const paragraphs = markdown.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
    const fallback: Record<string, string> = {};
    for (let i = 0; i < paragraphs.length && i < SECTION_TITLES.length; i++) {
      fallback[SECTION_TITLES[i]] = paragraphs[i];
    }

    return fallback;
  }

  const structuredStrategy = extractSections(topper.strategy || "");

  // FAQ Schema
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
        "name": `What was ${topper.firstName}'s optional subject?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} chose ${topper.optionalSubject} as the optional subject.`,
        },
      },
      {
        "@type": "Question",
        "name": `What were ${topper.firstName}'s interview marks?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topper.firstName} scored ${topper.marks.interview} marks in the UPSC personality test.`,
        },
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://upscprepnotes.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${topper.year}`,
        "item": `https://upscprepnotes.in/year/${topper.year}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${topper.optionalSubject}`,
        "item": `https://upscprepnotes.in/optional/${getSubjectSlug(topper.optionalSubject)}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${topper.firstName} ${topper.lastName}`,
        "item": `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
      },
    ],
  };

  // Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": `${topper.firstName} ${topper.lastName}`,
    "description": topper.bio || `UPSC AIR ${topper.rank} (${topper.year})`,
    "jobTitle": `UPSC CSE ${topper.year} AIR ${topper.rank}`,
    "url": `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-black">
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

      {/* GRID */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* LEFT RAIL */}
      <div className="fixed left-0 top-0 hidden h-screen w-14 border-r border-black/[0.05] xl:flex xl:flex-col xl:items-center xl:justify-between xl:py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-medium shadow-sm">
          N
        </div>

        <div className="rotate-180 text-[9px] uppercase tracking-[0.35em] text-zinc-400 [writing-mode:vertical-rl]">
          UPSC Intelligence Archive
        </div>

        <div className="text-[10px] text-zinc-300">
          2026
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-10 xl:ml-20">
        {/* BREADCRUMB */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <span>•</span>
          <Link href={`/year/${topper.year}`} className="transition hover:text-black">
            {topper.year}
          </Link>
          <span>•</span>
          <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} className="transition hover:text-black">
            {topper.optionalSubject}
          </Link>
        </div>

        {/* HERO */}
        <section className="mb-28">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            {/* LEFT */}
            <div className="lg:sticky lg:top-10 lg:h-fit">
              <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white">
                <img
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  className="h-full w-full bg-[#f3f3f3]"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                    AIR
                  </p>

                  <p className="mt-2 text-4xl font-semibold">
                    {topper.rank}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                    Total Marks
                  </p>

                  <p className="mt-2 text-4xl font-semibold">
                    {topper.marks.total}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-black/10 bg-white px-4 py-1 text-xs font-medium uppercase tracking-wide">
                  UPSC {topper.year}
                </span>

                <span className="rounded-full border border-black/10 bg-white px-4 py-1 text-xs font-medium uppercase tracking-wide">
                  {topper.optionalSubject}
                </span>

                <span className="rounded-full border border-black/10 bg-white px-4 py-1 text-xs font-medium uppercase tracking-wide">
                  Interview {topper.marks.interview}
                </span>
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
                {topper.firstName} {topper.lastName}
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-9 text-zinc-700">
                {topper.bio}
              </p>

              {/* QUICK STATS */}
              <div className="mt-10 grid overflow-hidden rounded-[30px] border border-black/[0.06] bg-white md:grid-cols-4">
                {[
                  {
                    label: "Written",
                    value: topper.marks.written,
                  },
                  {
                    label: "Essay",
                    value: topper.marks.essay,
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
                    className="border-b border-black/[0.05] p-6 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0"
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                      {item.label}
                    </p>

                    <p className="mt-3 text-4xl font-semibold tracking-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AVAILABLE RESOURCES (near top) */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                Available Resources
              </p>

              <h3 className="text-2xl font-semibold tracking-tight">
                Resource Intent
              </h3>
            </div>

            <div className="hidden text-sm text-zinc-500 md:block">
              Resource intent helps users and search engines discover focused materials.
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {resourceIntent.map((r) => (
              <div key={r.key} className="rounded-xl border border-black/[0.06] bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{r.title}</h4>
                  <span className={`text-sm font-medium ${r.available ? 'text-green-600' : 'text-zinc-400'}`}>
                    {r.available ? 'Available' : 'Coming Soon'}
                  </span>
                </div>

                <p className="mt-3 text-sm text-zinc-600">{r.available ? 'Structured material available — view in the Resources section.' : 'Planned resource. Will be added soon.'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MARKS */}
        <section className="mb-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                Marks Intelligence
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Performance Breakdown
              </h2>
            </div>

            <p className="hidden max-w-sm text-sm leading-7 text-zinc-500 lg:block">
              Structured marks analysis across General Studies,
              optional subject papers, essay, and personality test.
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-black/[0.06] bg-white">
            <div className="grid md:grid-cols-3">
              {/* GS */}
              <div className="border-b border-black/[0.05] p-8 md:border-b-0 md:border-r">
                <h3 className="mb-8 text-lg font-semibold">
                  General Studies
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
                          className="h-full bg-black"
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
              <div className="border-b border-black/[0.05] p-8 md:border-b-0 md:border-r">
                <h3 className="mb-8 text-lg font-semibold">
                  Optional Subject
                </h3>

                <div className="rounded-2xl bg-[#f6f6f6] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
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
                          className="h-full bg-black"
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
                  Final Scores
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
                      className="flex items-center justify-between border-b border-black/[0.05] pb-4 last:border-b-0"
                    >
                      <span className="text-zinc-600">
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
          <section className="mb-28">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              Key Learnings
            </p>

            <h2 className="mb-10 text-4xl font-semibold tracking-tight">
              Preparation Patterns & Insights
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {topper.insights.map(
                (insight: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-black/[0.06] bg-white p-6"
                  >
                    <p className="leading-8 text-zinc-700">
                      {insight}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* STRATEGY */}
        <section className="mb-28">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            Strategy Archive
          </p>

          <h2 className="mb-10 text-4xl font-semibold tracking-tight">
            Preparation Strategy
          </h2>

          <article className="max-w-4xl">
            <div className="rounded-[36px] border border-black/[0.06] bg-white p-8 md:p-12">
              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:leading-8">
                {Object.keys(structuredStrategy).length > 0 ? (
                  SECTION_TITLES.map((title) => {
                    const content = structuredStrategy[title];
                    if (!content) return null;

                    return (
                      <section key={title} className="mb-8">
                        <h3 className="text-2xl font-semibold">{title}</h3>
                        <div className="mt-4">
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      </section>
                    );
                  })
                ) : (
                  <ReactMarkdown>{topper.strategy}</ReactMarkdown>
                )}
              </div>
            </div>
          </article>
        </section>

        {/* RESOURCES */}
        <section className="mb-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                Resource Archive
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Answer Copies & Resources
              </h2>
            </div>

            <p className="hidden max-w-sm text-sm leading-7 text-zinc-500 lg:block">
              Structured answer writing resources and paper-wise
              archives.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="group rounded-[28px] border border-black/[0.06] bg-white p-6 transition duration-300 hover:-translate-y-[2px]"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                  Resource
                </p>

                <h3 className="mt-4 text-2xl font-semibold">
                  {resource.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  {resource.marks} Marks
                </p>

                <p className="mt-5 text-sm leading-7 text-zinc-600">
                  Structured topper resource archive and answer
                  writing material.
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    View Resource
                  </span>

                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-28">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            FAQ
          </p>

          <h2 className="mb-10 text-4xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            {[
              {
                q: `What was ${topper.firstName} ${topper.lastName}'s UPSC rank?`,
                a: `${topper.firstName} ${topper.lastName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.`,
              },
              {
                q: "What was the optional subject?",
                a: `${topper.firstName} chose ${topper.optionalSubject} as the optional subject.`,
              },
              {
                q: "What were the interview marks?",
                a: `${topper.firstName} scored ${topper.marks.interview} marks in the UPSC personality test.`,
              },
              {
                q: "What were the total marks?",
                a: `${topper.firstName} obtained a total of ${topper.marks.total} marks in UPSC CSE ${topper.year}.`,
              },
              {
                q: "Are the topper's answer copies available?",
                a: (topper.answerCopies && Object.values(topper.answerCopies).some((arr: any[]) => arr && arr.length > 0)) ? 'Yes — some answer copies are linked in the Resources section when available.' : 'No public answer copies are available for this profile.',
              },
              {
                q: "Are there any quick takeaways from their preparation?",
                a: topper.insights && topper.insights.length > 0 ? `${topper.firstName} shared ${topper.insights.length} key insights — see the Key Learnings section.` : 'No structured takeaways are available.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-black/[0.06] bg-white p-6"
              >
                <h3 className="text-lg font-semibold">
                  {faq.q}
                </h3>

                <p className="mt-3 leading-8 text-zinc-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link href={`/optional/${getSubjectSlug(topper.optionalSubject)}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              Explore More {topper.optionalSubject} Toppers →
            </Link>

            <Link href={`/year/${topper.year}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
              More UPSC {topper.year} Toppers →
            </Link>
          </div>
        </section>

        {/* RELATED */}
        <section>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
                Related Profiles
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Related {topper.optionalSubject} Toppers
              </h2>
            </div>

            <Link
              href="/"
              className="hidden text-sm text-zinc-500 transition hover:text-black md:block"
            >
              View All Toppers →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedToppers.map((related: any) => (
              <Link
                key={related.slug}
                href={`/upsc-topper/${related.slug}`}
                className="group rounded-[28px] border border-black/[0.06] bg-white p-5 transition duration-300 hover:-translate-y-[2px]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${related.firstName}-${related.lastName}`}
                    alt={`${related.firstName} ${related.lastName}`}
                    className="h-20 w-20 rounded-2xl border border-black/[0.05] bg-[#f4f4f4]"
                  />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      AIR {related.rank} • {related.year}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {related.firstName} {related.lastName}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">
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