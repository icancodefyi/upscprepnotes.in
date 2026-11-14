"use client";

import Outline from "@/components/brand/Outline";
import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";

interface Props {
  topperName: string;
  topperSlug: string;
  /** False when we do not hold this topper's copy yet. */
  hasCopy?: boolean;
}

export function TopperLeadCapture({ topperName, topperSlug, hasCopy = true }: Props) {
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
    let leaving = false;
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
      // Send them to the "getting your files ready" page; the download is delivered there.
      if (data.redirect) {
        leaving = true;
        window.location.assign(data.redirect);
        return;
      }
      setAvailable(data.available);
      if (data.pdfUrls?.length) setPdfUrls(data.pdfUrls);
      else if (data.pdfUrl) setPdfUrls([data.pdfUrl]);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!leaving) setLoading(false);
    }
  }

  return (
    <div data-track-view="topper_lead_form" className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)] sm:p-6">
      <Outline kind="envelope" className="-right-5 -top-5 h-28 w-40 rotate-[12deg] text-[var(--accent)]/[0.07]" />
      <h2 className="relative text-m font-bold">{hasCopy ? "Get Free Answer Copies" : `Get ${topperName}'s copy when it's available`}</h2>
      <p className="relative mt-1 text-s text-[var(--ink-2)]">
        {hasCopy
          ? `Enter your email and we'll send you the free answer copies we have for ${topperName}.`
          : `We don't have ${topperName}'s answer copy yet. Enter your email and we'll send it as soon as we get it. We can't promise a date.`}
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
            {loading ? "Sending..." : hasCopy ? "Send Free Copy" : "Notify me"}
          </button>
        </form>
      ) : available ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-[#172fa3]">
            ✓ Check your inbox! We sent the download link{pdfUrls.length > 1 ? "s" : ""} for <strong>{topperName}</strong>.
          </p>
          {pdfUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {pdfUrls.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3fd6] px-4 py-2 text-xs font-bold text-white hover:bg-[#172fa3] transition-colors"
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
          <p className="text-sm font-medium text-[#172fa3]">
            ✓ Saved. We don&apos;t have <strong>{topperName}</strong>&apos;s copy yet, and we&apos;ll email you when we do.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="/store/answer-copies-compilation?utm_source=site&utm_medium=topper_page&utm_campaign=copy_pending"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3fd6] px-4 py-2 text-xs font-bold text-white hover:bg-[#172fa3] transition-colors"
            >
              See real copies from 27 other toppers
            </a>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
