import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { sendEmail } from "@/lib/resend";
import { getPostHogClient } from "@/lib/posthog-server";

const VPS_URL = process.env.VPS_URL || "https://cdn.upscprepnotes.in";
const FREE_PRODUCT_NAME = "Places in News by Sudarshan Gurjar";
const FREE_PRODUCT_VALUE = 99;
const DOWNLOAD_URL = `${VPS_URL}/Places-in-News.zip`;

const EMAIL_SUBJECT = `Your Free "Places in News" Compilation (worth ₹${FREE_PRODUCT_VALUE})`;

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
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center;line-height:1.3">Your Free <em>Places in News</em> Compilation is Ready</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">
          Worth ₹${FREE_PRODUCT_VALUE} on our store — yours free. This is the complete compilation by Sudarshan Gurjar covering every place that appeared in the news, organized by region and topic.
        </p>
        <div style="text-align:center;margin-bottom:28px">
          <a href="${DOWNLOAD_URL}" style="display:inline-block;background:#000;color:#fff;padding:14px 36px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Download Your Free PDF →</a>
        </div>
        <div style="border-top:1px solid #eee;padding-top:24px;margin-bottom:24px">
          <p style="color:#111;font-size:13px;font-weight:600;margin:0 0 12px">What's inside:</p>
          <ul style="color:#666;font-size:13px;line-height:1.8;padding-left:20px;margin:0">
            <li>Complete Places in News compilation</li>
            <li>Organized by region and topic</li>
            <li>Key facts for Prelims and Mains</li>
            <li>Map-based question preparation</li>
          </ul>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0;line-height:1.5">
          You're also enrolled in our free 4-day UPSC strategy email series.<br/>
          You can unsubscribe at any time.
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
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
        product: "places-in-news",
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