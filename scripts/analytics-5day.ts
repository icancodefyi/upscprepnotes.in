import mongoose from "mongoose";

const UPSC_MONGO = "MONGODB_URI_FROM_ENV/upscprepnotes";
const AIRLIST_MONGO = "MONGODB_URI_FROM_ENV/airlist";
const SINCE = new Date(Date.now() - 5 * 86400000);

async function getData() {
  const conn = await mongoose.createConnection(UPSC_MONGO).asPromise();
  const ev = conn.collection("analyticsevents");
  const leads = conn.collection("freedownloadleads");
  const purchases = conn.collection("purchases");
  const customers = conn.collection("customers");
  const ask = conn.collection("askconversations");

  const [daily, funnel, topPages, devices, visitorsByDay, hourly, exits, referrers, returningData, scrollDepths, dialogData, totalVisitors, totalSessions, totalEvents, leadCount, purchaseCount, customerCount, askCount, bounceSessions, allClicks, dialogSubmitCount, formSubmitCount] = await Promise.all([
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, total: { $sum: 1 }, pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } } } }, { $sort: { _id: 1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: "$event", count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, event: "page_view" } }, { $group: { _id: "$pagePath", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 20 }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: "$deviceType", count: { $sum: 1 } } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, visitors: { $addToSet: "$visitorId" }, sessions: { $addToSet: "$sessionId" } } }, { $sort: { _id: 1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: { $hour: "$timestamp" }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, event: "page_exit" } }, { $group: { _id: "$pagePath", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, referrer: { $ne: "" } } }, { $group: { _id: "$referrer", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } } }, { $group: { _id: "$visitorId", sessions: { $addToSet: "$sessionId" } } }, { $project: { visitorId: "$_id", sessionCount: { $size: "$sessions" } } }, { $sort: { sessionCount: -1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, event: "scroll_depth" } }, { $group: { _id: "$metadata.depth", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, event: { $in: ["dialog_open", "dialog_close", "dialog_submit"] } } }, { $group: { _id: { event: "$event", dialog: "$metadata.dialog" }, count: { $sum: 1 } } }]).toArray(),
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } }).then(r => r.length),
    ev.distinct("sessionId", { timestamp: { $gte: SINCE } }).then(r => r.length),
    ev.countDocuments({ timestamp: { $gte: SINCE } }),
    leads.countDocuments({ createdAt: { $gte: SINCE } }),
    purchases.countDocuments({ createdAt: { $gte: SINCE } }),
    customers.countDocuments({ createdAt: { $gte: SINCE } }),
    ask.countDocuments({ createdAt: { $gte: SINCE } }),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: "$sessionId", events: { $push: "$event" } } }, { $addFields: { onlyPageView: { $eq: [{ $size: "$events" }, 1] }, firstEvent: { $arrayElemAt: ["$events", 0] } } }, { $match: { onlyPageView: true, firstEvent: "page_view" } }, { $count: "count" }]).then(r => r[0]?.count || 0),
    ev.countDocuments({ timestamp: { $gte: SINCE }, event: "click" }),
    ev.countDocuments({ timestamp: { $gte: SINCE }, event: "dialog_submit" }),
    ev.countDocuments({ timestamp: { $gte: SINCE }, event: "form_submit" }),
  ]);

  // Conversion funnel
  const [allVis, openedDialog, freeDlLead, fileDownloaded, whatsappClicked] = await Promise.all([
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, event: "page_view", visitorId: { $ne: "unknown" } }),
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, event: "dialog_open", visitorId: { $ne: "unknown" } }),
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, event: "free_download_lead", visitorId: { $ne: "unknown" } }),
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, event: "file_download", visitorId: { $ne: "unknown" } }),
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, event: "whatsapp_click", visitorId: { $ne: "unknown" } }),
  ]);

  await conn.close();
  return { daily, funnel, topPages, devices, visitorsByDay, hourly, exits, referrers, returningData, scrollDepths, dialogData, totalEvents, totalVisitors, totalSessions, leadCount, purchaseCount, customerCount, askCount, bounceSessions, allClicks, dialogSubmitCount, formSubmitCount, conversionFunnel: [allVis.length, openedDialog.length, freeDlLead.length, fileDownloaded.length, whatsappClicked.length] };
}

