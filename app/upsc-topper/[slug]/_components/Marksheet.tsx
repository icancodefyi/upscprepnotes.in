import { fmt, type PaperStat } from "@/lib/topper-stats";
import { card } from "@/components/brand/ui";

/**
 * The marksheet as UPSC prints it, plus one quiet column: how each paper compares with the
 * median of every complete topper marksheet we hold.
 */
export default function Marksheet({
  papers,
  optional,
  written,
  interview,
  total,
  pool,
}: {
  papers: PaperStat[];
  optional: string;
  written: number;
  interview: number;
  total: number;
  pool: number;
}) {
  const mains = papers.filter((p) => p.key !== "interview");
  const best = [...mains].sort((a, b) => b.beats - a.beats)[0];
  const weak = [...mains].sort((a, b) => a.beats - b.beats)[0];

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-[14px] sm:text-[15px]">
          <thead>
            <tr className="t-meta text-left">
              <th className="px-4 pb-3 pt-5 font-normal sm:px-6">PAPER</th>
              <th className="px-3 pb-3 pt-5 text-right font-normal">MARKS</th>
              <th className="hidden px-3 pb-3 pt-5 font-normal sm:table-cell" aria-label="Share of maximum" />
              <th className="px-4 pb-3 pt-5 text-right font-normal sm:px-6"><span className="sm:hidden">VS MEDIAN</span><span className="hidden sm:inline">VS TOPPER MEDIAN</span></th>
            </tr>
          </thead>
          <tbody>
            {papers.map((p) => {
              const diff = p.score - p.median;
              const tag = p.key === best?.key ? "Strongest" : p.key === weak?.key ? "Weakest" : null;
              return (
                <tr key={p.key} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3.5 sm:px-6">
                    <span className="font-medium">{p.key === "optional" ? `Optional · ${optional}` : p.label}</span>
                    {tag && (
                      <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${tag === "Strongest" ? "bg-[var(--hl)] text-[var(--hl-ink)]" : "bg-[#ffe4de] text-[var(--mark-deep)]"}`}>
                        {tag}
                      </span>
                    )}
                  </td>
                  <td className="tab whitespace-nowrap px-3 py-3.5 text-right">
                    <span className="font-semibold">{p.score}</span>
                    <span className="text-[var(--muted)]">{` / ${p.max}`}</span>
                  </td>
                  <td className="hidden w-[28%] px-3 py-3.5 sm:table-cell">
                    <span className="relative block h-[6px] rounded-full bg-[var(--canvas)]">
                      <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]" style={{ width: `${(p.score / p.max) * 100}%` }} />
                      <span className="absolute -top-[3px] h-3 w-[2px] rounded bg-[var(--ink)]" style={{ left: `${(p.median / p.max) * 100}%` }} title={`Median ${p.median}`} />
                    </span>
                  </td>
                  <td className={`tab whitespace-nowrap px-4 py-3.5 text-right font-medium sm:px-6 ${diff >= 0 ? "text-[var(--accent)]" : "text-[var(--mark-deep)]"}`}>
                    {diff === 0 ? "at median" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)}`}
                    <span className="ml-2 hidden font-normal text-[var(--muted)] sm:inline">{`#${p.position} of ${p.of}`}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {written > 0 && (
              <tr className="border-t border-[var(--line-2)] bg-[var(--canvas)]/60">
                <td className="px-4 py-3.5 text-[var(--ink-2)] sm:px-6">Written total</td>
                <td className="tab px-3 py-3.5 text-right font-semibold">{`${fmt(written)}`}<span className="font-normal text-[var(--muted)]"> / 1,750</span></td>
                <td className="hidden sm:table-cell" />
                <td />
              </tr>
            )}
            {papers.length === 0 && interview > 0 && (
              <tr className="border-t border-[var(--line)]">
                <td className="px-4 py-3.5 text-[var(--ink-2)] sm:px-6">Personality Test</td>
                <td className="tab px-3 py-3.5 text-right font-semibold">{interview}<span className="font-normal text-[var(--muted)]"> / 275</span></td>
                <td className="hidden sm:table-cell" />
                <td />
              </tr>
            )}
            <tr className="border-t border-[var(--line-2)] bg-[#e9edff]">
              <td className="px-4 py-4 font-semibold text-[var(--accent-deep)] sm:px-6">Final total</td>
              <td className="tab px-3 py-4 text-right">
                <span className="relative inline-block">
                  <span className="t-head text-[22px] text-[var(--accent-deep)]">{fmt(total)}</span>
                  <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-3 -top-2 h-[calc(100%+16px)] w-[calc(100%+24px)] overflow-visible" style={{ "--d": "400ms" } as React.CSSProperties}>
                    <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="ml-3 text-[var(--muted)]">/ 2,025</span>
              </td>
              <td className="hidden sm:table-cell" />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="border-t border-[var(--line)] px-6 py-3.5 text-[13px] leading-[1.5] text-[var(--muted)]">
        {papers.length
          ? `Black tick: the median of ${pool} complete topper marksheets. #1 is the highest score among them. Source: UPSC final result.`
          : "UPSC's result lists the written and interview totals for this topper. Paper-by-paper marks are not on record yet."}
      </p>
    </div>
  );
}
