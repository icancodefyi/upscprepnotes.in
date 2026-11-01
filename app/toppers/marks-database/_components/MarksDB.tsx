"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type Row = {
  slug: string;
  name: string;
  rank: number;
  year: number;
  optional: string;
  avatar: string;
  /** false = only written, interview and total are on record. */
  full: boolean;
  essay: number;
  gs1: number;
  gs2: number;
  gs3: number;
  gs4: number;
  opt1: number;
  opt2: number;
  written: number;
  interview: number;
  total: number;
};

type Key = "rank" | "year" | "essay" | "gs1" | "gs2" | "gs3" | "gs4" | "opt1" | "opt2" | "written" | "interview" | "total";

const COLS: { key: Exclude<Key, "rank">; label: string; max: number; strong?: boolean }[] = [
  { key: "year", label: "Year", max: 0 },
  { key: "essay", label: "Essay", max: 250 },
  { key: "gs1", label: "GS I", max: 250 },
  { key: "gs2", label: "GS II", max: 250 },
  { key: "gs3", label: "GS III", max: 250 },
  { key: "gs4", label: "GS IV", max: 250 },
  { key: "opt1", label: "Opt I", max: 250 },
  { key: "opt2", label: "Opt II", max: 250 },
  { key: "written", label: "Written", max: 1750, strong: true },
  { key: "interview", label: "Interview", max: 275, strong: true },
  { key: "total", label: "Total", max: 2025, strong: true },
];
const MARK_KEYS = COLS.filter((c) => c.max > 0).map((c) => c.key);

const fmt = (x: number) => x.toLocaleString("en-IN");
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

/**
 * Every published marksheet as one sortable table. Filters live in the URL (?year=&optional=&q=&sort=)
 * so a filtered view can be shared; the canonical URL stays the unfiltered page.
 */
