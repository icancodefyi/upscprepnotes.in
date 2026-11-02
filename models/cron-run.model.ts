import { model, models, Schema } from "mongoose";

/** One row per scheduled job run, shown at /admin/cron. Rows expire after 90 days. */
const cronRunSchema = new Schema(
  {
    job: { type: String, required: true, enum: ["nurture", "abandoned-checkout"] },
    startedAt: { type: Date, required: true },
    durationMs: { type: Number, default: 0 },
    ok: { type: Boolean, required: true },
    sent: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    checked: { type: Number, default: 0 },
    note: { type: String, default: "" },
    errors: [{ type: String }],
  },
  { versionKey: false }
);

cronRunSchema.index({ job: 1, startedAt: -1 });
cronRunSchema.index({ startedAt: 1 }, { expireAfterSeconds: 90 * 24 * 3600 });

export const CronRunModel = models.CronRun || model("CronRun", cronRunSchema);
