// Deep analytics + conversion audit — last 14 days
import mongoose from "mongoose";

const UPSC_MONGO = "MONGODB_URI_FROM_ENV/upscprepnotes";
const AIRLIST_MONGO = "MONGODB_URI_FROM_ENV/airlist";
const SINCE = new Date(Date.now() - 14 * 86400000);

console.log("📊 Deep Analytics — Last 14 Days\n");

// ===== UPSCPREPNOTES =====
async function upscDeep() {
  const conn = await mongoose.createConnection(UPSC_MONGO).asPromise();
  const ev = conn.collection("analyticsevents");
  const leads = conn.collection("freedownloadleads");
  const purchases = conn.collection("purchases");
  const customers = conn.collection("customers");
  const copyReqs = conn.collection("copyrequests");

  // Daily timeline
  const daily = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, total: { $sum: 1 }, pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  // Event funnel
  const funnel = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Top pages by page_view
  const topPages = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "page_view" } },
    { $group: { _id: "$pagePath", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 30 },
  ]).toArray();

  // Pages where people clicked "Download Free Answer Copy"
  const downloadClicks = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "click", "metadata.linkText": "Download Free Answer Copy" } },
    { $group: { _id: "$pagePath", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Download Now clicks
  const downloadNow = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "click", "metadata.linkText": "Download Now" } },
    { $group: { _id: "$pagePath", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // WhatsApp clicks
  const waClicks = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "whatsapp_click" } },
    { $group: { _id: { page: "$pagePath", text: "$metadata.linkText" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Bundle page behavior
  const bundle = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, pagePath: { $in: ["/toppers/toppers-copy-compilation", "/upsc-topper/toppers-copy-compilation"] } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Scroll depth on bundle page
  const bundleScroll = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, pagePath: "/toppers/toppers-copy-compilation", event: "scroll_depth" } },
    { $group: { _id: "$metadata.depth", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  // File downloads by topper
  const dlByTopper = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "file_download" } },
    { $group: { _id: "$metadata.topperSlug", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Free download leads by topper
  const leadsByTopper = await leads.aggregate([
    { $match: { createdAt: { $gte: SINCE } } },
    { $group: { _id: "$topperSlug", count: { $sum: 1 }, available: { $sum: { $cond: ["$available", 1, 0] } } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Copy requests by topper
  const copyByTopper = await copyReqs.aggregate([
    { $match: { createdAt: { $gte: SINCE } } },
    { $group: { _id: "$topperSlug", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  // Purchases + customers
  const purchaseCount = await purchases.countDocuments({ createdAt: { $gte: SINCE } });
  const purchaseStatuses = await purchases.aggregate([
    { $match: { createdAt: { $gte: SINCE } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]).toArray();
  const customerCount = await customers.countDocuments({ createdAt: { $gte: SINCE } });

  // Session journeys to understand flow
  const sessions = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: { $in: ["page_view", "click", "free_download_lead", "whatsapp_click", "form_submit"] } } },
    { $sort: { timestamp: 1 } },
    { $group: { _id: "$sessionId", events: { $push: { event: "$event", page: "$pagePath", text: "$metadata.linkText", ts: "$timestamp" } }, pages: { $addToSet: "$pagePath" } } },
    { $addFields: { eventCount: { $size: "$events" }, uniquePages: { $size: "$pages" }, hasWhatsAppClick: { $in: ["whatsapp_click", "$events.event"] }, hasFreeDownload: { $in: ["free_download_lead", "$events.event"] } } },
    { $match: { eventCount: { $gte: 2 } } },
    { $sort: { eventCount: -1 } },
    { $limit: 50 },
  ]).toArray();

  // Conversion: how many who clicked free download also clicked WhatsApp or bought
  const convertingUsers = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: { $in: ["free_download_lead", "whatsapp_click", "file_download"] } } },
    { $group: { _id: "$sessionId", events: { $push: "$event" } } },
    { $addFields: { hasDownload: { $in: ["free_download_lead", "$events"] }, hasWA: { $in: ["whatsapp_click", "$events"] }, hasFileDL: { $in: ["file_download", "$events"] } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  // Visitors per day
  const visitorsByDay = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, visitors: { $addToSet: "$visitorId" } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  // Exit pages (last event in session)
  const exits = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "page_exit" } },
    { $group: { _id: "$pagePath", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 15 },
  ]).toArray();

  await conn.close();
  return { daily, funnel, topPages, downloadClicks, downloadNow, waClicks, bundle, bundleScroll, dlByTopper, leadsByTopper, copyByTopper, purchaseCount, purchaseStatuses, customerCount, sessions, convertingUsers, visitorsByDay, exits };
}

// ===== AIRLIST =====
async function airlistDeep() {
  const conn = await mongoose.createConnection(AIRLIST_MONGO).asPromise();
  const ev = conn.collection("analytics_events");
  const leads = conn.collection("free_download_leads");

  const daily = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, total: { $sum: 1 }, pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  const funnel = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  const topPages = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "page_view" } },
    { $group: { _id: "$url", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 30 },
  ]).toArray();

  const downloadClicks = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "topper-free-download" } },
    { $group: { _id: "$url", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  const requestClicks = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "topper-request-copy" } },
    { $group: { _id: "$url", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  const bundleClicks = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "topper-bundle-upsell" } },
    { $group: { _id: "$url", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();

  const topTopperPages = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: "page_view", url: { $regex: "/upsc/toppers/" } } },
    { $group: { _id: "$url", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]).toArray();

  // Sessions with request -> download flow
  const sessions = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE } } },
    { $sort: { timestamp: 1 } },
    { $group: { _id: "$sessionId", events: { $push: { event: "$event", page: "$url", ts: "$timestamp" } }, pages: { $addToSet: "$url" } } },
    { $addFields: { eventCount: { $size: "$events" } } },
    { $match: { eventCount: { $gte: 3 } } },
    { $sort: { eventCount: -1 } },
    { $limit: 30 },
  ]).toArray();

  const leadCount = await leads.countDocuments({ downloadedAt: { $gte: SINCE } });

  await conn.close();
  return { daily, funnel, topPages, downloadClicks, requestClicks, bundleClicks, topTopperPages, sessions, leadCount };
}

