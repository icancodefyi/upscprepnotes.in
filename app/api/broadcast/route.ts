import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/resend";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { CustomerModel } from "@/models/customer.model";
import { OrderModel } from "@/models/order.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "broadcast");
  if (rl) return rl;

  try {
    const body = await request.json();
    const { subject, html, testEmail } = body;

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

    const emails = Array.from(all);
    let sent = 0;
    const errors: string[] = [];

    for (const email of emails) {
      try {
        await sendEmail({ to: email, subject, html });
        sent++;
      } catch (err: any) {
        errors.push(`${email}: ${err.message}`);
      }
    }

    return Response.json({ sent, total: emails.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err) {
    console.error("Broadcast API error:", err);
    return Response.json({ error: "Broadcast failed" }, { status: 500 });
  }
}
