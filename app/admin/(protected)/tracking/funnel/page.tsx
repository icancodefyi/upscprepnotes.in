import { getFunnel, parseRange, pct } from "@/lib/admin/insights";
import { Card, InsightTabs, PageHeader, Stat, inr, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

/** For each product: views → buy clicks (tracking) → checkouts → paid (orders). */
export default async function FunnelPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const { rows, total } = await getFunnel(range);
  const steps = [
    { label: "Product views", value: total.views },
    { label: "Buy clicks", value: total.buyClicks },
    { label: "Checkouts started", value: total.checkouts },
    { label: "Paid", value: total.paid },
  ];
  const top = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div>
      <PageHeader title="Insights" desc="Where buyers drop off, product by product. Views and buy clicks come from tracking; checkouts and payments from orders." range={range} basePath="/admin/tracking/funnel" />
      <InsightTabs active="/admin/tracking/funnel" range={range} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Revenue" value={inr(total.revenue)} />
        <Stat label="Paid" value={num(total.paid)} sub={`of ${num(total.checkouts)} checkouts`} />
        <Stat label="Checkout → paid" value={`${pct(total.paid, total.checkouts)}%`} />
        <Stat label="View → paid" value={total.views ? `${pct(total.paid, total.views)}%` : "—"} sub={total.views ? undefined : "needs tracking"} />
      </div>

      <Card title="Whole store" className="mt-4">
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <span className="w-36 shrink-0 text-zinc-600">{s.label}</span>
              <span className="relative h-7 flex-1 overflow-hidden rounded-md bg-zinc-50">
                <span className="absolute inset-y-0 left-0 rounded-md bg-zinc-900" style={{ width: `${(s.value / top) * 100}%` }} />
              </span>
              <span className="w-28 shrink-0 text-right tabular-nums">
                <span className="font-medium">{num(s.value)}</span>
                {i > 0 && steps[i - 1].value > 0 && <span className="ml-1.5 text-xs text-zinc-400">{pct(s.value, steps[i - 1].value)}%</span>}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="By product" className="mt-4">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-2 pb-2 font-medium">Product</th>
                <th className="px-2 pb-2 text-right font-medium">Price</th>
                <th className="px-2 pb-2 text-right font-medium">Views</th>
                <th className="px-2 pb-2 text-right font-medium">Buy clicks</th>
                <th className="px-2 pb-2 text-right font-medium">Checkouts</th>
                <th className="px-2 pb-2 text-right font-medium">Paid</th>
                <th className="px-2 pb-2 text-right font-medium">Revenue</th>
                <th className="px-2 pb-2 text-right font-medium">Checkout → paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {rows.map((r) => (
                <tr key={r.slug}>
                  <td className="max-w-[260px] truncate px-2 py-2">
                    <a href={`/store/${r.slug}`} target="_blank" rel="noreferrer" className="font-medium text-zinc-900 hover:underline">{r.title}</a>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-zinc-600">{r.price ? inr(r.price) : "—"}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{num(r.views)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{num(r.buyClicks)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{num(r.checkouts)}</td>
                  <td className="px-2 py-2 text-right font-medium tabular-nums">{num(r.paid)}</td>
                  <td className="px-2 py-2 text-right font-medium tabular-nums">{inr(r.revenue)}</td>
                  <td className="px-2 py-2 text-right tabular-nums text-zinc-600">{r.checkouts ? `${pct(r.paid, r.checkouts)}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
