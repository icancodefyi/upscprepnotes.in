import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PYQModel } from "@/models/pyq.model";
import { verifyAdminToken } from "@/lib/admin-auth";
import groupedData from "@/data/upsc/pyq/cse-pyq-grouped.json";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return false;
  }
  return true;
}

async function seedFromJSON() {
  const count = await PYQModel.countDocuments();
  if (count > 0) return false;

  const docs: { year: number; category: string; title: string; url: string }[] = [];

  for (const [yearStr, categories] of Object.entries(groupedData)) {
    const year = Number(yearStr);
    for (const [category, papers] of Object.entries(categories)) {
      for (const paper of papers) {
        docs.push({
          year,
          category,
          title: paper.title,
          url: paper.url || "",
        });
      }
    }
  }

  if (docs.length > 0) {
    await PYQModel.insertMany(docs, { ordered: false });
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
    const year = searchParams.get("year");

    let papers = await PYQModel.find({})
      .sort({ year: -1, category: 1, title: 1 })
      .lean();

    if (papers.length === 0) {
      await seedFromJSON();
      papers = await PYQModel.find({})
        .sort({ year: -1, category: 1, title: 1 })
        .lean();
    }

    let filtered = papers;
    if (year) {
      filtered = papers.filter((p) => p.year === Number(year));
    }

    const serialized = filtered.map((p) => ({
      _id: p._id.toString(),
      year: p.year,
      category: p.category,
      title: p.title,
      url: p.url,
    }));

    return NextResponse.json({ papers: serialized });
  } catch (err) {
    console.error("Admin PYQ list error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: "No updates provided." },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    for (const item of updates) {
      if (item._id) {
        const result = await PYQModel.findByIdAndUpdate(item._id, {
          url: item.url,
        });
        if (result) updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
    });
  } catch (err) {
    console.error("Admin PYQ update error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