const [u, a] = await Promise.all([upscDeep(), airlistDeep()]);

console.log("=".repeat(70));
console.log("📚 UPSCPREPNOTES.IN — Deep Analysis (14 days)");
console.log("=".repeat(70));

console.log(`\n📈 Daily Trend:`);
u.daily.forEach(d => console.log(`  ${d._id}: ${d.total} events (${d.pageViews} page views)`));

console.log(`\n🎯 Event Funnel:`);
u.funnel.forEach(e => console.log(`  ${e._id}: ${e.count}`));

console.log(`\n📄 Top Pages by page_view:`);
u.topPages.forEach((p, i) => console.log(`  ${i+1}. ${p._id} — ${p.count}`));

console.log(`\n📥 "Download Free Answer Copy" clicks by page:`);
u.downloadClicks.forEach(d => console.log(`  ${d._id} — ${d.count}`));

console.log(`\n📥 "Download Now" clicks:`);
u.downloadNow.forEach(d => console.log(`  ${d._id} — ${d.count}`));

console.log(`\n📞 WhatsApp clicks:`);
if (u.waClicks.length) u.waClicks.forEach(w => console.log(`  ${w._id.page} | "${w._id.text}" — ${w.count}`));
else console.log(`  NONE`);

console.log(`\n📦 Bundle page (/toppers/toppers-copy-compilation) events:`);
u.bundle.forEach(b => console.log(`  ${b._id}: ${b.count}`));

console.log(`\n⬇️  Free download leads by topper:`);
u.leadsByTopper.forEach(l => console.log(`  ${l._id}: ${l.count} total (${l.available} available)`));

