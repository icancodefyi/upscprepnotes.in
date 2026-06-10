// Fetch analytics from both DBs — last 3 days
import mongoose from "mongoose";

const UPSC_MONGO = "MONGODB_URI_FROM_ENV/upscprepnotes";
const AIRLIST_MONGO = "MONGODB_URI_FROM_ENV/airlist";
const SINCE = new Date(Date.now() - 3 * 86400000);

async function queryUpscprepnotes() {
  const conn = await mongoose.createConnection(UPSC_MONGO).asPromise();

  const events = conn.collection("analyticsevents");
  const leads = conn.collection("freedownloadleads");
  const copyReqs = conn.collection("copyrequests");
  const guideLeads = conn.collection("freeguideleads");
  const purchases = conn.collection("purchases");
  const customers = conn.collection("customers");

  const [eventCount, uniqueVisitors, eventBreakdown, topPages, topClicks, recentEvents] = await Promise.all([
    events.countDocuments({ timestamp: { $gte: SINCE } }),
    events.distinct("visitorId", { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } }),
    events.aggregate([
      { $match: { timestamp: { $gte: SINCE } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
    events.aggregate([
      { $match: { timestamp: { $gte: SINCE } } },
      { $group: { _id: "$pagePath", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray(),
    events.aggregate([
      { $match: { timestamp: { $gte: SINCE }, event: "click" } },
      { $group: { _id: { text: "$metadata.linkText", url: "$metadata.linkUrl", track: "$metadata.trackAttr" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray(),
    events.find({ timestamp: { $gte: SINCE } }).sort({ timestamp: -1 }).limit(30).toArray(),
  ]);

  const leadCount = await leads.countDocuments({ createdAt: { $gte: SINCE } });
  const leadAvailable = await leads.countDocuments({ createdAt: { $gte: SINCE }, available: true });
  const leadUnavailable = await leads.countDocuments({ createdAt: { $gte: SINCE }, available: false });
  const copyCount = await copyReqs.countDocuments({ createdAt: { $gte: SINCE } });
  const guideCount = await guideLeads.countDocuments({ createdAt: { $gte: SINCE } });
  const purchaseCount = await purchases.countDocuments({ createdAt: { $gte: SINCE } });
  const customerCount = await customers.countDocuments({ createdAt: { $gte: SINCE } });

  // Daily timeline
  const dailyTimeline = await events.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  await conn.close();
  return { eventCount, uniqueVisitors: uniqueVisitors.length, eventBreakdown, topPages, topClicks, recentEvents, dailyTimeline, leadCount, leadAvailable, leadUnavailable, copyCount, guideCount, purchaseCount, customerCount };
}

async function queryAirlist() {
  const conn = await mongoose.createConnection(AIRLIST_MONGO).asPromise();

  const events = conn.collection("analytics_events");
  const leads = conn.collection("free_download_leads");

  const [eventCount, uniqueVisitors, eventBreakdown, topPages, topClicks, recentEvents] = await Promise.all([
    events.countDocuments({ timestamp: { $gte: SINCE } }),
    events.distinct("visitorId", { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } }),
    events.aggregate([
      { $match: { timestamp: { $gte: SINCE } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
    events.aggregate([
      { $match: { timestamp: { $gte: SINCE } } },
      { $group: { _id: "$url", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray(),
    events.aggregate([
      { $match: { timestamp: { $gte: SINCE }, event: "click" } },
      { $group: { _id: { url: "$url" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray(),
    events.find({ timestamp: { $gte: SINCE } }).sort({ timestamp: -1 }).limit(30).toArray(),
  ]);

  const leadCount = await leads.countDocuments({ downloadedAt: { $gte: SINCE } });

  const dailyTimeline = await events.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  await conn.close();
  return { eventCount, uniqueVisitors: uniqueVisitors.length, eventBreakdown, topPages, topClicks, recentEvents, dailyTimeline, leadCount };
}

console.log("📊 Querying analytics from both DBs...\n");

const [upsc, airlist] = await Promise.all([queryUpscprepnotes(), queryAirlist()]);

console.log("=".repeat(60));
console.log("📚 UPSCPREPNOTES.IN — Last 3 Days");
console.log("=".repeat(60));
console.log(`Total events:       ${upsc.eventCount}`);
console.log(`Unique visitors:    ${upsc.uniqueVisitors}`);
console.log(`Free DL leads:      ${upsc.leadCount} (available: ${upsc.leadAvailable}, unavailable: ${upsc.leadUnavailable})`);
console.log(`Copy requests:      ${upsc.copyCount}`);
console.log(`Free guide leads:   ${upsc.guideCount}`);
console.log(`Purchase intents:   ${upsc.purchaseCount}`);
console.log(`Customers (paid):   ${upsc.customerCount}`);
console.log(`\nEvent breakdown:`);
upsc.eventBreakdown.forEach((e) => console.log(`  ${e._id}: ${e.count}`));
console.log(`\nTop pages:`);
upsc.topPages.forEach((p, i) => console.log(`  ${i+1}. ${p._id || "(root)"} — ${p.count}`));
console.log(`\nDaily timeline:`);
upsc.dailyTimeline.forEach((d) => console.log(`  ${d._id}: ${d.count} events`));
console.log(`\nTop clicks:`);
upsc.topClicks.forEach((c, i) => {
  const label = c._id.text || c._id.track || c._id.url || "click";
  console.log(`  ${i+1}. "${label}" — ${c.count}`);
});

console.log(`\n` + "=".repeat(60));
console.log("🌐 AIRLIST.IN — Last 3 Days");
console.log("=".repeat(60));
console.log(`Total events:       ${airlist.eventCount}`);
console.log(`Unique visitors:    ${airlist.uniqueVisitors}`);
console.log(`Free DL leads:      ${airlist.leadCount}`);
console.log(`\nEvent breakdown:`);
airlist.eventBreakdown.forEach((e) => console.log(`  ${e._id}: ${e.count}`));
console.log(`\nTop pages:`);
airlist.topPages.forEach((p, i) => console.log(`  ${i+1}. ${(p._id || "(root)").substring(0, 70)} — ${p.count}`));
console.log(`\nDaily timeline:`);
airlist.dailyTimeline.forEach((d) => console.log(`  ${d._id}: ${d.count} events`));
console.log(`\nTop clicks:`);
airlist.topClicks.forEach((c, i) => {
  const url = c._id.url || "";
  console.log(`  ${i+1}. ${url.substring(0, 70)} — ${c.count}`);
});

console.log(`\n` + "=".repeat(60));
console.log("Recent events (upscprepnotes):");
upsc.recentEvents.slice(0, 10).forEach((e) => {
  const pagePath = e.pagePath ? e.pagePath.substring(0, 50) : "";
  const linkText = e.metadata && e.metadata.linkText ? ` — "${e.metadata.linkText}"` : "";
  console.log(`  [${new Date(e.timestamp).toLocaleString()}] ${e.event} @ ${pagePath}${linkText}`);
});
console.log("\nRecent events (airlist):");
airlist.recentEvents.slice(0, 10).forEach((e) => {
  const url = e.url ? e.url.substring(0, 50) : "";
  console.log(`  [${new Date(e.timestamp).toLocaleString()}] ${e.event} @ ${url}`);
});

process.exit(0);
