import Link from "next/link";
import { card } from "@/components/brand/ui";
import { getProductBySlug } from "@/lib/store-products";

const DEFAULT_PRODUCT = "answer-copies-compilation";

/**
 * The sidebar's selling space under "On this page": one product that fits the article,
 * then a clearly labelled slot that can be rented to an advertiser later.
 * Prices and images come from the store data, so they cannot drift from the product page.
 */
export default function SidebarPromo({ slug, productSlug }: { slug: string; productSlug?: string }) {
  const p = getProductBySlug(productSlug ?? DEFAULT_PRODUCT) ?? getProductBySlug(DEFAULT_PRODUCT);
  if (!p) return null;

  return (
    <>
      <Link
        href={`/store/${p.slug}`}
        data-track="sidebar-product"
        data-track-page={slug}
        className={`${card} group block overflow-hidden p-0 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}
      >
        <div className="flex gap-3.5 bg-[#fff8d6] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt="" width={64} height={84} loading="lazy" className="h-[84px] w-[64px] shrink-0 rounded-[10px] bg-white object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
          <div className="min-w-0">
            <p className="text-m font-bold leading-[1.25]">{p.title}</p>
            <p className="mt-1 text-s leading-[1.35] text-[var(--ink-2)]">{p.tagline}</p>
            <p className="mt-2 text-m font-bold">{`₹${p.price}`}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <span className="text-s text-[var(--muted)]">Instant email delivery, 7-day refund</span>
          <span className="btn btn-blue h-9 shrink-0 px-4 [--btn-fs:13px]">See it</span>
        </div>
      </Link>

      <Link
        href="/quiz"
        data-track="sidebar-quiz"
        data-track-page={slug}
        className={`${card} flex items-center gap-3 p-4 transition-colors hover:bg-[var(--canvas)]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/quiz/gilu-hello.png" alt="" width={44} height={48} loading="lazy" className="h-12 w-11 shrink-0 object-contain" />
        <span className="min-w-0">
          <span className="block text-m font-bold leading-[1.25]">Free daily Prelims quiz</span>
          <span className="block text-s text-[var(--muted)]">5 real questions, 2 minutes</span>
        </span>
      </Link>

      {/* Ad slot. Shown only on taller screens so the sticky sidebar never overflows. */}
      <aside aria-label="Advertisement" className="hidden rounded-[20px] border border-dashed border-[var(--line-2)] p-3.5 text-center [@media(min-height:940px)]:block">
        <p className="text-s text-[var(--muted)]">Ad space</p>
        <p className="mt-1 text-m font-bold leading-[1.3]">Your brand here</p>
        <p className="mt-1 text-s leading-[1.4] text-[var(--ink-2)]">Reach UPSC aspirants reading this guide.</p>
        <Link href="/advertise" data-track="sidebar-ad-slot" data-track-page={slug} className="mt-2 inline-block text-s font-bold text-[var(--accent)] underline underline-offset-[3px]">
          See how to advertise
        </Link>
      </aside>
    </>
  );
}
