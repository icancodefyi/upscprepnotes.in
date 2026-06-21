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
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Free Download</span>
            <h2 className="mt-3 text-xl font-bold">
              {topperName}&apos;s Answer Copy
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              One free GS paper answer copy from the actual UPSC Mains exam. See the exact handwriting, structure, and presentation that scored high marks.
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
            </div>
          </div>

          {/* GREAT WEEKEND SALE */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 flex flex-col items-start">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Flash Sale</span>
            <h2 className="mt-3 text-xl font-bold text-white">
              Flash Sale — All Products at ₹99
            </h2>
            <p className="mt-1.5 text-sm text-emerald-200/80 leading-relaxed">
              Limited Time Offer. Get every product on UPSCPrepNotes at just ₹99.
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
