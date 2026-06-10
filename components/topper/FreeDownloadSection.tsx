"use client";

import { useState } from "react";
import Link from "next/link";
import { FreeDownloadDialog } from "./FreeDownloadDialog";

interface FreeDownloadSectionProps {
  topperName: string;
  topperSlug: string;
  optionalSubject: string;
  freeAnswerCopyUrl?: string | null;
}

export function FreeDownloadSection({
  topperName,
  topperSlug,
  optionalSubject,
  freeAnswerCopyUrl,
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

          {/* COMPILATION UPSELL */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 flex flex-col items-start">
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Complete Compilation</span>
            <h2 className="mt-3 text-xl font-bold text-gray-900">
              All 50+ Topper Answer Copies
            </h2>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              Get every paper (GS1-4, Essay, Optional) of {topperName} + 50+ other toppers plus 21 strategy guides. All at just ₹11 per copy.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">₹799</span>
              <span className="text-sm text-gray-500 line-through">₹4,999</span>
            </div>
            <div className="mt-auto pt-4 w-full">
              <Link
                href="/toppers/toppers-copy-compilation"
                data-track="topper-bundle-upsell"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Get the Complete Compilation &rarr;
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
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