console.log(`\n📋 Copy requests by topper:`);
u.copyByTopper.forEach(c => console.log(`  ${c._id}: ${c.count}`));

console.log(`\n📁 File downloads by topper:`);
u.dlByTopper.forEach(d => console.log(`  ${d._id}: ${d.count}`));

console.log(`\n💳 Purchases: ${u.purchaseCount} total`);
if (u.purchaseStatuses.length) u.purchaseStatuses.forEach(s => console.log(`  ${s._id}: ${s.count}`));

console.log(`\n👥 Customers (paid): ${u.customerCount}`);

console.log(`\n🚪 Top exit pages:`);
u.exits.forEach(e => console.log(`  ${e._id} — ${e.count}`));

console.log(`\n🔄 Conversion flow (${u.convertingUsers.length} sessions with download/WA/file events):`);
const hasDownload = u.convertingUsers.filter(s => s.hasDownload).length;
const hasWA = u.convertingUsers.filter(s => s.hasWA).length;
const hasFileDL = u.convertingUsers.filter(s => s.hasFileDL).length;
const hasDLandWA = u.convertingUsers.filter(s => s.hasDownload && s.hasWA).length;
console.log(`  Free download lead: ${hasDownload} sessions`);
console.log(`  WhatsApp click: ${hasWA} sessions`);
console.log(`  File download: ${hasFileDL} sessions`);
console.log(`  Free DL → WhatsApp: ${hasDLandWA} sessions`);

console.log(`\n` + "=".repeat(70));
console.log("🌐 AIRLIST.IN — Deep Analysis (14 days)");
console.log("=".repeat(70));

console.log(`\n📈 Daily Trend:`);
a.daily.forEach(d => console.log(`  ${d._id}: ${d.total} events (${d.pageViews} page views)`));

console.log(`\n🎯 Event Funnel:`);
a.funnel.forEach(e => console.log(`  ${e._id}: ${e.count}`));

console.log(`\n📄 Top pages by page_view:`);
a.topPages.forEach((p, i) => console.log(`  ${i+1}. ${p._id.substring(0, 80)} — ${p.count}`));

console.log(`\n📥 "Free Download" clicks:`);
a.downloadClicks.forEach(d => console.log(`  ${d._id.substring(0, 80)} — ${d.count}`));

console.log(`\n📋 "Request Copy" clicks:`);
a.requestClicks.forEach(r => console.log(`  ${r._id.substring(0, 80)} — ${r.count}`));

console.log(`\n📦 "Bundle Upsell" clicks:`);
a.bundleClicks.forEach(b => console.log(`  ${b._id.substring(0, 80)} — ${b.count}`));

console.log(`\n🏆 Top topper pages by visits:`);
a.topTopperPages.forEach((p, i) => {
  const name = p._id.split("/").pop() || p._id;
  console.log(`  ${i+1}. ${name.substring(0, 35)} — ${p.count}`);
});

console.log(`\n⬇️  Free download leads: ${a.leadCount}`);

console.log(`\n💾 Free DL available toppers (checking which toppers have freeAnswerCopyUrl set):`);
const conn = await mongoose.createConnection(AIRLIST_MONGO).asPromise();
const toppers = conn.collection("toppers");
const seeded = await toppers.find({ freeAnswerCopyUrl: { $exists: true, $ne: "" } }).project({ firstname: 1, lastname: 1, slug: 1, freeAnswerCopyUrl: 1 }).toArray();
console.log(`  ${seeded.length} toppers have freeAnswerCopyUrl:`);
seeded.forEach(t => console.log(`  • ${t.firstname} ${t.lastname} — ${t.slug} — ${(t.freeAnswerCopyUrl || "").substring(0, 50)}...`));
await conn.close();

console.log(`\n` + "=".repeat(70));
console.log("💡 INSIGHTS & RECOMMENDATIONS");
console.log("=".repeat(70));

process.exit(0);
