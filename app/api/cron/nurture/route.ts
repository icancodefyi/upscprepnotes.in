import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { sendEmail } from "@/lib/resend";
import fs from "fs";
import path from "path";

const EMAILS_DIR = path.join(process.cwd(), "emails");

const EMAIL_SUBJECTS = [
  "The structure that gets 140+ marks in UPSC Mains",
  "Free UPSC study material — test series, PYQs, and more",
  "50+ actual topper answer sheets — see how rank holders wrote",
  "What 280+ toppers taught us about studying smarter",
];

const EMAIL_FILES = [
  "nurture-seq-1.html",
  "nurture-seq-2.html",
  "nurture-seq-3.html",
  "nurture-seq-4.html",
];

const STEP_DELAY_DAYS = [2, 3, 2, 3];

const BATCH_SIZE = 10;

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const due = await NurtureCampaignModel.find({
      completed: false,
      step: { $lt: 4 },
      nextScheduledAt: { $lte: now },
    })
      .sort({ nextScheduledAt: 1 })
      .limit(BATCH_SIZE)
      .lean();

    if (due.length === 0) {
      return NextResponse.json({ sent: 0, message: "No campaigns due" });
    }

    let sent = 0;
    const errors: string[] = [];

    for (const campaign of due) {
      try {
        const filePath = path.join(EMAILS_DIR, EMAIL_FILES[campaign.step]);
        const html = fs.readFileSync(filePath, "utf8");

        await sendEmail({
          to: campaign.email,
          subject: EMAIL_SUBJECTS[campaign.step],
          html,
        });

        const nextStep = campaign.step + 1;
        const delayDays = STEP_DELAY_DAYS[campaign.step] || 3;

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + delayDays);

        await NurtureCampaignModel.updateOne(
          { _id: campaign._id },
          {
            $set: {
              step: nextStep,
              nextScheduledAt: nextDate,
              completed: nextStep >= 4,
            },
            $push: { sentAt: new Date() },
          }
        );

        sent++;
      } catch (err: any) {
        errors.push(`${campaign.email}: ${err.message}`);
      }
    }

    return NextResponse.json({
      sent,
      total_due: due.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Nurture cron error:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
