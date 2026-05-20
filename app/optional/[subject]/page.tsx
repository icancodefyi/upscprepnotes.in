import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface Props {
  params: Promise<{
    subject: string;
  }>;
}

interface TopperData {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  slug: string;
  marks: Record<string, number>;
}

const SUBJECT_DATA: Record<
  string,
  { name: string; description: string; overview?: string; whyPopular?: string; booklist?: string[]; prepInsights?: string[] }
> = {
  psir: {
    name: "Political Science & International Relations",
    description:
      "Explore UPSC topper strategies, booklists, and preparation insights for PSIR optional subject.",
    overview:
      "PSIR (Political Science & International Relations) combines theory with contemporary polity and international affairs — ideal for candidates who enjoy conceptual analysis and current affairs.",
    whyPopular:
      "PSIR is popular due to its overlap with GS papers, conceptual clarity, and a large answer-writing scope across polity and international relations.",
    booklist: [
      "Laxmikanth — Indian Polity",
      "A.C. Kapur — Select Essays on Political Thought",
      "K. Kautilya / Thucydides (select readings) — for IR theory context",
      "Oxford Handbook chapters (select) — modern IR debates",
    ],
    prepInsights: [
      "Focus on core theorists and map theory to current events.",
      "Prioritise answer structuring for normative questions.",
      "Use timeline-based revision for IR case studies.",
    ],
  },
  "public-administration": {
    name: "Public Administration",
    description: "Public Administration optional: administrative theory, governance, and policy implementation.",
    overview: "Public Administration covers government structures, bureaucratic organization, and policy implementation — ideal for candidates interested in governance and administrative processes.",
    whyPopular: "PA has direct overlap with GS papers and is conceptually coherent with clear answer-writing frameworks.",
    booklist: ["M.P. Sharma & B.L. Sadana — Public Administration in India (core text)", "Maheshwari — Public Administration"],
    prepInsights: ["Use case studies from Indian administrative reforms.", "Link administrative concepts to contemporary governance challenges."],
  },
  mathematics: {
    name: "Mathematics",
    description: "Mathematics optional: pure and applied mathematics topics with problem-solving focus.",
    overview: "Mathematics covers pure and applied domains — ideal for candidates with strong quantitative foundation.",
    booklist: ["Higher Secondary Mathematics textbooks (NCERT)", "Problem-solving resources for calculus and algebra"],
  },
  sociology: {
    name: "Sociology",
    description:
      "Discover top UPSC strategies for Sociology optional with topper profiles, marks analysis, and preparation trends.",
    overview:
      "Sociology optional focuses on Indian society, social institutions, and change — ideal for candidates interested in social theory, cultural analysis, and policy implications.",
    whyPopular:
      "Sociology is popular for its conceptual depth, reasonable answer-writing scope, and clear connection to General Studies papers on social movements and development.",
    booklist: [
      "D.P. Mukerji — Sociology (foundational text)",
      "Yogendra Singh — Culture and Civilization of Ancient India",
      "M.N. Srinivas — Religion and Society Among the Coorgs",
      "G.S. Ghurye — Caste and Race in India",
      "A.R. Desai — Social Background of Indian Nationalism",
    ],
    prepInsights: [
      "Map sociological concepts to contemporary Indian society issues.",
      "Build case studies around social movements and institutional change.",
      "Connect sociology to GS (poverty, inequality, gender) for internal linking.",
    ],
  },
  anthropology: {
    name: "Anthropology",
    description:
      "Master UPSC Anthropology optional: topper strategies, score trends, and preparation intelligence.",
    overview:
      "Anthropology covers human evolution, ethnography, and cultural diversity — combining physical, social, and cultural dimensions for comprehensive preparation.",
    whyPopular:
      "Anthropology combines unique topics (tribal studies, kinship, migration) with strong ethical dimensions and clear links to GS papers on development and social policy.",
    booklist: [
      "K.L. Sharma — Social Stratification in India",
      "D.N. Majumdar — Races and Cultures of India",
      "M.N. Srinivas — Religion and Society Among the Coorgs",
      "Verrier Elwin — Tribal Life in India (key ethnographic source)",
      "Barbara Bode — No Bells to Ring: Victim Voices and Structural Silence in the 1905 Maji Maji Uprising",
    ],
    prepInsights: [
      "Use ethnographic examples to structure answers on kinship and social structure.",
      "Build timelines for human evolution and migration patterns.",
      "Connect tribal and indigenous studies to current policy debates.",
    ],
  },
  geography: {
    name: "Geography",
    description: "Geography optional: physical and human geography with map skills and case studies.",
    overview: "Geography combines physical processes, human systems, and environmental issues — with strong practical components like map work.",
    whyPopular: "Geography has clear connections to GS and offers unique preparation with cartography, regional studies, and environmental policy.",
    prepInsights: ["Build strong map reading and annotation skills.", "Use case studies for human-environment interactions.", "Connect to current events in climate policy."],
  },
  philosophy: {
    name: "Philosophy",
    description: "Philosophy optional: Indian and Western philosophical thought and applied ethics.",
    overview: "Philosophy covers Indian philosophical schools, Western philosophy, and applied ethics — for conceptual depth and critical thinking.",
    booklist: ["S. Radhakrishnan — Indian Philosophy (comprehensive)", "Debiprasad Chattopadhyaya — Marxist Approach to Ancient Indian Philosophy"],
  },
};

