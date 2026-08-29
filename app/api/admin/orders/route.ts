import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { verifyAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return false;
  }
  return true;
}

function serializeOrder(o: { _id: { toString(): string }; ref?: string; email?: string; items?: unknown; total?: number; offeredPrice?: number | null; status?: string; dodoSessionId?: string | null; dodoPaymentId?: string | null; createdAt?: Date | string | null }) {
  return {
    id: o._id.toString(),
    ref: o.ref,
    email: o.email,
    items: o.items,
    total: o.total,
    offeredPrice: o.offeredPrice ?? null,
    status: o.status,
    dodoSessionId: o.dodoSessionId ?? null,
    dodoPaymentId: o.dodoPaymentId ?? null,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
  };
}

export async function GET(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const q = searchParams.get("q") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));

    const filter: Record<string, unknown> = {};
    if (status && ["pending", "paid", "delivered"].includes(status)) {
      filter.status = status;
    }
    if (q) {
      filter.$or = [
        { email: { $regex: q, $options: "i" } },
        { ref: { $regex: q, $options: "i" } },
        { dodoPaymentId: { $regex: q, $options: "i" } },
      ];
    }

    const [allOrders, filteredCount, filteredOrders] = await Promise.all([
      OrderModel.find().lean(),
      OrderModel.countDocuments(filter),
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const totalOrders = allOrders.length;
    const byStatus = allOrders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const paidOrders = allOrders.filter((o) => o.status === "paid");
    const paidRevenue = paidOrders.reduce((s, o) => s + (o.total || 0), 0);
    const offeredRevenue = paidOrders.reduce((s, o) => s + (o.offeredPrice || o.total || 0), 0);

    const itemBreakdown = allOrders
      .flatMap((o) =>
        ((o.items as { slug?: string; title?: string; quantity?: number }[]) || [])
          .map((i) => ({ slug: i.slug || "", title: i.title || i.slug || "", quantity: i.quantity || 1 }))
      )
      .reduce<Record<string, { title: string; qty: number }>>((acc, i) => {
        if (!acc[i.slug]) acc[i.slug] = { title: i.title, qty: 0 };
        acc[i.slug].qty += i.quantity || 1;
        return acc;
      }, {});

    const topEmails = allOrders
      .filter((o) => o.status === "paid")
      .reduce<Record<string, { email: string; orders: number; revenue: number }>>((acc, o) => {
        const k = (o.email || "unknown").toLowerCase();
        if (!acc[k]) acc[k] = { email: o.email, orders: 0, revenue: 0 };
        acc[k].orders += 1;
        acc[k].revenue += o.total || 0;
        return acc;
      }, {});

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        byStatus: { pending: byStatus.pending || 0, paid: byStatus.paid || 0, delivered: byStatus.delivered || 0 },
        paidRevenue,
        offeredRevenue,
        grossRevenue: allOrders.reduce((s, o) => s + (o.total || 0), 0),
        conversionRate: totalOrders ? Math.round((byStatus.paid / totalOrders) * 1000) / 10 : 0,
        pendingValue: allOrders
          .filter((o) => o.status === "pending")
          .reduce((s, o) => s + (o.total || 0), 0),
      },
      itemBreakdown: Object.entries(itemBreakdown).map(([slug, v]) => ({ slug, title: v.title, qty: v.qty })),
      topEmails: Object.values(topEmails).sort((a, b) => b.revenue - a.revenue),
      page,
      totalPages: Math.ceil(filteredCount / limit),
      count: filteredOrders.length,
      orders: filteredOrders.map(serializeOrder),
    });
  } catch (err) {
    console.error("Admin orders error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { emails, ids } = await request.json();

    const orClauses: Record<string, unknown>[] = [];
    if (Array.isArray(emails) && emails.length) {
      for (const e of emails) {
        orClauses.push({ email: { $regex: `^${e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } });
      }
    }
    if (Array.isArray(ids) && ids.length) {
      const validIds = ids.filter((id: string) => Types.ObjectId.isValid(id)).map((id: string) => new Types.ObjectId(id));
      if (validIds.length) orClauses.push({ _id: { $in: validIds } });
    }

    if (!orClauses.length) {
      return NextResponse.json({ success: false, error: "Provide emails or ids to delete" }, { status: 400 });
    }

    const result = await OrderModel.deleteMany({ $or: orClauses });
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Admin orders delete error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete orders" }, { status: 500 });
  }
}
