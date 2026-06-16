"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconShoppingCart,
  IconStarFilled,
  IconSearch,
} from "@tabler/icons-react";
import { PRODUCTS } from "@/lib/store-products";
import type { ProductCategory } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import CartIcon from "./CartIcon";

type CategoryTab = "all" | "original" | "notes-bundle" | "teacher-brand" | "test-series" | "optional";

const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "notes-bundle", label: "Notes Bundles" },
  { key: "teacher-brand", label: "By Teachers" },
  { key: "test-series", label: "Test Series" },
  { key: "optional", label: "Optionals" },
  { key: "original", label: "Originals" },
];

export default function StoreClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryTab>("all");
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(
    () =>
      category === "all"
        ? PRODUCTS.filter((p) => !p.comingSoon)
        : PRODUCTS.filter((p) => p.category === category && !p.comingSoon),
    [category]
  );

  const groupedByCategory = useMemo(() => {
    if (category !== "all") return null;
    const groups: { label: string; products: typeof PRODUCTS }[] = [];
    const order: ProductCategory[] = ["notes-bundle", "teacher-brand", "test-series", "optional", "original"];
    const labels: Record<ProductCategory, string> = {
      "notes-bundle": "Notes Bundles",
      "teacher-brand": "By Teachers",
      "test-series": "Test Series",
      "optional": "Optionals",
      "original": "Originals",
    };
    for (const key of order) {
      const prods = visibleProducts.filter((p) => p.category === key);
      if (prods.length) groups.push({ label: labels[key], products: prods });
    }
    return groups;
  }, [category, visibleProducts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <CartProvider>
      <div className="mx-auto min-h-screen bg-white">
        {/* ─── Store Header ─── */}
        <div className="border-b border-gray-100">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Store</h1>
              <p className="text-sm text-gray-400">{PRODUCTS.filter((p) => !p.comingSoon).length} products</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <IconSearch size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  data-track="store-search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-40 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none transition focus:w-56 focus:border-gray-300 focus:bg-white"
                />
              </div>
              <CartIcon onClick={() => setCartOpen(true)} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {filtered ? (
            <>
              {filtered.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-sm text-gray-400">No products match your search.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.slug} product={product} onAddedToCart={() => setCartOpen(true)} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* ─── Category Tabs ─── */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    data-track={`store-tab-${tab.key}`}
                    onClick={() => setCategory(tab.key)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      category === tab.key
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ─── Product Grid ─── */}
              {category === "all" && groupedByCategory ? (
                <>
                  {groupedByCategory.map((group) => (
                    <section key={group.label} className="mb-10">
                      <h2 className="text-base font-bold text-gray-900 mb-3">
                        {group.label}{" "}
                        <span className="font-normal text-gray-400">({group.products.length})</span>
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {group.products.map((product) => (
                          <ProductCard key={product.slug} product={product} onAddedToCart={() => setCartOpen(true)} />
                        ))}
                      </div>
                    </section>
                  ))}
                </>
              ) : (
                <section>
                  <h2 className="text-base font-bold text-gray-900 mb-3">
                    {CATEGORY_TABS.find((t) => t.key === category)?.label}{" "}
                    <span className="font-normal text-gray-400">({visibleProducts.length})</span>
                  </h2>
                  {visibleProducts.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-200">
                      <p className="text-sm text-gray-400">No products in this category yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {visibleProducts.map((product) => (
                        <ProductCard key={product.slug} product={product} onAddedToCart={() => setCartOpen(true)} />
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* ─── Footer note ─── */}
          <div className="mt-12 border-t border-gray-100 pt-8 text-center">
            <p className="text-xs text-gray-400">
              Instant download after payment. 7-day refund guarantee.
            </p>
          </div>
        </div>
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  );
}

function ProductCard({
  product,
  onAddedToCart,
}: {
  product: (typeof PRODUCTS)[number];
  onAddedToCart: () => void;
}) {
  const { addItem } = useCart();
  const comingSoon = product.comingSoon;

  function handleAddToCart() {
    addItem(product);
    onAddedToCart();
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:border-gray-200 hover:shadow-sm">
      {/* Product Image */}
      <Link href={comingSoon ? "#" : `/store/${product.slug}`} tabIndex={comingSoon ? -1 : undefined} className="block" data-track={`store-card-img-${product.slug}`}>
        {product.image ? (
          <div className="relative h-44 overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
            />
            {product.badge && (
              <span
                className={`absolute left-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                  product.badgeColor === "emerald"
                    ? "bg-emerald-600 text-white"
                    : product.badgeColor === "amber"
                    ? "bg-amber-500 text-white"
                    : "bg-white/30 text-white"
                }`}
              >
                {product.badge}
              </span>
            )}
            {product.originalPrice && (
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shadow-sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        ) : (
          <div className={`relative flex h-44 items-center justify-center ${product.gradient}`} data-track={`store-card-img-${product.slug}`}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

            {comingSoon ? (
              <div className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <span className="text-xl font-black tracking-tight text-white">?</span>
                </div>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-white/50">Coming Soon</p>
              </div>
            ) : (
              <div className="relative px-3 text-center">
                {product.slug === "top-10-rankers-strategy" && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span key={n} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs font-bold text-white backdrop-blur-sm">{n}</span>
                    ))}
                  </div>
                )}
                {product.slug === "all-strategy-reports" && (
                  <div className="text-center">
                    <span className="text-3xl font-black text-white drop-shadow-sm">280+</span>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-white/70">Reports</p>
                  </div>
                )}
                {product.slug === "answer-copies-compilation" && (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center gap-0.5">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="-ml-2 opacity-60"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white">50+ Answer Copies</p>
                  </div>
                )}
              </div>
            )}

            {product.badge && (
              <span
                className={`absolute left-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                  product.badgeColor === "emerald"
                    ? "bg-emerald-600 text-white"
                    : product.badgeColor === "amber"
                    ? "bg-amber-500 text-white"
                    : "bg-white/30 text-white"
                }`}
              >
                {product.badge}
              </span>
            )}

            {product.originalPrice && (
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shadow-sm">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <Link href={comingSoon ? "#" : `/store/${product.slug}`} tabIndex={comingSoon ? -1 : undefined} data-track={`store-card-title-${product.slug}`}>
          <h3 className="text-xs font-semibold text-gray-900 leading-snug transition-colors group-hover:text-emerald-700">{product.title}</h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        {product.rating && (
          <div className="mt-1 flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <IconStarFilled
                  key={s}
                  size={10}
                  className={s <= Math.round(product.rating!) ? "text-amber-400" : "text-gray-200"}
                />
              ))}
            </span>
            <span className="text-[10px] font-medium text-gray-500">{product.rating}</span>
            <span className="text-[10px] text-gray-300">({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-auto pt-2">
          {comingSoon ? (
            <div className="w-full rounded-md border border-dashed border-gray-200 py-1.5 text-center text-[11px] font-medium text-gray-400" data-track={`store-card-comingsoon-${product.slug}`}>
              Coming Soon
            </div>
          ) : product.link ? (
            <Link
              href={product.link}
              data-track={`store-card-view-${product.slug}`}
              className="flex w-full items-center justify-center gap-1 rounded-md bg-gray-900 py-1.5 text-[11px] font-semibold text-white transition hover:bg-amber-600"
            >
              <IconShoppingCart size={12} />
              View Product
            </Link>
          ) : (
            <button
              type="button"
              data-track={`store-card-addtocart-${product.slug}`}
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-1 rounded-md bg-gray-900 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-600"
            >
              <IconShoppingCart size={12} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
