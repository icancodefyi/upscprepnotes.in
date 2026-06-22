"use client";

import { useState, useMemo, useCallback } from "react";

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
  // Track which resource index has an active email form
  const [activating, setActivating] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set());

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

  // Compute global index for each resource
  const flatResources = useMemo(() => {
    const flat: { resource: Resource; globalIdx: number }[] = [];
    let idx = 0;
    for (const [, items] of sections) {
      for (const r of items) {
        flat.push({ resource: r, globalIdx: idx++ });
      }
    }
    return flat;
  }, [sections]);

  const getGlobalIdx = useCallback(
    (sectionName: string, itemIdx: number) => {
      let idx = 0;
      for (const [sec, items] of sections) {
        for (let i = 0; i < items.length; i++) {
          if (sec === sectionName && i === itemIdx) return idx;
          idx++;
        }
      }
      return -1;
    },
    [sections]
  );

  const handleDownloadClick = useCallback(
    (globalIdx: number) => {
      if (unlocked.has(globalIdx)) {
        const r = flatResources[globalIdx]?.resource;
        if (r) window.open(r.downloadUrl, "_blank", "noopener,noreferrer");
        return;
      }
      setActivating(globalIdx);
      setEmail("");
    },
    [unlocked, flatResources]
  );

  const handleSubmit = useCallback(
    async (globalIdx: number) => {
      if (!email.trim()) return;
      setLoadingIdx(globalIdx);
      try {
        const r = flatResources[globalIdx]?.resource;
        if (!r) return;
        const res = await fetch("/api/free-material-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            pdfSlug: `${slug}-${globalIdx}`,
            pdfTitle: r.name,
            category: "resource-collection",
            downloadUrl: r.downloadUrl,
          }),
        });
        if (!res.ok) return;
        window.open(r.downloadUrl, "_blank", "noopener,noreferrer");
        setUnlocked((prev) => new Set(prev).add(globalIdx));
        setActivating(null);
      } catch {
      } finally {
        setLoadingIdx(null);
      }
    },
    [email, flatResources, slug]
  );

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
        {Array.from(filteredSections.entries()).map(([sectionName, items]) => {
          let sectionOffset = 0;
          for (const [sec] of sections) {
            if (sec === sectionName) break;
            sectionOffset += sections.get(sec)!.length;
          }

          return (
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
                  const globalIdx = sectionOffset + idx;
                  const isActivating = activating === globalIdx;
                  const isUnlocked = unlocked.has(globalIdx);
                  const isLoading = loadingIdx === globalIdx;
                  const isWpdm = isWpdmUrl(r.downloadUrl);

                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {r.language === "hi" && (
                            <span className="text-[10px] font-bold text-zinc-400 uppercase shrink-0 border border-zinc-200 rounded px-1.5 py-0.5 leading-none">
                              HI
                            </span>
                          )}
                          <span className="text-sm text-zinc-700 truncate">{r.name}</span>
                        </div>
                        {isUnlocked ? (
                          <a
                            href={r.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-track={`pdf-resource-dl-${slug}-${idx}`}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-full px-3.5 py-1.5 transition-colors"
                          >
                            {isWpdm ? "Open →" : "Download ↓"}
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDownloadClick(globalIdx)}
                            data-track={`pdf-resource-dl-${slug}-${idx}`}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full px-3.5 py-1.5 transition-colors"
                          >
                            {isWpdm ? "Open →" : "Download ↓"}
                          </button>
                        )}
                      </div>
                      {isActivating && (
                        <form
                          onSubmit={(e) => { e.preventDefault(); handleSubmit(globalIdx); }}
                          className="flex items-center gap-2 px-5 pb-3"
                        >
                          <input
                            type="email"
                            required
                            placeholder="Enter your email to get the link"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={isLoading || !email.trim()}
                            className="shrink-0 rounded-full bg-zinc-900 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 transition"
                          >
                            {isLoading ? "..." : "Get Link →"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivating(null)}
                            className="text-xs text-zinc-400 hover:text-zinc-600"
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
