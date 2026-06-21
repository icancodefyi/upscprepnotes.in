require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { Resend } = require("resend");
const fs = require("fs");
const path = require("path");

const FROM_EMAIL = process.env.EMAIL_FROM || "hello@upscprepnotes.in";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "UPSCPrepNotes";
const resend = new Resend(process.env.RESEND_API_KEY);

// 9 apology recipients to exclude
const EXCLUDE = new Set([
  "patnaikharsh39@gmail.com",
  "taniamalik453@gmail.com",
]);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI + "upscprepnotes");
  const db = mongoose.connection.db;

  const collections = ["freedownloadleads", "freeguideleads", "copyrequests", "customers", "orders"];
  const all = new Set();

  for (const coll of collections) {
    const emails = await db.collection(coll).distinct("email");
    for (const e of emails) {
      if (e && e !== "unknown@checkout") all.add(e.toLowerCase());
    }
  }

  // Also find apology recipients from the FreeDownloadLead collection
  // that have _id after the target and have PDF URLs (these got apologies)
  const fdl = db.collection("freedownloadleads");
  const targetLead = await fdl.findOne({ email: "srinidhinimmakuri@gmail.com" });
  if (targetLead) {
    const after = await fdl.find({
      _id: { $gt: targetLead._id },
      email: { $ne: "impic.tech@gmail.com" },
    }).sort({ createdAt: 1 }).toArray();

    const seen = new Set();
    for (const l of after) {
      const key = l.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      // Check if this lead had PDF URLs (would have gotten apology)
      const topper = await db.collection("toppers").findOne({ slug: l.topperSlug });
      if (topper?.freeAnswerCopyUrls?.length) {
        EXCLUDE.add(key);
      }
    }
  }

  const emails = Array.from(all).filter(e => !EXCLUDE.has(e) && e !== "impic.tech@gmail.com" && e !== "rakhangezaid10@gmail.com");

  console.log(`Total unique leads: ${all.size}`);
  console.log(`Excluding: ${EXCLUDE.size} apology recipients`);
  console.log(`Sending to: ${emails.length} leads\n`);

  const html = fs.readFileSync(path.join(__dirname, "..", "emails", "flash-sale.html"), "utf-8");
  const subject = "🔥 Flash Sale: All Products at ₹99 — 48 Hours Only";

  let sent = 0;
  for (const email of emails) {
    try {
      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject,
        html,
      });
      if (result.error) {
        console.log(`  ✗ ${email}: ${result.error.message}`);
      } else {
        console.log(`  ✓ ${email}`);
        sent++;
      }
    } catch (err) {
      console.log(`  ✗ ${email}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\nSent: ${sent}/${emails.length}`);
  await mongoose.disconnect();
}

main().catch(console.error);
