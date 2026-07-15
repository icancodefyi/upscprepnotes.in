"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconShoppingCart, IconStarFilled } from "@tabler/icons-react";
import type { Institute, StoreProduct } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "@/components/store/CartSlideover";
import CartIcon from "@/components/store/CartIcon";

export default function InstitutePageClient({
  institute,
  products,
}: {
  institute: Institute;
  products: StoreProduct[];
}) {
  return (
    <CartProvider>
      <InstituteContent institute={institute} products={products} />
    </CartProvider>
  );
}

function InstituteContent({
  institute,
  products,
}: {
  institute: Institute;
  products: StoreProduct[];
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart(product: StoreProduct) {
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
            data-track="institute-back-to-store"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground/80"
          >
            <IconArrowLeft size={15} />
            Back to Store
          </Link>
          <CartIcon onClick={() => setCartOpen(true)} />
        </div>

        {/* Institute header */}
        <div className={`relative mb-8 flex items-center gap-5 rounded-xl ${institute.gradient} p-6 sm:p-8`}>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/20 text-xl font-bold text-white backdrop-blur-sm">
            {institute.logo.startsWith("/") ? (
              <img src={institute.logo} alt={institute.name} className="h-full w-full object-contain p-2" />
            ) : (
              institute.logo
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{institute.name}</h1>
            <p className="mt-1 text-sm text-white/70">{institute.description}</p>
            <p className="mt-0.5 text-xs text-white/50">{products.length} products</p>
          </div>
        </div>

        {/* Products */}
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Products</h2>
        {products.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No products available yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: StoreProduct;
  onAddToCart: () => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:border-border hover:shadow-sm">
      <div className={`relative flex h-40 items-center justify-center ${product.gradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative text-center px-4">
          <span className="text-2xl font-black text-white drop-shadow-sm">{product.title.split(" ").slice(0, 2).join(" ")}</span>
        </div>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-foreground/70 shadow-sm">
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand shadow-sm">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-foreground leading-snug" data-track={`institute-card-${product.slug}`}>{product.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{product.tagline}</p>
        <div className="flex-1" />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          data-track={`institute-addtocart-${product.slug}`}
          onClick={onAddToCart}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-gray-900 py-2 text-xs font-semibold text-white transition hover:bg-brand"
        >
          <IconShoppingCart size={13} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
