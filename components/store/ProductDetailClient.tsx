"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import PayButton from "@/components/ui/PayButton";
import { StoreProduct, PRODUCTS, ProductReview } from "@/lib/store-products";
import { Paperclip } from "@/components/brand/Props";
import { fmt, folderOf, ProductCard, BuyButton, PayMethods, Sheet, pairOf } from "./Shelf";
import { TOPPERS } from "@/components/topper/sales-page-data";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

const BADGE: Record<string, string> = {
  amber: "bg-[var(--hl)] text-[var(--hl-ink)]",
  emerald: "bg-[#d4f1df] text-[#14532d]",
};
const badgeCls = (c?: string | null) => BADGE[c ?? ""] ?? "bg-[var(--canvas)] text-[var(--ink)]";

function Star({ on = true, className = "" }: { on?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${on ? "text-[var(--accent)]" : "text-[var(--line-2)]"} ${className}`} fill="currentColor" aria-hidden>
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
    </svg>
  );
}

function Tick({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function ProductDetailClient({ product }: { product: StoreProduct }) {
  return <ProductDetailInner product={product} />;
}

/** A section on the product page: one plain heading, then its content. */
function Block({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-16 scroll-mt-28">
      <h2 className="t-head text-l">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Cover({ title, letter }: { title: string; letter?: boolean }) {
  return (
    <div className="grid h-full min-h-64 w-full place-items-center bg-[var(--canvas)]">
      <span aria-label={title} className="t-display text-l text-[var(--muted)]">{letter ? title.charAt(0) : ""}</span>
    </div>
  );
}

type Shot = { src: string; alt: string; caption?: string };

/** Full-screen viewer for covers and sample sheets. Arrow keys step, Escape closes. */
function Lightbox({ shots, index, onClose, onStep }: { shots: Shot[]; index: number; onClose: () => void; onStep: (d: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onStep]);
  const shot = shots[index];
  return (
    <div role="dialog" aria-modal="true" aria-label={shot.alt} className="fixed inset-0 z-[100] flex flex-col bg-[rgba(11,12,16,0.88)] backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
        <p className="min-w-0 truncate text-s font-bold">{shot.caption ?? shot.alt}</p>
        <div className="flex items-center gap-3">
          {shots.length > 1 && <span className="tab text-s text-white/60">{index + 1} / {shots.length}</span>}
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt={shot.alt} onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full rounded-[6px] bg-white object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]" />
        {shots.length > 1 && (
          <>
            <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)] shadow-lg sm:left-6">←</button>
            <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); onStep(1); }} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)] shadow-lg sm:right-6">→</button>
          </>
        )}
      </div>
    </div>
  );
}

function useLightbox(shots: Shot[]) {
  const [open, setOpen] = useState<number | null>(null);
  const onClose = useCallback(() => setOpen(null), []);
  const onStep = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length]);
  const node = open !== null ? <Lightbox shots={shots} index={open} onClose={onClose} onStep={onStep} /> : null;
  return { show: setOpen, node };
}

/** The product's pages, laid on its folder: the active sheet large, the rest as a strip of thumbnails. */
function Gallery({ product }: { product: StoreProduct }) {
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const [active, setActive] = useState(0);
  const shots = images.map((src, i) => ({ src, alt: images.length > 1 ? `${product.title} - ${i + 1}` : product.title }));
  const lb = useLightbox(shots);

  if (!images.length) {
    return (
      <div className={`${card} relative overflow-hidden`}>
        <Cover title={product.title} letter />
        {product.comingSoon && <p className="absolute inset-x-0 bottom-6 text-center text-s font-bold text-[var(--muted)]">Coming Soon</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="grain relative overflow-hidden rounded-[28px] px-6 pb-8 pt-10 sm:px-12 sm:pb-12 sm:pt-14" style={{ background: folderOf(product) }}>
        {product.badge && <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-s font-bold shadow-[0_1px_2px_rgba(11,12,16,0.08)] ${badgeCls(product.badgeColor)}`}>{product.badge}</span>}
        <button type="button" onClick={() => lb.show(active)} aria-label="Zoom image" className="group relative mx-auto block w-full max-w-[400px] cursor-zoom-in">
          {images.length > 1 && <span aria-hidden className="paper absolute inset-0 translate-x-3 translate-y-2 rotate-[3deg] opacity-70" />}
          <span className="paper relative block overflow-hidden transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[active]} alt={shots[active].alt} className="aspect-[464/600] w-full bg-white object-contain object-top" />
          </span>
          <Paperclip className="absolute -top-6 left-8 h-16 w-8 rotate-[-6deg]" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-s font-bold text-[var(--ink)] opacity-0 shadow-[0_2px_8px_rgba(11,12,16,0.15)] transition-opacity group-hover:opacity-100">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4M11 8.5v5M8.5 11h5" /></svg>
            Zoom
          </span>
        </button>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-[72px] w-14 shrink-0 overflow-hidden rounded-[10px] bg-white transition ${i === active ? "shadow-[0_0_0_2px_var(--accent)]" : "opacity-60 shadow-[0_0_0_1px_var(--line-2)] hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${product.title} preview ${i + 1}`} className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
      {lb.node}
    </div>
  );
}

