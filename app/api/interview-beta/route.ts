import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeBeta } from "@/lib/interview-beta";
import { InterviewBetaModel } from "@/models/interview-beta.model";
import { trackServer } from "@/lib/tracking/server";

/** Saves a mock interview beta signup. A repeat from the same email updates the one record. */
export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, "leads");
  if (limited) return limited;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const a = sanitizeBeta(body);
  if (!a) return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  const source = typeof body.source === "string" ? body.source.slice(0, 60) : undefined;
  const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 80) : undefined;

  await connectDB();
  const { email, ...rest } = a;
  await InterviewBetaModel.updateOne(
    { email },
    { $set: { ...rest, ...(source ? { source } : {}), ...(visitorId ? { visitorId } : {}) }, $inc: { submissions: 1 }, $setOnInsert: { email } },
    { upsert: true },
  );
  await trackServer("interview_beta_signup", { email, visitorId, path: "/interview-practice", props: { stage: a.stage, features: a.features.length, pay: a.pay, source } });
  return NextResponse.json({ ok: true });
}