export async function generateStaticParams() {
  return Object.keys(SUBJECT_DATA).map((s) => ({ subject: s }));
}

async function getSubjectData(subjectName: string) {
  await connectDB();

  const toppers = await TopperModel.find({
    optionalSubject: new RegExp(subjectName, "i"),
  }).lean();

  const mapped: TopperData[] = toppers.map((t: any) => ({
    firstName: t.firstName,
    lastName: t.lastName,
    rank: t.rank,
    year: t.year,
    slug: t.slug,
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

  const totalMarks = mapped.map(t => t.marks.optional1 || t.marks.optional2 || 0).filter(m => m > 0);
  const avgMarks = totalMarks.length > 0 ? (totalMarks.reduce((a, b) => a + b, 0) / totalMarks.length).toFixed(1) : "—";
  const maxMarks = totalMarks.length > 0 ? Math.max(...totalMarks) : 0;
  const minMarks = totalMarks.length > 0 ? Math.min(...totalMarks) : 0;

  return { toppers: mapped, stats: { totalToppers: mapped.length, avgMarks, maxMarks, minMarks } };
}

function computeSubjectInsights(subjectName: string, toppers: TopperData[]) {
  if (toppers.length === 0) return [];

  const insights: string[] = [];
  const years = [...new Set(toppers.map(t => t.year))].sort();
  const ranks = toppers.map(t => t.rank).filter(r => r > 0);
  const interviews = toppers.map(t => t.marks.interview).filter(m => m > 0);
  const essays = toppers.map(t => t.marks.essay).filter(m => m > 0);
  const gs1 = toppers.map(t => t.marks.gs1).filter(m => m > 0);

  insights.push(`${toppers.length} topper${toppers.length > 1 ? "s" : ""} opted for ${subjectName} as their UPSC optional subject.`);
  insights.push(`Year range: ${Math.min(...years)}–${Math.max(...years)}`);

  if (ranks.length > 0) {
    insights.push(`Best rank among ${subjectName} optional toppers: AIR ${Math.min(...ranks)}`);
  }
  if (interviews.length > 0) {
    const avg = (interviews.reduce((a, b) => a + b, 0) / interviews.length).toFixed(1);
    insights.push(`Average interview score for ${subjectName} optional toppers: ${avg}`);
  }
  if (essays.length > 0) {
    const avg = (essays.reduce((a, b) => a + b, 0) / essays.length).toFixed(1);
    insights.push(`Average essay score for ${subjectName} optional toppers: ${avg}`);
  }

  return insights;
}

export default async function SubjectPage({ params }: Props) {
  const { subject } = await params;
  const subjectKey = subject.toLowerCase();
  const subjectInfo = SUBJECT_DATA[subjectKey];

  if (!subjectInfo) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold">Subject not found</h1>
        </div>
      </main>
    );
  }

  const { toppers, stats } = await getSubjectData(subjectInfo.name);
  const insights = computeSubjectInsights(subjectInfo.name, toppers);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${subjectInfo.name} UPSC Optional Topper Marks Dataset`,
    "description": `Structured dataset of UPSC CSE toppers who chose ${subjectInfo.name} as optional subject, including GS marks, optional marks, essay scores, interview scores, and AIR rankings.`,
    "url": `https://upscprepnotes.in/optional/${subjectKey}`,
    "keywords": [`${subjectInfo.name} UPSC`, "UPSC toppers", "UPSC optional subject", "civil services exam"],
    "variableMeasured": [
      { "@type": "PropertyValue", "name": "AIR", "description": "All India Rank" },
      { "@type": "PropertyValue", "name": "Year" },
      { "@type": "PropertyValue", "name": "Optional Marks" },
      { "@type": "PropertyValue", "name": "Interview" },
      { "@type": "PropertyValue", "name": "Total" },
    ],
    "distribution": {
      "@type": "DataDownload",
      "contentUrl": `https://upscprepnotes.in/optional/${subjectKey}`,
      "encodingFormat": "text/html",
    },
  };

  return (
    <main className="min-h-screen bg-background text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Optional Subject Intelligence
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {subjectInfo.name}
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-zinc-800">
            {subjectInfo.description}
          </p>
        </div>

        {/* STATS */}
        {stats && (
          <div className="grid gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-4">
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.totalToppers}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Toppers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.avgMarks}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Avg Marks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.maxMarks}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Highest Marks</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold">{stats.minMarks}</p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600">Lowest Marks</p>
            </div>
          </div>
        )}
      </section>

      {/* COMPUTED INSIGHTS */}
      {insights.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Key Insights — {subjectInfo.name}
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

      {/* SUBJECT DETAIL SECTIONS */}
      {(subjectInfo.overview || subjectInfo.whyPopular || (subjectInfo.booklist || []).length > 0 || (subjectInfo.prepInsights || []).length > 0) && (
        <section className="mx-auto max-w-5xl px-6 py-8 md:py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold">About {subjectInfo.name}</h2>
          </div>

          {subjectInfo.overview && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Subject Overview</h3>
              <p className="mt-3 text-zinc-700">{subjectInfo.overview}</p>
            </div>
          )}

          {subjectInfo.whyPopular && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Why {subjectInfo.name} Is Popular</h3>
              <p className="mt-3 text-zinc-700">{subjectInfo.whyPopular}</p>
            </div>
          )}

          {(subjectInfo.booklist || []).length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Common Booklists</h3>
              <ul className="mt-3 list-disc pl-6 text-zinc-700">
                {subjectInfo.booklist!.map((book, idx) => (
                  <li key={idx}>{book}</li>
                ))}
              </ul>
            </div>
          )}

          {(subjectInfo.prepInsights || []).length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Preparation Insights</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {subjectInfo.prepInsights!.map((insight, idx) => (
                  <div key={idx} className="rounded-lg border border-black/[0.06] bg-background p-4">
                    <p className="text-zinc-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* FULL MARKS TABLE */}
      {toppers.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {subjectInfo.name} Topper Marks Table
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] bg-zinc-50">
                  <th className="p-4 font-semibold">AIR</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold">Opt P1</th>
                  <th className="p-4 font-semibold">Opt P2</th>
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
                    <td className="p-4 text-zinc-600">{t.year}</td>
                    <td className="p-4">{t.marks.optional1 || "—"}</td>
                    <td className="p-4">{t.marks.optional2 || "—"}</td>
                    <td className="p-4">{t.marks.essay || "—"}</td>
                    <td className="p-4">{t.marks.written || "—"}</td>
                    <td className="p-4">{t.marks.interview || "—"}</td>
                    <td className="p-4 font-semibold">{t.marks.total || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Browse All Toppers &rarr;
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
