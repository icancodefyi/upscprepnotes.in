import { connectDB } from "@/lib/mongodb";
import { CronRunModel } from "@/models/cron-run.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { EmailSuppressionModel } from "@/models/email-suppression.model";
import { RecoveryEmailModel } from "@/models/recovery-email.model";
import { OrderModel } from "@/models/order.model";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";

export const dynamic = "force-dynamic";

const JOBS = [
  { key: "nurture", name: "Nurture emails", schedule: "Daily at 10:00 IST", graceHours: 26, what: "Sends the next email in the 5-email series to people who downloaded a free copy." },
  { key: "abandoned-checkout", name: "Abandoned checkout", schedule: "Every hour", graceHours: 2.5, what: "Emails people who opened checkout but did not pay, at about 1 hour and 24 hours." },
] as const;

const IST = "Asia/Kolkata";
const when = (d: Date | string) =>
  new Date(d).toLocaleString("en-IN", { timeZone: IST, day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });

function ago(d: Date | string) {
  const m = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

type Run = { _id: string; job: string; startedAt: Date; durationMs: number; ok: boolean; sent: number; skipped: number; checked: number; note: string; errors: string[] };

function health(last: Run | undefined, graceHours: number) {
  if (!last) return { label: "Not run yet", cls: "bg-amber-50 text-amber-700" };
  if (!last.ok) return { label: "Last run failed", cls: "bg-red-50 text-red-700" };
  if (Date.now() - new Date(last.startedAt).getTime() > graceHours * 3600000) return { label: "Overdue", cls: "bg-red-50 text-red-700" };
  return { label: "Healthy", cls: "bg-blue-50 text-[#172fa3]" };
}

function summary(r: Run) {
  if (r.note) return r.note;
  const parts = [`${r.sent} sent`];
  if (r.skipped) parts.push(`${r.skipped} skipped`);
  if (r.checked) parts.push(`${r.checked} checked`);
  return parts.join(", ");
}

export default async function CronPage() {
  await connectDB();
  const now = Date.now();
  const [runs, byStep, dueNow, suppressed, recovery7d, eligibleOrders] = await Promise.all([
    CronRunModel.find().sort({ startedAt: -1 }).limit(60).lean() as unknown as Promise<Run[]>,
    NurtureCampaignModel.aggregate([{ $group: { _id: { step: "$step", completed: "$completed" }, n: { $sum: 1 } } }]),
    NurtureCampaignModel.countDocuments({ completed: false, nextScheduledAt: { $lte: new Date() } }),
    EmailSuppressionModel.countDocuments(),
    RecoveryEmailModel.aggregate([{ $match: { createdAt: { $gte: new Date(now - 7 * 864e5) } } }, { $group: { _id: "$stage", n: { $sum: 1 } } }]),
    OrderModel.countDocuments({ status: "pending", email: { $nin: [null, ""] }, createdAt: { $gte: new Date(now - 7 * 864e5) } }),
  ]);

  const total = NURTURE_EMAILS.length;
  const stepCount = (step: number) => byStep.filter((b: any) => b._id.step === step && !b._id.completed).reduce((a: number, b: any) => a + b.n, 0);
  const finished = byStep.filter((b: any) => b._id.completed).reduce((a: number, b: any) => a + b.n, 0);
  const stage = (s: number) => recovery7d.find((r: any) => r._id === s)?.n ?? 0;
  const card = "rounded-[24px] border border-black/[0.06] bg-white p-6";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Cron jobs</h1>
        <p className="mt-1 text-sm text-zinc-500">Scheduled jobs run from the VPS and call the site. Every run is recorded here for 90 days. Times are IST.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {JOBS.map((j) => {
          const jobRuns = runs.filter((r) => r.job === j.key);
          const last = jobRuns[0];
          const h = health(last, j.graceHours);
          return (
            <div key={j.key} className={card}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{j.name}</h2>
                  <p className="text-sm text-zinc-500">{j.schedule}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${h.cls}`}>{h.label}</span>
              </div>
              <p className="mt-3 text-sm text-zinc-600">{j.what}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Last run</dt><dd className="text-right font-medium">{last ? `${when(last.startedAt)} (${ago(last.startedAt)})` : "Never"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Result</dt><dd className="text-right font-medium">{last ? summary(last) : "-"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Duration</dt><dd className="text-right font-medium">{last ? `${(last.durationMs / 1000).toFixed(1)} s` : "-"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Emails sent, last 10 runs</dt><dd className="text-right font-medium">{jobRuns.slice(0, 10).reduce((a, r) => a + r.sent, 0)}</dd></div>
              </dl>
              {last && last.errors?.length > 0 && (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                  <p className="font-semibold">Errors in the last run</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4">{last.errors.slice(0, 5).map((e, i) => <li key={i} className="break-words">{e}</li>)}</ul>
                </div>
              )}
              {!last && <p className="mt-4 text-xs text-zinc-500">If the VPS cron is enabled, the first run appears here within the hour (nurture: at 10:00 IST).</p>}
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className={card}>
          <h2 className="text-lg font-semibold">Nurture pipeline</h2>
          <p className="mt-1 text-sm text-zinc-500">{dueNow.toLocaleString("en-IN")} due now · {suppressed.toLocaleString("en-IN")} unsubscribed</p>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {NURTURE_EMAILS.map((e, i) => (
                <tr key={i} className="border-t border-black/[0.06]">
                  <td className="py-2 pr-3 text-zinc-500">Waiting for email {i + 1}</td>
                  <td className="py-2 pr-3 text-zinc-700">{e.subject}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">{stepCount(i).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              <tr className="border-t border-black/[0.06]">
                <td className="py-2 pr-3 text-zinc-500" colSpan={2}>Finished all {total} (or bought, or unsubscribed)</td>
                <td className="py-2 text-right font-semibold tabular-nums">{finished.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={card}>
          <h2 className="text-lg font-semibold">Abandoned checkout, last 7 days</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-500">Pending orders with an email</dt><dd className="font-semibold tabular-nums">{eligibleOrders}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Reminder 1 sent (about 1 hour)</dt><dd className="font-semibold tabular-nums">{stage(1)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">Reminder 2 sent (about 24 hours)</dt><dd className="font-semibold tabular-nums">{stage(2)}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-zinc-500">Buyers and unsubscribed addresses are skipped automatically.</p>
        </div>
      </div>

      <div className={card}>
        <h2 className="text-lg font-semibold">Recent runs</h2>
        {runs.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No runs recorded yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-zinc-500">
                  <th className="py-2 pr-4 font-medium">When</th>
                  <th className="py-2 pr-4 font-medium">Job</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Result</th>
                  <th className="py-2 font-medium">Errors</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={String(r._id)} className="border-b border-black/[0.04] align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">{when(r.startedAt)}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{JOBS.find((j) => j.key === r.job)?.name ?? r.job}</td>
                    <td className="py-2 pr-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.ok ? "bg-blue-50 text-[#172fa3]" : "bg-red-50 text-red-700"}`}>{r.ok ? "OK" : "Failed"}</span></td>
                    <td className="py-2 pr-4">{summary(r)}</td>
                    <td className="py-2 text-xs text-red-700">{r.errors?.length ? r.errors.slice(0, 2).join("; ") : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
