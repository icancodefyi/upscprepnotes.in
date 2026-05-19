import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { verifyAdminToken } from "@/lib/admin-auth";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return false;
  }
  return true;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await authenticate(_request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const topper = await TopperModel.findById(id).lean();

    if (!topper) {
      return NextResponse.json(
        { error: "Topper not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...topper,
      _id: topper._id.toString(),
      createdAt: topper.createdAt?.toISOString(),
      updatedAt: topper.updatedAt?.toISOString(),
    });
  } catch (err) {
    console.error("Admin get topper error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const topper = await TopperModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!topper) {
      return NextResponse.json(
        { error: "Topper not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: topper._id.toString(),
    });
  } catch (err: unknown) {
    console.error("Admin update topper error:", err);
    if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: "A topper with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const topper = await TopperModel.findByIdAndDelete(id).lean();

    if (!topper) {
      return NextResponse.json(
        { error: "Topper not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin delete topper error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
