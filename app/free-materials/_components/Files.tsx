"use client";

import { useEffect, useMemo, useState } from "react";
import type { Resource } from "@/lib/materials-meta";

const EMAIL_KEY = "up:email";
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

/**
 * Every file in a collection. The first download asks for an email (recorded through the existing
 * /api/free-material-download); after that the whole collection opens directly, with no repeat forms.
 */
export default function Files({ slug, title, category, files, single }: { slug: string; title: string; category: string; files: Resource[]; single: boolean }) {
  const [q, setQ] = useState("");
  const [section, setSection] = useState<string>("all");
  const [lang, setLang] = useState<"all" | "hi" | "en">("all");
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    // Restore what this browser already unlocked; localStorage is only readable after mount.
    setUnlocked(read(unlockKey(slug)) === "1");
    setEmail(read(EMAIL_KEY) ?? "");
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

  const leadSlug = (i: number) => (single ? slug : `${slug}-${i}`);

  async function unlock(i: number) {
    const f = files[i];
    if (!f || !email.trim()) return;
    setStatus("loading");
    // Open the tab now (inside the click) so popup blockers allow it, then point it at the file.
    const tab = window.open("", "_blank");
    try {
      const res = await fetch("/api/free-material-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), pdfSlug: leadSlug(i), pdfTitle: single ? title : f.name, category: single ? category : "resource-collection", downloadUrl: f.downloadUrl }),
      });
      if (!res.ok) throw new Error();
      write(EMAIL_KEY, email.trim());
      write(unlockKey(slug), "1");
      setUnlocked(true);
      setPending(null);
      setStatus("idle");
      if (tab) tab.location.href = f.downloadUrl;
      else window.location.href = f.downloadUrl;
    } catch {
      tab?.close();
      setStatus("error");
    }
  }

  const chip = (on: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors ${on ? "bg-[var(--ink)] text-white" : "bg-[var(--canvas)] text-[var(--ink-2)] hover:text-[var(--ink)]"}`;

  return (
    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2)]">
      {files.length > 6 && (
        <div className="space-y-3 border-b border-[var(--line)] p-4 sm:p-5">
          <label className="flex items-center gap-3 rounded-full bg-[var(--canvas)] py-1 pl-4 pr-1 focus-within:shadow-[inset_0_0_0_2px_var(--accent)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span className="sr-only">Search files</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${files.length} files`} className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--muted)]" />
          </label>
          {(sections.length > 1 || (hasHindi && hasEnglish)) && (
            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
              {sections.length > 1 && (
                <>
                  <button type="button" onClick={() => setSection("all")} className={chip(section === "all")}>All</button>
                  {sections.map(([s, k]) => (
                    <button key={s} type="button" onClick={() => setSection(s)} className={chip(section === s)}>
                      {s} <span className="tab opacity-60">{k}</span>
                    </button>
                  ))}
                </>
              )}
              {hasHindi && hasEnglish && (
                <>
                  {sections.length > 1 && <span aria-hidden className="mx-1 w-px shrink-0 bg-[var(--line-2)]" />}
                  <button type="button" onClick={() => setLang(lang === "en" ? "all" : "en")} className={chip(lang === "en")}>English</button>
                  <button type="button" onClick={() => setLang(lang === "hi" ? "all" : "hi")} className={chip(lang === "hi")}>हिंदी</button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 bg-[var(--canvas)]/60 px-5 py-2.5 text-[13px] text-[var(--muted)]">
        <span>{shown.length === files.length ? `${files.length} file${files.length === 1 ? "" : "s"}` : `${shown.length} of ${files.length} files`}</span>
        <span className={unlocked ? "font-semibold text-[#14532d]" : ""}>{unlocked ? "✓ Unlocked on this device" : "One email unlocks every file here"}</span>
      </div>

      <ul className="max-h-[720px] divide-y divide-[var(--line)] overflow-y-auto">
        {shown.map((f) => (
          <li key={f.i}>
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="t-meta tab w-8 shrink-0">{String(f.i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{f.name}</span>
                {(f.section || f.language === "hi") && (
                  <span className="mt-0.5 flex items-center gap-2 text-[12px] text-[var(--muted)]">
                    {f.section && <span className="truncate">{f.section}</span>}
                    {f.language === "hi" && <span className="rounded-full bg-[#FDE9C4] px-1.5 font-semibold text-[#7a4b00]">हिंदी</span>}
                  </span>
                )}
              </span>
              {unlocked ? (
                <a href={f.downloadUrl} target="_blank" rel="noopener noreferrer" data-track={`material-file-${slug}`} className="btn btn-blue h-9 shrink-0 px-4 text-[13.5px]">
                  Download
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => (email && pending === null && read(EMAIL_KEY) ? unlock(f.i) : setPending(f.i))}
                  data-track={`material-file-gate-${slug}`}
                  className="btn btn-ink h-9 shrink-0 px-4 text-[13.5px]"
                >
                  Download
                </button>
              )}
            </div>
            {pending === f.i && !unlocked && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  unlock(f.i);
                }}
                className="mx-4 mb-4 rounded-[18px] bg-[#e9edff] p-4"
              >
                <label htmlFor={`m-email-${f.i}`} className="text-[14px] font-medium text-[var(--accent-deep)]">
                  {files.length > 1 ? `Enter your email once to unlock all ${files.length} files.` : "Enter your email to download."}
                </label>
                <div className="mt-2.5 flex items-center rounded-full bg-white p-1 pl-4 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
                  <input
                    id={`m-email-${f.i}`}
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--muted)]"
                  />
                  <button type="submit" disabled={status === "loading"} className="btn btn-blue h-10 px-4 text-[14px]">
                    {status === "loading" ? "Opening…" : "Download"}
                  </button>
                </div>
                {status === "error" && <p className="mt-2 text-[13px] text-[var(--mark-deep)]">That didn&apos;t go through. Try again.</p>}
                <p className="mt-2 text-[12px] text-[var(--accent-deep)]/70">The file opens in a new tab and the link is emailed to you.</p>
              </form>
            )}
          </li>
        ))}
        {shown.length === 0 && <li className="px-5 py-8 text-center text-[14.5px] text-[var(--muted)]">{`No file matches “${q}”.`}</li>}
      </ul>
    </div>
  );
}
