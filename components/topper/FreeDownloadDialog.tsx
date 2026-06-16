"use client";

import { useState, useEffect } from "react";
import { IconDownload, IconX, IconCheck, IconClock, IconStar, IconEye, IconLayoutKanban } from "@tabler/icons-react";
import { trackClientEvent } from "@/lib/client-analytics";

interface FreeDownloadDialogProps {
  topperName: string;
  topperSlug: string;
  freeAnswerCopyUrl?: string | null;
  freeAnswerCopyUrls?: string[];
  onOpenChange: (open: boolean) => void;
}

export function FreeDownloadDialog({ topperName, topperSlug, freeAnswerCopyUrl, freeAnswerCopyUrls, onOpenChange }: FreeDownloadDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [available, setAvailable] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [dialogError, setDialogError] = useState("");

  useEffect(() => {
    trackClientEvent("dialog_open", { dialog: "free_download", topperSlug, topperName });
  }, []);

  function handleClose() {
    trackClientEvent("dialog_close", { dialog: "free_download", topperSlug, topperName, submitted });
    onOpenChange(false);
  }

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
          source: "topper_page",
          sourceUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setAvailable(data.available);
      if (data.pdfUrls?.length) setPdfUrls(data.pdfUrls);
      else if (data.pdfUrl) setPdfUrls([data.pdfUrl]);
      setSubmitted(true);
      trackClientEvent("dialog_submit", { dialog: "free_download", topperSlug, topperName, status: data.available ? "delivered" : "pending", email: email.trim() });
      trackClientEvent("free_download_lead", { topperSlug, topperName, available: data.available, count: data.pdfUrls?.length || 1, email: email.trim() });
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <IconX size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-5">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <IconDownload size={24} className="text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold">Get {topperName}&apos;s Answer Copy</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                See the exact handwriting, structure, and presentation that scored high marks in UPSC Mains.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-center">
                <IconStar size={16} className="mx-auto text-emerald-600" />
                <p className="mt-1 text-[10px] font-medium text-gray-700 leading-tight">Real answer structure</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 text-center">
                <IconEye size={16} className="mx-auto text-emerald-600" />
                <p className="mt-1 text-[10px] font-medium text-gray-700 leading-tight">Handwriting analysis</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 text-center">
                <IconLayoutKanban size={16} className="mx-auto text-emerald-600" />
                <p className="mt-1 text-[10px] font-medium text-gray-700 leading-tight">Time management</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Email *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Send the download link here"
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
                {loading ? "Sending..." : "Send My Free Copy →"}
              </button>
            </form>
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
              <span>🔒 Free download</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>No spam</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>Unsubscribe anytime</span>
            </div>
          </>
        ) : available ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Check Your Inbox!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent {pdfUrls.length > 1 ? `${pdfUrls.length} answer copies` : "the download link"} for <strong>{topperName}</strong> to <strong>{email}</strong>.
            </p>
            {pdfUrls.length > 0 && (
              <div className="mt-4 space-y-2">
                {pdfUrls.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    download
                    onClick={handleDownload}
                    data-track="free-download-pdf"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
                  >
                    <IconDownload size={14} />
                    {pdfUrls.length > 1 ? `Download Copy ${i + 1}` : "Download Now"}
                  </a>
                ))}
              </div>
            )}
            <div className="mt-6 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
              <p className="text-xs font-bold text-gray-900">Want 50+ topper copies + 21 guides?</p>
              <p className="text-xs text-gray-500 mt-0.5">All papers — GS1-4, Essay, Optional. ₹799 only.</p>
              <button
                onClick={() => {
                  window.open("/store", "_blank");
                  onOpenChange(false);
                }}
                className="mt-2 w-full rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors"
              >
                Get the Complete Compilation →
              </button>
            </div>
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
              <p className="text-xs font-semibold text-amber-800">Complementary Offer</p>
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
                browse the complete compilation
              </button>
              {" "}with 50+ topper copies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
