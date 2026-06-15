"use client";

import Link from "next/link";

export default function DailyDigestPage() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ===== MASTHEAD ===== */}
      <div className="border-b border-[#e8e5e0] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#1a1a2e] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">Daily</span>
            <span className="text-sm text-[#8b8882]">{dateStr}</span>
          </div>
          <Link href="/store" className="text-[13px] font-semibold text-[#1a1a2e] underline underline-offset-4 decoration-[#d4d0c8] hover:decoration-[#1a1a2e] transition-all">
            Browse Store →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14 space-y-20">

        {/* ===== SECTION 1: ANSWER COPY OF THE DAY ===== */}
        <section>
          <div className="mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#b45309]">Featured</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
            Answer Copy of the Day
          </h2>
          <p className="mt-1.5 text-sm text-[#8b8882] max-w-xl">
            One real UPSC answer sheet, annotated. What worked, why it scored, and how you can apply it.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#e8e5e0] bg-white shadow-sm transition hover:shadow-md">
            <div className="grid sm:grid-cols-[320px_1fr]">
              <div className="relative bg-[#f5f3ef]">
                <div className="aspect-[3/4] sm:aspect-auto sm:h-full">
                  <img
                    src="https://upscprepnotes.in/images/toppers/garima-lohia-rank-2-2022.jpg"
                    alt="Garima Lohia"
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1a1a2e] shadow-sm backdrop-blur-sm">
                  AIR 2 · 2022
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-[#fffbeb] px-2.5 py-1 text-[11px] font-semibold text-[#b45309]">GS2</span>
                  <span className="text-[13px] text-[#8b8882]">134 / 150 marks</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#1a1a2e]">
                  Garima Lohia's GS2 Answer Copy
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b6862]">
                  Scored 134 — among the highest GS2 marks in 2022. Every paragraph opens with a direct address to the keyword, 
                  followed by a data point, a structured argument, and a diagram where relevant.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#f0ede8] pt-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#8b8882]">Structure</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-[60px] rounded-full bg-[#f5f3ef]"><div className="h-full w-full rounded-full bg-[#b45309]" style={{width: '90%'}} /></div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">9/10</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#8b8882]">Diagrams</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-[60px] rounded-full bg-[#f5f3ef]"><div className="h-full w-full rounded-full bg-[#b45309]" style={{width: '80%'}} /></div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">8/10</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#8b8882]">Value Add</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-[60px] rounded-full bg-[#f5f3ef]"><div className="h-full w-full rounded-full bg-[#b45309]" style={{width: '95%'}} /></div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">10/10</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <Link
                    href="/upsc-topper/garima-lohia-rank-2-2022"
                    className="rounded-xl bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
                  >
                    View Full Copy →
                  </Link>
                  <Link
                    href="/store"
                    className="text-sm font-medium text-[#8b8882] transition hover:text-[#1a1a2e]"
                  >
                    Get 50+ copies ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: INTELLIGENCE BRIEF ===== */}
        <section>
          <div className="mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#2563eb]">Data</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
            Topper Intelligence Brief
          </h2>
          <p className="mt-1.5 text-sm text-[#8b8882] max-w-xl">
            What the data says about 280+ toppers — updated daily.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e8e5e0] bg-white p-6 transition hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-sm font-bold text-[#2563eb]">%</div>
              <p className="mt-4 text-4xl font-bold tracking-tight text-[#1a1a2e]">43%</p>
              <p className="mt-1 text-sm leading-relaxed text-[#6b6862]">
                of Top 100 rankers chose <span className="font-semibold text-[#2563eb]">PSIR</span> as optional
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#8b8882]">
                <span>Geography: 21%</span>
                <span>Anthropology: 17%</span>
                <span>History: 9%</span>
              </div>
            </div>
            <div className="rounded-xl border border-[#e8e5e0] bg-white p-6 transition hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-sm font-bold text-[#2563eb]">★</div>
              <p className="mt-4 text-4xl font-bold tracking-tight text-[#1a1a2e]">134</p>
              <p className="mt-1 text-sm leading-relaxed text-[#6b6862]">
                marks — highest GS2 score <span className="font-semibold text-[#2563eb]">Animesh Pradhan</span> (AIR 2)
              </p>
              <div className="mt-4">
                <Link href="/upsc-topper/animesh-pradhan-rank-2-2022" className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition">
                  View copy →
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-[#e8e5e0] bg-white p-6 transition hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-sm font-bold text-[#2563eb]">⚡</div>
              <p className="mt-4 text-4xl font-bold tracking-tight text-[#1a1a2e]">82%</p>
              <p className="mt-1 text-sm leading-relaxed text-[#6b6862]">
                of AIR Top 50 practiced <span className="font-semibold text-[#2563eb]">answer writing</span> daily
              </p>
              <div className="mt-4">
                <Link href="/store" className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition">
                  Browse copies →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: CURRENT AFFAIRS — PLACEHOLDER ===== */}
        <section>
          <div className="mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#059669]">Today's Topic</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
            Current Affairs — Topper's Take
          </h2>
          <p className="mt-1.5 text-sm text-[#8b8882] max-w-xl">
            One current affairs topic analyzed the way a topper would write it in the exam.
          </p>

          <div className="mt-8 rounded-2xl border-2 border-dashed border-[#d4d0c8] bg-white p-10 text-center transition hover:border-[#059669]">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdf4]">
                <svg className="h-7 w-7 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#1a1a2e]">Today's topic coming soon</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8b8882]">
                Each morning, one current affairs topic with a model answer structured the way a topper would write it — 
                introduction, body, diagrams, conclusion, and related answer copies.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8b8882]">
                <span className="flex h-2 w-2 rounded-full bg-[#059669]" />
                Your analysis will appear here
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: QUESTION OF THE DAY ===== */}
        <section>
          <div className="mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#be185d]">Practice</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">
            Question of the Day
          </h2>
          <p className="mt-1.5 text-sm text-[#8b8882] max-w-xl">
            Write it today. Tomorrow we'll show you how a topper answered it.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#e8e5e0] bg-white shadow-sm">
            <div className="border-b border-[#f0ede8] bg-[#fdf2f8] px-7 py-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-md bg-[#be185d] px-2.5 py-1 font-semibold text-white">GS2</span>
                <span className="text-[#8b8882]">10 Marks</span>
                <span className="text-[#8b8882]">·</span>
                <span className="text-[#be185d] font-medium">Try it now</span>
              </div>
            </div>
            <div className="px-7 py-6 sm:py-8">
              <p className="text-base leading-relaxed text-[#1a1a2e] sm:text-lg">
                "Discuss the role of the Election Commission of India in ensuring free and fair elections. 
                What reforms would you suggest to strengthen its independence?"
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/upsc-topper/animesh-pradhan-rank-2-2022"
                  className="inline-flex items-center justify-center rounded-xl bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
                >
                  See AIR 2's approach →
                </Link>
                <p className="text-xs text-[#8b8882]">
                  Answer revealed tomorrow morning
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CLOSING CTA ===== */}
        <section className="rounded-2xl border border-[#e8e5e0] bg-white p-10 text-center sm:p-14 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8b8882]">The Complete Set</p>
          <h2 className="mt-3 text-2xl font-bold text-[#1a1a2e] sm:text-3xl">
            50+ topper answer copies
          </h2>
          <p className="mt-2 text-sm text-[#8b8882] max-w-sm mx-auto">
            GS1-4, Essay, Optional. All 50+ copies. One-time payment.
          </p>
          <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">₹799</div>
          <Link
            href="/store"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1a1a2e] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
          >
            Browse Store →
          </Link>
        </section>

        {/* ===== FOOTER ===== */}
        <div className="border-t border-[#e8e5e0] pt-6 text-center text-xs text-[#8b8882]">
          <p>UPSCPrepNotes Daily Digest · Updated every morning</p>
        </div>
      </div>
    </main>
  );
}
