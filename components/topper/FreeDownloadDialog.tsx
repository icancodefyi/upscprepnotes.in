"use client";

import { useState } from "react";
import { IconDownload, IconX, IconCheck, IconClock } from "@tabler/icons-react";
import { trackClientEvent } from "@/lib/client-analytics";

interface FreeDownloadDialogProps {
  topperName: string;
  topperSlug: string;
  freeAnswerCopyUrl?: string | null;
  onOpenChange: (open: boolean) => void;
}

export function FreeDownloadDialog({ topperName, topperSlug, freeAnswerCopyUrl, onOpenChange }: FreeDownloadDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [available, setAvailable] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [dialogError, setDialogError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setDialogError("Email is required");
      return;
    }
    setLoading(true);
    setDialogError("");

    try {
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          topperSlug,
          name: name.trim() || undefined,
          source: "topper_page",
          sourceUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setAvailable(data.available);
      if (data.pdfUrl) setPdfUrl(data.pdfUrl);
      setSubmitted(true);
      trackClientEvent("free_download_lead", { topperSlug, topperName, available: data.available });
    } catch (err: any) {
      setDialogError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!downloaded) {
      setDownloaded(true);
      trackClientEvent("file_download", {
        topperSlug,
        topperName,
        fileType: "answer_copy",
        source: "free_download_dialog",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <IconX size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <IconDownload size={24} className="text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold">Get Your Free Answer Copy</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email to receive <strong>{topperName}</strong>&apos;s answer copy.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Name <span className="text-gray-400">(optional)</span></label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Email *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="We will send the download link here"
                />
              </div>
              {dialogError && (
                <p className="text-xs text-red-500">{dialogError}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all"
              >
                {loading ? "Sending..." : "Get Download Link"}
              </button>
            </form>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              No spam, unsubscribe anytime.
            </p>
          </>
        ) : available ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Check Your Inbox!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent the download link for <strong>{topperName}</strong>&apos;s answer copy to <strong>{email}</strong>.
            </p>
            {pdfUrl && (
              <div className="mt-4">
                <a
                  href={pdfUrl}
                  download
                  onClick={handleDownload}
                  data-track="free-download-pdf"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  <IconDownload size={16} />
                  Download Now
                </a>
              </div>
            )}
            <p className="mt-6 text-xs text-muted-foreground">
              Want more?{" "}
              <button
                onClick={() => onOpenChange(false)}
                className="text-emerald-600 font-semibold underline cursor-pointer"
              >
                Get 50+ topper copies in the complete bundle
              </button>
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <IconClock size={24} className="text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold">We&apos;re Working on It!</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Thanks for requesting <strong>{topperName}</strong>&apos;s answer copy. We&apos;re sourcing it and will email it to you shortly.
            </p>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
              <p className="text-xs font-semibold text-amber-800">🎁 Complementary Offer</p>
              <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                If we can&apos;t deliver within 48 hours, we&apos;ll give you <strong>free access to our premium strategy guides</strong> (worth ₹649) as a thank-you.
              </p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              In the meantime,{" "}
              <button
                onClick={() => onOpenChange(false)}
                className="text-emerald-600 font-semibold underline cursor-pointer"
              >
                browse the complete bundle
              </button>
              {" "}with 50+ topper copies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
