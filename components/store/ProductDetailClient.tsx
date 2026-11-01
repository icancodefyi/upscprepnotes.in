"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import PayButton from "@/components/ui/PayButton";
import { StoreProduct, PRODUCTS, ProductReview } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import CartIcon from "./CartIcon";
import { TOPPERS } from "@/components/topper/sales-page-data";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";
const fmt = (n: number) => n.toLocaleString("en-IN");

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

export default function ProductDetailClient({ product }: { product: StoreProduct }) {
  return (
    <CartProvider>
      <ProductDetailInner product={product} />
    </CartProvider>
  );
}

/** A section heading on the product page (the old uppercase labels, now plain headings with the same words). */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="t-head text-l">{title}</h2>
      <div className="mt-5">{children}</div>
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

function ProductDetailInner({ product }: { product: StoreProduct }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem } = useCart();
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && !p.comingSoon).slice(0, 3);
  useEffect(() => {
    posthog.capture("product_viewed", {
      product_slug: product.slug,
      product_title: product.title,
      product_price: product.price,
      product_category: product.category,
    });
  }, [product.slug, product.title, product.price, product.category]);

  function handleAddToCart() {
    addItem(product);
    setCartOpen(true);
    posthog.capture("add_to_cart", {
      product_slug: product.slug,
      product_title: product.title,
      product_price: product.price,
      product_category: product.category,
    });
  }

  const reviews = product.reviews || [];

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/store" data-track="detail-back-to-store" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
            ← Back to Store
          </Link>
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        <nav aria-label="Breadcrumb" className="t-meta mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/store" className="hover:text-[var(--ink)]">Store</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">{product.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: image + content */}
          <div className="min-w-0 lg:col-span-7">
            <div className={`${card} overflow-hidden`}>
              {product.images ? (
                <ImageCarousel images={product.images} title={product.title} />
              ) : product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image} alt={product.title} className="max-h-[480px] w-full bg-[var(--canvas)] object-contain object-top" />
              ) : (
                <div className="relative">
                  <Cover title={product.title} letter />
                  {product.comingSoon && <p className="absolute inset-x-0 bottom-6 text-center text-s font-bold text-[var(--muted)]">Coming Soon</p>}
                </div>
              )}
            </div>

            {/* Mobile purchase card */}
            <div className="mt-6 lg:hidden">
              <PurchaseCard product={product} onAddToCart={handleAddToCart} />
            </div>

            {product.specs && product.specs.length > 0 && (
              <Block title="Product Details">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className={`${card} p-4`}>
                      <p className="text-s text-[var(--muted)]">{spec.label}</p>
                      <p className="mt-1 text-m font-bold">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            <Block title="About this product">
              <div className="space-y-4">
                {product.longDescription.map((para, i) => (
                  <p key={i} className="text-m leading-[1.7] text-[var(--ink-2)]">{para}</p>
                ))}
              </div>
            </Block>

            {product.highlights && product.highlights.length > 0 && (
              <Block title="Why buy this">
                <div className="space-y-3">
                  {product.highlights.map((hl) => (
                    <div key={hl.label} className={`${card} flex items-start gap-3 p-4`}>
                      <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-s font-bold text-[var(--accent)]">&#10003;</span>
                      <div>
                        <p className="text-m font-bold">{hl.label}</p>
                        <p className="mt-0.5 text-s leading-[1.5] text-[var(--ink-2)]">{hl.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {product.slug === "answer-copies-compilation" && (
              <Block title="Sample Preview">
                <p className="mb-4 text-s text-[var(--ink-2)]">Actual answer sheets from 8 toppers included in this compilation</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TOPPERS.slice(0, 8).map((topper) => (
                    <a key={topper.slug} href={topper.previewImageUrl} target="_blank" rel="noopener noreferrer" className="group block">
                      <span className="paper block overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={topper.previewImageUrl} alt={`${topper.name} answer copy preview`} loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                      </span>
                      <span className="mt-2 block text-s font-bold leading-tight group-hover:text-[var(--accent)]">{topper.name}</span>
                      <span className="block text-s text-[var(--muted)]">{topper.rank} · {topper.year}</span>
                    </a>
                  ))}
                </div>
              </Block>
            )}

            {product.features.length > 0 && (
              <Block title="What's included">
                <div className={`${card} p-6`}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-s leading-[1.55] text-[var(--ink-2)]">
                        <span aria-hidden className="mt-0.5 shrink-0 font-bold text-[var(--accent)]">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Block>
            )}

            {product.sourceNote && (
              <Block title="Sources">
                <div className="rounded-[20px] bg-[var(--canvas)] p-5">
                  <p className="text-s leading-[1.6] text-[var(--ink-2)]">{product.sourceNote}</p>
                </div>
              </Block>
            )}

            {product.files && product.files.length > 0 && (
              <Block title="Files in this bundle">
                <p className="mb-3 text-s text-[var(--muted)]">{product.fileCount} files · {product.totalSizeMB} MB total</p>
                <div className={`${card} max-h-56 space-y-1.5 overflow-y-auto p-3`}>
                  {product.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-[10px] bg-[var(--canvas)] px-3 py-2">
                      <span className="truncate text-s text-[var(--ink-2)]">{f.name}</span>
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
                    <details key={faq.q} className="group px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-m font-bold leading-snug">{faq.q}</h3>
                        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                      </summary>
                      <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </Block>
            )}

            {!product.comingSoon && (
              <div className="mt-12 rounded-[20px] bg-[var(--canvas)] p-6 text-center">
                <p className="text-m font-bold">Instant preview after purchase</p>
                <p className="mt-1 text-s text-[var(--ink-2)]">Every PDF opens in your browser. Download and keep forever.</p>
              </div>
            )}
          </div>

          {/* Right: desktop purchase card (sticky) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-24">
              <PurchaseCard product={product} onAddToCart={handleAddToCart} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-[var(--line)] pt-12">
            <h2 className="t-head text-l">Related Products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/store/${r.slug}`} data-track={`detail-related-${r.slug}`} className={`${card} group flex flex-col p-3 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-1`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-[var(--canvas)]">
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image} alt={r.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    ) : (
                      <Cover title={r.title} letter />
                    )}
                    {r.badge && <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-s font-bold ${badgeCls(r.badgeColor)}`}>{r.badge}</span>}
                  </div>
                  <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                    <h3 className="text-m font-bold leading-snug group-hover:text-[var(--accent)]">{r.title}</h3>
                    <p className="mt-1 line-clamp-2 flex-1 text-s text-[var(--ink-2)]">{r.tagline}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="tab rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-m font-bold">₹{r.price}</span>
                      <span aria-hidden className="text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function PurchaseCard({ product, onAddToCart }: { product: StoreProduct; onAddToCart: () => void }) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2),0_18px_40px_-20px_rgba(11,12,16,0.35)]">
      {product.badge && <span className={`inline-block rounded-full px-3 py-1 text-s font-bold ${badgeCls(product.badgeColor)}`}>{product.badge}</span>}

      <h1 className={`t-head text-l ${product.badge ? "mt-3" : ""}`}>{product.title}</h1>
      <p className="mt-2 text-m leading-[1.5] text-[var(--ink-2)]">{product.tagline}</p>

      {product.rating && (
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} on={s <= Math.round(product.rating!)} />
            ))}
          </span>
          <span className="text-s font-bold">{product.rating}</span>
          <span className="text-s text-[var(--muted)]">({product.reviewCount} reviews)</span>
        </div>
      )}

      <p className="mt-2 flex items-center gap-2 text-s text-[var(--muted)]">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        {product.reviewCount ? `${product.reviewCount} reviews · ` : ""}1,400+ students
      </p>

      {/* Fixed price — one number, same everywhere */}
      <p className="mt-5">
        <span className="t-display tab text-l">₹{fmt(product.price)}</span>
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-2">
        {["Instant download", "7-day refund", "Lifetime access", "1,400+ students"].map((label) => (
          <li key={label} className="flex items-center gap-2 rounded-[12px] bg-[var(--canvas)] px-3 py-2 text-s text-[var(--ink-2)]">
            <span aria-hidden className="font-bold text-[var(--accent)]">&#10003;</span>
            {label}
          </li>
        ))}
      </ul>

      {product.comingSoon ? (
        <div className="mt-6 rounded-full bg-[var(--canvas)] py-3 text-center text-m font-bold text-[var(--muted)]">Coming Soon</div>
      ) : product.link ? (
        <Link href={product.link} data-track={`detail-view-${product.slug}`} className="btn btn-ink mt-6 w-full justify-center">
          View Full Product Details
        </Link>
      ) : (
        <div className="mt-6 space-y-2.5">
          <PayButton
            amount={product.price}
            items={[{ slug: product.slug, quantity: 1, price: product.price }]}
            tracking={`buy-${product.slug}`}
            className="btn btn-blue w-full justify-center"
          >
            Pay ₹{fmt(product.price)}
          </PayButton>
          <button type="button" data-track={`detail-addtocart-${product.slug}`} onClick={onAddToCart} className="btn btn-paper w-full justify-center">
            Add to Cart
          </button>
        </div>
      )}

      <div className="mt-5 rounded-[16px] bg-[#d4f1df] p-4">
        <p className="text-s font-bold text-[#14532d]">7-Day Money-Back Guarantee</p>
        <p className="mt-0.5 text-s text-[#14532d]/80">Not satisfied? Get a full refund within 7 days.</p>
      </div>
      <p className="mt-3 text-center text-s text-[var(--muted)]">Secure payment · PDF delivered instantly</p>
    </div>
  );
}

function ReviewsBlock({ reviews, rating, reviewCount }: { reviews: ProductReview[]; rating: number | null; reviewCount: number | null }) {
  return (
    <div>
      <div className={`${card} mb-4 flex items-center gap-6 p-5`}>
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

      <div className="space-y-3">
        {reviews.map((review, i) => (
          <div key={i} className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e9edff] text-s font-bold text-[var(--accent-deep)]">{review.name.charAt(0)}</div>
                <div>
                  <p className="text-s font-bold">{review.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} on={s <= review.rating} className="h-3 w-3" />
                      ))}
                    </span>
                    <span className="text-s text-[var(--muted)]">{review.date}</span>
                  </div>
                </div>
              </div>
              {review.verified && <span className="rounded-full bg-[#d4f1df] px-2.5 py-0.5 text-s font-bold text-[#14532d]">Verified Buyer</span>}
            </div>
            <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={`${title} - ${active + 1}`} className="max-h-[480px] w-full bg-[var(--canvas)] object-contain object-top" />
      {images.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--line)] px-3 py-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-12 w-10 shrink-0 overflow-hidden rounded-[8px] transition ${i === active ? "shadow-[0_0_0_2px_var(--accent)]" : "opacity-60 hover:opacity-90"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${title} preview ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
