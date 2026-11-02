import { getAcquisition, parseRange, pct } from "@/lib/admin/insights";
import { BarList, Card, InsightTabs, PageHeader, Stat, inr, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function AcquisitionPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const a = await getAcquisition(range);
  const tracked = a.mode === "tracking";

  return (
    <div>
      <PageHeader title="Insights" desc="Where visitors come from, and which sources turn into emails and paying customers." range={range} basePath="/admin/tracking/acquisition" />
      <InsightTabs active="/admin/tracking/acquisition" range={range} />

      {!tracked && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          Showing history from the old analytics: sessions by referring site only. Email and purchase attribution per source starts once the new tracking has data on the live site, because it records campaign tags (utm_source and so on) and each visitor&apos;s first source.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Sessions" value={num(a.sessions)} />
        <Stat label="Sources" value={num(a.sources.length)} />
        <Stat label="Emails captured" value={tracked ? num(a.sources.reduce((x, s) => x + s.leads, 0)) : "—"} sub={tracked ? "sessions that left an email" : "needs tracking"} />
        <Stat label="Revenue attributed" value={tracked ? inr(a.sources.reduce((x, s) => x + s.revenue, 0)) : "—"} sub={tracked ? "by the session's source" : "needs tracking"} />
      </div>

      <Card title="Sources" desc="UTM source and medium, else the referring site, else direct" className="mt-4">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-2 pb-2 font-medium">Source</th>
                <th className="px-2 pb-2 text-right font-medium">Sessions</th>
                <th className="px-2 pb-2 text-right font-medium">Emails</th>
                <th className="px-2 pb-2 text-right font-medium">Email rate</th>
                <th className="px-2 pb-2 text-right font-medium">Checkouts</th>
                <th className="px-2 pb-2 text-right font-medium">Paid</th>
                <th className="px-2 pb-2 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {a.sources.map((s) => (
                <tr key={s.label}>
                  <td className="max-w-[260px] truncate px-2 py-2 font-medium">{s.label}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{num(s.sessions)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{tracked ? num(s.leads) : "—"}</td>
                  <td className="px-2 py-2 text-right tabular-nums text-zinc-600">{tracked ? `${pct(s.leads, s.sessions)}%` : "—"}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{tracked ? num(s.carts) : "—"}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{tracked ? num(s.buyers) : "—"}</td>
                  <td className="px-2 py-2 text-right font-medium tabular-nums">{tracked ? inr(s.revenue) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Landing pages" desc="Where sessions start" >
          {tracked ? (
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500">
                    <th className="px-2 pb-2 font-medium">Page</th>
                    <th className="px-2 pb-2 text-right font-medium">Sessions</th>
                    <th className="px-2 pb-2 text-right font-medium">Emails</th>
                    <th className="px-2 pb-2 text-right font-medium">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {(a.landings as { label: string; sessions: number; leads: number; buyers: number }[]).map((l) => (
                    <tr key={l.label}>
                      <td className="max-w-[240px] truncate px-2 py-2">{l.label}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{num(l.sessions)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{num(l.leads)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{num(l.buyers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <BarList rows={a.landings.map((l) => ({ label: l.label, value: l.sessions }))} />
          )}
        </Card>
        <Card title="Campaigns" desc="From utm_campaign in links you share">
          <BarList rows={a.campaigns.map((c) => ({ label: c.label, value: c.sessions }))} empty="No campaign tags yet. Add ?utm_source=instagram&utm_campaign=name to links you post." />
        </Card>
      </div>
    </div>
  );
}
