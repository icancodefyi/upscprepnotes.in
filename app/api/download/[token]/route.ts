import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";

const VPS_URL = process.env.VPS_URL || "https://cdn.upscprepnotes.in";

const ZIP_NAMES: Record<string, string> = {
  "gs1-notes-bundle": "GS1-Notes-Bundle.zip",
  "gs2-notes-bundle": "GS2-Notes-Bundle.zip",
  "gs3-notes-bundle": "GS3-Notes-Bundle.zip",
  "ethics-gs4-bundle": "Ethics-GS4-Bundle.zip",
  "prelims-prep-pack": "Prelims-Prep-Pack.zip",
  "polity-foundation": "Polity-Foundation.zip",
  "history-pack": "History-Pack.zip",
  "air-10-mains-notes": "AIR-10-Mains-Notes.zip",
  "abhijit-ray-prelims-bundle": "Abhijit-Ray-Prelims-Bundle.zip",
  "environment-short-notes": "Environment-Short-Notes.zip",
  "mrunal-economy-complete": "Mrunal-Economy.zip",
  "satyam-gandhi-mains-complete": "Satyam-Gandhi-Mains.zip",
  "asad-zuberi-air86-complete": "Asad-Zuberi-AIR86-Complete.zip",
  "madhav-air16-complete": "Madhav-AIR16-Complete.zip",
  "prahaar-complete": "PRAHAAR-Complete.zip",
  "antriksh-gs-notes": "Antriksh-GS-Notes.zip",
  "dr-shivin-geography": "Dr-Shivin-Geography.zip",
  "anthropology-bundle": "Anthropology-Bundle.zip",
  "geography-bundle": "Geography-Bundle.zip",
  "vp-2026-test-series": "VP-2026-Test-Series.zip",
  "visionias-test-series": "VisionIAS-Test-Series.zip",
  "only-ias-test-series": "Only-IAS-Test-Series.zip",
  "csk-csat-complete": "CSK-CSAT-Micro-Tests.zip",
  "ias-baba-test-series": "IAS-BABA-Test-Series.zip",
  "dhyeya-ias-prelims-tests": "Dhyeya-IAS-Prelims-Tests.zip",
  "ipm-prelims-test-series": "IPM-Prelims-Test-Series.zip",
  "answer-copies-compilation": "Answer-Copies-Compilation.zip",
  "top-10-rankers-strategy": "Top-10-Rankers-Strategy.zip",
  "government-schemes-compilation": "Government-Schemes-Compilation.zip",
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
