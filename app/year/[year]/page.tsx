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

  return (
    <main className="min-h-screen bg-background text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Yearly Archive
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">UPSC {yearNum} Toppers — Complete Marks Dataset</h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-zinc-800">
            Full marks breakdown for UPSC {yearNum} toppers including GS papers, optional subject, essay, interview, and total scores. {toppers.length} topper profiles available.
          </p>
        </div>

        {toppers.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center py-24">
            <p className="text-zinc-600">No topper profiles found for this year.</p>
          </div>
        ) : (
          <>
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
    </main>
  );
}
