import Link from "next/link";
import { card } from "@/components/brand/ui";
import type { OptionalStats } from "@/lib/paper-stats";

/** Every optional with enough complete marksheets, ranked by median optional score. Live from the database. */
export default function OptionalData({ o }: { o: OptionalStats }) {
  const max = Math.max(...o.rows.map((r) => r.optMedian), 1);
  return (
    <div className={`${card} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-s">
          <thead>
            <tr className="text-left text-[var(--muted)]">
              <th scope="col" className="px-5 py-3 font-normal">Optional</th>
              <th scope="col" className="px-3 py-3 text-right font-normal">Toppers</th>
              <th scope="col" className="px-3 py-3 font-normal">Median optional (of 500)</th>
              <th scope="col" className="px-3 py-3 text-right font-normal">Best</th>
              <th scope="col" className="px-3 py-3 text-right font-normal">Median GS I–IV</th>
              <th scope="col" className="px-5 py-3 text-right font-normal">Median total</th>
            </tr>
          </thead>
          <tbody className="tab">
            {o.rows.map((r) => (
              <tr key={r.subject} className="border-t border-[var(--line)]">
                <td className="px-5 py-2.5">
                  <Link href={`/optional/${r.slug}`} className="font-bold hover:text-[var(--accent)]">{r.subject}</Link>
                </td>
                <td className="px-3 py-2.5 text-right text-[var(--ink-2)]">{r.n}</td>
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-3">
                    <span className="h-2 w-28 overflow-hidden rounded-full bg-[var(--canvas)]">
                      <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${(r.optMedian / max) * 100}%` }} />
                    </span>
                    <span className="font-bold">{r.optMedian}</span>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right text-[var(--ink-2)]" title={r.bestName}>{r.optBest}</td>
                <td className="px-3 py-2.5 text-right text-[var(--ink-2)]">{r.gsMedian}</td>
                <td className="px-5 py-2.5 text-right text-[var(--ink-2)]">{r.totalMedian.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-[var(--line)] px-5 py-3 text-s leading-[1.5] text-[var(--muted)]">
        {`Optionals with at least ${o.minN} complete marksheets, out of ${o.marksheets}. Toppers only: this shows how people who cleared the exam scored, not how hard each optional is for everyone.`}
      </p>
    </div>
  );
}
