"use client";

import { useState } from "react";
import { IconDownload, IconX, IconCheck } from "@tabler/icons-react";
import { trackClientEvent } from "@/lib/client-analytics";

interface FreeDownloadDialogProps {
  topperName: string;
  topperSlug: string;
  onOpenChange: (open: boolean) => void;
}

export function FreeDownloadDialog({ topperName, topperSlug, onOpenChange }: FreeDownloadDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
        body: JSON.stringify({ email: email.trim(), topperSlug, name: name.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setPdfUrl(data.pdfUrl);
      setSubmitted(true);
      trackClientEvent("free_download_lead", { topperSlug, topperName });
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
                Enter your email to receive the download link for <strong>{topperName}</strong>&apos;s answer copy.
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
              We&apos;ll email you the PDF. No spam, unsubscribe anytime.
            </p>
          </>
        ) : (
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
                <p className="mt-2 text-[10px] text-muted-foreground">
                  (Link also sent to your email)
                </p>
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
        )}
      </div>
    </div>
  );
}
