"use client";

import Link from "next/link";

export default function DailyDigestPage() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-white">
      {/* ===== HERO HEADER ===== */}
      <section className="border-b border-zinc-100 bg-gradient-to-b from-zinc-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-16 pb-12">
          <div className="flex items-center gap-3 text-xs text-zinc-400 uppercase tracking-widest mb-4">
            <span className="flex h-6 items-center rounded-full bg-zinc-900 px-3 font-semibold text-white">Daily</span>
            <span>{dateStr}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Daily Digest
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
            One topper answer copy, one intelligence insight, one current affairs analysis, one practice question. Updated every morning.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        {/* ===== ANSWER COPY OF THE DAY ===== */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">1</div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Answer Copy of the Day</h2>
              <p className="text-sm text-zinc-400">Real UPSC answer sheet — annotated with what worked</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-lg">
            <div className="grid sm:grid-cols-[280px_1fr]">
              {/* Left — topper image + rank badge */}
              <div className="relative bg-zinc-100">
                <img
                  src="https://upscprepnotes.in/images/toppers/garima-lohia-rank-2-2022.jpg"
                  alt="Garima Lohia"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  AIR 2 — 2022
                </div>
              </div>
              {/* Right — content */}
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-600">GS2</span>
                  <span className="text-[11px] text-zinc-400">134 marks</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Garima Lohia's GS2 Answer Copy</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Exceptional use of structured arguments, diagrams, and case studies. 
                  The introduction alone scored high — it directly addressed the keyword with a data-backed hook.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-lg bg-zinc-50 p-2.5">
                    <p className="font-semibold text-zinc-900">Structuring</p>
                    <p className="text-zinc-400 mt-0.5">Excellent</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-2.5">
                    <p className="font-semibold text-zinc-900">Diagrams</p>
                    <p className="text-zinc-400 mt-0.5">Used effectively</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-2.5">
                    <p className="font-semibold text-zinc-900">Value Addition</p>
                    <p className="text-zinc-400 mt-0.5">High</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href="/upsc-topper/garima-lohia-rank-2-2022"
                    className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    View Full Copy →
                  </Link>
                  <Link
                    href="/store"
                    className="text-sm font-medium text-zinc-500 underline underline-offset-4 transition hover:text-zinc-900"
                  >
                    Get 50+ copies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TOPPER INTELLIGENCE BRIEF ===== */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">2</div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Topper Intelligence Brief</h2>
              <p className="text-sm text-zinc-400">Data-driven insights from 280+ topper profiles</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-md">
              <p className="text-[11px] uppercase tracking-widest text-zinc-400">Top Optional</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">43%</p>
              <p className="mt-1 text-sm text-zinc-500">of Top 100 rankers chose <span className="font-semibold text-zinc-800">PSIR</span></p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                <span>Geography: 21%</span>
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                <span>Anthro: 17%</span>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-md">
              <p className="text-[11px] uppercase tracking-widest text-zinc-400">Highest GS2 Score</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">134</p>
              <p className="mt-1 text-sm text-zinc-500">marks by <span className="font-semibold text-zinc-800">Animesh Pradhan</span> (AIR 2)</p>
              <div className="mt-3">
                <Link href="/upsc-topper/animesh-pradhan-rank-2-2022" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  View copy →
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-md">
              <p className="text-[11px] uppercase tracking-widest text-zinc-400">Common Trait</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">82%</p>
              <p className="mt-1 text-sm text-zinc-500">of AIR Top 50 practiced <span className="font-semibold text-zinc-800">answer writing</span> daily</p>
              <div className="mt-3">
                <Link href="/store" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Browse answer copies →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center text-sm text-zinc-400">
            Updated daily with fresh insights from our topper database.
          </div>
        </section>

        {/* ===== CURRENT AFFAIRS — THROUGH TOPPER LENS ===== */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">3</div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Current Affairs — Through Topper Lens</h2>
              <p className="text-sm text-zinc-400">How a topper would structure today's big topic</p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-zinc-700">Today's analysis coming soon</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Each morning, we publish one current affairs topic analyzed through a topper's lens — 
                structure, model answer, diagrams, and related copies.
              </p>
            </div>
          </div>
        </section>

        {/* ===== QUESTION OF THE DAY ===== */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">4</div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Question of the Day</h2>
              <p className="text-sm text-zinc-400">Try it now — see how a topper approached it tomorrow</p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600">GS2</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600">10 Marks</span>
            </div>
            <p className="text-base leading-relaxed text-zinc-800 sm:text-lg">
              "Discuss the role of the Election Commission of India in ensuring free and fair elections. 
              What reforms would you suggest to strengthen its independence?"
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/upsc-topper/animesh-pradhan-rank-2-2022"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                See how AIR 2 approached this →
              </Link>
              <p className="text-xs text-zinc-400">
                Answer revealed tomorrow in Daily Digest
              </p>
            </div>
          </div>
        </section>

        {/* ===== FOOTER CTA ===== */}
        <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 text-center sm:p-12">
          <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
            Build your answer copy library
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
            50+ verified topper copies across GS1-4, Essay & Optionals. ₹799 one-time.
          </p>
          <Link
            href="/store"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Browse Store →
          </Link>
        </section>

        {/* ===== FOOTER ===== */}
        <div className="border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
          <p>Daily Digest — UPSCPrepNotes. Updated every morning.</p>
        </div>
      </div>
    </main>
  );
}
