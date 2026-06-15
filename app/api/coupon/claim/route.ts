import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, coupon } = await req.json();

    if (!email || !coupon) {
      return NextResponse.json({ error: "Missing email or coupon" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
        <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
          <div style="text-align:center;margin-bottom:24px">
            <span style="font-size:40px">🎉</span>
          </div>
          <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Your 60% Off Coupon is Ready!</h1>
          <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">Use this one-time coupon on any product in the UPSCPrepNotes store.</p>

          <div style="background:#fefce8;border:2px dashed #f59e0b;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px">
            <p style="margin:0 0 4px;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:1px">Your Coupon Code</p>
            <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:3px;color:#d97706;font-family:monospace">${coupon}</p>
          </div>

          <p style="color:#666;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6">Enter this code at checkout to get <strong>60% off</strong> on any product — notes bundles, test series, teacher materials, and more.</p>

          <div style="text-align:center">
            <a href="https://upscprepnotes.in/store?coupon=${coupon}" style="display:inline-block;background:#059669;color:#fff;padding:14px 40px;border-radius:40px;text-decoration:none;font-weight:700;font-size:15px">Shop Now →</a>
          </div>

          <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You received this because you requested a coupon on UPSCPrepNotes.in · One-time use only</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Your 60% Off Coupon Code — UPSCPrepNotes",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[COUPON CLAIM]", err);
    return NextResponse.json({ error: "Failed to send coupon" }, { status: 500 });
  }
}
