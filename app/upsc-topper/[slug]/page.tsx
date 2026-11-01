import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { getAllIndexedToppers, getTopperBySlug } from "@/services/topper.service";
import { topperImageSrc } from "@/lib/utils";
import { PRODUCTS } from "@/lib/store-products";
import { displayName, fmt, freeCopiesOf, isComplete, isPlaceholder, paperStats, previewFor, subjectOf, totalOf, type LeanTopper } from "@/lib/topper-stats";
import BrandShell from "@/components/brand/BrandShell";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import TrackingProvider from "./TrackingProvider";
import { Header, Sidebar } from "./_components/Profile";
import Marksheet from "./_components/Marksheet";
import { Faq, type QA } from "./_components/Content";
import { Section, card } from "@/components/brand/ui";
import StickyCopyBar from "./_components/StickyCopyBar";
import { CompareBox, ContinueReading, type Suggestion } from "./_components/Next";
import type { PickItem } from "@/components/brand/ComparePicker";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getRelatedToppers, getToppersByRank, getToppersByYear } from "@/services/topper.service";
import { FreeDownloadSection } from "@/components/topper/FreeDownloadSection";
import AnswerCopyPreview from "@/components/topper/AnswerCopyPreview";
import ExitPopup from "@/components/topper/ExitPopup";
import { TopperLeadCapture } from "@/components/topper/TopperLeadCapture";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const toppers = await getAllIndexedToppers();
    return toppers.map((t: { slug?: string }) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

type Topper = NonNullable<Awaited<ReturnType<typeof getTopperBySlug>>>;

function buildMetaDescription(topper: Topper): string {
  const name = `${topper.firstName} ${topper.lastName}`;
  let desc = `${name} (AIR ${topper.rank}) — See their complete UPSC ${topper.year} marksheet`;
  if (topper.optionalSubject) desc += ` with ${topper.optionalSubject}`;
  desc += `. Download the free answer copy PDF, compare paper-wise scores (GS1-4, Essay, Optional), and read their preparation strategy.`;
  if (desc.length > 160) desc = desc.slice(0, 157) + "...";
  return desc;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const topper = await getTopperBySlug(slug);
  if (!topper) return { title: "Topper Not Found" };

  const topperImage = topperImageSrc(topper);
  const ogImage = topperImage?.startsWith("http") ? topperImage : `https://upscprepnotes.in${topperImage || "/logo.png"}`;

  return {
    title: `${topper.firstName} ${topper.lastName} UPSC Marksheet, Answer Copy PDF & ${topper.optionalSubject || "Optional Subject"} — Free Download (AIR ${topper.rank}, ${topper.year})`,
    description: buildMetaDescription(topper),
    alternates: { canonical: `https://upscprepnotes.in/upsc-topper/${topper.slug}` },
    openGraph: {
      title: `${topper.firstName} ${topper.lastName} — UPSC Marksheet, Answer Copy, ${topper.optionalSubject || "Optional Subject"} & Strategy (AIR ${topper.rank})`,
      description: buildMetaDescription(topper),
      url: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
      siteName: "UPSCPrepNotes",
      images: [{ url: ogImage, width: 788, height: 1050 }],
    },
  };
}

const avatarOf = (t: LeanTopper) =>
  topperImageSrc({ slug: t.slug, ProfileImage: t.ProfileImage, firstName: t.firstName ?? "", lastName: t.lastName ?? "" });

/** The original subject → /optional/[slug] mapping. */
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

/** Strategy markdown split at its headings (original behaviour). */
function extractSections(markdown: string) {
  if (!markdown) return {} as Record<string, string>;
  if (![...markdown.matchAll(/^(#{1,6})\s*(.+)$/gm)].length) return {} as Record<string, string>;
  const parts: Record<string, string> = {};
  let current: string | null = null;
  let buffer: string[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(/^(#{1,6})\s*(.+)$/);
    if (m) {
      if (current) parts[current] = buffer.join("\n").trim();
      current = m[2].trim();
      buffer = [];
    } else buffer.push(line);
  }
  if (current) parts[current] = buffer.join("\n").trim();
  return parts;
}

type Named = { firstName: string; lastName: string; optionalSubject: string };
function resolveHeading(heading: string, t: Named): string {
  const lower = heading.toLowerCase();
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

type Rel = { slug: string; firstName: string; lastName: string; rank: number; year: number; optionalSubject: string; ProfileImage?: string };

function RelatedGroup({ title, items, sub, track }: { title: string; items: Rel[]; sub: (t: Rel) => string; track: string }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-m font-bold text-[var(--ink-2)]">{title}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Link key={t.slug} href={`/upsc-topper/${t.slug}`} data-track={`${track}-${t.slug}`} className={`${card} group flex items-center gap-3 p-3 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={topperImageSrc(t)} alt={`${t.firstName} ${t.lastName}`} loading="lazy" className="h-10 w-10 shrink-0 rounded-full bg-[#e9edff] object-cover object-top shadow-[0_0_0_1px_var(--line)]" />
            <div className="min-w-0">
              <p className="truncate text-s font-bold group-hover:text-[var(--accent)]">{t.firstName} {t.lastName}</p>
              <p className="truncate text-s text-[var(--muted)]">{sub(t)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function TopperPage({ params }: Props) {
  const { slug } = await params;
  const topper = await getTopperBySlug(slug);
  if (!topper) notFound();

  await connectDB();
  const [all, requesters, relatedToppers, sameRankToppers, sameYearToppers] = await Promise.all([
    TopperModel.find(
      {},
      { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, freeAnswerCopyUrls: 1, freeAnswerCopyUrl: 1, ProfileImage: 1 },
    ).lean() as Promise<LeanTopper[]>,
    FreeDownloadLeadModel.distinct("email", { topperSlug: topper.slug }) as Promise<string[]>,
    getRelatedToppers(topper.optionalSubject, topper.slug) as Promise<Rel[]>,
    getToppersByRank(topper.rank, topper.slug) as Promise<Rel[]>,
    getToppersByYear(topper.year, topper.slug) as Promise<Rel[]>,
  ]);
  const requests = requesters.length;
  const fullName = `${topper.firstName} ${topper.lastName}`;
  const me: LeanTopper = { ...topper, marks: topper.marks };
  const first = displayName(topper).split(" ")[0];
  const optional = subjectOf(topper.optionalSubject);
  const optHref = topper.optionalSubject ? `/optional/${getSubjectSlug(topper.optionalSubject)}` : null;
  const others = all.filter((t) => t.slug !== topper.slug);

  // Marks exactly as stored (as the original page showed them).
  const m = topper.marks ?? {};
  const pool = all.filter(isComplete);
  const papers = paperStats(me, pool);
  const optionalScore = (m.optional1 || 0) + (m.optional2 || 0);

  // Answer copy facts for the result card, sidebar and sticky bar.
  const pdfs = freeCopiesOf(me);
  const preview = previewFor(topper.slug);
  const comp = PRODUCTS.find((p) => p.slug === "answer-copies-compilation" && !p.comingSoon);
  const booklets = comp?.specs?.find((s) => s.label === "Answer Sheets")?.value;
  const compilation = comp
    ? { href: `/store/${comp.slug}`, title: comp.title, price: comp.price, image: comp.image ?? null, detail: `${booklets ? `${booklets} handwritten booklets` : comp.tagline}, one-time download` }
    : null;
  const copyLabel = "Download free copy";
  const copyNote = requests > 0 ? `${fmt(requests)} aspirants have requested this copy` : pdfs.length || preview ? "Free sample, sent by email" : "Free sample, sent by email";

  const structuredStrategy = extractSections(topper.strategy || "");
  const insights: string[] = topper.insights ?? [];

  // Compare + continue reading (navigation only).
  const valid = (t: LeanTopper) => !isPlaceholder(t) && totalOf(t) > 0;
  const sugg = (t: LeanTopper, reason: string): Suggestion => ({
    slug: t.slug ?? "", name: displayName(t), rank: t.rank ?? 0, year: t.year ?? 0, optional: subjectOf(t.optionalSubject), total: totalOf(t), avatar: avatarOf(t), reason,
  });
  const byTotal = (a: LeanTopper, b: LeanTopper) => totalOf(b) - totalOf(a);
  const sameOpt = optional ? others.filter((t) => subjectOf(t.optionalSubject) === optional && valid(t)).sort(byTotal) : [];
  const sameYear = others.filter((t) => t.year === topper.year).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const above = [...sameYear].reverse().find((t) => (t.rank ?? 0) < topper.rank) ?? null;
  const below = sameYear.find((t) => (t.rank ?? 0) > topper.rank) ?? null;
  const yearTop = sameYear.find((t) => t.rank === 1 && valid(t));
  const picks: Suggestion[] = [];
  const addPick = (t: LeanTopper | null | undefined, reason: string) => {
    if (t && valid(t) && !picks.some((p) => p.slug === t.slug) && picks.length < 3) picks.push(sugg(t, reason));
  };
  addPick(sameOpt[0], `Top ${optional} scorer`);
  addPick(yearTop, `AIR 1, CSE ${topper.year}`);
  addPick(above ?? below, `AIR ${(above ?? below)?.rank} · same year`);
  addPick(sameOpt[1], `${optional} topper`);
  const pickItems: PickItem[] = [...all]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (a.rank ?? 0) - (b.rank ?? 0))
    .map((t) => ({ slug: t.slug ?? "", name: displayName(t), rank: t.rank ?? 0, year: t.year ?? 0, optional: subjectOf(t.optionalSubject), avatar: avatarOf(t) }));
  const withCopy = sameOpt.find((t) => freeCopiesOf(t).length > 0);
  const mainNext = withCopy ? sugg(withCopy, `Free answer copy · ${optional}`) : sameOpt[0] ? sugg(sameOpt[0], `Same optional · ${optional}`) : below ? sugg(below, `Next rank · CSE ${topper.year}`) : null;
  const prevNext = (t: LeanTopper | null) => (t && t.slug !== mainNext?.slug ? sugg(t, `AIR ${t.rank} · CSE ${t.year}`) : null);

  // FAQ — original copy: DB FAQs first, then the generic ones.
  const dbFaqs: QA[] = (topper.faqs || []).slice(0, 5).map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }));
  const faqs: QA[] = [
    ...dbFaqs,
    { q: `What was ${fullName}'s UPSC rank?`, a: `AIR ${topper.rank} in UPSC CSE ${topper.year}.` },
    { q: `What was ${fullName}'s optional subject?`, a: `${topper.optionalSubject}.` },
    { q: `What were ${fullName}'s total marks?`, a: `${m.total} marks out of 2025.` },
    { q: `Can I download ${fullName}'s answer copy?`, a: `Yes — enter your email on this page and we'll send a free sample. The full set (50+ copies) is in the <a href="/store" class="text-brand font-semibold no-underline hover:underline">store</a>.` },
    { q: `How did ${fullName} prepare for UPSC?`, a: topper.strategy ? `Detailed above on this page.` : `Strategy details are not yet available.` },
  ];

  // Structured data — original schemas.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...(topper.faqs || []).slice(0, 5).map((f: { question: string; answer: string }) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      { "@type": "Question", name: `What was ${fullName}'s UPSC rank?`, acceptedAnswer: { "@type": "Answer", text: `${fullName} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.` } },
      { "@type": "Question", name: `What was ${fullName}'s optional subject?`, acceptedAnswer: { "@type": "Answer", text: `${topper.firstName} chose ${topper.optionalSubject} as the optional subject for UPSC CSE ${topper.year}.` } },
      { "@type": "Question", name: `What were ${fullName}'s total marks in UPSC?`, acceptedAnswer: { "@type": "Answer", text: `${fullName} scored a total of ${m.total} marks in UPSC CSE ${topper.year}.` } },
      { "@type": "Question", name: `Can I download ${fullName}'s answer copy PDF?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Get a free sample answer copy of ${fullName} by entering your email — we will send the download link instantly. The full set is in the store — Starting at ₹199.` } },
      { "@type": "Question", name: `How did ${fullName} prepare for UPSC?`, acceptedAnswer: { "@type": "Answer", text: `${fullName}'s UPSC preparation strategy is detailed on their topper page, covering subject-wise approach, optional strategy, and interview preparation for UPSC CSE ${topper.year}.` } },
    ],
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".faq-section"] },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
      { "@type": "ListItem", position: 2, name: `UPSC ${topper.year} Toppers`, item: `https://upscprepnotes.in/year/${topper.year}` },
      { "@type": "ListItem", position: 3, name: `${topper.optionalSubject} Toppers`, item: `https://upscprepnotes.in/optional/${getSubjectSlug(topper.optionalSubject)}` },
      { "@type": "ListItem", position: 4, name: `AIR ${topper.rank} ${fullName}`, item: `https://upscprepnotes.in/upsc-topper/${topper.slug}` },
    ],
  };
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    description: buildMetaDescription(topper),
    jobTitle: `UPSC CSE ${topper.year} AIR ${topper.rank}`,
    url: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    about: { "@id": "https://en.wikipedia.org/wiki/Union_Public_Service_Commission", name: "UPSC" },
    knowsAbout: [{ "@type": "Thing", name: `UPSC CSE ${topper.year}` }, { "@type": "Thing", name: topper.optionalSubject }],
    succeeding: [{ "@type": "Person", name: `UPSC ${topper.year} Rank ${topper.rank} Holder` }],
    hasOccupation: { "@type": "Occupation", name: "Civil Servant", occupationLocation: { "@type": "Country", name: "India" } },
  };

  const crumbs = [
    { href: "/", label: "Home" },
    { href: `/year/${topper.year}`, label: `UPSC ${topper.year}` },
    { href: `/optional/${getSubjectSlug(topper.optionalSubject)}`, label: topper.optionalSubject },
    { label: fullName },
  ];

  const hasRelated = sameYearToppers.length > 0 || sameRankToppers.length > 0 || relatedToppers.length > 0;
  const toc = [
    { id: "marksheet", label: "Marksheet" },
    { id: "answer-copy", label: "Answer copies" },
    { id: "strategy", label: "Preparation strategy" },
    ...(papers.length ? [{ id: "compare", label: "Compare" }] : []),
    ...(insights.length ? [{ id: "insights", label: "Key insights" }] : []),
    ...(hasRelated ? [{ id: "related", label: "Related toppers" }] : []),
    { id: "faq", label: "Frequently asked questions" },
  ];

  const paperRows = [
    { label: "GS1", key: "gs1", value: m.gs1 },
    { label: "GS2", key: "gs2", value: m.gs2 },
    { label: "GS3", key: "gs3", value: m.gs3 },
    { label: "GS4 (Ethics)", key: "gs4", value: m.gs4 },
    { label: "Essay", key: "essay", value: m.essay },
    { label: `${topper.optionalSubject?.split(" ").slice(0, 3).join(" ") || "Optional"} P1`, key: "optional1", value: m.optional1 },
    { label: `${topper.optionalSubject?.split(" ").slice(0, 3).join(" ") || "Optional"} P2`, key: "optional2", value: m.optional2 },
  ].filter((r) => (r.value || 0) > 0);
  const strong = [
    { label: "GS1", value: m.gs1 },
    { label: "GS2", value: m.gs2 },
    { label: "GS3", value: m.gs3 },
    { label: "GS4", value: m.gs4 },
    { label: "Essay", value: m.essay },
  ].filter((p) => (p.value || 0) > 0).sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <BrandShell>
      <TrackingProvider name={fullName} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <Header
            crumbs={crumbs}
            h={{
              name: fullName,
              first: topper.firstName,
              rank: topper.rank,
              year: topper.year,
              optional: topper.optionalSubject,
              optionalHref: optHref,
              avatar: topperImageSrc(topper),
              total: m.total || 0,
              written: m.written || 0,
              interview: m.interview || 0,
              optionalScore,
              requests,
              copyLabel,
              summary: topper.bio || "",
            }}
          />

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-14">
              {/* MARKSHEET */}
              <Section id="marksheet" title={`UPSC Marksheet ${topper.year}`} meta="Verified marks breakdown — sourced from UPSC.gov.in">
                <Marksheet
                  caption={`${fullName} UPSC ${topper.year} marksheet`}
                  rows={paperRows.map((r) => ({ label: r.label, value: r.value || 0, stat: papers.find((p) => p.key === r.key) }))}
                  written={m.written || 0}
                  interview={m.interview || 0}
                  total={m.total || 0}
                  year={topper.year}
                  pool={pool.length}
                />
                {strong.length >= 2 && (
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[16px] bg-white px-4 py-3 text-s shadow-[0_0_0_1px_var(--line)]">
                    <span className="text-[var(--muted)]">Strongest paper:</span>
                    <span className="font-bold text-[var(--accent)]">{strong[0].label} ({strong[0].value})</span>
                    <span aria-hidden className="text-[var(--line-2)]">·</span>
                    <span className="text-[var(--muted)]">Needs work:</span>
                    <span className="font-bold">{strong[strong.length - 1].label} ({strong[strong.length - 1].value})</span>
                    <span aria-hidden className="text-[var(--line-2)]">·</span>
                    <span className="text-[var(--muted)]">Gap: <span className="font-bold text-[var(--ink)]">{(strong[0].value || 0) - (strong[strong.length - 1].value || 0)} marks</span></span>
                  </p>
                )}
              </Section>

              {/* ANSWER COPY */}
              <FreeDownloadSection topperName={fullName} topperSlug={topper.slug} optionalSubject={topper.optionalSubject} freeAnswerCopyUrl={topper.freeAnswerCopyUrl} freeAnswerCopyUrls={topper.freeAnswerCopyUrls} />

              {/* STRATEGY */}
              <section id="strategy" className="scroll-mt-28">
                <h2 className="t-head text-l">{`How ${topper.firstName} Prepared for UPSC`}</h2>
                <div className={`${card} mt-5 p-6 md:p-8`}>
                  <div className="prose-brand">
                    {topper.strategy ? (
                      Object.keys(structuredStrategy).length > 0 ? (
                        Object.entries(structuredStrategy).map(([heading, content], i) => (
                          <section key={heading} className={i > 0 ? "mt-8 border-t border-[var(--line)] pt-8" : ""}>
                            <h3 className="text-m font-bold">{resolveHeading(heading, topper)}</h3>
                            <div className="mt-2">
                              <ReactMarkdown>{deduplicateContent(content)}</ReactMarkdown>
                            </div>
                          </section>
                        ))
                      ) : (
                        <ReactMarkdown>{topper.strategy}</ReactMarkdown>
                      )
                    ) : (
                      <>
                        <p>{fullName} secured AIR {topper.rank} in UPSC CSE {topper.year} with {topper.optionalSubject} optional. Total marks: {m.total} (Written: {m.written}, Interview: {m.interview}).</p>
                        {topper.bio && <p>{topper.bio}</p>}
                      </>
                    )}
                  </div>
                </div>
              </section>

              {papers.length > 0 && (
                <Section id="compare" title={`Compare ${first} with another topper`}>
                  <CompareBox base={topper.slug} first={first} items={pickItems} picks={picks} />
                </Section>
              )}

              <AnswerCopyPreview topper={{ slug: topper.slug, firstName: topper.firstName, lastName: topper.lastName, rank: topper.rank, year: topper.year, optionalSubject: topper.optionalSubject, marks: { essay: m.essay, total: m.total } }} />

              {/* FREE ANSWER COPY */}
              <TopperLeadCapture topperName={fullName} topperSlug={topper.slug} />

              {/* INSIGHTS */}
              {insights.length > 0 && (
                <section id="insights" className="scroll-mt-28">
                  <h2 className="t-head text-l">Key insights</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {insights.map((insight, index) => (
                      <div key={index} className={`${card} p-4 text-m leading-[1.6] text-[var(--ink-2)]`}>{insight}</div>
                    ))}
                  </div>
                </section>
              )}

              {/* RELATED TOPPERS */}
              {hasRelated && (
                <section id="related" className="scroll-mt-28 space-y-6">
                  <h2 className="t-head text-l">Related toppers</h2>
                  <RelatedGroup title={`Same year — UPSC ${topper.year}`} items={sameYearToppers} sub={(t) => `AIR ${t.rank} · ${t.optionalSubject}`} track="topper-related" />
                  <RelatedGroup title={`Same rank — AIR ${topper.rank}`} items={sameRankToppers} sub={(t) => `${t.year} · ${t.optionalSubject}`} track="topper-samerank" />
                  <RelatedGroup title={`Same optional — ${topper.optionalSubject}`} items={relatedToppers} sub={(t) => `AIR ${t.rank} · ${t.year}`} track="topper-related" />
                </section>
              )}

              {/* FAQ */}
              <section id="faq" className="faq-section scroll-mt-28">
                <h2 className="t-head text-l">Frequently asked questions</h2>
                <div className="mt-5">
                  <Faq items={faqs} />
                </div>
              </section>

              {/* EXPLORE MORE */}
              <section className="border-t border-[var(--line)] pt-8">
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "/store", label: "Store →", track: "topper-explore-compilation" },
                    { href: `/year/${topper.year}`, label: `UPSC ${topper.year} toppers →`, track: "topper-explore-year" },
                    { href: `/optional/${getSubjectSlug(topper.optionalSubject)}`, label: `${topper.optionalSubject} toppers →`, track: "topper-explore-optional" },
                    { href: "/ask", label: "Ask AI mentor →", track: "topper-explore-ai" },
                    { href: "/free-materials", label: "Free study materials →", track: "topper-explore-free" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} data-track={l.track} className="rounded-full bg-white px-4 py-2 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)]">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </section>

              <Section id="continue" title="Continue reading">
                <ContinueReading main={mainNext} prev={prevNext(above)} next={prevNext(below)} />
              </Section>
            </div>

            <Sidebar s={{ name: fullName, first: topper.firstName, year: topper.year, optional: topper.optionalSubject, optionalHref: optHref, copyLabel, copyNote, toc, compilation }} />
          </div>
        </div>
      </div>
      <StickyCopyBar label={copyLabel} note={copyNote} />
      <ExitPopup />
    </BrandShell>
  );
}
