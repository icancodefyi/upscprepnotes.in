import Link from "next/link";
import { card } from "@/components/brand/ui";
import { PAPER_META, type PaperStats } from "@/lib/paper-stats";

/**
 * The numbers behind a strategy guide, drawn live from every complete marksheet:
 * benchmarks, the score spread, rank-band medians and the ten highest scorers.
 */
export default function PaperData({ s }: { s: PaperStats }) {
  const meta = PAPER_META[s.key];
  const biggest = Math.max(...s.bands.map((b) => b.count), 1);
  return (
    <div className="space-y-5">
      <div className={`${card} grid grid-cols-2 divide-[var(--line)] sm:grid-cols-4 sm:divide-x`}>
        {[
          { k: "Median topper", v: s.median },
          { k: "Top 10% from", v: s.top10 },
          { k: "Top 25% from", v: s.top25 },
          { k: "Highest", v: s.best, mark: true },
        ].map((x) => (
          <div key={x.k} className="px-5 py-4">
            <p className="text-s text-[var(--muted)]">{x.k}</p>
            <p className="mt-1">
              <span className={`t-display tab text-l leading-none ${x.mark ? "text-[var(--accent)]" : ""}`}>{x.v}</span>
              <span className="ml-1 text-s text-[var(--muted)]">{`of ${s.max}`}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className={`${card} p-5`}>
          <p className="text-m font-bold">How the scores spread</p>
          <p className="text-s text-[var(--muted)]">{`${s.n} complete marksheets, CSE ${s.years}`}</p>
          <ul className="mt-4 space-y-2.5">
            {s.bands.map((b) => (
              <li key={b.label} className="grid grid-cols-[72px_1fr_44px] items-center gap-3 text-s">
                <span className="tab text-[var(--ink-2)]">{b.label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[var(--canvas)]">
                  <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${(b.count / biggest) * 100}%`, opacity: b.count ? 1 : 0 }} />
                </span>
                <span className="tab text-right font-bold">{b.count}</span>
              </li>
            ))}
          </ul>
        </div>
        {s.byRank.length > 1 && (
          <div className={`${card} p-5`}>
            <p className="text-m font-bold">Median by rank band</p>
            <p className="text-s text-[var(--muted)]">Does this paper separate the top ranks?</p>
            <ul className="mt-4 divide-y divide-[var(--line)] text-s">
              {s.byRank.map((b) => (
                <li key={b.label} className="flex items-baseline justify-between py-2">
                  <span className="text-[var(--ink-2)]">{b.label}</span>
                  <span className="tab">
                    <span className="font-bold">{b.median}</span>
                    <span className="text-[var(--muted)]">{` · ${b.n} toppers`}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--line)] px-5 py-4">
          <p className="text-m font-bold">{`Highest ${meta.short} scores`}</p>
          <Link href={`/toppers/marks-database?${s.key === "psir" ? "optional=PSIR&" : ""}sort=${meta.sort}.desc`} className="text-s font-bold text-[var(--accent)] hover:underline">
            Sort all marksheets →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-s">
            <thead>
              <tr className="text-left text-[var(--muted)]">
                <th scope="col" className="px-5 py-2.5 font-normal">Topper</th>
                <th scope="col" className="px-3 py-2.5 font-normal">Optional</th>
                <th scope="col" className="px-3 py-2.5 text-right font-normal">{meta.short}</th>
                <th scope="col" className="px-5 py-2.5 text-right font-normal">Final total</th>
              </tr>
            </thead>
            <tbody className="tab">
              {s.top.map((t) => (
                <tr key={t.slug} className="border-t border-[var(--line)]">
                  <td className="px-5 py-2.5">
                    <Link href={`/upsc-topper/${t.slug}`} className="font-bold hover:text-[var(--accent)]">{t.name}</Link>
                    <span className="text-[var(--muted)]">{` · AIR ${t.rank}, ${t.year}`}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--ink-2)]">{t.optional}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-[var(--accent)]">{t.score}</td>
                  <td className="px-5 py-2.5 text-right text-[var(--ink-2)]">{t.total.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[var(--line)] px-5 py-3 text-s text-[var(--muted)]">
          From UPSC&apos;s published marks of recommended candidates. Updated automatically as marksheets are added.
        </p>
      </div>
    </div>
  );
}
