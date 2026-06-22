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
    <section className="mb-16 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 shrink-0">
          <span className="text-3xl">📄</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-2">
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
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="shrink-0 rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
          >
            {status === "loading" ? "Sending..." : "Get Free PDF →"}
          </button>
        </form>
      ) : (
        <div className="mt-5 rounded-xl bg-emerald-100 border border-emerald-200 p-5 text-center">
          <p className="text-base font-bold text-emerald-800">✓ Check your inbox!</p>
          <p className="mt-1 text-sm text-emerald-700">
            We sent the download link to <strong>{email}</strong>.
          </p>
          {!downloadUrl.startsWith("#") && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
            >
              Click here to download again →
            </a>
          )}
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
