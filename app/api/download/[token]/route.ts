import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { PendingPurchaseModel } from "@/models/pending-purchase.model";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend";

const VPS_URL = process.env.VPS_URL || "https://cdn.upscprepnotes.in";

const ZIP_NAMES: Record<string, string> = {
  "answer-copies-compilation": "Answer-Copies-Compilation.zip",
  "top-10-rankers-strategy": "Top-10-Rankers-Strategy.zip",
  "government-schemes-compilation": "Government-Schemes-Compilation.zip",
  "anthropology-bundle": "Anthropology-Bundle.zip",
  "complete-gs-notes-bundle": "Complete-GS-Notes-Bundle.zip",
  "all-strategy-reports": "All-Strategy-Reports.zip",
  "vision-ias-mains-2026-test-series": "Vision-IAS-Mains-2026-Test-Series.zip",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;
  try {
    const { token } = await params;

    await connectDB();
    const order = await OrderModel.findOne({ downloadToken: token, status: "paid" });

    if (!order) {
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 });
    }

    const single = request.nextUrl.searchParams.get("slug");
    const targetSlug = single || order.items?.[0]?.slug;

    if (!targetSlug || !ZIP_NAMES[targetSlug]) {
      return NextResponse.json({ error: "Product file not found" }, { status: 404 });
    }

    const zipName = ZIP_NAMES[targetSlug];
    const zipUrl = `${VPS_URL}/${zipName}`;

    // Check if the file actually exists on VPS before redirecting
    try {
      const headRes = await fetch(zipUrl, { method: "HEAD", signal: AbortSignal.timeout(5000) });
      if (headRes.ok) {
        return NextResponse.redirect(zipUrl, 302);
      }
    } catch {
      // File doesn't exist on VPS yet — fall through to pending flow
    }

    // File not ready — save to pending purchases + email admin
    const productTitle = order.items?.find((i: any) => i.slug === targetSlug)?.title || targetSlug;

    // Save pending purchase (upsert — don't duplicate)
    await PendingPurchaseModel.findOneAndUpdate(
      { orderId: order._id.toString(), slug: targetSlug },
      {
        email: order.email,
        orderId: order._id.toString(),
        slug: targetSlug,
        title: productTitle,
        total: order.total,
        downloadToken: token,
      },
      { upsert: true, new: true }
    );

    // Email impic.tech@gmail.com
    sendEmail({
      to: "impic.tech@gmail.com",
      subject: `URGENT: Prepare download — ${productTitle} for ${order.email}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:sans-serif;padding:24px;background:#f9f9f9">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border-top:4px solid #dc2626">
            <h2 style="margin:0 0 8px;color:#dc2626">New Pending Download</h2>
            <p style="margin:0 0 24px;color:#666">A customer paid but the zip file is not on the VPS yet.</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#888;width:120px">Product</td><td style="padding:8px 0;font-weight:600">${productTitle}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Slug</td><td style="padding:8px 0;font-family:monospace;font-size:13px">${targetSlug}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Customer</td><td style="padding:8px 0">${order.email}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Amount</td><td style="padding:8px 0;font-weight:600">₹${order.total}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Order ID</td><td style="padding:8px 0;font-family:monospace;font-size:13px">${order._id}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Expected zip</td><td style="padding:8px 0;font-family:monospace;font-size:13px">${VPS_URL}/${zipName}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
            <p style="color:#999;font-size:12px;margin:0">Upload the zip to the VPS URL above. Once uploaded, the customer's download link will work automatically.</p>
          </div>
        </body>
        </html>
      `,
    }).catch((err) => console.error("Pending purchase admin email failed:", err));

    // Redirect to preparing page
    const prepUrl = new URL("/store/download-preparing", request.url);
    prepUrl.searchParams.set("token", token);
    prepUrl.searchParams.set("slug", targetSlug);
    prepUrl.searchParams.set("title", productTitle);
    return NextResponse.redirect(prepUrl, 302);
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
