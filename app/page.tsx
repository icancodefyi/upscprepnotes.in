import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { PDFModel } from "@/models/pdf.model";
import { PYQModel } from "@/models/pyq.model";
import { PRODUCTS } from "@/lib/store-products";
import { getFeaturedToppers } from "@/services/topper.service";
import Hero from "./_home/Hero";
import Pillars from "./_home/Pillars";
import StackedSheets from "./_home/StackedSheets";
import MarksStory, { type StoryPaper } from "./_home/MarksStory";
import Guides, { type Guide } from "./_home/Guides";
import OptionalFolders, { type OptionalTile } from "./_home/OptionalFolders";
import Years, { type YearCard } from "./_home/Years";
import StoreShelf, { type ShelfItem } from "./_home/StoreShelf";
import Verify from "./_home/Verify";
import Founder from "./_home/Founder";
import LeadPack from "./_home/LeadPack";
import Faq, { FAQS } from "./_home/Faq";
import BrandShell from "@/components/brand/BrandShell";
import type { Booklet } from "./_home/types";

export const revalidate = 3600;

// Metadata and the WebPage schema are the old homepage's, unchanged: the redesign does not touch SEO.
export const metadata: Metadata = {
  title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides for UPSC CSE",
  description:
    "Access 280+ UPSC topper profiles with verified marks, 50+ handwritten answer copies (GS1-4, Essay, Optional), optional subject analysis, AI mentor, and a curated store of strategy compilations.",
  openGraph: {
    title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides",
    description:
      "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, marks breakdowns, optional subject analysis, an AI mentor for prep guidance, and a curated store.",
    url: "https://upscprepnotes.in",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides",
    description:
      "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, optional analysis, and an AI mentor.",
  },
  alternates: {
    canonical: "https://upscprepnotes.in",
  },
};


type LeanTopper = {
  firstName?: string;
  lastName?: string;
  rank?: number;
  year?: number;
  slug?: string;
  optionalSubject?: string;
  marks?: Record<string, number | undefined>;
  freeAnswerCopyUrls?: string[];
  answerCopies?: Record<string, string[] | undefined>;
};

