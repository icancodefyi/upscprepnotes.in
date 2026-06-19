import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CopyRequestModel } from "@/models/copy-request.model";
import { TopperModel } from "@/models/topper.model";
import { sendEmail } from "@/lib/resend";

async function sendRequestEmail(email: string, topperName: string) {

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Request Received!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">We've noted your interest in <strong>${topperName}'s</strong> answer copy.</p>
        <p style="color:#444;font-size:14px;line-height:1.7;text-align:center">We're working on sourcing it. As soon as it's available, we'll send it straight to this inbox.</p>
        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You requested this on UPSCPrepNotes.in. We'll only email you when ${topperName}'s copy is ready.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
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

  await sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "upscprepnotes.in@gmail.com",
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

    await sendRequestEmail(email, topperName);

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
