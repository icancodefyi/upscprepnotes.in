import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { TopperModel } from "@/models/topper.model";
import nodemailer from "nodemailer";

async function sendDownloadEmail(email: string, topperName: string, pdfUrl: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const BUNDLE_URL = "https://upscprepnotes.in/toppers/toppers-copy-compilation";

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Your Free Download is Ready!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">Here's the free answer copy of <strong>${topperName}</strong> you requested.</p>
        <div style="text-align:center;margin-bottom:28px">
          <a href="${pdfUrl}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Download Answer Copy →</a>
        </div>
        <hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0" />
        <div style="background:#f0fdf4;border-radius:12px;padding:24px;text-align:center">
          <p style="margin:0 0 8px;font-size:13px;color:#065f46">Want more? Get <strong style="font-size:15px">50+ topper answer copies + 21 strategy guides</strong> in one bundle.</p>
          <p style="margin:0 0 16px;font-size:13px;color:#065f46">All papers — GS1-4, Essay &amp; Optional. Just <strong>₹11 per copy</strong> (₹799 total).</p>
          <a href="${BUNDLE_URL}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Get Complete Bundle at ₹799 →</a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You received this because you requested a free download on UPSCPrepNotes.in</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `Your Free Answer Copy — ${topperName}`,
    html: userHtml,
  });

  const adminHtml = `
    <p><strong>Free Download Lead</strong></p>
    <p>Email: ${email}</p>
    <p>Topper: ${topperName}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `📥 Free Download: ${topperName} — ${email}`,
    html: adminHtml,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topperSlug, name } = body;

    if (!topperSlug) {
      return NextResponse.json(
        { error: "Topper slug is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const topper = await TopperModel.findOne({ slug: topperSlug }).lean();
    if (!topper || !topper.freeAnswerCopyUrl) {
      return NextResponse.json(
        { error: "Free download not available for this topper." },
        { status: 404 }
      );
    }

    if (email) {
      await FreeDownloadLeadModel.create({
        email,
        topperSlug,
        topperName: `${topper.firstName} ${topper.lastName}`,
        name: name || "",
      });

      try {
        await sendDownloadEmail(
          email,
          `${topper.firstName} ${topper.lastName}`,
          topper.freeAnswerCopyUrl
        );
      } catch (err) {
        console.error("Download email send error:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        pdfUrl: topper.freeAnswerCopyUrl,
        topperName: `${topper.firstName} ${topper.lastName}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Free download API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
