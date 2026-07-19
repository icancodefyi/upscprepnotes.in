import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { checkRateLimit } from "@/lib/rate-limit";

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
      // File doesn't exist on VPS yet — fall through to preparing page
    }

    // File not ready yet — redirect to a "preparing" page with order details
    const prepUrl = new URL("/store/download-preparing", request.url);
    prepUrl.searchParams.set("token", token);
    prepUrl.searchParams.set("slug", targetSlug);
    prepUrl.searchParams.set("title", order.items?.find((i: any) => i.slug === targetSlug)?.title || targetSlug);
    return NextResponse.redirect(prepUrl, 302);
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
