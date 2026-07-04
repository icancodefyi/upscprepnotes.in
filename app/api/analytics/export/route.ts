import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function getDateRange(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function escapeCSV(val: unknown): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, "analytics");
  if (rl) return rl;

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const format = searchParams.get("format") || "json";

    await connectDB();

    const events = await AnalyticsEventModel.find({
      timestamp: { $gte: getDateRange(days) },
    })
      .sort({ timestamp: -1 })
      .lean();

    if (format === "csv") {
      const headers = [
        "timestamp",
        "event",
        "pagePath",
        "sessionId",
        "visitorId",
        "referrer",
        "userAgent",
        "deviceType",
        "linkText",
        "linkUrl",
        "linkType",
        "trackAttr",
        "scrollDepth",
        "timeOnPage",
        "formText",
        "isOutbound",
      ];

      const rows = events.map((e) => {
        const m = (e.metadata || {}) as Record<string, unknown>;
        return [
          e.timestamp,
          e.event,
          e.pagePath,
          e.sessionId,
          e.visitorId,
          e.referrer,
          e.userAgent,
          e.deviceType,
          m.linkText,
          m.linkUrl,
          m.linkType,
          m.trackAttr,
          m.scrollDepth || m.depth,
          m.timeOnPage,
          m.formText,
          m.isOutbound,
        ].map(escapeCSV);
      });

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="analytics-export-${days}d.csv"`,
        },
      });
    }

    return Response.json({ success: true, count: events.length, events });
  } catch (err) {
    console.error("Analytics export error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
