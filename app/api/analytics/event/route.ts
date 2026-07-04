import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(req, "analytics");
  if (rl) return rl;

  try {
    const body = await req.json();
    const { event, pagePath, sessionId, visitorId: clientVisitorId, referrer, userAgent, deviceType, metadata } = body;

    if (!event || !pagePath || !sessionId) {
      return NextResponse.json(
        { success: false, error: "event, pagePath, and sessionId are required" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const visitorId = clientVisitorId || `${today}:${sessionId}`;

    await connectDB();
    await AnalyticsEventModel.create({
      event,
      pagePath,
      sessionId,
      visitorId,
      referrer: referrer || "",
      userAgent: userAgent || "",
      deviceType: deviceType || "desktop",
      metadata: metadata || {},
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Analytics event error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
