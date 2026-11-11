import { sanitizeProfile } from "@/lib/lead-profile";
import { geoFrom } from "@/lib/geo";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { TopperModel } from "@/models/topper.model";
import { sendEmail } from "@/lib/resend";
import { FIRST_EMAIL_DELAY_DAYS } from "@/lib/nurture-emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { createHandoff, EMAIL_RE } from "@/lib/handoff";

const BUNDLE_URL = "https://upscprepnotes.in/toppers/toppers-copy-compilation";

function buildDownloadLinksHtml(urls: string[]): string {
  if (urls.length === 0) return "";
  if (urls.length === 1) {
    return `<div style="text-align:center;margin-bottom:28px">
      <a href="${urls[0]}" style="display:inline-block;background:#1f3fd6;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Download Answer Copy →</a>
    </div>`;
  }
  const items = urls.map((url, i) =>
    `<tr><td style="padding:6px 0"><a href="${url}" style="color:#1f3fd6;font-weight:600;font-size:14px">Copy ${i + 1} →</a></td></tr>`
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
          <a href="https://t.me/+2eV0YCTGdNcyNmFl" style="color:#0088cc;font-size:13px;font-weight:700;text-decoration:none">
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
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Your Download is Being Scanned</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 8px;line-height:1.6">Thanks for requesting <strong>${topperName}</strong>'s answer copy.</p>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6">We're digitizing the original answer sheet right now and will email the link within 24–48 hours.</p>
        <div style="text-align:center;margin-bottom:24px;padding:20px;background:#eef1fd;border-radius:16px">
          <p style="margin:0 0 4px;font-size:14px;font-weight:800;color:#172fa3">Want to compare ${topperName} with other toppers while you wait?</p>
          <p style="margin:0 0 14px;font-size:13px;color:#172fa3">The compilation has 63 booklets from 27 toppers, GS1–4 and Essay. ₹199, one time.</p>
          <a href="https://upscprepnotes.in/store/answer-copies-compilation?utm_source=email&utm_medium=transactional&utm_campaign=free-copy-pending" style="display:inline-block;background:#1f3fd6;color:#fff;padding:13px 30px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">See the compilation, ₹199 →</a>
        </div>
        <p style="color:#999;font-size:11px;text-align:center;margin:0 0 20px">Instant email delivery · 7-day refund · No subscription</p>
        <div style="text-align:center;margin-bottom:28px;padding:12px;background:#e8f4fd;border-radius:40px">
          <a href="https://t.me/+2eV0YCTGdNcyNmFl" style="color:#0088cc;font-size:13px;font-weight:700;text-decoration:none">
            📬 Join 100+ aspirants on Telegram for daily current affairs →
          </a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;margin:0">— UPSCPrepNotes Team</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Your ${topperName} Answer Copy — On Its Way`,
    html,
  });
}

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;

  try {
    const body = await request.json();
    const { email, topperSlug, name, source, sourceUrl } = body;
    const profile = sanitizeProfile(body.profile);

    if (!topperSlug) {
      return NextResponse.json(
        { error: "Topper slug is required." },
        { status: 400 }
      );
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (source === "free_page") {
      if (!profile.phone) return NextResponse.json({ error: "Please enter a valid 10-digit WhatsApp number." }, { status: 400 });
      const required = ["stage", "attempt", "mode", "working", "optional"] as const;
      if (required.some((k) => !profile[k])) return NextResponse.json({ error: "Please answer every question to get the copy." }, { status: 400 });
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
      profile,
      ...geoFrom(request.headers),
    });

    await NurtureCampaignModel.updateOne(
      { email: email.toLowerCase() },
      {
        $setOnInsert: {
          email: email.toLowerCase(),
          topperName,
          topperSlug,
          step: 0,
          nextScheduledAt: new Date(Date.now() + FIRST_EMAIL_DELAY_DAYS * 86400000),
          sentAt: [],
          completed: false,
        },
      },
      { upsert: true }
    );

    // The waiting page delivers the file itself, so a failed email must not block the download.
    try {
      if (available) {
        await sendAvailableEmail(email, topperName, pdfUrls);
      } else {
        await sendUnavailableEmail(email, topperName);
      }
    } catch (mailErr) {
      console.error("Free download email failed:", mailErr);
    }

    const redirect = await createHandoff({
      kind: "answer-copy",
      title: `${topperName}'s answer copy`,
      files: pdfUrls.map((url, i) => ({ name: pdfUrls.length > 1 ? `Download copy ${i + 1}` : `${topperName}'s answer copy`, url })),
      pending: !available,
      email,
      returnTo: sourceUrl,
    });

    return NextResponse.json(
      {
        success: true,
        redirect,
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
