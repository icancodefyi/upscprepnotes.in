require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { Resend } = require("resend");

const FROM_EMAIL = process.env.EMAIL_FROM || "hello@upscprepnotes.in";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "UPSCPrepNotes";
const resend = new Resend(process.env.RESEND_API_KEY);
const INTERNAL = ["rakhangezaid10@gmail.com", "impic.tech@gmail.com"];

function day1Html(firstName, pdfTitle) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
<h1 style="margin:0 0 8px;font-size:22px;color:#111">${firstName ? `Hi ${firstName},` : "Hi there,"}</h1>
<p style="color:#666;font-size:14px;line-height:1.6">Hope you found <strong>${pdfTitle}</strong> useful!</p>
<p style="color:#666;font-size:14px;line-height:1.6">Here are more free resources that other aspirants downloaded along with this one:</p>
<ul style="color:#666;font-size:14px;line-height:1.8">
<li><a href="https://upscprepnotes.in/free-materials?category=test-series" style="color:#059669">Free Test Series (2,300+ papers)</a></li>
<li><a href="https://upscprepnotes.in/free-materials?category=notes" style="color:#059669">Free Notes & Study Material (200+ files)</a></li>
<li><a href="https://upscprepnotes.in/free-materials?category=magazines" style="color:#059669">Free Magazines & Current Affairs (160+ compilations)</a></li>
</ul>
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin:24px 0">
<p style="margin:0;font-size:13px;color:#059669;font-weight:600">🔥 Flash Sale — All Products at ₹99</p>
<p style="margin:4px 0 0;font-size:12px;color:#666">Every product on UPSCPrepNotes at just ₹99. Limited time offer.</p>
<a href="https://upscprepnotes.in/store" style="display:inline-block;margin-top:8px;background:#059669;color:#fff;text-decoration:none;padding:8px 24px;border-radius:8px;font-size:12px;font-weight:700">Browse Store →</a>
</div>
<p style="color:#999;font-size:12px;margin:24px 0 0">You received this because you downloaded free material from UPSCPrepNotes.in</p>
</div></body></html>`;
}

function day3Html(firstName) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
<h1 style="margin:0 0 8px;font-size:22px;color:#111">${firstName ? `${firstName}, Flash Sale ends Tuesday midnight!` : "Flash Sale ends Tuesday midnight!"}</h1>
<p style="color:#666;font-size:14px;line-height:1.6">Just a reminder — our Flash Sale is ending soon. All products at just ₹99.</p>
<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px;margin:24px 0;text-align:center">
<p style="margin:0 0 12px;font-size:13px;color:#dc2626;font-weight:600">⏰ Ending Tuesday Midnight</p>
<a href="https://upscprepnotes.in/store" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Shop Now →</a>
</div>
<p style="color:#666;font-size:14px;line-height:1.6">39 premium products — notes bundles, test series, teacher materials, and original compilations. Instant PDF delivery.</p>
<p style="color:#999;font-size:12px;margin:24px 0 0">You received this because you downloaded free material from UPSCPrepNotes.in</p>
</div></body></html>`;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI + "upscprepnotes");
  const FreeMaterialLead = mongoose.model(
    "FreeMaterialLead",
    new mongoose.Schema(
      {
        email: String,
        pdfSlug: String,
        pdfTitle: String,
        category: String,
        source: String,
        sentDay1FollowUp: { type: Boolean, default: false },
        sentDay3FollowUp: { type: Boolean, default: false },
      },
      { timestamps: true }
    )
  );

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const day1Candidates = await FreeMaterialLead.find({
    sentDay1FollowUp: false,
    createdAt: { $lte: new Date(now - DAY_MS) },
  }).sort({ createdAt: 1 });

  const day3Candidates = await FreeMaterialLead.find({
    sentDay3FollowUp: false,
    sentDay1FollowUp: true,
    createdAt: { $lte: new Date(now - 3 * DAY_MS) },
  }).sort({ createdAt: 1 });

  let sent = 0;

  // Day 1 follow-ups
  for (const lead of day1Candidates) {
    if (INTERNAL.includes(lead.email)) continue;
    try {
      const firstName = lead.email.split("@")[0].split(".")[0];
      await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: lead.email,
        subject: `More free resources for your UPSC prep`,
        html: day1Html(firstName, lead.pdfTitle),
      });
      await FreeMaterialLead.updateOne(
        { _id: lead._id },
        { $set: { sentDay1FollowUp: true } }
      );
      sent++;
      console.log(`[Day 1] Sent to ${lead.email} (${lead.pdfTitle})`);
    } catch (err) {
      console.error(`[Day 1] Failed for ${lead.email}:`, err.message);
    }
  }

  // Day 3 follow-ups
  for (const lead of day3Candidates) {
    if (INTERNAL.includes(lead.email)) continue;
    try {
      const firstName = lead.email.split("@")[0].split(".")[0];
      await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: lead.email,
        subject: `Flash Sale ends Tuesday midnight — all at ₹99`,
        html: day3Html(firstName),
      });
      await FreeMaterialLead.updateOne(
        { _id: lead._id },
        { $set: { sentDay3FollowUp: true } }
      );
      sent++;
      console.log(`[Day 3] Sent to ${lead.email}`);
    } catch (err) {
      console.error(`[Day 3] Failed for ${lead.email}:`, err.message);
    }
  }

  console.log(`\nDone. Sent ${sent} follow-up emails total.`);
  console.log(`Day 1 candidates: ${day1Candidates.length}, Day 3 candidates: ${day3Candidates.length}`);
  await mongoose.disconnect();
}

main().catch(console.error);
