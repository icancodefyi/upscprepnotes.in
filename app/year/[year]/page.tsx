import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import BrandShell from "@/components/brand/BrandShell";
import InterviewPackPromo from "@/components/store/InterviewPackPromo";
import QuizTeaser from "@/components/quiz/QuizTeaser";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

const OPTIONAL_SLUG_MAP: Record<string, string> = {
  "Political Science & International Relations": "psir",
  "Public Administration": "public-administration",
  Mathematics: "mathematics",
  Sociology: "sociology",
  Geography: "geography",
  Philosophy: "philosophy",
  Anthropology: "anthropology",
  History: "history",
  "Commerce & Accountancy": "commerce-accountancy",
};

function renderOptionalLink(name: string | null | undefined) {
  if (!name) return "—";
  const slug = OPTIONAL_SLUG_MAP[name];
  return slug ? (
    <Link href={`/optional/${slug}`} className="text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-2 hover:decoration-[var(--accent)]">
      {name}
    </Link>
  ) : (
    <span>{name}</span>
  );
}

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
    description: `See every UPSC ${yearNum} topper's paper-wise marks. Compare GS, Essay, Optional & Interview scores. Download free answer copies and find preparation strategies.`,
    alternates: {
      canonical: `https://upscprepnotes.in/year/${year}`,
    },
    openGraph: {
      title: `UPSC ${yearNum} Toppers — Complete Marks Dataset`,
      description: `Full marks breakdown for UPSC ${yearNum} toppers including GS papers, optional subject, essay, interview, and total scores.`,
      url: `https://upscprepnotes.in/year/${year}`,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

const ALL_YEARS = [2022, 2023, 2024, 2025];

export default async function YearPage({ params }: Props) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    return (
      <BrandShell>
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-36 text-center">
          <h1 className="t-display text-h1">Invalid year</h1>
        </div>
      </BrandShell>
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

  const analysis = getYearAnalysis(yearNum);

  return (
    <BrandShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: `Year ${yearNum}`, href: `/year/${yearNum}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1180px] px-6">
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>•</span>
            <span className="text-[var(--ink-2)]">Year {yearNum}</span>
          </nav>

          <header className="mt-8 max-w-[48rem]">
            <h1 className="t-display text-h1">UPSC {yearNum} Toppers — Complete Marks Dataset</h1>
            <p className="mt-2 text-s font-bold text-[var(--muted)]">Yearly Archive</p>
            <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
              Full marks breakdown for UPSC {yearNum} toppers including GS papers, optional subject, essay, interview, and total scores. {toppers.length} topper profiles available.
            </p>
            <div className="mt-5"><InterviewPackPromo variant="line" track="year-interview-pack" /></div>
          </header>

          {/* YEAR SELECTOR */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {prevYear && (
              <Link href={`/year/${prevYear}`} className="rounded-full bg-white px-4 py-2 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]">
                &larr; {prevYear}
              </Link>
            )}
            {ALL_YEARS.map((y) => (
              <Link
                key={y}
                href={`/year/${y}`}
                className={`tab rounded-full px-4 py-2 text-s font-bold transition ${y === yearNum ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"}`}
              >
                {y}
              </Link>
            ))}
            {nextYear && (
              <Link href={`/year/${nextYear}`} className="rounded-full bg-white px-4 py-2 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]">
                {nextYear} &rarr;
              </Link>
            )}
          </div>

          {toppers.length === 0 ? (
            <div className="mx-auto max-w-2xl py-24 text-center">
              <p className="text-m text-[var(--muted)]">No topper profiles found for this year.</p>
            </div>
          ) : (
            <div className="mt-14 space-y-14">
              {/* YEARLY ANALYSIS */}
              {analysis && (
                <section className="max-w-[48rem]">
                  <h2 className="t-head text-l">{analysis.title}</h2>
                  <p className="mt-1 text-s text-[var(--muted)]">Analysis</p>
                  <div className="mt-5 space-y-4">
                    {analysis.paragraphs.map((para, i) => (
                      <p key={i} className="text-m leading-[1.7] text-[var(--ink-2)]">{para}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* COMPUTED INSIGHTS */}
              {insights.length > 0 && (
                <section>
                  <h2 className="t-head text-l">Key Insights — UPSC {yearNum}</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {insights.map((insight, i) => (
                      <div key={i} className={`${card} p-4 text-m leading-[1.55] text-[var(--ink-2)]`}>{insight}</div>
                    ))}
                  </div>
                </section>
              )}

              {/* FULL MARKS TABLE */}
              <section>
                <h2 className="t-head text-l">Topper Marks Table</h2>
                <div className={`${card} mt-5 overflow-x-auto`}>
                  <table className="w-full min-w-[900px] text-left text-s">
                    <thead>
                      <tr className="text-[var(--muted)]">
                        {["AIR", "Name", "Optional", "GS1", "GS2", "GS3", "GS4", "Essay", "Written", "Interview", "Total"].map((h, i) => (
                          <th key={h} className={`px-4 py-3 font-normal ${i > 2 ? "text-right" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="tab">
                      {toppers.map((t) => (
                        <tr key={t.slug} className="border-t border-[var(--line)] hover:bg-[#f8f9fc]">
                          <td className="px-4 py-3 font-bold text-[var(--mark-deep)]">{t.rank}</td>
                          <td className="px-4 py-3">
                            <Link href={`/upsc-topper/${t.slug}`} className="font-bold hover:text-[var(--accent)]">
                              {t.firstName} {t.lastName}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-[var(--ink-2)]">{renderOptionalLink(t.optionalSubject)}</td>
                          <td className="px-4 py-3 text-right">{t.marks.gs1 || "—"}</td>
                          <td className="px-4 py-3 text-right">{t.marks.gs2 || "—"}</td>
                          <td className="px-4 py-3 text-right">{t.marks.gs3 || "—"}</td>
                          <td className="px-4 py-3 text-right">{t.marks.gs4 || "—"}</td>
                          <td className="px-4 py-3 text-right">{t.marks.essay || "—"}</td>
                          <td className="px-4 py-3 text-right font-bold">{t.marks.written || "—"}</td>
                          <td className="px-4 py-3 text-right font-bold">{t.marks.interview || "—"}</td>
                          <td className="px-4 py-3 text-right font-bold text-[var(--accent)]">{t.marks.total || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* OFFER */}
          <section className="mt-20 flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <span className="rounded-full bg-[var(--hl)] px-2.5 py-0.5 text-s font-bold text-[var(--hl-ink)]">Offer</span>
              <h2 className="t-head mt-3 text-l">Starting at ₹49</h2>
              <p className="mt-1 text-s text-[var(--muted)]">Starting at ₹49 · Instant download.</p>
            </div>
            <Link href="/store" data-track="year-compilation-upsell" className="btn btn-blue shrink-0 self-start sm:self-center">
              Shop Now &rarr;
            </Link>
          </section>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="year" />
      </div>
    </BrandShell>
  );
}
