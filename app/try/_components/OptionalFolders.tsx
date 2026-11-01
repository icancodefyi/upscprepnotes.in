"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHead from "@/components/brand/SectionHead";
import { Paperclip } from "@/components/brand/Props";

export type OptionalTile = {
  subject: string;
  count: number;
  median: number;
  scores: number[];
  best: { name: string; rank: number; year: number; score: number };
};

const SLUGS: Record<string, string> = {
  PSIR: "psir",
  Sociology: "sociology",
  Anthropology: "anthropology",
  Geography: "geography",
  Mathematics: "mathematics",
  History: "history",
};

// Manila-folder stock, one per subject.
const STOCK = ["#ffe45c", "#dbe2ff", "#ffd8cf", "#d4f1df", "#ebe2ff", "#fde9c4"];

const LO = 220;
const HI = 340;
const pct = (v: number) => `${Math.min(100, Math.max(0, ((v - LO) / (HI - LO)) * 100))}%`;

export default function OptionalFolders({ optionals }: { optionals: OptionalTile[] }) {
  const [sel, setSel] = useState(0);
  const t = optionals[sel];
  if (!t) return null;
  const color = STOCK[sel % STOCK.length];

  const bins = new Map<number, number>();
  const dots = t.scores.map((s) => {
    const b = Math.round(s / 4) * 4;
    const k = bins.get(b) ?? 0;
    bins.set(b, k + 1);
    return { s, b, k };
  });
  const bestIndex = dots.findIndex((d) => d.s === t.best.score);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>Your first big decision: <span className="swipe">the optional.</span></>}
          lead="UPSC optional subject marks of real toppers. Every dot is one topper's total out of 500, a ceiling rather than a forecast."
        />

        <div className="mt-14">
          {/* Tabs */}
          <div role="tablist" aria-label="Optional subjects" className="relative z-10 flex gap-1 overflow-x-auto pl-4 [scrollbar-width:none] sm:pl-8">
            {optionals.map((o, i) => {
              const on = i === sel;
              return (
                <button
                  key={o.subject}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setSel(i)}
                  className="folder-tab shrink-0 rounded-t-[18px] px-5 pb-3 pt-3.5 text-left sm:px-7"
                  style={{
                    background: STOCK[i % STOCK.length],
                    transform: on ? "translateY(0)" : "translateY(8px)",
                    filter: on ? "none" : "saturate(0.7) brightness(0.97)",
                    boxShadow: on ? "0 -6px 16px -10px rgba(0,0,0,0.25)" : "none",
                  }}
                >
                  <span className="block text-m font-bold tracking-[-0.01em]">{o.subject}</span>
                  <span className="t-meta block text-s text-[rgba(11,12,16,0.55)]">{`${o.count} toppers`}</span>
                </button>
              );
            })}
          </div>

          {/* Folder body */}
          <div
            className="folder-body relative -mt-px rounded-[28px] p-6 shadow-[0_10px_24px_-14px_rgba(11,12,16,0.35)] sm:p-10 lg:p-14"
            style={{ background: color }}
          >
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div key={t.subject} className="rise">
                <p className="t-display text-l">{t.subject}</p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <p className="t-display tab text-l">{t.median}</p>
                    <p className="mt-1 text-s text-[rgba(11,12,16,0.6)]">Median topper</p>
                  </div>
                  <div>
                    <p className="t-display tab text-l text-[var(--mark-deep)]">{t.best.score}</p>
                    <p className="mt-1 text-s text-[rgba(11,12,16,0.6)]">Highest</p>
                  </div>
                </div>
                <p className="mt-4 text-m text-[rgba(11,12,16,0.7)]">
                  {`Best on record: ${t.best.name}, AIR ${t.best.rank}, CSE ${t.best.year}.`}
                </p>
                {SLUGS[t.subject] && (
                  <Link href={`/optional/${SLUGS[t.subject]}`} className="btn btn-ink mt-8">
                    {`${t.subject} toppers`} <span className="knob">↗</span>
                  </Link>
                )}
              </div>

              {/* Beeswarm on a sheet of paper clipped into the folder */}
              <div className="paper relative rotate-[-1deg] p-6 sm:p-8">
                <Paperclip className="absolute -top-7 left-10 h-[76px] w-[28px] rotate-[4deg]" />
                <div className="relative h-[240px] sm:h-[280px]">
                  <div className="absolute inset-x-0 bottom-8 h-px bg-[var(--line-2)]" />
                  <div className="absolute bottom-8 top-6 w-px bg-[var(--ink)] transition-[left] duration-500" style={{ left: pct(t.median) }}>
                    <span className="t-meta absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[var(--ink)]">{`median ${t.median}`}</span>
                  </div>
                  {dots.map(({ s, b, k }, i) => {
                    const isBest = i === bestIndex;
                    return (
                      <span
                        key={`${t.subject}-${i}`}
                        title={String(s)}
                        className="dot absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full"
                        style={{
                          left: pct(b),
                          bottom: `${36 + k * 16}px`,
                          background: isBest ? "var(--mark)" : "var(--accent)",
                          boxShadow: isBest ? "0 0 0 4px rgba(255,74,61,0.2)" : "none",
                          transitionDelay: `${i * 12}ms`,
                        }}
                      />
                    );
                  })}
                  <div className="t-meta absolute inset-x-0 bottom-0 flex justify-between">
                    {[220, 250, 280, 310, 340].map((v) => <span key={v}>{v}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
