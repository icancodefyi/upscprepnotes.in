"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Topper {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  slug: string;
  isFeatured: boolean;
}

export default function SearchClient({ toppers }: { toppers: Topper[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return toppers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.rank.toString().includes(q) ||
        t.year.toString().includes(q) ||
        t.optionalSubject.toLowerCase().includes(q),
    );
  }, [query, toppers]);

  return (
    <main className="min-h-screen bg-background text-black">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-3">Search</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Search UPSCPrepNotes
          </h1>
        </div>

        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search toppers by name, rank, year, or optional subject..."
            className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-zinc-400"
            autoFocus
          />
        </div>

        {query.trim() && filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-zinc-500">No toppers found matching &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-zinc-400">Try searching by name, rank (e.g. AIR 1), year (2024), or optional subject (e.g. Sociology).</p>
          </div>
        )}

        {filtered.length > 0 && (
          <>
            <p className="mb-4 text-xs text-zinc-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((t) => (
                <Link
                  key={t.slug}
                  href={`/upsc-topper/${t.slug}`}
                  className="group rounded-xl border border-zinc-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold group-hover:text-emerald-600">
                        {t.firstName} {t.lastName}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        AIR {t.rank} &middot; {t.year}
                      </p>
                      {t.optionalSubject && (
                        <p className="mt-1 truncate text-xs text-zinc-400">{t.optionalSubject}</p>
                      )}
                    </div>
                    {t.isFeatured && (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">Featured</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {!query.trim() && (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-400">Start typing to search 280+ UPSC topper profiles</p>
          </div>
        )}
      </div>
    </main>
  );
}
