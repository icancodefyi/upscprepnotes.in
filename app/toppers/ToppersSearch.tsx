"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const PER_PAGE = 20;

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
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-0 sm:py-4"
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
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((t) => (
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

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              <button
                onClick={() => goTo(safePage - 1)}
                disabled={safePage <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-sm text-gray-500 transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === safePage;
                const isNear = Math.abs(p - safePage) <= 1 || p === 1 || p === totalPages;
                if (!isNear) {
                  if (p === safePage - 2 || p === safePage + 2) {
                    return <span key={p} className="text-xs text-gray-300">···</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => goTo(safePage + 1)}
                disabled={safePage >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-sm text-gray-500 transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          )}
        </>
      )}

      <p className="mt-8 text-center text-xs text-gray-400">
        Showing {paginated.length} of {filtered.length} topper{filtered.length !== 1 ? "s" : ""}
        {filtered.length < toppers.length && query.trim() && ` (filtered from ${toppers.length})`}
      </p>
    </div>
  );
}
