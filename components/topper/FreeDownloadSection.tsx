"use client";

import { useState } from "react";
import Link from "next/link";
import { FreeDownloadDialog } from "./FreeDownloadDialog";

interface FreeDownloadSectionProps {
  topperName: string;
  topperSlug: string;
  optionalSubject: string;
  freeAnswerCopyUrl?: string | null;
  freeAnswerCopyUrls?: string[];
}

export function FreeDownloadSection({
  topperName,
  topperSlug,
  optionalSubject,
  freeAnswerCopyUrl,
  freeAnswerCopyUrls,
}: FreeDownloadSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold tracking-tight mb-4">Answer copies</h2>

        <div className="overflow-hidden rounded-xl border border-border bg-card">

          {/* FREE DOWNLOAD — top */}
          <div className="p-5 sm:p-6">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-brand-muted px-2.5 py-0.5 text-[10px] font-bold text-brand">Free Download</span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-foreground">Verified</span>
            </div>
            <h3 className="text-lg font-bold">{topperName}&apos;s Answer Copy</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              One free GS paper answer copy from the actual UPSC Mains exam. See the exact handwriting, structure, and presentation that scored high marks.
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              Sourced from topper contributions and verified against published marksheets.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setDialogOpen(true)}
                data-track="topper-free-download"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground hover:bg-brand/90"
              >
                Download free copy
              </button>
              <a
                href="https://t.me/+VYMxrig-a8AzZmNl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground hover:border-foreground/20 hover:text-foreground transition"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram for daily updates
              </a>
            </div>
          </div>

          {/* UPGRADE — bottom */}
          <div className="border-t border-border bg-secondary/30 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">
                  Complete compilation
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  50+ topper copies — all GS papers, essay, and {optionalSubject} optional. Instant download.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-lg font-bold tabular-nums">₹99</span>
                  <span className="ml-1 text-xs text-muted-foreground">starting</span>
                </div>
                <Link
                  href="/store"
                  data-track="topper-bundle-upsell"
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:bg-brand/90"
                >
                  Browse store &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {dialogOpen && (
        <FreeDownloadDialog
          topperName={topperName}
          topperSlug={topperSlug}
          freeAnswerCopyUrl={freeAnswerCopyUrl}
          freeAnswerCopyUrls={freeAnswerCopyUrls}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
