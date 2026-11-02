import Link from "next/link";
import { getOverview, parseRange, delta } from "@/lib/admin/insights";
import { BarList, Card, DailyBars, Empty, PageHeader, Stat, ago, inr, num, when } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

type OrderRow = { _id: unknown; email?: string; items?: { title?: string; slug?: string }[]; total?: number; status?: string; createdAt?: Date; ref?: string };

const STATUS: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  delivered: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
};

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const o = await getOverview(range);
  const period = `vs previous ${range} days`;

  return (
    <div>
      <PageHeader title="Dashboard" desc="How the store and the site are doing. Revenue and orders come from paid orders; visitors from site tracking." range={range} basePath="/admin" />

      {/* Money */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Revenue" value={inr(o.revenue.cur)} change={delta(o.revenue.cur, o.revenue.prev)} sub={period} />
        <Stat label="Paid orders" value={num(o.orders.cur)} change={delta(o.orders.cur, o.orders.prev)} sub={`${num(o.checkouts.cur)} checkouts started`} />
        <Stat label="Average order" value={o.aov.cur ? inr(o.aov.cur) : "—"} change={delta(o.aov.cur, o.aov.prev)} sub={period} />
        <Stat label="Checkout → paid" value={`${o.checkoutConversion.cur}%`} change={delta(o.checkoutConversion.cur, o.checkoutConversion.prev)} sub={`${inr(o.pendingValue)} left unpaid`} />
      </div>

      {/* Audience */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Visitors" value={num(o.visitors.cur)} change={delta(o.visitors.cur, o.visitors.prev)} sub={`from ${o.visitorSource}`} />
        <Stat label="Visitor → buyer" value={`${o.buyerConversion.cur}%`} change={delta(o.buyerConversion.cur, o.buyerConversion.prev)} sub="paid orders / visitors" />
        <Stat label="New emails" value={num(o.leads.cur)} change={delta(o.leads.cur, o.leads.prev)} sub="all lead forms" />
        <Stat label="AI questions" value={num(o.ai.questions)} sub={`${num(o.ai.conversations)} new conversations`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card title="Revenue per day" desc="Paid orders, IST">
          <DailyBars series={o.revenueDaily} format={inr} color="#1f3fd6" />
        </Card>
        <Card title="Visitors per day" desc={`Unique visitors, from ${o.visitorSource}`}>
          <DailyBars series={o.visitorsDaily} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Needs attention" className="lg:col-span-1">
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/admin/payments" className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 hover:bg-zinc-100">
                <span>Abandoned checkouts with an email</span>
                <span className="font-semibold tabular-nums">{o.attention.abandoned}</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/feedback" className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 hover:bg-zinc-100">
                <span>Unread feedback</span>
                <span className="font-semibold tabular-nums">{o.attention.newFeedback}</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/requests" className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 hover:bg-zinc-100">
                <span>Answer-copy requests ({range} days)</span>
                <span className="font-semibold tabular-nums">{o.attention.copyReqs}</span>
              </Link>
            </li>
          </ul>
          <h3 className="mt-5 text-sm font-semibold text-zinc-900">Where new emails came from</h3>
          <div className="mt-2">
            <BarList rows={o.leads.bySource.filter((s) => s.value > 0)} empty="No new emails in this period." />
          </div>
        </Card>

        <Card title="Top products" desc={`Paid, last ${range} days`} className="lg:col-span-1" action={<Link href={`/admin/tracking/funnel?range=${range}`} className="text-xs font-medium text-zinc-500 hover:text-zinc-900">Funnel →</Link>}>
          <BarList rows={o.topProducts.map((p) => ({ label: p.title, value: p.revenue, hint: `${p.qty} sold` }))} format={inr} empty="No paid orders in this period." />
        </Card>

        <Card title="Abandoned checkouts" desc="Pending over an hour, with an email: worth a follow-up" className="lg:col-span-1">
          {o.abandoned.length ? (
            <ul className="divide-y divide-black/[0.05] text-sm">
              {(o.abandoned as OrderRow[]).map((a) => (
                <li key={String(a._id)} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <Link href={`/admin/tracking/journeys?q=${encodeURIComponent(a.email ?? "")}`} className="block truncate font-medium text-zinc-900 hover:underline">{a.email}</Link>
                    <span className="block truncate text-xs text-zinc-500">{a.items?.map((i) => i.title).join(", ")}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-medium tabular-nums">{inr(a.total ?? 0)}</span>
                    <span className="block text-xs text-zinc-400">{ago(a.createdAt)}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>None in this period.</Empty>
          )}
        </Card>
      </div>

      <Card title="Recent orders" className="mt-4" action={<Link href="/admin/payments" className="text-xs font-medium text-zinc-500 hover:text-zinc-900">All payments →</Link>}>
        {o.recent.length ? (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500">
                  <th className="px-2 pb-2 font-medium">When</th>
                  <th className="px-2 pb-2 font-medium">Customer</th>
                  <th className="px-2 pb-2 font-medium">Items</th>
                  <th className="px-2 pb-2 text-right font-medium">Total</th>
                  <th className="px-2 pb-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {(o.recent as OrderRow[]).map((r) => (
                  <tr key={String(r._id)}>
                    <td className="whitespace-nowrap px-2 py-2 text-zinc-500">{when(r.createdAt)}</td>
                    <td className="max-w-[220px] truncate px-2 py-2">
                      {r.email ? (
                        <Link href={`/admin/tracking/journeys?q=${encodeURIComponent(r.email)}`} className="hover:underline">{r.email}</Link>
                      ) : (
                        <span className="text-zinc-400">no email</span>
                      )}
                    </td>
                    <td className="max-w-[260px] truncate px-2 py-2 text-zinc-600">{r.items?.map((i) => i.title).join(", ")}</td>
                    <td className="px-2 py-2 text-right font-medium tabular-nums">{inr(r.total ?? 0)}</td>
                    <td className="px-2 py-2 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[r.status ?? ""] ?? "bg-zinc-100 text-zinc-600"}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No orders yet.</Empty>
        )}
      </Card>
    </div>
  );
}
