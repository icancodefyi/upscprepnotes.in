import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/public-stats";

// Public, aggregate-only numbers for /advertise. Cached for an hour.
export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json({ success: true, stats: await getPublicStats(30) });
  } catch (err) {
    console.error("public-stats failed:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
