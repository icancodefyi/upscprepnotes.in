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
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="t-head text-l">{name}&apos;s Answer Copy</h2>
          <p className="mt-1 text-s text-[var(--muted)]">
            See how they structured their {topper.optionalSubject || "subject"} paper
          </p>
        </div>
        <span className="rounded-full bg-[#e3e8fb] px-2.5 py-0.5 text-s font-bold text-[#172fa3]">
          Sample
        </span>
      </div>

      <div className="group relative overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2)]">
        {hasPreview ? (
          <div className="relative cursor-pointer" onClick={() => setLightboxImg(previewSrc)}>
            <img
              src={previewSrc}
              alt={`${name} answer copy preview`}
              width={788}
              height={1128}
              className="w-full object-contain max-h-[500px]"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-[10px] bg-white px-3 py-1.5 shadow-[0_0_0_1px_var(--line-2)]">
                  <p className="text-s text-[var(--muted)]">{topper.year}</p>
                  <p className="text-s font-bold">AIR {topper.rank}</p>
                </div>
                <div className="rounded-[10px] bg-white px-3 py-1.5 shadow-[0_0_0_1px_var(--line-2)]">
                  <p className="text-s text-[var(--muted)]">Optional</p>
                  <p className="text-s font-bold">{topper.optionalSubject || "GS"}</p>
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

        <div className="absolute left-3 top-3 z-10 rounded-full bg-[var(--hl)] px-2.5 py-0.5">
          <p className="text-s font-bold text-[var(--hl-ink)]">Preview</p>
        </div>
        <div className="absolute right-3 top-3 z-10 rounded-full bg-white px-2.5 py-0.5 opacity-0 shadow-[0_0_0_1px_var(--line-2)] transition-opacity duration-200 group-hover:opacity-100">
          <p className="text-s text-[var(--ink-2)]">Click to zoom</p>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-[var(--hl)] px-2.5 py-0.5 text-s font-bold text-[var(--hl-ink)]">Offer</span>
            <p className="mt-2 text-m font-bold">
              Starting at ₹199
            </p>
            <p className="mt-0.5 text-s text-[var(--muted)]">
              Instant download · 7-day refund guarantee.
            </p>
          </div>
          <Link
            href="/store"
            data-track="topper-preview-cta"
            className="btn btn-blue h-11 shrink-0 px-5 [--btn-fs:14px]"
          >
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
      <p className="mt-2 text-center text-s text-[var(--muted)]">Click the preview to zoom in</p>

      {lightboxImg && (
        <ImageLightbox src={lightboxImg} alt={`${name} answer copy`} onClose={() => setLightboxImg(null)} />
      )}
    </section>
  );
}

