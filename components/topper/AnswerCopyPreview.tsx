"use client";

import Link from "next/link";
import { useState } from "react";

const PREVIEW_SLUGS = new Set([
  "ishita-kishore", "garima-lohia", "harshita-goyal",
  "uma-harathi", "divya-tanwar", "ayan-jain",
  "shivani-ettaboyina", "vaishali-chopra",
]);

interface Props {
  topper: {
    slug: string;
    firstName: string;
    lastName: string;
    rank: number;
    year: number;
    optionalSubject?: string;
    marks?: { essay?: number; total?: number };
  };
}

export default function AnswerCopyPreview({ topper }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const name = `${topper.firstName} ${topper.lastName}`;
  const hasPreview = PREVIEW_SLUGS.has(topper.slug) && !imgErr;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{name}&apos;s Answer Copy</h2>
          <p className="text-sm text-muted-foreground">
            See how they structured their {topper.optionalSubject || "subject"} paper
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
          Sample
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
        {hasPreview ? (
          <div className="relative">
            <img
              src={`/previews/${topper.slug}.png`}
              alt={`${name} answer copy preview`}
              className="w-full object-contain max-h-[500px]"
              onError={() => setImgErr(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12">
            <div className="mx-auto max-w-lg">
              <div className="rounded-xl border border-black/[0.08] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-black/[0.06] bg-gradient-to-r from-emerald-50 to-white px-5 pt-5 pb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                      UPSC CSE Mains {topper.year}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {topper.optionalSubject || "General Studies"} Paper
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    AIR {topper.rank}
                  </span>
                </div>
                <div className="px-5 pt-4 pb-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-[9px] font-bold text-emerald-700">
                      Q
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">
                      Sample Question
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 italic">
                    &ldquo;Discuss the impact of technology on governance in India.&rdquo;
                  </p>
                  <div className="border-l-2 border-emerald-300 bg-emerald-50/60 pl-4 py-3">
                    <p className="text-sm leading-relaxed text-gray-700">
                      Technology has fundamentally transformed governance in India, from
                      Aadhaar&apos;s biometric authentication to the UMANG platform&apos;s
                      1,200+ services. {name}&apos;s response demonstrates how to
                      structure a high-scoring answer with data, examples, and a clear argument.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-black/[0.06] bg-gray-50/50 px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-[10px] text-gray-500">Verified copy</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Full answer: 8 pages</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 z-10 rounded-md bg-amber-500/90 px-2 py-1 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wider text-white">Preview</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border-2 border-emerald-600/20 bg-emerald-50 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-900">
              Get the full answer copy + 50+ topper copies
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              GS1–4, Essay, Optional papers — organized by marks and year. ₹11 per copy.
            </p>
          </div>
          <Link
            href="/toppers/toppers-copy-compilation"
            data-track="topper-preview-cta"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] shrink-0"
          >
            See the Bundle — ₹799
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
