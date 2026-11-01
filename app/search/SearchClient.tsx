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
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[880px] px-6">
        <h1 className="t-display text-h1">Search UPSCPrepNotes</h1>
        <p className="mt-2 text-s font-bold text-[var(--muted)]">Search</p>

        <label className="mt-8 flex items-center gap-3 rounded-full bg-white pl-5 pr-2 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search toppers, store products, pages, topics..."
            className="h-14 min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]"
            autoFocus
          />
        </label>

        {q && allResults === 0 && (
          <div className="py-16 text-center">
            <p className="text-m text-[var(--ink-2)]">No results found matching &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-s text-[var(--muted)]">Try searching by topper name, product name, subject, or topic.</p>
          </div>
        )}

        {q && allResults > 0 && (
          <div className="mt-10 space-y-10">
            {topperResults.length > 0 && (
              <section>
                <h2 className="text-m font-bold">Toppers</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {topperResults.map((t) => (
                    <Link key={t.slug} href={`/upsc-topper/${t.slug}`} className="group rounded-[20px] bg-white p-4 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-m font-bold group-hover:text-[var(--accent)]">
                            {t.firstName} {t.lastName}
                          </h3>
                          <p className="text-s text-[var(--ink-2)]">
                            AIR {t.rank} &middot; {t.year}
                          </p>
                          {t.optionalSubject && <p className="truncate text-s text-[var(--muted)]">{t.optionalSubject}</p>}
                        </div>
                        {t.isFeatured && <span className="shrink-0 rounded-full bg-[var(--hl)] px-2 py-0.5 text-s font-bold text-[var(--hl-ink)]">Featured</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {productResults.length > 0 && (
              <section>
                <h2 className="text-m font-bold">Store Products</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {productResults.map((p) => (
                    <Link key={p.slug} href={`/store/${p.slug}`} className="group rounded-[20px] bg-white p-4 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-m font-bold group-hover:text-[var(--accent)]">{p.title}</h3>
                          <p className="text-s text-[var(--ink-2)]">{p.tagline}</p>
                        </div>
                        <span className="tab shrink-0 rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-s font-bold">₹{p.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {pageResults.length > 0 && (
              <section>
                <h2 className="text-m font-bold">Pages</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {pageResults.map((p) => (
                    <Link key={p.href} href={p.href} className="group rounded-[20px] bg-white p-4 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5">
                      <h3 className="truncate text-m font-bold group-hover:text-[var(--accent)]">{p.title}</h3>
                      <p className="text-s text-[var(--muted)]">{p.href}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!q && (
          <div className="py-16 text-center">
            <p className="text-m text-[var(--muted)]">Start typing to search toppers, store products, and pages</p>
          </div>
        )}
      </div>
    </div>
  );
}
