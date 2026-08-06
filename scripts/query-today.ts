import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;
const schema = new mongoose.Schema({}, { strict: false, timestamps: true });

const CopyRequest = mongoose.model("CopyRequest", schema, "copyrequests");
const FreeDownloadLead = mongoose.model("FreeDownloadLead", schema, "freedownloadleads");

function fmtDate(d: Date): string {
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffset);
  const todayStartUTC = new Date(
    Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate()) - istOffset
  );

  console.log("Today (IST):", nowIST.toISOString().slice(0, 10));

  const requests = await CopyRequest.find({ createdAt: { $gte: todayStartUTC } })
    .sort({ createdAt: -1 })
    .lean();

  console.log(`\n=== ANSWER COPY REQUESTS — ${requests.length} today ===\n`);
  for (const r of requests as any[]) {
    console.log(`${fmtDate(r.createdAt)}  ${r.email.padEnd(32)} ${r.topperName}`);
  }

  const leads = await FreeDownloadLead.find({ createdAt: { $gte: todayStartUTC } })
    .sort({ createdAt: -1 })
    .lean();

  console.log(`\n=== FREE DOWNLOAD LEADS — ${leads.length} today ===\n`);
  for (const l of leads as any[]) {
    console.log(`${fmtDate(l.createdAt)}  ${l.email.padEnd(32)} ${l.topperName}${l.available ? "  (AVAILABLE)" : ""}`);
  }

  await mongoose.disconnect();
}
main();
