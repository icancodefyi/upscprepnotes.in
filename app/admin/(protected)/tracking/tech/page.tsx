import { getTech, parseRange } from "@/lib/admin/insights";
import { BarList, Card, InsightTabs, PageHeader, Stat, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

const ms = (n: number) => (n ? `${n >= 1000 ? (n / 1000).toFixed(1) + " s" : n + " ms"}` : "—");
const grade = (v: number, good: number, poor: number) => (!v ? "text-zinc-400" : v <= good ? "text-[#1f3fd6]" : v <= poor ? "text-amber-600" : "text-red-600");

export default async function TechPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const t = await getTech(range);
  const v = t.vitals;

  return (
    <div>
      <PageHeader title="Insights" desc="What people browse on, how fast the site feels to them, and which language and connection they have." range={range} basePath="/admin/tracking/tech" />
      <InsightTabs active="/admin/tracking/tech" range={range} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Loads fast (LCP ≤ 2.5s)" value={v.samples ? `${v.goodLcp}%` : "—"} sub={v.samples ? `${num(v.samples)} page loads` : "needs tracking"} />
        <Stat label="Largest paint (75th)" value={ms(v.lcp)} />
        <Stat label="Layout shift (75th)" value={v.samples ? String(v.cls) : "—"} />
        <Stat label="Interaction delay (75th)" value={ms(v.inp)} />
        <Stat label="Server response (75th)" value={ms(v.ttfb)} />
      </div>
      <p className="mt-2 text-xs text-zinc-400">Good targets: largest paint under 2.5 s, layout shift under 0.1, interaction delay under 200 ms. Measured in real visitors&apos; browsers (75th percentile, so the slower quarter of visits is included).</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Browsers" desc="Unique visitors, from the page-view history">
          <BarList rows={t.browsers} />
          <p className="mt-3 text-xs text-zinc-400">Instagram, Telegram and WhatsApp in-app browsers mean people arrive from those apps: check the site works well inside them.</p>
        </Card>
        <Card title="Operating systems" desc="Unique visitors">
          <BarList rows={t.oses} />
        </Card>
        <Card title="Screen widths" desc={t.sessionsTracked ? `${num(t.sessionsTracked)} tracked visits` : "needs tracking"}>
          <BarList rows={t.screens} empty="Needs tracking data." />
        </Card>
        <Card title="Languages" desc="Browser language, first choice">
          <BarList rows={t.languages} empty="Needs tracking data." />
        </Card>
        <Card title="Connection quality" desc="Where the browser reports it">
          <BarList rows={t.connections} empty="Needs tracking data (not reported by every browser)." />
        </Card>
        <Card title="Visit habits" desc="From tracked visits">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-500">Returning browsers</dt><dd className="font-semibold tabular-nums">{t.sessionsTracked ? `${t.returningShare}%` : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Average visit number</dt><dd className="font-semibold tabular-nums">{t.sessionsTracked ? t.avgVisitNumber : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Dark mode</dt><dd className="font-semibold tabular-nums">{t.sessionsTracked ? `${t.darkShare}%` : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Installed as an app</dt><dd className="font-semibold tabular-nums">{t.sessionsTracked ? `${t.standaloneShare}%` : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Data saver on</dt><dd className="font-semibold tabular-nums">{t.sessionsTracked ? `${t.saveDataShare}%` : "—"}</dd></div>
          </dl>
        </Card>
      </div>

      <Card title="Speed by page" desc="75th percentile per page, from real visits" className="mt-4">
        {t.pages.length ? (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500">
                  <th className="px-2 pb-2 font-medium">Page</th>
                  <th className="px-2 pb-2 text-right font-medium">Loads</th>
                  <th className="px-2 pb-2 text-right font-medium">Largest paint</th>
                  <th className="px-2 pb-2 text-right font-medium">Layout shift</th>
                  <th className="px-2 pb-2 text-right font-medium">Interaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {t.pages.map((p) => (
                  <tr key={p.path}>
                    <td className="max-w-[260px] truncate px-2 py-2">{p.path}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{p.n}</td>
                    <td className={`px-2 py-2 text-right font-medium tabular-nums ${grade(p.lcp, 2500, 4000)}`}>{ms(p.lcp)}</td>
                    <td className={`px-2 py-2 text-right font-medium tabular-nums ${grade(p.cls, 0.1, 0.25)}`}>{p.cls}</td>
                    <td className={`px-2 py-2 text-right font-medium tabular-nums ${grade(p.inp, 200, 500)}`}>{ms(p.inp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">Needs tracking data. Page speed is recorded for real visitors once the new tracking is live.</p>
        )}
      </Card>
    </div>
  );
}
