"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type OfficialBand = { label: string; written: number };
type PaperBand = { label: string; n: number; med: { essay: number; gs1: number; gs2: number; gs3: number; gs4: number; optional: number } };

const PAPERS = [
  { key: "essay", label: "Essay", max: 250 },
  { key: "gs1", label: "GS I", max: 250 },
  { key: "gs2", label: "GS II", max: 250 },
  { key: "gs3", label: "GS III", max: 250 },
  { key: "gs4", label: "GS IV (Ethics)", max: 250 },
  { key: "optional", label: "Optional, both papers", max: 500 },
] as const;
type Key = (typeof PAPERS)[number]["key"];

/**
 * "Where does my Mains score land?" Enter mock or expected marks. Compares the written total with the
 * official median for each rank band, then shows which papers are furthest from a target band.
 * Every number comes from the tables above it on the page.
 */
export default function MarksCalculator({ official, paperBands, packHref, packLabel }: { official: OfficialBand[]; paperBands: PaperBand[]; packHref: string; packLabel: string }) {
  const [vals, setVals] = useState<Record<Key, string>>({ essay: "", gs1: "", gs2: "", gs3: "", gs4: "", optional: "" });
  const [target, setTarget] = useState(Math.min(1, paperBands.length - 1));

  const entered = PAPERS.filter((p) => vals[p.key].trim() !== "");
  const num = (k: Key, max: number) => Math.max(0, Math.min(max, Number(vals[k]) || 0));
  const written = PAPERS.reduce((a, p) => a + num(p.key, p.max), 0);

  // The highest rank band whose median written score you have reached.
  const reached = useMemo(() => {
    const sorted = [...official].sort((a, b) => b.written - a.written);
    return sorted.find((b) => written >= b.written) ?? null;
  }, [official, written]);

  const tb = paperBands[target];
  const gaps = useMemo(
    () =>
      PAPERS.filter((p) => vals[p.key].trim() !== "")
        .map((p) => ({ key: p.key, label: p.label, mine: num(p.key, p.max), median: tb.med[p.key as keyof PaperBand["med"]] }))
        .map((g) => ({ ...g, gap: g.median - g.mine }))
        .sort((a, b) => b.gap - a.gap),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vals, target, tb],
  );

  const inputCls = "mt-1 h-11 w-full rounded-xl bg-white px-3 text-m tab shadow-[0_0_0_1.5px_var(--line-2)] outline-none transition focus:shadow-[0_0_0_2px_var(--accent)]";

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)] sm:p-7">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PAPERS.map((p) => (
          <label key={p.key} className="block text-s font-bold text-[var(--ink-2)]">
            {p.label} <span className="font-normal text-[var(--muted)]">/{p.max}</span>
            <input
              inputMode="numeric"
              type="number"
              min={0}
              max={p.max}
              value={vals[p.key]}
              onChange={(e) => setVals((v) => ({ ...v, [p.key]: e.target.value }))}
              placeholder="0"
              className={inputCls}
              data-track="marks-calc-input"
            />
          </label>
        ))}
      </div>

      {entered.length === 0 ? (
        <p className="mt-5 text-s text-[var(--muted)]">Enter marks from a mock or your target for each paper. Nothing is saved or sent.</p>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl bg-[var(--canvas)] p-4">
            <p className="text-s text-[var(--muted)]">Your written total</p>
            <p className="tab text-[40px] font-bold leading-none">
              {written}
              <span className="text-m font-normal text-[var(--muted)]"> / 1,750</span>
            </p>
            <p className="mt-3 text-m leading-[1.55] text-[var(--ink-2)]">
              {reached
                ? `That is at or above the CSE 2025 median written score of ${reached.label} (${reached.written}).`
                : `That is below the CSE 2025 median written score of every rank band on this page, the lowest being ${official[official.length - 1].label} (${official[official.length - 1].written}).`}
            </p>
            {entered.length < PAPERS.length && <p className="mt-2 text-s text-[var(--muted)]">Add the other papers for a full total.</p>}
          </div>

          <div>
            <label htmlFor="mc-target" className="block text-s font-bold text-[var(--ink-2)]">Compare with the median topper in</label>
            <select
              id="mc-target"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="mt-1 h-11 w-full rounded-xl bg-white px-3 text-m shadow-[0_0_0_1.5px_var(--line-2)] outline-none focus:shadow-[0_0_0_2px_var(--accent)] sm:w-auto"
              data-track="marks-calc-target"
            >
              {paperBands.map((b, i) => (
                <option key={b.label} value={i}>{b.label}</option>
              ))}
            </select>

            <ul className="mt-4 divide-y divide-[var(--line)] overflow-hidden rounded-2xl shadow-[0_0_0_1px_var(--line-2)]">
              {gaps.map((g) => (
                <li key={g.key} className="grid grid-cols-[1fr_auto_3.5rem] items-center gap-3 bg-white px-4 py-3 text-s sm:text-m">
                  <span className="font-bold">{g.label}</span>
                  <span className="tab text-right text-[var(--ink-2)]">
                    you {g.mine} · median {g.median}
                  </span>
                  <span className={`tab text-right font-bold ${g.gap > 0 ? "text-[var(--accent)]" : "text-[#14613a]"}`}>{g.gap > 0 ? `+${g.gap}` : g.gap === 0 ? "level" : `${g.gap}`}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-s text-[var(--muted)]">A plus sign is how many marks you are short of the median topper in that band. Medians come from complete topper marksheets (CSE 2022 to 2025).</p>
          </div>

          <Link href={packHref} data-track="marks-calc-cta" className="btn btn-blue h-11 px-5 [--btn-fs:15px]">
            {packLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
