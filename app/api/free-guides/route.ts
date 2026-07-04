import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { sendEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

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

        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You received this because you requested free guides on UPSCPrepNotes.in</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: "Your 3 Free Strategy Guides — UPSCPrepNotes",
    html,
  });
}

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;

  try {
    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    await connectDB();

    await FreeGuideLeadModel.create({ name: name || "Guest", email });

    try {
      await AnalyticsEventModel.create({
        event: "free_guide_lead",
        pagePath: "/",
        sessionId: "server",
        visitorId: "server",
        referrer: "",
        userAgent: "",
        deviceType: "server",
        metadata: { email, name: name || "Guest" },
      });
    } catch (err) {
      console.error("Analytics event creation error:", err);
    }

    await sendGuideEmail(name, email);

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
