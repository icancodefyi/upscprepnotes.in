import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { AskConversationModel } from "@/models/ask.model";

export const dynamic = "force-dynamic";

function getDateRange(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const since = getDateRange(days);

    await connectDB();

    const [
      totalEvents,
      totalSessions,
      eventsByType,
      dailyTimeline,
      topPages,
      topClicks,
      recentEvents,
      sessionJourneys,
      deviceBreakdown,
      hourlyActivity,
      referrers,
      scrollDepths,
      topExits,
      dialogData,
    ] = await Promise.all([
      AnalyticsEventModel.countDocuments({ timestamp: { $gte: since } }),
      AnalyticsEventModel.distinct("sessionId", { timestamp: { $gte: since } }).then(
        (sessions) => sessions.length
      ),
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$pagePath", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: { event: "click", timestamp: { $gte: since } } },
        {
          $group: {
            _id: {
              text: "$metadata.linkText",
              url: "$metadata.linkUrl",
              trackAttr: "$metadata.trackAttr",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 30 },
      ]),
      AnalyticsEventModel.find({ timestamp: { $gte: since } })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean(),
      // Session journeys: last 20 sessions with full event sequence
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $sort: { timestamp: 1 } },
        { $group: { _id: "$sessionId", events: { $push: "$$ROOT" }, firstEvent: { $first: "$$ROOT.timestamp" }, lastEvent: { $last: "$$ROOT.timestamp" }, eventCount: { $sum: 1 } } },
        { $sort: { firstEvent: -1 } },
        { $limit: 20 },
        {
          $project: {
            sessionId: "$_id",
            eventCount: 1,
            firstEvent: 1,
            lastEvent: 1,
            deviceType: { $arrayElemAt: ["$events.deviceType", 0] },
            userAgent: { $arrayElemAt: ["$events.userAgent", 0] },
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
      // Device breakdown
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } },
      ]),
      // Hourly activity
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: { $hour: "$timestamp" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Referrers
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since }, referrer: { $ne: "" } } },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Scroll depth distribution
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since }, event: "scroll_depth" } },
        { $group: { _id: "$metadata.depth", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Top exit pages
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since }, event: "page_exit" } },
        { $group: { _id: "$pagePath", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      // Dialog interactions
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since }, event: { $in: ["dialog_open", "dialog_close", "dialog_submit"] } } },
        { $group: { _id: { event: "$event", dialog: "$metadata.dialog" }, count: { $sum: 1 } } },
      ]),
    ]);

    // today stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [todayEvents, todaySessions] = await Promise.all([
      AnalyticsEventModel.countDocuments({ timestamp: { $gte: todayStart } }),
      AnalyticsEventModel.distinct("sessionId", { timestamp: { $gte: todayStart } }).then(r => r.length),
    ]);

    // unique visitors
    const uniqueVisitors = (
      await AnalyticsEventModel.distinct("visitorId", {
        timestamp: { $gte: since },
        visitorId: { $exists: true, $ne: "unknown" },
      })
    ).length;

    // page views count
    const [pageViews, returningVisitors] = await Promise.all([
      AnalyticsEventModel.countDocuments({ event: "page_view", timestamp: { $gte: since } }),
      // Returning visitors count
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since }, visitorId: { $exists: true, $ne: "unknown" } } },
        { $group: { _id: "$visitorId", sessions: { $addToSet: "$sessionId" } } },
        { $project: { visitorId: "$_id", sessionCount: { $size: "$sessions" } } },
        { $match: { sessionCount: { $gt: 1 } } },
        { $count: "count" },
      ]).then(r => r[0]?.count || 0),
    ]);

    // User journeys: last 20 unique visitors with all their events (cross-session)
    const userJourneys = await AnalyticsEventModel.aggregate([
      { $match: { timestamp: { $gte: since }, visitorId: { $exists: true, $ne: "unknown" } } },
      { $sort: { timestamp: 1 } },
      { $group: {
        _id: "$visitorId",
        events: { $push: "$$ROOT" },
        firstEvent: { $first: "$$ROOT.timestamp" },
        lastEvent: { $last: "$$ROOT.timestamp" },
        eventCount: { $sum: 1 },
        sessions: { $addToSet: "$sessionId" },
      }},
      { $sort: { lastEvent: -1 } },
      { $limit: 20 },
      {
        $project: {
          visitorId: "$_id",
          eventCount: 1,
          firstEvent: 1,
          lastEvent: 1,
          sessionCount: { $size: "$sessions" },
          deviceType: { $arrayElemAt: ["$events.deviceType", 0] },
          userAgent: { $arrayElemAt: ["$events.userAgent", 0] },
          events: {
            $map: {
              input: "$events",
              as: "e",
              in: {
                event: "$$e.event",
                pagePath: "$$e.pagePath",
                timestamp: "$$e.timestamp",
                sessionId: "$$e.sessionId",
                metadata: "$$e.metadata",
              },
            },
          },
        },
      },
    ]);

    // AI conversation counts
    const [aiConversations, aiMessagesAgg] = await Promise.all([
      AskConversationModel.countDocuments({ createdAt: { $gte: since } }),
      AskConversationModel.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $project: { msgCount: { $size: "$messages" } } },
        { $group: { _id: null, total: { $sum: "$msgCount" } } },
      ]),
    ]);
    const aiMessages = aiMessagesAgg[0]?.total || 0;

    // key metrics + bounce rate
    const [whatsappClicks, fileDownloads, salesPageViews, convertingUsers, bounceSessions] =
      await Promise.all([
        AnalyticsEventModel.countDocuments({ event: "whatsapp_click", timestamp: { $gte: since } }),
        AnalyticsEventModel.countDocuments({ event: "file_download", timestamp: { $gte: since } }),
        AnalyticsEventModel.countDocuments({ event: "page_view", pagePath: "/toppers/toppers-copy-compilation", timestamp: { $gte: since } }),
        AnalyticsEventModel.aggregate([
          { $match: { timestamp: { $gte: since }, visitorId: { $exists: true, $ne: "unknown" } } },
          { $group: { _id: "$visitorId", events: { $push: "$$ROOT" } } },
          {
            $match: {
              $or: [
                { "events.event": "whatsapp_click" },
                { "events.event": "file_download" },
                { "events.event": "form_submit" },
                { "events.event": "dialog_submit" },
                {
                  events: {
                    $elemMatch: { event: "click", $or: [
                      { "metadata.trackAttr": { $regex: "bundle", $options: "i" } },
                      { "metadata.trackAttr": { $regex: "download", $options: "i" } },
                      { "metadata.trackAttr": { $regex: "purchase", $options: "i" } },
                    ]},
                  },
                },
              ],
            },
          },
          { $count: "count" },
        ]).then((r) => (r[0]?.count || 0)),
        // Bounce sessions (single page_view session)
        AnalyticsEventModel.aggregate([
          { $match: { timestamp: { $gte: since } } },
          { $group: { _id: "$sessionId", events: { $push: "$event" } } },
          { $addFields: { onlyPageView: { $eq: [{ $size: "$events" }, 1] }, firstEvent: { $arrayElemAt: ["$events", 0] } } },
          { $match: { onlyPageView: true, firstEvent: "page_view" } },
          { $count: "count" },
        ]).then(r => r[0]?.count || 0),
      ]);

    // Conversion funnel (unique visitors per stage)
    const funnelStages = await Promise.all([
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "page_view", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "dialog_open", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "free_download_lead", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "file_download", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "whatsapp_click", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        totalSessions,
        uniqueVisitors,
        pageViews,
        todayEvents,
        todaySessions,
        whatsappClicks,
        fileDownloads,
        salesPageViews,
        conversions: convertingUsers,
        aiConversations,
        aiMessages,
        eventsByType,
        dailyTimeline,
        topPages,
        topClicks,
        recentEvents,
        sessionJourneys,
        userJourneys,
        deviceBreakdown,
        hourlyActivity,
        referrers,
        scrollDepths,
        topExits,
        dialogData,
        funnelStages,
        returningVisitors,
        bounceSessions,
      },
    });
  } catch (err) {
    console.error("Analytics stats error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
