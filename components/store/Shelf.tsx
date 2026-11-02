"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";
import PayButton from "@/components/ui/PayButton";

/** Shared store pieces: the folder card, the cover sheet, price, buy and payment marks. Used by the listing and the product page. */

type Product = (typeof PRODUCTS)[number];

export const fmt = (n: number) => n.toLocaleString("en-IN");
export const size = (mb: number) => (mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb} MB`);
export const coverOf = (p: Product) => p.image || p.images?.[0];

/** Each product sits in its own coloured folder; the cover is the real sheet pulled half out of it. */
const FOLDER: Record<string, string> = {
  "answer-copies-compilation": "#DBE2FF",
  "top-10-rankers-strategy": "#FDE9C4",
  "government-schemes-compilation": "#e3e8fb",
  "complete-gs-notes-bundle": "#EBE2FF",
  "anthropology-bundle": "#FFD8CF",
  "vision-ias-mains-2026-test-series": "#E4E7EE",
};
export const folderOf = (p: Product) => FOLDER[p.slug] ?? "#E4E7EE";

const BADGE: Record<string, string> = {
  amber: "bg-[var(--hl)] text-[var(--hl-ink)]",
  emerald: "bg-white text-[#172fa3]",
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

/** Straight to checkout for one product (asks for an email once if we don't have it). */
export function BuyButton({ product, label = "Buy", className = "btn btn-ink h-9 px-4 [--btn-fs:14px]", track }: { product: Product; label?: string; className?: string; track?: string }) {
  return (
    <PayButton amount={product.price} items={[{ slug: product.slug, quantity: 1, price: product.price }]} tracking={track ?? `buy-${product.slug}`} className={className}>
      {label}
    </PayButton>
  );
}

/** Which product goes with which, for "buy both" on the product page. */
const PAIRS: Record<string, string> = {
  "answer-copies-compilation": "top-10-rankers-strategy",
  "top-10-rankers-strategy": "answer-copies-compilation",
  "government-schemes-compilation": "complete-gs-notes-bundle",
  "complete-gs-notes-bundle": "government-schemes-compilation",
  "anthropology-bundle": "answer-copies-compilation",
  "vision-ias-mains-2026-test-series": "answer-copies-compilation",
};
export const pairOf = (p: Product) => PRODUCTS.find((x) => x.slug === PAIRS[p.slug] && !x.comingSoon);

/** The ways people can pay at checkout (Dodo: any UPI app, and cards including RuPay). Official logos, in /public/pay. */
const PAY_LOGOS = [
  { src: "/pay/upi.svg", alt: "UPI", h: "h-[14px]" },
  { src: "/pay/gpay.svg", alt: "Google Pay", h: "h-[16px]" },
  { src: "/pay/phonepe.svg", alt: "PhonePe", h: "h-[15px]" },
  { src: "/pay/visa.svg", alt: "Visa", h: "h-[11px]" },
  { src: "/pay/mastercard.svg", alt: "Mastercard", h: "h-[18px]" },
  { src: "/pay/rupay.svg", alt: "RuPay", h: "h-[12px]" },
];
export function PayMethods({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Pay with UPI, Google Pay, PhonePe, Visa, Mastercard or RuPay" className={`grid grid-cols-6 gap-1.5 ${className}`}>
      {PAY_LOGOS.map((l) => (
        <li key={l.alt} className="grid h-9 place-items-center rounded-[8px] bg-white px-1.5 shadow-[0_0_0_1px_var(--line-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.src} alt={l.alt} title={l.alt} className={`${l.h} w-auto max-w-full object-contain`} />
        </li>
      ))}
    </ul>
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
    <div
      className={`group relative flex flex-col rounded-[24px] bg-white p-2 shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)] transition-[transform,box-shadow] duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--line-2),0_18px_40px_-18px_rgba(11,12,16,0.3)] sm:p-2.5 ${className}`}
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-[18px]" style={{ background: folderOf(product) }}>
        <Badge product={product} />
        <Sheet
          product={product}
          className="absolute left-1/2 top-[16%] w-[58%] -translate-x-1/2 rotate-[-2.5deg] transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-3 group-hover:rotate-0"
        />
        {/* folder lip the sheet tucks into */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[16%] shadow-[0_-1px_0_rgba(11,12,16,0.06),0_-10px_18px_-12px_rgba(11,12,16,0.35)]" style={{ background: folderOf(product) }} />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3">
        <Meta product={product} />
        <h3 className="mt-1.5 text-m font-bold leading-[1.25] group-hover:text-[var(--accent)]">
          {/* The title's link covers the whole card; the buy button sits above it. */}
          <Link href={`/store/${product.slug}`} data-track={track} className="after:absolute after:inset-0 after:rounded-[24px] after:content-['']">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 hidden text-s leading-[1.5] text-[var(--ink-2)] sm:line-clamp-2">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Price product={product} />
          <div className="relative z-10">
            <BuyButton product={product} track={`card-buy-${product.slug}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
