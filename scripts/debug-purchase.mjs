import mongoose from "mongoose";

const UPSC_MONGO = "MONGODB_URI_FROM_ENV/upscprepnotes";
const SINCE = new Date(Date.now() - 14 * 86400000);

async function main() {
  const conn = await mongoose.createConnection(UPSC_MONGO).asPromise();
  const ev = conn.collection("analyticsevents");

  // Get all purchase_modal events with full metadata
  const purchaseEvents = await ev.aggregate([
    { $match: { timestamp: { $gte: SINCE }, event: { $regex: /^purchase_/ } } },
    { $sort: { timestamp: 1 } },
  ]).toArray();

  console.log("=== ALL purchase_* events (14 days) ===");
  for (const e of purchaseEvents) {
    console.log(`\n${new Date(e.timestamp).toISOString()}`);
    console.log(`  Event: ${e.event}`);
    console.log(`  Page: ${e.pagePath}`);
    console.log(`  Session: ${e.sessionId}`);
    console.log(`  Metadata: ${JSON.stringify(e.metadata || {}, null, 2)}`);
  }

  // Get the session that had purchase_form_error
  const errorSessions = [...new Set(purchaseEvents
    .filter(e => e.event === "purchase_form_error")
    .map(e => e.sessionId))];

  for (const sid of errorSessions) {
    console.log(`\n\n=== FULL SESSION: ${sid} ===`);
    const sessionEvents = await ev.find({ sessionId: sid }).sort({ timestamp: 1 }).toArray();
    for (const e of sessionEvents) {
      console.log(`  ${new Date(e.timestamp).toISOString()} | ${e.event} | ${e.pagePath} | meta: ${JSON.stringify(e.metadata || {})}`);
    }
  }

  // Check customers collection for recent failed attempts
  const custConn = conn.collection("customers");
  const recentCustomers = await custConn.find().sort({ createdAt: -1 }).limit(10).toArray();
  console.log(`\n\n=== RECENT CUSTOMERS (last 10) ===`);
  for (const c of recentCustomers) {
    console.log(`  ${c.name} | ${c.email} | ${c.product} | ₹${c.amount} | ${c.status} | ${c.orderId || "no order"} | ${c.createdAt}`);
  }

  // Check purchases collection
  const purchConn = conn.collection("purchases");
  const recentPurchases = await purchConn.find().sort({ createdAt: -1 }).limit(10).toArray();
  console.log(`\n\n=== RECENT PURCHASES (last 10) ===`);
  for (const p of recentPurchases) {
    console.log(`  ${p.name} | ${p.email} | ${p.package} | ₹${p.amount} | ${p.status} | ${p.createdAt}`);
  }

  await conn.close();
  process.exit(0);
}

main().catch(console.error);
