"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Topper = {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  slug: string;
  isFeatured: boolean;
};

export default function ToppersSearch({ toppers }: { toppers: Topper[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return toppers;
    const q = query.toLowerCase();
    return toppers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.rank.toString().includes(q) ||
        t.year.toString().includes(q) ||
        t.optionalSubject.toLowerCase().includes(q)
    );
  }, [query, toppers]);

  const years = useMemo(() => {
    const y = new Set<number>();
    toppers.forEach((t) => y.add(t.year));
    return Array.from(y).sort((a, b) => b - a);
  }, [toppers]);

  const subjects = useMemo(() => {
    const s = new Set<string>();
    toppers.forEach((t) => {
      if (t.optionalSubject) s.add(t.optionalSubject);
    });
    return Array.from(s).sort();
  }, [toppers]);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, rank, year, or optional subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-0"
            autoFocus
            data-track="toppers-search-input"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-gray-500">No toppers found matching &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/upsc-topper/${t.slug}`}
              data-track={`toppers-card-${t.slug}`}
              className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-emerald-600">
                    {t.firstName} {t.lastName}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    AIR {t.rank} &middot; {t.year}
                  </p>
                  {t.optionalSubject && (
                    <p className="mt-1 truncate text-xs text-gray-400">
                      {t.optionalSubject}
                    </p>
                  )}
                </div>
                {t.isFeatured && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    Featured
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-gray-400">
        Showing {filtered.length} of {toppers.length} toppers
      </p>
    </div>
  );
}
