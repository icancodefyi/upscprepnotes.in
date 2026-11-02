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
      <section id="answer-copy" data-track-view="topper_answer_copies" className="scroll-mt-28">
        <h2 className="t-head mb-5 text-l">Answer copies</h2>

        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]">

          {/* FREE DOWNLOAD — top */}
          <div className="p-5 sm:p-6">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-s font-bold text-[var(--accent)]">Free Download</span>
              <span className="rounded-full bg-[var(--canvas)] px-2.5 py-0.5 text-s font-bold text-[var(--ink)]">Verified</span>
            </div>
            <h3 className="text-m font-bold">{topperName}&apos;s Answer Copy</h3>
            <p className="mt-1.5 text-m leading-[1.6] text-[var(--ink-2)]">
              One free GS paper answer copy from the actual UPSC Mains exam. See the exact handwriting, structure, and presentation that scored high marks.
            </p>
            <p className="mt-1.5 text-s text-[var(--muted)]">
              Sourced from topper contributions and verified against published marksheets.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setDialogOpen(true)}
                data-track="topper-free-download"
                className="btn btn-blue h-11 justify-center px-5 [--btn-fs:14px]"
              >
                Download free copy
              </button>
              <a
                href="https://t.me/+2eV0YCTGdNcyNmFl"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-paper h-11 justify-center px-4 [--btn-fs:14px]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram for daily updates
              </a>
            </div>
          </div>

          {/* UPGRADE — bottom */}
          <div className="border-t border-[var(--line)] bg-[var(--canvas)]/60 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-m font-bold">
                  Complete compilation
                </p>
                <p className="mt-0.5 text-s text-[var(--ink-2)]">
                  50+ topper copies — all GS papers, essay, and {optionalSubject} optional. Instant download.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className="rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-m font-bold tabular-nums">₹199</span>
                  <span className="ml-1 text-s text-[var(--muted)]">starting</span>
                </div>
                <Link
                  href="/store"
                  data-track="topper-bundle-upsell"
                  className="btn btn-ink h-10 shrink-0 px-4 [--btn-fs:14px]"
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
