import Link from "next/link";
import { getAudience, getTimePatterns, parseRange } from "@/lib/admin/insights";
import { CohortTable, Heatmap, StackedBars } from "@/components/admin/charts";
import { BarList, Card, InsightTabs, PageHeader, Stat, num, when } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function AudiencePage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const [a, t] = await Promise.all([getAudience(range), getTimePatterns(range === 7 ? 30 : range)]);
  const s = a.stickiness;

  return (
    <div>
      <PageHeader title="Insights" desc="Who comes back. Each browser counts once (a person on a phone and a laptop counts twice). Built from the full page-view history." range={range} basePath="/admin/tracking/audience" />
      <InsightTabs active="/admin/tracking/audience" range={range} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Active visitors" value={num(a.activeInWindow)} sub={`last ${range} days`} />
        <Stat label="New" value={num(a.newInWindow)} sub="first visit in this period" />
        <Stat label="Returning" value={num(a.returningInWindow)} sub={`${a.returningRate}% of active`} />
        <Stat label="New who came back" value={`${a.newCameBackRate}%`} sub="visited on another day" />
        <Stat label="Ever returned" value={`${a.repeatRate}%`} sub={`of ${num(a.totalVisitors)} browsers, all time`} />
      </div>

      <Card title="New and returning visitors per day" className="mt-4">
        <StackedBars series={a.daily.map((d) => ({ day: d.day, a: d.new, b: d.returning }))} a={{ label: "New", color: "#1f3fd6" }} b={{ label: "Returning", color: "#ffe45c" }} />
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Stickiness" desc="How often the same people come back">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-500">Daily visitors (30-day average)</dt><dd className="font-semibold tabular-nums">{num(s.dau)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Weekly visitors (last 7 days)</dt><dd className="font-semibold tabular-nums">{num(s.wau)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Monthly visitors (last 30 days)</dt><dd className="font-semibold tabular-nums">{num(s.mau)}</dd></div>
            <div className="flex justify-between border-t border-black/[0.06] pt-3"><dt className="text-zinc-500">Daily ÷ monthly</dt><dd className="font-semibold tabular-nums">{s.dauMau}%</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Daily ÷ weekly</dt><dd className="font-semibold tabular-nums">{s.dauWau}%</dd></div>
          </dl>
          <p className="mt-3 text-xs text-zinc-400">A daily ÷ monthly figure above 20% is strong for a content site; under 5% means visitors rarely return.</p>
        </Card>
        <Card title="When people come back" desc="Among visitors who ever returned: days from first visit to second">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-500">Typical time to first return</dt><dd className="font-semibold tabular-nums">{a.gapMedian} days</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">3 in 4 have returned within</dt><dd className="font-semibold tabular-nums">{a.gapP75} days</dd></div>
            <div className="flex justify-between border-t border-black/[0.06] pt-3"><dt className="text-zinc-500">Came back the next day</dt><dd className="font-semibold tabular-nums">{a.returnWithin.d1}%</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Within a week</dt><dd className="font-semibold tabular-nums">{a.returnWithin.d7}%</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Within a month</dt><dd className="font-semibold tabular-nums">{a.returnWithin.d30}%</dd></div>
          </dl>
          <p className="mt-3 text-xs text-zinc-400">Time your first follow-up email or post inside this window, while people are still likely to come back on their own.</p>
        </Card>
        <Card title="How many days people visit" desc="Distinct days each browser has been seen">
          <BarList rows={a.freq} />
          <h3 className="mt-5 text-sm font-semibold text-zinc-900">Last seen</h3>
          <div className="mt-2">
            <BarList rows={a.recency} />
          </div>
        </Card>
      </div>

      <Card title="Weekly retention" desc="Of the visitors first seen in a week (left), the share who came back in each later week" className="mt-4">
        <CohortTable rows={a.cohorts} />
      </Card>

      <Card title="When visitors are on the site" desc={`Page views by day and hour, IST, last ${range === 7 ? 30 : range} days`} className="mt-4">
        <Heatmap names={t.names} grid={t.grid} max={t.max} />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Busiest hours</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {t.slots.map((x) => (
                <li key={x.day + x.hour} className="flex justify-between"><span>{x.day} {x.hour}:00–{x.hour + 1}:00</span><span className="tabular-nums text-zinc-500">{num(x.n)}</span></li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">By day of week</h3>
              <div className="mt-2"><BarList rows={t.byDay} /></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">By hour (top)</h3>
              <div className="mt-2"><BarList rows={[...t.byHour].sort((x, y) => y.value - x.value)} max={7} /></div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Most loyal visitors" desc="Browsers seen on the most different days" className="mt-4">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-2 pb-2 font-medium">Visitor</th>
                <th className="px-2 pb-2 text-right font-medium">Days</th>
                <th className="px-2 pb-2 text-right font-medium">Visits</th>
                <th className="px-2 pb-2 text-right font-medium">Page views</th>
                <th className="px-2 pb-2 font-medium">First seen</th>
                <th className="px-2 pb-2 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {a.topReturning.map((v) => (
                <tr key={v.id}>
                  <td className="px-2 py-2"><Link href={`/admin/tracking/journeys?q=${encodeURIComponent(v.id)}`} className="font-medium hover:underline">{v.id.slice(0, 14)}…</Link></td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums">{v.days}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{v.sessions}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{v.views}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-zinc-500">{when(v.first)}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-zinc-500">{when(v.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
