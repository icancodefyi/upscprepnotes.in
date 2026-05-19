import Link from "next/link";

import { getFeaturedToppers } from "@/services/topper.service";
import Footer from "@/components/footer";

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
      <div className="pointer-events-none fixed inset-0 opacity-[0.55]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* SOFT GLOW */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-black/[0.03] blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-black/[0.03] blur-3xl" />
      </div>

      {/* LEFT RAIL */}
      <div className="fixed left-0 top-0 hidden h-screen w-16 border-r border-black/[0.04] xl:flex xl:flex-col xl:items-center xl:justify-between xl:py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-medium shadow-sm">
          U
        </div>

        <div className="rotate-180 text-[9px] uppercase tracking-[0.35em] text-zinc-400 [writing-mode:vertical-rl]">
          UPSC Intelligence Archive
        </div>

        <div className="text-[10px] text-zinc-400">2026</div>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 pb-32 pt-6 md:px-10 xl:ml-20">
        {/* NAVBAR */}
        <header className="mb-20 flex items-center justify-between md:mb-28">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-black" />

            <p className="text-xs uppercase tracking-[0.35em] text-zinc-600 md:text-sm">
              UPSCPREPNOTES
            </p>
          </div>

          <nav className="hidden items-center gap-10 text-sm text-zinc-600 lg:flex">
            <Link href="/" className="transition hover:text-black">
              Toppers
            </Link>

            <Link href="/" className="transition hover:text-black">
              Marksheets
            </Link>

            <Link href="/" className="transition hover:text-black">
              Strategies
            </Link>

            <Link href="/optional/psir" className="transition hover:text-black">
              Optional Subjects
            </Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="mb-48 pt-10">
      <div className="grid items-start gap-16 lg:grid-cols-[1fr_340px] lg:gap-24">
            {/* LEFT */}
          <div className="min-w-0 pb-4">
              <div className="mb-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500 md:text-sm md:tracking-[0.15em]">
                <span>UPSC Intelligence System</span>

                <span>•</span>

                <span>Structured Knowledge Archive</span>
              </div>

            <h1 className="max-w-[820px] text-3xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px]">
  Structured UPSC preparation intelligence.
