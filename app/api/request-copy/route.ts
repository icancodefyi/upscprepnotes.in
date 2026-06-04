import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CopyRequestModel } from "@/models/copy-request.model";
import { TopperModel } from "@/models/topper.model";
import nodemailer from "nodemailer";

async function sendRequestEmail(email: string, topperName: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Request Received!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">We've noted your interest in <strong>${topperName}'s</strong> answer copy.</p>
        <p style="color:#444;font-size:14px;line-height:1.7;text-align:center">We're working on sourcing it. As soon as it's available, we'll send it straight to this inbox.</p>
        <div style="background:#f0fdf4;border-radius:12px;padding:24px;margin-top:24px;text-align:center">
          <p style="margin:0 0 8px;font-size:13px;color:#065f46">In the meantime, you can explore answer copies of <strong>20+ other toppers</strong> already available.</p>
          <a href="https://upscprepnotes.in/upsc-topper/divya-tanwar-rank-105-2022" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:40px;text-decoration:none;font-weight:600;font-size:13px">Browse Available Copies →</a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You requested this on UPSCPrepNotes.in. We'll only email you when ${topperName}'s copy is ready.</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `We'll notify you when ${topperName}'s answer copy is available`,
    html: userHtml,
  });

  const adminHtml = `
    <p><strong>📋 Copy Request Lead</strong></p>
    <p>Email: ${email}</p>
    <p>Topper: ${topperName}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `📋 Copy Request: ${topperName} — ${email}`,
    html: adminHtml,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, topperSlug } = body;

    if (!email || !topperSlug) {
      return NextResponse.json(
        { error: "Email and topper slug are required." },
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

    await CopyRequestModel.create({
      email,
      topperSlug,
      topperName,
    });

    try {
      await sendRequestEmail(email, topperName);
    } catch (err) {
      console.error("Request email send error:", err);
    }

    return NextResponse.json(
      { success: true, topperName },
      { status: 201 }
    );
  } catch (err) {
    console.error("Copy request API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
