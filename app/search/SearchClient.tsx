"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/store-products";

interface Topper {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  slug: string;
  isFeatured: boolean;
}

interface StaticPage {
  title: string;
  href: string;
  keywords: string;
}

const STATIC_PAGES: StaticPage[] = [
  { title: "Store", href: "/store", keywords: "products, buy, notes, test series, optional" },
  { title: "Toppers", href: "/toppers", keywords: "topper profiles, rank holders, strategy" },
  { title: "Current Affairs", href: "/current-affairs", keywords: "current affairs, monthly, yearly, pdf" },
  { title: "Free Materials", href: "/free-materials", keywords: "free download, test series, notes, books" },
  { title: "PYQs", href: "/pyq", keywords: "previous year questions, pyq, prelims, mains" },
  { title: "AI Mentor", href: "/ask", keywords: "ai, ask, mentor, chat" },
  { title: "Optional Subjects", href: "/optional", keywords: "optional subject, sociology, geography, psir" },
];

export default function SearchClient({ toppers }: { toppers: Topper[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const q = query.toLowerCase().trim();

  const topperResults = useMemo(() => {
    if (!q) return [];
    return toppers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.rank.toString().includes(q) ||
        t.year.toString().includes(q) ||
        t.optionalSubject.toLowerCase().includes(q),
    );
  }, [q, toppers]);

  const productResults = useMemo(() => {
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        !p.comingSoon &&
        (p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))),
    );
  }, [q]);

  const pageResults = useMemo(() => {
    if (!q) return [];
    return STATIC_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.keywords.toLowerCase().includes(q),
    );
  }, [q]);

  const allResults = topperResults.length + productResults.length + pageResults.length;

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
            placeholder="Search toppers, store products, pages, topics..."
            className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition focus:border-zinc-400"
            autoFocus
          />
        </div>

        {q && allResults === 0 && (
          <div className="py-16 text-center">
            <p className="text-zinc-500">No results found matching &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-zinc-400">Try searching by topper name, product name, subject, or topic.</p>
          </div>
        )}

        {q && allResults > 0 && (
          <div className="space-y-8">
            {topperResults.length > 0 && (
              <section>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">Toppers</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {topperResults.map((t) => (
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
              </section>
            )}

            {productResults.length > 0 && (
              <section>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">Store Products</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {productResults.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/store/${p.slug}`}
                      className="group rounded-xl border border-zinc-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold group-hover:text-emerald-600">{p.title}</h3>
                          <p className="mt-0.5 text-xs text-zinc-500">{p.tagline}</p>
                        </div>
                        <span className="ml-3 shrink-0 text-xs font-semibold text-emerald-600">₹{p.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {pageResults.length > 0 && (
              <section>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">Pages</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {pageResults.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="group rounded-xl border border-zinc-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-sm"
                    >
                      <h3 className="truncate text-sm font-semibold group-hover:text-emerald-600">{p.title}</h3>
                      <p className="mt-0.5 text-xs text-zinc-400">{p.href}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!q && (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-400">Start typing to search toppers, store products, and pages</p>
          </div>
        )}
      </div>
    </main>
  );
}
