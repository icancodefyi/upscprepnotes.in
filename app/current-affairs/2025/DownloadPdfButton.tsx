"use client";

import { useState } from "react";

type DownloadPdfButtonState = "idle" | "loading" | "error";

/**
 * Download button with immediate click feedback.
 *
 * The Download PDF link on this page was the site's #1 rage-clicked element:
 * it was a plain <a> that navigated the tab to a ~1.5 MB PDF with no visible
 * loading state, so every rapid re-click aborted and restarted the in-flight
 * request and the button looked dead. Here we intercept the click, show a
 * "Generating…" spinner, ignore repeat clicks while a request is in flight,
 * and stream the PDF to a real file download.
 */
export default function DownloadPdfButton({
  month,
  className,
  label = "Download PDF",
  iconClassName = "h-3.5 w-3.5",
}: {
  month: string;
  className?: string;
  label?: string;
  iconClassName?: string;
}) {
  const [state, setState] = useState<DownloadPdfButtonState>("idle");

  async function handleDownload() {
    // Dedupe: one intent fires one request. Ignore clicks while downloading.
    if (state === "loading") return;
    setState("loading");

    try {
      const res = await fetch(`/api/generate-current-affairs?month=${month}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `current-affairs-${month}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);

      setState("idle");
    } catch {
      setState("error");
    }
  }

  const isLoading = state === "loading";

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`${className ?? ""} disabled:cursor-wait disabled:opacity-70`}
    >
      {isLoading ? (
        <svg className={`${iconClassName} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {isLoading ? "Generating…" : state === "error" ? "Retry download" : label}
    </button>
  );
}
