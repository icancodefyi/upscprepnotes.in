import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { verifyAdminToken } from "@/lib/admin-auth";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const emails = await SubscriberEmailModel.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(emails);
  } catch (err) {
    console.error("Error fetching notification emails:", err);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await SubscriberEmailModel.findOne({
      email: email.toLowerCase(),
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already subscribed." },
        { status: 409 }
      );
    }

    const doc = await SubscriberEmailModel.create({
      email: email.toLowerCase(),
    });

    return NextResponse.json(
      { success: true, id: doc._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding notification email:", err);
    return NextResponse.json(
      { error: "Failed to add email" },
      { status: 500 }
    );
  }
}
