import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/resend";
import getResend from "@/lib/resend";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { CustomerModel } from "@/models/customer.model";
import { OrderModel } from "@/models/order.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_BATCH = 100;

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "broadcast");
  if (rl) return rl;

  try {
    const body = await request.json();
    const { subject, html, testEmail, limit = MAX_BATCH, offset = 0 } = body;

    if (!subject || !html) {
      return Response.json({ error: "Subject and HTML content are required" }, { status: 400 });
    }

    if (testEmail) {
      await sendEmail({ to: testEmail, subject, html });
      return Response.json({ sent: 1, mode: "test", testEmail });
    }

    await connectDB();

    const [freeDownloads, freeGuides, freeMaterials, copyRequests, customers, orders, subscribers, nurtureCampaigns] = await Promise.all([
      FreeDownloadLeadModel.distinct("email"),
      FreeGuideLeadModel.distinct("email"),
      FreeMaterialLeadModel.distinct("email"),
      CopyRequestModel.distinct("email"),
      CustomerModel.distinct("email"),
      OrderModel.distinct("email"),
      SubscriberEmailModel.distinct("email"),
      NurtureCampaignModel.distinct("email"),
    ]);

    const all = new Set<string>();
    for (const arr of [freeDownloads, freeGuides, freeMaterials, copyRequests, customers, orders, subscribers, nurtureCampaigns]) {
      for (const email of arr) {
        if (email && email !== "unknown@checkout") all.add(email.toLowerCase());
      }
    }

    const emails = Array.from(all).sort();
    const start = Math.min(Math.max(0, Number(offset) || 0), emails.length);
    const size = Math.min(Math.max(1, Number(limit) || MAX_BATCH), MAX_BATCH);
    const batch = emails.slice(start, start + size);

    if (batch.length === 0) {
      return Response.json({ sent: 0, total: emails.length, batch: 0, offset: start, nextOffset: start });
    }

    const resend = getResend();
    const from = `${process.env.EMAIL_FROM_NAME || "UPSCPrepNotes"} <${process.env.EMAIL_FROM || "hello@upscprepnotes.in"}>`;

    const { data, error } = (await resend.batch.send(
      batch.map((to) => ({ from, to, subject, html })),
    )) as { data: Array<{ id: string }> | null; error: { message: string } | null };

    if (error) throw error;

    return Response.json({
      sent: data?.length ?? 0,
      total: emails.length,
      batch: batch.length,
      offset: start,
      nextOffset: start + batch.length,
    });
  } catch (err) {
    console.error("Broadcast API error:", err);
    return Response.json({ error: "Broadcast failed" }, { status: 500 });
  }
}
