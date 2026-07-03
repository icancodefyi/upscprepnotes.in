"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  IconArrowLeft,
  IconShoppingCart,
  IconStarFilled,
  IconShoppingBag,
  IconUsers,
} from "@tabler/icons-react";
import { ArrowRight, ChevronDown } from "lucide-react";
import PayButton from "@/components/ui/PayButton";
import { StoreProduct, PRODUCTS, ProductReview } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import CartIcon from "./CartIcon";
import { TOPPERS } from "@/components/topper/sales-page-data";
import FakePurchaseToast from "./FakePurchaseToast";

export default function ProductDetailClient({ product }: { product: StoreProduct }) {
  return (
    <CartProvider>
      <ProductDetailInner product={product} />
    </CartProvider>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[11px] uppercase tracking-[0.3em] text-gray-400">{children}</span>
      <span className="h-px flex-1 bg-gray-200" />
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
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-20">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/store"
            data-track="detail-back-to-store"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <IconArrowLeft size={14} />
            Back to Store
          </Link>
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        {/* Breadcrumb-style title row */}
        <div className="mb-6 flex items-center gap-3 text-xs text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-black transition-colors">Store</Link>
          <span>/</span>
          <span className="font-medium text-gray-600">{product.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
          {/* Left: Image + content */}
          <div className="lg:col-span-7">
            {/* Product image */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white">
              {product.images ? (
                <ImageCarousel images={product.images} title={product.title} />
              ) : product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full max-h-[480px] object-contain object-top bg-gray-50"
                />
              ) : (
                <div className={`flex h-64 items-center justify-center ${product.gradient}`}>
                  <div className="text-center text-white">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" className="opacity-70">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    {product.comingSoon && (
                      <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/60">Coming Soon</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile purchase card */}
            <div className="mt-6 lg:hidden">
              <PurchaseCard product={product} onAddToCart={handleAddToCart} />
            </div>

            {/* Specs grid — tight, info-dense */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-8">
                <SectionLabel>Product Details</SectionLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="rounded-xl border-2 border-gray-200 bg-white p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">{spec.label}</p>
                      <p className="mt-1 text-sm font-bold text-gray-900">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <div className="mt-8">
              <SectionLabel>About this product</SectionLabel>
              <div className="space-y-4">
                {product.longDescription.map((para, i) => (
                  <p key={i} className="text-sm leading-7 text-gray-600">{para}</p>
                ))}
              </div>
            </div>

            {/* Highlights — bold value props */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-8">
                <SectionLabel>Why buy this</SectionLabel>
                <div className="space-y-3">
                  {product.highlights.map((hl) => (
                    <div key={hl.label} className="flex items-start gap-3 rounded-xl border-2 border-gray-200 bg-white p-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C4F9D7] border border-black">
                        <span className="text-xs font-bold text-black">&#10003;</span>
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{hl.label}</p>
                        <p className="mt-0.5 text-sm text-gray-500">{hl.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer copies sample preview */}
            {product.slug === "answer-copies-compilation" && (
              <div className="mt-8">
                <SectionLabel>Sample Preview</SectionLabel>
                <p className="mb-4 text-sm text-gray-500">Actual answer sheets from 8 toppers included in this compilation</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TOPPERS.slice(0, 8).map((topper) => (
                    <a
                      key={topper.slug}
                      href={topper.previewImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 transition hover:border-black"
                    >
                      <img
                        src={topper.previewImageUrl}
                        alt={`${topper.name} answer copy preview`}
                        className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-[10px] font-semibold text-white leading-tight">{topper.name}</p>
                        <p className="text-[9px] text-white/70">{topper.rank} · {topper.year}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Features — bordered card */}
            {product.features.length > 0 && (
              <div className="mt-8">
                <SectionLabel>What&apos;s included</SectionLabel>
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="mt-0.5 shrink-0 text-emerald-500 font-bold">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* File list */}
            {product.files && product.files.length > 0 && (
              <div className="mt-8">
                <SectionLabel>Files in this bundle</SectionLabel>
                <p className="mb-3 text-sm text-gray-500">{product.fileCount} files · {product.totalSizeMB} MB total</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto rounded-2xl border-2 border-gray-200 bg-white p-4">
                  {product.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="truncate text-xs text-gray-600">{f.name}</span>
                      <span className="ml-2 shrink-0 text-[11px] text-gray-400">{f.sizeMB} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="mt-8">
                <SectionLabel>{`Customer Reviews (${reviews.length})`}</SectionLabel>
                <ReviewsBlock reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />
              </div>
            )}

            {/* Product FAQ */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="mt-8">
                <SectionLabel>Questions & Answers</SectionLabel>
                <div className="space-y-3">
                  {product.faqs.map((faq) => (
                    <details key={faq.q} className="group rounded-xl border-2 border-gray-200 bg-white p-4 hover:border-black transition-all">
                      <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                        <h3 className="text-sm font-bold leading-tight">{faq.q}</h3>
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 text-sm text-gray-500 leading-6">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee */}
            {!product.comingSoon && (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C4F9D7] border border-black">
                  <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">Instant preview after purchase</p>
                <p className="mt-1 text-xs text-gray-500">Every PDF opens in your browser. Download and keep forever.</p>
              </div>
            )}
          </div>

          {/* Right: Desktop purchase card (sticky) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-6">
              <PurchaseCard product={product} onAddToCart={handleAddToCart} />
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <SectionLabel>Related Products</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/store/${r.slug}`}
                  data-track={`detail-related-${r.slug}`}
                  className="group bg-white border-2 border-gray-200 hover:border-black transition-all flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-gray-200 bg-gray-50">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`flex h-full items-center justify-center ${r.gradient}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                    )}
                    {r.badge && (
                      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-black ${
                        r.badgeColor === "emerald" ? "bg-[#C4F9D7] text-black" :
                        r.badgeColor === "amber" ? "bg-amber-100 text-amber-900" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-1 flex-col">
                    <h3 className="text-sm font-bold leading-tight">{r.title}</h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">{r.tagline}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold">₹{r.price}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
      <FakePurchaseToast />
    </div>
  );
}

function PurchaseCard({ product, onAddToCart }: { product: StoreProduct; onAddToCart: () => void }) {
  const minPrice = product.minOfferPrice ?? product.price;
  const suggestedPrice = Math.round(product.price * 0.6);
  const [offerPrice, setOfferPrice] = useState(product.price);
  const clampedPrice = Math.max(minPrice, Math.min(offerPrice, product.price));
  const isDiscounted = clampedPrice < product.price;

  const quickPicks = [
    { label: `Min ₹${minPrice}`, value: minPrice },
    { label: `Fair ₹${suggestedPrice}`, value: suggestedPrice },
    { label: `Full ₹${product.price}`, value: product.price },
  ];

  return (
    <div className="relative">
      <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl bg-[#C4F9D7]" />
      <div className="relative rounded-2xl border-2 border-black bg-white p-6 shadow-xl">
        {product.badge && (
          <div className="mb-3">
            <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border border-black ${
              product.badgeColor === "emerald"
                ? "bg-[#C4F9D7] text-black"
                : product.badgeColor === "amber"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-gray-100 text-gray-700"
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{product.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{product.tagline}</p>

        {product.rating && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <IconStarFilled
                  key={s}
                  size={14}
                  className={s <= Math.round(product.rating!) ? "text-amber-400" : "text-gray-200"}
                />
              ))}
            </span>
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-gray-500">
            {product.reviewCount ? `${product.reviewCount} reviews · ` : ""}1,400+ students
          </span>
        </div>

        {/* Name your price — primary input */}
        {product.minOfferPrice ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Name your price</label>
              <span className="text-[11px] text-gray-400">min ₹{minPrice}</span>
            </div>
            <div className="flex items-stretch overflow-hidden rounded-xl border-2 border-black bg-white">
              <span className="flex items-center pl-4 text-2xl font-bold text-gray-900">₹</span>
              <input
                type="number"
                min={minPrice}
                max={product.price}
                value={offerPrice}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || minPrice;
                  setOfferPrice(val);
                }}
                onBlur={() => setOfferPrice(clampedPrice)}
                className="w-full px-2 py-3 text-3xl font-bold text-gray-900 outline-none"
              />
            </div>
            {/* Quick pick pills */}
            <div className="mt-2.5 flex gap-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick.value}
                  type="button"
                  onClick={() => setOfferPrice(pick.value)}
                  className={`flex-1 rounded-lg border-2 px-2 py-1.5 text-xs font-bold transition-all ${
                    clampedPrice === pick.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-black"
                  }`}
                >
                  {pick.label}
                </button>
              ))}
            </div>
            {product.originalPrice && (
              <p className="mt-2 text-xs text-gray-400">
                Listed at <span className="line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span> · pay what feels fair
              </p>
            )}
            {isDiscounted && (
              <p className="mt-1 text-xs font-semibold text-emerald-600">
                You save ₹{product.price - clampedPrice} ({Math.round((1 - clampedPrice / product.price) * 100)}% off)
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold tracking-tight">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {[
            { icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4", label: "Instant download" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "7-day refund" },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Lifetime access" },
            { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "1,400+ students" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
              </svg>
              <span className="text-[11px] font-medium text-gray-600">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        {product.comingSoon ? (
          <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-400">
            Coming Soon
          </div>
        ) : product.link ? (
          <div className="mt-6">
            <Link
              href={product.link}
              data-track={`detail-view-${product.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              View Full Product Details
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <PayButton
              amount={clampedPrice}
              items={[{ slug: product.slug, quantity: 1, price: clampedPrice }]}
              tracking={`buy-${product.slug}`}
              offeredPrice={isDiscounted ? clampedPrice : undefined}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-4 text-base font-bold text-white transition hover:bg-gray-800 active:scale-[0.97]"
            >
              <IconShoppingCart size={18} />
              {`Pay ₹${clampedPrice}`}
            </PayButton>
            <button
              type="button"
              data-track={`detail-addtocart-${product.slug}`}
              onClick={onAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
            >
              <IconShoppingBag size={16} />
              Add to Cart
            </button>
          </div>
        )}

        <div className="mt-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-emerald-800">7-Day Money-Back Guarantee</p>
              <p className="text-[11px] text-emerald-600">Not satisfied? Get a full refund within 7 days.</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Secure payment · PDF delivered instantly
        </p>
      </div>
    </div>
  );
}

function ReviewsBlock({ reviews, rating, reviewCount }: { reviews: ProductReview[]; rating: number | null; reviewCount: number | null }) {
  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-6 rounded-2xl border-2 border-gray-200 bg-white p-5 mb-4">
        <div className="text-center">
          <p className="text-4xl font-bold tracking-tight">{rating || "—"}</p>
          <div className="mt-1 flex items-center justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconStarFilled
                key={s}
                size={14}
                className={s <= Math.round(rating || 0) ? "text-amber-400" : "text-gray-200"}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">{reviewCount || reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3].map((star) => {
            const pct = star === 5 ? 85 : star === 4 ? 12 : 3;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{star}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-xl border-2 border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                  <span className="text-xs font-bold text-gray-600">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{review.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <IconStarFilled
                          key={s}
                          size={10}
                          className={s <= review.rating ? "text-amber-400" : "text-gray-200"}
                        />
                      ))}
                    </span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
              </div>
              {review.verified && (
                <span className="rounded-full bg-[#C4F9D7] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-black text-black">
                  Verified Buyer
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-600 leading-6">{review.text}</p>
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
      <img
        src={images[active]}
        alt={`${title} - ${active + 1}`}
        className="w-full max-h-[480px] object-contain object-top bg-gray-50"
      />
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 border-t-2 border-gray-200 bg-white px-3 py-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-black opacity-100" : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <img src={img} alt={`${title} preview ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}