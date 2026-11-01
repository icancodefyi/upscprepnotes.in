"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionHead from "./SectionHead";

export type Guide = {
  slug: string;
  title: string;
  paper: string;
  key: string;
  blurb: string;
  top: { score: number; name: string; rank: number; year: number; max: number };
};

const CARD_TONES = ["#ffffff", "#ffe45c", "#e9edff", "#ffffff", "#ffd8cf", "#d4f1df", "#ffffff"];

/** Index cards: ruled lines, a punched hole, the paper's best score in red. */
function Card({ g, i }: { g: Guide; i: number }) {
  return (
    <Link
      href={`/content/${g.slug}`}
      className="group relative flex h-[400px] w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] p-7 shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)] transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-1.5 sm:w-[340px]"
      style={{
        background: CARD_TONES[i % CARD_TONES.length],
        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(31,63,214,0.08) 31px, rgba(31,63,214,0.08) 32px)",
        backgroundPosition: "0 132px",
      }}
    >
      <span aria-hidden className="absolute right-6 top-6 h-4 w-4 rounded-full bg-[var(--canvas)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
      <p className="t-meta text-[var(--ink-2)]">{g.paper}</p>
      <p className="t-display tab mt-2 text-[64px] text-[var(--mark-deep)]">
        {g.top.score}
        <span className="ml-1.5 text-[18px] font-medium tracking-normal text-[var(--ink-2)]">{`/ ${g.top.max}`}</span>
      </p>
      <p className="text-[13px] text-[var(--ink-2)]">{`Highest on record · ${g.top.name}, AIR ${g.top.rank}`}</p>
      <h3 className="t-head mt-auto text-[24px] group-hover:text-[var(--accent)]">{g.title}</h3>
      <p className="mt-2 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">{g.blurb}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--accent)]">
        Read the strategy <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

export default function Guides({ guides }: { guides: Guide[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const r = rail.current;
    if (!r) return;
    setEdge({ start: r.scrollLeft < 8, end: r.scrollLeft > r.scrollWidth - r.clientWidth - 8 });
  }, []);
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const step = (d: 1 | -1) => rail.current?.scrollBy({ left: d * 364, behavior: "smooth" });

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>Then you take it <span className="text-[var(--accent)]">paper by paper.</span></>}
          lead="UPSC Mains strategy for every paper, starting from the best score we hold and how toppers reached it."
          action={
            <div className="flex gap-2">
              <button aria-label="Previous guides" disabled={edge.start} onClick={() => step(-1)} className="btn btn-paper h-12 w-12 justify-center p-0 disabled:opacity-35">←</button>
              <button aria-label="Next guides" disabled={edge.end} onClick={() => step(1)} className="btn btn-ink h-12 w-12 justify-center p-0 disabled:opacity-35">→</button>
            </div>
          }
        />
      </div>
      <div
        ref={rail}
        onScroll={sync}
        className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-2 [scrollbar-width:none] [padding-inline:max(24px,calc((100vw_-_1120px)/2_+_24px))] [scroll-padding-inline:max(24px,calc((100vw_-_1120px)/2_+_24px))]"
      >
        {guides.map((g, i) => (
          <Card key={g.slug} g={g} i={i} />
        ))}
      </div>
    </section>
  );
}
