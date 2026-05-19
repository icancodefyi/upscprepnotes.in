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

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query: Record<string, unknown> = {};

    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const toppers = await TopperModel.find(query)
      .sort({ year: -1, rank: 1 })
      .lean();

    const serialized = toppers.map((t) => ({
      ...t,
      _id: t._id.toString(),
      createdAt: t.createdAt?.toISOString(),
      updatedAt: t.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ toppers: serialized });
  } catch (err) {
    console.error("Admin toppers list error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
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
    await connectDB();

    if (!body.slug && body.firstName) {
      body.slug = `${body.firstName}-${body.lastName || ""}-${body.rank || 0}-${body.year || new Date().getFullYear()}`
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    const topper = await TopperModel.create(body);

    return NextResponse.json(
      { success: true, id: topper._id.toString() },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Admin create topper error:", err);
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
