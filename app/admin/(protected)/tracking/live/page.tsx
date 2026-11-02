import Link from "next/link";
import { getLive } from "@/lib/admin/insights";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { Card, EventChip, InsightTabs, NoTracking, PageHeader, Stat, ago, describeEvent, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

type Ev = { _id: unknown; event: string; ts: Date; path?: string; props?: Record<string, unknown>; visitorId?: string; email?: string; device?: { type?: string }; country?: string; city?: string; source?: string };

export default async function LivePage() {
  const { events, activeLastHour } = await getLive(100);
  const list = events as unknown as Ev[];

  return (
    <div>
      <PageHeader title="Insights" desc="The latest 100 events as they arrive." extra={<AutoRefresh seconds={10} />} />
      <InsightTabs active="/admin/tracking/live" />
      {list.length === 0 ? (
        <NoTracking />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Visitors in the last hour" value={num(activeLastHour)} />
            <Stat label="Latest event" value={ago(list[0]?.ts)} />
          </div>
          <Card>
            <ul className="divide-y divide-black/[0.05]">
              {list.map((e) => (
                <li key={String(e._id)} className="flex items-start gap-3 py-2 text-sm">
                  <span className="w-16 shrink-0 pt-0.5 text-xs tabular-nums text-zinc-400">{ago(e.ts)}</span>
                  <EventChip event={e.event} />
                  <span className="min-w-0 flex-1 break-words text-zinc-700">{describeEvent(e)}</span>
                  <span className="hidden shrink-0 text-right text-xs text-zinc-400 sm:block">
                    {e.visitorId ? (
                      <Link href={`/admin/tracking/journeys?q=${encodeURIComponent(e.visitorId)}`} className="hover:text-zinc-900 hover:underline">
                        {e.visitorId.slice(0, 10)}…
                      </Link>
                    ) : (
                      e.source
                    )}
                    <span className="block">{[e.device?.type, e.city || e.country].filter(Boolean).join(" · ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
