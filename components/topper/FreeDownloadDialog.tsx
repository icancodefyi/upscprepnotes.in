"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconDownload, IconX, IconCheck, IconClock } from "@tabler/icons-react";
import { brandFonts } from "@/components/brand/fonts";

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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    setTimeout(() => dialogRef.current?.focus(), 100);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
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
    } catch (err: any) {
      setDialogError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    setDownloaded(true);
  }

  const input = "mt-1.5 h-12 w-full rounded-full bg-white px-5 text-m text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] outline-none placeholder:text-[var(--muted)] focus:shadow-[0_0_0_2px_var(--accent)]";
  const badge = "mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]";
  const compilationHref = "/store/answer-copies-compilation";
  const upsell = (title: string, line: string) => (
    <div className="mt-5 rounded-[20px] bg-[#fffbe6] p-5 text-left">
      <p className="text-m font-bold">{title}</p>
      <p className="mt-1 text-s text-[var(--ink-2)]">{line}</p>
      <button
        type="button"
        onClick={() => {
          window.open(compilationHref, "_blank");
          onOpenChange(false);
        }}
        data-track="free-download-upsell"
        className="btn btn-ink mt-3 h-11 w-full justify-center [--btn-fs:14px]"
      >
        See the compilation, ₹199 &rarr;
      </button>
      <p className="mt-2 text-s text-[var(--muted)]">Instant email delivery · 7-day refund · No subscription</p>
    </div>
  );

  const dialog = (
    <div className={`up ${brandFonts} fixed inset-0 z-[70] flex items-end justify-center bg-transparent p-0 sm:items-center sm:p-4`}>
      <div className="fixed inset-0 bg-[rgba(11,12,16,0.55)]" onClick={handleClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Download ${topperName}'s answer copy`}
        tabIndex={-1}
        className="relative z-10 max-h-[92dvh] w-full max-w-[460px] overflow-y-auto rounded-t-[28px] bg-white p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-[0_24px_60px_-20px_rgba(11,12,16,0.45)] sm:rounded-[28px] sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--canvas)]"
        >
          <IconX size={18} />
        </button>

        {!submitted ? (
          <>
            <h2 className="t-head max-w-[18ch] pr-10 text-l">{`${topperName}'s answer copy, free`}</h2>
            <p className="mt-3 text-s leading-[1.55] text-[var(--ink-2)]">
              See the exact handwriting, structure and presentation that scored high marks in UPSC Mains.
            </p>
            <ul className="mt-4 space-y-1.5 text-s text-[var(--ink-2)]">
              {["Real answer structure", "Handwriting and diagrams", "How they managed time"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <IconCheck size={16} className="shrink-0 text-[var(--accent)]" />
                  {t}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="free-download-email" className="text-s font-bold">Your email</label>
              <input
                id="free-download-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                className={input}
                placeholder="Where should we send the link?"
              />
              {dialogError && (
                <p className="mt-2 text-s text-[var(--mark-deep)]" role="alert">{dialogError}</p>
              )}
              <button type="submit" disabled={loading} className="btn btn-blue mt-4 h-12 w-full justify-center disabled:opacity-60 [--btn-fs:16px]">
                {loading ? "Sending..." : "Send my free copy"}
              </button>
            </form>
            <p className="mt-3 text-center text-s text-[var(--muted)]">Free · No spam · Unsubscribe anytime</p>
          </>
        ) : available ? (
          <div className="text-center">
            <div className={badge}><IconCheck size={26} /></div>
            <h2 className="t-head mt-4 text-l">Check your inbox</h2>
            <p className="mt-2 text-s leading-[1.55] text-[var(--ink-2)]">
              We sent {pdfUrls.length > 1 ? `${pdfUrls.length} answer copies` : "the download link"} for <strong>{topperName}</strong> to <strong>{email}</strong>. If it isn&apos;t there in a few minutes, look in Spam or Promotions.
            </p>
            {pdfUrls.length > 0 && (
              <div className="mt-5 flex flex-col gap-2">
                {pdfUrls.map((url, i) => (
                  <a key={url} href={url} download onClick={handleDownload} data-track="free-download-pdf" className="btn btn-blue h-12 justify-center [--btn-fs:16px]">
                    <IconDownload size={16} />
                    {pdfUrls.length > 1 ? `Download copy ${i + 1}` : "Download now"}
                  </a>
                ))}
              </div>
            )}
            <a
              href="https://t.me/+2eV0YCTGdNcyNmFl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex h-11 items-center justify-center rounded-full text-s font-bold text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] transition-colors hover:bg-[var(--canvas)]"
            >
              Join 100+ aspirants on Telegram for daily current affairs
            </a>
            {upsell(`Compare ${topperName} with other toppers`, "63 booklets from 27 toppers across GS1-4 and Essay. ₹199, one time.")}
          </div>
        ) : (
          <div className="text-center">
            <div className={badge}><IconClock size={26} /></div>
            <h2 className="t-head mt-4 text-l">Check your inbox</h2>
            <p className="mt-2 text-s leading-[1.55] text-[var(--ink-2)]">
              <strong>{topperName}</strong>&apos;s copy is being scanned from the original answer sheet. We&apos;ll email the link to <strong>{email}</strong> as soon as it&apos;s ready, usually within 24-48 hours. Check Spam or Promotions if you don&apos;t see it.
            </p>
            {upsell(`While you wait: compare ${topperName} with other toppers`, "63 booklets from 27 toppers across GS1-4 and Essay. ₹199, one time.")}
            <button type="button" onClick={() => onOpenChange(false)} className="mt-3 h-11 w-full rounded-full text-s font-bold text-[var(--ink-2)] hover:bg-[var(--canvas)]">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document === "undefined" ? null : createPortal(dialog, document.body);
}
