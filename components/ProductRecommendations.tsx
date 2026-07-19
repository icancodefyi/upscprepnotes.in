"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";

export type ProductRecommendation = {
  slug: string;
  reason: string;
};

const RECOMMENDATION_MAP: Record<string, ProductRecommendation[]> = {
  default: [
    { slug: "top-10-rankers-strategy", reason: "See what AIR 1-10 did differently" },
    { slug: "answer-copies-compilation", reason: "Read real handwritten answers" },
  ],
  topper: [
    { slug: "answer-copies-compilation", reason: "Includes this topper's actual answer sheets" },
    { slug: "all-strategy-reports", reason: "Compare 280+ topper strategies" },
  ],
  strategy: [
    { slug: "top-10-rankers-strategy", reason: "AIR 1-10 strategies distilled" },
    { slug: "all-strategy-reports", reason: "Every topper strategy in one bundle" },
  ],
  answer: [
    { slug: "answer-copies-compilation", reason: "50+ real answer copies" },
    { slug: "top-10-rankers-strategy", reason: "Learn how toppers structured answers" },
  ],
  optional: [
    { slug: "answer-copies-compilation", reason: "Optional paper answer copies included" },
    { slug: "all-strategy-reports", reason: "Find toppers with your optional" },
  ],
};

export function getRecommendations(context: keyof typeof RECOMMENDATION_MAP = "default") {
  const recs = RECOMMENDATION_MAP[context] || RECOMMENDATION_MAP.default;
  return recs
    .map((r) => {
      const product = PRODUCTS.find((p) => p.slug === r.slug && !p.comingSoon);
      return product ? { product, reason: r.reason } : null;
    })
    .filter(Boolean) as { product: (typeof PRODUCTS)[number]; reason: string }[];
}

export default function ProductRecommendations({
  context = "default",
  title = "Recommended for you",
}: {
  context?: keyof typeof RECOMMENDATION_MAP;
  title?: string;
}) {
  const recs = getRecommendations(context);
  if (recs.length === 0) return null;

  return (
    <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">{title}</p>
      <div className="mt-2 space-y-2">
        {recs.map(({ product, reason }) => (
          <Link
            key={product.slug}
            href={`/store/${product.slug}`}
            data-track={`recommendation-${product.slug}`}
            className="flex items-center gap-3 rounded-lg bg-white p-2.5 transition hover:shadow-sm hover:border-emerald-200 border border-transparent"
          >
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${product.gradient}`}>
                  <span className="text-xs font-black text-white">{product.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-800">{product.title}</p>
              <p className="text-[10px] text-emerald-600 font-medium">{reason}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-emerald-800">₹{product.price}</p>
              {product.originalPrice && (
                <p className="text-[9px] text-zinc-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-2 text-center">
        <Link
          href="/store"
          data-track="recommendations-browse-all"
          className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
        >
          Browse all products →
        </Link>
      </div>
    </div>
  );
}
