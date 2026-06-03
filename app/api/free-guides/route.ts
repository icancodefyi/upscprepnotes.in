import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import nodemailer from "nodemailer";

const GUIDES = [
  {
    title: "Answer Writing Strategy Guide",
    url: "https://upscprepnotes.in/pdfs/free-guides/guide-answer-writing.pdf",
  },
  {
    title: "IBEC Method — Answer Framework Guide",
    url: "https://upscprepnotes.in/pdfs/free-guides/guide-ibec-method.pdf",
  },
  {
    title: "GS1 Strategy Guide",
    url: "https://upscprepnotes.in/pdfs/free-guides/guide-gs1-strategy.pdf",
  },
];

const BUNDLE_URL = "https://upscprepnotes.in/toppers/toppers-copy-compilation";

async function sendGuideEmail(name: string, email: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const guideLinks = GUIDES.map(
    (g) =>
      `<tr><td style="padding:8px 0"><a href="${g.url}" style="color:#059669;font-weight:600;font-size:15px">${g.title}</a></td></tr>`
  ).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <div style="text-align:center;margin-bottom:24px">
          <span style="font-size:40px">📚</span>
        </div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Thanks, ${name}!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">Here are your 3 free strategy guides to get started.</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${guideLinks}
        </table>

        <hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0" />

        <div style="background:#f0fdf4;border-radius:12px;padding:24px;text-align:center">
          <p style="margin:0 0 8px;font-size:13px;color:#065f46">Want the full set? Get <strong style="font-size:15px">50+ topper answer copies + 21 strategy guides</strong> in one bundle.</p>
          <p style="margin:0 0 16px;font-size:13px;color:#065f46">All papers — GS1-4, Essay &amp; Optional. Just <strong>₹11 per copy</strong> (₹799 total).</p>
          <a href="${BUNDLE_URL}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Get Complete Bundle at ₹799 →</a>
        </div>

        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You received this because you requested free guides on UPSCPrepNotes.in</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: "Your 3 Free Strategy Guides — UPSCPrepNotes",
    html,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    await connectDB();

    await FreeGuideLeadModel.create({ name, email });

    try {
      await sendGuideEmail(name, email);
    } catch (err) {
      console.error("Guide email send error:", err);
    }

    return NextResponse.json(
      {
        success: true,
        guides: GUIDES,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Free guides API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
