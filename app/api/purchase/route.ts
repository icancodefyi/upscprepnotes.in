import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PurchaseModel } from "@/models/purchase.model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, package: pkg, amount } = body;

    if (!name || !email || !phone || !pkg) {
      return NextResponse.json(
        { error: "Name, email, phone, and package are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const purchase = await PurchaseModel.create({
      name,
      email,
      phone,
      package: pkg,
      amount: amount || 0,
      status: "lead",
    });

    return NextResponse.json(
      { success: true, id: purchase._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Purchase API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
