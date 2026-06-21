"use client";

import { useState } from "react";
import Link from "next/link";
import SampleAnswerCarousel from "./SampleAnswerCarousel";
import ImageLightbox from "@/components/ui/ImageLightbox";

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
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const name = `${topper.firstName} ${topper.lastName}`;
  const hasPreview = PREVIEW_SLUGS.has(topper.slug);
  const previewSrc = `https://ik.imagekit.io/impiclabs/previews/${topper.slug}.png?tr=w-788,f-auto,q-80`;

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

      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card group">
        {hasPreview ? (
          <div className="relative cursor-pointer" onClick={() => setLightboxImg(previewSrc)}>
            <img
              src={previewSrc}
              alt={`${name} answer copy preview`}
              width={788}
              height={1128}
              className="w-full object-contain max-h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{topper.year}</p>
                  <p className="text-sm font-bold text-white">AIR {topper.rank}</p>
                </div>
                <div className="rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">Optional</p>
                  <p className="text-sm font-bold text-white">{topper.optionalSubject || "GS"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SampleAnswerCarousel
            topperName={name}
            year={topper.year}
            rank={topper.rank}
            onImageClick={(src) => setLightboxImg(src)}
          />
        )}

        <div className="absolute top-3 left-3 z-10 rounded-md bg-amber-500/90 px-2 py-1 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wider text-white">Preview</p>
        </div>
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md bg-white/90 px-2 py-1 shadow-sm">
          <p className="text-[9px] font-medium text-gray-600">Click to zoom</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Flash Sale</span>
            <p className="mt-2 text-sm font-bold text-white">
              Flash Sale — All Products at ₹99
            </p>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Limited Time Offer. Get every product on UPSCPrepNotes at just ₹99.
            </p>
          </div>
          <Link
            href="/store"
            data-track="topper-preview-cta"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400 active:scale-[0.97] shrink-0"
          >
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-center text-muted-foreground/60">Click the preview to zoom in</p>

      {lightboxImg && (
        <ImageLightbox src={lightboxImg} alt={`${name} answer copy`} onClose={() => setLightboxImg(null)} />
      )}
    </section>
  );
}

