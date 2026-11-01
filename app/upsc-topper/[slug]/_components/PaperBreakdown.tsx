"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHead from "@/components/brand/SectionHead";
import { fmt, type PaperStat } from "@/lib/topper-stats";

/** label: the tab text. phrase: how sentences refer to the group ("CSE 2025 toppers"). */
export type Cohort = { id: string; label: string; phrase: string; size: number; stats: PaperStat[] };

const ordinal = (k: number) => {
  const v = k % 100;
  return `${k}${v >= 11 && v <= 13 ? "th" : ["th", "st", "nd", "rd"][k % 10] ?? "th"}`;
};

/** One sentence per paper, built only from the numbers. */
function verdict(p: PaperStat, cohort: Cohort) {
  if (p.position === 1) return `The highest ${p.short} score among ${cohort.phrase}.`;
  if (p.beats >= 90) return `Better than ${p.beats}% of them. Only ${p.position - 1} scored more.`;
  if (p.score >= p.median) return `${p.score - p.median} above the median, ${ordinal(p.position)} of ${p.of}.`;
  return `${p.median - p.score} below the median, ${ordinal(p.position)} of ${p.of}.`;
}

function Row({ p, cohort, tone }: { p: PaperStat; cohort: Cohort; tone: "best" | "weak" | null }) {
  const at = (v: number) => `${(v / p.max) * 100}%`;
  const diff = p.score - p.median;
  return (
    <li className={`fade grid gap-x-8 gap-y-3 rounded-[18px] px-4 py-5 sm:px-6 md:grid-cols-[12rem_1fr_9rem] md:items-center ${tone === "best" ? "bg-[var(--hl)]" : ""}`}>
      <div>
        <p className="text-[15px] font-semibold tracking-[-0.01em]">{p.label}</p>
        <p className="t-display tab mt-1 text-[40px] leading-none">
          <span className={tone === "weak" ? "text-[var(--mark-deep)]" : ""}>{p.score}</span>
          <span className="ml-1.5 text-[15px] font-medium tracking-normal text-[var(--muted)]">{`/ ${p.max}`}</span>
        </p>
      </div>

      {/* Range of the cohort, its median, and where this topper sits */}
      <div>
        <div className="relative h-10">
          <span className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-[var(--canvas)] shadow-[inset_0_0_0_1px_var(--line)]" />
          <span
            className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-[rgba(31,63,214,0.22)] transition-all duration-500 ease-[var(--ease)]"
            style={{ left: at(p.low), width: `calc(${at(p.high)} - ${at(p.low)})` }}
          />
          <span className="absolute top-1 bottom-1 w-[2px] -translate-x-1/2 rounded bg-[var(--ink)] transition-all duration-500 ease-[var(--ease)]" style={{ left: at(p.median) }} />
          <span
            className="absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_4px_10px_-4px_rgba(11,12,16,0.5)] transition-all duration-500 ease-[var(--ease)]"
            style={{ left: at(p.score), background: tone === "weak" ? "var(--mark)" : "var(--accent)" }}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
        </div>
        <div className="t-meta flex justify-between">
          <span>{`low ${p.low}`}</span>
          <span>{`median ${p.median}`}</span>
          <span>{`high ${p.high}`}</span>
        </div>
      </div>

      <div className="md:text-right">
        <p className={`tab text-[15px] font-semibold ${diff >= 0 ? "text-[var(--accent)]" : "text-[var(--mark-deep)]"}`}>
          {diff === 0 ? "At the median" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} vs median`}
        </p>
        <p className="mt-1 text-[13.5px] leading-[1.45] text-[var(--ink-2)]">{verdict(p, cohort)}</p>
      </div>
    </li>
  );
}

export default function PaperBreakdown({
  first,
  total,
  cohorts,
}: {
  first: string;
  total: number;
  cohorts: Cohort[];
}) {
  const [active, setActive] = useState(cohorts[0]?.id);
  const cohort = cohorts.find((c) => c.id === active) ?? cohorts[0];
  if (!cohort) return null;

  const scored = cohort.stats.filter((p) => p.max === 250 || p.key === "optional");
  // Strongest and weakest are judged against other toppers (share of the pool beaten), not by raw marks.
  const best = scored.reduce((a, b) => (b.beats > a.beats ? b : a));
  const weak = scored.reduce((a, b) => (b.beats < a.beats ? b : a));

  return (
    <section id="marks" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>{`Where the ${fmt(total)} marks `}<span className="text-[var(--accent)]">came from.</span></>}
          lead={`Against other toppers, ${first}'s strongest paper was ${best.label} (${best.score}/${best.max}, better than ${best.beats}% of them) and the weakest was ${weak.label} (${weak.score}/${weak.max}). Every paper below, set against real marks.`}
        />

        <div className="mt-12 flex flex-wrap items-center gap-2" role="tablist" aria-label="Compare with">
          <span className="mr-2 text-[14px] text-[var(--muted)]">Compare with</span>
          {cohorts.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === cohort.id}
              onClick={() => setActive(c.id)}
              data-track={`topper-cohort-${c.id}`}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-150 ${
                c.id === cohort.id ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"
              }`}
            >
              {c.label}
              <span className={`ml-1.5 tab ${c.id === cohort.id ? "text-white/60" : "text-[var(--muted)]"}`}>{c.size}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] bg-white p-2 shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)] sm:p-3">
          <ul className="divide-y divide-[var(--line)]">
            {cohort.stats.map((p) => (
              <Row key={p.key} p={p} cohort={cohort} tone={p.key === best.key ? "best" : p.key === weak.key ? "weak" : null} />
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[40rem] text-[13.5px] leading-[1.5] text-[var(--muted)]">
            {`Blue band: the range across ${cohort.size} ${cohort.phrase}. Black line: their median. Only marksheets with every paper on record are counted.`}
          </p>
          <Link href="/toppers/marks-database" data-track="topper-marks-database" className="btn btn-paper">
            Open the marks database <span className="knob">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
