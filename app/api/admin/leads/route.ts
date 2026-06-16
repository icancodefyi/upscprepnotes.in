import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const since = new Date();
    since.setDate(since.getDate() - days);

    await connectDB();

    const [freeGuideLeads, freeDownloadLeads, dialogAudit] = await Promise.all([
      FreeGuideLeadModel.find({ createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      FreeDownloadLeadModel.find({ createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since }, event: { $in: ["dialog_open", "dialog_close", "dialog_submit", "free_download_lead", "file_download"] } } },
        { $sort: { timestamp: -1 } },
        { $group: { _id: "$sessionId", events: { $push: "$$ROOT" }, visitorId: { $first: "$visitorId" } } },
        { $sort: { _id: -1 } },
        { $limit: 50 },
        {
          $project: {
            sessionId: "$_id",
            visitorId: 1,
            events: {
              $map: {
                input: "$events",
                as: "e",
                in: {
                  event: "$$e.event",
                  pagePath: "$$e.pagePath",
                  timestamp: "$$e.timestamp",
                  metadata: "$$e.metadata",
                },
              },
            },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      leads: {
        freeGuide: freeGuideLeads.map((l: any) => ({
          name: l.name,
          email: l.email,
          createdAt: l.createdAt,
          source: "free_guide",
        })),
        freeDownload: freeDownloadLeads.map((l: any) => ({
          name: l.name,
          email: l.email,
          topperSlug: l.topperSlug,
          topperName: l.topperName,
          createdAt: l.createdAt,
          source: "free_download",
        })),
      },
      dialogAudit,
    });
  } catch (err) {
    console.error("Admin leads error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
