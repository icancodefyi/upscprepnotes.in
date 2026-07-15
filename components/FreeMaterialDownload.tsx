"use client";

import { useState, useCallback } from "react";

interface FreeMaterialDownloadProps {
  downloadUrl: string;
  pdfSlug: string;
  pdfTitle: string;
  category: string;
}

export default function FreeMaterialDownload({
  downloadUrl,
  pdfSlug,
  pdfTitle,
  category,
}: FreeMaterialDownloadProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setStatus("loading");

      try {
        const res = await fetch("/api/free-material-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            pdfSlug,
            pdfTitle,
            category,
            downloadUrl,
          }),
        });

        if (!res.ok) {
          setStatus("error");
          return;
        }

        window.open(downloadUrl, "_blank", "noopener,noreferrer");
        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [email, downloadUrl, pdfSlug, pdfTitle, category]
  );

  return (
    <section className="mb-16 overflow-hidden rounded-2xl border border-brand/20 bg-brand-muted p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-muted border border-brand/20 shrink-0">
          <span className="text-3xl">📄</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-2">
            Free Download
          </span>
          <h2 className="text-lg font-bold text-zinc-800">{pdfTitle}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your email to get the download link instantly.
          </p>
        </div>
      </div>

      {status !== "success" ? (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="shrink-0 rounded-full bg-brand px-8 py-3 text-sm font-bold text-white hover:bg-brand disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
          >
            {status === "loading" ? "Sending..." : "Get Free PDF →"}
          </button>
        </form>
      ) : (
        <div className="mt-5 rounded-xl bg-brand-muted border border-brand/20 p-5 text-center">
          <p className="text-base font-bold text-emerald-800">✓ Check your inbox!</p>
          <p className="mt-1 text-sm text-brand">
            We sent the download link to <strong>{email}</strong>.
          </p>
          {!downloadUrl.startsWith("#") && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-brand underline underline-offset-2 hover:text-brand"
            >
              Click here to download again →
            </a>
          )}
          <a
            href="https://t.me/+VYMxrig-a8AzZmNl"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-[#0088cc]/30 bg-[#e8f4fd] px-4 py-2 text-xs font-semibold text-[#0088cc] transition hover:bg-[#d4edfc]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join on Telegram for daily current affairs →
          </a>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
    </section>
  );
}
