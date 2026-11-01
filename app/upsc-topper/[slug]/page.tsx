import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { getAllIndexedToppers, getTopperBySlug } from "@/services/topper.service";
import { topperImageSrc } from "@/lib/utils";
import { PRODUCTS } from "@/lib/store-products";
import {
  displayName,
  fmt,
  freeCopiesOf,
  isComplete,
  isFirstPersonStrategy,
  isPlaceholder,
  optionalSlug,
  paperStats,
  previewFor,
  subjectOf,
  totalOf,
  type LeanTopper,
} from "@/lib/topper-stats";
import BrandShell from "@/components/brand/BrandShell";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import TrackingProvider from "./TrackingProvider";
import { Header, Sidebar } from "./_components/Profile";
import Marksheet from "./_components/Marksheet";
import AnswerCopy, { type FreeTopper } from "./_components/AnswerCopy";
import { About, Faq, Insights, StrategyBlock, type QA } from "./_components/Content";
import Related, { type RelatedGroup, type RelatedTopper } from "./_components/Related";
import { Section } from "@/components/brand/ui";
import StickyCopyBar from "./_components/StickyCopyBar";
import { CompareBox, ContinueReading, type Suggestion } from "./_components/Next";
import type { PickItem } from "@/components/brand/ComparePicker";

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

const toRelated = (t: LeanTopper): RelatedTopper => ({
  name: displayName(t),
  slug: t.slug ?? "",
  rank: t.rank ?? 0,
  year: t.year ?? 0,
  optional: subjectOf(t.optionalSubject),
  total: totalOf(t),
  avatar: avatarOf(t),
  freeCopy: freeCopiesOf(t).length > 0,
});

