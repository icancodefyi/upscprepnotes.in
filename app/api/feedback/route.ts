import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedbackModel } from "@/models/feedback.model";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, type, message, url } = body;

    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: "email and message are required" },
        { status: 400 }
      );
    }

    await connectDB();
    await FeedbackModel.create({ name, email, type, message, url });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback submit error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_session")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["new", "read", "responded"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    await FeedbackModel.findByIdAndUpdate(id, { status });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_session")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 50;
    const skip = (page - 1) * limit;

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (status && ["new", "read", "responded"].includes(status)) {
      filter.status = status;
    }

    const [items, total] = await Promise.all([
      FeedbackModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FeedbackModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Feedback list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
