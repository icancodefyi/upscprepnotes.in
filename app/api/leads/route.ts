import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { CustomerModel } from "@/models/customer.model";
import { OrderModel } from "@/models/order.model";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, "leads");
  if (rl) return rl;
  try {
    await connectDB();

    const [freeDownloads, freeGuides, copyRequests, customers, orders] = await Promise.all([
      FreeDownloadLeadModel.distinct("email"),
      FreeGuideLeadModel.distinct("email"),
      CopyRequestModel.distinct("email"),
      CustomerModel.distinct("email"),
      OrderModel.distinct("email"),
    ]);

    const all = new Set<string>();
    for (const arr of [freeDownloads, freeGuides, copyRequests, customers, orders]) {
      for (const email of arr) {
        if (email && email !== "unknown@checkout") all.add(email.toLowerCase());
      }
    }

    const emails = Array.from(all).sort();

    return Response.json({ total: emails.length, emails });
  } catch (err) {
    console.error("Leads API error:", err);
    return Response.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
