require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { Resend } = require("resend");

const COUPON_CODE = process.env.COUPON_CODE || "SORRY100";
const FROM_EMAIL = process.env.EMAIL_FROM || "hello@upscprepnotes.in";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "UPSCPrepNotes";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildApologyHtml(topperName, pdfUrls, coupon) {
  const downloadLinks = pdfUrls.map((url, i) =>
    `<a href="${url}" style="color:#059669;font-weight:600;font-size:14px;display:block;padding:4px 0">📄 Copy ${i + 1} →</a>`
  ).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
    <div style="text-align:center;margin-bottom:24px">
      <span style="font-size:40px">😅</span>
    </div>
    <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Oops! We Messed Up</h1>
    <p style="color:#666;font-size:14px;text-align:center;margin:0 0 20px;line-height:1.6">
      You requested <strong>${topperName}</strong>'s answer copy but never received it due to a technical glitch. We're really sorry about that!
    </p>
    <h2 style="font-size:16px;color:#111;margin:0 0 12px">Here's Your Answer Copy:</h2>
    <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin-bottom:20px">
      ${downloadLinks}
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:20px;text-align:center">
      <p style="margin:0 0 4px;font-size:13px;color:#059669;font-weight:600">🎁 As an apology, here's a coupon for you</p>
      <p style="margin:0 0 8px;font-size:12px;color:#666">Get ANY product from our store for free</p>
      <div style="background:#fff;border:2px dashed #059669;border-radius:8px;padding:10px 20px;display:inline-block">
        <span style="font-size:22px;font-weight:800;color:#059669;letter-spacing:2px">${coupon}</span>
      </div>
      <p style="margin:8px 0 0;font-size:11px;color:#666">Enter code at checkout for 100% off • Valid only till <strong>12 AM tonight</strong></p>
      <a href="https://upscprepnotes.in/store" style="display:inline-block;margin-top:12px;background:#059669;color:#fff;text-decoration:none;padding:10px 28px;border-radius:8px;font-size:13px;font-weight:700">Browse Store →</a>
    </div>
    <p style="color:#999;font-size:12px;text-align:center;margin:0">— UPSCPrepNotes Team</p>
  </div>
</body>
</html>`;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection("freedownloadleads");

  // Get target lead timestamp
  const targetEmail = "srinidhinimmakuri@gmail.com";
  const targetLead = await collection.findOne(
    { email: targetEmail },
    { sort: { createdAt: 1 } }
  );

  if (!targetLead) {
    console.log(`Target ${targetEmail} not found directly. Trying case-insensitive...`);
    const all = await collection.find({ email: { $regex: targetEmail, $options: "i" } }).sort({ createdAt: 1 }).toArray();
    console.log(`Found ${all.length} matches:`);
    all.forEach(l => console.log(`  ${l.email} createdAt: ${l.createdAt}`));
    process.exit(1);
  }

  console.log(`Target found: ${targetLead.email} at ${targetLead.createdAt}`);

  const pendingLeads = await collection.find({
    _id: { $gt: targetLead._id },
    email: { $ne: "impic.tech@gmail.com" },
  }).sort({ createdAt: 1 }).toArray();

  // Deduplicate by email (keep first)
  const seen = new Set();
  const unique = pendingLeads.filter(l => {
    const key = l.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\nTotal entries after target: ${pendingLeads.length}`);
  console.log(`Unique leads to send to: ${unique.length}\n`);

  unique.forEach(l => console.log(`  ${l.email} — ${l.topperName}`));

  console.log("\nSending...\n");

  for (const lead of unique) {
    const topper = await db.collection("toppers").findOne({ slug: lead.topperSlug });
    const pdfUrls = topper?.freeAnswerCopyUrls?.length
      ? topper.freeAnswerCopyUrls
      : topper?.freeAnswerCopyUrl
        ? [topper.freeAnswerCopyUrl]
        : [];

    if (pdfUrls.length === 0) {
      console.log(`  ✗ ${lead.email}: no PDF URLs for ${lead.topperName}, skipping`);
      continue;
    }

    try {
      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: lead.email,
        subject: `Sorry! Here's Your Free Answer Copy + Free Gift 🎁`,
        html: buildApologyHtml(lead.topperName, pdfUrls, COUPON_CODE),
      });

      if (result.error) {
        console.log(`  ✗ ${lead.email}: ${result.error.message}`);
      } else {
        console.log(`  ✓ ${lead.email}`);
      }
    } catch (err) {
      console.log(`  ✗ ${lead.email}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log("\nDone!");
  await mongoose.disconnect();
}

main().catch(console.error);