async function getAirlistData() {
  const conn = await mongoose.createConnection(AIRLIST_MONGO).asPromise();
  const ev = conn.collection("analytics_events");
  const leads = conn.collection("free_download_leads");

  const [daily, funnel, topPages, devices, totalEvents, totalVisitors, leadCount] = await Promise.all([
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, total: { $sum: 1 }, pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } } } }, { $sort: { _id: 1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: "$event", count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE }, event: "page_view" } }, { $group: { _id: "$url", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }]).toArray(),
    ev.aggregate([{ $match: { timestamp: { $gte: SINCE } } }, { $group: { _id: "$device", count: { $sum: 1 } } }]).toArray(),
    ev.countDocuments({ timestamp: { $gte: SINCE } }),
    ev.distinct("visitorId", { timestamp: { $gte: SINCE }, visitorId: { $ne: "unknown" } }).then(r => r.length),
    leads.countDocuments({ downloadedAt: { $gte: SINCE } }),
  ]);

  await conn.close();
  return { daily, funnel, topPages, devices, totalEvents, totalVisitors, leadCount };
}

console.log("📊 Analyzing data from last 5 days...\n");
const [upsc, airlist] = await Promise.all([getData(), getAirlistData()]);

console.log("=".repeat(70));
console.log("📚 UPSCPREPNOTES.IN — 5-Day Analysis (June 10–15)");
console.log("=".repeat(70));

console.log(`\n📈 DAILY TREND:`);
upsc.daily.forEach((d: any) => console.log(`  ${d._id}: ${d.total} events (${d.pageViews} page views)`));

console.log(`\n📊 OVERVIEW:`);
console.log(`  Total Events:       ${upsc.totalEvents}`);
console.log(`  Total Visitors:     ${upsc.totalVisitors}`);
console.log(`  Total Sessions:     ${upsc.totalSessions}`);
console.log(`  Bounce Rate:        ${upsc.totalSessions > 0 ? ((upsc.bounceSessions / upsc.totalSessions) * 100).toFixed(1) : 0}% (${upsc.bounceSessions} of ${upsc.totalSessions} sessions)`);
console.log(`  Avg Events/Session: ${upsc.totalSessions > 0 ? (upsc.totalEvents / upsc.totalSessions).toFixed(1) : 0}`);
console.log(`  Returning Visitors: ${upsc.returningData.filter((v: any) => v.sessionCount > 1).length} of ${upsc.totalVisitors} (${upsc.totalVisitors > 0 ? ((upsc.returningData.filter((v: any) => v.sessionCount > 1).length / upsc.totalVisitors) * 100).toFixed(1) : 0}%)`);
console.log(`  Free DL Leads:      ${upsc.leadCount}`);
console.log(`  Purchase Intents:   ${upsc.purchaseCount}`);
console.log(`  Paid Customers:     ${upsc.customerCount}`);
console.log(`  AI Conversations:   ${upsc.askCount}`);

console.log(`\n🎯 EVENT FUNNEL:`);
upsc.funnel.forEach((e: any) => console.log(`  ${e._id}: ${e.count}`));

console.log(`\n📄 TOP PAGES (by page_view):`);
upsc.topPages.forEach((p: any, i: number) => console.log(`  ${i+1}. ${p._id} — ${p.count} views`));

console.log(`\n💻 DEVICE BREAKDOWN:`);
upsc.devices.forEach((d: any) => console.log(`  ${d._id || "unknown"}: ${d.count} events`));

console.log(`\n🕐 HOURLY ACTIVITY:`);
const hourStrs = upsc.hourly.map((h: any) => `${String(h._id).padStart(2, '0')}:00`).join(', ');
console.log(`  Hours: ${hourStrs}`);
console.log(`  Events: ${upsc.hourly.map((h: any) => h.count).join(', ')}`);

console.log(`\n🔄 CONVERSION FUNNEL (Unique Visitors):`);
const funnelLabels = ["All Visitors", "Opened Dialog", "Free DL Lead", "File Downloaded", "WhatsApp Click"];
upsc.conversionFunnel.forEach((v: number, i: number) => {
  const pct = upsc.conversionFunnel[0] > 0 ? ((v / upsc.conversionFunnel[0]) * 100).toFixed(1) : 0;
  console.log(`  ${funnelLabels[i]}: ${v} (${pct}%)`);
});

console.log(`\n🚪 TOP EXIT PAGES:`);
upsc.exits.forEach((e: any) => console.log(`  ${e._id} — ${e.count}`));

console.log(`\n🔗 REFERRERS:`);
upsc.referrers.forEach((r: any) => console.log(`  ${r._id === "(direct)" ? "(direct)" : r._id} — ${r.count}`));

console.log(`\n📏 SCROLL DEPTH DISTRIBUTION:`);
upsc.scrollDepths.forEach((s: any) => console.log(`  ${s._id}: ${s.count} events`));

// Dialog summary
const dialogSummary: Record<string, any> = {};
upsc.dialogData.forEach((d: any) => {
  const name = d._id.dialog || "unknown";
  if (!dialogSummary[name]) dialogSummary[name] = { open: 0, close: 0, submit: 0 };
  dialogSummary[name][d._id.event === "dialog_open" ? "open" : d._id.event === "dialog_close" ? "close" : "submit"] += d.count;
});

