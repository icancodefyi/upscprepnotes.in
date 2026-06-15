"use client";

import Link from "next/link";

export default function DailyDigestPage() {
  const today = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayName = days[today.getDay()];
  const date = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();

  return (
    <main className="min-h-screen bg-[#f7f5f0]">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#1a1a2e]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYxMEgyNFYyNGgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 text-sm">
              <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-400">
                Daily Digest
              </span>
              <span className="text-white/40">{dayName}, {month} {date}, {year}</span>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your daily UPSC<br />
              <span className="text-amber-400">briefing</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              One answer copy, one data insight, one current affairs analysis, one practice question. 
              Everything you need to prepare — fresh every morning.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 -mt-10 relative z-10 space-y-24 pb-24">

        {/* ===== 1. ANSWER COPY OF THE DAY ===== */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Featured</span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
                Today's Answer Copy
              </h2>
              <p className="mt-1 text-sm text-[#8b8882]">A real topper answer sheet — annotated.</p>
            </div>
            <Link href="/store" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition">
              View all copies <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="grid lg:grid-cols-[1fr_380px]">
              {/* PDF Preview */}
              <div className="relative bg-[#f5f3ef] p-6 sm:p-8">
                <div className="aspect-[4/3] rounded-lg border border-[#e0dcd4] bg-white p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#e8e5e0] pb-3 text-xs text-[#8b8882]">
                    <span className="font-semibold text-[#1a1a2e]">GS2 · 2022</span>
                    <span>Q.1(a)</span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed">
                    <p className="font-semibold text-[#1a1a2e]">
                      "Discuss the role of the Election Commission of India in ensuring free and fair elections."
                    </p>
                    <p className="text-[#6b6862]">
                      The Election Commission of India (ECI), established under Article 324 of the Constitution, 
                      plays a pivotal role in conduct of free and fair elections...
                    </p>
                    <div className="flex gap-3">
                      <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">🔹 Keyword addressed in first line</span>
                      <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">🔹 Data-backed hook</span>
                    </div>
                    <p className="text-[#6b6862]">
                      The 2024 General Elections saw a voter turnout of 65.8% across 543 constituencies, 
                      with the ECI deploying 15,000+ observers...
                    </p>
                    <div className="rounded border-l-2 border-amber-400 bg-amber-50/50 px-3 py-2 text-xs text-[#6b6862]">
                      <span className="font-semibold text-[#1a1a2e]">Why this scored:</span> Direct keyword address, specific data point (65.8% turnout), structured flow.
                    </div>
                  </div>
                </div>
                {/* Annotation floating label */}
                <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1a1a2e] shadow-sm backdrop-blur-sm sm:bottom-5 sm:right-5">
                  Scored 134/150
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-[#e0dcd4]">
                    <img
                      src="https://upscprepnotes.in/images/toppers/garima-lohia-rank-2-2022.jpg"
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a2e]">Garima Lohia</p>
                    <p className="text-xs text-[#8b8882]">AIR 2 · 2022</p>
                  </div>
                  <span className="ml-auto rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">GS2</span>
                </div>
                <div className="mt-5 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6862]">Structure</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8e5e0]">
                        <div className="h-full w-[90%] rounded-full bg-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">9/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6862]">Diagrams</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8e5e0]">
                        <div className="h-full w-[80%] rounded-full bg-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">8/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b6862]">Value Addition</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8e5e0]">
                        <div className="h-full w-[95%] rounded-full bg-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">10/10</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Link
                    href="/upsc-topper/garima-lohia-rank-2-2022"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
                  >
                    View Full Answer Copy →
                  </Link>
                  <Link
                    href="/store"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8e5e0] py-2.5 text-sm font-medium text-[#6b6862] transition hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                  >
                    Get 50+ topper copies <span className="text-xs text-[#8b8882]">₹11/copy</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. INTELLIGENCE BRIEF ===== */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Data</span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
                Topper Intelligence Brief
              </h2>
              <p className="mt-1 text-sm text-[#8b8882]">Live from 280+ topper profiles.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">%</div>
              <p className="mt-5 text-4xl font-black tracking-tight text-[#1a1a2e]">43%</p>
              <p className="mt-1.5 text-sm text-[#6b6862]">of Top 100 chose <span className="font-semibold text-blue-600">PSIR</span> as optional</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-[#f7f5f0] px-2 py-1 text-[#6b6862]">Geography 21%</span>
                <span className="rounded-md bg-[#f7f5f0] px-2 py-1 text-[#6b6862]">Anthro 17%</span>
                <span className="rounded-md bg-[#f7f5f0] px-2 py-1 text-[#6b6862]">History 9%</span>
              </div>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">★</div>
              <p className="mt-5 text-4xl font-black tracking-tight text-[#1a1a2e]">134</p>
              <p className="mt-1.5 text-sm text-[#6b6862]">Highest GS2 marks — <span className="font-semibold text-blue-600">Animesh Pradhan</span> (AIR 2)</p>
              <Link href="/upsc-topper/animesh-pradhan-rank-2-2022" className="mt-4 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                View copy →
              </Link>
            </div>
            <div className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">⚡</div>
              <p className="mt-5 text-4xl font-black tracking-tight text-[#1a1a2e]">82%</p>
              <p className="mt-1.5 text-sm text-[#6b6862]">of Top 50 practiced <span className="font-semibold text-blue-600">answer writing</span> daily</p>
              <Link href="/store" className="mt-4 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                Start practicing →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== 3. CURRENT AFFAIRS ===== */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Today's Topic</span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
                Current Affairs — Topper's Lens
              </h2>
              <p className="mt-1 text-sm text-[#8b8882]">One topic. Structured like a topper would write it.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border-2 border-dashed border-[#d4d0c8] bg-white p-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30 sm:p-14">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#1a1a2e]">Today's analysis coming soon</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8b8882]">
                Each morning: one current affairs topic with a model answer, structure, diagrams, and related answer copies — 
                written the way a topper would approach it.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8b8882]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Your analysis will appear here tomorrow
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. QUESTION OF THE DAY ===== */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Practice</span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
                Question of the Day
              </h2>
              <p className="mt-1 text-sm text-[#8b8882]">Write it. Tomorrow, see how a topper answered.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="bg-[#fdf2f8] px-6 py-4 sm:px-8">
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-md bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white">GS2</span>
                <span className="text-[#8b8882]">10 Marks</span>
                <span className="ml-auto text-xs font-medium text-rose-600">Write your answer</span>
              </div>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <p className="text-base leading-relaxed text-[#1a1a2e] sm:text-lg">
                "Discuss the role of the Election Commission of India in ensuring free and fair elections. 
                What reforms would you suggest to strengthen its independence?"
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/upsc-topper/animesh-pradhan-rank-2-2022"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
                >
                  See AIR 2's approach →
                </Link>
                <p className="text-xs text-[#8b8882]">Answer revealed tomorrow in the digest</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 5. STORE CTA ===== */}
        <section className="overflow-hidden rounded-2xl bg-[#1a1a2e] shadow-lg">
          <div className="grid sm:grid-cols-2">
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">The Bundle</p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">50+ topper answer copies</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                GS1-4, Essay, Optional. Every copy verified. One payment.
              </p>
              <div className="mt-2 text-3xl font-black text-white">₹799</div>
              <p className="mt-1 text-xs text-white/40">₹11 per copy</p>
              <Link
                href="/store"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-[#1a1a2e] transition hover:bg-amber-400"
              >
                Browse Store →
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center bg-white/5 p-10">
              <div className="text-center">
                <div className="text-5xl font-black text-white/10">50+</div>
                <p className="mt-1 text-sm text-white/20">Verified copies</p>
                <div className="mt-4 flex justify-center gap-3">
                  <div className="h-8 w-6 rounded border border-white/10 bg-white/5" />
                  <div className="h-8 w-6 rounded border border-white/10 bg-white/5" />
                  <div className="h-8 w-6 rounded border border-white/10 bg-white/5" />
                  <div className="h-8 w-6 rounded border border-white/10 bg-white/5" />
                  <div className="h-8 w-6 rounded border border-amber-500/30 bg-amber-500/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <div className="border-t border-[#e0dcd4] pt-6 text-center text-xs text-[#8b8882]">
          <p>UPSCPrepNotes Digest · Updated every morning · <Link href="/store" className="underline underline-offset-4 decoration-[#d4d0c8] hover:decoration-[#1a1a2e]">Store</Link></p>
        </div>

      </div>
    </main>
  );
}
