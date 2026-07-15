import Link from "next/link";
import { TOPPERS, FAQS, FEATURES } from "./sales-page-data";

export default function SalesPageContent() {
  return (
    <main className="min-h-screen bg-background">
      {/* SECTION 1: HERO */}
      <section className="relative border-b border-border">
        <div className="relative mx-auto flex max-w-7xl flex-col lg:flex-row">
          <div className="flex flex-col justify-center px-5 pt-20 pb-12 sm:px-8 lg:w-1/2 lg:py-28 lg:pl-12 xl:pl-16">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span><strong className="text-foreground">2,300+</strong> products delivered</span>
            </div>
            <h1 className="mt-4 max-w-2xl text-[clamp(1.75rem,5.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
              Stop losing marks on
              <br />
              <span className="text-brand">presentation &amp; structure</span>
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Starting at ₹99. Instant download · 7-day refund guarantee.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/store" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground hover:bg-brand/90 active:scale-[0.97] sm:px-7 sm:py-3.5 sm:text-base transition-transform duration-150">
                Shop Now &rarr;
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><polyline points="20 6 9 17 4 12"/></svg>7-day refund</span>
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>2-hour delivery</span>
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><polyline points="20 6 9 17 4 12"/></svg>Verified copies</span>
              <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M12 2C4.5 2 2 7 2 12c0 3 1 6 3 8l-1 3 4-1c2 1 4 2 7 2 7 0 10-5 10-10S19 2 12 2z"/></svg>Card / UPI</span>
            </div>
          </div>
          <div className="flex min-h-[320px] items-center justify-center bg-secondary px-4 py-8 lg:min-h-[500px] lg:w-1/2 lg:px-8">
            <div className="relative w-full max-w-sm">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {TOPPERS.filter((_, i) => i < 4).map((t) => (
                  <div key={t.name} className="group relative overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
                    <Link href={`/upsc-topper/${t.slug}`} className="block">
                      <div className="aspect-[3/4]">
                        <img src={t.previewImageUrl} alt={t.name} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.05]" />
                      </div>
                    </Link>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-2 pt-6">
                      <Link href={`/upsc-topper/${t.slug}`} className="text-[11px] font-bold text-white drop-shadow-sm leading-tight hover:underline">{t.name}</Link>
                      <p className="text-[9px] text-white/70">{t.rank} · {t.subject}</p>
                    </div>
                  </div>
                ))}
                <div className="col-span-2 flex items-center justify-center rounded-xl border border-dashed border-brand/20 bg-brand-muted p-3">
                  <p className="text-[11px] font-semibold text-brand text-center leading-relaxed">
                    +50 more toppers<br />
                    <span className="text-brand/70 font-normal">GS1–4 · Essay · Optional</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TOPPER GRID */}
      <section id="toppers" className="border-b border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Who is inside</p>
            <h2 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">Starting at ₹99</h2>
            <p className="mt-2 text-sm text-muted-foreground">Instant download · 7-day refund guarantee.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TOPPERS.filter(t => t.previewImageUrl).map((t) => {
              return (
                <div key={t.name} className="group relative overflow-hidden rounded-xl border border-border bg-secondary">
                  <div className="aspect-[3/4]">
                    <button type="button" data-preview-url={t.previewImageUrl} className="h-full w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
                      <img src={t.previewImageUrl} alt={`Preview: ${t.name}`} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]" />
                    </button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 pt-8">
                    <Link href={`/upsc-topper/${t.slug}`} className="text-sm font-bold text-white drop-shadow-sm hover:underline">{t.name}</Link>
                    <p className="text-[11px] text-white/80">{t.rank} · {t.subject}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline -mt-0.5 mr-1 text-brand"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Every copy includes the original scorecard for verification
          </p>
          <div className="mt-6 text-center">
            <Link href="/store" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground hover:bg-brand/90 active:scale-[0.97] transition-transform duration-150">
              Shop Now &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT YOU GET */}
      <section className="border-b border-border py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Offer</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">Starting at ₹99</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Instant download · 7-day refund guarantee.</p>
          </div>
          <div className="mx-auto mt-10 max-w-lg">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="text-center">
                <span className="inline-block rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-foreground">Offer</span>
                <div className="mt-4 flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold tracking-[-0.03em] text-foreground">₹99</span>
                  <span className="text-sm text-muted-foreground line-through">₹4,999</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Starting at ₹99 · Instant download</p>
              </div>
              <div className="mt-6 space-y-3 border-t border-border pt-6">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-2.5">
                <Link href="/store" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground hover:bg-brand/90 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-base transition-transform duration-150">
                  Shop Now &rarr;
                </Link>
              </div>
              <div className="relative mt-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-card px-3 text-[10px] font-medium text-muted-foreground">or try before you pay</span></div>
              </div>
              <form id="samples-form" className="mt-4 flex gap-2">
                <input type="email" id="samples-email" required placeholder="Enter your email" className="min-w-0 flex-1 rounded-lg border border-input px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
                <button type="submit" id="samples-submit" className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background hover:bg-foreground/90 disabled:opacity-50 transition-all">Get 3 Free Guides</button>
              </form>
              <p id="samples-success" className="mt-2 hidden text-center text-xs font-semibold text-brand">Check your inbox — we sent 3 free guides!</p>
              <p id="samples-error" className="mt-2 hidden text-center text-xs text-destructive"></p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>7-day refund</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Starting at ₹99</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C4.5 2 2 7 2 12c0 3 1 6 3 8l-1 3 4-1c2 1 4 2 7 2 7 0 10-5 10-10S19 2 12 2z"/></svg>Card / UPI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section className="border-b border-border bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground sm:text-2xl">Questions?</h2>
          <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card" id="faq-container">
            {FAQS.map((faq, i) => (
              <div key={faq.q} data-faq-index={i}>
                <button type="button" data-faq-toggle={i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground hover:bg-secondary sm:px-6">
                  {faq.q}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-muted-foreground transition-transform`} data-faq-chevron={i}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div data-faq-answer={i} className="hidden border-t border-border px-5 pb-4 pt-3 sm:px-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/content/upsc-topper-answer-copies" className="text-muted-foreground hover:text-foreground transition-colors">Guide to Topper Answer Copies</Link>
            <span className="text-muted-foreground/50">·</span>
            <Link href="/content/upsc-topper-answer-copies#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ about Answer Copies</Link>
            <span className="text-muted-foreground/50">·</span>
            <Link href="/content/how-to-write-upsc-mains-answers" className="text-muted-foreground hover:text-foreground transition-colors">How to Write UPSC Mains Answers</Link>
            <span className="text-muted-foreground/50">·</span>
            <Link href="/free-materials" className="text-muted-foreground hover:text-foreground transition-colors">Free Study Materials</Link>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-8 pt-6">UPSCPrepNotes is an independent platform. Answer copies sourced from publicly available materials for educational reference.</p>
    </main>
  );
}
