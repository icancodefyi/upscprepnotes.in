import { isAdminRequest } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { loadUsers } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "20", 10)));
    const search = (searchParams.get("search") || "").toLowerCase();
    const source = searchParams.get("source") || "";
    const sort = searchParams.get("sort") || "recent";
    const skip = (page - 1) * limit;

    let users = await loadUsers();

    if (search) users = users.filter((u) => u.search.includes(search));
    if (source) users = users.filter((u) => u.sources.includes(source));

    if (sort === "recent") users = [...users].sort((a, b) => b.lastSeenMs - a.lastSeenMs);
    else if (sort === "downloads") users = [...users].sort((a, b) => b.downloads - a.downloads);
    else if (sort === "orders") users = [...users].sort((a, b) => b.orders - a.orders);

    const total = users.length;
    return NextResponse.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users: users.slice(skip, skip + limit).map(({ lastSeenMs, search: _s, ...u }) => u),
    });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
