"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconShoppingCart, IconCheck, IconStarFilled, IconShoppingBag } from "@tabler/icons-react";
import PayButton from "@/components/ui/PayButton";
import { StoreProduct, PRODUCTS } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import CartIcon from "./CartIcon";

export default function ProductDetailClient({ product }: { product: StoreProduct }) {
  return (
    <CartProvider>
      <ProductDetailInner product={product} />
    </CartProvider>
  );
}

function ProductDetailInner({ product }: { product: StoreProduct }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem } = useCart();
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && !p.comingSoon).slice(0, 3);

  function handleAddToCart() {
    addItem(product);
    setCartOpen(true);
  }

  return (
    <div className="mx-auto min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-3 pt-4 pb-16 sm:px-4 sm:pt-6">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <Link
            href="/store"
            data-track="detail-back-to-store"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-800 sm:text-sm"
          >
            <IconArrowLeft size={13} />
            Back to Store
          </Link>
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-10 lg:items-start">
          {/* Left: Image + content */}
          <div className="lg:col-span-3">
            {product.image ? (
              <div className="overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  width={464}
                  height={600}
                  className="w-full max-h-[300px] object-contain object-top sm:max-h-[500px]"
                />
              </div>
            ) : (
              <div
                className={`relative flex h-48 items-center justify-center overflow-hidden rounded-xl sm:h-80 ${product.gradient}`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                {product.comingSoon ? (
                  <div className="relative text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 sm:h-20 sm:w-20">
                      <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">?</span>
                    </div>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/60 sm:mt-3 sm:text-sm">Coming Soon</p>
                  </div>
                ) : (
                  <div className="relative text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm sm:h-24 sm:w-24">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" className="opacity-70 sm:w-13 sm:h-13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile purchase card (between image and content) */}
            <div className="mt-4 lg:hidden">
              <PurchaseCard product={product} onAddToCart={handleAddToCart} />
            </div>

            <div className="mt-6 sm:mt-8">
              <h2 className="text-sm font-bold text-gray-900 sm:text-base">About this product</h2>
              <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
                {product.longDescription.map((para, i) => (
                  <p key={i} className="text-xs leading-relaxed text-gray-500 sm:text-sm">{para}</p>
                ))}
              </div>
            </div>

            {product.features.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">What you get</h2>
                <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm sm:gap-2.5">
                      <IconCheck size={13} className="mt-0.5 shrink-0 text-emerald-600 sm:size-[15px]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.files && product.files.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">What's Included</h2>
                <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                  {product.fileCount} files · {product.totalSizeMB} MB total
                </p>
                <div className="mt-2 space-y-1 max-h-36 overflow-y-auto pr-1 sm:mt-3 sm:max-h-48 sm:space-y-1.5">
                  {product.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5">
                      <span className="truncate text-[11px] text-gray-600 sm:text-xs">{f.name}</span>
                      <span className="ml-2 shrink-0 text-[10px] text-gray-400 sm:ml-3 sm:text-[11px]">{f.sizeMB} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!product.files && product.fileCount && (
              <div className="mt-6 sm:mt-8">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">What's Included</h2>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">{product.fileCount} files · {product.totalSizeMB} MB total</p>
              </div>
            )}

            {!product.comingSoon && (
              <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center sm:mt-8 sm:p-5">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm sm:h-12 sm:w-12">
                  <svg className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-800 sm:text-sm">Instant preview after purchase</p>
                <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">Every PDF opens in your browser. Download and keep forever.</p>
              </div>
            )}
          </div>

          {/* Right: Desktop purchase card (hidden on mobile) */}
          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <PurchaseCard product={product} onAddToCart={handleAddToCart} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10 border-t border-gray-100 pt-6 sm:mt-14 sm:pt-8">
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">Related Products</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/store/${r.slug}`}
                  data-track={`detail-related-${r.slug}`}
                  className="group rounded-lg border border-gray-100 bg-white p-3 transition hover:border-gray-200 hover:shadow-sm sm:p-4"
                >
                  <div className={`flex h-16 items-center justify-center rounded-lg sm:h-24 ${r.gradient}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50 sm:w-6 sm:h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-900 group-hover:text-emerald-700 sm:mt-3 sm:text-sm">{r.title}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">{r.tagline}</p>
                  <p className="mt-1 text-xs font-bold text-gray-900 sm:text-sm">₹{r.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function PurchaseCard({ product, onAddToCart }: { product: StoreProduct; onAddToCart: () => void }) {
  return (
    <>
      {product.badge && (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:px-3 sm:py-1 sm:text-[11px] ${
            product.badgeColor === "emerald"
              ? "bg-emerald-50 text-emerald-700"
              : product.badgeColor === "amber"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {product.badge}
        </span>
      )}

      <h1 className="mt-2 text-xl font-bold text-gray-900 sm:mt-3 sm:text-3xl">{product.title}</h1>
      <p className="mt-1 text-xs text-gray-500 sm:mt-1.5 sm:text-sm">{product.tagline}</p>

      {product.rating && (
        <div className="mt-2 flex items-center gap-1.5 sm:mt-3 sm:gap-2">
          <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconStarFilled
                key={s}
                size={12}
                className={s <= Math.round(product.rating!) ? "text-amber-400" : "text-gray-200 sm:size-[15px]"}
              />
            ))}
          </span>
          <span className="text-xs font-medium text-gray-700 sm:text-sm">{product.rating}</span>
          <span className="text-xs text-gray-400 sm:text-sm">({product.reviewCount} reviews)</span>
        </div>
      )}

      <div className="mt-3 flex items-baseline gap-2 sm:mt-5 sm:gap-3">
        <span className="text-xl font-bold text-gray-900 sm:text-2xl">₹{product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-xs text-gray-400 line-through sm:text-sm">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 sm:px-2.5 sm:py-0.5 sm:text-xs">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
            </span>
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-5 sm:gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <svg className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[9px] font-medium text-gray-600 sm:text-[10px]">Instant download</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <svg className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[9px] font-medium text-gray-600 sm:text-[10px]">7-day refund</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <svg className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[9px] font-medium text-gray-600 sm:text-[10px]">Lifetime access</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <svg className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-[9px] font-medium text-gray-600 sm:text-[10px]">1,400+ students</span>
        </div>
      </div>

      {product.comingSoon ? (
        <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-400 sm:mt-6 sm:px-5 sm:py-2.5 sm:text-sm">
          Coming Soon
        </div>
      ) : product.link ? (
        <div className="mt-4 sm:mt-6">
          <Link
            href={product.link}
            data-track={`detail-view-${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 sm:px-6 sm:py-3 sm:text-sm"
          >
            View Full Product Details
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
          <PayButton
            amount={product.payAmount}
            items={[{ slug: product.slug, quantity: 1, price: product.price }]}
            tracking={`buy-${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 active:scale-[0.97] sm:px-6 sm:py-3 sm:text-sm"
          >
            <IconShoppingCart size={14} />
            Buy Now — ₹{product.price}
          </PayButton>
          <button
            type="button"
            data-track={`detail-addtocart-${product.slug}`}
            onClick={onAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900 sm:px-6 sm:py-3 sm:text-sm"
          >
            <IconShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      )}

      <p className="mt-2 text-center text-[9px] text-gray-400 sm:mt-3 sm:text-[10px]">
        Secure payment · PDF delivered instantly
      </p>
    </>
  );
}
