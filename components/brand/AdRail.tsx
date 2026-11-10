import Link from "next/link";
import { getProductBySlug } from "@/lib/store-products";
import { PITCH } from "@/lib/rail";
import { activeAd } from "@/lib/ads";
import { card } from "./ui";

const DEFAULT_PRODUCT = "answer-copies-compilation";

function ProductCard({ page, productSlug }: { page: string; productSlug?: string }) {
  const wanted = getProductBySlug(productSlug ?? DEFAULT_PRODUCT);
  const p = wanted && !wanted.comingSoon ? wanted : getProductBySlug(DEFAULT_PRODUCT);
  if (!p) return null;
  const pitch = PITCH[p.slug] ?? { headline: p.title, line: p.tagline, cta: "See it" };
  return (
    <Link
      href={`/store/${p.slug}`}
      data-track="rail-product"
      data-track-page={page}
      className={`${card} group block p-3.5 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}
    >
      <div className="flex gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} width={72} height={94} loading="lazy" className="h-[94px] w-[72px] shrink-0 rounded-[10px] bg-[var(--canvas)] object-cover shadow-[0_0_0_1px_var(--line-2)]" />
        <div className="min-w-0">
          <p className="t-head text-m leading-[1.2]">{pitch.headline}</p>
          <p className="mt-1.5 text-s leading-[1.4] text-[var(--ink-2)]">{pitch.line}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
        <span>
          <span className="block text-m font-bold leading-none">{`₹${p.price}`}</span>
          <span className="mt-1 block text-s text-[var(--muted)]">Instant delivery, 7-day refund</span>
        </span>
        <span className="btn btn-blue h-10 shrink-0 px-5 [--btn-fs:14px]">{pitch.cta}</span>
      </div>
    </Link>
  );
}

/** What an advertiser's slot looks like, shown until a real ad is booked. */
function SampleAd() {
  return (
    <div aria-hidden className="overflow-hidden rounded-[16px] bg-white shadow-[0_0_0_1px_var(--line-2)] ">
      <div className="flex h-[48px] items-center justify-center bg-[#e9edff]">
        <svg viewBox="0 0 64 40" className="h-6 w-9 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="56" height="32" rx="6" />
          <path d="M4 28l16-12 12 9 10-7 18 12" />
        </svg>
      </div>
      <div className="flex items-center justify-between gap-2 p-3 text-left">
        <p className="text-s font-bold leading-[1.3]">Your course, app or book</p>
        <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-[var(--ink)] px-3.5 text-s font-bold text-white">Learn more</span>
      </div>
    </div>
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
        className={`${card} relative block overflow-hidden`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.image} alt={ad.sponsor} width={300} height={200} loading="lazy" className="block h-[200px] w-full object-cover" />
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--muted)] shadow-[0_0_0_1px_var(--line-2)]">Sponsored</span>
      </a>
    );
  }
  return (
    <div className={`${card} relative p-3`}>
      <span className="absolute right-3.5 top-3.5 z-10 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--muted)] shadow-[0_0_0_1px_var(--line-2)]">Sample ad</span>
      <SampleAd />
      <Link href="/advertise" data-track="rail-ad-slot" data-track-page={page} className="mt-2.5 block text-s font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]">
        Your ad would look like this, on every page. Advertise with us
      </Link>
    </div>
  );
}

/**
 * The right rail: one product with a reason to click, then the sponsor slot.
 * Put it in a 300px column (sticky) on wide screens, or inline below the content on small ones.
 */
export default function AdRail({ page, product, inline = false }: { page: string; product?: string; inline?: boolean }) {
  return (
    <div className={inline ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
      <ProductCard page={page} productSlug={product} />
      <SponsorSlot page={page} />
    </div>
  );
}
