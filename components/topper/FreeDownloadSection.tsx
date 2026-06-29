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
        <div className="grid gap-6 md:grid-cols-2">
          {/* FREE DOWNLOAD */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 flex flex-col items-start">
            <div className="flex gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Free Download</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700">Verified Copy</span>
            </div>
            <h2 className="mt-3 text-xl font-bold">
              {topperName}&apos;s Answer Copy
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              One free GS paper answer copy from the actual UPSC Mains exam. See the exact handwriting, structure, and presentation that scored high marks.
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground/60 leading-relaxed">
              Sourced from topper contributions and verified against published marksheets. Copies are cross-referenced for consistency with interview transcripts and coaching records.
            </p>
            <div className="mt-auto pt-6 w-full">
              <button
                onClick={() => setDialogOpen(true)}
                data-track="topper-free-download"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Free Answer Copy
              </button>
              <a
                href="https://t.me/+VYMxrig-a8AzZmNl"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 border-[#0088cc]/30 bg-[#e8f4fd] px-4 py-2.5 text-xs font-semibold text-[#0088cc] transition hover:bg-[#d4edfc]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Join on Telegram for daily current affairs →
              </a>
            </div>
          </div>

          {/* GREAT WEEKEND SALE */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 flex flex-col items-start">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Offer</span>
            <h2 className="mt-3 text-xl font-bold text-white">
              Starting at ₹99
            </h2>
            <p className="mt-1.5 text-sm text-emerald-200/80 leading-relaxed">
              Instant download · 7-day refund guarantee.
            </p>
            <div className="mt-auto pt-4 w-full">
              <Link
                href="/store"
                data-track="topper-bundle-upsell"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                Shop Now &rarr;
              </Link>
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
