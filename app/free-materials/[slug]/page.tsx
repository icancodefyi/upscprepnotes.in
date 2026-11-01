import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { PDFModel } from "@/models/pdf.model";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import {
  generateWhatsIncluded,
  generateHowToUse,
  generateKeyTopics,
  generateStudyTips,
  generateFAQs,
  generateEditorialContent,
} from "@/lib/pdf-content";
import BrandShell from "@/components/brand/BrandShell";
import Toc from "@/components/brand/Toc";
import { Section, card } from "@/components/brand/ui";
import { CATEGORY, getCollection, getCollections } from "@/lib/materials";
import Files from "../_components/Files";
import { CollectionCard, Folder } from "../_components/Cover";

// Edward playbook: republish under new URL to get fresh indexing judgment
const V2_SLUGS = new Set([
  "vision-ias-test-series-2026-v2",
  "forum-ias-ethics-handouts-notes-v2",
  "manorama-year-book-2026-v2",
  "yojana-magazine-monthly-pdf-v2",
  "speedy-current-affairs-2026-book-v2",
  "psir-optional-test-series-upsc-v2",
  "drishti-ias-notes-2025-v2",
  "shankar-ias-environment-10th-edition-v2",
  "vision-ias-monthly-current-affairs-magazine-v2",
  "daily-current-affairs-2025-hindi-english-v2",
]);

function originalSlug(slug: string): string {
  return slug.endsWith("-v2") ? slug.slice(0, -3) : slug;
}

