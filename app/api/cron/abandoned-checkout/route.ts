import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { RecoveryEmailModel } from "@/models/recovery-email.model";
import { EmailSuppressionModel } from "@/models/email-suppression.model";
import { sendEmail } from "@/lib/resend";
import { unsubscribeHeaders } from "@/lib/email-links";
import { recoveryEmail1, recoveryEmail2 } from "@/lib/recovery-emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { logCronRun } from "@/lib/cron-log";

export const maxDuration = 60;

const H = 3600000;
// Stage windows are wide on purpose: they work whether this runs hourly or once a day,
// and orders older than the window (the pre-launch backlog) are never mailed.
const STAGE1 = { minAge: 1 * H, maxAge: 48 * H };
const STAGE2 = { minAge: 24 * H, maxAge: 7 * 24 * H, minGapAfterStage1: 12 * H };

/**
 * Read-only on orders: it only reads pending orders and writes to its own `recoveryemails` log.
 * Callers must send `Authorization: Bearer $CRON_SECRET` (Vercel Cron does this automatically).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = await checkRateLimit(req, "cron");
  if (rl) return rl;

  const startedAt = Date.now();
  try {
    await connectDB();
    const now = Date.now();

    const pending = await OrderModel.find({
      status: "pending",
      leftReason: { $exists: false }, // anyone who already told us why gets no more reminders
      email: { $exists: true, $ne: "" },
      createdAt: { $gte: new Date(now - STAGE2.maxAge), $lte: new Date(now - STAGE1.minAge) },
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];
    const handledEmails = new Set<string>(); // one email per person per run

    for (const order of pending) {
      try {
        const email = order.email as string;
        const orderId = String(order._id);
        const age = now - new Date(order.createdAt).getTime();
        if (handledEmails.has(email)) { skipped++; continue; }

        const [suppressed, paidSince, logs] = await Promise.all([
          EmailSuppressionModel.exists({ email }),
          // Anyone who bought afterwards (this or another order) needs no reminder.
          OrderModel.exists({ email, status: { $in: ["paid", "delivered"] }, createdAt: { $gte: order.createdAt } }),
          RecoveryEmailModel.find({ $or: [{ orderId }, { email, createdAt: { $gte: new Date(now - 12 * H) } }] }).lean(),
        ]);
        if (suppressed || paidSince) { skipped++; continue; }

        const mine = logs.filter((l: any) => l.orderId === orderId);
        const s1 = mine.find((l: any) => l.stage === 1);
        const s2 = mine.find((l: any) => l.stage === 2);
        // Someone already got a recovery email in the last 12h for another order: wait.
        if (logs.some((l: any) => l.orderId !== orderId)) { skipped++; continue; }

        let stage = 0;
        if (!s1 && age >= STAGE1.minAge && age <= STAGE1.maxAge) stage = 1;
        else if (s1 && !s2 && age >= STAGE2.minAge && now - new Date(s1.createdAt).getTime() >= STAGE2.minGapAfterStage1) stage = 2;
        if (!stage) { skipped++; continue; }

        const items = (order.items || []) as { slug: string; title: string }[];
        if (!items.length) { skipped++; continue; }
        const ctx = { orderId, email, slug: items[0].slug, titles: items.map((i) => i.title), total: order.total as number };
        const mail = stage === 1 ? recoveryEmail1(ctx) : recoveryEmail2(ctx);

        // Claim the slot first: the unique (orderId, stage) index stops a parallel run from double-sending.
        try {
          await RecoveryEmailModel.create({ orderId, email, stage });
        } catch {
          skipped++;
          continue;
        }

        const result = await sendEmail({
          to: email,
          subject: mail.subject,
          html: mail.html,
          replyTo: process.env.EMAIL_FROM || "hello@upscprepnotes.in",
          headers: unsubscribeHeaders(email),
        });
        if (result && "error" in result && result.error) {
          await RecoveryEmailModel.deleteOne({ orderId, stage });
          throw new Error(result.error.message || "Resend rejected the email");
        }
        handledEmails.add(email);
        sent++;
      } catch (err: any) {
        errors.push(`${order.email}: ${err.message}`);
      }
    }

    await logCronRun("abandoned-checkout", startedAt, { ok: errors.length === 0 || sent > 0, sent, skipped, checked: pending.length, errors });
    return NextResponse.json({ sent, skipped, checked: pending.length, errors: errors.length ? errors : undefined });
  } catch (err) {
    console.error("Abandoned-checkout cron error:", err);
    await logCronRun("abandoned-checkout", startedAt, { ok: false, errors: [err instanceof Error ? err.message : "Cron failed"] });
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
