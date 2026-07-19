import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { sendEmail } from "@/lib/resend";
import { getPostHogClient } from "@/lib/posthog-server";
import { checkRateLimit } from "@/lib/rate-limit";

const VPS_URL = process.env.VPS_URL || "https://cdn.upscprepnotes.in";
const FREE_PRODUCT_NAME = "Government Schemes Compendium";
const FREE_PRODUCT_VALUE = 99;
const DOWNLOAD_URL = `${VPS_URL}/guide-government-schemes-compendium.pdf`;

const EMAIL_SUBJECT = `Your Free Government Schemes Compendium (worth ₹${FREE_PRODUCT_VALUE})`;

function buildEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <div style="text-align:center;margin-bottom:24px">
          <span style="display:inline-block;background:#C4F9D7;color:#111;border:1px solid #111;border-radius:999px;padding:4px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Free Exclusive</span>
        </div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center;line-height:1.3">Your Free <em>Government Schemes</em> Compendium is Ready</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">
          Worth ₹${FREE_PRODUCT_VALUE} on our store — yours free. This is the complete compilation of all important government schemes, organized by ministry and sector with objectives, features, and key facts.
        </p>
        <div style="text-align:center;margin-bottom:28px">
          <a href="${DOWNLOAD_URL}" style="display:inline-block;background:#000;color:#fff;padding:14px 36px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Download Your Free PDF →</a>
        </div>
        <div style="border-top:1px solid #eee;padding-top:24px;margin-bottom:24px">
          <p style="color:#111;font-size:13px;font-weight:600;margin:0 0 12px">What's inside:</p>
          <ul style="color:#666;font-size:13px;line-height:1.8;padding-left:20px;margin:0">
            <li>All important government schemes covered</li>
            <li>Organized by ministry and sector</li>
            <li>Objective, features, budget, and beneficiaries</li>
            <li>Ideal for Prelims and Mains preparation</li>
          </ul>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0;line-height:1.5">
          You're also enrolled in our free 4-day UPSC strategy email series.<br/>
          You can unsubscribe at any time.
        </p>
        <div style="text-align:center;margin-top:20px;padding:12px;background:#e8f4fd;border-radius:40px">
          <a href="https://t.me/+VYMxrig-a8AzZmNl" style="color:#0088cc;font-size:13px;font-weight:700;text-decoration:none">
            📬 Join 100+ aspirants on Telegram for daily current affairs →
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;

  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    await SubscriberEmailModel.updateOne(
      { email: normalizedEmail },
      { $setOnInsert: { email: normalizedEmail } },
      { upsert: true }
    );

    await NurtureCampaignModel.updateOne(
      { email: normalizedEmail },
      {
        $setOnInsert: {
          email: normalizedEmail,
          topperName: FREE_PRODUCT_NAME,
          step: 0,
          nextScheduledAt: new Date(),
          sentAt: [],
          completed: false,
        },
      },
      { upsert: true }
    );

    const posthog = getPostHogClient();
    posthog.identify({ distinctId: normalizedEmail, properties: { email: normalizedEmail } });
    posthog.capture({
      distinctId: normalizedEmail,
      event: "hero_lead_captured",
      properties: {
        source: source || "hero_form",
        product: "answer-copies-compilation",
        product_value: FREE_PRODUCT_VALUE,
      },
    });

    await sendEmail({
      to: normalizedEmail,
      subject: EMAIL_SUBJECT,
      html: buildEmailHtml(),
    });

    return NextResponse.json(
      { success: true, downloadUrl: DOWNLOAD_URL },
      { status: 201 }
    );
  } catch (err) {
    console.error("Hero lead API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}