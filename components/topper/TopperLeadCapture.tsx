"use client";

import Outline from "@/components/brand/Outline";
import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";

interface Props {
  topperName: string;
  topperSlug: string;
}

export function TopperLeadCapture({ topperName, topperSlug }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          topperSlug,
          source: "topper_availability",
          sourceUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setAvailable(data.available);
      if (data.pdfUrls?.length) setPdfUrls(data.pdfUrls);
      else if (data.pdfUrl) setPdfUrls([data.pdfUrl]);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-track-view="topper_lead_form" className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)] sm:p-6">
      <Outline kind="envelope" className="-right-5 -top-5 h-28 w-40 rotate-[12deg] text-[var(--accent)]/[0.07]" />
      <h2 className="relative text-m font-bold">Get Free Answer Copies</h2>
      <p className="relative mt-1 text-s text-[var(--ink-2)]">
        Enter your email and we&apos;ll send you the free answer copies we have for {topperName}.
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="relative mt-4 flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="your@email.com"
            className="h-11 min-w-0 flex-1 rounded-full bg-[var(--canvas)] px-5 text-m outline-none shadow-[inset_0_0_0_1px_var(--line)] placeholder:text-[var(--muted)] focus:shadow-[inset_0_0_0_2px_var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-blue h-11 shrink-0 px-5 [--btn-fs:14px] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Free Copy"}
          </button>
        </form>
      ) : available ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-emerald-700">
            ✓ Check your inbox! We sent the download link{pdfUrls.length > 1 ? "s" : ""} for <strong>{topperName}</strong>.
          </p>
          {pdfUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {pdfUrls.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  <IconDownload size={14} />
                  Download {pdfUrls.length > 1 ? `Copy ${i + 1}` : "Now"}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm font-medium text-emerald-700">
            ✓ We&apos;ll send the download link for <strong>{topperName}</strong>&apos;s answer copy to your email shortly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="/store"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
            >
              Browse 50+ topper copies in the store
            </a>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
