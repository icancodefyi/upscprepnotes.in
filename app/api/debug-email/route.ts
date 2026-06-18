import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";

export async function GET() {
  const envCheck = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? `set (${process.env.RESEND_API_KEY.slice(0, 8)}...)` : "MISSING",
    EMAIL_FROM: process.env.EMAIL_FROM || "MISSING",
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "MISSING",
  };

  try {
    const result = await sendEmail({
      to: "upscprepnotes.in@gmail.com",
      subject: "Debug test from Resend",
      html: "<p>If you see this, Resend is working.</p>",
    });

    return NextResponse.json({ success: true, env: envCheck, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, env: envCheck, error: err.message, stack: err.stack }, { status: 500 });
  }
}
