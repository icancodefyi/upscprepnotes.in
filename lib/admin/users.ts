import { connectDB } from "@/lib/mongodb";
import { memo } from "@/lib/admin/memo";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { CustomerModel } from "@/models/customer.model";
import { OrderModel } from "@/models/order.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { FeedbackModel } from "@/models/feedback.model";
import { NurtureCampaignModel } from "@/models/nurture-campaign.model";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";

type Row = { email?: string; name?: string; topperName?: string; pdfTitle?: string; step?: number; createdAt?: Date };

type User = {
  name: string;
  email: string;
  firstSeen: number;
  lastSeen: number;
  sources: Set<string>;
  downloads: number;
  feedbacks: number;
  orders: number;
  nurtureStep: number;
  toppers: string[];
};

/**
 * Builds the whole people list once. Only the few fields needed are read (not full documents),
 * and the result is cached, so paging, searching and sorting afterwards cost nothing.
 */
async function _loadUsers() {
  await connectDB();
  const [freeDownloads, freeGuides, freeMaterials, copyRequests, customers, orders, subscribers, feedbacks, nurture] = await Promise.all([
    FreeDownloadLeadModel.find({}, { email: 1, name: 1, topperName: 1, createdAt: 1 }).lean(),
    FreeGuideLeadModel.find({}, { email: 1, name: 1, createdAt: 1 }).lean(),
    FreeMaterialLeadModel.find({}, { email: 1, pdfTitle: 1, createdAt: 1 }).lean(),
    CopyRequestModel.find({}, { email: 1, topperName: 1, createdAt: 1 }).lean(),
    CustomerModel.find({}, { email: 1, name: 1, createdAt: 1 }).lean(),
    OrderModel.find({}, { email: 1, createdAt: 1 }).lean(),
    SubscriberEmailModel.find({}, { email: 1, createdAt: 1 }).lean(),
    FeedbackModel.find({}, { email: 1, name: 1, createdAt: 1 }).lean(),
    NurtureCampaignModel.find({}, { email: 1, step: 1, createdAt: 1 }).lean(),
  ]);

  const map = new Map<string, User>();
  function add(rows: unknown[], sourceKey: string, topper?: (r: Row) => string | undefined) {
    for (const r of rows as Row[]) {
      if (!r.email || r.email === "unknown@checkout" || !r.createdAt) continue;
      const key = r.email.toLowerCase();
      const t = +new Date(r.createdAt);
      let u = map.get(key);
      if (!u) {
        u = { name: "", email: key, firstSeen: t, lastSeen: t, sources: new Set(), downloads: 0, feedbacks: 0, orders: 0, nurtureStep: 0, toppers: [] };
        map.set(key, u);
      }
      if (r.name && !u.name) u.name = r.name;
      if (t < u.firstSeen) u.firstSeen = t;
      if (t > u.lastSeen) u.lastSeen = t;
      u.sources.add(sourceKey);
      if (sourceKey === "free_download" || sourceKey === "free_material") u.downloads++;
      if (sourceKey === "feedback") u.feedbacks++;
      if (sourceKey === "order") u.orders++;
      const tn = topper?.(r);
      if (tn && !u.toppers.includes(tn)) u.toppers.push(tn);
      if (sourceKey === "nurture" && r.step !== undefined) u.nurtureStep = Math.max(u.nurtureStep, r.step);
    }
  }

  add(freeDownloads, "free_download", (r) => r.topperName);
  add(freeGuides, "free_guide");
  add(freeMaterials, "free_material", (r) => r.pdfTitle);
  add(copyRequests, "copy_request", (r) => r.topperName);
  add(customers, "customer");
  add(orders, "order");
  add(subscribers, "subscriber");
  add(feedbacks, "feedback");
  add(nurture, "nurture");

  return Array.from(map.values()).map((u) => {
    const tags: string[] = [];
    if (u.orders > 0) tags.push("paid");
    if (u.nurtureStep >= NURTURE_EMAILS.length) tags.push("nurture_completed");
    if (u.sources.has("free_download") || u.sources.has("free_guide") || u.sources.has("free_material")) tags.push("lead");
    if (u.feedbacks > 0) tags.push("feedback");
    return {
      name: u.name,
      email: u.email,
      firstSeen: new Date(u.firstSeen).toISOString(),
      lastSeen: new Date(u.lastSeen).toISOString(),
      lastSeenMs: u.lastSeen,
      sources: Array.from(u.sources),
      downloads: u.downloads,
      feedbacks: u.feedbacks,
      orders: u.orders,
      nurtureStep: u.nurtureStep,
      tags,
      toppers: u.toppers,
      events: 0,
      search: `${u.email} ${u.name} ${u.toppers.join(" ")}`.toLowerCase(),
    };
  });
}

/** Everyone who left an email anywhere, cached: 5 minutes fresh, 30 minutes served stale while refreshing. */
export const loadUsers = memo("adminUsers", _loadUsers, 5 * 60_000, 30 * 60_000);
