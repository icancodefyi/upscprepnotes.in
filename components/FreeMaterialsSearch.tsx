"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface PDFItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  brand: string | null;
  description: string;
  resources?: any[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "test-series": "📝",
  "notes": "📓",
  "books": "📚",
  "magazines": "📰",
  "current-affairs": "📰",
  "optional": "🎯",
};

export default function FreeMaterialsSearch({ pdfs }: { pdfs: PDFItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return pdfs;
    const q = query.toLowerCase();
    return pdfs.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query, pdfs]);

  return (
    <div>
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, brand, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-0 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 py-8 text-center">
          No materials found matching &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pdf) => (
            <Link
              key={pdf._id}
              href={`/free-materials/${pdf.slug}`}
              className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <span className="text-lg">
                    {CATEGORY_ICONS[pdf.category] || "📄"}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-800 group-hover:text-black transition-colors truncate">
                    {pdf.title}
                  </h3>
                  {pdf.brand && (
                    <p className="mt-0.5 text-xs text-zinc-400">{pdf.brand}</p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                    {pdf.description}
                  </p>
                  {pdf.resources && (
                    <p className="mt-1.5 text-[11px] text-zinc-300 font-medium">
                      {pdf.resources.length} resource{pdf.resources.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
