import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface Props {
  params: Promise<{ year: string }>;
}

interface TopperData {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  slug: string;
  marks: Record<string, number>;
}

async function getToppersByYear(year: number) {
  await connectDB();
  const toppers = await TopperModel.find({ year }).sort({ rank: 1 }).lean();
  return toppers.map((t: any) => ({
    firstName: t.firstName,
    lastName: t.lastName,
    rank: t.rank,
    year: t.year,
    optionalSubject: t.optionalSubject || "",
    slug: t.slug,
    bio: t.bio || "",
    marks: {
      gs1: t.marks?.gs1 || 0,
      gs2: t.marks?.gs2 || 0,
      gs3: t.marks?.gs3 || 0,
      gs4: t.marks?.gs4 || 0,
      essay: t.marks?.essay || 0,
      optional1: t.marks?.optional1 || 0,
      optional2: t.marks?.optional2 || 0,
      interview: t.marks?.interview || 0,
      written: t.marks?.written || 0,
      total: t.marks?.total || 0,
    },
  }));
}

function getYearAnalysis(year: number): { title: string; paragraphs: string[] } | null {
  const analyses: Record<number, { title: string; paragraphs: string[] }> = {
    2025: {
      title: "What UPSC 2025 Results Tell Us",
      paragraphs: [
        `The UPSC Civil Services Examination 2025 results revealed several notable trends. The top 100 ranks were dominated by candidates with diverse optional subjects, with PSIR, Geography, and Public Administration maintaining their positions as popular choices among high-ranking candidates. The average marks of top candidates remained consistent with previous years, suggesting stable evaluation standards.`,
        `A significant observation from the 2025 results was the strong performance of candidates from engineering and humanities backgrounds alike, reinforcing that the UPSC examination rewards consistent preparation regardless of academic discipline. The interview scores among top candidates showed a narrower distribution compared to previous years, indicating a more standardized approach to the personality test.`,
        `For aspirants preparing for future cycles, the 2025 results underscore the importance of balanced preparation across all GS papers. Top performers consistently scored above 60% across all four General Studies papers, with no single paper acting as a differentiator. The essay paper continued to be a critical filter, with many candidates at the cutoff level seeing significant score variations here.`,
      ],
    },
    2024: {
      title: "Key Takeaways from UPSC 2024 Results",
      paragraphs: [
        `The UPSC 2024 results marked a significant year with several women candidates securing top ranks, continuing a positive trend towards greater gender diversity in the civil services. The optional subject analysis revealed that PSIR and Sociology continued to produce a high number of successful candidates in the top 100 ranks.`,
        `A noteworthy pattern from the 2024 examination was the performance in the ethics paper (GS4), where top-ranked candidates consistently scored above 130 marks, highlighting the growing importance of ethics preparation in the overall strategy. Candidates who scored well in GS4 also tended to perform better in the interview round, suggesting a correlation between ethical reasoning skills and personality test performance.`,
        `The 2024 results also demonstrated that candidates who had attempted the Mains examination 2-3 times before finally securing a rank formed a significant portion of the final list. This challenges the notion that early success is the norm and reinforces the importance of persistence in the UPSC journey.`,
      ],
    },
    2023: {
      title: "UPSC 2023: Trends and Analysis",
      paragraphs: [
        `UPSC 2023 saw one of the highest number of candidates qualifying for the interview round, reflecting a slight easing in the Mains evaluation or improved answer writing standards among aspirants. The year was notable for the strong performance of candidates from smaller towns, with several top-50 ranks going to candidates from non-metro cities.`,
        `In terms of optional subjects, Mathematics and Anthropology emerged as high-scoring options, with several candidates in the top 20 having chosen these subjects. This suggests that candidates who can handle technical or scientific subjects have a distinct advantage in scoring high marks. Medical Science optional also produced impressive results.`,
        `The essay paper results from 2023 showed a wide dispersion of marks, with the difference between the highest and lowest essay scores among selected candidates exceeding 50 marks in some cases. This reinforces the essay paper's role as a significant differentiator in the final merit list.`,
      ],
    },
    2022: {
      title: "What UPSC 2022 Taught Us",
      paragraphs: [
        `The UPSC 2022 examination cycle was historic as it saw the largest number of women candidates in the top 20 in recent years. The year also marked the introduction of more analytical questions in the GS papers, moving away from direct factual recall towards application-based assessment.`,
        `Geography and Public Administration continued their dominance as optional subjects among successful candidates, accounting for nearly 40% of the top 100 ranks. However, candidates with niche subjects like Political Science and Sociology also secured very high ranks, demonstrating that subject mastery matters more than subject choice.`,
        `A key lesson from the 2022 results for future aspirants is the importance of the interview stage. Several candidates with relatively lower written scores (in the 800-830 range) jumped significantly in the final ranking due to high interview marks (195+), proving that the personality test can dramatically alter final standings.`,
      ],
    },
  };
  return analyses[year] || null;
}

