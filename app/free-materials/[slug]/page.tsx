import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PopularLinks from "@/components/brand/PopularLinks";
import QuizTeaser from "@/components/quiz/QuizTeaser";
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
import { CATEGORY, getCollection } from "@/lib/materials";
import { TopperModel } from "@/models/topper.model";
import { displayName, isPlaceholder, optionalSlug, subjectOf, totalOf, type LeanTopper } from "@/lib/topper-stats";

// Optional subjects a collection can be about, matched against its title, publisher and tags.
const OPTIONALS: { match: RegExp; subject: string }[] = [
  { match: /\bpsir\b|political science/i, subject: "PSIR" },
  { match: /sociology/i, subject: "Sociology" },
  { match: /anthropology/i, subject: "Anthropology" },
  { match: /geography/i, subject: "Geography" },
  { match: /\bhistory\b/i, subject: "History" },
  { match: /mathematics|\bmaths\b/i, subject: "Mathematics" },
  { match: /hindi literature/i, subject: "Hindi Literature" },
  { match: /public administration|pub ad/i, subject: "Public Administration" },
  { match: /philosophy/i, subject: "Philosophy" },
];
import Files from "../_components/Files";
import { Folder } from "../_components/Cover";

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

const CATEGORY_META: Record<string, { label: string }> = {
  "test-series": { label: "Test Series" },
  notes: { label: "Notes & Material" },
  books: { label: "Books" },
  magazines: { label: "Magazines" },
  "current-affairs": { label: "Current Affairs" },
  optional: { label: "Optional Subjects" },
  other: { label: "Resources" },
};