const n = (t: LeanTopper, k: string) => t.marks?.[k] ?? 0;
// Some names are stored in capitals ("UMA Harathi"); show them in normal case.
const name = (t: LeanTopper) =>
  `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim().replace(/\b([A-Z])([A-Z]+)\b/g, (_, a: string, b: string) => a + b.toLowerCase());
const opt = (t: LeanTopper) => n(t, "optional1") + n(t, "optional2");
const subjectOf = (s?: string) => (s && /political science/i.test(s) ? "PSIR" : s ?? "");

const STORY_PAPERS: { key: string; label: string; max: number; get: (t: LeanTopper) => number }[] = [
  { key: "essay", label: "Essay", max: 250, get: (t) => n(t, "essay") },
  { key: "gs1", label: "GS Paper I", max: 250, get: (t) => n(t, "gs1") },
  { key: "gs2", label: "GS Paper II", max: 250, get: (t) => n(t, "gs2") },
  { key: "gs3", label: "GS Paper III", max: 250, get: (t) => n(t, "gs3") },
  { key: "gs4", label: "GS Paper IV · Ethics", max: 250, get: (t) => n(t, "gs4") },
  { key: "optional", label: "Optional · Papers I + II", max: 500, get: opt },
  { key: "interview", label: "Personality Test", max: 275, get: (t) => n(t, "interview") },
];

// Real booklet scans hosted on ImageKit. Harshita Goyal's preview is excluded: it carries a reseller's watermark.
const BOOKLETS = ["ishita-kishore", "garima-lohia", "uma-harathi", "divya-tanwar", "ayan-jain", "shivani-ettaboyina", "vaishali-chopra"];

// Strategy guides that exist under /content, each tied to the paper whose top score we can show.
const GUIDES: { slug: string; title: string; paper: string; key: string; blurb: string }[] = [
  { slug: "how-to-score-130-plus-in-gs1", title: "GS Paper I strategy: history, geography, society", paper: "GS I", key: "gs1", blurb: "History, geography and Indian society, built from toppers' actual GS I marks." },
  { slug: "how-to-score-120-plus-in-gs2", title: "How to score 120+ in GS Paper II", paper: "GS II", key: "gs2", blurb: "Polity, governance and IR answers structured the way high scorers wrote them." },
  { slug: "how-to-score-120-plus-in-gs3", title: "GS Paper III strategy: economy and environment", paper: "GS III", key: "gs3", blurb: "Economy, environment and security, with the current-affairs layer toppers added." },
  { slug: "how-to-score-100-plus-in-gs4", title: "How to score 100+ in GS Paper IV (Ethics)", paper: "GS IV", key: "gs4", blurb: "Case studies, stakeholders and the frameworks behind the top Ethics scores." },
  { slug: "how-to-score-300-plus-in-psir-optional", title: "How to score 300+ in PSIR optional", paper: "PSIR", key: "psir", blurb: "Paper I and II strategy for the most popular optional among toppers." },
  { slug: "upsc-optional-subject-marks-analysis", title: "UPSC optional subject marks analysis", paper: "Optionals", key: "optional", blurb: "Which optional scores highest? Topper marks compared across subjects." },
  { slug: "how-to-write-upsc-mains-answers", title: "How to write UPSC Mains answers", paper: "Mains", key: "essay", blurb: "Intro, body, conclusion: the answer-writing pattern seen across topper copies." },
];

function complete(t: LeanTopper) {
  const tot = n(t, "total");
  return (
    tot > 800 && tot <= 2025 &&
    ["essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2"].every((k) => n(t, k) > 0 && n(t, k) <= 250) &&
    n(t, "interview") > 0 && n(t, "interview") <= 275 &&
    // Placeholder records repeat one number across papers (e.g. 100 everywhere); real sheets never do.
    new Set(["essay", "gs1", "gs2", "gs3", "gs4"].map((k) => n(t, k))).size > 2
  );
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

async function getData() {
  await connectDB();
  const toppers = (await TopperModel.find(
    {},
    { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, freeAnswerCopyUrls: 1, answerCopies: 1 },
  ).lean()) as LeanTopper[];
  const full = toppers.filter(complete);

  const booklets: Booklet[] = BOOKLETS.flatMap((prefix) => {
    const t = toppers.find((x) => x.slug?.startsWith(`${prefix}-rank-`));
    if (!t) return [];
    return [{
      name: name(t),
      rank: t.rank ?? 0,
      year: t.year ?? 0,
      slug: t.slug ?? "",
      optional: subjectOf(t.optionalSubject),
      total: n(t, "total"),
      src: `https://ik.imagekit.io/impiclabs/previews/${prefix}.png`,
      papers: complete(t)
        ? { essay: n(t, "essay"), gs1: n(t, "gs1"), gs2: n(t, "gs2"), gs3: n(t, "gs3"), gs4: n(t, "gs4"), optional: opt(t), interview: n(t, "interview") }
        : null,
    }];
  });

  const hero = full.filter((t) => t.rank === 1).sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0] ?? full[0];
  const papers: StoryPaper[] = STORY_PAPERS.map((p) => {
    const values = full.map(p.get).sort((a, b) => b - a);
    const mine = p.get(hero);
    return {
      key: p.key,
      label: p.label,
      max: p.max,
      score: mine,
      average: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
      position: values.findIndex((v) => v <= mine) + 1,
    };
  });

  const groups = new Map<string, LeanTopper[]>();
  for (const t of toppers) {
    const o1 = n(t, "optional1");
    const o2 = n(t, "optional2");
    if (!t.optionalSubject || o1 <= 0 || o2 <= 0 || o1 > 250 || o2 > 250) continue;
    const subject = subjectOf(t.optionalSubject);
    groups.set(subject, [...(groups.get(subject) ?? []), t]);
  }
  const optionals: OptionalTile[] = [...groups.entries()]
    .filter(([, l]) => l.length >= 9)
    .map(([subject, l]) => {
      const best = l.reduce((a, b) => (opt(b) > opt(a) ? b : a));
      return {
        subject,
        count: l.length,
        median: median(l.map(opt)),
        scores: l.map(opt).sort((a, b) => a - b),
        best: { name: name(best), rank: best.rank ?? 0, year: best.year ?? 0, score: opt(best) },
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Highest score on record for each guide's paper, so every guide card carries a real number.
  const topOf = (key: string) => {
    const pool = key === "psir" ? full.filter((t) => subjectOf(t.optionalSubject) === "PSIR") : full;
    const get = key === "psir" || key === "optional" ? opt : (t: LeanTopper) => n(t, key);
    const best = pool.reduce((a, b) => (get(b) > get(a) ? b : a), pool[0]);
    return { score: get(best), name: name(best), rank: best.rank ?? 0, year: best.year ?? 0, max: key === "psir" || key === "optional" ? 500 : 250 };
  };
  const guides: Guide[] = GUIDES.map((g) => ({ ...g, top: topOf(g.key) }));

  const years: YearCard[] = [...new Set(toppers.map((t) => t.year ?? 0).filter(Boolean))]
    .sort((a, b) => b - a)
    .map((y) => {
      const list = toppers.filter((t) => t.year === y);
      const air1 = list.find((t) => t.rank === 1);
      const top3 = [...list].filter((t) => (t.rank ?? 999) <= 3).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
      return {
        year: y,
        count: list.length,
        air1: air1 ? { name: name(air1), slug: air1.slug ?? "", total: n(air1, "total"), optional: subjectOf(air1.optionalSubject) } : null,
        top3: top3.map((t) => ({ name: name(t), rank: t.rank ?? 0, slug: t.slug ?? "" })),
      };
    });

  // Store: real titles and prices only. Ratings and review counts are deliberately not shown.
  const shelf: ShelfItem[] = PRODUCTS.filter((p) => !p.comingSoon).map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    price: p.price,
    image: p.image ?? p.images?.[0] ?? null,
    features: p.features.slice(0, 4),
    fileCount: p.fileCount ?? null,
  }));

  const featured = (await getFeaturedToppers()).map((t) => ({
    href: `/upsc-topper/${t.slug}`,
    label: `${t.firstName} ${t.lastName}`.trim().replace(/\b([A-Z])([A-Z]+)\b/g, (_: string, a: string, b: string) => a + b.toLowerCase()),
  }));

  const [dl, mat, pdfs, pyqCount, pyqYears] = await Promise.all([
    FreeDownloadLeadModel.distinct("email"),
    FreeMaterialLeadModel.distinct("email"),
    PDFModel.find({}, { resources: 1 }).lean() as Promise<{ resources?: unknown[] }[]>,
    PYQModel.countDocuments(),
    PYQModel.distinct("year") as Promise<number[]>,
  ]);

  const freeCopies = toppers.filter(
    (t) => (t.freeAnswerCopyUrls?.length ?? 0) > 0 || Object.values(t.answerCopies ?? {}).some((v) => (v?.length ?? 0) > 0),
  ).length;

  return {
    featured,
    booklets,
    optionals,
    guides,
    years,
    shelf,
    counts: {
      toppers: toppers.length,
      full: full.length,
      aspirants: new Set([...dl, ...mat]).size,
      freeCopies,
      optionals: new Set(toppers.map((t) => subjectOf(t.optionalSubject)).filter(Boolean)).size,
      resources: pdfs.reduce((s, d) => s + (d.resources?.length ?? 0), 0),
      pyqs: pyqCount,
      pyqYears: [...pyqYears].sort(),
    },
    story: {
      name: name(hero),
      rank: hero.rank ?? 1,
      year: hero.year ?? 0,
      slug: hero.slug ?? "",
      optional: subjectOf(hero.optionalSubject),
      total: n(hero, "total"),
      compared: full.length,
      papers,
    },
  };
}



