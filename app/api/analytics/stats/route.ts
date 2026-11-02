import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { AskConversationModel } from "@/models/ask.model";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function getDateRange(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, "analytics");
  if (rl) return rl;

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
        { $match: { timestamp: { $gte: since }, event: "page_view" } },
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
      // Hourly activity (IST)
      AnalyticsEventModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: { $hour: { date: "$timestamp", timezone: "Asia/Kolkata" } }, count: { $sum: 1 } } },
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
    const [todayEvents, todaySessions, todayPageViews] = await Promise.all([
      AnalyticsEventModel.countDocuments({ timestamp: { $gte: todayStart } }),
      AnalyticsEventModel.distinct("sessionId", { timestamp: { $gte: todayStart } }).then(r => r.length),
      AnalyticsEventModel.countDocuments({ event: "page_view", timestamp: { $gte: todayStart } }),
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

    // User journeys: last 20 unique visitors with all their events (cross-session).
    // Pick the visitors first, then load only their events: grouping every event of every visitor
    // ($push "$$ROOT") blows MongoDB's 100 MB $group limit once traffic grows.
    const validVisitor = { timestamp: { $gte: since }, visitorId: { $exists: true, $ne: "unknown" } };
    const recentVisitors: { _id: string; firstEvent: Date; lastEvent: Date; eventCount: number; sessions: string[] }[] =
      await AnalyticsEventModel.aggregate([
        { $match: validVisitor },
        { $group: {
          _id: "$visitorId",
          firstEvent: { $min: "$timestamp" },
          lastEvent: { $max: "$timestamp" },
          eventCount: { $sum: 1 },
          sessions: { $addToSet: "$sessionId" },
        }},
        { $sort: { lastEvent: -1 } },
        { $limit: 20 },
      ]);
    const journeyEvents = (await AnalyticsEventModel.find({
      ...validVisitor,
      visitorId: { $in: recentVisitors.map((v) => v._id) },
    })
      .select("visitorId event pagePath timestamp sessionId metadata deviceType userAgent")
      .sort({ timestamp: 1 })
      .lean()) as unknown as { visitorId: string; event: string; pagePath: string; timestamp: Date; sessionId: string; metadata: unknown; deviceType?: string; userAgent?: string }[];
    const userJourneys = recentVisitors.map((v) => {
      const events = journeyEvents.filter((e) => e.visitorId === v._id);
      return {
        _id: v._id,
        visitorId: v._id,
        eventCount: v.eventCount,
        firstEvent: v.firstEvent,
        lastEvent: v.lastEvent,
        sessionCount: v.sessions.length,
        deviceType: events[0]?.deviceType,
        userAgent: events[0]?.userAgent,
        events: events.map((e) => ({ event: e.event, pagePath: e.pagePath, timestamp: e.timestamp, sessionId: e.sessionId, metadata: e.metadata })),
      };
    });

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
    const [checkoutCompletions, checkoutStarts, fileDownloads, salesPageViews, convertingUsers, bounceSessions] =
      await Promise.all([
        AnalyticsEventModel.countDocuments({ event: "checkout_completed", timestamp: { $gte: since } }),
        AnalyticsEventModel.countDocuments({ event: "checkout_started", timestamp: { $gte: since } }),
        AnalyticsEventModel.countDocuments({ event: "file_download", timestamp: { $gte: since } }),
        AnalyticsEventModel.countDocuments({ event: "page_view", pagePath: "/toppers/toppers-copy-compilation", timestamp: { $gte: since } }),
        // Converting visitors: filter to the converting events first, then count distinct visitors.
        AnalyticsEventModel.aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              visitorId: { $exists: true, $ne: "unknown" },
              $or: [
                { event: { $in: ["checkout_completed", "checkout_started", "file_download", "form_submit", "dialog_submit", "free_guide_lead"] } },
                { event: "click", "metadata.trackAttr": { $regex: "bundle|download|purchase", $options: "i" } },
              ],
            },
          },
          { $group: { _id: "$visitorId" } },
          { $count: "count" },
        ]).then((r) => (r[0]?.count || 0)),
        // Bounce sessions (single page_view excluding exit events)
        AnalyticsEventModel.aggregate([
          { $match: { timestamp: { $gte: since } } },
          { $group: { _id: "$sessionId", events: { $push: "$event" } } },
          {
            $addFields: {
              cleanEvents: {
                $filter: { input: "$events", as: "e", cond: { $ne: ["$$e", "page_exit"] } }
              }
            }
          },
          {
            $addFields: {
              onlyPageView: { $eq: [{ $size: "$cleanEvents" }, 1] },
              firstEvent: { $arrayElemAt: ["$cleanEvents", 0] }
            }
          },
          { $match: { onlyPageView: true, firstEvent: "page_view" } },
          { $count: "count" },
        ]).then(r => r[0]?.count || 0),
      ]);

    // Conversion funnel (unique visitors per stage)
    const funnelStages = await Promise.all([
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "page_view", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "dialog_open", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "free_guide_lead", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "free_download_lead", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "checkout_started", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
      AnalyticsEventModel.distinct("visitorId", { timestamp: { $gte: since }, event: "checkout_completed", visitorId: { $exists: true, $ne: "unknown" } }).then(r => r.length),
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
        todayPageViews,
        checkoutCompletions,
        checkoutStarts,
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
