"use client";

import { useState, useEffect, useCallback } from "react";
import { IconDownload, IconX, IconCheck } from "@tabler/icons-react";
import { trackClientEvent } from "@/lib/client-analytics";

interface FreeDownloadDialogProps {
  topperName: string;
  topperSlug: string;
  onOpenChange: (open: boolean) => void;
}

export function FreeDownloadDialog({ topperName, topperSlug, onOpenChange }: FreeDownloadDialogProps) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    trackClientEvent("dialog_open", { dialog: "free_download", topperSlug });

    fetch("/api/free-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topperSlug }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        } else {
          setError(data.error || "Not available");
        }
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));

    return () => {
      document.body.style.overflow = "";
    };
  }, [topperSlug]);

  const handleDownload = useCallback(() => {
    if (!downloaded) {
      setDownloaded(true);
      trackClientEvent("file_download", {
        topperSlug,
        topperName,
        fileType: "answer_copy",
        source: "free_download_dialog",
      });
    }
  }, [downloaded, topperSlug, topperName]);

  const handleClose = useCallback(() => {
    trackClientEvent("dialog_close", { dialog: "free_download", topperSlug, method: "button" });
    onOpenChange(false);
  }, [onOpenChange, topperSlug]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
        <button
          onClick={handleClose}
          data-track="free-download-dialog-close"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <IconX size={18} />
        </button>

        {loading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-xl bg-emerald-100" />
            <div className="mx-auto mb-2 h-5 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto h-4 w-56 animate-pulse rounded bg-gray-100" />
          </div>
        )}

        {!loading && !error && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IconDownload size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Download Free Answer Copy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One free answer copy of <strong>{topperName}</strong> — no email required.
            </p>
            <a
              href={pdfUrl}
              download
              onClick={handleDownload}
              data-track="free-download-pdf"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
            >
              <IconDownload size={16} />
              Download Now
            </a>
            <p className="mt-4 text-xs text-muted-foreground">
              Want more? <strong className="text-emerald-600 cursor-pointer" onClick={handleClose}>Get 50+ topper copies</strong> in the complete bundle.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <IconX size={24} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold">Not available yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We don&apos;t have a free download for <strong>{topperName}</strong> yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
