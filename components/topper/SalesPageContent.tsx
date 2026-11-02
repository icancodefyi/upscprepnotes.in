import Link from "next/link";
import { TOPPERS, FAQS, FEATURES } from "./sales-page-data";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

function Check() {
  return (
    <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-s font-bold text-[var(--accent)]">
      &#10003;
    </span>
  );
}

/** The compilation sales page (original copy) in the brand: paper previews, one offer card, plain FAQ. */
export default function SalesPageContent() {
  return (
    <div className="pb-24 pt-28 sm:pt-32">
      {/* HERO */}
      <section className="mx-auto grid max-w-[1120px] items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-s text-[var(--muted)]">
            <strong className="text-[var(--ink)]">2,300+</strong> products delivered
          </p>
          <h1 className="t-display mt-4 text-h1">
            Stop losing marks on
            <br />
            <span className="text-[var(--accent)]">presentation &amp; structure</span>
          </h1>
          <p className="mt-5 max-w-md text-m leading-[1.6] text-[var(--ink-2)]">Starting at ₹49. Instant download · 7-day refund guarantee.</p>
          <div className="mt-7">
            <Link href="/store" className="btn btn-blue">
              Shop Now &rarr;
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-s text-[var(--ink-2)]">
            {["7-day refund", "2-hour delivery", "Verified copies", "Card / UPI"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span aria-hidden className="font-bold text-[var(--accent)]">&#10003;</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {TOPPERS.filter((_, i) => i < 4).map((t, i) => (
            <Link key={t.name} href={`/upsc-topper/${t.slug}`} className="group block" style={{ transform: `rotate(${[-1.5, 1.2, 1, -1.2][i]}deg)` }}>
              <span className="paper block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.previewImageUrl} alt={t.name} className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </span>
              <span className="mt-2 block text-s font-bold group-hover:text-[var(--accent)]">{t.name}</span>
              <span className="block text-s text-[var(--muted)]">{t.rank} · {t.subject}</span>
            </Link>
          ))}
          <div className="col-span-2 rounded-[20px] bg-[#e9edff] p-4 text-center">
            <p className="text-s font-bold text-[var(--accent-deep)]">+50 more toppers</p>
            <p className="text-s text-[var(--accent-deep)]/70">GS1–4 · Essay · Optional</p>
          </div>
        </div>
      </section>

      {/* TOPPER GRID */}
      <section id="toppers" className="mx-auto mt-24 max-w-[1120px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="t-head text-l">Starting at ₹49</h2>
          <p className="mt-1 text-s text-[var(--muted)]">Who is inside</p>
          <p className="mt-3 text-m text-[var(--ink-2)]">Instant download · 7-day refund guarantee.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {TOPPERS.filter((t) => t.previewImageUrl).map((t) => (
            <div key={t.name} className="group">
              <button type="button" data-preview-url={t.previewImageUrl} className="paper block w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--accent)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.previewImageUrl} alt={`Preview: ${t.name}`} className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
              <Link href={`/upsc-topper/${t.slug}`} className="mt-2 block text-m font-bold hover:text-[var(--accent)]">{t.name}</Link>
              <p className="text-s text-[var(--muted)]">{t.rank} · {t.subject}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-s text-[var(--ink-2)]">Every copy includes the original scorecard for verification</p>
        <div className="mt-6 text-center">
          <Link href="/store" className="btn btn-blue">
            Shop Now &rarr;
          </Link>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto mt-24 max-w-[1120px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="t-head text-l">Starting at ₹49</h2>
          <p className="mt-1 text-s text-[var(--muted)]">Offer</p>
          <p className="mt-3 text-m text-[var(--ink-2)]">Instant download · 7-day refund guarantee.</p>
        </div>
        <div className={`${card} mx-auto mt-10 max-w-lg p-6 sm:p-8`}>
          <div className="text-center">
            <span className="inline-block rounded-full bg-[var(--hl)] px-3 py-1 text-s font-bold text-[var(--hl-ink)]">Offer</span>
            <p className="t-display tab mt-4 text-h1">₹99</p>
            <p className="mt-1 text-s text-[var(--muted)]">Starting at ₹49 · Instant download</p>
          </div>
          <ul className="mt-6 space-y-3 border-t border-[var(--line)] pt-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-s leading-[1.55] text-[var(--ink-2)]">
                <Check />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/store" className="btn btn-blue mt-8 w-full justify-center">
            Shop Now &rarr;
          </Link>
          <div className="relative mt-6 text-center">
            <span aria-hidden className="absolute inset-x-0 top-1/2 border-t border-[var(--line)]" />
            <span className="relative bg-white px-3 text-s text-[var(--muted)]">or try before you pay</span>
          </div>
          <form id="samples-form" className="mt-4 flex items-center gap-2 rounded-full bg-[var(--canvas)] p-1.5 pl-5">
            <input type="email" id="samples-email" required placeholder="Enter your email" aria-label="Email address" className="h-10 min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]" />
            <button type="submit" id="samples-submit" className="btn btn-ink h-10 shrink-0 px-4 [--btn-fs:14px] disabled:opacity-50">
              Get 3 Free Guides
            </button>
          </form>
          <p id="samples-success" className="mt-2 hidden text-center text-s font-bold text-[#172fa3]">Check your inbox — we sent 3 free guides!</p>
          <p id="samples-error" className="mt-2 hidden text-center text-s text-[var(--mark-deep)]"></p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-s text-[var(--muted)]">
            {["7-day refund", "Starting at ₹49", "Card / UPI"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span aria-hidden className="font-bold text-[var(--accent)]">&#10003;</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl px-6">
        <h2 className="t-head text-l">Questions?</h2>
        <div className={`${card} mt-6 divide-y divide-[var(--line)]`}>
          {FAQS.map((faq) => (
            <details key={faq.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-m font-bold">{faq.q}</h3>
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
              </summary>
              <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mx-auto mt-16 flex max-w-[1120px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 text-s">
        <Link href="/content/upsc-topper-answer-copies" className="text-[var(--ink-2)] hover:text-[var(--accent)]">Guide to Topper Answer Copies</Link>
        <Link href="/content/upsc-topper-answer-copies#faq" className="text-[var(--ink-2)] hover:text-[var(--accent)]">FAQ about Answer Copies</Link>
        <Link href="/content/how-to-write-upsc-mains-answers" className="text-[var(--ink-2)] hover:text-[var(--accent)]">How to Write UPSC Mains Answers</Link>
        <Link href="/free-materials" className="text-[var(--ink-2)] hover:text-[var(--accent)]">Free Study Materials</Link>
      </nav>
      <p className="mx-auto mt-6 max-w-[1120px] px-6 text-center text-s text-[var(--muted)]">
        UPSCPrepNotes is an independent platform. Answer copies sourced from publicly available materials for educational reference.
      </p>
    </div>
  );
}