</h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-zinc-800 md:text-lg">
                Explore topper strategies, marksheets, optional subject trends,
                interview performance, answer-writing patterns, and preparation
                insights through a deeply structured educational intelligence
                platform.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/upsc-topper/shivam-yadav-rank-21-2022"
                  className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-[1px] hover:opacity-90"
                >
                  Explore Toppers
                </Link>

                <Link
                  href="/optional/psir"
                  className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium transition duration-300 hover:border-black"
                >
                  Explore Subjects
                </Link>
              </div>

              {/* MARQUEE */}
              <div className="relative mt-12 max-w-[900px] overflow-hidden rounded-full border border-black bg-black py-3 marquee-track">
                <div className="marquee-content flex items-center gap-6 px-4 text-[10px] sm:gap-10 sm:px-6 sm:text-xs md:text-sm">
                  <span>280+ Structured Topper Profiles</span>

                  <span>•</span>

                  <span>UPSC Marks Intelligence</span>

                  <span>•</span>

                  <span>Optional Subject Trends</span>

                  <span>•</span>

                  <span>Answer Writing Analysis</span>

                  <span>•</span>

                  <span>Interview Performance Data</span>

                  <span>•</span>

                  <span>Preparation Strategy Archive</span>

                  <span>•</span>

                  <span>280+ Structured Topper Profiles</span>

                  <span>•</span>

                  <span>UPSC Marks Intelligence</span>

                  <span>•</span>

                  <span>Optional Subject Trends</span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:text-xs">
                <span>Updated Daily</span>
                <span>•</span>
                <span>AIR Trends</span>
                <span>•</span>
                <span>Marks Intelligence</span>
                <span>•</span>
                <span>Strategy Indexing</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-center pt-24">
              <div className="rounded-[32px] border border-black/[0.06] bg-white/70 p-10 backdrop-blur-sm">
                <div className="mb-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    Indexed Intelligence
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-y-10">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-4xl font-semibold tracking-tight">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-sm text-zinc-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATIONAL SECTION */}
        <section className="mb-40 border-t border-black/10 pt-16 md:pt-24">
          <div className="max-w-4xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              What is UPSCPrepNotes?
            </p>

            <h2 className="mb-8 text-4xl font-semibold tracking-tight md:text-5xl">
              Structured Intelligence for UPSC Preparation
            </h2>

            <div className="space-y-6 text-base leading-8 text-zinc-700 md:text-lg md:leading-9">
              <p>
                UPSCPrepNotes is an educational intelligence archive designed to help aspirants understand how top performers approach UPSC Civil Service Examination preparation. Rather than providing generic coaching materials, we analyze and index actual strategies employed by successful candidates—those who achieved ranks in the top 100 across multiple years.
              </p>

              <p>
                The platform provides structured access to topper profiles, marksheet analysis, optional subject performance trends, interview evaluation patterns, and answer-writing strategies. Each profile includes biographical context, educational journey details, preparation timelines, subject-specific insights, and lessons learned from attempting the examination multiple times.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Why Study Topper Strategies?</h3>
                  <p>
                    Topper analysis reveals patterns: which optional subjects correlate with higher marks, how preparation timelines compress for repeat attempts, which GS topics dominate in recent years, how answer writing quality improves across attempts. By indexing 280+ profiles across 18 optional subjects and multiple exam years, UPSCPrepNotes surfaces actionable insights that coaching institutes often obscure.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Optional Subject Intelligence</h3>
                  <p>
                    The choice of optional subject significantly impacts UPSC performance—with some optionals showing consistently higher average marks than others. UPSCPrepNotes tracks optional subject trends across exam years, showing which subjects attract top performers, typical score ranges, and how topper strategies differ by subject. Whether you're considering Political Science, Sociology, Anthropology, Mathematics, or Geography, the data helps inform your decision with real evidence.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Marks Intelligence & Performance Patterns</h3>
                  <p>
                    Understanding how toppers score across different components—GS papers, optional subject, essay, and interview—reveals the math of success. Some toppers excel in GS-heavy strategies, others build comprehensive optional subject depth. The archive shows these patterns, helping aspirants understand different viable pathways rather than assuming a single "correct" approach exists.
                  </p>
                </div>
              </div>

              <p className="pt-4 border-t border-black/10">
                All content on UPSCPrepNotes is compiled from publicly available sources, interviews, published marksheets, and educational materials. The platform serves purely educational purposes and is independent of UPSC, government organizations, and coaching institutes. Use this intelligence to build your own unique preparation strategy.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED TOPPERS */}
        <section className="mb-40 border-t border-black/10 pt-16 md:pt-24">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Featured Profiles
              </p>

              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                UPSC Toppers
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-zinc-800">
              Structured topper profiles with marks analysis, optional subject
              performance, and preparation intelligence.
            </p>
          </div>

          <div className="space-y-4">
            {toppers.map((topper: any, index: number) => (
              <Link
                key={topper.slug}
                href={`/upsc-topper/${topper.slug}`}
                className="group grid gap-3 md:gap-6 rounded-[32px] border border-transparent bg-transparent px-3 py-4 md:px-6 md:py-6 transition duration-300 hover:border-black/[0.04] hover:bg-white/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] md:grid-cols-[50px_100px_minmax(0,1fr)_160px] grid-cols-1"
              >
                {/* INDEX */}
                <div className="hidden md:block pt-2">
                  <p className="text-xs text-zinc-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
                {/* AVATAR */}
                <div className="w-fit">
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border border-black/5 bg-white shadow-sm"
                  />
                </div>

                {/* CONTENT */}
                <div className="min-w-0">
                  <div className="mb-2 md:mb-3 flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                    <span>AIR {topper.rank}</span>

                    <span>•</span>

                    <span>{topper.year}</span>

                    <span>•</span>

                    <span>{topper.optionalSubject}</span>
                  </div>

                  <h3 className="text-lg md:text-[30px] font-semibold tracking-tight transition duration-300 group-hover:translate-x-1 truncate">
                    {topper.firstName} {topper.lastName}
                  </h3>

                  <p className="hidden md:block mt-3 max-w-3xl text-sm leading-7 text-zinc-800">
                    {topper.bio?.slice(0, 220)}...
                  </p>
                </div>

                {/* SCORE */}
                <div className="border-l border-black/[0.04] pl-3 md:pl-5">
                  <div>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      Total
                    </p>

                    <p className="mt-1 text-lg md:text-2xl font-semibold tracking-tight">
                      {topper.marks.total}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      Interview
                    </p>

                    <p className="mt-1 text-base md:text-lg font-medium">
                      {topper.marks.interview}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* OPTIONAL SUBJECTS */}
        <section className="mb-40 border-t border-black/10 pt-16 md:pt-24">
          <div className="mb-14">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Subject Intelligence
            </p>

            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Optional Subjects
            </h2>
          </div>

          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {OPTIONAL_SUBJECTS.map((subject) => (
              <Link
                key={subject}
                href={`/optional/${subject.toLowerCase()}`}
                className="group border-b border-black/10 pb-6 transition"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1">
                    {subject}
                  </h3>

                  <span className="text-zinc-400 transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <p className="max-w-md text-sm leading-7 text-zinc-800">
                  Explore topper strategies, score trends, preparation insights,
                  and performance analysis for {subject}.
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="border-t border-black/10 pt-16 md:pt-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Platform Philosophy
              </p>

              <h2 className="max-w-xl text-4xl font-semibold leading-[1] tracking-tight md:text-6xl">
                A structured knowledge graph for UPSC preparation.
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-base leading-8 text-zinc-800 md:text-lg md:leading-9">
                UPSCPrepNotes organizes topper strategies, marksheets, optional
                subject trends, answer-writing patterns, and preparation
                insights into a deeply interconnected research system.
              </p>

              <p className="text-base leading-8 text-zinc-800 md:text-lg md:leading-9">
                Instead of scattered PDFs and fragmented coaching content, the
                platform focuses on structured educational intelligence and
                relationship-driven exploration.
              </p>
            </div>
          </div>
        </section>

        {/* COMPILATION CTA */}
        <section className="border-t border-black/10 pt-16 md:pt-24">
          <div className="relative overflow-hidden rounded-[32px] bg-zinc-900 p-8 md:p-16">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Coming Soon
              </p>
              <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl">
                Score 120+ in Every GS Paper
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400 md:text-lg md:leading-8">
                50+ verified UPSC topper answer copies across GS1–4 and Essay.
                Learn the IBEC Method from toppers who scored 120+ marks.
              </p>
              <Link
                href="/toppers/toppers-copy-compilation"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                Learn More →
              </Link>
            </div>
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/[0.03]" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/[0.06]" />
          </div>
        </section>

        {/* FOOTER */}
      <Footer/>
      </div>
    </main>
  );
}