const V2_EXTRA_CONTENT: Record<string, string[]> = {
  "vision-ias-test-series-2026-v2": [
    "Vision IAS test series are among the most widely used mock tests by UPSC toppers. The 2026 edition includes updated papers reflecting the latest exam pattern changes — including the new emphasis on case-study based questions in GS4 and source-based questions in GS1. Many rank holders in 2024 and 2025 explicitly credited Vision IAS mocks for their prelims qualification and mains answer-writing speed.",
  ],
  "forum-ias-ethics-handouts-notes-v2": [
    "Forum IAS ethics handouts (GS4) are distinct because they move beyond theoretical ethics into applied moral reasoning — exactly what the UPSC ethics paper demands. The handouts organize the syllabus into 12 modules covering ethical dilemmas, case studies, moral thinkers, and governance ethics. Toppers who scored 130+ in GS4 in 2024 consistently referenced these handouts as their primary GS4 resource alongside the Lexicon.",
  ],
  "manorama-year-book-2026-v2": [
    "The Manorama Year Book 2026 is more than a facts compendium — its structured sections on India's economy, polity, environment, and international relations make it a one-stop reference for GS prelims. The 2026 edition includes updated chapters on India's G20 presidency outcomes, the National Education Policy 2020 implementation status, and key Supreme Court judgments from 2025. Many toppers use it alongside the India Year Book published by the Government of India.",
  ],
  "yojana-magazine-monthly-pdf-v2": [
    "Yojana magazine is directly published by the Government of India's Publications Division and carries policy-level articles written by domain experts — IAS officers, economists, and academics. Each monthly issue covers 8-12 themes aligned with the UPSC syllabus. The magazine's editorials on flagship government schemes like Ayushman Bharat, Jal Jeevan Mission, and PM-KISAN have appeared verbatim in UPSC GS questions. Toppers recommend reading Yojana for Paper-III (economy, environment) and essay writing.",
  ],
  "speedy-current-affairs-2026-book-v2": [
    "Speedy Current Affairs 2026 is organized chronologically by month, making it easy to revise in phases. Each monthly chapter covers national news, international relations, economy, environment, science & tech, schemes, awards, appointments, and sports — mirroring the 11-section structure that UPSC prelims current affairs questions follow. The book includes 500+ practice MCQs at the end, which have historically repeated in the actual prelims exam.",
  ],
  "psir-optional-test-series-upsc-v2": [
    "PSIR (Political Science & International Relations) is the most opted UPSC optional subject — over 600 candidates choose it annually. This test series covers Paper I (political theory and thought) and Paper II (comparative politics and IR) across 15 full-length mocks. Each test includes both the 250-word short-answer format and the 500-word essay-style questions that PSIR demands. The answer keys include model frameworks — how to structure a 500-word answer on 'Rawls vs Nozick on distributive justice' or 'India's Indo-Pacific strategy post-2024'.",
  ],
  "drishti-ias-notes-2025-v2": [
    "Drishti IAS notes are known for their bilingual presentation (Hindi and English side-by-side), making them the primary preparation resource for Hindi-medium aspirants who form nearly 40% of UPSC candidates. The 2025 edition covers the entire GS syllabus in 8 subject-wise volumes. Each chapter begins with the syllabus demand, followed by content, previous year questions, and practice exercises. The notes' strength is their exam-focused treatment — every paragraph is written with the question paper in mind.",
  ],
  "shankar-ias-environment-10th-edition-v2": [
    "Shankar IAS Environment is widely considered the single most important book for UPSC environment and ecology questions — both in prelims and mains. The 10th edition adds chapters on India's updated NDCs (Nationally Determined Contributions), the Green Credit Rules 2024, and the latest IUCN Red List classifications. The book's true value lies in its diagram-based explanations of ecological cycles, biodiversity hotspots, and conservation statuses — topics that UPSC has consistently asked through map-based and diagram-based questions.",
  ],
  "vision-ias-monthly-current-affairs-magazine-v2": [
    "Vision IAS Monthly Current Affairs is unique among current affairs sources because it organizes events by GS paper linkage — showing you exactly which paper and topic each news item belongs to. Each monthly edition covers 45-55 topics across 11 sections with analytical commentary, not just news summaries. The December 2025 issue, for example, linked the COP29 outcomes to GS3 environment and India's climate diplomacy to GS2 IR. Toppers consistently rank this as their primary current affairs source.",
  ],
  "daily-current-affairs-2025-hindi-english-v2": [
    "This bilingual daily current affairs compilation covers every major national and international event from January to December 2025. Each daily entry includes the news summary, GS paper mapping, probable UPSC questions, and key vocabulary. The compilation is particularly valuable for revision — instead of scanning multiple news sources, you get the entire year's relevant news in one structured document. Hindi-medium candidates especially benefit from the parallel English-Hindi presentation.",
  ],
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbSlug = originalSlug(slug);
  const isV2 = V2_SLUGS.has(slug);
  await connectDB();
  const pdf = await PDFModel.findOne({ slug: dbSlug }).lean();
  if (!pdf) return { title: "PDF Not Found" };
  const p = pdf as unknown as Parameters<typeof generateWhatsIncluded>[0] & { title: string };
  const metaDesc = generateWhatsIncluded(p).slice(0, 160);
  return {
    title: `${p.title} — Free PDF Download`,
    description: metaDesc,
    robots: { index: isV2 },
    alternates: { canonical: `https://upscprepnotes.in/free-materials/${slug}` },
    openGraph: {
      title: `${p.title} — Free Download`,
      description: metaDesc,
      url: `https://upscprepnotes.in/free-materials/${slug}`,
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og/default.png"],
    },
  };
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export default async function PDFDetailPage({ params }: Props) {
  const { slug } = await params;
  const dbSlug = originalSlug(slug);
  const data = await getCollection(dbSlug);
  if (!data) notFound();
  const { meta: c, raw: p, files, single } = data;
  const cat = CATEGORY[c.category] ?? CATEGORY.other;

  const whatsIncluded = generateWhatsIncluded(p as never);
  const howToUse = generateHowToUse(p as never);
  const keyTopics = generateKeyTopics(p as never);
  const studyTips = generateStudyTips(p as never);
  const faqs = generateFAQs(p as never);
  const editorial = generateEditorialContent(p as never);
  const v2Content = V2_EXTRA_CONTENT[slug];

  const all = await getCollections();
  const related = all
    .filter((x) => x.slug !== c.slug)
    .sort((a, b) => Number(b.category === c.category) - Number(a.category === c.category) || Number(!!c.brand && b.brand === c.brand) - Number(!!c.brand && a.brand === c.brand) || b.requests - a.requests)
    .slice(0, 6);

  const facts = [
    { k: "Files", v: fmt(c.files) },
    ...(c.requests > 0 ? [{ k: "Downloads", v: fmt(c.requests) }] : []),
    { k: "Language", v: c.hindi ? (files.some((f) => f.language !== "hi") ? "English + हिंदी" : "हिंदी") : "English" },
    ...(c.fileSize ? [{ k: "Size", v: c.fileSize }] : []),
    ...(c.pageCount ? [{ k: "Pages", v: fmt(c.pageCount) }] : []),
    ...(c.year ? [{ k: "Edition", v: String(c.year) }] : []),
  ];

  const toc = [
    { id: "files", label: single ? "Download" : "Files" },
    { id: "about", label: "About this material" },
    { id: "how-to-use", label: "How to use it" },
    ...(faqs.length ? [{ id: "faq", label: "Questions" }] : []),
    ...(related.length ? [{ id: "more", label: "More like this" }] : []),
  ];

  return (
    <BrandShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Free Materials", href: "/free-materials" },
          { name: p.title, href: `/free-materials/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />

      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/free-materials" className="hover:text-[var(--ink)]">Free study material</Link>
            <span aria-hidden>/</span>
            <Link href={`/free-materials?category=${c.category}`} className="hover:text-[var(--ink)]">{cat.label}</Link>
          </nav>

          <header className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <Folder c={c} size="lg" />
            </div>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[14px]">
                <span className="rounded-full px-2.5 py-0.5 font-semibold" style={{ background: cat.tone, color: cat.ink }}>{cat.label}</span>
                {c.brand && <span className="text-[var(--ink-2)]">{`by ${c.brand}`}</span>}
              </p>
              <h1 className="t-display mt-3 text-[clamp(30px,3.6vw,46px)] leading-[1.04]">{p.title}</h1>
              {p.description && <p className="mt-4 max-w-[40rem] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">{p.description}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#files" data-track="material-header-download" className="btn btn-blue">
                  {single ? "Download free PDF" : `See all ${fmt(c.files)} files`} <span className="knob">↓</span>
                </a>
                {c.requests > 0 && <span className="text-[14px] text-[var(--muted)]">{`${fmt(c.requests)} aspirants have downloaded this`}</span>}
              </div>
            </div>
          </header>

          <dl className={`${card} mt-10 flex flex-wrap divide-x divide-[var(--line)]`}>
            {facts.map((f) => (
              <div key={f.k} className="min-w-[120px] flex-1 px-5 py-4">
                <dt className="t-meta">{f.k.toUpperCase()}</dt>
                <dd className="t-head tab mt-1 text-[20px]">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-14">
              <Section id="files" title={single ? "Download" : `All ${fmt(c.files)} files`} meta={c.brand ? `Source: ${c.brand}` : undefined}>
                <Files slug={c.slug} title={p.title} category={c.category} files={files} single={single} />
              </Section>

              <Section id="about" title="About this material">
                <div className={`${card} space-y-4 p-6 sm:p-7 text-[16px] leading-[1.7] text-[var(--ink-2)]`}>
                  <p>{whatsIncluded}</p>
                  <p>{editorial}</p>
                  {v2Content?.map((para, i) => <p key={i}>{para}</p>)}
                  {keyTopics.length > 0 && (
                    <ul className="flex flex-wrap gap-2 pt-2">
                      {keyTopics.map((t) => (
                        <li key={t} className="rounded-full bg-[var(--canvas)] px-3 py-1 text-[13px] text-[var(--ink-2)]">{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Section>

              <Section id="how-to-use" title="How to use it for UPSC">
                <div className={`${card} p-6 sm:p-7`}>
                  <p className="text-[16px] leading-[1.7] text-[var(--ink-2)]">{howToUse}</p>
                  {studyTips.length > 0 && (
                    <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                      {studyTips.map((tip, i) => (
                        <li key={i} className="flex gap-3 rounded-[16px] bg-[var(--canvas)] p-4 text-[14.5px] leading-[1.55] text-[var(--ink-2)]">
                          <span className="t-display tab text-[18px] leading-none text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                          {tip}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </Section>

              {faqs.length > 0 && (
                <Section id="faq" title="Questions">
                  <div className={`${card} divide-y divide-[var(--line)]`}>
                    {faqs.map((f, i) => (
                      <details key={f.q} open={i === 0} className="group px-6 py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="text-[16.5px] font-semibold tracking-[-0.01em]">{f.q}</h3>
                          <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-[16px] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                        </summary>
                        <p className="mt-3 text-[15.5px] leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}

              {related.length > 0 && (
                <Section id="more" title="More like this">
                  <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <CollectionCard c={r} />
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className={`${card} hidden p-5 lg:block`}>
                <a href="#files" data-track="material-side-download" className="btn btn-blue w-full justify-between">
                  {single ? "Download free PDF" : `Browse ${fmt(c.files)} files`} <span className="knob">↓</span>
                </a>
                <p className="mt-2.5 text-center text-[12.5px] text-[var(--muted)]">{c.requests > 0 ? `${fmt(c.requests)} downloads so far` : "Free, one email per collection"}</p>
              </div>
              <nav aria-label="On this page" className={`${card} hidden p-5 lg:block`}>
                <p className="t-meta">ON THIS PAGE</p>
                <Toc items={toc} />
              </nav>
              <Link href="/toppers/toppers-copy-compilation" data-track="material-side-copies" className="group block rounded-[24px] bg-[var(--accent)] p-5 text-white">
                <p className="text-[16px] font-semibold leading-snug">See how toppers actually wrote their answers</p>
                <p className="mt-1.5 text-[13.5px] text-white/70">Real Mains booklets from rank holders, free to read.</p>
                <span className="mt-3 inline-block text-[14px] font-semibold text-[var(--hl)] group-hover:underline">Topper answer copies →</span>
              </Link>
              <div className={`${card} p-5`}>
                <p className="t-meta">EXPLORE</p>
                <ul className="mt-3 space-y-1 text-[14.5px]">
                  {[
                    { href: `/free-materials?category=${c.category}`, label: `All ${cat.label.toLowerCase()}` },
                    { href: "/free-materials", label: "Free study material" },
                    { href: "/pyq", label: "Previous year questions" },
                    { href: "/toppers/marks-database", label: "Topper marks database" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                        {l.label} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
