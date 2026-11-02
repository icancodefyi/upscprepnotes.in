import { getTraffic, parseRange } from "@/lib/admin/insights";
import { BarList, Card, DailyBars, InsightTabs, NoTracking, PageHeader, Stat, dur, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function TrafficPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const t = await getTraffic(range);
  const empty = t.totals.events === 0;

  return (
    <div>
      <PageHeader title="Insights" desc="What visitors do on the site, from the tracking collection." range={range} basePath="/admin/tracking" />
      <InsightTabs active="/admin/tracking" range={range} />
      {empty ? (
        <NoTracking />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Stat label="Visitors" value={num(t.totals.visitors)} />
            <Stat label="Sessions" value={num(t.totals.sessions)} sub={t.totals.visitors ? `${(t.totals.sessions / t.totals.visitors).toFixed(1)} per visitor` : undefined} />
            <Stat label="Page views" value={num(t.totals.views)} sub={t.totals.sessions ? `${(t.totals.views / t.totals.sessions).toFixed(1)} per session` : undefined} />
            <Stat label="Avg time on page" value={dur(t.totals.avgTimeMs)} />
            <Stat label="Avg scroll depth" value={t.totals.avgScroll ? `${Math.round(t.totals.avgScroll)}%` : "—"} />
          </div>

          <Card title="Visitors per day" className="mt-4">
            <DailyBars series={t.daily} />
          </Card>

          <Card title="Top pages" desc="Views, unique visitors, time on page and how far people scroll" className="mt-4">
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500">
                    <th className="px-2 pb-2 font-medium">Page</th>
                    <th className="px-2 pb-2 text-right font-medium">Views</th>
                    <th className="px-2 pb-2 text-right font-medium">Visitors</th>
                    <th className="px-2 pb-2 text-right font-medium">Avg time</th>
                    <th className="px-2 pb-2 text-right font-medium">Avg scroll</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {t.pages.map((p) => (
                    <tr key={p.path}>
                      <td className="max-w-[360px] truncate px-2 py-2">
                        <a href={p.path} target="_blank" rel="noreferrer" className="text-zinc-800 hover:underline">{p.path}</a>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">{num(p.views)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{num(p.visitors)}</td>
                      <td className="px-2 py-2 text-right tabular-nums text-zinc-600">{dur(p.avgTimeMs)}</td>
                      <td className="px-2 py-2 text-right tabular-nums text-zinc-600">{p.avgScroll ? `${Math.round(p.avgScroll)}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card title="Where sessions come from" desc="UTM source, else the referring site, else direct">
              <BarList rows={t.sources} />
            </Card>
            <Card title="Landing pages" desc="The first page of each session">
              <BarList rows={t.landings} />
            </Card>
            <Card title="Devices" desc="Unique visitors">
              <BarList rows={t.devices} />
            </Card>
            <Card title="Countries" desc="Unique visitors (needs the Vercel deployment)">
              <BarList rows={t.countries} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
