"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type PickItem = { slug: string; name: string; rank: number; year: number; optional: string; avatar: string };

/**
 * Search box that opens /compare/{base}-vs-{picked}. `base` is the topper already on screen;
 * `side` says which side of the comparison the pick replaces.
 */
export default function ComparePicker({
  base,
  items,
  side = "b",
  placeholder = "Search a topper to compare with",
  autoFocus = false,
}: {
  base: string;
  items: PickItem[];
  side?: "a" | "b";
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const pool = items.filter((i) => i.slug !== base);
    if (!t) return pool.slice(0, 6);
    const air = t.match(/^(?:air\s*)?(\d+)$/);
    return pool
      .filter((i) => (air ? String(i.rank) === air[1] : `${i.name} ${i.optional} ${i.year}`.toLowerCase().includes(t)))
      .slice(0, 8);
  }, [q, items, base]);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/compare/${side === "b" ? `${base}-vs-${slug}` : `${slug}-vs-${base}`}`);
  };

  return (
    <div
      ref={box}
      className="relative"
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span className="sr-only">Compare with</span>
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setHi(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(h + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
            if (e.key === "Enter" && results[hi]) { e.preventDefault(); go(results[hi].slug); }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls="compare-results"
          className="h-10 min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]"
        />
        <span className="hidden rounded-full bg-[var(--canvas)] px-3 py-2 text-s text-[var(--muted)] sm:inline">Name, AIR or optional</span>
      </label>

      {open && results.length > 0 && (
        <ul
          id="compare-results"
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[360px] overflow-auto rounded-[20px] bg-white p-1.5 shadow-[0_0_0_1px_var(--line),0_18px_40px_-16px_rgba(11,12,16,0.35)]"
        >
          {results.map((r, i) => (
            <li key={r.slug} role="option" aria-selected={i === hi}>
              <button
                type="button"
                onMouseEnter={() => setHi(i)}
                onClick={() => go(r.slug)}
                className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left ${i === hi ? "bg-[var(--canvas)]" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.avatar} alt="" aria-hidden loading="lazy" className="h-9 w-9 shrink-0 rounded-full bg-[#e9edff] object-cover object-top" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-s">{r.name}</span>
                  <span className="block truncate text-s text-[var(--muted)]">{`AIR ${r.rank} · CSE ${r.year}${r.optional ? ` · ${r.optional}` : ""}`}</span>
                </span>
                <span className="text-s font-bold text-[var(--accent)]">Compare →</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
