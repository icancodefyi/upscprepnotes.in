import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getPYQByYear,
  getAllPYQYears,
  getFormattedYearData,
} from "@/data/upsc/pyq/cse-pyq";
import BrandShell from "@/components/brand/BrandShell";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

interface Props {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  const years = await getAllPYQYears();
  return years.map((year) => ({ year }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { year } = await params;
  const data = await getPYQByYear(year);

  if (!data) {
    return { title: "PYQ Not Found" };
  }

  return {
    title: `UPSC CSE ${year} Question Papers PDF - Prelims & Mains`,
    description: `Download official UPSC Civil Services Exam ${year} question papers. Includes GS Paper 1, CSAT, Essay, and General Studies I-IV papers in PDF format.`,
    openGraph: {
      title: `UPSC CSE ${year} Official Question Papers`,
      description: `Complete set of UPSC CSE ${year} question papers for Prelims and Mains. Download PDFs now.`,
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og/default.png"],
    },
    alternates: {
      canonical: `https://upscprepnotes.in/pyq/${year}`,
    },
  };
}

export default async function PYQYearPage({ params }: Props) {
  const { year } = await params;

  function getPYQAnalysis(y: string): { title: string; paragraphs: string[] } | null {
    const analyses: Record<string, { title: string; paragraphs: string[] }> = {
      "2025": {
        title: "UPSC CSE 2025 Question Paper Analysis",
        paragraphs: [
          `The UPSC CSE 2025 question papers reflected a continued emphasis on application-based learning. The GS Paper 1 questions moved beyond traditional art and culture topics, testing candidates on contemporary historical interpretations. GS Paper 2 (Polity, Governance) placed greater weight on case-study based questions about administrative ethics and policy implementation.`,
          `In the 2025 Mains examination, the Essay paper offered a balanced mix of philosophical and contemporary topics, allowing candidates from diverse backgrounds to demonstrate their analytical abilities. The General Studies papers showed a trend towards cross-disciplinary questions — for instance, combining environment topics with economic development in GS Paper 3.`,
          `One standout feature of the 2025 papers was the increased emphasis on India-specific examples. Questions explicitly asked candidates to reference Indian case studies, judgments, and policy initiatives rather than generic international examples. Aspirants preparing for future exams should prioritize government schemes, Supreme Court judgments, and India-specific data points in their preparation.`,
        ],
      },
      "2024": {
        title: "Breaking Down the UPSC 2024 Papers",
        paragraphs: [
          `The UPSC CSE 2024 question papers continued the trend of unpredictable question formats. GS Paper 1 surprised many with detailed questions on post-independence consolidation, moving beyond the usual freedom struggle focus. The Art and Culture section tested lesser-known temple architecture styles, rewarding candidates who had done comprehensive reading.`,
          `GS Paper 4 (Ethics) in 2024 featured longer, more complex case studies requiring nuanced ethical reasoning. The paper moved away from straightforward "what would you do" scenarios towards multi-stakeholder analysis with conflicting ethical obligations. This shift underscores the importance of practicing diverse case studies rather than relying on formulaic approaches.`,
          `For GS Paper 2, the 2024 paper heavily emphasized comparative analysis — comparing governance models across states, analyzing different constitutional provisions, and evaluating policy outcomes. The International Relations section focused more on India's neighborhood policy and multilateral engagements rather than great power dynamics.`,
        ],
      },
      "2023": {
        title: "Key Themes in UPSC 2023 Question Papers",
        paragraphs: [
          `UPSC CSE 2023 question papers marked a noticeable shift towards current affairs integration across all GS papers. Rather than having isolated current affairs questions, the examiner wove contemporary developments into the fabric of every paper — from GS1's coverage of cultural festivals in news to GS3's questions on recent technological developments.`,
          `The 2023 Optional subject papers from popular choices like PSIR, Geography, and Sociology showed that the commission expects deep, analytical engagement rather than rote reproduction of standard textbooks. Many questions required candidates to critically evaluate established theories in the Indian context, testing original thinking.`,
          `A significant observation for future aspirants: the 2023 papers introduced more "compare and contrast" questions, particularly in GS Paper 2 and the Essay paper. The ability to synthesize information from multiple sources and present balanced arguments emerged as a key differentiator between average and top-scoring answers.`,
        ],
      },
      "2022": {
        title: "What UPSC 2022 Papers Reveal About Exam Trends",
        paragraphs: [
          `The UPSC CSE 2022 examination papers represented a return to pre-pandemic question patterns after COVID-era adjustments. The GS papers featured a wider distribution of questions across topics, making it difficult for candidates to skip entire sections during preparation. This reinforced the importance of covering the entire syllabus comprehensively.`,
          `GS Paper 3 in 2022 was notable for its emphasis on disaster management and internal security — topics that UPSC had traditionally given less weight to. The Economic Development section tested not just theoretical concepts but their application to post-pandemic recovery challenges, requiring candidates to connect textbook learning with real-world economic data.`,
          `The 2022 Ethics paper continued the trend of practical case studies but introduced more dilemmas involving digital governance and technology ethics — a reflection of the growing importance of technology in public administration. The interview panel questions in 2022 also showed increased focus on digital India initiatives.`,
        ],
      },
    };
    return analyses[y] || null;
  }
  const formattedData = await getFormattedYearData(year);
  const allYears = await getAllPYQYears();

  if (!formattedData) notFound();

  const { papers } = formattedData;

  const prelimsPapers = papers.filter((p) => p.category === "Prelims");
  const mainsPapers = papers.filter(
    (p) => p.category === "Mains GS" || p.category === "Mains Essay"
  );

  function PaperCard({ paper }: { paper: (typeof papers)[0] }) {
    const hasUrl = Boolean(paper.pdfUrl);
    const id = paper.subject.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className={`${card} flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center`}>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-m font-bold">{paper.subject}</h3>
          <p className="truncate text-s text-[var(--muted)]">{paper.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {hasUrl ? (
            <>
              <a href={paper.pdfUrl} data-track={`pyq-view-${id}`} target="_blank" rel="noopener noreferrer" className="btn btn-paper h-10 px-4 [--btn-fs:14px]">
                View
              </a>
              <a href={paper.pdfUrl} data-track={`pyq-download-${id}`} download className="btn btn-ink h-10 px-4 [--btn-fs:14px]">
                Download ↓
              </a>
            </>
          ) : (
            <span className="rounded-full bg-[var(--canvas)] px-3 py-1.5 text-s text-[var(--muted)]">Coming Soon</span>
          )}
        </div>
      </div>
    );
  }

  const analysis = getPYQAnalysis(year);

  return (
    <BrandShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "PYQ", href: "/pyq" },
          { name: `CSE ${year}`, href: `/pyq/${year}` },
        ]}
      />
      <div className="mx-auto max-w-[1180px] px-6 pb-24 pt-28 sm:pt-32">
        <Link href="/pyq" data-track="pyq-year-back" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
          ← Back to PYQ Archive
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          {/* Main Content */}
          <div className="min-w-0 space-y-12 lg:col-span-8">
            <header>
              <h1 className="t-display text-h1">
                UPSC CSE <span className="swipe">{year}</span> Question Papers
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-s font-bold text-white">Official Papers</span>
                <span className="rounded-full bg-white px-3 py-1 text-s text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)]">Year: {year}</span>
              </div>
              <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
                Official UPSC Civil Services Examination {year} question papers for Prelims (GS + CSAT) and Mains (Essay + GS Papers).
              </p>
            </header>

