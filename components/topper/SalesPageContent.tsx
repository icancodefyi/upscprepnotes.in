import Link from "next/link";
import { TOPPERS, FAQS, FEATURES } from "./sales-page-data";
import PayButton from "@/components/ui/PayButton";

export default function SalesPageContent() {
  return (
    <main className="min-h-screen bg-white">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden border-b border-black/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col lg:flex-row">
          <div className="flex flex-col justify-center px-5 pt-20 pb-12 sm:px-8 lg:w-1/2 lg:py-28 lg:pl-12 xl:pl-16">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-5 overflow-hidden rounded-full ring-2 ring-white">
                    <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  </div>
                ))}
              </div>
              <span><strong className="text-gray-800">2,300+</strong> compilations delivered</span>
            </div>
            <h1 className="mt-4 max-w-2xl text-[clamp(1.75rem,5.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">
              Stop losing marks on
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">presentation &amp; structure</span>
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500 sm:text-base">
              See exactly how 50+ toppers (AIR 1–1249) wrote their answers by hand — the same handwriting, structure, underlining, and presentation that scored 140+ in GS, Essay, and Optional papers.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PayButton amount={799} productSlug="all-strategy-reports" tracking="dodo-hero" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] sm:px-7 sm:py-3.5 sm:text-base transition-transform duration-150 active:scale-[0.97]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                Pay ₹799 — Get Instant Access
              </PayButton>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>7-day refund</span>
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>2-hour delivery</span>
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>Verified copies</span>
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M12 2C4.5 2 2 7 2 12c0 3 1 6 3 8l-1 3 4-1c2 1 4 2 7 2 7 0 10-5 10-10S19 2 12 2z"/></svg>Card / UPI</span>
            </div>
          </div>
          <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-gray-50/80 to-white px-4 py-8 lg:min-h-[500px] lg:w-1/2 lg:px-8">
            <div className="relative w-full max-w-sm">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {TOPPERS.filter((_, i) => i < 4).map((t) => (
                  <div key={t.name} className="group relative overflow-hidden rounded-xl border border-black/[0.06] bg-gray-50 shadow-sm">
                    <Link href={`/upsc-topper/${t.slug}`} className="block">
                      <div className="aspect-[3/4]">
                        <img src={t.previewImageUrl} alt={t.name} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.05]" />
                      </div>
                    </Link>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                      <Link href={`/upsc-topper/${t.slug}`} className="text-[11px] font-bold text-white drop-shadow-sm leading-tight hover:underline">{t.name}</Link>
                      <p className="text-[9px] text-white/70">{t.rank} · {t.subject}</p>
                    </div>
                  </div>
                ))}
                <div className="col-span-2 flex items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3">
                  <p className="text-[11px] font-semibold text-emerald-700 text-center leading-relaxed">
                    +50 more toppers<br />
                    <span className="text-emerald-500 font-normal">GS1–4 · Essay · Optional</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TOPPER GRID */}
      <section id="toppers" className="border-b border-black/[0.04] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">Who is inside</p>
            <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">50+ toppers across 4 years</h2>
            <p className="mt-2 text-sm text-gray-500">Each copy verified with original scorecard. Rank range: AIR 1 – AIR 1249.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TOPPERS.filter(t => t.previewImageUrl).map((t) => {
              return (
                <div key={t.name} className="group relative overflow-hidden rounded-xl border border-black/[0.06] bg-gray-50">
                  <div className="aspect-[3/4]">
                    <button type="button" data-preview-url={t.previewImageUrl} className="h-full w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
                      <img src={t.previewImageUrl} alt={`Preview: ${t.name}`} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]" />
                    </button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <Link href={`/upsc-topper/${t.slug}`} className="text-sm font-bold text-white drop-shadow-sm hover:underline">{t.name}</Link>
                    <p className="text-[11px] text-white/80">{t.rank} · {t.subject}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline -mt-0.5 mr-1 text-emerald-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Every copy includes the original scorecard for verification
          </p>
          <div className="mt-6 text-center">
            <Link href="/store" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] transition-transform duration-150">
              View more in compilation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT YOU GET */}
      <section className="border-b border-black/[0.04] bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">The Complete Compilation</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">72 resources for ₹799</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">Everything you need in one pack. No tiers, no upselling.</p>
          </div>
          <div className="mx-auto mt-10 max-w-lg">
            <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] sm:p-8">
              <div className="text-center">
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">One Compilation</span>
                <div className="mt-4 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold tracking-[-0.03em] text-gray-900">₹799</span>
                  <span className="text-sm text-gray-400 line-through">₹1,198</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">₹11 per resource · 50+ topper copies included</p>
              </div>
              <div className="mt-6 space-y-3 border-t border-black/[0.06] pt-6">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-2.5">
                <PayButton amount={799} productSlug="all-strategy-reports" tracking="dodo-offer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-base transition-transform duration-150">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                  Pay ₹799 — Get Instant Access
                </PayButton>
              </div>
              <div className="relative mt-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-[10px] font-medium text-gray-400">or try before you pay</span></div>
              </div>
              <form id="samples-form" className="mt-4 flex gap-2">
                <input type="email" id="samples-email" required placeholder="Enter your email" className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                <button type="submit" id="samples-submit" className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all">Get 3 Free Guides</button>
              </form>
              <p id="samples-success" className="mt-2 hidden text-center text-xs font-semibold text-emerald-600">Check your inbox — we sent 3 free guides!</p>
              <p id="samples-error" className="mt-2 hidden text-center text-xs text-red-500"></p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1 text-xs text-gray-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>7-day refund</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Verified copies</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C4.5 2 2 7 2 12c0 3 1 6 3 8l-1 3 4-1c2 1 4 2 7 2 7 0 10-5 10-10S19 2 12 2z"/></svg>Card / UPI</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* SECTION 5: FAQ */}
      <section className="border-b border-black/[0.04] bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900 sm:text-2xl">Questions?</h2>
          <div className="mt-6 divide-y divide-black/[0.06] rounded-xl border border-black/[0.06] bg-white" id="faq-container">
            {FAQS.map((faq, i) => (
              <div key={faq.q} data-faq-index={i}>
                <button type="button" data-faq-toggle={i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:px-6">
                  {faq.q}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-gray-400 transition-transform`} data-faq-chevron={i}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div data-faq-answer={i} className="hidden border-t border-black/[0.04] px-5 pb-4 pt-3 sm:px-6">
                  <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gray-50 border-b border-black/[0.04]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/upsc-topper-answer-copies" className="text-gray-500 hover:text-gray-900 transition-colors">Guide to Topper Answer Copies</Link>
            <span className="text-gray-300">·</span>
            <Link href="/upsc-topper-answer-copies#faq" className="text-gray-500 hover:text-gray-900 transition-colors">FAQ about Answer Copies</Link>
            <span className="text-gray-300">·</span>
            <Link href="/how-to-write-upsc-mains-answers" className="text-gray-500 hover:text-gray-900 transition-colors">How to Write UPSC Mains Answers</Link>
            <span className="text-gray-300">·</span>
            <Link href="/free-materials" className="text-gray-500 hover:text-gray-900 transition-colors">Free Study Materials</Link>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 pb-8 pt-6">UPSCPrepNotes is an independent platform. Answer copies sourced from publicly available materials for educational reference.</p>
    </main>
  );
}