export default function MarksDB({ rows, years, optionals }: { rows: Row[]; years: number[]; optionals: [string, number][] }) {
  const [year, setYear] = useState<number | null>(null);
  const [optional, setOptional] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: Key; dir: "asc" | "desc" }>({ key: "rank", dir: "asc" });
  const [picked, setPicked] = useState<string[]>([]);

  // Read a shared view from the URL once on mount.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = Number(p.get("year"));
    if (years.includes(y)) setYear(y);
    const o = p.get("optional");
    if (o && optionals.some(([s]) => s === o)) setOptional(o);
    if (p.get("q")) setQ(p.get("q") ?? "");
    const s = p.get("sort");
    if (s) {
      const [k, d] = s.split(".");
      if (k === "rank" || COLS.some((c) => c.key === k)) setSort({ key: k as Key, dir: d === "asc" ? "asc" : "desc" });
    }
  }, [years, optionals]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (year) p.set("year", String(year));
    if (optional) p.set("optional", optional);
    if (q.trim()) p.set("q", q.trim());
    if (sort.key !== "rank" || sort.dir !== "asc") p.set("sort", `${sort.key}.${sort.dir}`);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [year, optional, q, sort]);

  // Top tenth of each column across all complete sheets: those cells are inked blue.
  const cut = useMemo(() => {
    const m = {} as Record<string, number>;
    for (const k of MARK_KEYS) {
      const v = rows.map((r) => r[k]).filter((x) => x > 0).sort((a, b) => b - a);
      m[k] = v[Math.max(0, Math.floor(v.length * 0.1) - 1)] ?? Infinity;
    }
    return m;
  }, [rows]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (!year || r.year === year) &&
        (!optional || r.optional === optional) &&
        (!t || `${r.name} ${r.optional} ${r.rank}`.toLowerCase().includes(t)),
    );
    const { key, dir } = sort;
    return list.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      // Missing marks always sink to the bottom, whichever way the column is sorted.
      if (!av !== !bv) return av ? -1 : 1;
      return (dir === "asc" ? av - bv : bv - av) || b.year - a.year || a.rank - b.rank;
    });
  }, [rows, year, optional, q, sort]);

  const med = useMemo(() => {
    const m = {} as Record<string, number>;
    for (const k of MARK_KEYS) m[k] = median(shown.map((r) => r[k]).filter((x) => x > 0));
    return m;
  }, [shown]);

  const toggleSort = (key: Key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "rank" ? "asc" : "desc" }));

  const pick = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug].slice(-2)));
  const pickedRows = picked.map((s) => rows.find((r) => r.slug === s)).filter(Boolean) as Row[];

  const chip = (on: boolean) =>
    `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-150 ${
      on ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"
    }`;
  const filtered = !!(year || optional || q.trim());

  const th = (k: Key, label: string, className = "") => {
    const on = sort.key === k;
    return (
      <th key={k} scope="col" aria-sort={on ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={`bg-white p-0 font-normal ${className}`}>
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className={`t-meta inline-flex h-11 w-full items-center justify-end gap-1 whitespace-nowrap px-3 hover:text-[var(--ink)] ${on ? "!text-[var(--accent)]" : ""}`}
        >
          {label.toUpperCase()}
          <span aria-hidden className={`text-[10px] ${on ? "" : "opacity-0"}`}>{sort.dir === "asc" ? "▲" : "▼"}</span>
        </button>
      </th>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-full bg-white py-1 pl-5 pr-1.5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="sr-only">Search toppers</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a name, rank or optional"
            className="h-11 min-w-0 flex-1 bg-transparent text-[15.5px] outline-none placeholder:text-[var(--muted)]"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="rounded-full px-3 py-2 text-[13px] text-[var(--muted)] hover:text-[var(--ink)]">
              Clear
            </button>
          )}
        </label>
        <label className="relative flex items-center rounded-full bg-white shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)] lg:w-[260px]">
          <span className="sr-only">Optional subject</span>
          <select
            value={optional}
            onChange={(e) => setOptional(e.target.value)}
            className="h-[52px] w-full appearance-none rounded-full bg-transparent pl-5 pr-10 text-[15px] font-medium outline-none"
          >
            <option value="">Every optional</option>
            {optionals.map(([s, c]) => (
              <option key={s} value={s}>{`${s} (${c})`}</option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-5 text-[12px] text-[var(--muted)]">▼</span>
        </label>
      </div>
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <button type="button" onClick={() => setYear(null)} className={chip(!year)}>All years</button>
        {years.map((y) => (
          <button key={y} type="button" onClick={() => setYear(year === y ? null : y)} className={chip(year === y)}>
            {`CSE ${y}`} <span className="tab opacity-60">{rows.filter((r) => r.year === y).length}</span>
          </button>
        ))}
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setYear(null);
              setOptional("");
              setQ("");
            }}
            className="ml-auto shrink-0 px-2 text-[13.5px] font-semibold text-[var(--accent)] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[var(--line)] px-4 py-3 text-[13px] text-[var(--muted)] sm:px-5">
          <span>
            <span className="tab font-semibold text-[var(--ink)]">{fmt(shown.length)}</span>
            {` of ${fmt(rows.length)} toppers · tap a column to sort`}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="tab font-bold text-[var(--accent)]">Blue</span> = top 10% in that paper
          </span>
        </div>

        <div className="max-h-[min(78vh,860px)] overflow-auto overscroll-x-contain">
          <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-[14.5px]">
            <thead className="sticky top-0 z-20">
              <tr>
                <th scope="col" className="sticky left-0 z-30 bg-white p-0 text-left font-normal shadow-[inset_-1px_-1px_0_var(--line-2)]">
                  <button type="button" onClick={() => toggleSort("rank")} className={`t-meta inline-flex h-11 items-center gap-1 pl-[44px] pr-3 sm:pl-[52px] hover:text-[var(--ink)] ${sort.key === "rank" ? "!text-[var(--accent)]" : ""}`}>
                    AIR · TOPPER
                    <span aria-hidden className={`text-[10px] ${sort.key === "rank" ? "" : "opacity-0"}`}>{sort.dir === "asc" ? "▲" : "▼"}</span>
                  </button>
                </th>
                {COLS.map((c) => (
                  th(c.key, c.label, `shadow-[inset_0_-1px_0_var(--line-2)] ${c.key === "written" ? "border-l border-[var(--line)]" : ""}`)
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length > 0 && (
                <tr className="bg-[var(--canvas)]">
                  <td className="sticky left-0 z-10 bg-[var(--canvas)] py-2.5 pl-[44px] pr-3 sm:pl-[52px] shadow-[inset_-1px_0_0_var(--line-2)]">
                    <span className="text-[13.5px] font-semibold">Median</span>
                    <span className="ml-1.5 text-[12.5px] text-[var(--muted)]">{filtered ? "of this view" : "of everyone"}</span>
                  </td>
                  {COLS.map((c) => (
                    <td key={c.key} className={`tab px-3 py-2.5 text-right text-[13.5px] font-semibold text-[var(--ink-2)] ${c.key === "written" ? "border-l border-[var(--line)]" : ""}`}>
                      {c.max ? (med[c.key] ? fmt(med[c.key]) : "—") : ""}
                    </td>
                  ))}
                </tr>
              )}
              {shown.map((r) => {
                const on = picked.includes(r.slug);
                return (
                  <tr key={r.slug} className={`group ${on ? "bg-[#fffbe0]" : "hover:bg-[#f8f9fc]"}`}>
                    <td className={`sticky left-0 z-10 border-t border-[var(--line)] py-1.5 pl-2 pr-3 shadow-[inset_-1px_0_0_var(--line-2)] sm:pl-3 ${on ? "bg-[#fffbe0]" : "bg-white group-hover:bg-[#f8f9fc]"}`}>
                      <span className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => pick(r.slug)}
                        aria-pressed={on}
                        aria-label={on ? `Remove ${r.name} from comparison` : `Compare ${r.name}`}
                        title={on ? "Remove from comparison" : "Add to comparison"}
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[15px] leading-none transition-colors ${
                          on ? "bg-[var(--ink)] text-white" : "text-[var(--muted)] shadow-[inset_0_0_0_1px_var(--line-2)] hover:text-[var(--accent)] hover:shadow-[inset_0_0_0_1.5px_var(--accent)]"
                        }`}
                      >
                        {on ? "✓" : "+"}
                      </button>
                      <Link href={`/upsc-topper/${r.slug}`} className="flex w-[124px] items-center gap-2 sm:w-[230px] sm:gap-2.5">
                        <span className="tab w-7 shrink-0 sm:w-9 text-right text-[13px] font-semibold text-[var(--mark-deep)]">{r.rank}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.avatar} alt="" aria-hidden loading="lazy" width={28} height={28} className="hidden h-7 w-7 shrink-0 rounded-full bg-[#e9edff] object-cover object-top sm:block" />
                        <span className="min-w-0">
                          <span className="line-clamp-2 block font-semibold leading-[1.2] hover:text-[var(--accent)] sm:truncate">{r.name}</span>
                          <span className="block truncate text-[12.5px] text-[var(--muted)]">{r.optional || "—"}</span>
                        </span>
                      </Link>
                      </span>
                    </td>
                    {COLS.map((c) => {
                      const v = r[c.key];
                      const top = c.max > 0 && v > 0 && v >= cut[c.key];
                      return (
                        <td
                          key={c.key}
                          className={`tab border-t border-[var(--line)] px-3 py-1.5 text-right ${c.key === "written" ? "border-l" : ""} ${
                            c.key === "year" ? "text-[13.5px] text-[var(--muted)]" : c.strong ? "font-semibold" : "text-[var(--ink-2)]"
                          }`}
                        >
                          {v > 0 ? (
                            <span className={top ? "font-bold text-[var(--accent)]" : ""}>
                              {c.key === "year" ? v : fmt(v)}
                            </span>
                          ) : (
                            <span className="text-[var(--line-2)]">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={COLS.length + 1} className="px-5 py-12 text-center text-[15px] text-[var(--ink-2)]">
                    {`No topper matches${q ? ` “${q}”` : ""} with these filters.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[var(--line)] px-4 py-3 text-[13px] leading-[1.5] text-[var(--muted)] sm:px-5">
          Essay, GS and optional papers are out of 250, interview out of 275, final total out of 2,025. A dash means UPSC&apos;s paper-wise marks for that topper aren&apos;t on record yet. Press + on any two rows to compare them.
        </p>
      </div>

      {/* Compare tray */}
      {pickedRows.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
          <div className="mx-auto flex max-w-[640px] items-center gap-3 rounded-[22px] bg-[var(--ink)] p-2 pl-4 text-white shadow-[0_18px_40px_-16px_rgba(11,12,16,0.7)]">
            <div className="flex min-w-0 flex-1 items-center gap-2 text-[14px]">
              {pickedRows.map((r, i) => (
                <span key={r.slug} className="flex min-w-0 items-center gap-2">
                  {i > 0 && <span className="text-white/50">vs</span>}
                  <button type="button" onClick={() => pick(r.slug)} className="min-w-0 truncate rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20" title="Remove">
                    {r.name.split(" ")[0]} <span className="text-white/60">×</span>
                  </button>
                </span>
              ))}
              {pickedRows.length === 1 && <span className="truncate text-white/60">Pick one more</span>}
            </div>
            {pickedRows.length === 2 ? (
              <Link href={`/compare/${pickedRows[0].slug}-vs-${pickedRows[1].slug}`} data-track="marks-db-compare" className="btn btn-blue h-11 shrink-0 px-4 text-[14.5px]">
                Compare <span className="knob">→</span>
              </Link>
            ) : (
              <button type="button" onClick={() => setPicked([])} className="shrink-0 rounded-full px-3 py-2 text-[13.5px] text-white/70 hover:text-white">
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
