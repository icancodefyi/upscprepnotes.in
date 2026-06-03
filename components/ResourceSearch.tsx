"use client";

import { useState, useMemo } from "react";

interface Resource {
  name: string;
  downloadUrl: string;
  section?: string;
  language?: string;
}

function isWpdmUrl(url: string) {
  return url.includes("pdfnotes.co/download/");
}

export default function ResourceSearch({ resources, slug }: { resources: Resource[]; slug: string }) {
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const map = new Map<string, Resource[]>();
    for (const r of resources) {
      const sec = r.section || "All Resources";
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(r);
    }
    return map;
  }, [resources]);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    const filtered = new Map<string, Resource[]>();
    for (const [sec, items] of sections) {
      const matched = items.filter((r) => r.name.toLowerCase().includes(q));
      if (matched.length > 0) filtered.set(sec, matched);
    }
    return filtered;
  }, [query, sections]);

  const totalFiltered = useMemo(() => {
    let count = 0;
    for (const items of filteredSections.values()) count += items.length;
    return count;
  }, [filteredSections]);

  return (
    <div>
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search resources by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-0 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {query && (
        <p className="text-xs text-zinc-400 mb-4">
          {totalFiltered} result{totalFiltered !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="space-y-4">
        {Array.from(filteredSections.entries()).map(([sectionName, items]) => (
          <details
            key={sectionName}
            className="group rounded-xl border border-zinc-200 bg-white overflow-hidden"
            open={sections.size <= 2 || query.length > 0}
          >
            <summary className="flex items-center justify-between gap-3 px-5 py-3.5 cursor-pointer hover:bg-zinc-50 transition-colors list-none">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-semibold text-zinc-800 truncate">
                  {sectionName}
                </span>
                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full shrink-0 font-medium">
                  {items.length}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-zinc-400 shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-zinc-100 divide-y divide-zinc-50">
              {items.map((r, idx) => {
                const isWpdm = isWpdmUrl(r.downloadUrl);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {r.language === "hi" && (
                        <span className="text-[10px] font-bold text-zinc-400 uppercase shrink-0 border border-zinc-200 rounded px-1.5 py-0.5 leading-none">
                          HI
                        </span>
                      )}
                      <span className="text-sm text-zinc-700 truncate">{r.name}</span>
                    </div>
                    <a
                      href={r.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={`pdf-resource-dl-${slug}-${idx}`}
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full px-3.5 py-1.5 transition-colors"
                    >
                      {isWpdm ? "Open →" : "Download ↓"}
                    </a>
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
