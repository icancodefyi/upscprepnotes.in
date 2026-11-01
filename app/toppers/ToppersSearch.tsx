"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
  avatar?: string;
};

function ToppersSearchInner({ toppers }: { toppers: Topper[] }) {
  const searchParams = useSearchParams();
  const urlQ = searchParams?.get("search") || searchParams?.get("q") || "";
  const [query, setQuery] = useState(urlQ);
  const [page, setPage] = useState(1);

  // When the URL's search changes (e.g. a new linked search), adopt it. Done during render, not in an effect.
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setQuery(urlQ);
  }

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
      <div className="sticky top-[76px] z-20 -mx-2 rounded-[28px] bg-white/90 px-2 py-3 backdrop-blur">
        <label className="flex items-center gap-3 rounded-full bg-white py-0 pl-5 pr-2 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, rank, year, or optional subject..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="h-12 min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]"
            autoFocus
            data-track="toppers-search-input"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-m text-[var(--muted)]">No toppers found matching &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((t) => (
              <Link
                key={t.slug}
                href={`/upsc-topper/${t.slug}`}
                data-track={`toppers-card-${t.slug}`}
                className="group flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5"
              >
                {t.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt="" aria-hidden loading="lazy" width={48} height={48} className="h-12 w-12 shrink-0 rounded-full bg-[#e9edff] object-cover object-top shadow-[0_0_0_1px_var(--line)]" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-m font-bold group-hover:text-[var(--accent)]">
                    {t.firstName} {t.lastName}
                  </h3>
                  <p className="flex items-center gap-2 text-s text-[var(--ink-2)]">
                    <span>AIR {t.rank} &middot; {t.year}</span>
                    {t.isFeatured && <span className="rounded-full bg-[var(--hl)] px-1.5 text-s font-bold text-[var(--hl-ink)]">Featured</span>}
                  </p>
                  {t.optionalSubject && <p className="truncate text-s text-[var(--muted)]">{t.optionalSubject}</p>}
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              <button
                onClick={() => goTo(safePage - 1)}
                disabled={safePage <= 1}
                aria-label="Previous page"
                className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink-2)] transition hover:bg-[var(--canvas)] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === safePage;
                const isNear = Math.abs(p - safePage) <= 1 || p === 1 || p === totalPages;
                if (!isNear) {
                  if (p === safePage - 2 || p === safePage + 2) {
                    return <span key={p} className="text-s text-[var(--muted)]">···</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={`tab grid h-10 w-10 place-items-center rounded-full text-s font-bold transition ${isActive ? "bg-[var(--ink)] text-white" : "text-[var(--ink-2)] hover:bg-[var(--canvas)]"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => goTo(safePage + 1)}
                disabled={safePage >= totalPages}
                aria-label="Next page"
                className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink-2)] transition hover:bg-[var(--canvas)] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      <p className="mt-8 text-center text-s text-[var(--muted)]">
        Showing {paginated.length} of {filtered.length} topper{filtered.length !== 1 ? "s" : ""}
        {filtered.length < toppers.length && query.trim() && ` (filtered from ${toppers.length})`}
      </p>
    </div>
  );
}

export default function ToppersSearch({ toppers }: { toppers: Topper[] }) {
  return (
    <Suspense fallback={<div className="py-8 text-center text-s text-[var(--muted)]">Loading topper search...</div>}>
      <ToppersSearchInner toppers={toppers} />
    </Suspense>
  );
}
