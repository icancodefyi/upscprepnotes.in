import Link from "next/link";
import { getJourney } from "@/lib/admin/insights";
import { Card, Empty, EventChip, InsightTabs, PageHeader, ago, describeEvent, inr, when } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

type Ev = { _id: unknown; event: string; ts: Date; path?: string; props?: Record<string, unknown>; sessionId?: string; email?: string; utm?: Record<string, string>; device?: { type?: string }; country?: string; city?: string };
type Order = { _id: unknown; email?: string; items?: { title?: string }[]; total?: number; status?: string; createdAt?: Date };

export default async function JourneysPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q || "").trim();
  const j = await getJourney(q);

  return (
    <div>
      <PageHeader title="Insights" desc="Everything one person did, in order: pages, clicks, searches, AI questions, checkouts. Search by email or visitor ID." />
      <InsightTabs active="/admin/tracking/journeys" />

      <form action="/admin/tracking/journeys" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Email or visitor ID (v…)"
          className="h-11 flex-1 rounded-xl border border-black/[0.08] bg-white px-4 text-sm outline-none focus:border-zinc-900"
        />
        <button className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white">Look up</button>
        {q && <Link href="/admin/tracking/journeys" className="grid h-11 place-items-center rounded-xl border border-black/[0.08] bg-white px-4 text-sm text-zinc-600">Clear</Link>}
      </form>

      {j.mode === "list" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Recently identified visitors" desc="People who gave us an email (lead forms, checkout, Google sign-in)">
            {j.identified.length ? (
              <ul className="divide-y divide-black/[0.05] text-sm">
                {j.identified.map((p) => (
                  <li key={p._id}>
                    <Link href={`/admin/tracking/journeys?q=${encodeURIComponent(p._id)}`} className="flex items-center justify-between gap-3 py-2 hover:text-zinc-900">
                      <span className="min-w-0 truncate font-medium">{p._id}</span>
                      <span className="shrink-0 text-xs text-zinc-400">{p.source} · {ago(p.last)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No identified visitors yet. They appear after deploy, when people enter an email.</Empty>
            )}
          </Card>
          <Card title="Recent buyers" desc="Paid orders; open one to see what they did before buying">
            {j.buyers.length ? (
              <ul className="divide-y divide-black/[0.05] text-sm">
                {(j.buyers as Order[]).map((b) => (
                  <li key={String(b._id)}>
                    <Link href={`/admin/tracking/journeys?q=${encodeURIComponent(b.email ?? "")}`} className="flex items-center justify-between gap-3 py-2 hover:text-zinc-900">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{b.email}</span>
                        <span className="block truncate text-xs text-zinc-500">{b.items?.map((i) => i.title).join(", ")}</span>
                      </span>
                      <span className="shrink-0 text-right text-xs text-zinc-400">
                        <span className="block font-medium text-zinc-900">{inr(b.total ?? 0)}</span>
                        {ago(b.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No paid orders yet.</Empty>
            )}
          </Card>
        </div>
      ) : (
        <Detail j={j} />
      )}
    </div>
  );
}

function Detail({ j }: { j: Extract<Awaited<ReturnType<typeof getJourney>>, { mode: "detail" }> }) {
  const events = j.events as unknown as Ev[];
  const first = events[0];
  const sessions = new Set(events.map((e) => e.sessionId)).size;
  // Group by session so each visit reads as one block.
  const bySession: { id: string; items: Ev[] }[] = [];
  for (const e of events) {
    const last = bySession[bySession.length - 1];
    if (last && last.id === e.sessionId) last.items.push(e);
    else bySession.push({ id: e.sessionId ?? "", items: [e] });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <Card title="Who">
          <dl className="space-y-2 text-sm">
            {j.email && <Row k="Email" v={j.email} />}
            <Row k="Visitor IDs" v={j.visitorIds.length ? j.visitorIds.join(", ") : "none linked yet"} />
            <Row k="Sessions" v={String(sessions)} />
            <Row k="Events" v={String(events.length)} />
            {first && <Row k="First seen" v={when(first.ts)} />}
            {first?.utm && <Row k="First source" v={first.utm.source || first.utm.referrer || "direct"} />}
            {first?.utm?.landing && <Row k="Landed on" v={first.utm.landing} />}
            {first?.device?.type && <Row k="Device" v={first.device.type} />}
            {(first?.city || first?.country) && <Row k="Location" v={[first.city, first.country].filter(Boolean).join(", ")} />}
          </dl>
        </Card>
        {j.email && (
          <Card title="Orders">
            {(j.orders as Order[]).length ? (
              <ul className="space-y-2 text-sm">
                {(j.orders as Order[]).map((o) => (
                  <li key={String(o._id)} className="rounded-xl bg-zinc-50 px-3 py-2">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">{inr(o.total ?? 0)}</span>
                      <span className="text-xs text-zinc-500">{o.status} · {when(o.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{o.items?.map((i) => i.title).join(", ")}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No orders.</Empty>
            )}
          </Card>
        )}
        {j.email && (
          <Card title="Lead forms">
            {j.leads.length ? (
              <ul className="space-y-1.5 text-sm">
                {j.leads.map((l, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate">{l.what}</span>
                    <span className="shrink-0 text-xs text-zinc-400">{when(l.at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>None.</Empty>
            )}
          </Card>
        )}
      </div>

      <Card title="Timeline" desc="Oldest first, grouped by visit" className="lg:col-span-2">
        {events.length ? (
          <div className="space-y-5">
            {bySession.map((s, si) => (
              <div key={s.id + si}>
                <p className="mb-2 text-xs font-medium text-zinc-500">
                  Visit {si + 1} · {when(s.items[0].ts)} · {s.items.length} events
                </p>
                <ol className="space-y-1 border-l border-black/[0.08] pl-4">
                  {s.items.map((e) => (
                    <li key={String(e._id)} className="relative flex items-start gap-2 text-sm">
                      <span className="absolute -left-[21px] top-2 h-2 w-2 rounded-full bg-zinc-300" />
                      <span className="w-14 shrink-0 pt-0.5 text-xs tabular-nums text-zinc-400">
                        {new Date(e.ts).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <EventChip event={e.event} />
                      <span className="min-w-0 flex-1 break-words text-zinc-700">{describeEvent(e)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : (
          <Empty>No tracked events for this person yet. Tracking links visitors to an email only from the moment they enter it on the live site.</Empty>
        )}
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="min-w-0 break-all text-right font-medium text-zinc-900">{v}</dd>
    </div>
  );
}
