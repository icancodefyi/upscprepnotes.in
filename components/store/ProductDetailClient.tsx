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
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-16">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-800"
          >
            <IconArrowLeft size={15} />
            Back to Store
          </Link>
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left: Image */}
          <div className="lg:col-span-2">
            {product.image ? (
              <div className="overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full max-h-[500px] object-contain object-top"
                />
              </div>
            ) : (
              <div
                className={`relative flex h-64 items-center justify-center overflow-hidden rounded-xl sm:h-80 ${product.gradient}`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                {product.comingSoon ? (
                  <div className="relative text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                      <span className="text-3xl font-black tracking-tight text-white">?</span>
                    </div>
                    <p className="mt-3 text-sm font-bold uppercase tracking-widest text-white/60">Coming Soon</p>
                  </div>
                ) : (
                  <div className="relative text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" className="opacity-70"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-3">
            {product.badge && (
              <span
                className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
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

            <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>
            <p className="mt-1.5 text-gray-500">{product.tagline}</p>

            {product.rating && (
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <IconStarFilled
                      key={s}
                      size={15}
                      className={s <= Math.round(product.rating!) ? "text-amber-400" : "text-gray-200"}
                    />
                  ))}
                </span>
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
              {product.longDescription.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-gray-500">{para}</p>
              ))}
            </div>

            {product.features.length > 0 && (
              <ul className="mt-4 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <IconCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* What's Included */}
            {product.files && product.files.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">What's Included</h3>
                <p className="mt-1 text-xs text-gray-400">
                  {product.fileCount} files · {product.totalSizeMB} MB total
                </p>
                <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {product.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-1.5">
                      <span className="truncate text-xs text-gray-600">{f.name}</span>
                      <span className="ml-3 shrink-0 text-[11px] text-gray-400">{f.sizeMB} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!product.files && product.fileCount && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">What's Included</h3>
                <p className="mt-1 text-sm text-gray-600">{product.fileCount} files · {product.totalSizeMB} MB total</p>
              </div>
            )}

            {product.comingSoon ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-400">
                Coming Soon
              </div>
            ) : product.link ? (
              <div className="mt-6">
                <Link
                  href={product.link}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500"
                >
                  View Full Product Details
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <PayButton
                    amount={product.payAmount}
                    note={product.payNote}
                    tracking={`buy-${product.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    <IconShoppingCart size={16} />
                    Buy Now — ₹{product.price}
                  </PayButton>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                  >
                    <IconShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  PDF delivered via WhatsApp after payment. 7-day refund.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-14 border-t border-gray-100 pt-8">
            <h2 className="text-base font-bold text-gray-900">Related Products</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/store/${r.slug}`}
                  className="group rounded-lg border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:shadow-sm"
                >
                  <div className={`flex h-24 items-center justify-center rounded-lg ${r.gradient}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-emerald-700">{r.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{r.tagline}</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">₹{r.price}</p>
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
