import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { sendEmail } from "@/lib/resend";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    const { email, pdfSlug, pdfTitle, category, downloadUrl } = await request.json();

    if (!email || !pdfSlug || !downloadUrl) {
      return NextResponse.json(
        { error: "Email, PDF slug, and download URL are required." },
        { status: 400 }
      );
    }

    await connectDB();

    await FreeMaterialLeadModel.findOneAndUpdate(
      { email: email.toLowerCase(), pdfSlug },
      { $setOnInsert: { email: email.toLowerCase(), pdfSlug, pdfTitle, category: category || "" } },
      { upsert: true, new: true }
    );

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
        <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
          <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Your Free Download is Ready!</h1>
          <p style="color:#666;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6">Here is the PDF you requested: <strong>${pdfTitle}</strong></p>
          <div style="text-align:center;margin-bottom:28px">
            <a href="${downloadUrl}" style="display:inline-block;background:#059669;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">Download ${pdfTitle} →</a>
          </div>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:20px;text-align:center">
            <p style="margin:0;font-size:13px;color:#059669;font-weight:600">🔥 Flash Sale — All Products at ₹99</p>
            <p style="margin:4px 0 0;font-size:12px;color:#666">Get every product on UPSCPrepNotes at just ₹99. Limited time offer.</p>
            <a href="https://upscprepnotes.in/store" style="display:inline-block;margin-top:8px;background:#059669;color:#fff;text-decoration:none;padding:8px 24px;border-radius:8px;font-size:12px;font-weight:700">Browse Store →</a>
          </div>
          <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">You received this because you requested a free download on UPSCPrepNotes.in</p>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: `Your Free Download — ${pdfTitle}`,
      html,
    });

    const posthog = getPostHogClient();
    posthog.identify({ distinctId: email, properties: { email } });
    posthog.capture({
      distinctId: email,
      event: "free_material_downloaded",
      properties: {
        pdf_slug: pdfSlug,
        pdf_title: pdfTitle,
        category: category || "unknown",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ success: true, existed: true }, { status: 200 });
    }
    console.error("Free material download API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
