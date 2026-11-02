import { connectDB } from "@/lib/mongodb";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { TrackingEventModel } from "@/models/tracking.model";

const DAY = 864e5;

export type PublicStats = {
  uniqueVisitors: number;
  pageViews: number;
  totalSessions: number;
  fileDownloads: number;
  returningVisitors: number;
  bounceSessions: number;
  topPages: { _id: string; count: number }[];
  dailyTimeline: { _id: string; count: number }[];
};

type Fields = { ts: string; path: string; sid: string; vid: string };

async function compute(model: typeof TrackingEventModel, f: Fields, since: Date, until: Date, downloadMatch: object): Promise<PublicStats> {
  const views = { [f.ts]: { $gte: since, $lte: until }, event: "page_view", [f.vid]: { $nin: [null, "", "unknown", "server"] } };
  const day = { $dateToString: { format: "%Y-%m-%d", date: `$${f.ts}`, timezone: "Asia/Kolkata" } };

  const [r] = await model.aggregate<{
    pv: { n: number }[];
    visitors: { total: number; returning: number }[];
    pages: { _id: string; count: number }[];
    daily: { _id: string; count: number }[];
  }>(
    [
      { $match: views },
      {
        $facet: {
          pv: [{ $count: "n" }],
          visitors: [
            { $group: { _id: `$${f.vid}`, days: { $addToSet: day } } },
            { $group: { _id: null, total: { $sum: 1 }, returning: { $sum: { $cond: [{ $gt: [{ $size: "$days" }, 1] }, 1, 0] } } } },
          ],
          pages: [{ $group: { _id: `$${f.path}`, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 7 }],
          daily: [{ $group: { _id: day, count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
        },
      },
    ],
    { allowDiskUse: true },
  );
  // A bounce is a session that only loaded a page: no click, scroll, form, search or copy.
  const interact = ["click", "scroll_depth", "form_submit", "form_start", "search", "select", "copy"];
  const [s] = await model.aggregate<{ total: number; bounce: number }>(
    [
      { $match: { [f.ts]: { $gte: since, $lte: until }, [f.sid]: { $nin: [null, "", "unknown", "server"] }, [f.vid]: { $nin: [null, "", "unknown", "server"] } } },
      { $group: { _id: `$${f.sid}`, seen: { $max: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } }, active: { $max: { $cond: [{ $in: ["$event", interact] }, 1, 0] } } } },
      { $match: { seen: 1 } },
      { $group: { _id: null, total: { $sum: 1 }, bounce: { $sum: { $cond: [{ $eq: ["$active", 0] }, 1, 0] } } } },
    ],
    { allowDiskUse: true },
  );
  const downloads = await model.countDocuments({ [f.ts]: { $gte: since, $lte: until }, ...downloadMatch });

  return {
    uniqueVisitors: r?.visitors[0]?.total ?? 0,
    pageViews: r?.pv[0]?.n ?? 0,
    totalSessions: s?.total ?? 0,
    fileDownloads: downloads,
    returningVisitors: r?.visitors[0]?.returning ?? 0,
    bounceSessions: s?.bounce ?? 0,
    topPages: r?.pages ?? [],
    dailyTimeline: r?.daily ?? [],
  };
}

/**
 * Traffic numbers for the public /advertise page. Reads the new `tracking` collection once it holds
 * 30 days of data; until then it shows the last 30 days of the old, frozen `analyticsevents` history.
 */
export async function getPublicStats(days = 30): Promise<PublicStats> {
  await connectDB();
  const now = new Date();
  const since = new Date(now.getTime() - days * DAY);

  const firstTracked = await TrackingEventModel.findOne({ event: "page_view" }).sort({ ts: 1 }).select("ts").lean<{ ts: Date }>();
  if (firstTracked && now.getTime() - firstTracked.ts.getTime() >= days * DAY) {
    return compute(TrackingEventModel, { ts: "ts", path: "path", sid: "sessionId", vid: "visitorId" }, since, now,
      { $or: [{ event: "identify" }, { event: "click", "props.download": true }] });
  }

  // Not enough new data yet: the 30 days that end at the last old event.
  const last = await AnalyticsEventModel.findOne().sort({ timestamp: -1 }).select("timestamp").lean<{ timestamp: Date }>();
  const until = last?.timestamp ?? now;
  return compute(AnalyticsEventModel as unknown as typeof TrackingEventModel,
    { ts: "timestamp", path: "pagePath", sid: "sessionId", vid: "visitorId" }, new Date(until.getTime() - days * DAY), until,
    { event: { $in: ["file_download", "free_download_lead", "free_guide_lead"] } });
}
