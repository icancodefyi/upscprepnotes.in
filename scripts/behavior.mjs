// Run: node -r dotenv/config scripts/behavior.mjs dotenv_config_path=.env.local
import mongoose from "mongoose";

const UPSC_MONGO = process.env.MONGODB_URI;
const airlistUri = UPSC_MONGO?.replace("/upscprepnotes?", "/airlist?")?.replace("/upscprepnotes", "/airlist");
const AIRLIST_MONGO = process.env.AIRLIST_MONGO_URI || airlistUri || "";

if (!UPSC_MONGO || !AIRLIST_MONGO) {
  console.error("MONGODB_URI / AIRLIST_MONGO_URI not set. Run with: node -r dotenv/config scripts/behavior.mjs dotenv_config_path=.env.local");
  process.exit(1);
}

const SINCE = new Date(Date.now() - 14 * 86400000);

// === UPSCPREPNOTES: session journeys ===
async function upscSessions() {
  const conn = await mongoose.createConnection(UPSC_MONGO).asPromise();
  const ev = conn.collection("analyticsevents");

  // Full sessions with all ordered events
  const sessions = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, sessionId: { $ne: null } } },
    { $sort: { timestamp: 1 } },
    { $group: { _id: "$sessionId", events: { $push: { e: "$event", p: "$pagePath", m: "$metadata", t: "$timestamp" } } } },
    { $addFields: { eventCount: { $size: "$events" } } },
    { $match: { eventCount: { $gte: 3 } } },
    { $sort: { eventCount: -1 } },
    { $limit: 30 },
  ]).toArray();

  console.log("\n=== UPSCPREPNOTES: Top 30 Sessions (≥3 events) ===");
  for (const s of sessions) {
    const pages = [...new Set(s.events.map(e => e.p))];
    const events = s.events.map(e => `${e.e}${e.m?.linkText ? `(${e.m.linkText})` : ""}@${(e.p||"").substring(0,50)}`).join(" → ");
    console.log(`\nSession ${s._id.substring(0,12)} (${s.eventCount} events, ${pages.length} pages):`);
    console.log(`  ${events}`);
    if (s.events.some(e => e.e === "purchase_modal_open")) {
      console.log(`  💳 PURCHASE ATTEMPT`);
      const wa = s.events.filter(e => e.e === "whatsapp_click");
      if (wa.length) console.log(`  📞 WHATSAPP CLICKED (${wa.length}x)`);
    }
  }

  // Bundle page entry paths — where do users come from before landing on bundle page?
  const bundleEntries = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, sessionId: { $ne: null } } },
    { $sort: { timestamp: 1 } },
    { $group: { _id: "$sessionId", events: { $push: { e: "$event", p: "$pagePath", t: "$timestamp" } } } },
    { $match: { "events.p": { $in: ["/toppers/toppers-copy-compilation", "/upsc-topper/toppers-copy-compilation"] } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  const paths = [];
  for (const s of bundleEntries) {
    for (let i = 0; i < s.events.length; i++) {
      if (["/toppers/toppers-copy-compilation", "/upsc-topper/toppers-copy-compilation"].includes(s.events[i].p)) {
        const prev = i > 0 ? s.events[i-1].p : "(direct)";
        const next = i < s.events.length - 1 ? s.events[i+1].p : "(exit)";
        paths.push({ prev, next });
      }
    }
  }

  console.log(`\n\n=== BUNDLE PAGE ENTRY/EXIT PATHS (${paths.length} visits) ===`);
  const entryCounts = {};
  const exitCounts = {};
  paths.forEach(p => {
    entryCounts[p.prev] = (entryCounts[p.prev] || 0) + 1;
    exitCounts[p.next] = (exitCounts[p.next] || 0) + 1;
  });
  console.log("Where users come FROM:");
  Object.entries(entryCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k} — ${v} visits`));
  console.log("Where users go NEXT:");
  Object.entries(exitCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k} — ${v} visits`));

  // Bundle page scroll depth distribution
  const scrollDepths = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, pagePath: "/toppers/toppers-copy-compilation", event: "scroll_depth" } },
    { $group: { _id: "$metadata.depth", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();
  
  console.log(`\nScroll depth on bundle page (/toppers/toppers-copy-compilation):`);
  scrollDepths.forEach(s => console.log(`  ${s._id}% — ${s.count} events`));

  await conn.close();
}

// === AIRLIST: session journeys ===
async function airlistSessions() {
  const conn = await mongoose.createConnection(AIRLIST_MONGO).asPromise();
  const ev = conn.collection("analytics_events");

  const sessions = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, sessionId: { $ne: null } } },
    { $sort: { timestamp: 1 } },
    { $group: { _id: "$sessionId", events: { $push: { e: "$event", p: "$url", m: "$metadata", t: "$timestamp" } } } },
    { $addFields: { eventCount: { $size: "$events" } } },
    { $match: { eventCount: { $gte: 3 } } },
    { $sort: { eventCount: -1 } },
    { $limit: 20 },
  ]).toArray();

  console.log("\n\n=== AIRLIST: Top 20 Sessions (≥3 events) ===");
  for (const s of sessions) {
    const pages = [...new Set(s.events.map(e => e.p))];
    const events = s.events.map(e => {
      const p = e.p ? e.p.substring(0, 55) : "(no page)";
      return `${e.e}@${p}`;
    }).join(" → ");
    console.log(`\nSession ${s._id.substring(0,12)} (${s.eventCount} events, ${pages.length} pages):`);
    console.log(`  ${events}`);
    if (s.events.some(e => e.e === "topper-request-copy")) {
      console.log(`  📋 REQUESTED COPY`);
    }
    if (s.events.some(e => e.e === "topper-free-download")) {
      console.log(`  ⬇️  FREE DOWNLOAD`);
    }
  }

  await conn.close();
}

await Promise.all([upscSessions(), airlistSessions()]);
process.exit(0);
