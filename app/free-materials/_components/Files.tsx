"use client";

import { useEffect, useMemo, useState } from "react";
import type { Resource } from "@/lib/materials-meta";
import FreeCopyForm from "@/components/free/FreeCopyForm";

const pathOf = () => (typeof window === "undefined" ? "/" : window.location.pathname);
const unlockKey = (slug: string) => `up:unlocked:${slug}`;
const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    // Private mode: the gate just asks again next time.
  }
};

function isWpdmUrl(url: string) {
  return url.includes("pdfnotes.co/download/");
}

const TELEGRAM = "https://t.me/+2eV0YCTGdNcyNmFl";

/**
 * Every file in a collection (original wording). The first download asks for an email, recorded through
 * /api/free-material-download; after that the whole collection opens directly on this device.
 */
export default function Files({
  slug,
  title,
  category,
  files,
  single,
}: {
  slug: string;
  title: string;
  category: string;
  files: Resource[];
  single: boolean;
  downloads?: number;
}) {
  const [q, setQ] = useState("");
  const [section, setSection] = useState<string>("all");
  const [lang, setLang] = useState<"all" | "hi" | "en">("all");
  const [unlocked, setUnlocked] = useState(false);
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    // Restore what this browser already unlocked; localStorage is only readable after mount.
    setUnlocked(read(unlockKey(slug)) === "1");
  }, [slug]);

  const indexed = useMemo(() => files.map((f, i) => ({ ...f, i })), [files]);
  const sections = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of files) if (f.section) m.set(f.section, (m.get(f.section) ?? 0) + 1);
    return [...m];
  }, [files]);
  const hasHindi = files.some((f) => f.language === "hi" || f.language === "both");
  const hasEnglish = files.some((f) => f.language !== "hi");

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return indexed.filter(
      (f) =>
        (section === "all" || f.section === section) &&
        (lang === "all" || (lang === "hi" ? f.language === "hi" || f.language === "both" : f.language !== "hi")) &&
        (!t || f.name.toLowerCase().includes(t)),
    );
  }, [indexed, q, section, lang]);

  // Rows grouped under their section, in the original order.
  const grouped = useMemo(() => {
    const m = new Map<string, typeof shown>();
    for (const f of shown) {
      const key = f.section || "Resources";
      m.set(key, [...(m.get(key) ?? []), f]);
    }
    return [...m];
  }, [shown]);

  const leadSlug = (i: number) => (single ? slug : `${slug}-${i}`);

  // Once the request form has been sent, the whole collection opens on this device.
  function unlockAll() {
    write(unlockKey(slug), "1");
    setUnlocked(true);
    setPending(null);
  }

  // One file: the original download card.
  if (files.length === 1) {
    const f = indexed[0];
    const done = unlocked;
    return (
      <div className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2),0_10px_24px_-16px_rgba(11,12,16,0.3)]">
        <span className="inline-block rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-s font-bold text-white">Free Download</span>
        <h2 className="mt-3 text-m font-bold leading-snug">{title}</h2>
        <p className="mt-1 text-s text-[var(--muted)]">Answer a few quick questions and the link comes to your email.</p>
        {done ? (
          <div className="mt-4 rounded-[16px] bg-[#e9edff] p-4 text-center">
            <p className="text-m font-bold text-[var(--accent-deep)]">✓ Check your inbox!</p>
            <p className="mt-1 text-s text-[var(--accent-deep)]">We sent the download link to your email.</p>
            {!f.downloadUrl.startsWith("#") && (
              <a href={f.downloadUrl} target="_blank" rel="noopener noreferrer" data-track={`material-file-${slug}`} className="mt-3 inline-block text-s font-bold text-[var(--accent)] underline underline-offset-2">
                Click here to download again →
              </a>
            )}
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-paper mt-3 h-10 w-full justify-center px-4 [--btn-fs:14px]">
              Join on Telegram for daily current affairs →
            </a>
          </div>
        ) : (
          <div className="mt-4">
            <FreeCopyForm
              item="this PDF"
              target={{ kind: "material", pdfSlug: slug, pdfTitle: title, category, downloadUrl: files[0].downloadUrl, returnTo: pathOf() }}
              onUnlocked={unlockAll}
            />
          </div>
        )}
      </div>
    );
  }

  const chip = (on: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-s transition-colors ${on ? "bg-[var(--ink)] text-white" : "bg-[var(--canvas)] text-[var(--ink-2)] hover:text-[var(--ink)]"}`;

  return (
    <div>
      <div className="space-y-3">
        <label className="flex items-center gap-3 rounded-full bg-white py-1 pl-5 pr-1.5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="sr-only">Search resources</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources by name..." className="h-11 min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]" />
          {q && (
            <button type="button" onClick={() => setQ("")} className="rounded-full px-3 py-2 text-s text-[var(--muted)] hover:text-[var(--ink)]">
              Clear
            </button>
          )}
        </label>
        {(sections.length > 1 || (hasHindi && hasEnglish)) && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
            {sections.length > 1 && (
              <>
                <button type="button" onClick={() => setSection("all")} className={chip(section === "all")}>All</button>
                {sections.map(([s]) => (
                  <button key={s} type="button" onClick={() => setSection(s)} className={chip(section === s)}>{s}</button>
                ))}
              </>
            )}
            {hasHindi && hasEnglish && (
              <>
                {sections.length > 1 && <span aria-hidden className="mx-1 w-px shrink-0 bg-[var(--line-2)]" />}
                <button type="button" onClick={() => setLang(lang === "en" ? "all" : "en")} className={chip(lang === "en")}>EN</button>
                <button type="button" onClick={() => setLang(lang === "hi" ? "all" : "hi")} className={chip(lang === "hi")}>HI</button>
              </>
            )}
          </div>
        )}
      </div>

      {q && (
        <p className="mt-4 text-s text-[var(--muted)]">
          {`${shown.length} result${shown.length !== 1 ? "s" : ""} for “${q}”`}
        </p>
      )}

      <div className="mt-6 space-y-6">
        {grouped.map(([name, items]) => (
          <div key={name}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-m font-bold">{name}</span>
              <span className="rounded-full bg-[var(--canvas)] px-2 py-0.5 text-s text-[var(--muted)]">{`${items.length} resource${items.length !== 1 ? "s" : ""}`}</span>
            </div>
            <ul className="overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_var(--line-2)]">
              {items.map((f, idx) => {
                const wpdm = isWpdmUrl(f.downloadUrl);
                return (
                  <li key={f.i} className={idx > 0 ? "border-t border-[var(--line)]" : ""}>
                    <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                      {f.language === "hi" && <span className="shrink-0 rounded-[6px] bg-[#FDE9C4] px-1.5 py-0.5 text-s font-bold text-[#7a4b00]">HI</span>}
                      <span className="min-w-0 flex-1 truncate text-m">{f.name}</span>
                      {unlocked ? (
                        <a href={f.downloadUrl} target="_blank" rel="noopener noreferrer" data-track={`pdf-resource-dl-${slug}-${f.i}`} className="btn btn-blue h-9 shrink-0 px-4 [--btn-fs:14px]">
                          {wpdm ? "Open →" : "Download ↓"}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPending(f.i)}
                          data-track={`pdf-resource-dl-${slug}-${f.i}`}
                          className="btn btn-ink h-9 shrink-0 px-4 [--btn-fs:14px]"
                        >
                          {wpdm ? "Get Access →" : "Download ↓"}
                        </button>
                      )}
                    </div>
                    {pending === f.i && !unlocked && (
                      <div className="mx-4 mb-4 rounded-[16px] bg-[#e9edff] p-4">
                        <FreeCopyForm
                          item="this file"
                          target={{ kind: "material", pdfSlug: leadSlug(f.i), pdfTitle: f.name, category: "resource-collection", downloadUrl: f.downloadUrl, returnTo: pathOf() }}
                          onUnlocked={unlockAll}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {shown.length === 0 && <p className="py-8 text-center text-m text-[var(--muted)]">{`0 results for “${q}”`}</p>}
      </div>
    </div>
  );
}
