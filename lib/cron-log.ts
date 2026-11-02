import { CronRunModel } from "@/models/cron-run.model";

export interface CronResult {
  ok: boolean;
  sent?: number;
  skipped?: number;
  checked?: number;
  note?: string;
  errors?: string[];
}

/** Records a run for /admin/cron. Never throws: logging must not break a job. */
export async function logCronRun(job: "nurture" | "abandoned-checkout", startedAt: number, r: CronResult) {
  try {
    await CronRunModel.create({
      job,
      startedAt: new Date(startedAt),
      durationMs: Date.now() - startedAt,
      ok: r.ok,
      sent: r.sent ?? 0,
      skipped: r.skipped ?? 0,
      checked: r.checked ?? 0,
      note: r.note ?? "",
      errors: (r.errors ?? []).slice(0, 20),
    });
  } catch (err) {
    console.error("cron log failed:", err);
  }
}
