"use client";

import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import { trackClientEvent } from "@/lib/client-analytics";

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
      trackClientEvent("free_download_lead", {
        topperSlug,
        topperName,
        available: data.available,
        email: email.trim(),
        source: "availability_section",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <h2 className="text-lg font-semibold">Get Free Answer Copies</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you the free answer copies we have for {topperName}.
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="your@email.com"
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
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
