import { getBuyers } from "@/lib/admin/insights";
import { BarList, Card, InsightTabs, PageHeader, Stat, inr, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function BuyersPage() {
  const b = await getBuyers();
  const t = b.tracked;

  return (
    <div>
      <PageHeader title="Insights" desc="Who pays, how long it takes, and what they did first. All-time, paid orders only." />
      <InsightTabs active="/admin/tracking/buyers" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Buyers" value={num(b.buyers)} sub={`${num(b.orders)} paid orders`} />
        <Stat label="Revenue" value={inr(b.revenue)} sub={`${inr(b.avgPerBuyer)} per buyer`} />
        <Stat label="Bought again" value={`${b.repeatRate}%`} sub={`${num(b.repeatBuyers)} repeat buyers`} />
        <Stat label="Left an email first" value={`${b.wasLeadRate}%`} sub="of buyers were leads before" />
        <Stat label="Lead → first order" value={b.wasLead ? `${Math.round(b.leadToBuyMedianDays * 10) / 10} days` : "—"} sub="median time" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="What buyers did before paying" desc="From tracking: the visitor behind each tracked purchase">
          {t.count === 0 ? (
            <p className="rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
              Needs tracking data. Once the live site records a purchase, this shows how many visits it took, how many days from first visit to payment, and which pages the buyer read first.
            </p>
          ) : (
            <>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-zinc-50 p-3"><dt className="text-zinc-500">Visits before buying</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{t.medianVisits}</dd></div>
                <div className="rounded-xl bg-zinc-50 p-3"><dt className="text-zinc-500">Days to decide</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{Math.round(t.medianDays * 10) / 10}</dd></div>
                <div className="rounded-xl bg-zinc-50 p-3"><dt className="text-zinc-500">Asked the AI first</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{t.askedAI}%</dd></div>
                <div className="rounded-xl bg-zinc-50 p-3"><dt className="text-zinc-500">Left an email first</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{t.gotLead}%</dd></div>
              </dl>
              <p className="mt-2 text-xs text-zinc-400">Based on {t.count} tracked purchases (medians). {t.searched}% searched the site first.</p>
            </>
          )}
        </Card>
        <Card title="Pages buyers read first" desc="Pages seen before the purchase, most common first">
          <BarList rows={t.pages} empty="Needs tracking data." />
        </Card>
        <Card title="Where buyers first came from">
          <BarList rows={t.sources} empty="Needs tracking data." />
        </Card>
        <Card title="Bought together" desc="Products that share one order">
          <BarList rows={b.pairs} empty="No multi-product orders yet." />
        </Card>
      </div>

      <Card title="When people pay" desc="Paid orders by hour of day, IST" className="mt-4">
        <BarList rows={b.byHour.filter((h) => h.value > 0)} empty="No paid orders yet." max={24} />
      </Card>
    </div>
  );
}
