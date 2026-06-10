import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { TopperModel } from "@/models/topper.model";
import nodemailer from "nodemailer";

const BUNDLE_URL = "https://upscprepnotes.in/toppers/toppers-copy-compilation";

async function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendAvailableEmail(email: string, topperName: string, pdfUrl: string) {
  const transporter = await getTransporter();

  const html = `
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
          <p style="margin:0 0 8px;font-size:13px;color:#065f46">Want more? Get <strong style="font-size:15px">50+ topper answer copies + 21 strategy guides</strong> in one compilation.</p>
          <p style="margin:0 0 16px;font-size:13px;color:#065f46">All papers — GS1-4, Essay &amp; Optional. Just <strong>₹11 per copy</strong> (₹799 total).</p>
          <a href="${BUNDLE_URL}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Get Complete Compilation at ₹799 →</a>
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
    html,
  });
}

async function sendUnavailableEmail(email: string, topperName: string) {
  const transporter = await getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">We're Working on It!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 8px;line-height:1.6">Thanks for requesting <strong>${topperName}</strong>'s answer copy.</p>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6">We're sourcing it now and will email it to you as soon as it's available.</p>
        <div style="background:#f0fdf4;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <p style="margin:0 0 8px;font-size:13px;color:#065f46;font-weight:600">🎁 Complementary Offer</p>
          <p style="margin:0 0 12px;font-size:13px;color:#065f46;line-height:1.5">If we can't deliver ${topperName}'s copy within 48 hours, we'll give you <strong>free access to our premium strategy guides</strong> (worth ₹649) as a thank-you.</p>
          <a href="${BUNDLE_URL}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Browse the Compilation →</a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:0">— UPSCPrepNotes Team</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `We're Sourcing ${topperName}'s Answer Copy`,
    html,
  });
}

async function sendAdminNotification(email: string, topperName: string, topperSlug: string, name: string, source: string, sourceUrl: string, available: boolean) {
  const transporter = await getTransporter();

  const status = available ? "✅ Available — Downloaded" : "⏳ Unavailable — Requested";
  const html = `
    <p><strong>${status}</strong></p>
    <p>Email: ${email}</p>
    ${name ? `<p>Name: ${name}</p>` : ""}
    <p>Topper: ${topperName} (${topperSlug})</p>
    <p>Source: ${source}</p>
    <p>URL: ${sourceUrl}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `${available ? "📥" : "📋"} Free Download: ${topperName} — ${email}`,
    html,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topperSlug, name, source, sourceUrl } = body;

    if (!topperSlug) {
      return NextResponse.json(
        { error: "Topper slug is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const topper = await TopperModel.findOne({ slug: topperSlug }).lean();
    if (!topper) {
      return NextResponse.json(
        { error: "Topper not found." },
        { status: 404 }
      );
    }

    const topperName = `${topper.firstName} ${topper.lastName}`;
    const available = !!topper.freeAnswerCopyUrl;

    await FreeDownloadLeadModel.create({
      email,
      name: name || "",
      topperSlug,
      topperName,
      source: source || "topper_page",
      sourceUrl: sourceUrl || "",
      available,
    });

    try {
      if (available) {
        await sendAvailableEmail(email, topperName, topper.freeAnswerCopyUrl);
      } else {
        await sendUnavailableEmail(email, topperName);
      }
      await sendAdminNotification(email, topperName, topperSlug, name, source, sourceUrl, available);
    } catch (err) {
      console.error("Email send error:", err);
    }

    return NextResponse.json(
      {
        success: true,
        available,
        pdfUrl: available ? topper.freeAnswerCopyUrl : null,
        topperName,
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
