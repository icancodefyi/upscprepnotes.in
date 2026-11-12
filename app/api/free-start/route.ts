import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { TopperModel } from "@/models/topper.model";
import { EMAIL_RE } from "@/lib/handoff";

/**
 * Saves the email as soon as someone types a valid one into a request form, so people who leave
 * on the last screen still leave a lead. The full answers arrive later through the normal request.
 */
export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    await connectDB();
    if (body.target === "copy") {
      const topperSlug = String(body.topperSlug ?? "").slice(0, 120);
      const topper = await TopperModel.findOne({ slug: topperSlug }, { firstName: 1, lastName: 1 }).lean();
      if (!topper) return NextResponse.json({ error: "Topper not found." }, { status: 404 });
      await FreeDownloadLeadModel.findOneAndUpdate(
        { email, topperSlug },
        { $setOnInsert: { email, topperSlug, topperName: `${topper.firstName} ${topper.lastName}`, source: "free_page_started", available: false } },
        { upsert: true }
      );
    } else if (body.target === "material") {
      const pdfSlug = String(body.pdfSlug ?? "").slice(0, 200);
      const pdfTitle = String(body.pdfTitle ?? "Free material").slice(0, 200);
      if (!pdfSlug) return NextResponse.json({ error: "Missing item." }, { status: 400 });
      await FreeMaterialLeadModel.findOneAndUpdate(
        { email, pdfSlug },
        { $setOnInsert: { email, pdfSlug, pdfTitle, category: String(body.category ?? "").slice(0, 80) } },
        { upsert: true }
      );
    } else {
      return NextResponse.json({ error: "Unknown request." }, { status: 400 });
    }
    return NextResponse.json({ saved: true }, { status: 201 });
  } catch (err) {
    console.error("Free start error:", err);
    return NextResponse.json({ error: "Could not save right now." }, { status: 500 });
  }
}
