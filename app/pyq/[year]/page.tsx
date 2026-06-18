import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getPYQByYear,
  getAllPYQYears,
  getFormattedYearData,
} from "@/data/upsc/pyq/cse-pyq";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Download,
  FileText,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    return { title: "PYQ Not Found - UPSCPrepNotes" };
  }

  return {
    title: `UPSC CSE ${year} Question Papers PDF - Prelims & Mains`,
    description: `Download official UPSC Civil Services Exam ${year} question papers. Includes GS Paper 1, CSAT, Essay, and General Studies I-IV papers in PDF format.`,
    openGraph: {
      title: `UPSC CSE ${year} Official Question Papers`,
      description: `Complete set of UPSC CSE ${year} question papers for Prelims and Mains. Download PDFs now.`,
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

  function PaperCard({
    paper,
  }: {
    paper: (typeof papers)[0];
  }) {
    const hasUrl = Boolean(paper.pdfUrl);

    return (
      <div className="group bg-white border-2 border-gray-200 p-5 hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="mt-1 text-[#C4F9D7] shrink-0">
            <FileText
              size={22}
              className="fill-current stroke-black"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold group-hover:underline decoration-[#C4F9D7] decoration-2 underline-offset-4 transition-all truncate">
              {paper.subject}
            </h3>
            <p className="text-gray-500 text-sm truncate">
              {paper.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {hasUrl ? (
            <>
              <Button
                className="bg-white text-black border-2 border-gray-300 hover:border-black"
                asChild
              >
                <a
                  href={paper.pdfUrl}
                  data-track={`pyq-view-${paper.subject.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-4 h-4 mr-2" /> View
                </a>
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                asChild
              >
                <a href={paper.pdfUrl} data-track={`pyq-download-${paper.subject.toLowerCase().replace(/\s+/g, '-')}`} download>
                  <Download className="w-4 h-4 mr-2" /> Download
                </a>
              </Button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 border-2 border-dashed border-gray-200">
              <Sparkles size={12} />
              Coming Soon
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/pyq"
            data-track="pyq-year-back"
            className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to PYQ Archive
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C4F9D7] text-black border border-black rounded-full text-xs font-bold tracking-wider uppercase">
                  Official Papers
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-gray-600 border border-gray-200 rounded-full text-xs font-medium uppercase tracking-wider">
                  <Calendar size={12} />
                  Year: {year}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                UPSC CSE{" "}
                <span className="bg-[#C4F9D7] px-2 border border-black">
                  {year}
                </span>{" "}
                Question Papers
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Official UPSC Civil Services Examination {year} question papers
                for Prelims (GS + CSAT) and Mains (Essay + GS Papers).
              </p>
            </div>

            {/* Year Analysis */}
            {(() => {
              const analysis = getPYQAnalysis(year);
              if (!analysis) return null;
              return (
                <section className="bg-white border-2 border-gray-200 p-6 md:p-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Analysis</p>
                  <h2 className="text-2xl font-bold mb-4">{analysis.title}</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {analysis.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Inline Conversion */}
            <div className="bg-white border-2 border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-black" />
                    <span className="font-bold">Pro Tip from Toppers</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Don&apos;t just solve PYQs —{" "}
                    <strong>analyze how toppers wrote their answers</strong>.
                    See real answer copies with marks.
                  </p>
                </div>
                <a
                  href="/store"
                  data-track="pyq-view-copies"
                  className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 hover:bg-gray-800 transition-colors shrink-0 text-sm"
                >
                  Browse Store <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Prelims Section */}
            {prelimsPapers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm">
                    1
                  </span>
                  Prelims Examination
                </h2>
                <div className="grid gap-4">
                  {prelimsPapers.map((paper, idx) => (
                    <PaperCard key={idx} paper={paper} />
                  ))}
                </div>
              </section>
            )}

            {/* Mains Section */}
            {mainsPapers.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#C4F9D7] text-black border border-black flex items-center justify-center text-sm">
                    2
                  </span>
                  Mains Examination
                </h2>
                <div className="grid gap-4">
                  {mainsPapers.map((paper, idx) => (
                    <PaperCard key={idx} paper={paper} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-8">
              <div className="text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-[#C4F9D7]/20 border border-[#C4F9D7]/30 px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#C4F9D7]" />
                  <span className="text-sm text-[#C4F9D7] font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  Downloaded the Papers? <br />
                  <span className="text-[#C4F9D7]">Now See the Answers.</span>
                </h3>
                <p className="text-gray-400 mb-6">
                  50+ verified topper answer copies. See how
                  AIR-1 toppers structured their answers.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6 text-left max-w-sm mx-auto">
                  {[
                    "GS 1-4 Model Answers",
                    "Essay Topper Copies",
                    "Marks-wise Breakdown",
                    "Strategy Notes",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#C4F9D7] shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/store"
                  data-track="pyq-explore-compilation"
                  className="inline-flex items-center gap-2 bg-[#C4F9D7] text-black font-bold px-8 py-4 hover:bg-white transition-colors"
                >
                  Browse Store <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Year Selector */}
            <div className="bg-white border-2 border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Other Years</h3>
              <div className="flex flex-wrap gap-2">
                {allYears.map((y: string) => (
                  <Link
                    key={y}
                    href={`/pyq/${y}`}
                    data-track={`pyq-year-sidebar-${y}`}
                    className={`px-4 py-2 text-sm font-bold border-2 transition-all ${
                      y === year
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                    }`}
                  >
                    {y}
                  </Link>
                ))}
              </div>

              {/* Sidebar Conversion */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">₹799 Launch</span>
                    <span className="text-[11px] text-gray-500 line-through">₹4,999</span>
                  </div>
                  <h4 className="font-bold text-white mb-1">Complete Compilation</h4>
                  <p className="text-xs text-gray-400 mb-4">
                    21 strategy guides + topper copies + interview prep. Everything in one pack.
                  </p>
                <a
                  href="/free-materials"
                  data-track="pyq-sidebar-free-materials"
                  className="flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-100 hover:border-blue-300 transition-all group"
                >
                  <span className="text-sm font-medium text-blue-700 group-hover:text-blue-900">
                    Free Study Material
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-blue-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
                  />
                </a>
                <a
                    href="/store"
                    data-track="pyq-sidebar-bundle"
                    className="inline-flex items-center justify-center w-full bg-white text-gray-900 font-bold px-4 py-3 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Browse Store — ₹799 <ArrowRight className="w-3 h-3 ml-2" />
                  </a>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white border-2 border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#C4F9D7]" />
                Related Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="/toppers"
                  data-track="pyq-related-toppers"
                  className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-100 hover:border-black transition-all group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                    UPSC Toppers {year}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-black transform group-hover:translate-x-1 transition-all"
                  />
                </a>
                <a
                  href="/optional"
                  data-track="pyq-related-optional"
                  className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-100 hover:border-black transition-all group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                    Optional Subject Notes
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-black transform group-hover:translate-x-1 transition-all"
                  />
                </a>
                <a
                  href="/store"
                  data-track="pyq-sidebar-browse"
                  className="flex items-center justify-between p-3 bg-[#C4F9D7]/20 border-2 border-[#C4F9D7] hover:border-black transition-all group"
                >
                  <span className="text-sm font-bold text-black">
                    Browse Store
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-black transform group-hover:translate-x-1 transition-all"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