export default async function HomePage() {
  const { featured, booklets, optionals, guides, years, shelf, counts, story } = await getData();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
      description: "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ verified handwritten answer copies, marks breakdowns, optional subject analysis, and AI-powered preparation insights.",
      url: "https://upscprepnotes.in",
      publisher: { "@type": "Organization", name: "UPSCPrepNotes", url: "https://upscprepnotes.in" },
      breadcrumb: { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" }] },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS(counts).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "UPSC topper answer booklets",
      itemListElement: booklets.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://upscprepnotes.in/upsc-topper/${b.slug}`,
        name: `${b.name}, AIR ${b.rank}, CSE ${b.year}`,
      })),
    },
  ];

  return (
    <BrandShell footer={{ counts: { toppers: counts.toppers }, featured }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* The story: the exam, the proof, the relief, the choices, the work, the list, the tools, the trust, the start. */}
      <Hero booklets={booklets} counts={counts} />
      <StackedSheets booklets={booklets.filter((b) => b.papers)} />
      <MarksStory story={story} />
      <OptionalFolders optionals={optionals} />
      <Guides guides={guides} />
      <Years years={years} />
      <Pillars counts={counts} />
      <StoreShelf items={shelf} />
      <Verify counts={counts} />
      <Founder counts={counts} />
      <LeadPack />
      <Faq counts={counts} />
    </BrandShell>
  );
}
