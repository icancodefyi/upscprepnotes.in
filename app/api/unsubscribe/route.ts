import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { EmailSuppressionModel } from "@/models/email-suppression.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { verifyEmailToken } from "@/lib/email-links";

async function unsubscribe(email: string, token: string) {
  const e = email.trim().toLowerCase();
  if (!e || !verifyEmailToken(e, token)) return false;
  await connectDB();
  await EmailSuppressionModel.updateOne({ email: e }, { $setOnInsert: { email: e } }, { upsert: true });
  await NurtureCampaignModel.updateMany({ email: e }, { $set: { completed: true } });
  return true;
}

// Mail clients (List-Unsubscribe-Post) and the /unsubscribe page both POST here.
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  let e = url.searchParams.get("e") || "";
  let t = url.searchParams.get("t") || "";
  if (!e) {
    const body = await req.json().catch(() => ({}));
    e = body.e || "";
    t = body.t || "";
  }
  const ok = await unsubscribe(e, t);
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
