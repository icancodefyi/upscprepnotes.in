import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { EmailSuppressionModel } from "@/models/email-suppression.model";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { OrderModel } from "@/models/order.model";
import { sendEmail } from "@/lib/resend";
import { unsubscribeHeaders } from "@/lib/email-links";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { logCronRun } from "@/lib/cron-log";

export const maxDuration = 60;

// Emails per run. The backlog from the August outage drains at this rate, so keep it under your Resend daily limit.
const BATCH_SIZE = Number(process.env.NURTURE_BATCH) || 80;

export async function GET(req: NextRequest) {
  // Callers must send `Authorization: Bearer $CRON_SECRET` (Vercel Cron does this automatically).
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = await checkRateLimit(req, "cron");
  if (rl) return rl;

  const startedAt = Date.now();
  try {
    await connectDB();

    const total = NURTURE_EMAILS.length;
    const due = await NurtureCampaignModel.find({
      completed: false,
      step: { $lt: total },
      nextScheduledAt: { $lte: new Date() },
    })
      .sort({ nextScheduledAt: 1 })
      .limit(BATCH_SIZE)
      .lean();

    if (due.length === 0) {
      await logCronRun("nurture", startedAt, { ok: true, note: "No campaigns due" });
      return NextResponse.json({ sent: 0, message: "No campaigns due" });
    }

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const campaign of due) {
      try {
        const email = campaign.email as string;

        // Never mail people who unsubscribed or who already bought.
        const [suppressed, bought] = await Promise.all([
          EmailSuppressionModel.exists({ email }),
          OrderModel.exists({ email, status: { $in: ["paid", "delivered"] } }),
        ]);
        if (suppressed || bought) {
          await NurtureCampaignModel.updateOne({ _id: campaign._id }, { $set: { completed: true } });
          skipped++;
          continue;
        }

        // Older campaigns stored only the topper's name; recover the slug from the lead so email 1 can link back.
        let topperSlug: string = campaign.topperSlug || "";
        let topperName: string = campaign.topperName || "";
        if (!topperSlug) {
          const lead = await FreeDownloadLeadModel.findOne({ email }).sort({ createdAt: -1 }).lean();
          if (lead?.topperSlug) {
            topperSlug = lead.topperSlug;
            topperName = lead.topperName || topperName;
          } else {
            topperName = ""; // lead-form campaigns store a guide title here, not a person
          }
        }

        const template = NURTURE_EMAILS[campaign.step];
        const result = await sendEmail({
          to: email,
          subject: template.subject,
          html: template.build({ email, topperName, topperSlug }),
          replyTo: process.env.EMAIL_FROM || "hello@upscprepnotes.in",
          headers: unsubscribeHeaders(email),
        });
        // Resend reports failures in the result instead of throwing.
        if (result && "error" in result && result.error) {
          throw new Error(result.error.message || "Resend rejected the email");
        }

        const nextStep = campaign.step + 1;
        const next = NURTURE_EMAILS[nextStep];
        const nextDate = new Date(Date.now() + (next?.delayDays ?? 0) * 86400000);

        await NurtureCampaignModel.updateOne(
          { _id: campaign._id },
          {
            $set: { step: nextStep, nextScheduledAt: nextDate, completed: nextStep >= total, topperSlug },
            $push: { sentAt: new Date() },
          }
        );
        sent++;
      } catch (err: any) {
        errors.push(`${campaign.email}: ${err.message}`);
      }
    }

    await logCronRun("nurture", startedAt, { ok: errors.length === 0 || sent > 0, sent, skipped, checked: due.length, errors });
    return NextResponse.json({ sent, skipped, total_due: due.length, errors: errors.length ? errors : undefined });
  } catch (err) {
    console.error("Nurture cron error:", err);
    await logCronRun("nurture", startedAt, { ok: false, errors: [err instanceof Error ? err.message : "Cron failed"] });
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