/** The eight sample sheets as real pages you can open and read. */
function SamplePreview() {
  const toppers = TOPPERS.slice(0, 8);
  const shots = toppers.map((t) => ({ src: t.previewImageUrl, alt: `${t.name} answer copy preview`, caption: `${t.name} · ${t.rank} · ${t.year}` }));
  const lb = useLightbox(shots);
  return (
    <>
      <p className="-mt-3 mb-6 text-m text-[var(--ink-2)]">Actual answer sheets from 8 toppers included in this compilation</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
        {toppers.map((topper, i) => (
          <a
            key={topper.slug}
            href={topper.previewImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              lb.show(i);
            }}
            className="group block"
          >
            <span className={`paper block overflow-hidden transition-transform duration-300 ease-[var(--ease)] group-hover:-translate-y-1 group-hover:rotate-0 ${i % 2 ? "rotate-[1deg]" : "rotate-[-1deg]"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topper.previewImageUrl} alt={`${topper.name} answer copy preview`} loading="lazy" className="aspect-[3/4] w-full object-cover object-top" />
            </span>
            <span className="mt-3 block text-s font-bold leading-tight group-hover:text-[var(--accent)]">{topper.name}</span>
            <span className="block text-s text-[var(--muted)]">{topper.rank} · {topper.year}</span>
          </a>
        ))}
      </div>
      {lb.node}
    </>
  );
}

function ProductDetailInner({ product }: { product: StoreProduct }) {
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && !p.comingSoon).slice(0, 3);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    posthog.capture("product_viewed", {
      product_slug: product.slug,
      product_title: product.title,
      product_price: product.price,
      product_category: product.category,
    });
  }, [product.slug, product.title, product.price, product.category]);

  // Mobile: once the purchase card scrolls away, a slim bar keeps price and Add to Cart in reach.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reviews = product.reviews || [];
  const buyable = !product.comingSoon && !product.link;

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1180px] px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="t-meta flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/store" className="hover:text-[var(--ink)]">Store</Link>
            <span aria-hidden>/</span>
            <span className="truncate text-[var(--ink-2)]">{product.title}</span>
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/store" data-track="detail-back-to-store" className="hidden text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)] sm:inline">
              ← Back to Store
            </Link>
          </div>
        </div>
        <Link href="/store" data-track="detail-back-to-store" className="mt-2 inline-block text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)] sm:hidden">
          ← Back to Store
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: gallery + content */}
          <div className="min-w-0 lg:col-span-7">
            <Gallery product={product} />

            {/* Mobile purchase card */}
            <div ref={buyRef} className="mt-6 lg:hidden">
              <PurchaseCard product={product} />
            </div>

            {product.specs && product.specs.length > 0 && (
              <Block title="Product Details">
                <dl className={`${card} grid grid-cols-2 sm:grid-cols-4`}>
                  {product.specs.map((spec, i) => (
                    <div key={spec.label} className={`p-5 ${i % 2 ? "border-l border-[var(--line)]" : ""} ${i >= 2 ? "border-t border-[var(--line)] sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
                      <dt className="text-s text-[var(--muted)]">{spec.label}</dt>
                      <dd className="mt-1 text-m font-bold leading-snug">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            )}

            {product.slug === "answer-copies-compilation" && (
              <Block title="Sample Preview" id="preview">
                <SamplePreview />
              </Block>
            )}

            <Block title="About this product">
              <div className="space-y-4">
                {product.longDescription.map((para, i) => (
                  <p key={i} className="text-m leading-[1.75] text-[var(--ink-2)]">{para}</p>
                ))}
              </div>
            </Block>

            {product.highlights && product.highlights.length > 0 && (
              <Block title="Why buy this">
                <ol className={`${card} divide-y divide-[var(--line)]`}>
                  {product.highlights.map((hl, i) => (
                    <li key={hl.label} className="flex items-start gap-4 p-5 sm:px-6">
                      <span aria-hidden className="tab grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-m font-bold text-[var(--accent)]">{i + 1}</span>
                      <div>
                        <p className="text-m font-bold leading-snug">{hl.label}</p>
                        <p className="mt-0.5 text-m leading-[1.55] text-[var(--ink-2)]">{hl.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Block>
            )}

            {product.features.length > 0 && (
              <Block title="What's included">
                <ul className="paper grid gap-x-8 gap-y-4 rounded-[20px] p-6 sm:grid-cols-2 sm:p-8">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-m leading-[1.5] text-[var(--ink-2)]">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white">
                        <Tick className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {product.sourceNote && (
              <Block title="Sources">
                <div className="relative rounded-[20px] bg-[#fffbea] p-6 pt-7 shadow-[0_0_0_1px_rgba(92,74,0,0.12)]">
                  <Paperclip className="absolute -top-5 right-8 h-14 w-7 rotate-[6deg]" />
                  <p className="text-m leading-[1.65] text-[var(--ink-2)]">{product.sourceNote}</p>
                </div>
              </Block>
            )}

            {product.files && product.files.length > 0 && (
              <Block title="Files in this bundle">
                <p className="-mt-3 mb-4 text-s text-[var(--muted)]">{product.fileCount} files · {product.totalSizeMB} MB total</p>
                <div className={`${card} max-h-80 overflow-y-auto`}>
                  {product.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-3 last:border-b-0">
                      <span className="flex min-w-0 items-center gap-3">
                        <span aria-hidden className="grid h-8 w-7 shrink-0 place-items-center rounded-[4px] bg-[#ffe9e6] text-[10px] font-bold text-[var(--mark-deep)]">PDF</span>
                        <span className="truncate text-s text-[var(--ink-2)]">{f.name}</span>
                      </span>
                      <span className="tab shrink-0 text-s text-[var(--muted)]">{f.sizeMB} MB</span>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {reviews.length > 0 && (
              <Block title={`Customer Reviews (${reviews.length})`}>
                <ReviewsBlock reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />
              </Block>
            )}

            {product.faqs && product.faqs.length > 0 && (
              <Block title="Questions & Answers">
                <div className={`${card} divide-y divide-[var(--line)]`}>
                  {product.faqs.map((faq) => (
                    <details key={faq.q} className="group px-6 py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-m font-bold leading-snug">{faq.q}</h3>
                        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                      </summary>
                      <p className="mt-3 text-m leading-[1.65] text-[var(--ink-2)]">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </Block>
            )}

            {!product.comingSoon && (
              <div className="mt-16 flex items-center gap-4 rounded-[24px] bg-[#e9edff] p-6">
                <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[var(--accent)] shadow-[0_0_0_1px_var(--line)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></svg>
                </span>
                <div>
                  <p className="text-m font-bold">Instant preview after purchase</p>
                  <p className="mt-0.5 text-s text-[var(--ink-2)]">Every PDF opens in your browser. Download and keep forever.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: desktop purchase card, stays in view while you read */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-24">
              <PurchaseCard product={product} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="t-head text-l">Related Products</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {related.map((r, i) => (
                <ProductCard key={r.slug} product={r} track={`detail-related-${r.slug}`} className={i === 2 ? "col-span-2 lg:col-span-1" : ""} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile buy bar */}
      {buyable && (
        <div
          aria-hidden={!showBar}
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 px-4 pt-3 backdrop-blur transition-transform duration-300 ease-[var(--ease)] [padding-bottom:calc(env(safe-area-inset-bottom,0px)+12px)] lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="mx-auto flex max-w-[560px] items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-s font-bold">{product.title}</p>
              <p className="tab text-m font-bold">₹{fmt(product.price)}</p>
            </div>
            <div className="shrink-0">
              <BuyButton product={product} label={`Pay ₹${fmt(product.price)}`} className="btn btn-blue h-12 px-6 [--btn-fs:15px]" track={`mobilebar-buy-${product.slug}`} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/** "Buy both": this product with its natural partner, in one checkout. */
function BuyBoth({ product }: { product: StoreProduct }) {
  const other = pairOf(product);
  if (!other) return null;
  const total = product.price + other.price;
  return (
    <div className="mt-6 rounded-[20px] bg-[var(--canvas)] p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-[72px] shrink-0">
          <Sheet product={product} className="absolute left-0 top-1 w-11 rotate-[-6deg]" />
          <Sheet product={other} className="absolute right-0 top-0 w-11 rotate-[5deg]" />
        </div>
        <div className="min-w-0">
          <p className="text-s text-[var(--muted)]">Students also pick up</p>
          <Link href={`/store/${other.slug}`} className="block text-s font-bold leading-snug hover:text-[var(--accent)]">
            {other.title} · ₹{fmt(other.price)}
          </Link>
        </div>
      </div>
      <PayButton
        amount={total}
        items={[
          { slug: product.slug, quantity: 1, price: product.price },
          { slug: other.slug, quantity: 1, price: other.price },
        ]}
        tracking={`buyboth-${product.slug}-${other.slug}`}
        className="btn btn-ink mt-3 h-11 w-full justify-center [--btn-fs:14px]"
      >
        Buy both · ₹{fmt(total)}
      </PayButton>
    </div>
  );
}

function PurchaseCard({ product }: { product: StoreProduct }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2),0_24px_56px_-24px_rgba(11,12,16,0.35)] sm:p-7">
      {product.badge && <span className={`inline-block rounded-full px-3 py-1 text-s font-bold ${badgeCls(product.badgeColor)}`}>{product.badge}</span>}

      <h1 className={`t-display text-l ${product.badge ? "mt-4" : ""}`}>{product.title}</h1>
      <p className="mt-2 text-m leading-[1.5] text-[var(--ink-2)]">{product.tagline}</p>

      {product.rating && (
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} on={s <= Math.round(product.rating!)} className="h-4 w-4" />
            ))}
          </span>
          <span className="text-s font-bold">{product.rating}</span>
          <a href="#reviews" className="text-s text-[var(--muted)] underline-offset-2 hover:underline">({product.reviewCount} reviews)</a>
        </div>
      )}

      <p className="mt-2 flex items-center gap-2 text-s text-[var(--muted)]">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        {product.reviewCount ? `${product.reviewCount} reviews · ` : ""}1,400+ students
      </p>

      {/* Fixed price — one number, same everywhere */}
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-6">
        <p>
          <span className="t-display tab inline-block -rotate-1 rounded-[8px] bg-[var(--hl)] px-2.5 py-0.5 text-l leading-tight">₹{fmt(product.price)}</span>
        </p>
        <p className="pb-1 text-s text-[var(--muted)]">Secure payment · PDF delivered instantly</p>
      </div>

      {product.comingSoon ? (
        <div className="mt-6 rounded-full bg-[var(--canvas)] py-3 text-center text-m font-bold text-[var(--muted)]">Coming Soon</div>
      ) : product.link ? (
        <Link href={product.link} data-track={`detail-view-${product.slug}`} className="btn btn-ink mt-6 w-full justify-center">
          View Full Product Details
        </Link>
      ) : (
        <div className="mt-6 space-y-3">
          <PayButton
            amount={product.price}
            items={[{ slug: product.slug, quantity: 1, price: product.price }]}
            tracking={`buy-${product.slug}`}
            className="btn btn-blue w-full justify-center"
          >
            Pay ₹{fmt(product.price)}
          </PayButton>
          <PayMethods className="justify-center pt-1" />
        </div>
      )}

      {!product.comingSoon && !product.link && <BuyBoth product={product} />}

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {["Instant download", "7-day refund", "Lifetime access", "1,400+ students"].map((label) => (
          <li key={label} className="flex items-center gap-2 text-s text-[var(--ink-2)]">
            <Tick className="text-[var(--accent)]" />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-start gap-3 rounded-[18px] bg-[#d4f1df] p-4">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[#14532d]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
          <path d="M8.5 12l2.5 2.5 4.5-4.5" />
        </svg>
        <div>
          <p className="text-s font-bold text-[#14532d]">7-Day Money-Back Guarantee</p>
          <p className="mt-0.5 text-s text-[#14532d]/80">Not satisfied? Get a full refund within 7 days.</p>
        </div>
      </div>
    </div>
  );
}

function ReviewsBlock({ reviews, rating, reviewCount }: { reviews: ProductReview[]; rating: number | null; reviewCount: number | null }) {
  return (
    <div id="reviews" className="scroll-mt-28">
      <div className={`${card} mb-4 flex items-center gap-6 p-6`}>
        <div className="text-center">
          <p className="t-display tab text-l">{rating || "—"}</p>
          <div className="mt-1 flex items-center justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} on={s <= Math.round(rating || 0)} />
            ))}
          </div>
          <p className="mt-1 text-s text-[var(--muted)]">{reviewCount || reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3].map((star) => {
            const pct = star === 5 ? 85 : star === 4 ? 12 : 3;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="tab w-3 text-s text-[var(--muted)]">{star}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--canvas)]">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                </div>
                <span className="tab w-9 text-right text-s text-[var(--muted)]">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {reviews.map((review, i) => (
          <div key={i} className={`${card} flex flex-col p-5 ${reviews.length % 2 === 1 && i === reviews.length - 1 ? "sm:col-span-2" : ""}`}>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} on={s <= review.rating} />
              ))}
            </div>
            <p className="mt-3 flex-1 text-m leading-[1.6] text-[var(--ink)]">{review.text}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e9edff] text-s font-bold text-[var(--accent-deep)]">{review.name.charAt(0)}</div>
                <div>
                  <p className="text-s font-bold">{review.name}</p>
                  <p className="text-s text-[var(--muted)]">{review.date}</p>
                </div>
              </div>
              {review.verified && <span className="rounded-full bg-[#d4f1df] px-2.5 py-0.5 text-s font-bold text-[#14532d]">Verified Buyer</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
