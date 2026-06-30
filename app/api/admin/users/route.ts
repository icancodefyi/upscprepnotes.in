import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { CustomerModel } from "@/models/customer.model";
import { OrderModel } from "@/models/order.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { FeedbackModel } from "@/models/feedback.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const source = searchParams.get("source") || "";
    const sort = searchParams.get("sort") || "recent";
    const skip = (page - 1) * limit;

    await connectDB();

    const [freeDownloads, freeGuides, freeMaterials, copyRequests, customers, orders, subscribers, feedbacks, nurtureCampaigns] = await Promise.all([
      FreeDownloadLeadModel.find().sort({ createdAt: -1 }).lean(),
      FreeGuideLeadModel.find().sort({ createdAt: -1 }).lean(),
      FreeMaterialLeadModel.find().sort({ createdAt: -1 }).lean(),
      CopyRequestModel.find().sort({ createdAt: -1 }).lean(),
      CustomerModel.find().sort({ createdAt: -1 }).lean(),
      OrderModel.find().sort({ createdAt: -1 }).lean(),
      SubscriberEmailModel.find().sort({ createdAt: -1 }).lean(),
      FeedbackModel.find().sort({ createdAt: -1 }).lean(),
      NurtureCampaignModel.find().sort({ createdAt: -1 }).lean(),
    ]);

    const userMap = new Map<string, {
      name: string;
      email: string;
      firstSeen: string;
      lastSeen: string;
      sources: Set<string>;
      downloads: number;
      feedbacks: number;
      orders: number;
      nurtureStep: number;
      tags: string[];
      toppers: string[];
      events: number;
    }>();

    function add(email: string, sourceKey: string, date: Date | string, name = "", extra?: Record<string, any>) {
      if (!email || email === "unknown@checkout") return;
      const key = email.toLowerCase();
      if (!userMap.has(key)) {
        userMap.set(key, {
          name: "",
          email: key,
          firstSeen: new Date(date).toISOString(),
          lastSeen: new Date(date).toISOString(),
          sources: new Set(),
          downloads: 0,
          feedbacks: 0,
          orders: 0,
          nurtureStep: 0,
          tags: [],
          toppers: [],
          events: 0,
        });
      }
      const u = userMap.get(key)!;
      if (name && !u.name) u.name = name;
      const d = new Date(date).getTime();
      if (d < new Date(u.firstSeen).getTime()) u.firstSeen = new Date(date).toISOString();
      if (d > new Date(u.lastSeen).getTime()) u.lastSeen = new Date(date).toISOString();
      u.sources.add(sourceKey);
      if (sourceKey === "free_download" || sourceKey === "free_material") u.downloads++;
      if (sourceKey === "feedback") u.feedbacks++;
      if (sourceKey === "order") u.orders++;
      if (extra?.topperName && !u.toppers.includes(extra.topperName)) u.toppers.push(extra.topperName);
      if (extra?.nurtureStep !== undefined) u.nurtureStep = Math.max(u.nurtureStep, extra.nurtureStep);
    }

    freeDownloads.forEach((l: any) => add(l.email, "free_download", l.createdAt, l.name, { topperName: l.topperName }));
    freeGuides.forEach((l: any) => add(l.email, "free_guide", l.createdAt, l.name));
    freeMaterials.forEach((l: any) => add(l.email, "free_material", l.createdAt, "", { topperName: l.pdfTitle }));
    copyRequests.forEach((l: any) => add(l.email, "copy_request", l.createdAt, "", { topperName: l.topperName }));
    customers.forEach((l: any) => add(l.email, "customer", l.createdAt, l.name));
    orders.forEach((l: any) => add(l.email, "order", l.createdAt));
    subscribers.forEach((l: any) => add(l.email, "subscriber", l.createdAt));
    feedbacks.forEach((l: any) => add(l.email, "feedback", l.createdAt, l.name));
    nurtureCampaigns.forEach((l: any) => add(l.email, "nurture", l.createdAt, "", { nurtureStep: l.step }));

    let users = Array.from(userMap.values());

    users.forEach(u => {
      if (u.orders > 0) u.tags.push("paid");
      if (u.nurtureStep >= 4) u.tags.push("nurture_completed");
      if (u.sources.has("free_download") || u.sources.has("free_guide") || u.sources.has("free_material")) u.tags.push("lead");
      if (u.feedbacks > 0) u.tags.push("feedback");
    });

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        u.email.includes(q) || u.name.toLowerCase().includes(q) || u.toppers.some(t => t.toLowerCase().includes(q))
      );
    }

    if (source) {
      users = users.filter(u => u.sources.has(source));
    }

    if (sort === "recent") {
      users.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
    } else if (sort === "downloads") {
      users.sort((a, b) => b.downloads - a.downloads);
    } else if (sort === "orders") {
      users.sort((a, b) => b.orders - a.orders);
    }

    const total = users.length;
    const paginated = users.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users: paginated.map(u => ({
        ...u,
        sources: Array.from(u.sources),
      })),
    });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
