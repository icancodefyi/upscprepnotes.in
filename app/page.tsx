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
    <main className="min-h-screen bg-[#f7f5f1] text-black">
      {/* LEFT RAIL */}
      <div className="fixed left-0 top-0 hidden h-screen w-16 border-r border-black/5 xl:flex xl:flex-col xl:items-center xl:justify-between xl:py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-sm font-medium">
          U
        </div>

        <div className="rotate-180 text-[10px] uppercase tracking-[0.35em] text-zinc-400 [writing-mode:vertical-rl]">
          UPSC Intelligence Archive
        </div>

        <div className="text-[10px] text-zinc-400">
          2026
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 xl:ml-16">
        {/* NAVBAR */}
        <header className="mb-20 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
              UPSCPREPNOTES
            </p>
          </div>

          <nav className="hidden items-center gap-10 text-sm text-zinc-500 md:flex">
            <Link href="/">Toppers</Link>
            <Link href="/">Marksheets</Link>
            <Link href="/">Strategies</Link>
            <Link href="/">Optional Subjects</Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="mb-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_280px]">
            <div className="max-w-4xl">
              <div className="mb-6 flex flex-wrap gap-3 text-sm text-zinc-500">
                <span>UPSC Intelligence System</span>
                <span>•</span>
                <span>Structured Knowledge Archive</span>
              </div>

              <h1 className="text-6xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-7xl">
                Structured UPSC preparation intelligence.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
                Explore topper strategies, marksheets,
                optional subject trends, answer-writing
                patterns, and interview insights through a
                clean research-oriented knowledge system.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/upsc-topper/shivam-yadav-rank-21-2022"
                  className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Explore Toppers
                </Link>

                <Link
                  href="/optional/psir"
                  className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium transition hover:border-black"
                >
                  Explore Subjects
                </Link>
              </div>
            </div>

            {/* STATS */}
            <div className="border-l border-black/10 pl-8">
              <p className="mb-8 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                Indexed Intelligence
              </p>

              <div className="space-y-8">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-4xl font-semibold tracking-tight">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED TOPPERS */}
        <section className="mb-28">
          <div className="mb-12 flex items-end justify-between border-b border-black/10 pb-6">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Featured Profiles
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                UPSC Toppers
              </h2>
            </div>

            <p className="hidden max-w-md text-sm leading-7 text-zinc-500 lg:block">
              Structured topper profiles with marks analysis,
              optional subject performance, and preparation
              intelligence.
            </p>
          </div>

          <div className="space-y-10">
            {toppers.map((topper: any, index: number) => (
              <Link
                key={topper.slug}
                href={`/upsc-topper/${topper.slug}`}
                className="group grid gap-8 border-b border-black/5 pb-10 transition lg:grid-cols-[40px_100px_1fr_160px]"
              >
                {/* INDEX */}
                <div>
                  <p className="text-xs text-zinc-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>

                {/* IMAGE */}
                <div>
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="h-20 w-20 rounded-2xl border border-black/5 bg-white object-cover"
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

                {/* META */}
                <div className="border-l border-black/10 pl-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      Total
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {topper.marks.total}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      Interview
                    </p>

                    <p className="mt-2 text-xl font-medium">
                      {topper.marks.interview}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* OPTIONAL SUBJECTS */}
        <section className="mb-28">
          <div className="mb-12 border-b border-black/10 pb-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
              Subject Intelligence
            </p>

            <h2 className="text-4xl font-semibold tracking-tight">
              Optional Subjects
            </h2>
          </div>

          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {OPTIONAL_SUBJECTS.map((subject) => (
              <Link
                key={subject}
                href={`/optional/${subject.toLowerCase()}`}
                className="group border-b border-black/10 pb-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight transition group-hover:translate-x-1">
                    {subject}
                  </h3>

                  <span className="text-zinc-400 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <p className="text-sm leading-7 text-zinc-600">
                  Explore topper strategies, score trends,
                  preparation insights, and performance
                  analysis.
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
                A structured knowledge graph for UPSC preparation.
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-lg leading-9 text-zinc-600">
                UPSCPrepNotes organizes topper strategies,
                marksheets, optional subject trends, and
                preparation insights into a clean interconnected
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