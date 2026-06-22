"use client";

import { useState, useMemo, useCallback } from "react";

interface Resource {
  name: string;
  downloadUrl: string;
  section?: string;
  language?: string;
}

const SECTION_COLORS: Record<string, { bar: string; bg: string; badge: string }> = {
  "Test 1-5": { bar: "bg-emerald-500", bg: "bg-emerald-50", badge: "bg-emerald-500" },
  "Test 6-10": { bar: "bg-sky-500", bg: "bg-sky-50", badge: "bg-sky-500" },
  "Test 11-15": { bar: "bg-violet-500", bg: "bg-violet-50", badge: "bg-violet-500" },
  "Test 16-20": { bar: "bg-amber-500", bg: "bg-amber-50", badge: "bg-amber-500" },
  "Test 21-25": { bar: "bg-rose-500", bg: "bg-rose-50", badge: "bg-rose-500" },
};

function getColors(section: string) {
  return SECTION_COLORS[section] || { bar: "bg-emerald-500", bg: "bg-emerald-50", badge: "bg-emerald-500" };
}

function isWpdmUrl(url: string) {
  return url.includes("pdfnotes.co/download/");
}

export default function ResourceSearch({ resources, slug }: { resources: Resource[]; slug: string }) {
  const [query, setQuery] = useState("");
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
      {/* Search */}
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

      {/* Sections */}
      <div className="space-y-6">
        {Array.from(filteredSections.entries()).map(([sectionName, items]) => {
          let sectionOffset = 0;
          for (const [sec] of sections) {
            if (sec === sectionName) break;
            sectionOffset += sections.get(sec)!.length;
          }

          return (
            <div key={sectionName}>
              {/* Section header */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-800">{sectionName}</span>
                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
                  {items.length} resource{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Resource cards */}
              <div className="space-y-2">
                {items.map((r, idx) => {
                  const globalIdx = sectionOffset + idx;
                  const isActivating = activating === globalIdx;
                  const isUnlocked = unlocked.has(globalIdx);
                  const isLoading = loadingIdx === globalIdx;
                  const isWpdm = isWpdmUrl(r.downloadUrl);
                  const colors = getColors(sectionName);

                  return (
                    <div key={idx} className="group">
                      <div className={`relative flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 transition-all hover:shadow-md hover:border-zinc-300 ${isActivating ? "shadow-md border-emerald-300" : ""}`}>
                        {/* Color accent bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${colors.bar}`} />

                        <div className="flex items-center gap-3 min-w-0 flex-1 pl-2">
                          {r.language === "hi" && (
                            <span className="text-[10px] font-bold text-orange-600 uppercase shrink-0 border border-orange-200 rounded px-1.5 py-0.5 leading-none bg-orange-50">
                              HI
                            </span>
                          )}
                          <span className="text-sm font-semibold text-zinc-800 truncate">
                            {r.name}
                          </span>
                        </div>

                        {isUnlocked ? (
                          <a
                            href={r.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-track={`pdf-resource-dl-${slug}-${idx}`}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full px-4 py-2 transition-all shadow-sm hover:shadow-md"
                          >
                            {isWpdm ? "Open →" : "Download ↓"}
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDownloadClick(globalIdx)}
                            data-track={`pdf-resource-dl-${slug}-${idx}`}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-full px-4 py-2 transition-all shadow-sm hover:shadow-md"
                          >
                            {isWpdm ? "Get Access →" : "Download ↓"}
                          </button>
                        )}
                      </div>

                      {/* Email form */}
                      {isActivating && (
                        <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                          <form
                            onSubmit={(e) => { e.preventDefault(); handleSubmit(globalIdx); }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                          >
                            <div className="flex-1">
                              <label className="text-xs font-medium text-emerald-800 mb-1 block">
                                Enter your email to download <strong>{r.name}</strong>
                              </label>
                              <input
                                type="email"
                                required
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                                className="w-full rounded-lg border border-emerald-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition disabled:opacity-50"
                              />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="submit"
                                disabled={isLoading || !email.trim()}
                                className="rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition shadow-sm"
                              >
                                {isLoading ? "Sending..." : "Get Link →"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActivating(null)}
                                className="text-xs text-zinc-500 hover:text-zinc-700 px-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
