import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface Props {
  params: Promise<{
    subject: string;
  }>;
}

const SUBJECT_DATA: Record<string, { name: string; description: string }> = {
  psir: {
    name: "Political Science & International Relations",
    description:
      "Explore UPSC topper strategies, booklists, and preparation insights for PSIR optional subject.",
  },
  sociology: {
    name: "Sociology",
    description:
      "Discover top UPSC strategies for Sociology optional with topper profiles, marks analysis, and preparation trends.",
  },
  anthropology: {
    name: "Anthropology",
    description:
      "Master UPSC Anthropology optional: topper strategies, score trends, and preparation intelligence.",
  },
};

export async function generateStaticParams() {
  return [
    { subject: "psir" },
    { subject: "sociology" },
    { subject: "anthropology" },
  ];
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
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold">Subject not found</h1>
        </div>
      </main>
    );
  }

  const { toppers, stats } = await getSubjectStats(subjectInfo.name);

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-black">
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Optional Subject Intelligence
          </p>

          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            {subjectInfo.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-800">
            {subjectInfo.description}
          </p>
        </div>

        {/* STATS */}
        {stats && (
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="text-3xl font-semibold">{stats.totalToppers}</p>
              <p className="mt-2 text-sm text-zinc-600">Toppers</p>
            </div>

            <div>
              <p className="text-3xl font-semibold">{stats.avgMarks}</p>
              <p className="mt-2 text-sm text-zinc-600">Avg Marks</p>
            </div>

            <div>
              <p className="text-3xl font-semibold">{stats.maxMarks}</p>
              <p className="mt-2 text-sm text-zinc-600">Highest Marks</p>
            </div>

            <div>
              <p className="text-3xl font-semibold">{stats.minMarks}</p>
              <p className="mt-2 text-sm text-zinc-600">Lowest Marks</p>
            </div>
          </div>
        )}
      </section>

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
                className="group grid gap-4 rounded-[32px] border border-transparent bg-transparent px-4 py-5 transition duration-300 hover:border-black/[0.04] hover:bg-white/70 md:px-6 md:py-6 lg:grid-cols-[100px_minmax(0,1fr)_120px]"
              >
                <div>
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="h-20 w-20 rounded-2xl border border-black/5 bg-white shadow-sm"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1">
                    {topper.firstName} {topper.lastName}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                    <span>AIR {topper.rank}</span>
                    <span>•</span>
                    <span>{topper.year}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
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
        <div className="rounded-[32px] border border-black/10 bg-white/70 p-12 text-center backdrop-blur-sm">
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
