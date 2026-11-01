"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";
import { useCart } from "@/lib/cart-context";

/** Shared store pieces: the folder card, the cover sheet, price and add. Used by the listing and the product page. */

type Product = (typeof PRODUCTS)[number];

export const fmt = (n: number) => n.toLocaleString("en-IN");
export const size = (mb: number) => (mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb} MB`);
export const coverOf = (p: Product) => p.image || p.images?.[0];

/** Each product sits in its own coloured folder; the cover is the real sheet pulled half out of it. */
const FOLDER: Record<string, string> = {
  "answer-copies-compilation": "#DBE2FF",
  "top-10-rankers-strategy": "#FDE9C4",
  "government-schemes-compilation": "#D4F1DF",
  "complete-gs-notes-bundle": "#EBE2FF",
  "anthropology-bundle": "#FFD8CF",
  "vision-ias-mains-2026-test-series": "#E4E7EE",
};
export const folderOf = (p: Product) => FOLDER[p.slug] ?? "#E4E7EE";

const BADGE: Record<string, string> = {
  amber: "bg-[var(--hl)] text-[var(--hl-ink)]",
  emerald: "bg-white text-[#14532d]",
};

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${className}`} fill="currentColor" aria-hidden>
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
    </svg>
  );
}

export function Meta({ product }: { product: Product }) {
  if (!product.rating && !product.fileCount) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-s text-[var(--muted)]">
      {product.rating && (
        <span className="inline-flex items-center gap-1 font-bold text-[var(--ink)]">
          <Star className="text-[var(--accent)]" />
          {product.rating.toFixed(1)}
        </span>
      )}
      {product.fileCount && (
        <span className="tab">
          {product.fileCount} files{product.totalSizeMB ? ` · ${size(product.totalSizeMB)}` : ""}
        </span>
      )}
    </div>
  );
}

export function AddButton({ product, big = false }: { product: Product; big?: boolean }) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.product.slug === product.slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
      }}
      aria-label={`Add ${product.title} to cart`}
      className={`btn ${big ? "btn-blue h-12 px-6" : "btn-ink h-9 px-4 [--btn-fs:14px]"}`}
    >
      {inCart ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : null}
      Add
    </button>
  );
}

export function Price({ product, big = false }: { product: Product; big?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={`tab rounded-[6px] bg-[var(--hl)] px-2 py-0.5 font-bold ${big ? "text-l leading-tight" : "text-m"}`}>₹{fmt(product.price)}</span>
      {product.originalPrice && <span className="tab text-s text-[var(--muted)] line-through">₹{fmt(product.originalPrice)}</span>}
    </span>
  );
}

/** The real cover, as a sheet of paper. */
export function Sheet({ product, className = "", eager = false }: { product: Product; className?: string; eager?: boolean }) {
  const cover = coverOf(product);
  return (
    <div className={`paper aspect-[464/600] overflow-hidden ${className}`}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={product.title} loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover object-top" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[var(--canvas)]">
          <span className="t-display text-l text-[var(--muted)]">{product.title.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}

export function Badge({ product }: { product: Product }) {
  if (!product.badge) return null;
  return (
    <span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-s font-bold shadow-[0_1px_2px_rgba(11,12,16,0.08)] ${BADGE[product.badgeColor ?? ""] ?? "bg-white text-[var(--ink)]"}`}>
      {product.badge}
    </span>
  );
}

/** A booklet on the shelf: its folder, the cover pulled half out, then title, price and one action. */
export function ProductCard({ product, className = "", track }: { product: Product; className?: string; track?: string }) {
  return (
    <Link
      href={`/store/${product.slug}`}
      data-track={track}
      className={`group flex flex-col rounded-[24px] bg-white p-2 shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)] transition-[transform,box-shadow] duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--line-2),0_18px_40px_-18px_rgba(11,12,16,0.3)] sm:p-2.5 ${className}`}
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-[18px]" style={{ background: folderOf(product) }}>
        <Badge product={product} />
        <Sheet
          product={product}
          className="absolute left-1/2 top-[16%] w-[58%] -translate-x-1/2 rotate-[-2.5deg] transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-3 group-hover:rotate-0"
        />
        {/* folder lip the sheet tucks into */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[16%] bg-[inherit] shadow-[0_-1px_0_rgba(11,12,16,0.06),0_-10px_18px_-12px_rgba(11,12,16,0.35)]" style={{ background: folderOf(product) }} />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3">
        <Meta product={product} />
        <h3 className="mt-1.5 text-m font-bold leading-[1.25] group-hover:text-[var(--accent)]">{product.title}</h3>
        <p className="mt-1 hidden text-s leading-[1.5] text-[var(--ink-2)] sm:line-clamp-2">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Price product={product} />
          <AddButton product={product} />
        </div>
      </div>
    </Link>
  );
}
