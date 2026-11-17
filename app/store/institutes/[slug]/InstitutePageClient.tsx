"use client";

import Link from "next/link";
import type { Institute, StoreProduct } from "@/lib/store-products";
import { ProductCard } from "@/components/store/Shelf";

export default function InstitutePageClient({ institute, products }: { institute: Institute; products: StoreProduct[] }) {
  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/store" data-track="institute-back-to-store" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
            ← Back to Store
          </Link>
        </div>

        {/* Institute header */}
        <header className="mt-8 flex items-center gap-5">
          {/* A real logo only; no made-up initials in a square. Without one, the name below is the mark. */}
          {(institute.logo.startsWith("/") || institute.logo.startsWith("http")) && (
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_var(--line-2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={institute.logo} alt={institute.name} className="h-full w-full object-contain p-2" />
            </div>
          )}
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
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} track={`institute-card-${product.slug}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
