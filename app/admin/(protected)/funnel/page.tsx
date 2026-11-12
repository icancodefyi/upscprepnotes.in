import { connectDB } from "@/lib/mongodb";
import { TrackingEventModel } from "@/models/tracking.model";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";

export const dynamic = "force-dynamic";

const DAYS = 14;
const IST = "Asia/Kolkata";

type Day = { views: number; starts: number; leads: number; full: number };

/** Midnight IST, N days ago. */
function istStart(daysAgo: number): Date {
  const now = new Date(Date.now() + 330 * 60_000);
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo);
  return new Date(midnight - 330 * 60_000);
}

export default async function FunnelPage() {
  await connectDB();
  const since = istStart(DAYS - 1);
  const fmt = (field: string) => ({ $dateToString: { format: "%Y-%m-%d", date: field, timezone: IST } });

  const [views, starts, copyLeads, materialLeads] = await Promise.all([
    TrackingEventModel.aggregate([
      { $match: { ts: { $gte: since }, event: "page_view", path: { $regex: "^/(free/|free-materials/)" } } },
      { $group: { _id: { day: fmt("$ts"), v: "$visitorId" } } },
      { $group: { _id: "$_id.day", n: { $sum: 1 } } },
    ]),
    TrackingEventModel.aggregate([
      { $match: { ts: { $gte: since }, event: "form_start", path: { $regex: "^/(free/|free-materials/)" } } },
      { $group: { _id: { day: fmt("$ts"), v: "$visitorId" } } },
      { $group: { _id: "$_id.day", n: { $sum: 1 } } },
    ]),
    FreeDownloadLeadModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: fmt("$createdAt"), leads: { $sum: 1 }, full: { $sum: { $cond: [{ $ifNull: ["$profile.stage", false] }, 1, 0] } } } },
    ]),
    FreeMaterialLeadModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: fmt("$createdAt"), leads: { $sum: 1 }, full: { $sum: { $cond: [{ $ifNull: ["$profile.stage", false] }, 1, 0] } } } },
    ]),
  ]);

  const days: Record<string, Day> = {};
  for (let i = DAYS - 1; i >= 0; i--) {
    const key = new Date(istStart(i).getTime() + 330 * 60_000).toISOString().slice(0, 10);
    days[key] = { views: 0, starts: 0, leads: 0, full: 0 };
  }
  for (const r of views) if (days[r._id]) days[r._id].views = r.n;
  for (const r of starts) if (days[r._id]) days[r._id].starts = r.n;
  for (const r of [...copyLeads, ...materialLeads]) {
    if (!days[r._id]) continue;
    days[r._id].leads += r.leads;
    days[r._id].full += r.full;
  }

  const rows = Object.entries(days).reverse();
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "-");
  const card = "rounded-[24px] border border-black/[0.06] bg-white p-6";
  const th = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500";
  const td = "px-3 py-2.5 tabular-nums";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Request forms</h1>
        <p className="mt-1 text-sm text-zinc-500">Free copies and free materials, last {DAYS} days, IST. Counted from our own tracker and database.</p>
      </div>

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-black/[0.06]">
              <th className={th}>Day</th>
              <th className={th}>Visitors on request pages</th>
              <th className={th}>Started a form</th>
              <th className={th}>Start rate</th>
              <th className={th}>Leads saved</th>
              <th className={th}>With full answers</th>
              <th className={th}>Email only</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([day, d]) => (
              <tr key={day} className="border-b border-black/[0.04] last:border-0">
                <td className={`${td} font-medium`}>{day}</td>
                <td className={td}>{d.views}</td>
                <td className={td}>{d.starts}</td>
                <td className={td}>{pct(d.starts, d.views)}</td>
                <td className={td}>{d.leads}</td>
                <td className={td}>{d.full}</td>
                <td className={td}>{d.leads - d.full}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`${card} text-sm text-zinc-600`}>
        <p className="font-semibold text-zinc-900">How to read this</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Start rate</strong> is the share of visitors who began a form. This is where most people leave.</li>
          <li><strong>Leads saved</strong> counts one record per person per item. A new email counts as soon as it is entered.</li>
          <li><strong>With full answers</strong> are the qualified leads. <strong>Email only</strong> are people who left before finishing, or who used the older email-only form (before 11 Nov).</li>
          <li>When you change a form, compare the same number of days before and after.</li>
        </ul>
      </div>
    </div>
  );
}
