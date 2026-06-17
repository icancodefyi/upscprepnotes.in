import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config({ path: ".env.local" });

const FROM_EMAIL = process.env.EMAIL_FROM || process.env.SMTP_USER;
const REVIEW_EMAIL = "impic.tech@gmail.com";

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME || "upscprepnotes" });

const leads = mongoose.connection.collection("freedownloadleads");
const allLeads = await leads.find({}).sort({ createdAt: -1 }).toArray();
const emails = [...new Set(allLeads.map(l => l.email))].filter(Boolean);

// Exclude the 3 who just received apology emails today
const exclude = ["shyamkumar8252790105@gmail.com", "nargist91@gmail.com", "prabhaswayam22@gmail.com"];
const recipients = emails.filter(e => !exclude.includes(e));

console.log(`Total leads: ${allLeads.length}, unique emails: ${emails.length}, sending to: ${recipients.length}`);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const BRAND_LOGO = "https://upscprepnotes.in/logo.png";

const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f4f4f5">
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f4f4f5;padding:40px 0">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
          <tr><td style="padding:40px 32px 32px">
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px">
              <tr>
                <td style="text-align:center;padding:0">
                  <a href="https://upscprepnotes.in" style="text-decoration:none">
                    <img src="${BRAND_LOGO}" alt="UPSCPrepNotes" width="180" style="display:inline-block;max-width:180px;height:auto;border:0">
                  </a>
                </td>
              </tr>
            </table>

            <div style="text-align:center;margin-bottom:20px"><span style="font-size:40px">🧠</span></div>
            <h1 style="margin:0 0 6px;font-size:24px;color:#18181b;text-align:center;font-weight:700;letter-spacing:-0.3px">AI Mentor is Live!</h1>
            <p style="color:#52525b;font-size:15px;text-align:center;margin:0 0 28px;line-height:1.6">Ask anything UPSC-related — strategy, current affairs, optional subjects, answer writing tips. It's like having a topper by your side, trained on 280+ topper strategies.</p>

            <table cellpadding="0" cellspacing="0" style="width:100%;background:#f0fdf4;border-radius:12px;margin-bottom:28px">
              <tr>
                <td style="padding:24px">
                  <p style="margin:0 0 16px;font-size:14px;color:#065f46;font-weight:600">What you can ask:</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%">
                    <tr><td style="padding:0 0 8px 0;font-size:14px;color:#333">📚 "How did AIR 1 prepare for GS Paper 3?"</td></tr>
                    <tr><td style="padding:0 0 8px 0;font-size:14px;color:#333">📰 "Explain this week's current affairs for UPSC"</td></tr>
                    <tr><td style="padding:0 0 8px 0;font-size:14px;color:#333">✍️ "Review my answer structure for this question"</td></tr>
                    <tr><td style="padding:0 0 0 0;font-size:14px;color:#333">🎯 "Which optional subject should I choose?"</td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <div style="text-align:center;margin-bottom:12px">
              <a href="https://upscprepnotes.in/ask?utm_source=email&utm_medium=email&utm_campaign=ai-mentor-launch" style="display:inline-block;background:#059669;color:#fff;padding:14px 36px;border-radius:40px;text-decoration:none;font-weight:700;font-size:15px">Try AI Mentor Free →</a>
            </div>
            <p style="text-align:center;font-size:13px;color:#888;margin:0 0 28px">5 free queries/day · 20/day with Google sign-in · No cost</p>

            <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e4e4e7;padding-top:20px;margin-top:24px">
              <tr>
                <td style="font-size:13px;color:#888;line-height:1.6">
                  <strong style="color:#333">Why we built this:</strong><br>
                  You previously requested a topper's answer copy from us. We realized most UPSC doubts don't need a human mentor — they just need quick, accurate answers from someone (or something) who understands the exam deeply. AI Mentor does that.
                </td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:32px;padding-top:20px;border-top:1px solid #e4e4e7">
              <tr>
                <td style="text-align:center;font-size:12px;color:#a1a1aa;line-height:1.6">
                  UPSCPrepNotes — Structured UPSC intelligence archive<br>
                  280+ Profiles · 18 Subjects · Updated Regularly<br>
                  <a href="https://upscprepnotes.in" style="color:#059669;text-decoration:none">upscprepnotes.in</a>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

let sent = 0;
let errors = 0;

for (const email of recipients) {
  try {
    await transporter.sendMail({
      from: `"UPSCPrepNotes" <${FROM_EMAIL}>`,
      to: email,
      bcc: REVIEW_EMAIL,
      subject: "🧠 AI Mentor is Live — Ask Anything UPSC, Free",
      html,
    });
    sent++;
    console.log(`✓ ${email}`);
  } catch (e) {
    errors++;
    console.error(`✗ ${email}: ${e.message}`);
  }
}

await mongoose.disconnect();
console.log(`\nDone. Sent: ${sent}, Errors: ${errors}, Total: ${recipients.length}`);