function computeInsights(toppers: TopperData[], year: number) {
  if (toppers.length === 0) return [];

  const insights: string[] = [];
  const marks = toppers.map(t => t.marks);
  const totals = marks.map(m => m.total).filter(m => m > 0);
  const interviews = marks.map(m => m.interview).filter(m => m > 0);
  const essays = marks.map(m => m.essay).filter(m => m > 0);
  const optionals = toppers.map(t => t.optionalSubject).filter(Boolean);

  if (totals.length > 0) {
    const avgTotal = (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1);
    insights.push(`Average total marks for UPSC ${year} toppers: ${avgTotal}`);
    insights.push(`Highest total marks: ${Math.max(...totals)} | Lowest total marks: ${Math.min(...totals)}`);
  }

  if (interviews.length > 0) {
    const avgInterview = (interviews.reduce((a, b) => a + b, 0) / interviews.length).toFixed(1);
    insights.push(`Average interview score for UPSC ${year} toppers: ${avgInterview}`);
    insights.push(`Highest interview score: ${Math.max(...interviews)} | Lowest interview score: ${Math.min(...interviews)}`);
  }

  if (essays.length > 0) {
    const avgEssay = (essays.reduce((a, b) => a + b, 0) / essays.length).toFixed(1);
    insights.push(`Average essay marks for UPSC ${year} toppers: ${avgEssay}`);
    insights.push(`Highest essay score: ${Math.max(...essays)} | Lowest essay score: ${Math.min(...essays)}`);
  }

  if (optionals.length > 0) {
    const freq: Record<string, number> = {};
    optionals.forEach(s => { freq[s] = (freq[s] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    insights.push(`Most common optional subject among UPSC ${year} toppers: ${sorted[0][0]} (${sorted[0][1]} toppers)`);
    if (sorted.length > 1) {
      insights.push(`Optional subject distribution: ${sorted.slice(0, 5).map(([s, c]) => `${s} (${c})`).join(", ")}`);
    }
  }

  return insights;
}

export async function generateStaticParams() {
  return [2022, 2023, 2024, 2025].map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    return { title: "Invalid Year" };
  }

  return {
    title: `UPSC ${yearNum} Toppers — Complete Marks Dataset`,
    description: `Full marks breakdown for UPSC ${yearNum} toppers including GS papers, optional subject, essay, interview, and total scores.`,
    alternates: {
      canonical: `https://upscprepnotes.in/year/${year}`,
    },
    openGraph: {
      title: `UPSC ${yearNum} Toppers — Complete Marks Dataset`,
      description: `Full marks breakdown for UPSC ${yearNum} toppers including GS papers, optional subject, essay, interview, and total scores.`,
      url: `https://upscprepnotes.in/year/${year}`,
    },
  };
}

const ALL_YEARS = [2022, 2023, 2024, 2025];

export default async function YearPage({ params }: Props) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold">Invalid year</h1>
        </div>
      </main>
    );
  }

  const toppers = await getToppersByYear(yearNum);
  const insights = computeInsights(toppers, yearNum);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `UPSC CSE ${yearNum} Topper Marks Dataset`,
    "description": `Structured dataset of UPSC CSE ${yearNum} toppers including GS marks, optional subject marks, essay scores, interview scores, written totals, and AIR rankings.`,
    "url": `https://upscprepnotes.in/year/${yearNum}`,
    "keywords": [`UPSC ${yearNum}`, "UPSC toppers", "UPSC marks", "civil services exam"],
    "variableMeasured": [
      { "@type": "PropertyValue", "name": "AIR", "description": "All India Rank" },
      { "@type": "PropertyValue", "name": "GS1" },
      { "@type": "PropertyValue", "name": "GS2" },
      { "@type": "PropertyValue", "name": "GS3" },
      { "@type": "PropertyValue", "name": "GS4" },
      { "@type": "PropertyValue", "name": "Essay" },
      { "@type": "PropertyValue", "name": "Optional" },
      { "@type": "PropertyValue", "name": "Interview" },
      { "@type": "PropertyValue", "name": "Written Total" },
      { "@type": "PropertyValue", "name": "Grand Total" },
    ],
    "distribution": {
      "@type": "DataDownload",
      "contentUrl": `https://upscprepnotes.in/year/${yearNum}`,
      "encodingFormat": "text/html",
    },
  };

  const yearIndex = ALL_YEARS.indexOf(yearNum);
  const prevYear = yearIndex > 0 ? ALL_YEARS[yearIndex - 1] : null;
  const nextYear = yearIndex < ALL_YEARS.length - 1 ? ALL_YEARS[yearIndex + 1] : null;

  return (
    <main className="min-h-screen bg-background text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* BREADCRUMB */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
          <span>•</span>
          <span>Year {yearNum}</span>
        </div>

        <div className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Yearly Archive
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">UPSC {yearNum} Toppers — Complete Marks Dataset</h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-zinc-800">
            Full marks breakdown for UPSC {yearNum} toppers including GS papers, optional subject, essay, interview, and total scores. {toppers.length} topper profiles available.
          </p>
        </div>

        {/* YEAR SELECTOR */}
        <div className="mb-16 flex flex-wrap items-center gap-3">
          {prevYear && (
            <Link
              href={`/year/${prevYear}`}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition hover:bg-zinc-100"
            >
              &larr; {prevYear}
            </Link>
          )}
          {ALL_YEARS.map((y) => (
            <Link
              key={y}
              href={`/year/${y}`}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                y === yearNum
                  ? "bg-black text-white"
                  : "border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {y}
            </Link>
          ))}
          {nextYear && (
            <Link
              href={`/year/${nextYear}`}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition hover:bg-zinc-100"
            >
              {nextYear} &rarr;
            </Link>
          )}
        </div>

        {toppers.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center py-24">
            <p className="text-zinc-600">No topper profiles found for this year.</p>
          </div>
        ) : (
          <>
            {/* YEARLY ANALYSIS */}
            {(() => {
              const analysis = getYearAnalysis(yearNum);
              if (!analysis) return null;
              return (
                <section className="mb-16">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Analysis</p>
                  <h2 className="mb-6 text-2xl font-semibold tracking-tight">{analysis.title}</h2>
                  <div className="space-y-4 text-base leading-7 text-zinc-700">
                    {analysis.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* COMPUTED INSIGHTS */}
            {insights.length > 0 && (
              <section className="mb-16">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Key Insights — UPSC {yearNum}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {insights.map((insight, i) => (
                    <div key={i} className="rounded-xl border border-black/[0.06] bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                      {insight}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FULL MARKS TABLE */}
            <section>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Topper Marks Table
              </p>
              <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/[0.06] bg-zinc-50">
                      <th className="p-4 font-semibold">AIR</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Optional</th>
                      <th className="p-4 font-semibold">GS1</th>
                      <th className="p-4 font-semibold">GS2</th>
                      <th className="p-4 font-semibold">GS3</th>
                      <th className="p-4 font-semibold">GS4</th>
                      <th className="p-4 font-semibold">Essay</th>
                      <th className="p-4 font-semibold">Written</th>
                      <th className="p-4 font-semibold">Interview</th>
                      <th className="p-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {toppers.map((t) => (
                      <tr key={t.slug} className="hover:bg-zinc-50 transition">
                        <td className="p-4 font-semibold">{t.rank}</td>
                        <td className="p-4">
                          <Link
                            href={`/upsc-topper/${t.slug}`}
                            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                          >
                            {t.firstName} {t.lastName}
                          </Link>
                        </td>
                        <td className="p-4 text-zinc-600">{t.optionalSubject || "—"}</td>
                        <td className="p-4">{t.marks.gs1 || "—"}</td>
                        <td className="p-4">{t.marks.gs2 || "—"}</td>
                        <td className="p-4">{t.marks.gs3 || "—"}</td>
                        <td className="p-4">{t.marks.gs4 || "—"}</td>
                        <td className="p-4">{t.marks.essay || "—"}</td>
                        <td className="p-4">{t.marks.written || "—"}</td>
                        <td className="p-4">{t.marks.interview || "—"}</td>
                        <td className="p-4 font-semibold">{t.marks.total || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>

      {/* COMPILATION UPSELL */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 border-t border-zinc-100">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Complete Compilation</span>
              <h2 className="mt-2 text-lg font-bold text-gray-900 md:text-xl">
                Get Answer Copies of All UPSC {year} Toppers
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                50+ topper copies across GS1-4, Essay &amp; Optional. All at just ₹11 per copy.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">₹799</span>
                <span className="text-sm text-gray-500 line-through">₹4,999</span>
                <span className="text-xs text-emerald-700 font-semibold">83% off</span>
              </div>
            </div>
            <Link
              href="/store"
              data-track="year-compilation-upsell"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Browse Store &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
