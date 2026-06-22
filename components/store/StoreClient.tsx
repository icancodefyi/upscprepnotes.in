"use client";

import { useState, useMemo, useCallback } from "react";
import posthog from "posthog-js";
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

type SortOption = "featured" | "price-low" | "price-high" | "rating";

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
  const [sort, setSort] = useState<SortOption>("featured");
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const filtered =
      category === "all"
        ? PRODUCTS.filter((p) => !p.comingSoon)
        : PRODUCTS.filter((p) => p.category === category && !p.comingSoon);

    switch (sort) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "rating":
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered;
    }
  }, [category, sort]);

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

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (value.trim().length >= 3) {
      posthog.capture("store_filtered", { query: value, filter_type: "search" });
    }
  }, []);

  const handleCategoryChange = useCallback((tab: CategoryTab) => {
    setCategory(tab);
    if (tab !== "all") {
      posthog.capture("store_filtered", { category: tab, filter_type: "category" });
    }
  }, []);

  return (
    <CartProvider>
      <div className="mx-auto min-h-screen bg-white">
        {/* ─── Store Header ─── */}
        <div className="border-b border-gray-100">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Store</h1>
              <p className="text-[11px] text-gray-400 sm:text-sm">{PRODUCTS.filter((p) => !p.comingSoon).length} products</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <IconSearch size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 sm:size-[15px] sm:left-3" />
                <input
                  type="text"
                  data-track="store-search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-32 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-2 text-xs outline-none transition focus:w-40 focus:border-gray-300 focus:bg-white sm:w-40 sm:py-2 sm:pl-8 sm:pr-3 sm:text-sm sm:focus:w-56"
                />
              </div>
              <CartIcon onClick={() => setCartOpen(true)} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
          {/* Hero */}
          {category === "all" && !search && (
            <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-5 text-white sm:mb-8 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-[11px]">Best Seller</p>
                  <h2 className="mt-1 text-lg font-bold sm:text-2xl">All Strategy Reports</h2>
                  <p className="mt-1.5 text-xs text-zinc-300 sm:mt-2 sm:text-sm">280+ topper strategies, marks analysis, and answer copies. Everything you need in one bundle.</p>
                  <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
                    <Link href="/store/all-strategy-reports" data-track="store-hero-cta"
                      className="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-[11px] font-bold text-zinc-900 transition hover:bg-zinc-100 sm:px-5 sm:py-2.5 sm:text-xs"
                    >
                      View Bundle — ₹799
                      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                    <span className="text-[10px] text-zinc-400 sm:text-[11px]">₹27,720 value</span>
                  </div>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black text-white sm:h-28 sm:w-28 sm:text-3xl">
                  280+
                </div>
              </div>
            </div>
          )}

          {filtered ? (
            <>
              {filtered.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-sm text-gray-400">No products match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.slug} product={product} onAddedToCart={() => setCartOpen(true)} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* ─── Category Tabs + Sort ─── */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      data-track={`store-tab-${tab.key}`}
                      onClick={() => handleCategoryChange(tab.key)}
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    data-track="store-sort"
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-600 outline-none focus:border-gray-400"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
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
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
      <Link href={comingSoon ? "#" : `/store/${product.slug}`} tabIndex={comingSoon ? -1 : undefined} className="block" data-track={`store-card-img-${product.slug}`}>
        {product.image ? (
          <div className="relative h-36 overflow-hidden bg-gray-50 sm:h-44">
            <img
              src={product.image}
              alt={product.title}
              width={464}
              height={600}
              className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
            />
            {product.badge && (
              <span
                className={`absolute left-2 top-2 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider shadow-sm sm:text-[9px] ${
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
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 shadow-sm sm:text-[9px]">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        ) : (
          <div className={`relative flex h-36 items-center justify-center sm:h-44 ${product.gradient}`} data-track={`store-card-img-${product.slug}`}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

            {comingSoon ? (
              <div className="relative text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/20 sm:h-12 sm:w-12">
                  <span className="text-lg font-black tracking-tight text-white sm:text-xl">?</span>
                </div>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/50 sm:mt-1.5 sm:text-[9px]">Coming Soon</p>
              </div>
            ) : (
              <div className="relative px-3 text-center">
                {product.slug === "top-10-rankers-strategy" && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span key={n} className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 text-[11px] font-bold text-white backdrop-blur-sm sm:h-7 sm:w-7 sm:text-xs">{n}</span>
                    ))}
                  </div>
                )}
                {product.slug === "all-strategy-reports" && (
                  <div className="text-center">
                    <span className="text-2xl font-black text-white drop-shadow-sm sm:text-3xl">280+</span>
                    <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-white/70 sm:text-[9px]">Reports</p>
                  </div>
                )}
                {product.slug === "answer-copies-compilation" && (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center gap-0.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80 sm:w-[22px] sm:h-[22px]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="-ml-1.5 opacity-60 sm:w-[22px] sm:h-[22px]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">50+ Answer Copies</p>
                  </div>
                )}
              </div>
            )}

            {product.badge && (
              <span
                className={`absolute left-2 top-2 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider shadow-sm sm:text-[9px] ${
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
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 shadow-sm sm:text-[9px]">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <Link href={comingSoon ? "#" : `/store/${product.slug}`} tabIndex={comingSoon ? -1 : undefined} data-track={`store-card-title-${product.slug}`}>
          <h3 className="text-xs font-semibold text-gray-900 leading-snug transition-colors group-hover:text-emerald-700 sm:text-sm">{product.title}</h3>
        </Link>

          <div className="mt-1 flex items-center gap-1.5 sm:mt-1.5 sm:gap-2">
          <span className="text-xs font-bold text-gray-900 sm:text-sm">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through sm:text-[11px]">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        {product.fileCount && (
          <p className="mt-0.5 flex items-center gap-1 text-[9px] text-gray-400 sm:text-[10px]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {product.fileCount} file{product.fileCount > 1 ? "s" : ""}
            {product.totalSizeMB ? ` · ${product.totalSizeMB} MB` : ""}
          </p>
        )}

        {product.rating && (
          <div className="mt-0.5 flex items-center gap-1 sm:mt-1">
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <IconStarFilled
                  key={s}
                  size={9}
                  className={s <= Math.round(product.rating!) ? "text-amber-400" : "text-gray-200 sm:size-[10px]"}
                />
              ))}
            </span>
            <span className="text-[9px] font-medium text-gray-500 sm:text-[10px]">{product.rating}</span>
            <span className="text-[9px] text-gray-300 sm:text-[10px]">({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-auto pt-1.5 sm:pt-2">
          {comingSoon ? (
            <div className="w-full rounded-md border border-dashed border-gray-200 py-1 text-center text-[10px] font-medium text-gray-400 sm:py-1.5 sm:text-[11px]" data-track={`store-card-comingsoon-${product.slug}`}>
              Coming Soon
            </div>
          ) : product.link ? (
            <Link
              href={product.link}
              data-track={`store-card-view-${product.slug}`}
              className="flex w-full items-center justify-center gap-1 rounded-md bg-gray-900 py-1 text-[10px] font-semibold text-white transition hover:bg-amber-600 sm:py-1.5 sm:text-[11px]"
            >
              <IconShoppingCart size={10} />
              View Product
            </Link>
          ) : (
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <Link
                href={`/store/${product.slug}`}
                data-track={`store-card-buy-${product.slug}`}
                className="flex w-full items-center justify-center gap-1 rounded-md bg-gray-900 py-1 text-[10px] font-semibold text-white transition hover:bg-zinc-800 sm:py-1.5 sm:text-[11px]"
              >
                <IconShoppingCart size={10} />
                Buy Now
              </Link>
              <button
                type="button"
                data-track={`store-card-addtocart-${product.slug}`}
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-1 rounded-md border border-gray-200 bg-white py-1 text-[10px] font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-800 sm:py-1.5 sm:text-[11px]"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