export default async function TopperPage({ params }: Props) {
  const { slug } = await params;
  const topper = await getTopperBySlug(slug);
  if (!topper) notFound();

  await connectDB();
  const [all, requesters] = await Promise.all([
    TopperModel.find(
      {},
      { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, freeAnswerCopyUrls: 1, freeAnswerCopyUrl: 1, ProfileImage: 1 },
    ).lean() as Promise<LeanTopper[]>,
    FreeDownloadLeadModel.distinct("email", { topperSlug: topper.slug }) as Promise<string[]>,
  ]);
  const requests = requesters.length;

  const me: LeanTopper = { ...topper, marks: topper.marks };
  const name = displayName(topper);
  const first = name.split(" ")[0];
  const optional = subjectOf(topper.optionalSubject);
  const optHref = optional ? `/optional/${optionalSlug(topper.optionalSubject)}` : null;
  const others = all.filter((t) => t.slug !== topper.slug);

  // A record that repeats one number across papers is a placeholder: show none of its marks.
  const placeholder = isPlaceholder(me);
  const total = placeholder ? 0 : totalOf(me);
  const written = placeholder ? 0 : topper.marks.written;
  const interview = placeholder ? 0 : topper.marks.interview;

  // Each paper against the median of every complete marksheet we hold.
  const pool = all.filter(isComplete);
  const papers = placeholder ? [] : paperStats(me, pool);
  const optionalScore = papers.find((p) => p.key === "optional")?.score ?? 0;
  const mains = papers.filter((p) => p.key !== "interview");
  const best = [...mains].sort((a, b) => b.beats - a.beats)[0];
  const weak = [...mains].sort((a, b) => a.beats - b.beats)[0];

  // One summary line, built only from the numbers.
  let summary = placeholder
    ? `${first} secured AIR ${topper.rank} in UPSC CSE ${topper.year}. The marks on this record failed our checks, so they're held back until verified against UPSC's result.`
    : `${topper.rank === 1 ? "Topped" : `Ranked ${topper.rank} in`} UPSC CSE ${topper.year} with ${fmt(total)} marks out of 2,025.`;
  if (!placeholder && best && weak && best.key !== weak.key)
    summary += ` Strongest paper: ${best.label} (${best.score}, better than ${best.beats}% of toppers). Weakest: ${weak.label} (${weak.score}).`;

  // Answer copy.
  const pdfs = freeCopiesOf(me);
  const preview = previewFor(topper.slug);
  const freeOthers: FreeTopper[] = others
    .filter((t) => freeCopiesOf(t).length > 0)
    .map((t) => ({
      name: displayName(t),
      slug: t.slug ?? "",
      rank: t.rank ?? 0,
      year: t.year ?? 0,
      optional: subjectOf(t.optionalSubject),
      same: !!optional && subjectOf(t.optionalSubject) === optional,
      avatar: avatarOf(t),
    }))
    .sort((a, b) => Number(b.same) - Number(a.same) || Number(b.year === topper.year) - Number(a.year === topper.year) || a.rank - b.rank)
    .slice(0, 6);
  const comp = PRODUCTS.find((p) => p.slug === "answer-copies-compilation" && !p.comingSoon);
  const booklets = comp?.specs?.find((s) => s.label === "Answer Sheets")?.value;
  const compilation = comp
    ? { href: `/store/${comp.slug}`, title: comp.title, price: comp.price, image: comp.image ?? null, detail: `${booklets ? `${booklets} handwritten booklets` : comp.tagline}, one-time download` }
    : null;
  const copyLabel = pdfs.length ? "Get the free answer copy" : preview ? "See the answer booklet" : "Read free topper copies";
  const copyNote = requests > 0 ? `${fmt(requests)} aspirants have requested this copy` : pdfs.length ? "Free PDF, opens instantly" : "Checked against our archive";

  // Strategy: shown for every topper; machine-written first-person text is labelled as such.
  const generated = isFirstPersonStrategy(topper.strategy);
  const insights: string[] = topper.insights ?? [];

  // Related toppers.
  const byTotal = (a: LeanTopper, b: LeanTopper) => totalOf(b) - totalOf(a);
  const groups: RelatedGroup[] = [
    ...(optional ? [{ id: "optional", label: optional, toppers: others.filter((t) => subjectOf(t.optionalSubject) === optional).sort(byTotal).slice(0, 8).map(toRelated) }] : []),
    { id: "year", label: `CSE ${topper.year}`, toppers: others.filter((t) => t.year === topper.year).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)).slice(0, 8).map(toRelated) },
    {
      id: "rank",
      label: `Near AIR ${topper.rank}`,
      toppers: others
        .filter((t) => Math.abs((t.rank ?? 0) - topper.rank) <= Math.max(5, Math.round(topper.rank * 0.1)))
        .sort((a, b) => Math.abs((a.rank ?? 0) - topper.rank) - Math.abs((b.rank ?? 0) - topper.rank) || (b.year ?? 0) - (a.year ?? 0))
        .slice(0, 8)
        .map(toRelated),
    },
  ];

  // Compare + continue reading.
  const valid = (t: LeanTopper) => !isPlaceholder(t) && totalOf(t) > 0;
  const sugg = (t: LeanTopper, reason: string): Suggestion => ({
    slug: t.slug ?? "",
    name: displayName(t),
    rank: t.rank ?? 0,
    year: t.year ?? 0,
    optional: subjectOf(t.optionalSubject),
    total: totalOf(t),
    avatar: avatarOf(t),
    reason,
  });
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
  const mainNext = withCopy
    ? sugg(withCopy, `Free answer copy · ${optional}`)
    : sameOpt[0]
      ? sugg(sameOpt[0], `Same optional · ${optional}`)
      : below
        ? sugg(below, `Next rank · CSE ${topper.year}`)
        : null;
  const prevNext = (t: LeanTopper | null) => (t && t.slug !== mainNext?.slug ? sugg(t, `AIR ${t.rank} · CSE ${t.year}`) : null);

  // FAQ: the same honest text in the page and in the schema.
  const topGs = papers.filter((p) => p.max === 250).sort((a, b) => b.score - a.score)[0];
  const faqs: QA[] = [
    { q: `What was ${name}'s UPSC rank?`, a: `AIR ${topper.rank} in UPSC CSE ${topper.year}.` },
    ...(optional ? [{ q: `What was ${name}'s optional subject?`, a: `${topper.optionalSubject?.trim()}.${optionalScore ? ` ${first} scored ${optionalScore} out of 500 across Papers I and II.` : ""}` }] : []),
    ...(total > 0 ? [{ q: `What were ${name}'s total marks in UPSC?`, a: `${fmt(total)} out of 2,025${written ? `: ${fmt(written)} in the written exam and ${interview} in the personality test` : ""}.` }] : []),
    ...(topGs ? [{ q: `What was ${name}'s highest-scoring Mains paper?`, a: `${topGs.label}, with ${topGs.score} out of 250, against a median of ${topGs.median} across ${topGs.of} toppers on record.` }] : []),
    {
      q: `Can I download ${name}'s answer copy?`,
      a: pdfs.length
        ? "Yes, for free. Enter your email in the answer copy section of this page and the PDF opens straight away."
        : preview
          ? `This page shows a real page from ${first}'s answer booklet. The full booklet is not available as a free download.`
          : `Not yet. We only publish answer copies we actually hold, and we don't have ${first}'s. Free copies from other toppers are listed on this page.`,
    },
    ...(topper.faqs ?? [])
      .filter((f: { question: string }) => !/answer copy|total marks|rank\?|optional subject\?|strongest/i.test(f.question))
      .slice(0, 3)
      .map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer })),
  ];

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/toppers", label: "Toppers" },
    { href: `/year/${topper.year}`, label: `CSE ${topper.year}` },
    { label: name },
  ];

  const toc = [
    ...(topper.bio ? [{ id: "about", label: "About" }] : []),
    { id: "marksheet", label: "Marksheet" },
    ...(papers.length ? [{ id: "compare", label: "Compare" }] : []),
    { id: "answer-copy", label: "Answer copy" },
    ...(topper.strategy ? [{ id: "strategy", label: "Preparation strategy" }] : []),
    ...(insights.length ? [{ id: "insights", label: "Key takeaways" }] : []),
    { id: "related", label: "Related toppers" },
    { id: "faq", label: "Questions" },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".faq-section"] },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
        { "@type": "ListItem", position: 2, name: `UPSC ${topper.year} Toppers`, item: `https://upscprepnotes.in/year/${topper.year}` },
        ...(optHref ? [{ "@type": "ListItem", position: 3, name: `${optional} Toppers`, item: `https://upscprepnotes.in${optHref}` }] : []),
        { "@type": "ListItem", position: optHref ? 4 : 3, name: `AIR ${topper.rank} ${name}`, item: `https://upscprepnotes.in/upsc-topper/${topper.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      description: buildMetaDescription(topper),
      jobTitle: `UPSC CSE ${topper.year} AIR ${topper.rank}`,
      url: `https://upscprepnotes.in/upsc-topper/${topper.slug}`,
      about: { "@id": "https://en.wikipedia.org/wiki/Union_Public_Service_Commission", name: "UPSC" },
      knowsAbout: [{ "@type": "Thing", name: `UPSC CSE ${topper.year}` }, ...(optional ? [{ "@type": "Thing", name: optional }] : [])],
      hasOccupation: { "@type": "Occupation", name: "Civil Servant", occupationLocation: { "@type": "Country", name: "India" } },
    },
  ];

  return (
    <BrandShell>
      <TrackingProvider name={`${topper.firstName} ${topper.lastName}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <Header
            crumbs={crumbs}
            h={{
              name,
              first,
              rank: topper.rank,
              year: topper.year,
              optional,
              optionalHref: optHref,
              avatar: topperImageSrc(topper),
              total,
              written,
              interview,
              optionalScore,
              requests,
              copyLabel,
              summary,
            }}
          />

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-14">
              {topper.bio && (
                <Section id="about" title={`About ${first}`}>
                  <About bio={topper.bio} />
                </Section>
              )}

              <Section id="marksheet" title={`UPSC CSE ${topper.year} marksheet`} meta={papers.length ? `Compared with ${pool.length} complete topper marksheets` : undefined}>
                {placeholder ? (
                  <p className="rounded-[24px] bg-white p-6 text-m leading-[1.6] text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line)]">
                    {`We're checking ${first}'s marks against UPSC's published result. They'll appear here once they match.`}
                  </p>
                ) : (
                  <Marksheet papers={papers} optional={optional} written={written} interview={interview} total={total} pool={pool.length} />
                )}
              </Section>

              {papers.length > 0 && (
                <Section id="compare" title={`Compare ${first} with another topper`}>
                  <CompareBox base={topper.slug} first={first} items={pickItems} picks={picks} />
                </Section>
              )}

              <Section id="answer-copy" title={`${first}'s answer copy`} meta={requests > 0 ? `${fmt(requests)} requests` : undefined}>
                <AnswerCopy name={name} first={first} slug={topper.slug} pdfCount={pdfs.length} preview={preview} requests={requests} others={freeOthers} compilation={compilation} />
              </Section>

              {topper.strategy && (
                <Section id="strategy" title={`How ${first} prepared`}>
                  <StrategyBlock first={first} strategy={topper.strategy} generated={generated} />
                </Section>
              )}

              {insights.length > 0 && (
                <Section id="insights" title="Key takeaways">
                  <Insights items={insights.slice(0, 8)} />
                </Section>
              )}

              <Section id="related" title="Related toppers" meta="Every card opens a full marksheet">
                <Related groups={groups} />
              </Section>

              <Section id="faq" title={`Questions about ${first}`}>
                <Faq items={faqs} />
              </Section>

              <Section id="continue" title="Continue reading">
                <ContinueReading main={mainNext} prev={prevNext(above)} next={prevNext(below)} />
              </Section>
            </div>

            <Sidebar
              s={{ name, first, year: topper.year, optional, optionalHref: optHref, copyLabel, copyNote, toc, compilation }}
            />
          </div>
        </div>
      </div>
      <StickyCopyBar label={copyLabel} note={copyNote} />
    </BrandShell>
  );
}
