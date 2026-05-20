import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface Props {
  params: Promise<{
    subject: string;
  }>;
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

async function getSubjectStats(subjectName: string) {
  await connectDB();

  const toppers = await TopperModel.find({
    optionalSubject: new RegExp(subjectName, "i"),
  }).lean();

  if (!toppers.length) {
    return { toppers: [], stats: null };
  }

  const totalMarks = toppers.map(
    (t: any) => t.marks?.optional1 || t.marks?.optional2 || 0
  );
  const avgMarks = totalMarks.reduce((a, b) => a + b, 0) / totalMarks.length;
  const maxMarks = Math.max(...totalMarks);
  const minMarks = Math.min(...totalMarks);

  return {
    toppers: toppers.slice(0, 15),
    stats: {
      totalToppers: toppers.length,
      avgMarks: avgMarks.toFixed(1),
      maxMarks,
      minMarks,
    },
  };
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

  const { toppers, stats } = await getSubjectStats(subjectInfo.name);

  return (
    <main className="min-h-screen bg-background text-black">
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

      {/* TOPPERS */}
      {toppers.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="mb-14">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Featured Toppers
            </p>

            <h2 className="text-4xl font-semibold tracking-tight">
              {subjectInfo.name} Specialists
            </h2>
          </div>

          <div className="space-y-4">
            {toppers.map((topper: any) => (
              <Link
                key={topper._id}
                href={`/upsc-topper/${topper.slug}`}
                className="group grid gap-3 md:gap-4 rounded-[32px] border border-transparent bg-transparent px-3 py-4 md:px-6 md:py-6 transition duration-300 hover:border-black/[0.04] hover:bg-background/70 md:grid-cols-[100px_minmax(0,1fr)_120px] grid-cols-1"
              >
                <div>
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="md:h-20 md:w-20 h-16 w-16 rounded-2xl border border-black/5 bg-background shadow-sm"
                  />
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1">
                    {topper.firstName} {topper.lastName}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                    <span>AIR {topper.rank}</span>
                    <span>•</span>
                    <span>{topper.year}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-right">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      Total
                    </p>

                    <p className="mt-1 text-lg md:text-2xl font-semibold">
                      {topper.marks?.total || "—"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="rounded-[32px] border border-black/10 bg-background/70 p-12 text-center backdrop-blur-sm">
          <h3 className="text-3xl font-semibold">Explore More Strategies</h3>

          <p className="mt-4 text-zinc-700">
            Browse all {subjectInfo.name} preparation insights and topper profiles
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
