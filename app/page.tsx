import Link from "next/link";

import { getFeaturedToppers } from "@/services/topper.service";

export const revalidate = 86400;

const OPTIONAL_SUBJECTS = [
  "PSIR",
  "Anthropology",
  "Sociology",
  "Mathematics",
  "Geography",
  "History",
  "Public Administration",
  "Philosophy",
];

const STATS = [
  {
    label: "Topper Profiles",
    value: "280+",
  },
  {
    label: "Optional Subjects",
    value: "18",
  },
  {
    label: "Structured Marksheets",
    value: "1200+",
  },
  {
    label: "Answer Copies",
    value: "500+",
  },
];

export default async function HomePage() {
  const toppers = await getFeaturedToppers();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f7f4] text-black">
      {/* GRID TEXTURE */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.35]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* SOFT GLOW */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-black/[0.03] blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-black/[0.03] blur-3xl" />
      </div>

      {/* LEFT RAIL */}
      <div className="fixed left-0 top-0 hidden h-screen w-14 border-r border-black/[0.04] xl:flex xl:flex-col xl:items-center xl:justify-between xl:py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-medium shadow-sm">
          U
        </div>

        <div className="rotate-180 text-[9px] uppercase tracking-[0.35em] text-zinc-300 [writing-mode:vertical-rl]">
          UPSC Intelligence Archive
        </div>

        <div className="text-[10px] text-zinc-300">
          2026
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-8 pb-28 pt-8 xl:ml-20">
        {/* NAVBAR */}
        <header className="mb-24 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">
              UPSCPREPNOTES
            </p>
          </div>

          <nav className="hidden items-center gap-10 text-sm text-zinc-400 md:flex">
            <Link
              href="/"
              className="transition hover:text-black"
            >
              Toppers
            </Link>

            <Link
              href="/"
              className="transition hover:text-black"
            >
              Marksheets
            </Link>

            <Link
              href="/"
              className="transition hover:text-black"
            >
              Strategies
            </Link>

            <Link
              href="/"
              className="transition hover:text-black"
            >
              Optional Subjects
            </Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="mb-28">
          <div className="max-w-3xl pb-6">
            <div className="mb-6 flex flex-wrap gap-3 text-sm text-zinc-500">
              <span>UPSC Intelligence System</span>
              <span>•</span>
              <span>Structured Knowledge Archive</span>
            </div>

            <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.07em] md:text-7xl">
              Structured UPSC preparation intelligence.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
              Explore topper strategies, marksheets,
              optional subject trends, interview
              performance, answer-writing patterns,
              and preparation insights through a
              deeply structured research platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/upsc-topper/shivam-yadav-rank-21-2022"
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-[1px] hover:opacity-90"
              >
                Explore Toppers
              </Link>

              <Link
                href="/optional/psir"
                className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:border-black"
              >
                Explore Subjects
              </Link>
            </div>

            <div className="mt-10 text-xs uppercase tracking-[0.25em] text-zinc-400">
              Updated daily • AIR trends • Marks intelligence •
              Strategy indexing
            </div>
          </div>

          {/* STATS */}
          <div className="mt-16 border-y border-black/[0.05] py-10">
            <div className="grid gap-10 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-semibold tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED TOPPERS */}
        <section className="mb-32 border-t border-black/10 pt-20">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Featured Profiles
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                UPSC Toppers
              </h2>
            </div>

            <p className="hidden max-w-sm text-sm leading-7 text-zinc-500 lg:block">
              Structured topper profiles with marks analysis,
              optional subject performance, and preparation
              intelligence.
            </p>
          </div>

          <div className="space-y-8">
            {toppers.map((topper: any, index: number) => (
              <Link
                key={topper.slug}
                href={`/upsc-topper/${topper.slug}`}
                className="group grid gap-8 rounded-2xl border-b border-black/5 pb-10 transition hover:bg-white/40 lg:grid-cols-[60px_110px_minmax(0,1fr)_180px]"
              >
                {/* INDEX */}
                <div className="pt-1">
                  <p className="text-xs text-zinc-300">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>

                {/* AVATAR */}
                <div>
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="h-20 w-20 rounded-2xl border border-black/5 bg-white shadow-sm"
                  />
                </div>

                {/* CONTENT */}
                <div>
                  <div className="mb-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span>AIR {topper.rank}</span>
                    <span>•</span>
                    <span>{topper.year}</span>
                    <span>•</span>
                    <span>{topper.optionalSubject}</span>
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1">
                    {topper.firstName} {topper.lastName}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                    {topper.bio?.slice(0, 180)}...
                  </p>
                </div>

                {/* SCORES */}
                <div className="border-l border-black/[0.04] pl-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {topper.marks.total}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      Interview
                    </p>

                    <p className="mt-1 text-lg font-medium">
                      {topper.marks.interview}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* OPTIONAL SUBJECTS */}
        <section className="mb-32 border-t border-black/10 pt-20">
          <div className="mb-14">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
              Subject Intelligence
            </p>

            <h2 className="text-4xl font-semibold tracking-tight">
              Optional Subjects
            </h2>
          </div>

          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            {OPTIONAL_SUBJECTS.map((subject) => (
              <Link
                key={subject}
                href={`/optional/${subject.toLowerCase()}`}
                className="group border-b border-black/10 pb-6 transition"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight transition group-hover:translate-x-1">
                    {subject}
                  </h3>

                  <span className="text-zinc-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <p className="max-w-md text-sm leading-7 text-zinc-600">
                  Explore topper strategies, score trends,
                  preparation insights, and performance
                  analysis for {subject}.
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="border-t border-black/10 pt-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Platform Philosophy
              </p>

              <h2 className="max-w-xl text-5xl font-semibold leading-[1] tracking-tight">
                A structured knowledge graph for UPSC
                preparation.
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-lg leading-9 text-zinc-600">
                UPSCPrepNotes organizes topper strategies,
                marksheets, optional subject trends,
                answer-writing patterns, and preparation
                insights into a deeply interconnected
                research system.
              </p>

              <p className="text-lg leading-9 text-zinc-600">
                Instead of scattered PDFs and fragmented
                coaching content, the platform focuses on
                structured educational intelligence and
                relationship-driven exploration.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}