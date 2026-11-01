"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionHead from "@/components/brand/SectionHead";
import { Pin } from "@/components/brand/Props";

export type NextTopper = {
  name: string;
  slug: string;
  rank: number;
  year: number;
  optional: string;
  total: number;
  photo: string | null;
  freeCopy: boolean;
};
export type NextGroup = { id: string; label: string; toppers: NextTopper[] };

const fmt = (n: number) => n.toLocaleString("en-IN");
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const TONES = ["#ffffff", "#e9edff", "#ffffff", "#fff6c2", "#ffffff", "#ffe4de"];

function Card({ t, i }: { t: NextTopper; i: number }) {
  return (
    <Link
      href={`/upsc-topper/${t.slug}`}
      data-track={`topper-next-${t.slug}`}
      className="group relative w-[232px] shrink-0 snap-start pt-4 sm:w-[256px]"
    >
      <div
        className="relative rounded-[20px] p-3 pb-5 shadow-[0_0_0_1px_var(--line),0_8px_18px_-12px_rgba(11,12,16,0.35)] transition-transform duration-300 ease-[var(--ease)] group-hover:-translate-y-1.5"
        style={{ background: TONES[i % TONES.length], transform: `rotate(${[-1.2, 0.8, -0.5, 1.1][i % 4]}deg)` }}
      >
        <Pin tone={i % 3 === 1 ? "blue" : i % 3 === 2 ? "yellow" : "red"} className="absolute -top-4 left-1/2 z-10 h-10 w-9 -translate-x-1/2" />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#e9edff]">
          {t.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.photo} alt={t.name} loading="lazy" className="h-full w-full object-cover object-top" />
          ) : (
            <span aria-hidden className="t-display grid h-full w-full place-items-center text-[52px] text-[var(--accent)]">{initials(t.name)}</span>
          )}
          <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold text-[var(--mark-deep)] shadow-[0_2px_6px_-2px_rgba(0,0,0,0.3)]">
            {`AIR ${t.rank}`}
          </span>
        </div>
        <div className="px-1.5">
          <p className="t-head mt-4 truncate text-[19px] group-hover:text-[var(--accent)]">{t.name}</p>
          <p className="mt-1 truncate text-[13.5px] text-[var(--ink-2)]">{`CSE ${t.year} · ${t.optional}`}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="tab text-[14px]">
              <span className="font-semibold">{t.total > 0 ? fmt(t.total) : "—"}</span>
              <span className="text-[var(--muted)]"> / 2,025</span>
            </span>
            {t.freeCopy && <span className="rounded-full bg-[var(--hl)] px-2 py-0.5 text-[11px] font-semibold text-[var(--hl-ink)]">Free copy</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ReadNext({ first, groups }: { first: string; groups: NextGroup[] }) {
  const usable = groups.filter((g) => g.toppers.length > 0);
  const [active, setActive] = useState(usable[0]?.id);
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const group = usable.find((g) => g.id === active) ?? usable[0];

  const sync = useCallback(() => {
    const r = rail.current;
    if (r) setEdge({ start: r.scrollLeft < 8, end: r.scrollLeft > r.scrollWidth - r.clientWidth - 8 });
  }, []);
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const pick = (id: string) => {
    setActive(id);
    rail.current?.scrollTo({ left: 0 });
    requestAnimationFrame(sync);
  };

  if (!group) return null;
  const step = (d: 1 | -1) => rail.current?.scrollBy({ left: d * 280, behavior: "smooth" });

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>{"Toppers to read "}<span className="text-[var(--accent)]">{`after ${first}.`}</span></>}
          lead="Same optional, same year or the same rank: the comparisons aspirants make most. Every card opens a full marksheet."
          action={
            <div className="flex gap-2">
              <button aria-label="Previous toppers" disabled={edge.start} onClick={() => step(-1)} className="btn btn-paper h-12 w-12 justify-center p-0 disabled:opacity-35">←</button>
              <button aria-label="Next toppers" disabled={edge.end} onClick={() => step(1)} className="btn btn-ink h-12 w-12 justify-center p-0 disabled:opacity-35">→</button>
            </div>
          }
        />
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Group toppers by">
          {usable.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={g.id === group.id}
              onClick={() => pick(g.id)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-150 ${
                g.id === group.id ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rail}
        onScroll={sync}
        className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-4 [scrollbar-width:none] [padding-inline:max(24px,calc((100vw_-_1120px)/2_+_24px))] [scroll-padding-inline:max(24px,calc((100vw_-_1120px)/2_+_24px))]"
      >
        {group.toppers.map((t, i) => (
          <Card key={t.slug} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}
