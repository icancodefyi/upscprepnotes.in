import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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
        { success: true, message: "Already subscribed." },
        { status: 200 }
      );
    }

    await SubscriberEmailModel.create({
      email: email.toLowerCase(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Store subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