export default async function PDFDetailPage({ params }: Props) {
  const { slug } = await params;
  const dbSlug = originalSlug(slug);
  const data = await getCollection(dbSlug);
  if (!data) notFound();
  const { meta: c, raw: p, files } = data;
  // One file: the download sits in the header and there is no file list section.
  const single = files.length === 1;
  const sectionMap = new Map<string, number>();
  for (const f of files) sectionMap.set(f.section || "Files", (sectionMap.get(f.section || "Files") ?? 0) + 1);
  const sections = [...sectionMap];
  const cat = CATEGORY[c.category] ?? CATEGORY.other;

  const whatsIncluded = generateWhatsIncluded(p as never);
  const howToUse = generateHowToUse(p as never);
  const keyTopics = generateKeyTopics(p as never);
  const studyTips = generateStudyTips(p as never);
  const faqs = generateFAQs(p as never);
  const editorial = generateEditorialContent(p as never);
  const v2Content = V2_EXTRA_CONTENT[slug];
  const meta = CATEGORY_META[p.category] || CATEGORY_META.other;
  const sourceUrl = (p as { sourceUrl?: string }).sourceUrl || "";

  // Related: same category, newest first (original query).
  await connectDB();
  const related = (await PDFModel.find({ category: p.category, slug: { $ne: p.slug } }).sort({ createdAt: -1 }).limit(6).lean()) as unknown as { _id: string; slug: string; title: string; brand?: string; description?: string }[];

  // If the collection is about an optional, link that optional's hub and its highest-scoring toppers.
  const opt = OPTIONALS.find((o) => o.match.test(`${c.title} ${c.brand} ${c.tags.join(" ")}`));
  const optToppers = opt
    ? ((await TopperModel.find({}, { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1 }).lean()) as LeanTopper[])
        .filter((t) => subjectOf(t.optionalSubject).toLowerCase() === opt.subject.toLowerCase() && !isPlaceholder(t) && totalOf(t) > 0)
        .sort((a, b) => (b.marks?.optional1 ?? 0) + (b.marks?.optional2 ?? 0) - ((a.marks?.optional1 ?? 0) + (a.marks?.optional2 ?? 0)))
        .slice(0, 4)
    : [];
  const optHref = opt ? `/optional/${optionalSlug(opt.subject)}` : null;

  const toc = [
    { id: "whats-included", label: "What’s Included" },
    { id: "about", label: "About This Resource" },
    { id: "how-to-use", label: "How to Use This for UPSC Prep" },
    ...(single ? [] : [{ id: "files", label: "Resources" }]),
    ...(faqs.length ? [{ id: "faq", label: "Frequently Asked Questions" }] : []),
    ...(related.length ? [{ id: "more", label: `More ${meta.label}` }] : []),
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
            <Link href="/" data-track="pdf-detail-home" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/free-materials" data-track="pdf-detail-free-materials" className="hover:text-[var(--ink)]">Free Materials</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">{p.title}</span>
          </nav>

          {/* HEADER */}
          <header className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
            <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-start">
              <div className="w-[150px] shrink-0 sm:w-[170px]">
                <Folder c={c} />
              </div>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-s">
                  <span className="rounded-full px-2.5 py-0.5 font-bold" style={{ background: cat.tone, color: cat.ink }}>{meta.label}</span>
                  {p.brand && <span className="rounded-full bg-[var(--canvas)] px-2.5 py-0.5 font-bold text-[var(--ink-2)]">{p.brand}</span>}
                </p>
                <h1 className="t-display mt-3 text-l">{p.title}</h1>
                {p.description && <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{p.description}</p>}
                {p.fileSize && <p className="mt-2 text-s text-[var(--muted)]">{`File size: ${p.fileSize} ${p.pageCount ? `· ${p.pageCount} pages` : ""}`}</p>}
                <a href="https://t.me/+2eV0YCTGdNcyNmFl" target="_blank" rel="noopener noreferrer" className="btn btn-paper mt-4 h-10 px-4 [--btn-fs:14px]">
                  Join Telegram — Daily Current Affairs
                </a>
              </div>
            </div>

            {/* Right of the title: the download for one-file collections, the contents for series */}
            {single ? (
              <div className="scroll-mt-28">
                <Files slug={c.slug} title={p.title} category={c.category} files={files} single={!p.resources?.length} downloads={c.requests} />
                {sourceUrl && (
                  <p className="mt-3 text-center text-s text-[var(--muted)]">
                    Source:{" "}
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer" data-track="pdf-detail-source-link" className="underline hover:text-[var(--ink)]">pdfnotes.co</a>
                  </p>
                )}
              </div>
            ) : (
              <div className={`${card} p-5`}>
                <ul className="space-y-1.5 text-s">
                  {sections.slice(0, 6).map(([name, k]) => (
                    <li key={name} className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[var(--ink-2)]">{name}</span>
                      <span className="tab shrink-0 font-bold">{`${k} resource${k !== 1 ? "s" : ""}`}</span>
                    </li>
                  ))}
                  {sections.length > 6 && <li className="text-s text-[var(--muted)]">{`+ ${sections.length - 6}`}</li>}
                </ul>
                <a href="#files" data-track="material-header-download" className="btn btn-blue mt-4 w-full justify-between">
                  Download ↓ <span className="knob">↓</span>
                </a>
              </div>
            )}
          </header>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-14">
              {/* WHAT'S INCLUDED */}
              <Section id="whats-included" title="What’s Included">
                <div className={`${card} p-6 sm:p-7`}>
                  <p className="text-m leading-[1.7] text-[var(--ink-2)]">{whatsIncluded}</p>
                  {keyTopics.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {keyTopics.map((topic) => (
                        <li key={topic} className="rounded-full bg-[var(--canvas)] px-3 py-1 text-s text-[var(--ink-2)]">{topic}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Section>

              {/* EDITORIAL CONTENT */}
              <Section id="about" title="About This Resource">
                <div className={`${card} space-y-4 p-6 text-m leading-[1.7] text-[var(--ink-2)] sm:p-7`}>
                  <p>{editorial}</p>
                  {v2Content && (
                    <div className="space-y-3 rounded-[16px] bg-[#e9edff] p-5">
                      {v2Content.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              </Section>

              {/* HOW TO USE */}
              <Section id="how-to-use" title="How to Use This for UPSC Prep">
                <div className={`${card} p-6 sm:p-7`}>
                  <p className="text-m leading-[1.7] text-[var(--ink-2)]">{howToUse}</p>
                  {studyTips.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {studyTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-s leading-[1.6] text-[var(--ink-2)]">
                          <span aria-hidden className="mt-0.5 shrink-0 font-bold text-[var(--accent)]">&#10003;</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Section>

              {/* RESOURCES LIST (multi-item collections like test series) */}
              {!single && (
                <section id="files" className="scroll-mt-28">
                  <Files slug={c.slug} title={p.title} category={c.category} files={files} single={false} downloads={c.requests} />
                </section>
              )}

              {/* OFFER */}
              <section className="flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <h2 className="t-head text-l">How toppers actually wrote it</h2>
                  <p className="mt-1 text-s text-[var(--muted)]">63 handwritten topper answer copies with their marks · ₹199 · Instant download.</p>
                </div>
                <Link href="/store/answer-copies-compilation" data-track={`pdf-upsell-${p.slug}`} className="btn btn-blue shrink-0 self-start sm:self-center">
                  See the answer copies &rarr;
                </Link>
              </section>
              <PopularLinks track="pdf-popular" />
              <QuizTeaser track="free-material" />

              {/* FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" title="Frequently Asked Questions">
                  <div className={`${card} divide-y divide-[var(--line)]`}>
                    {faqs.map((f, i) => (
                      <details key={f.q} open={i === 0} className="group px-6 py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="text-m font-bold tracking-[-0.01em]">{f.q}</h3>
                          <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-m transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                        </summary>
                        <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}

              {/* EXPLORE MORE */}
              <Section id="explore" title="Explore More Free Resources">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { href: "/toppers", track: "pdf-detail-toppers", t: "Topper Answer Copies", d: "280+ verified topper profiles with marks and copies" },
                    { href: "/pyq", track: "pdf-detail-pyq", t: "Previous Year Questions", d: "310+ PYQ papers with detailed analysis" },
                    { href: "/free-materials", track: "pdf-detail-more-free-materials", t: "More Free Study Material", d: "2,700+ resources across test series, notes, books, magazines" },
                    { href: "/resources", track: "pdf-detail-guides", t: "UPSC Guides", d: "Full form, syllabus breakdown, free material guide" },
                  ].map((x) => (
                    <Link key={x.href} href={x.href} data-track={x.track} className={`${card} group p-4 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
                      <p className="text-m font-bold group-hover:text-[var(--accent)]">{x.t}</p>
                      <p className="mt-0.5 text-s text-[var(--muted)]">{x.d}</p>
                    </Link>
                  ))}
                </div>
              </Section>

              {/* RELATED — same category */}
              {related.length > 0 && (
                <Section id="more" title={`More ${meta.label}`}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((r) => (
                      <Link key={String(r._id)} href={`/free-materials/${r.slug}`} data-track={`pdf-detail-related-${r.slug}`} className={`${card} group p-4 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
                        <h3 className="truncate text-s font-bold group-hover:text-[var(--accent)]">{r.title}</h3>
                        {r.brand && <p className="mt-0.5 text-s text-[var(--muted)]">{r.brand}</p>}
                        <p className="mt-1 line-clamp-2 text-s text-[var(--ink-2)]">{r.description}</p>
                      </Link>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <nav aria-label="On this page" className={`${card} hidden p-5 lg:block`}>
                <p className="text-m font-bold">On this page</p>
                <Toc items={toc} />
              </nav>
              {opt && optToppers.length > 0 && (
                <div className={`${card} p-5`}>
                  <p className="text-m font-bold">{`Top ${opt.subject} scorers`}</p>
                  <ul className="mt-3 space-y-1">
                    {optToppers.map((t) => (
                      <li key={t.slug}>
                        <Link href={`/upsc-topper/${t.slug}`} data-track="material-optional-topper" className="flex items-center justify-between gap-3 rounded-[10px] px-2 py-1.5 text-s hover:bg-[var(--canvas)]">
                          <span className="min-w-0">
                            <span className="block truncate">{displayName(t)}</span>
                            <span className="block text-s text-[var(--muted)]">{`AIR ${t.rank} · CSE ${t.year}`}</span>
                          </span>
                          <span className="tab shrink-0 text-s font-bold text-[var(--accent)]">{`${(t.marks?.optional1 ?? 0) + (t.marks?.optional2 ?? 0)}/500`}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {optHref && (
                    <Link href={optHref} className="mt-3 block border-t border-[var(--line)] pt-3 text-s font-bold text-[var(--accent)] hover:underline">
                      {`All ${opt.subject} optional toppers →`}
                    </Link>
                  )}
                </div>
              )}
              <div className={`${card} p-5`}>
                <p className="text-m font-bold">Explore</p>
                <ul className="mt-3 space-y-1 text-s">
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
