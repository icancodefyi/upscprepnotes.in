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
      className={`${card} group block overflow-hidden transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}
    >
      <div className="flex items-end gap-4 bg-[#fff8d6] px-4 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} width={88} height={114} loading="lazy" className="h-[114px] w-[88px] shrink-0 rounded-t-[10px] bg-white object-cover shadow-[0_0_0_1px_rgba(92,74,0,0.15)]" />
        <p className="pb-4 text-s leading-[1.35] text-[var(--ink-2)]">{p.title}</p>
      </div>
      <div className="p-4">
        <p className="t-head text-m leading-[1.25]">{pitch.headline}</p>
        <p className="mt-1.5 text-s leading-[1.45] text-[var(--ink-2)]">{pitch.line}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-m font-bold">{`₹${p.price}`}</span>
          <span className="btn btn-blue h-10 px-5 [--btn-fs:14px]">{pitch.cta}</span>
        </div>
        <p className="mt-3 text-s text-[var(--muted)]">Instant email delivery, 7-day refund</p>
      </div>
    </Link>
  );
}

/** What an advertiser's slot looks like, shown until a real ad is booked. */
function SampleAd() {
  return (
    <div aria-hidden className="overflow-hidden rounded-[16px] bg-white shadow-[0_0_0_1px_var(--line-2)] [@media(max-height:800px)]:hidden">
      <div className="flex h-[88px] items-center justify-center bg-[#e9edff]">
        <svg viewBox="0 0 64 40" className="h-9 w-14 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="56" height="32" rx="6" />
          <path d="M4 28l16-12 12 9 10-7 18 12" />
        </svg>
      </div>
      <div className="p-3 text-left">
        <p className="text-s font-bold leading-[1.3]">Your course, app or book</p>
        <p className="mt-0.5 text-s leading-[1.4] text-[var(--muted)]">A headline that makes an aspirant stop scrolling.</p>
        <span className="mt-2.5 inline-flex h-8 items-center rounded-full bg-[var(--ink)] px-3.5 text-s font-bold text-white">Learn more</span>
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
    <div className={`${card} relative p-3.5`}>
      <span className="absolute right-3.5 top-3.5 z-10 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--muted)] shadow-[0_0_0_1px_var(--line-2)]">Sample ad</span>
      <SampleAd />
      <p className="mt-3 text-s leading-[1.45] text-[var(--ink-2)]">This is how your ad would look here, on every page, in front of UPSC aspirants.</p>
      <Link href="/advertise" data-track="rail-ad-slot" data-track-page={page} className="mt-2 inline-block text-s font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]">
        Advertise with us
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
