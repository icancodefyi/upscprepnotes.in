"use client";

import { useState } from "react";
import Link from "next/link";
import type { Booklet, Counts } from "./types";

const fmt = (n: number) => n.toLocaleString("en-IN");

// The pages people search for most (Search Console, last 90 days). Anchor text says exactly what's there.
const POPULAR = [
  { href: "/upsc-topper/anuj-agnihotri-rank-1-2025", label: "Anuj Agnihotri" },
  { href: "/upsc-topper/divya-tanwar-rank-105-2022", label: "Divya Tanwar answer copy" },
  { href: "/toppers/marks-database", label: "Marks database" },
];

/** Real booklets fanned out, peeking up from the bottom of the hero. Hover lifts one into view. */
function Fan({ booklets }: { booklets: Booklet[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const mid = (booklets.length - 1) / 2;

  return (
    <div className="relative mx-auto h-[250px] w-full max-w-[1180px] sm:h-[320px]" onPointerLeave={() => setHover(null)}>
      {booklets.map((b, i) => {
        const off = i - mid;
        const on = hover === i;
        let rot = off * 4.5;
        if (hover !== null && !on) rot += i < hover ? -3 : 3;
        // Cards sit low so only their top third shows; the hovered one rises to reveal itself.
        const y = 54 + Math.abs(off) * 12 - (on ? 70 : 0);
        return (
          <Link
            key={b.slug}
            href={`/upsc-topper/${b.slug}`}
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            aria-label={`${b.name}, AIR ${b.rank}, CSE ${b.year}: answer booklet and marksheet`}
            className="fan-card w-[160px] sm:w-[230px]"
            style={{
              "--k": i,
              zIndex: on ? 40 : 10 + i,
              transform: `translateX(calc(-50% + ${off} * min(128px, 13vw))) translateY(${y}px) rotate(${rot}deg) scale(${on ? 1.04 : 1})`,
            } as React.CSSProperties}
          >
            <div className="paper overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${b.src}?tr=w-440,f-auto,q-80`}
                alt={`Answer booklet of ${b.name}, AIR ${b.rank}, CSE ${b.year}`}
                className="block aspect-[5/7] w-full object-cover object-top"
                draggable={false}
              />
            </div>
            <span
              className="fan-note absolute -top-6 left-1/2 w-max rounded-[7px] bg-[var(--hl)] px-3 py-1.5 text-s font-bold text-[var(--ink)] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.4)]"
              style={{ opacity: on ? 1 : 0, transform: `translateX(-50%) rotate(${on ? -3 : 0}deg) translateY(${on ? 0 : 8}px)` }}
            >
              {`${b.name} · AIR ${b.rank} · ${fmt(b.total)} marks`}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function Hero({ booklets, counts }: { booklets: Booklet[]; counts: Counts }) {
  return (
    <section className="relative overflow-hidden pb-[260px] pt-[clamp(120px,15vh,160px)] sm:pb-[320px]">
      <div className="relative mx-auto w-full max-w-[1120px] px-6 text-center">
        <h1>
          <span className="rise t-display h-hero block" style={{ "--i": 0 } as React.CSSProperties}>
            Before AIR 1, there was a <span className="text-[var(--accent)]">blue pen</span> and{" "}
            <span className="swipe">three hours.</span>
          </span>
          <span className="rise t-body mx-auto mt-6 block max-w-[30rem] text-m" style={{ "--i": 1 } as React.CSSProperties}>
            {`Real answer copies and marksheets of ${counts.toppers} UPSC toppers, CSE 2022–2025.`}
          </span>
        </h1>

        <form
          action="/toppers"
          method="GET"
          className="rise mx-auto mt-10 flex max-w-[32rem] items-center rounded-full bg-white p-1.5 pl-6 shadow-[0_0_0_1px_var(--line-2),0_2px_4px_rgba(11,12,16,0.04)] transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_var(--accent)]"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          <label htmlFor="up-search" className="sr-only">Search UPSC toppers</label>
          <input
            id="up-search"
            name="search"
            autoComplete="off"
            placeholder="Search a topper, rank or optional"
            className="min-w-0 flex-1 text-ellipsis bg-transparent text-m tracking-[-0.01em] outline-none placeholder:text-[var(--muted)]"
          />
          <button type="submit" data-track="try-hero-search" className="btn btn-blue h-12">
            Search
          </button>
        </form>

        <nav aria-label="Popular" className="rise mx-auto mt-5 flex max-w-[32rem] flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-s text-[var(--muted)]" style={{ "--i": 3 } as React.CSSProperties}>
          <span>Popular: </span>
          {POPULAR.map((p, i) => (
            <span key={p.href} className="whitespace-nowrap">
              {i > 0 && <span aria-hidden className="mx-2">·</span>}
              <Link href={p.href} className="text-[var(--ink-2)] underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]">
                {p.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {/* Real booklets peek up from the bottom edge. */}
      <div className="absolute inset-x-0 bottom-0">
        <Fan booklets={booklets} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[45] h-12 bg-gradient-to-t from-white to-transparent" />
      </div>
    </section>
  );
}
