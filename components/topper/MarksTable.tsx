"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IconArrowUp, IconArrowDown, IconSearch } from "@tabler/icons-react";

interface TopperRow {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  slug: string;
  marks: {
    gs1: number;
    gs2: number;
    gs3: number;
    gs4: number;
    essay: number;
    optional1: number;
    optional2: number;
    written: number;
    interview: number;
    total: number;
  };
}

interface Props {
  toppers: TopperRow[];
}

type SortKey = keyof TopperRow["marks"] | "rank" | "year";
type SortDir = "asc" | "desc";

const COLS: { key: SortKey; label: string }[] = [
  { key: "rank", label: "Rank" },
  { key: "year", label: "Year" },
  { key: "essay", label: "Essay" },
  { key: "gs1", label: "GS1" },
  { key: "gs2", label: "GS2" },
  { key: "gs3", label: "GS3" },
  { key: "gs4", label: "GS4" },
  { key: "optional1", label: "Opt P1" },
  { key: "optional2", label: "Opt P2" },
  { key: "written", label: "Written" },
  { key: "interview", label: "Interview" },
  { key: "total", label: "Total" },
];

export default function MarksTable({ toppers }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search, setSearch] = useState("");

  const sorted = useMemo(() => {
    const filtered = toppers.filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.optionalSubject.toLowerCase().includes(q) ||
        String(t.rank).includes(q) ||
        String(t.year).includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      let av: number, bv: number;
      if (sortKey === "rank") { av = a.rank; bv = b.rank; }
      else if (sortKey === "year") { av = a.year; bv = b.year; }
      else {
        const mk = sortKey as keyof typeof a.marks;
        av = a.marks[mk] || 0;
        bv = b.marks[mk] || 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [toppers, sortKey, sortDir, search]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rank" || key === "year" ? "asc" : "desc");
    }
  }

  return (
    <div>
      <div className="relative mb-4">
        <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, rank, optional subject..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/50">
              <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-3 py-3 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sorted.map((t) => (
              <tr key={t.slug} className="hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2.5">
                  <Link
                    href={`/upsc-topper/${t.slug}`}
                    className="font-semibold text-emerald-700 hover:text-emerald-600 hover:underline"
                  >
                    {t.firstName} {t.lastName}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">{t.optionalSubject}</p>
                </td>
                <td className="px-3 py-2.5 text-right font-medium">{t.rank}</td>
                <td className="px-3 py-2.5 text-right">{t.year}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.essay || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.gs1 || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.gs2 || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.gs3 || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.gs4 || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.optional1 || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.optional2 || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.written || "—"}</td>
                <td className="px-3 py-2.5 text-right">{t.marks.interview || "—"}</td>
                <td className="px-3 py-2.5 text-right font-bold">{t.marks.total || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground text-center">
        Showing {sorted.length} of {toppers.length} toppers. Click column headers to sort. Click name for full profile.
      </p>
    </div>
  );
}
