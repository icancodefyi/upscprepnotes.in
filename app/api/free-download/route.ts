import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { TopperModel } from "@/models/topper.model";
import { sendEmail } from "@/lib/resend";
import { getPostHogClient } from "@/lib/posthog-server";

const BUNDLE_URL = "https://upscprepnotes.in/toppers/toppers-copy-compilation";

function buildDownloadLinksHtml(urls: string[]): string {
  if (urls.length === 0) return "";
  if (urls.length === 1) {
    return `<div style="text-align:center;margin-bottom:28px">
      <a href="${urls[0]}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Download Answer Copy →</a>
    </div>`;
  }
  const items = urls.map((url, i) =>
    `<tr><td style="padding:6px 0"><a href="${url}" style="color:#059669;font-weight:600;font-size:14px">Copy ${i + 1} →</a></td></tr>`
  ).join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px">${items}</table>`;
}

async function sendAvailableEmail(email: string, topperName: string, pdfUrls: string[]) {

  const linksHtml = buildDownloadLinksHtml(pdfUrls);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Your Free Download is Ready!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">Here ${pdfUrls.length > 1 ? "are the free answer copies" : "is the free answer copy"} of <strong>${topperName}</strong> you requested.</p>
        ${linksHtml}
        <div style="text-align:center;margin-bottom:28px;padding:12px;background:#e8f4fd;border-radius:40px">
          <a href="https://t.me/+VYMxrig-a8AzZmNl" style="color:#0088cc;font-size:13px;font-weight:700;text-decoration:none">
            📬 Join 100+ aspirants on Telegram for daily current affairs →
          </a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You received this because you requested a free download on UPSCPrepNotes.in</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: pdfUrls.length > 1 ? `Your Free Answer Copies — ${topperName}` : `Your Free Answer Copy — ${topperName}`,
    html,
  });
}

async function sendUnavailableEmail(email: string, topperName: string) {

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">We're Working on It!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 8px;line-height:1.6">Thanks for requesting <strong>${topperName}</strong>'s answer copy.</p>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6">We're sourcing it now and will email it to you as soon as it's available.</p>
        <div style="text-align:center;margin-bottom:28px;padding:12px;background:#e8f4fd;border-radius:40px">
          <a href="https://t.me/+VYMxrig-a8AzZmNl" style="color:#0088cc;font-size:13px;font-weight:700;text-decoration:none">
            📬 Meanwhile, join 100+ aspirants on Telegram for daily current affairs →
          </a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:0">— UPSCPrepNotes Team</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `We're Sourcing ${topperName}'s Answer Copy`,
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
    const pdfUrls: string[] = topper.freeAnswerCopyUrls?.length
      ? topper.freeAnswerCopyUrls
      : topper.freeAnswerCopyUrl
        ? [topper.freeAnswerCopyUrl]
        : [];
    const available = pdfUrls.length > 0;

    await FreeDownloadLeadModel.create({
      email,
      name: name || "",
      topperSlug,
      topperName,
      source: source || "topper_page",
      sourceUrl: sourceUrl || "",
      available,
    });

    await NurtureCampaignModel.updateOne(
      { email: email.toLowerCase() },
      {
        $setOnInsert: {
          email: email.toLowerCase(),
          topperName,
          step: 0,
          nextScheduledAt: new Date(),
          sentAt: [],
          completed: false,
        },
      },
      { upsert: true }
    );

    const posthog = getPostHogClient();
    posthog.identify({ distinctId: email, properties: { email, name: name || undefined } });
    posthog.capture({
      distinctId: email,
      event: "free_download_requested",
      properties: {
        topper_slug: topperSlug,
        topper_name: topperName,
        source: source || "topper_page",
        available,
      },
    });

    if (available) {
      await sendAvailableEmail(email, topperName, pdfUrls);
    } else {
      await sendUnavailableEmail(email, topperName);
    }

    return NextResponse.json(
      {
        success: true,
        available,
        pdfUrls,
        pdfUrl: pdfUrls[0] || null,
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
