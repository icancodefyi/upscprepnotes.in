import Link from "next/link";
import { getProductBySlug } from "@/lib/store-products";
import { activeAd } from "@/lib/ads";

const DEFAULT_PRODUCT = "answer-copies-compilation";

function ProductCard({ page, productSlug }: { page: string; productSlug?: string }) {
  const wanted = getProductBySlug(productSlug ?? DEFAULT_PRODUCT);
  const p = wanted && !wanted.comingSoon ? wanted : getProductBySlug(DEFAULT_PRODUCT);
  if (!p) return null;
  return (
    <Link
      href={`/store/${p.slug}`}
      data-track="rail-product"
      data-track-page={page}
      className="group relative block overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#1f3fd6_0%,#3a58e4_100%)] p-4 text-white shadow-[0_14px_34px_-14px_rgba(31,63,214,0.6)]"
    >
      <span aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#ffe45c]/25 blur-[2px]" />
      <div className="relative flex gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt=""
          width={78}
          height={104}
          loading="lazy"
          className="h-[104px] w-[78px] shrink-0 -rotate-3 rounded-[10px] bg-white object-cover shadow-[0_10px_20px_-6px_rgba(0,0,0,0.45)] ring-2 ring-white/50 transition-transform duration-300 ease-[var(--ease)] group-hover:rotate-0"
        />
        <div className="min-w-0">
          <p className="text-m font-bold leading-[1.2]">{p.title}</p>
          <p className="mt-1 text-s leading-[1.35] text-white/80">{p.tagline}</p>
          <div className="mt-2.5 flex items-center gap-2.5">
            <span className="rounded-full bg-[#ffe45c] px-2.5 py-0.5 text-s font-bold text-[#0b0c10]">{`₹${p.price}`}</span>
            <span className="text-s font-bold transition-transform duration-200 group-hover:translate-x-0.5">Get it →</span>
          </div>
        </div>
      </div>
      <p className="relative mt-3 text-s text-white/75">Instant email delivery, 7-day refund</p>
    </Link>
  );
}

function SponsorSlot({ page }: { page: string }) {
  const ad = activeAd();
  if (ad) {
    return (
      <a
        href={ad.href}
        target="_blank"
        rel="sponsored noopener"
        data-track="rail-sponsor"
        data-track-page={page}
        data-track-ad={ad.id}
        className="relative block overflow-hidden rounded-[24px] shadow-[0_0_0_1px_var(--line-2)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.image} alt={ad.sponsor} width={300} height={200} loading="lazy" className="block h-[200px] w-full object-cover" />
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-[var(--muted)]">Sponsored</span>
      </a>
    );
  }
  return (
    <Link
      href="/advertise"
      data-track="rail-ad-slot"
      data-track-page={page}
      className="group relative flex h-[200px] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#ffffff_0%,#eef1ff_100%)] px-5 text-center shadow-[0_0_0_1px_var(--line-2)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--accent),0_12px_28px_-14px_rgba(31,63,214,0.45)]"
    >
      <span className="absolute right-2.5 top-2.5 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--muted)] shadow-[0_0_0_1px_var(--line-2)]">Ad</span>
      <svg aria-hidden viewBox="0 0 120 60" className="absolute inset-x-0 bottom-0 h-16 w-full text-[var(--accent)] opacity-[0.12]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M0 48 Q20 20 40 38 T80 30 T120 12" />
        <path d="M0 56 Q20 34 40 48 T80 42 T120 28" />
      </svg>
      <p className="relative text-m font-bold leading-[1.25]">Your brand here</p>
      <p className="relative mt-1.5 max-w-[22ch] text-s leading-[1.4] text-[var(--ink-2)]">Put your course, app or book in front of UPSC aspirants.</p>
      <span className="relative mt-3 inline-flex h-9 items-center rounded-full bg-[var(--ink)] px-4 text-s font-bold text-white transition-transform duration-200 group-hover:-translate-y-0.5">Advertise with us</span>
    </Link>
  );
}

/**
 * The right rail: one product that fits the page, then the sponsor slot.
 * Place it in a 300px column (sticky) on wide screens, or inline below the content on small ones.
 */
export default function AdRail({ page, product, inline = false }: { page: string; product?: string; inline?: boolean }) {
  return (
    <div className={inline ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
      <ProductCard page={page} productSlug={product} />
      <SponsorSlot page={page} />
    </div>
  );
}
