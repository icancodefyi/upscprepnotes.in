import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config({ path: ".env.local" });

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.useDb("upscprepnotes");

// 3 unique users who never got PDFs
const users = [
  { email: "nargist91@gmail.com", topperName: "Komal Meena" },
  { email: "shyamkumar8252790105@gmail.com", topperName: "BharatJai PrakashMeena" },
  { email: "prabhaswayam22@gmail.com", topperName: "Arjun Gupta" },
];

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const GUIDES = [
  { title: "Answer Writing Strategy Guide", url: "https://upscprepnotes.in/pdfs/free-guides/guide-answer-writing.pdf" },
  { title: "IBEC Method — Answer Framework Guide", url: "https://upscprepnotes.in/pdfs/free-guides/guide-ibec-method.pdf" },
  { title: "GS1 Strategy Guide", url: "https://upscprepnotes.in/pdfs/free-guides/guide-gs1-strategy.pdf" },
];

const guideLinks = GUIDES.map(g =>
  `<tr><td style="padding:8px 0"><a href="${g.url}" style="color:#059669;font-weight:600;font-size:15px">${g.title}</a></td></tr>`
).join("");

for (const user of users) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <div style="text-align:center;margin-bottom:20px">
          <span style="font-size:36px">🙏</span>
        </div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">We Apologize for the Delay</h1>
        <p style="color:#555;font-size:15px;text-align:center;margin:0 0 6px;line-height:1.6">You had requested <strong>${user.topperName}</strong>'s answer copy on UPSCPrepNotes. We're still working on sourcing it and it's taking longer than expected.</p>
        <p style="color:#555;font-size:15px;text-align:center;margin:0 0 28px;line-height:1.6">As a thank-you for your patience, here are 3 free strategy guides to help with your prep:</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          ${guideLinks}
        </table>

        <div style="background:#f0fdf4;border-radius:12px;padding:24px;text-align:center;margin-bottom:20px">
          <p style="margin:0 0 6px;font-size:14px;color:#065f46;font-weight:600">📚 Also, check out our store</p>
          <p style="margin:0 0 12px;font-size:13px;color:#065f46;line-height:1.5">50+ topper answer copies, 21 strategy guides, notes bundles & test series — all in one place.</p>
          <a href="https://upscprepnotes.in/store" style="display:inline-block;background:#059669;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Browse Store →</a>
        </div>

        <p style="color:#999;font-size:12px;text-align:center;margin:0">We'll email you as soon as ${user.topperName}'s copy is available. Thank you for your understanding.</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Sorry for the delay — ${user.topperName}'s answer copy + free guides inside`,
      html,
    });
    console.log(`✓ Sent to ${user.email}`);
  } catch (err) {
    console.error(`✗ Failed to send to ${user.email}:`, err.message);
  }
}

await mongoose.disconnect();
console.log("Done.");
