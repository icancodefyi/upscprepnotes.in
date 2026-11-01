"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionHead from "@/components/brand/SectionHead";

export type ShelfItem = {
  slug: string;
  title: string;
  tagline: string;
  price: number;
  image: string | null;
  features: string[];
  fileCount: number | null;
};

const FEATURED = "answer-copies-compilation";
// Real answer pages from the archive, fanned behind the featured compilation.
const PAGES = [2, 3].map((n) => `https://ik.imagekit.io/impiclabs/sample-answers/${n}.png?tr=w-500,f-auto,q-75`);
const TRUST = ["One-time payment", "Instant download", "7-day refund", "Lifetime access"];

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="mt-[3px] h-[18px] w-[18px] shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="var(--accent)" />
      <path d="M6 10.4l2.6 2.6L14 7.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The flagship, laid out like a spread: the product with real pages from inside it fanned behind. */
function Featured({ p }: { p: ShelfItem }) {
  return (
    <Link
      href={`/store/${p.slug}`}
      data-track="try-store-featured"
      className="group grid overflow-hidden rounded-[32px] bg-white shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)] lg:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="relative min-h-[380px] overflow-hidden bg-[#e9edff] sm:min-h-[460px]">
        {PAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
            className="paper absolute top-[12%] w-[44%] transition-transform duration-700 ease-[var(--ease)]"
            style={{ left: i ? "50%" : "8%", transform: `rotate(${i ? 8 : -9}deg)` }}
          />
        ))}
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title}
            className="paper absolute left-1/2 top-[8%] w-[58%] -translate-x-1/2 rounded-[10px] transition-transform duration-700 ease-[var(--ease)] group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]"
          />
        )}
        <span className="absolute bottom-6 left-6 rotate-[-4deg] rounded-[10px] bg-[var(--hl)] px-4 py-2 text-[22px] font-bold tracking-[-0.02em] text-[var(--ink)] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]">
          {`₹${p.price}`}
        </span>
      </div>

      <div className="flex flex-col p-8 sm:p-12">
        <h3 className="t-display text-[clamp(32px,3.2vw,46px)] group-hover:text-[var(--accent)]">{p.title}</h3>
        <p className="mt-3 text-[17px] leading-[1.55] text-[var(--ink-2)]">{p.tagline}</p>
        <ul className="mt-8 space-y-3.5">
          {p.features.map((f) => (
            <li key={f} className="flex gap-3 text-[15.5px] leading-[1.5] text-[var(--ink)]">
              <Tick />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
          <span className="btn btn-blue">
            {`Get it for ₹${p.price}`} <span className="knob">↗</span>
          </span>
          <span className="text-[14px] text-[var(--muted)]">One-time · instant download</span>
        </div>
      </div>
    </Link>
  );
}

/** The rest of the shelf: covers you can flick through. */
function Cover({ p, i }: { p: ShelfItem; i: number }) {
  return (
    <Link href={`/store/${p.slug}`} className="group w-[248px] shrink-0 snap-start sm:w-[272px]">
      <div className="relative aspect-[4/5] [perspective:900px]">
        <div
          className="paper absolute inset-0 overflow-hidden rounded-[14px] transition-transform duration-500 ease-[var(--ease)] group-hover:[transform:rotateY(-10deg)_translateY(-8px)]"
          style={{ transformOrigin: "left center" }}
        >
          {p.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
          )}
          {/* spine */}
          <span aria-hidden className="absolute inset-y-0 left-0 w-[4px] bg-[var(--ink)]/20" />
        </div>
        <span
          className="absolute -right-2 -top-2 rounded-[8px] bg-[var(--hl)] px-3 py-1 text-[16px] font-bold text-[var(--ink)] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.5)]"
          style={{ transform: `rotate(${i % 2 ? 5 : -4}deg)` }}
        >
          {`₹${p.price}`}
        </span>
        {p.fileCount && (
          <span className="t-meta absolute bottom-3 left-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-[var(--ink)] backdrop-blur">
            {`${p.fileCount} FILES`}
          </span>
        )}
      </div>
      <h3 className="t-head mt-5 text-[19px] group-hover:text-[var(--accent)]">{p.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">{p.tagline}</p>
    </Link>
  );
}

export default function StoreShelf({ items }: { items: ShelfItem[] }) {
  const featured = items.find((p) => p.slug === FEATURED) ?? items[0];
  const rest = items.filter((p) => p !== featured);
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const r = rail.current;
    if (r) setEdge({ start: r.scrollLeft < 8, end: r.scrollLeft > r.scrollWidth - r.clientWidth - 8 });
  }, []);
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  if (!featured) return null;

  return (
    <section className="panel bg-[var(--canvas)] py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>For the nights <span className="text-[var(--accent)]">without Wi-Fi.</span></>}
          lead="Everything stays free to read online. Topper compilations are one-time downloads you can study offline."
          action={
            <Link href="/store" className="btn btn-ink">
              Visit the store <span className="knob">↗</span>
            </Link>
          }
        />

        <div className="mt-14">
          <Featured p={featured} />
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-[var(--ink-2)]">
          {TRUST.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-20 flex items-end justify-between gap-6">
          <h3 className="t-head text-[26px]">More from the store</h3>
          <div className="flex gap-2">
            <button aria-label="Previous products" disabled={edge.start} onClick={() => rail.current?.scrollBy({ left: -296, behavior: "smooth" })} className="btn btn-paper h-11 w-11 justify-center p-0 disabled:opacity-35">←</button>
            <button aria-label="Next products" disabled={edge.end} onClick={() => rail.current?.scrollBy({ left: 296, behavior: "smooth" })} className="btn btn-ink h-11 w-11 justify-center p-0 disabled:opacity-35">→</button>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        onScroll={sync}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-3 [scrollbar-width:none] [padding-inline:max(24px,calc((min(100vw,1360px)_-_1120px)/2_+_24px))] [scroll-padding-inline:max(24px,calc((min(100vw,1360px)_-_1120px)/2_+_24px))]"
      >
        {rest.map((p, i) => (
          <Cover key={p.slug} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
