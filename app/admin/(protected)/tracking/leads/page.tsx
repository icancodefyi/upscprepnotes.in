import Link from "next/link";
import { getLeads, parseRange } from "@/lib/admin/insights";
import { BarList, Card, DailyBars, InsightTabs, PageHeader, Stat, ago, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const l = await getLeads(range);

  return (
    <div>
      <PageHeader
        title="Insights"
        desc="Your email list: how fast it grows, where it comes from, and how many people turn into buyers."
        range={range}
        basePath="/admin/tracking/leads"
        extra={
          <a href="/api/admin/leads/export" className="btn btn-paper h-10 px-4 [--btn-fs:14px]">
            Export list (CSV)
          </a>
        }
      />
      <InsightTabs active="/admin/tracking/leads" range={range} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="People on the list" value={num(l.total)} sub="unique emails, all forms" />
        <Stat label="New this period" value={num(l.newInWindow)} sub={`last ${range} days`} />
        <Stat label="Used 2+ forms" value={num(l.multi)} sub="more engaged" />
        <Stat label="Became buyers" value={`${l.buyerRate}%`} sub={`${num(l.buyers)} of the list`} />
        <Stat label="Quiet 30+ days" value={num(l.stale)} sub="no form in a month, not buyers" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="New emails per day">
          <DailyBars series={l.daily} />
        </Card>
        <Card title="List size over time" desc="Unique emails, weekly, last 12 weeks">
          <BarList rows={l.cumulative} max={12} />
        </Card>
        <Card title="Where new emails come from" desc="The first form each new person used">
          <BarList rows={l.bySource} empty="No new emails in this period." />
        </Card>
        <Card title="Using the list" desc="Ideas from the numbers">
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700">
            <li>Export the CSV and import it into your email tool; the sources column lets you segment by interest.</li>
            <li>People who used 2+ forms ({num(l.multi)}) are your warmest audience: offer them the paid version first.</li>
            <li>{num(l.stale)} people haven&apos;t been active in 30 days and haven&apos;t bought: a re-engagement email is worth one send.</li>
          </ul>
        </Card>
      </div>

      <Card title="Latest activity" desc="Most recent people on the list" className="mt-4">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-2 pb-2 font-medium">Email</th>
                <th className="px-2 pb-2 font-medium">Forms used</th>
                <th className="px-2 pb-2 text-right font-medium">Count</th>
                <th className="px-2 pb-2 font-medium">Last</th>
                <th className="px-2 pb-2 text-right font-medium">Bought</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {l.recent.map((p) => (
                <tr key={p.email}>
                  <td className="max-w-[240px] truncate px-2 py-2"><Link href={`/admin/tracking/journeys?q=${encodeURIComponent(p.email)}`} className="font-medium hover:underline">{p.email}</Link></td>
                  <td className="max-w-[260px] truncate px-2 py-2 text-zinc-600">{p.sources}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{p.forms}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-zinc-500">{ago(p.last)}</td>
                  <td className="px-2 py-2 text-right">{p.bought ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">yes</span> : <span className="text-zinc-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
