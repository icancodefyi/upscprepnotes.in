"use client";

import { useState } from "react";
import Link from "next/link";
import type { Institute, StoreProduct } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import { getEffectivePrice, isFlashSaleActive } from "@/lib/flash-sale";
import CartSlideover from "@/components/store/CartSlideover";
import CartIcon from "@/components/store/CartIcon";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export default function InstitutePageClient({ institute, products }: { institute: Institute; products: StoreProduct[] }) {
  return (
    <CartProvider>
      <InstituteContent institute={institute} products={products} />
    </CartProvider>
  );
}

function InstituteContent({ institute, products }: { institute: Institute; products: StoreProduct[] }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart(product: StoreProduct) {
    addItem(product);
    setCartOpen(true);
  }

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/store" data-track="institute-back-to-store" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
            ← Back to Store
          </Link>
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        {/* Institute header */}
        <header className="mt-8 flex items-center gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[20px] bg-white text-l font-bold shadow-[0_0_0_1px_var(--line-2)]">
            {institute.logo.startsWith("/") || institute.logo.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={institute.logo} alt={institute.name} className="h-full w-full object-contain p-2" />
            ) : (
              institute.logo
            )}
          </div>
          <div className="min-w-0">
            <h1 className="t-display text-h1">{institute.name}</h1>
            <p className="mt-2 text-m text-[var(--ink-2)]">{institute.description}</p>
            <p className="mt-0.5 text-s text-[var(--muted)]">{products.length} products</p>
          </div>
        </header>

        {/* Products */}
        <h2 className="t-head mt-12 text-l">Products</h2>
        {products.length === 0 ? (
          <div className="mt-5 grid min-h-[200px] place-items-center rounded-[24px] bg-[var(--canvas)]">
            <p className="text-m text-[var(--muted)]">No products available yet.</p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>
        )}
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: StoreProduct; onAddToCart: () => void }) {
  return (
    <div className={`${card} group flex flex-col p-3`}>
      <div className="relative grid h-40 place-items-center rounded-[16px] bg-[#e9edff] px-4 text-center">
        <span className="t-head text-l text-[var(--accent-deep)]">{product.title.split(" ").slice(0, 2).join(" ")}</span>
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-0.5 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)]">{product.badge}</span>}
        {product.originalPrice && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--hl)] px-2.5 py-0.5 text-s font-bold text-[var(--hl-ink)]">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="text-m font-bold leading-snug" data-track={`institute-card-${product.slug}`}>{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-s text-[var(--ink-2)]">{product.tagline}</p>
        <div className="flex-1" />
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="tab text-m font-bold">{isFlashSaleActive() ? `₹${getEffectivePrice(product)}` : `₹${product.price}`}</span>
          {isFlashSaleActive() && product.price > 99 ? (
            <span className="tab text-s text-[var(--muted)] line-through">₹{product.price.toLocaleString("en-IN")}</span>
          ) : product.originalPrice ? (
            <span className="tab text-s text-[var(--muted)] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          ) : null}
        </div>
        <button type="button" data-track={`institute-addtocart-${product.slug}`} onClick={onAddToCart} className="btn btn-ink mt-3 h-10 w-full justify-center [--btn-fs:14px]">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
