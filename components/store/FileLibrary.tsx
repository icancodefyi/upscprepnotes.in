"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Gilu from "@/components/brand/Gilu";
import { DownloadIcon, ZipIcon } from "@/components/store/icons";

type LibFile = { name: string; url: string; size: string; path: string };
type LibGroup = { title: string; files: LibFile[] };
type Props = {
  /** Used to remember which files this browser has opened. */
  storageKey: string;
  zipUrl: string;
  groups: LibGroup[];
};

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";
const PALETTE = [
  { bg: "#dbe2fb", fg: "#172fa3" },
  { bg: "#fff1b8", fg: "#6b5200" },
  { bg: "#d9f3e2", fg: "#14613a" },
  { bg: "#ffe0dc", fg: "#9b2a1f" },
  { bg: "#ece5ff", fg: "#4a2fb0" },
];

/** "Abhishek Sharma (AIR 38, 2024)" → name, rank and year. Anything else is shown as it is. */
function parseTitle(title: string): { name: string; rank?: string; year?: string } {
  const m = title.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (!m) return { name: title };
  const parts = m[2].split(",").map((s) => s.trim());
  return { name: m[1], rank: parts.find((p) => /^AIR\s*\d+/i.test(p)), year: parts.find((p) => /^\d{4}$/.test(p)) };
}

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

function paletteFor(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return PALETTE[sum % PALETTE.length];
}

/* Which files this browser has opened, kept on the device only. */
function useOpened(storageKey: string) {
  const key = `dl-opened:${storageKey}`;
  const subscribe = (cb: () => void) => {
    window.addEventListener("storage", cb);
    window.addEventListener("dl-opened", cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener("dl-opened", cb);
    };
  };
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
    },
    () => "",
  );
  const opened = useMemo(() => new Set(raw ? raw.split("|") : []), [raw]);
  const mark = (path: string) => {
    if (opened.has(path)) return;
    try {
      localStorage.setItem(key, [...opened, path].join("|"));
      window.dispatchEvent(new Event("dl-opened"));
    } catch {}
  };
  return { opened, mark };
}

export default function FileLibrary({ storageKey, zipUrl, groups }: Props) {
  const [query, setQuery] = useState("");
  const { opened, mark } = useOpened(storageKey);

  const parsed = useMemo(() => groups.map((g) => ({ ...g, ...parseTitle(g.title) })), [groups]);
  const q = query.trim().toLowerCase();
  const shown = parsed.filter((g) => {
    if (!q) return true;
    return g.title.toLowerCase().includes(q) || g.files.some((f) => f.name.toLowerCase().includes(q));
  });
  const showToolbar = groups.length > 6;

  return (
    <div>
      {/* The one-click option comes first, for laptops. */}
      <a href={zipUrl} className={`${card} flex items-center gap-4 p-4 transition-transform hover:-translate-y-[1px] sm:p-5`}>
        <ZipIcon size={52} />
        <span className="min-w-0 flex-1">
          <span className="block text-m font-bold leading-snug">Get everything in one ZIP</span>
          <span className="mt-0.5 block text-s text-[var(--muted)]">Best on a laptop with Wi-Fi.</span>
        </span>
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white"
          style={{ background: "linear-gradient(180deg, #3a58e4, #1f3fd6)", boxShadow: "0 3px 0 #13238a, inset 0 1px 0 rgba(255,255,255,.3)" }}
        >
          <DownloadIcon size={20} />
        </span>
      </a>

      {showToolbar && (
        <div className="mt-7">
          <label htmlFor="lib-search" className="sr-only">Search by name or rank</label>
          <div className="relative">
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <input
              id="lib-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a topper by name or rank"
              className="h-12 w-full rounded-2xl bg-white pl-12 pr-4 text-m shadow-[0_0_0_1.5px_var(--line-2)] outline-none transition focus:shadow-[0_0_0_2px_var(--accent)]"
            />
          </div>

        </div>
      )}

      <div className="mt-5 space-y-3">
        {shown.map((g, index) => {
          const color = paletteFor(g.name);
          const meta = [g.rank, g.year ? `CSE ${g.year}` : null, g.files.length > 1 ? `${g.files.length} files` : null].filter(Boolean).join(" · ");
          return (
            <details key={`${g.title}-${q}`} open={q && shown.length <= 6 ? true : !showToolbar && index === 0} className={`${card} group overflow-hidden`}>
              <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-4 transition-colors hover:bg-[var(--canvas)] sm:px-5 [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-bold" style={{ background: color.bg, color: color.fg }}>
                  {initials(g.name) || "·"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-m font-bold leading-snug">{g.name}</span>
                  {meta && <span className="mt-0.5 block text-s text-[var(--muted)]">{meta}</span>}
                </span>
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180">
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <ul className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
                {g.files.map((f) => {
                  const seen = opened.has(f.path);
                  return (
                    <li key={f.path}>
                      <a href={f.url} onClick={() => mark(f.path)} className="flex items-center gap-3 px-4 py-3.5 text-s transition-colors hover:bg-[var(--canvas)] sm:px-5">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold text-[var(--ink)]">{f.name}</span>
                          <span className="block text-[var(--muted)]">{f.size}</span>
                        </span>
                        <span
                          aria-hidden
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                          style={seen ? { background: "#d9f3e2", color: "#14613a" } : { background: "#e3e8fb", color: "var(--accent)" }}
                        >
                          {seen ? (
                            <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="m5.5 12.8 4.5 4.4L18.6 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          ) : (
                            <DownloadIcon size={16} />
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}

        {shown.length === 0 && (
          <div className={`${card} px-6 py-10 text-center`}>
            <Gilu pose="thinking" size={120} className="mx-auto h-auto w-[100px]" />
            <p className="mt-3 text-m font-bold">No one matches that</p>
            <p className="mt-1 text-s text-[var(--muted)]">Try a first name or an AIR number.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2.5 text-s font-bold text-white"
            >
              Show everyone
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
