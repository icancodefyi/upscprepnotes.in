import type { PaperStat } from "@/lib/topper-stats";
import { card } from "@/components/brand/ui";

type Row = { label: string; value: number; stat?: PaperStat };

/** The marksheet as originally listed (GS1–4, Essay, Optional P1/P2, Written Total, Interview, Total), drawn on paper. */
export default function Marksheet({
  caption,
  rows,
  written,
  interview,
  total,
  year,
}: {
  caption: string;
  rows: Row[];
  written: number;
  interview: number;
  total: number;
  year: number;
  pool?: number;
}) {
  return (
    <div className={`${card} overflow-hidden`}>
      <table className="w-full text-s sm:text-m">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} className={i > 0 ? "border-t border-[var(--line)]" : ""}>
              <td className="px-5 py-3 text-[var(--ink-2)] sm:px-6">{r.label}</td>
              <td className="hidden w-[40%] px-3 py-3 sm:table-cell">
                <span className="block h-[6px] rounded-full bg-[var(--canvas)]">
                  <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(100, (r.value / 250) * 100)}%` }} />
                </span>
              </td>
              <td className="tab px-5 py-3 text-right font-bold sm:px-6">{r.value}</td>
            </tr>
          ))}
          <tr className="border-t border-[var(--line-2)] bg-[var(--canvas)]/60">
            <td className="px-5 py-3 font-bold text-[var(--ink-2)] sm:px-6">Written Total</td>
            <td className="hidden sm:table-cell" />
            <td className="tab px-5 py-3 text-right font-bold sm:px-6">{written}</td>
          </tr>
          <tr className="border-t border-[var(--line)]">
            <td className="px-5 py-3 text-[var(--ink-2)] sm:px-6">Interview</td>
            <td className="hidden sm:table-cell" />
            <td className="tab px-5 py-3 text-right font-bold sm:px-6">{interview}</td>
          </tr>
          <tr className="border-t-2 border-[var(--ink)] bg-[#e9edff]">
            <td className="px-5 py-4 font-bold text-[var(--accent-deep)] sm:px-6">Total</td>
            <td className="hidden sm:table-cell" />
            <td className="tab px-5 py-4 text-right sm:px-6">
              <span className="relative inline-block">
                <span className="t-head text-l text-[var(--accent-deep)]">{total}</span>
                <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-3 -top-2 h-[calc(100%+16px)] w-[calc(100%+24px)] overflow-visible" style={{ "--d": "400ms" } as React.CSSProperties}>
                  <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="border-t border-[var(--line)] px-5 py-3 text-s text-[var(--muted)] sm:px-6">
        Source:{" "}
        <a href="https://upsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] hover:underline">
          UPSC CSE {year} Final Result
        </a>
      </div>
    </div>
  );
}