console.log(`\n📋 DIALOG INTERACTIONS:`);
Object.entries(dialogSummary).forEach(([name, data]: [string, any]) => {
  console.log(`  ${name}: ${data.open} opened, ${data.close} closed, ${data.submit} submitted`);
});

console.log(`\n` + "=".repeat(70));
console.log("🌐 AIRLIST.IN — 5-Day Analysis (June 10–15)");
console.log("=".repeat(70));

console.log(`\n📈 DAILY TREND:`);
airlist.daily.forEach((d: any) => console.log(`  ${d._id}: ${d.total} events (${d.pageViews} page views)`));

console.log(`\n📊 OVERVIEW:`);
console.log(`  Total Events:   ${airlist.totalEvents}`);
console.log(`  Total Visitors: ${airlist.totalVisitors}`);
console.log(`  Free DL Leads:  ${airlist.leadCount}`);

console.log(`\n🎯 EVENT FUNNEL:`);
airlist.funnel.forEach((e: any) => console.log(`  ${e._id}: ${e.count}`));

console.log(`\n📄 TOP PAGES:`);
airlist.topPages.forEach((p: any, i: number) => console.log(`  ${i+1}. ${String(p._id).substring(0, 80)} — ${p.count}`));

console.log(`\n💻 DEVICE BREAKDOWN:`);
airlist.devices.forEach((d: any) => console.log(`  ${d._id || "unknown"}: ${d.count}`));

console.log(`\n` + "=".repeat(70));
console.log("💡 KEY INSIGHTS");
console.log("=".repeat(70));

console.log(`\nUPSCPREPNOTES:`);
const funnelPct = upsc.conversionFunnel[4] / upsc.conversionFunnel[0] * 100;
console.log(`  1. Conversion Rate: ${funnelPct.toFixed(2) || 0}% from visitor → WhatsApp click`);
const fileDlCount = (upsc.funnel as any[]).find((e: any) => e._id === "file_download")?.count || 0;
console.log(`  2. Lead-to-Download: ${upsc.leadCount > 0 ? ((fileDlCount / upsc.leadCount) * 100).toFixed(0) : 0}% of leads actually download`);
console.log(`  3. Bounce Rate: ${((upsc.bounceSessions / upsc.totalSessions) * 100).toFixed(1)}%`);
console.log(`  4. Top page "${(upsc.topPages[0] as any)?._id || "N/A"}" gets ${((upsc.topPages[0] as any)?.count / upsc.totalEvents * 100).toFixed(0)}% of all traffic`);
const returningPct = upsc.totalVisitors > 0 ? (upsc.returningData.filter((v: any) => v.sessionCount > 1).length / upsc.totalVisitors * 100).toFixed(1) : 0;
console.log(`  5. Returning Visitors: ${returningPct}%`);
const peakHour = (upsc.hourly as any[]).reduce((max: any, h: any) => h.count > max.count ? h : max, upsc.hourly[0] || { _id: 0, count: 0 });
console.log(`  6. Peak Hour: ${peakHour._id}:00 (${peakHour.count} events)`);
const waCount = (upsc.funnel as any[]).find((e: any) => e._id === "whatsapp_click")?.count || 0;
console.log(`  7. WhatsApp Clicks: ${waCount} total`);
console.log(`  8. 0 purchases → 0 revenue from 5 days of traffic`);

const salesPageViews = (upsc.topPages as any[]).find((p: any) => p._id === "/toppers/toppers-copy-compilation")?.count || 0;
console.log(`  9. Sales page views: ${salesPageViews}`);

console.log(`\nAIRLIST:`);
console.log(`  1. Traffic level: ${airlist.totalVisitors} unique visitors in 5 days`);
const alPv = (airlist.funnel as any[]).find((e: any) => e._id === "page_view")?.count || 0;
console.log(`  2. Page views: ${alPv}`);
console.log(`  3. Free DL leads: ${airlist.leadCount}`);
console.log(`  4. Top content: ${String((airlist.topPages[0] as any)?._id || "N/A").substring(0, 60)}`);

console.log(`\n` + "=".repeat(70));
console.log("🔥 CRITICAL ISSUES");
console.log("=".repeat(70));
console.log(`  🚨 ZERO purchases on upscprepnotes despite ${upsc.totalVisitors} visitors and ${upsc.leadCount} leads`);
console.log(`  🚨 Only ${waCount} WhatsApp clicks — conversion path is broken`);
console.log(`  🚨 ${upsc.leadCount} leads but only ${fileDlCount} file downloads — lead quality / delivery issue?`);
console.log(`  🚨 Sales page only ${salesPageViews} views — no traffic going to purchase page`);

process.exit(0);