            {analysis && (
              <section className={`${card} p-6 md:p-8`}>
                <h2 className="t-head text-l">{analysis.title}</h2>
                <p className="mt-1 text-s text-[var(--muted)]">Analysis</p>
                <div className="mt-4 space-y-4">
                  {analysis.paragraphs.map((para, i) => (
                    <p key={i} className="text-m leading-[1.7] text-[var(--ink-2)]">{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Inline Conversion */}
            <div className="flex flex-col gap-4 rounded-[20px] bg-[#fff8d6] p-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="text-m font-bold">Pro Tip from Toppers</p>
                <p className="mt-1 text-s text-[var(--ink-2)]">
                  Don&apos;t just solve PYQs — <strong>analyze how toppers wrote their answers</strong>. See real answer copies with marks.
                </p>
              </div>
              <Link href="/store" data-track="pyq-view-copies" className="btn btn-ink h-11 shrink-0 px-5 [--btn-fs:14px]">
                Browse Store →
              </Link>
            </div>

            {prelimsPapers.length > 0 && (
              <section>
                <h2 className="t-head flex items-center gap-3 text-l">
                  <span className="tab grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-s text-white">1</span>
                  Prelims Examination
                </h2>
                <div className="mt-5 grid gap-3">
                  {prelimsPapers.map((paper, idx) => (
                    <PaperCard key={idx} paper={paper} />
                  ))}
                </div>
              </section>
            )}

            {mainsPapers.length > 0 && (
              <section>
                <h2 className="t-head flex items-center gap-3 text-l">
                  <span className="tab grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-s text-white">2</span>
                  Mains Examination
                </h2>
                <div className="mt-5 grid gap-3">
                  {mainsPapers.map((paper, idx) => (
                    <PaperCard key={idx} paper={paper} />
                  ))}
                </div>
              </section>
            )}

            {/* Paper Structure & Breakdown */}
            <section className={`${card} p-6 md:p-8`}>
              <h2 className="t-head text-l">UPSC CSE {year} Paper Structure & Breakdown</h2>
              <p className="mt-1 text-s text-[var(--muted)]">Breakdown</p>
              <div className="mt-4 space-y-4 text-m leading-[1.7] text-[var(--ink-2)]">
                <p>
                  The UPSC Civil Services Examination {year} consisted of two stages: Prelims and Mains. The Prelims included two objective-type papers — General Studies (GS) Paper 1 and CSAT (Paper 2). GS Paper 1 covered History, Geography, Polity, Economy, Science & Technology, Environment, and Current Affairs. CSAT tested comprehension, logical reasoning, and quantitative aptitude.
                </p>
                <p>
                  The Mains examination comprised 9 papers: Essay (one paper with two essays), GS Paper 1 (Heritage, History, Geography, Society), GS Paper 2 (Polity, Governance, International Relations), GS Paper 3 (Economy, Environment, Security, Technology), GS Paper 4 (Ethics, Integrity, Aptitude), two Optional Subject papers, and two language papers (qualifying in nature). Each GS paper carried 250 marks, totaling 1750 marks for the written segment.
                </p>
              </div>
              <div className="mt-6 rounded-[16px] bg-[var(--canvas)] p-5">
                <h3 className="text-m font-bold">Quick Stats: {year} Papers</h3>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { v: prelimsPapers.length, k: "Prelims Papers" },
                    { v: mainsPapers.length, k: "Mains Papers" },
                    { v: papers.length, k: "Total Papers" },
                    { v: year, k: "Exam Year" },
                  ].map((x) => (
                    <div key={x.k}>
                      <span className="t-display tab text-l leading-none">{x.v}</span>
                      <p className="mt-1 text-s text-[var(--muted)]">{x.k}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How to Use These Papers */}
            <section className={`${card} p-6 md:p-8`}>
              <h2 className="t-head text-l">How to Use the {year} Question Papers for Maximum Benefit</h2>
              <p className="mt-1 text-s text-[var(--muted)]">Guide</p>
              <ol className="mt-5 space-y-5">
                {[
                  { t: "Start with Prelims Papers", d: "Attempt GS Paper 1 under timed conditions (2 hours, 100 questions). Review each incorrect answer and note the topic. Repeat with CSAT. Track your accuracy percentage and identify weak subjects for focused revision." },
                  { t: "Analyze Mains Paper Demands", d: 'Read each GS paper thoroughly before attempting to write. Note the keyword demands — "Discuss", "Analyze", "Critically examine" each requires a different answer structure. Create a mind map of topics tested across all four GS papers to understand the syllabus coverage.' },
                  { t: "Practice Answer Writing", d: "Select 5 questions from each GS paper and write full answers within the word limit (150-200 words for 10-mark, 200-250 for 15-mark questions). Compare your answers with topper copies to improve structure and content quality." },
                ].map((x, i) => (
                  <li key={x.t} className="flex items-start gap-4">
                    <span className="tab grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-s font-bold text-[var(--accent)]">{i + 1}</span>
                    <div>
                      <h3 className="text-m font-bold">{x.t}</h3>
                      <p className="mt-1 text-s leading-[1.6] text-[var(--ink-2)]">{x.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Answer Keys & Solutions */}
            <section className={`${card} p-6 md:p-8`}>
              <h2 className="t-head text-l">Answer Keys & Solutions for {year} Papers</h2>
              <p className="mt-1 text-s text-[var(--muted)]">Solutions</p>
              <p className="mt-4 text-m leading-[1.7] text-[var(--ink-2)]">
                After solving the papers, check your answers against reliable answer keys. For Prelims, compare with answer keys published by leading coaching institutes. For Mains, review model answers to understand the expected content depth and structure.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { href: "/store", track: "pyq-answer-keys-store", t: "Topper Answer Copies", d: "See how AIR-1 to AIR-10 wrote answers" },
                  { href: "/free-materials", track: "pyq-answer-keys-free", t: "Free Study Materials", d: "Notes, test series & current affairs" },
                ].map((x) => (
                  <Link key={x.href} href={x.href} data-track={x.track} className="group flex items-center justify-between gap-3 rounded-[16px] bg-[var(--canvas)] p-4">
                    <div>
                      <span className="text-s font-bold group-hover:text-[var(--accent)]">{x.t}</span>
                      <p className="text-s text-[var(--muted)]">{x.d}</p>
                    </div>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="t-head text-l">Frequently Asked Questions about UPSC CSE {year} Papers</h2>
              <div className={`${card} mt-5 divide-y divide-[var(--line)]`}>
                {[
                  { q: `What is included in the UPSC CSE ${year} question papers PDF?`, a: `The ${year} question papers PDF set includes Prelims GS Paper 1 (General Studies), Prelims CSAT Paper 2, Mains Essay, Mains GS Papers 1-4, and optional subject papers where available.` },
                  { q: `Where can I find solutions for UPSC ${year} question papers?`, a: `You can find model solutions and answer keys from coaching institutes like Drishti IAS, Vajiram & Ravi, and Forum IAS. We also recommend reviewing verified topper answer copies to understand answer writing standards.` },
                  { q: `How many questions were asked in UPSC ${year} Prelims GS Paper 1?`, a: `The UPSC CSE ${year} Prelims GS Paper 1 contained 100 questions worth 2 marks each, totaling 200 marks. Negative marking of 1/3rd mark applied for incorrect answers.` },
                  { q: `What topics were emphasized in the ${year} Mains GS papers?`, a: `The ${year} GS papers emphasized application-based questions with case studies, current affairs integration, and India-specific examples. GS Paper 4 (Ethics) featured longer case studies requiring multi-stakeholder analysis.` },
                ].map((faq) => (
                  <details key={faq.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                      <span className="text-m font-bold">{faq.q}</span>
                      <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                    </summary>
                    <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    { "@type": "Question", name: `What is included in the UPSC CSE ${year} question papers PDF?`, acceptedAnswer: { "@type": "Answer", text: `The ${year} question papers PDF set includes Prelims GS Paper 1 (General Studies), Prelims CSAT Paper 2, Mains Essay, Mains GS Papers 1-4, and optional subject papers where available.` } },
                    { "@type": "Question", name: `Where can I find solutions for UPSC ${year} question papers?`, acceptedAnswer: { "@type": "Answer", text: `You can find model solutions and answer keys from coaching institutes like Drishti IAS, Vajiram & Ravi, and Forum IAS. We also recommend reviewing verified topper answer copies.` } },
                    { "@type": "Question", name: `How many questions were asked in UPSC ${year} Prelims GS Paper 1?`, acceptedAnswer: { "@type": "Answer", text: `The UPSC CSE ${year} Prelims GS Paper 1 contained 100 questions worth 2 marks each, totaling 200 marks. Negative marking of 1/3rd mark applied.` } },
                    { "@type": "Question", name: `What topics were emphasized in the ${year} Mains GS papers?`, acceptedAnswer: { "@type": "Answer", text: `The ${year} GS papers emphasized application-based questions with case studies, current affairs integration, and India-specific examples.` } },
                  ],
                }),
              }}
            />

            {/* CTA */}
            <section className="rounded-[28px] bg-[var(--ink)] p-8 text-center text-white">
              <h3 className="t-head text-l">
                Downloaded the Papers? <br />
                <span className="text-[var(--hl)]">Now See the Answers.</span>
              </h3>
              <p className="mt-1 text-s font-bold text-white/60">RECOMMENDED</p>
              <p className="mx-auto mt-4 max-w-md text-m text-white/70">50+ verified topper answer copies. See how AIR-1 toppers structured their answers.</p>
              <ul className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left text-s text-white/80">
                {["GS 1-4 Model Answers", "Essay Topper Copies", "Marks-wise Breakdown", "Strategy Notes"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden className="font-bold text-[var(--hl)]">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/store" data-track="pyq-explore-compilation" className="btn btn-blue mt-7">
                Browse Store <span className="knob">→</span>
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-4">
            <div className={`${card} p-6 lg:sticky lg:top-24`}>
              <h3 className="text-m font-bold">Other Years</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {allYears.map((y: string) => (
                  <Link
                    key={y}
                    href={`/pyq/${y}`}
                    data-track={`pyq-year-sidebar-${y}`}
                    className={`tab rounded-full px-4 py-2 text-s font-bold transition ${y === year ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"}`}
                  >
                    {y}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-[var(--line)] pt-6">
                <div className="rounded-[18px] bg-[var(--canvas)] p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[var(--hl)] px-2 py-0.5 text-s font-bold text-[var(--hl-ink)]">₹799 Launch</span>
                    <span className="text-s text-[var(--muted)] line-through">₹4,999</span>
                  </div>
                  <h4 className="mt-2 text-m font-bold">Complete Compilation</h4>
                  <p className="mt-1 text-s text-[var(--ink-2)]">21 strategy guides + topper copies + interview prep. Everything in one pack.</p>
                  <Link href="/free-materials" data-track="pyq-sidebar-free-materials" className="mt-4 flex items-center justify-between rounded-[12px] bg-white px-3 py-2.5 text-s font-bold text-[var(--accent)] shadow-[0_0_0_1px_var(--line-2)]">
                    Free Study Material <span aria-hidden>→</span>
                  </Link>
                  <Link href="/store" data-track="pyq-sidebar-bundle" className="btn btn-ink mt-2 h-11 w-full justify-center [--btn-fs:14px]">
                    Browse Store — ₹799 →
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className={`${card} p-6`}>
              <h3 className="text-m font-bold">Related Resources</h3>
              <div className="mt-3 space-y-1 text-s">
                {[
                  { href: `/year/${year}`, track: "pyq-related-year", label: `UPSC Toppers ${year}` },
                  { href: "/optional", track: "pyq-related-optional", label: "Optional Subject Notes" },
                  { href: "/store", track: "pyq-sidebar-browse", label: "Browse Store" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} data-track={l.track} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                    {l.label} <span aria-hidden>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BrandShell>
  );
}
