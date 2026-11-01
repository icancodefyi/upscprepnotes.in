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
  realPhoto,
  subjectOf,
  totalOf,
  type LeanTopper,
} from "@/lib/topper-stats";
import BrandShell from "@/components/brand/BrandShell";
import TrackingProvider from "./TrackingProvider";
import ProfileHero, { type HeroData } from "./_components/ProfileHero";
import PaperBreakdown, { type Cohort } from "./_components/PaperBreakdown";
import AnswerCopy, { type FreeTopper } from "./_components/AnswerCopy";
import Strategy from "./_components/Strategy";
import ReadNext, { type NextGroup, type NextTopper } from "./_components/ReadNext";
import Offer from "./_components/Offer";
import TopperFaq, { type QA } from "./_components/TopperFaq";

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

const toNext = (t: LeanTopper): NextTopper => ({
  name: displayName(t),
  slug: t.slug ?? "",
  rank: t.rank ?? 0,
  year: t.year ?? 0,
  optional: subjectOf(t.optionalSubject),
  total: totalOf(t),
  photo: realPhoto(t.ProfileImage),
  freeCopy: freeCopiesOf(t).length > 0,
});

export default async function TopperPage({ params }: Props) {
  const { slug } = await params;
  const topper = await getTopperBySlug(slug);
  if (!topper) notFound();

  await connectDB();
  const all = (await TopperModel.find(
    {},
    { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, freeAnswerCopyUrls: 1, freeAnswerCopyUrl: 1, ProfileImage: 1 },
  ).lean()) as LeanTopper[];

  const me: LeanTopper = { ...topper, marks: topper.marks };
  const name = displayName(topper);
  const first = name.split(" ")[0];
  const optional = subjectOf(topper.optionalSubject);
  const optHref = optional ? `/optional/${optionalSlug(topper.optionalSubject)}` : null;
  // A record that repeats one number across papers is a placeholder: show none of its marks.
  const placeholder = isPlaceholder(me);
  const total = placeholder ? 0 : totalOf(me);
  const others = all.filter((t) => t.slug !== topper.slug);

  // ── Marks, compared only with complete marksheets ──
  const pool = all.filter(isComplete);
  const cohortDefs = [
    { id: "all", label: "All toppers", phrase: "toppers on record", list: pool },
    { id: "year", label: `CSE ${topper.year}`, phrase: `CSE ${topper.year} toppers`, list: pool.filter((t) => t.year === topper.year) },
    ...(optional ? [{ id: "optional", label: optional, phrase: `${optional} toppers`, list: pool.filter((t) => subjectOf(t.optionalSubject) === optional) }] : []),
  ];
  const cohorts: Cohort[] = placeholder
    ? []
    : cohortDefs
        .filter((c) => c.list.length >= 5)
        .map((c) => ({ id: c.id, label: c.label, phrase: c.phrase, size: c.list.length, stats: paperStats(me, c.list) }))
        .filter((c) => c.stats.length >= 3);
  const papers = cohorts[0]?.stats ?? [];

  // ── The one-line hook: built from the numbers, never from adjectives ──
  const standout = [...papers].sort((a, b) => a.position - b.position || b.beats - a.beats)[0];
  let hook = placeholder
    ? `${first} secured AIR ${topper.rank} in UPSC CSE ${topper.year}.`
    : topper.rank === 1
      ? `Topped UPSC CSE ${topper.year} with ${fmt(total)} marks out of 2,025.`
      : `${fmt(total)} marks out of 2,025 put ${first} at AIR ${topper.rank} in CSE ${topper.year}.`;
  if (placeholder) hook += " The marks on this record failed our checks, so we're holding them back until they're verified against UPSC's result.";
  else if (standout?.position === 1) hook += ` That includes the highest ${standout.short} score in all ${standout.of} marksheets we hold.`;
  else if (standout && standout.beats >= 75) hook += ` ${standout.short}: better than ${standout.beats}% of ${standout.of} toppers on record.`;
  else if (papers.length) hook += ` Here is every paper, set against ${papers[0].of} other toppers.`;
  else hook += " Paper-by-paper marks for this record aren't published yet.";

  // ── Answer copy ──
  const pdfs = freeCopiesOf(me);
  const preview = previewFor(topper.slug);
  const freeOthers: FreeTopper[] = others
    .filter((t) => freeCopiesOf(t).length > 0)
    .map((t) => ({ name: displayName(t), slug: t.slug ?? "", rank: t.rank ?? 0, year: t.year ?? 0, optional: subjectOf(t.optionalSubject), same: !!optional && subjectOf(t.optionalSubject) === optional }))
    .sort((a, b) => Number(b.same) - Number(a.same) || Number(b.year === topper.year) - Number(a.year === topper.year) || a.rank - b.rank)
    .slice(0, 6);

  const comp = PRODUCTS.find((p) => p.slug === "answer-copies-compilation" && !p.comingSoon);
  const booklets = comp?.specs?.find((s) => s.label === "Answer Sheets")?.value;

  // ── Strategy: only text written from sources, never the machine-written first-person stories ──
  const genuine = !!topper.strategy && !isFirstPersonStrategy(topper.strategy);

  // ── Read next ──
  const byTotal = (a: LeanTopper, b: LeanTopper) => totalOf(b) - totalOf(a);
  const groups: NextGroup[] = [
    ...(optional ? [{ id: "optional", label: `${optional} toppers`, toppers: others.filter((t) => subjectOf(t.optionalSubject) === optional).sort(byTotal).slice(0, 10).map(toNext) }] : []),
    { id: "year", label: `CSE ${topper.year} toppers`, toppers: others.filter((t) => t.year === topper.year).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)).slice(0, 10).map(toNext) },
    {
      id: "rank",
      label: `Ranks near AIR ${topper.rank}`,
      toppers: others
        .filter((t) => Math.abs((t.rank ?? 0) - topper.rank) <= Math.max(5, Math.round(topper.rank * 0.1)))
        .sort((a, b) => Math.abs((a.rank ?? 0) - topper.rank) - Math.abs((b.rank ?? 0) - topper.rank) || (b.year ?? 0) - (a.year ?? 0))
        .slice(0, 10)
        .map(toNext),
    },
  ];

  // ── FAQ: honest answers, the same text in the page and in the schema ──
  const best = papers.length ? [...papers].filter((p) => p.max === 250).sort((a, b) => b.score - a.score)[0] : null;
  const faqs: QA[] = [
    { q: `What was ${name}'s UPSC rank?`, a: `AIR ${topper.rank} in UPSC CSE ${topper.year}.` },
    ...(optional ? [{ q: `What was ${name}'s optional subject?`, a: `${topper.optionalSubject?.trim()}.${papers.find((p) => p.key === "optional") ? ` ${first} scored ${papers.find((p) => p.key === "optional")!.score} out of 500 across Papers I and II.` : ""}` }] : []),
    ...(placeholder
      ? []
      : [{
          q: `What were ${name}'s total marks in UPSC?`,
          a: `${fmt(total)} out of 2,025${topper.marks.written ? `: ${fmt(topper.marks.written)} in the written exam and ${topper.marks.interview} in the personality test` : ""}.`,
        }]),
    ...(best ? [{ q: `What was ${name}'s highest-scoring Mains paper?`, a: `${best.label}, with ${best.score} out of 250. That is ${best.score - best.median >= 0 ? `${best.score - best.median} above` : `${best.median - best.score} below`} the median of ${best.of} toppers on record.` }] : []),
    {
      q: `Can I download ${name}'s answer copy?`,
      a: pdfs.length
        ? `Yes, for free. Enter your email in the answer copy section of this page and the PDF opens straight away.`
        : preview
          ? `This page shows a real page from ${first}'s answer booklet. The full booklet is not available as a free download.`
          : `Not yet. We only publish answer copies we actually hold, and we don't have ${first}'s. Free copies from other toppers are listed on this page.`,
    },
    ...(genuine
      ? (topper.faqs ?? [])
          .filter((f: { question: string }) => !/answer copy|total marks|rank\?|optional subject\?/i.test(f.question))
          .slice(0, 3)
          .map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }))
      : []),
  ];

  const crumbs = [
    { href: "/", label: "Home" },
    { href: `/year/${topper.year}`, label: `CSE ${topper.year}` },
    ...(optHref ? [{ href: optHref, label: optional }] : []),
    { label: name },
  ];

  const hero: HeroData = {
    name,
    first,
    rank: topper.rank,
    year: topper.year,
    optional,
    optionalHref: optHref,
    photo: realPhoto(topper.ProfileImage),
    total,
    written: placeholder ? 0 : topper.marks.written,
    interview: placeholder ? 0 : topper.marks.interview,
    papers,
    pool: pool.length,
    hook,
    hasCopy: pdfs.length > 0 || !!preview,
  };

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
      ...(hero.photo ? { image: hero.photo } : {}),
      about: { "@id": "https://en.wikipedia.org/wiki/Union_Public_Service_Commission", name: "UPSC" },
      knowsAbout: [{ "@type": "Thing", name: `UPSC CSE ${topper.year}` }, ...(optional ? [{ "@type": "Thing", name: optional }] : [])],
      hasOccupation: { "@type": "Occupation", name: "Civil Servant", occupationLocation: { "@type": "Country", name: "India" } },
    },
  ];

  return (
    <BrandShell>
      <TrackingProvider name={`${topper.firstName} ${topper.lastName}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <ProfileHero h={hero} crumbs={crumbs} />
      {cohorts.length > 0 && <PaperBreakdown first={first} total={total} cohorts={cohorts} />}
      <AnswerCopy
        name={name}
        first={first}
        slug={topper.slug}
        pdfCount={pdfs.length}
        preview={preview}
        others={freeOthers}
        compilation={comp ? { href: `/store/${comp.slug}`, title: comp.title, price: comp.price, detail: `${booklets ? `${booklets} booklets · ` : ""}₹${comp.price}, one-time` } : null}
      />
      {genuine && <Strategy first={first} strategy={topper.strategy} insights={topper.insights ?? []} />}
      <ReadNext first={first} groups={groups} />
      {comp && (
        <Offer
          first={first}
          p={{ href: `/store/${comp.slug}`, title: comp.title, tagline: comp.tagline, price: comp.price, image: comp.image ?? null, features: comp.features }}
        />
      )}
      <TopperFaq first={first} faqs={faqs} />
    </BrandShell>
  );
}
