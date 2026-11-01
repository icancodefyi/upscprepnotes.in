"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY, CATEGORY_ORDER, type Collection } from "@/lib/materials-meta";
import { CollectionCard } from "./Cover";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Search + category chips over every collection. Category chips are real links (?category=) so each view is crawlable. */
export default function Library({ collections, active }: { collections: Collection[]; active: string | null }) {
  const [q, setQ] = useState("");
  const [hindi, setHindi] = useState(false);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of collections) m.set(c.category, (m.get(c.category) ?? 0) + c.files);
    return m;
  }, [collections]);
  const total = collections.reduce((s, c) => s + c.files, 0);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return collections.filter(
      (c) =>
        (!active || c.category === active) &&
        (!hindi || c.hindi) &&
        (!t || `${c.title} ${c.brand} ${c.description} ${c.tags.join(" ")}`.toLowerCase().includes(t)),
    ).sort((a, b) => b.requests - a.requests || b.files - a.files);
  }, [collections, active, q, hindi]);

  const groups = active || q ? [{ key: active ?? "results", items: shown }] : CATEGORY_ORDER.map((k) => ({ key: k, items: shown.filter((c) => c.category === k) })).filter((g) => g.items.length);

  const chip = (on: boolean) =>
    `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-150 ${
      on ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"
    }`;

  return (
    <div>
      <div className="sticky top-[76px] z-20 -mx-2 rounded-[28px] bg-white/90 px-2 py-3 backdrop-blur">
        <label className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="sr-only">Search study material</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Vision IAS, Shankar, Yojana, PSIR, ethics…"
            className="h-11 min-w-0 flex-1 bg-transparent text-[15.5px] outline-none placeholder:text-[var(--muted)]"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="rounded-full px-3 py-2 text-[13px] text-[var(--muted)] hover:text-[var(--ink)]">
              Clear
            </button>
          )}
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <Link href="/free-materials" scroll={false} className={chip(!active)}>
            All <span className="tab opacity-60">{fmt(total)}</span>
          </Link>
          {CATEGORY_ORDER.filter((k) => counts.get(k)).map((k) => (
            <Link key={k} href={`/free-materials?category=${k}`} scroll={false} data-track={`free-materials-category-${k}`} className={chip(active === k)}>
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY[k].tone, boxShadow: `inset 0 0 0 1px ${CATEGORY[k].ink}33` }} />
              {CATEGORY[k].label}
              <span className="tab opacity-60">{fmt(counts.get(k) ?? 0)}</span>
            </Link>
          ))}
          <button type="button" onClick={() => setHindi((v) => !v)} aria-pressed={hindi} className={chip(hindi)}>
            हिंदी medium
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-[24px] bg-[var(--canvas)] p-8 text-center text-[15.5px] text-[var(--ink-2)]">
          {`Nothing matches “${q}”. Try a publisher name like Vision, Forum or Drishti.`}
        </p>
      ) : (
        <div className="mt-8 space-y-14">
          {groups.map((g) => (
            <section key={g.key} id={g.key}>
              {g.key !== "results" && (
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="t-head text-[24px] sm:text-[28px]">{CATEGORY[g.key]?.label ?? "Results"}</h2>
                  <span className="text-[13.5px] text-[var(--muted)]">{`${g.items.length} collections · ${fmt(g.items.reduce((s, c) => s + c.files, 0))} files`}</span>
                </div>
              )}
              {g.key === "results" && <p className="text-[14px] text-[var(--muted)]">{`${shown.length} collection${shown.length === 1 ? "" : "s"}`}</p>}
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {g.items.map((c) => (
                  <li key={c.slug}>
                    <CollectionCard c={c} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
