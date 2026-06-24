import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";

const VPS_URL = process.env.VPS_URL || "https://cdn.upscprepnotes.in";

const ZIP_NAMES: Record<string, string> = {
  "answer-copies-compilation": "Answer-Copies-Compilation.zip",
  "top-10-rankers-strategy": "Top-10-Rankers-Strategy.zip",
  "government-schemes-compilation": "Government-Schemes-Compilation.zip",
  "anthropology-bundle": "Anthropology-Bundle.zip",
  "complete-gs-notes-bundle": "Complete-GS-Notes-Bundle.zip",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
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

    return NextResponse.redirect(`${VPS_URL}/${ZIP_NAMES[targetSlug]}`, 302);
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
