import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { TrackingEventModel } from "@/models/tracking.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { AskConversationModel } from "@/models/ask.model";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { FeedbackModel } from "@/models/feedback.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { PRODUCTS } from "@/lib/store-products";
import { memo } from "@/lib/admin/memo";

/** Read-only queries behind the admin dashboard and Insights pages. */

export type Range = 7 | 30 | 90;
export const parseRange = (v?: string): Range => (v === "7" ? 7 : v === "90" ? 90 : 30);

const DAY = 864e5;
const TZ = "Asia/Kolkata";
const PAID = ["paid", "delivered"];

export function windows(range: Range) {
  const now = new Date();
  const since = new Date(now.getTime() - range * DAY);
  const prevSince = new Date(since.getTime() - range * DAY);
  return { now, since, prevSince };
}

/** Every day in the window as YYYY-MM-DD (IST), so charts have no gaps. */
export function dayKeys(range: Range) {
  const out: string[] = [];
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  for (let i = range - 1; i >= 0; i--) out.push(fmt.format(new Date(Date.now() - i * DAY)));
  return out;
}
const fill = (keys: string[], rows: { _id: string; v: number }[]) => {
  const m = new Map(rows.map((r) => [r._id, r.v]));
  return keys.map((k) => ({ day: k, value: m.get(k) ?? 0 }));
};
const dayExpr = (field: string) => ({ $dateToString: { format: "%Y-%m-%d", date: field, timezone: TZ } });

export const pct = (a: number, b: number) => {
  if (b <= 0) return 0;
  const v = (a / b) * 100;
  return v > 0 && v < 1 ? Math.round(v * 100) / 100 : Math.round(v * 10) / 10;
};
export const delta = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : cur > 0 ? null : 0);

async function hasTracking(since: Date) {
  return (await TrackingEventModel.estimatedDocumentCount()) > 0 && !!(await TrackingEventModel.exists({ ts: { $gte: since } }));
}

/* ---------------- Overview ---------------- */

async function orderStats(from: Date, to: Date) {
  const [r] = await OrderModel.aggregate<{ all: number; paid: number; revenue: number; pendingValue: number }>([
    { $match: { createdAt: { $gte: from, $lt: to } } },
    {
      $group: {
        _id: null,
        all: { $sum: 1 },
        paid: { $sum: { $cond: [{ $in: ["$status", PAID] }, 1, 0] } },
        revenue: { $sum: { $cond: [{ $in: ["$status", PAID] }, "$total", 0] } },
        pendingValue: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$total", 0] } },
      },
    },
  ]);
  return r ?? { all: 0, paid: 0, revenue: 0, pendingValue: 0 };
}

async function visitorCount(from: Date, to: Date, useTracking: boolean) {
  const model = useTracking ? TrackingEventModel : AnalyticsEventModel;
  const timeField = useTracking ? "ts" : "timestamp";
  const [r] = await (model as typeof TrackingEventModel).aggregate<{ n: number }>([
    { $match: { [timeField]: { $gte: from, $lt: to }, visitorId: { $exists: true, $nin: ["unknown", "server", null] } } },
    { $group: { _id: "$visitorId" } },
    { $count: "n" },
  ]);
  return r?.n ?? 0;
}

async function leadCount(from: Date, to: Date) {
  const m = { createdAt: { $gte: from, $lt: to } };
  const [dl, guide, mat, sub] = await Promise.all([
    FreeDownloadLeadModel.countDocuments(m),
    FreeGuideLeadModel.countDocuments(m),
    FreeMaterialLeadModel.countDocuments(m),
    SubscriberEmailModel.countDocuments(m),
  ]);
  return { total: dl + guide + mat + sub, bySource: [
    { label: "Free answer copy", value: dl },
    { label: "Free guide", value: guide },
    { label: "Free material", value: mat },
    { label: "Newsletter / store", value: sub },
  ] };
}

async function _getOverview(range: Range) {
  await connectDB();
  const { now, since, prevSince } = windows(range);
  const useTracking = await hasTracking(since);
  const keys = dayKeys(range);
  const vModel = (useTracking ? TrackingEventModel : AnalyticsEventModel) as typeof TrackingEventModel;
  const vTime = useTracking ? "$ts" : "$timestamp";

  const [cur, prev, vCur, vPrev, leads, leadsPrev, revenueDaily, visitorsDaily, recent, abandoned, topProducts, aiConvs, aiQs, newFeedback, copyReqs] =
    await Promise.all([
      orderStats(since, now),
      orderStats(prevSince, since),
      visitorCount(since, now, useTracking),
      visitorCount(prevSince, since, useTracking),
      leadCount(since, now),
      leadCount(prevSince, since),
      OrderModel.aggregate<{ _id: string; v: number }>([
        { $match: { createdAt: { $gte: since }, status: { $in: PAID } } },
        { $group: { _id: dayExpr("$createdAt"), v: { $sum: "$total" } } },
      ]),
      vModel.aggregate<{ _id: string; v: number }>([
        { $match: { [useTracking ? "ts" : "timestamp"]: { $gte: since }, visitorId: { $exists: true, $nin: ["unknown", "server", null] } } },
        { $group: { _id: { d: dayExpr(vTime), v: "$visitorId" } } },
        { $group: { _id: "$_id.d", v: { $sum: 1 } } },
      ]),
      OrderModel.find({}, { email: 1, items: 1, total: 1, status: 1, createdAt: 1, ref: 1 }).sort({ createdAt: -1 }).limit(8).lean(),
      OrderModel.find(
        { status: "pending", email: { $nin: [null, ""] }, createdAt: { $gte: since, $lt: new Date(now.getTime() - 3600e3) } },
        { email: 1, items: 1, total: 1, createdAt: 1 },
      ).sort({ createdAt: -1 }).limit(10).lean(),
      OrderModel.aggregate<{ _id: string; title: string; qty: number; revenue: number }>([
        { $match: { createdAt: { $gte: since }, status: { $in: PAID } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.slug", title: { $first: "$items.title" }, qty: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
        { $sort: { revenue: -1 } },
        { $limit: 6 },
      ]),
      AskConversationModel.countDocuments({ createdAt: { $gte: since } }),
      AskConversationModel.aggregate<{ n: number }>([
        { $match: { updatedAt: { $gte: since } } },
        { $unwind: "$messages" },
        { $match: { "messages.role": "user" } },
        { $count: "n" },
      ]).then((r) => r[0]?.n ?? 0),
      FeedbackModel.countDocuments({ status: "new" }),
      CopyRequestModel.countDocuments({ createdAt: { $gte: since } }),
    ]);

  return {
    range,
    visitorSource: useTracking ? "tracking" : "old analytics",
    revenue: { cur: cur.revenue, prev: prev.revenue },
    orders: { cur: cur.paid, prev: prev.paid },
    checkouts: { cur: cur.all, prev: prev.all },
    aov: { cur: cur.paid ? Math.round(cur.revenue / cur.paid) : 0, prev: prev.paid ? Math.round(prev.revenue / prev.paid) : 0 },
    checkoutConversion: { cur: pct(cur.paid, cur.all), prev: pct(prev.paid, prev.all) },
    visitors: { cur: vCur, prev: vPrev },
    buyerConversion: { cur: pct(cur.paid, vCur), prev: pct(prev.paid, vPrev) },
    leads: { cur: leads.total, prev: leadsPrev.total, bySource: leads.bySource },
    pendingValue: cur.pendingValue,
    revenueDaily: fill(keys, revenueDaily),
    visitorsDaily: fill(keys, visitorsDaily),
    recent,
    abandoned,
    topProducts,
    ai: { conversations: aiConvs, questions: aiQs },
    attention: { newFeedback, copyReqs, abandoned: abandoned.length },
  };
}

/* ---------------- Traffic (tracking) ---------------- */

async function _getTraffic(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const keys = dayKeys(range);
  const m = { ts: { $gte: since } };
  const pathOnly = { $arrayElemAt: [{ $split: ["$path", "?"] }, 0] };

  const [totals, daily, pages, leaves, sources, devices, countries, landings] = await Promise.all([
    TrackingEventModel.aggregate<{ events: number; visitors: number; sessions: number; views: number }>([
      { $match: m },
      { $group: { _id: null, events: { $sum: 1 }, v: { $addToSet: "$visitorId" }, s: { $addToSet: "$sessionId" }, views: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } } } },
      { $project: { events: 1, views: 1, visitors: { $size: "$v" }, sessions: { $size: "$s" } } },
    ]),
    TrackingEventModel.aggregate<{ _id: string; v: number }>([
      { $match: { ...m, event: "page_view" } },
      { $group: { _id: { d: dayExpr("$ts"), v: "$visitorId" } } },
      { $group: { _id: "$_id.d", v: { $sum: 1 } } },
    ]),
    TrackingEventModel.aggregate<{ _id: string; views: number; visitors: number }>([
      { $match: { ...m, event: "page_view" } },
      { $group: { _id: pathOnly, views: { $sum: 1 }, v: { $addToSet: "$visitorId" } } },
      { $project: { views: 1, visitors: { $size: "$v" } } },
      { $sort: { views: -1 } },
      { $limit: 25 },
    ]),
    TrackingEventModel.aggregate<{ _id: string; dur: number; scroll: number; n: number }>([
      { $match: { ...m, event: "page_leave", "props.duration_ms": { $gt: 0, $lt: 30 * 60e3 } } },
      { $group: { _id: pathOnly, dur: { $avg: "$props.duration_ms" }, scroll: { $avg: "$props.max_scroll" }, n: { $sum: 1 } } },
    ]),
    TrackingEventModel.aggregate<{ _id: string; v: number }>([
      { $match: { ...m, event: "page_view" } },
      { $sort: { ts: 1 } },
      { $group: { _id: "$sessionId", utm: { $first: "$utm" } } },
      {
        $group: {
          _id: {
            $ifNull: [
              "$utm.source",
              { $ifNull: [{ $arrayElemAt: [{ $split: [{ $arrayElemAt: [{ $split: [{ $ifNull: ["$utm.referrer", ""] }, "//"] }, 1] }, "/"] }, 0] }, "direct"] },
            ],
          },
          v: { $sum: 1 },
        },
      },
      { $sort: { v: -1 } },
      { $limit: 12 },
    ]),
    TrackingEventModel.aggregate<{ _id: string; v: number }>([
      { $match: { ...m, event: "page_view" } },
      { $group: { _id: { t: "$device.type", v: "$visitorId" } } },
      { $group: { _id: { $ifNull: ["$_id.t", "unknown"] }, v: { $sum: 1 } } },
      { $sort: { v: -1 } },
    ]),
    TrackingEventModel.aggregate<{ _id: string; v: number }>([
      { $match: { ...m, event: "page_view" } },
      { $group: { _id: { c: "$country", v: "$visitorId" } } },
      { $group: { _id: { $ifNull: ["$_id.c", "unknown"] }, v: { $sum: 1 } } },
      { $sort: { v: -1 } },
      { $limit: 10 },
    ]),
    TrackingEventModel.aggregate<{ _id: string; v: number }>([
      { $match: { ...m, event: "page_view" } },
      { $group: { _id: { $ifNull: ["$utm.landing", "unknown"] }, s: { $addToSet: "$sessionId" } } },
      { $project: { v: { $size: "$s" } } },
      { $sort: { v: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const leaveBy = new Map(leaves.map((l) => [l._id, l]));
  const t = totals[0] ?? { events: 0, visitors: 0, sessions: 0, views: 0 };
  const allLeaves = leaves.reduce((a, l) => ({ dur: a.dur + l.dur * l.n, scroll: a.scroll + l.scroll * l.n, n: a.n + l.n }), { dur: 0, scroll: 0, n: 0 });
  return {
    totals: { ...t, avgTimeMs: allLeaves.n ? allLeaves.dur / allLeaves.n : 0, avgScroll: allLeaves.n ? allLeaves.scroll / allLeaves.n : 0 },
    daily: fill(keys, daily),
    pages: pages.map((p) => ({ path: p._id || "/", views: p.views, visitors: p.visitors, avgTimeMs: leaveBy.get(p._id)?.dur ?? 0, avgScroll: leaveBy.get(p._id)?.scroll ?? 0 })),
    sources: sources.map((s) => ({ label: s._id || "direct", value: s.v })),
    devices: devices.map((d) => ({ label: d._id, value: d.v })),
    countries: countries.map((c) => ({ label: c._id, value: c.v })),
    landings: landings.map((l) => ({ label: l._id, value: l.v })),
  };
}

/* ---------------- Demand ---------------- */

const TOPICS: [string, RegExp][] = [
  ["Optional choice", /\boptional|which optional|choose.*(subject|optional)/i],
  ["PSIR", /\bpsir|political science|international relations\b/i],
  ["Sociology", /sociolog/i],
  ["Anthropology", /anthropolog/i],
  ["Geography", /geograph/i],
  ["History", /\bhistory\b/i],
  ["Public administration", /public admin|\bpub ad\b/i],
  ["Essay", /\bessay/i],
  ["GS I", /\bgs ?(1|i)\b|gs paper (1|i)\b|paper i\b/i],
  ["GS II", /\bgs ?(2|ii)\b|polity|governance|constitution/i],
  ["GS III", /\bgs ?(3|iii)\b|economy|environment|security/i],
  ["GS IV / Ethics", /\bgs ?(4|iv)\b|ethic|integrity|case stud/i],
  ["Answer writing", /answer writ|structure.*answer|how to write/i],
  ["Prelims / CSAT", /prelim|csat|mcq/i],
  ["Current affairs", /current affair|newspaper|the hindu|monthly/i],
  ["Interview", /interview|personality test|\bdaf\b/i],
  ["Strategy / timetable", /strateg|timetable|time table|plan|schedule|how many hours|first attempt|working professional/i],
  ["Books / notes", /\bbooks?\b|booklist|notes|ncert|source/i],
  ["Toppers / marks", /topper|\bair\b|rank|marks|scored|marksheet/i],
];

/** Prompts the site pre-fills from links, not typed by the user. */
const TEMPLATED = /^(tell me about .+?'?s? upsc strategy|tell me more about:|ask about:)/i;
const TOPPER_PROMPT = /^tell me about (.+?)'?s? upsc strategy/i;

async function _getDemand(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const norm = { $trim: { input: { $toLower: { $substrCP: ["$messages.content", 0, 160] } } } };

  const [topQuestions, recentQuestions, searches, clicks, copyLeads, copyRequests, materialLeads] = await Promise.all([
    AskConversationModel.aggregate<{ _id: string; n: number }>([
      { $match: { updatedAt: { $gte: since } } },
      { $unwind: "$messages" },
      { $match: { "messages.role": "user", "messages.content": { $not: TEMPLATED } } },
      { $group: { _id: norm, n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 30 },
    ]),
    AskConversationModel.aggregate<{ q: string }>([
      { $match: { updatedAt: { $gte: since } } },
      { $sort: { updatedAt: -1 } },
      { $limit: 1500 },
      { $unwind: "$messages" },
      { $match: { "messages.role": "user" } },
      { $project: { _id: 0, q: { $substrCP: ["$messages.content", 0, 300] } } },
      { $limit: 3000 },
    ]),
    TrackingEventModel.aggregate<{ _id: string; n: number; sources: string[] }>([
      { $match: { ts: { $gte: since }, event: "search", "props.query": { $type: "string" } } },
      { $group: { _id: { $trim: { input: { $toLower: "$props.query" } } }, n: { $sum: 1 }, sources: { $addToSet: "$props.source" } } },
      { $sort: { n: -1 } },
      { $limit: 30 },
    ]),
    TrackingEventModel.aggregate<{ _id: string; n: number }>([
      { $match: { ts: { $gte: since }, event: "click", "props.track": { $type: "string" } } },
      { $group: { _id: "$props.track", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 25 },
    ]),
    FreeDownloadLeadModel.aggregate<{ _id: string; n: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$topperName", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 15 },
    ]),
    CopyRequestModel.aggregate<{ _id: string; n: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$topperName", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 15 },
    ]),
    FreeMaterialLeadModel.aggregate<{ _id: string; n: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$pdfTitle", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 15 },
    ]),
  ]);

  const topicCounts = new Map<string, number>();
  const topperAsks = new Map<string, number>();
  let unmatched = 0;
  let templated = 0;
  let caLinks = 0;
  for (const { q } of recentQuestions) {
    const tp = q.match(TOPPER_PROMPT);
    if (tp) {
      const name = tp[1].trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      topperAsks.set(name, (topperAsks.get(name) ?? 0) + 1);
      templated++;
      continue;
    }
    if (TEMPLATED.test(q)) {
      caLinks++;
      templated++;
      continue;
    }
    let hit = false;
    for (const [name, re] of TOPICS) if (re.test(q)) { topicCounts.set(name, (topicCounts.get(name) ?? 0) + 1); hit = true; }
    if (!hit) unmatched++;
  }

  return {
    totalQuestions: recentQuestions.length,
    typedQuestions: recentQuestions.length - templated,
    templated,
    caLinks,
    topperAsks: [...topperAsks].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    topics: [...topicCounts].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    unmatched,
    topQuestions: topQuestions.map((q) => ({ label: q._id, value: q.n })),
    searches: searches.map((s) => ({ label: s._id, value: s.n, hint: s.sources.filter(Boolean).slice(0, 2).join(", ") })),
    clicks: clicks.map((c) => ({ label: c._id, value: c.n })),
    copyLeads: copyLeads.map((c) => ({ label: c._id, value: c.n })),
    copyRequests: copyRequests.map((c) => ({ label: c._id, value: c.n })),
    materialLeads: materialLeads.map((c) => ({ label: c._id, value: c.n })),
  };
}

/* ---------------- Funnel ---------------- */

async function _getFunnel(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const [views, clicks, orders] = await Promise.all([
    TrackingEventModel.aggregate<{ _id: string; n: number; v: string[] }>([
      { $match: { ts: { $gte: since }, event: "product_view" } },
      { $group: { _id: "$props.slug", n: { $sum: 1 }, v: { $addToSet: "$visitorId" } } },
    ]),
    TrackingEventModel.aggregate<{ _id: string; n: number }>([
      { $match: { ts: { $gte: since }, event: "buy_click" } },
      { $unwind: "$props.items" },
      { $group: { _id: "$props.items", n: { $sum: 1 } } },
    ]),
    OrderModel.aggregate<{ _id: string; checkouts: number; paid: number; revenue: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.slug",
          checkouts: { $sum: 1 },
          paid: { $sum: { $cond: [{ $in: ["$status", PAID] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $in: ["$status", PAID] }, { $multiply: ["$items.price", "$items.quantity"] }, 0] } },
        },
      },
    ]),
  ]);
  const vm = new Map(views.map((v) => [v._id, v]));
  const cm = new Map(clicks.map((c) => [c._id, c.n]));
  const om = new Map(orders.map((o) => [o._id, o]));
  const slugs = new Set([...PRODUCTS.filter((p) => !p.comingSoon).map((p) => p.slug), ...om.keys()]);
  const rows = [...slugs].map((slug) => {
    const p = PRODUCTS.find((x) => x.slug === slug);
    const v = vm.get(slug);
    const o = om.get(slug);
    return {
      slug,
      title: p?.title ?? slug,
      price: p?.price ?? 0,
      views: v?.n ?? 0,
      viewers: v?.v.length ?? 0,
      buyClicks: cm.get(slug) ?? 0,
      checkouts: o?.checkouts ?? 0,
      paid: o?.paid ?? 0,
      revenue: o?.revenue ?? 0,
    };
  });
  rows.sort((a, b) => b.revenue - a.revenue || b.views - a.views);
  const total = rows.reduce((a, r) => ({ views: a.views + r.views, buyClicks: a.buyClicks + r.buyClicks, checkouts: a.checkouts + r.checkouts, paid: a.paid + r.paid, revenue: a.revenue + r.revenue }), { views: 0, buyClicks: 0, checkouts: 0, paid: 0, revenue: 0 });
  return { rows, total };
}

/* ---------------- Journeys ---------------- */

export async function getJourney(q: string) {
  await connectDB();
  const query = q.trim();
  if (!query) {
    const [identified, buyers] = await Promise.all([
      TrackingEventModel.aggregate<{ _id: string; last: Date; visitorId: string; source: string }>([
        { $match: { event: "identify", email: { $type: "string" } } },
        { $sort: { ts: -1 } },
        { $group: { _id: "$email", last: { $first: "$ts" }, visitorId: { $first: "$visitorId" }, source: { $first: "$props.source" } } },
        { $sort: { last: -1 } },
        { $limit: 25 },
      ]),
      OrderModel.find({ status: { $in: PAID }, email: { $nin: [null, ""] } }, { email: 1, total: 1, createdAt: 1, items: 1 }).sort({ createdAt: -1 }).limit(15).lean(),
    ]);
    return { mode: "list" as const, identified, buyers };
  }

  const isEmail = query.includes("@");
  const email = isEmail ? query.toLowerCase() : undefined;
  const visitorIds = isEmail
    ? ((await TrackingEventModel.distinct("visitorId", { event: "identify", email })) as string[]).filter(Boolean)
    : [query];
  const [events, orders, leads] = await Promise.all([
    visitorIds.length
      ? TrackingEventModel.find({ visitorId: { $in: visitorIds } }, { event: 1, ts: 1, path: 1, props: 1, sessionId: 1, utm: 1, device: 1, country: 1, city: 1 })
          .sort({ ts: 1 })
          .limit(1500)
          .lean()
      : Promise.resolve([]),
    email ? OrderModel.find({ email }, { items: 1, total: 1, status: 1, createdAt: 1, ref: 1 }).sort({ createdAt: -1 }).lean() : Promise.resolve([]),
    email
      ? Promise.all([
          FreeDownloadLeadModel.find({ email }, { topperName: 1, createdAt: 1 }).lean(),
          FreeMaterialLeadModel.find({ email }, { pdfTitle: 1, createdAt: 1 }).lean(),
          FreeGuideLeadModel.find({ email }, { createdAt: 1 }).lean(),
          SubscriberEmailModel.find({ email }, { createdAt: 1 }).lean(),
        ])
      : Promise.resolve([[], [], [], []]),
  ]);
  const [dl, mat, guide, sub] = leads as [{ topperName?: string; createdAt?: Date }[], { pdfTitle?: string; createdAt?: Date }[], { createdAt?: Date }[], { createdAt?: Date }[]];
  return {
    mode: "detail" as const,
    query,
    email,
    visitorIds,
    events,
    orders,
    leads: [
      ...dl.map((l) => ({ what: `Free copy: ${l.topperName ?? ""}`, at: l.createdAt })),
      ...mat.map((l) => ({ what: `Free material: ${l.pdfTitle ?? ""}`, at: l.createdAt })),
      ...guide.map((l) => ({ what: "Free guide", at: l.createdAt })),
      ...sub.map((l) => ({ what: "Subscribed", at: l.createdAt })),
    ],
  };
}

/* ---------------- Live ---------------- */

export async function getLive(limit = 100) {
  await connectDB();
  const [events, lastHour] = await Promise.all([
    TrackingEventModel.find({}, { event: 1, ts: 1, path: 1, props: 1, visitorId: 1, email: 1, device: 1, country: 1, city: 1, source: 1 }).sort({ ts: -1 }).limit(limit).lean(),
    TrackingEventModel.aggregate<{ n: number }>([
      { $match: { ts: { $gte: new Date(Date.now() - 3600e3) } } },
      { $group: { _id: "$visitorId" } },
      { $count: "n" },
    ]).then((r) => r[0]?.n ?? 0),
  ]);
  return { events, activeLastHour: lastHour };
}

/* =====================================================================
   Growth analytics: audience & retention, time, acquisition, buyers,
   leads, AI mentor, tech. Retention uses the long page-view history in
   `analyticsevents` (same `_vid` cookie), so it works before the new
   tracking has history.
   ===================================================================== */

const IST_MS = 330 * 60e3;
const istDay = (d: Date | number) => new Date(new Date(d).getTime() + IST_MS).toISOString().slice(0, 10);
const dayNum = (key: string) => Math.floor(Date.parse(key + "T00:00:00Z") / DAY);
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const percentile = (xs: number[], p: number) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const REAL_VISITOR = { $exists: true, $nin: ["unknown", "server", null] };

/* ---------------- Audience & retention ---------------- */

/** One document per (visitor, IST day) with page-view and session counts. The base of every audience query. */
const visitorDays = () => [
  { $match: { event: "page_view", visitorId: REAL_VISITOR } },
  { $group: { _id: { v: "$visitorId", d: dayExpr("$timestamp") }, n: { $sum: 1 }, s: { $addToSet: "$sessionId" } } },
  { $project: { n: 1, s: { $size: "$s" } } },
];

async function _getAudience(range: Range) {
  await connectDB();
  const todayN = dayNum(istDay(Date.now()));
  const winStart = istDay(Date.now() - (range - 1) * DAY);
  const day7 = istDay(Date.now() - 6 * DAY);
  const day30 = istDay(Date.now() - 29 * DAY);
  const keys = dayKeys(range);
  const weekStart = (n: number) => n - ((n + 3) % 7); // Monday of the week containing day number n
  const thisWeek = weekStart(todayN);
  const oldestCohort = thisWeek - 9 * 7;

  // MongoDB does the counting and returns small summaries (shipping every visitor out took ~30s).
  const perVisitor = [
    ...visitorDays(),
    { $group: { _id: "$_id.v", first: { $min: "$_id.d" }, last: { $max: "$_id.d" }, nd: { $sum: 1 }, views: { $sum: "$n" }, sessions: { $sum: "$s" }, days: { $push: "$_id.d" } } },
    { $addFields: { second: { $arrayElemAt: [{ $sortArray: { input: "$days", sortBy: 1 } }, 1] } } },
    {
      $addFields: {
        gap: {
          $cond: [
            { $gt: ["$nd", 1] },
            { $dateDiff: { startDate: { $dateFromString: { dateString: "$first" } }, endDate: { $dateFromString: { dateString: "$second" } }, unit: "day" } },
            null,
          ],
        },
      },
    },
  ];
  type Facet = {
    totals: { visitors: number; history: string; active: number; newW: number; ret: number; came: number; rep: number }[];
    daily: { _id: { d: string; n: boolean }; c: number }[];
    freq: { _id: number | string; c: number }[];
    recency: { _id: string; c: number }[];
    gaps: { _id: number; c: number }[];
    top: { _id: string; first: string; last: string; nd: number; views: number; sessions: number }[];
  };
  const [facet, cohortRows, sticky] = await Promise.all([
    AnalyticsEventModel.aggregate<Facet>(
      [
        ...perVisitor,
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  visitors: { $sum: 1 },
                  history: { $min: "$first" },
                  active: { $sum: { $cond: [{ $gte: ["$last", winStart] }, 1, 0] } },
                  newW: { $sum: { $cond: [{ $gte: ["$first", winStart] }, 1, 0] } },
                  ret: { $sum: { $cond: [{ $and: [{ $lt: ["$first", winStart] }, { $gte: ["$last", winStart] }] }, 1, 0] } },
                  came: { $sum: { $cond: [{ $and: [{ $gte: ["$first", winStart] }, { $gt: ["$nd", 1] }] }, 1, 0] } },
                  rep: { $sum: { $cond: [{ $gt: ["$nd", 1] }, 1, 0] } },
                },
              },
            ],
            daily: [{ $unwind: "$days" }, { $match: { days: { $gte: winStart } } }, { $group: { _id: { d: "$days", n: { $eq: ["$days", "$first"] } }, c: { $sum: 1 } } }],
            freq: [{ $bucket: { groupBy: "$nd", boundaries: [1, 2, 3, 6, 11, 100000], default: "other", output: { c: { $sum: 1 } } } }],
            recency: [{ $group: { _id: "$last", c: { $sum: 1 } } }],
            gaps: [{ $match: { gap: { $ne: null } } }, { $group: { _id: "$gap", c: { $sum: 1 } } }],
            top: [{ $match: { nd: { $gt: 1 } } }, { $sort: { nd: -1, views: -1 } }, { $limit: 15 }, { $project: { first: 1, last: 1, nd: 1, views: 1, sessions: 1 } }],
          },
        },
      ],
      { allowDiskUse: true },
    ),
    AnalyticsEventModel.aggregate<{ _id: { cw: Date; wk: Date }; c: number }>(
      [
        ...visitorDays(),
        { $addFields: { wd: { $dateTrunc: { date: { $dateFromString: { dateString: "$_id.d" } }, unit: "week", startOfWeek: "monday" } } } },
        { $group: { _id: "$_id.v", cw: { $min: "$wd" }, weeks: { $addToSet: "$wd" } } },
        { $match: { cw: { $gte: new Date(oldestCohort * DAY) } } },
        { $unwind: "$weeks" },
        { $group: { _id: { cw: "$cw", wk: "$weeks" }, c: { $sum: 1 } } },
      ],
      { allowDiskUse: true },
    ),
    AnalyticsEventModel.aggregate<{ dau: { _id: string; c: number }[]; wau: { c: number }[]; mau: { c: number }[] }>(
      [
        ...visitorDays(),
        {
          $facet: {
            dau: [{ $match: { "_id.d": { $gte: day30 } } }, { $group: { _id: "$_id.d", c: { $sum: 1 } } }],
            wau: [{ $match: { "_id.d": { $gte: day7 } } }, { $group: { _id: "$_id.v" } }, { $count: "c" }],
            mau: [{ $match: { "_id.d": { $gte: day30 } } }, { $group: { _id: "$_id.v" } }, { $count: "c" }],
          },
        },
      ],
      { allowDiskUse: true },
    ),
  ]);

  const f = facet[0] ?? ({ totals: [], daily: [], freq: [], recency: [], gaps: [], top: [] } as Facet);
  const t = f.totals[0] ?? { visitors: 0, history: "", active: 0, newW: 0, ret: 0, came: 0, rep: 0 };

  const daily = new Map<string, { n: number; r: number }>(keys.map((k) => [k, { n: 0, r: 0 }]));
  for (const r of f.daily) {
    const slot = daily.get(r._id.d);
    if (slot) r._id.n ? (slot.n += r.c) : (slot.r += r.c);
  }

  const FREQ: Record<string, string> = { "1": "1 day", "2": "2 days", "3": "3–5 days", "6": "6–10 days", "11": "11+ days" };
  const freq = Object.values(FREQ).map((label) => ({ label, value: 0 }));
  for (const r of f.freq) {
    const row = freq.find((x) => x.label === FREQ[String(r._id)]);
    if (row) row.value += r.c;
  }
  const RECENCY = ["Today", "1–7 days ago", "8–30 days ago", "31–90 days ago", "90+ days ago"];
  const recency = RECENCY.map((label) => ({ label, value: 0 }));
  for (const r of f.recency) {
    const since = todayN - dayNum(r._id);
    recency[since === 0 ? 0 : since <= 7 ? 1 : since <= 30 ? 2 : since <= 90 ? 3 : 4].value += r.c;
  }

  // Time to first return, from the distribution of first-return gaps
  const gaps = [...f.gaps].sort((x, y) => x._id - y._id);
  const repeaters = gaps.reduce((a, g) => a + g.c, 0);
  const quantile = (q: number) => {
    let run = 0;
    for (const g of gaps) {
      run += g.c;
      if (run >= q * repeaters) return g._id;
    }
    return 0;
  };
  const within = (d: number) => pct(gaps.filter((g) => g._id <= d).reduce((a, g) => a + g.c, 0), repeaters);

  const dauMap = new Map(sticky[0]?.dau.map((d) => [d._id, d.c]) ?? []);
  let dauSum30 = 0, dauSum7 = 0;
  for (let i = 0; i < 30; i++) {
    const c = dauMap.get(istDay(Date.now() - i * DAY)) ?? 0;
    dauSum30 += c;
    if (i < 7) dauSum7 += c;
  }
  const wau = sticky[0]?.wau[0]?.c ?? 0, mau = sticky[0]?.mau[0]?.c ?? 0;

  const size = new Map<number, number>();
  const cell = new Map<string, number>();
  for (const r of cohortRows) {
    const cw = Math.round(+r._id.cw / DAY), wk = Math.round(+r._id.wk / DAY);
    if (cw === wk) size.set(cw, (size.get(cw) ?? 0) + r.c);
    cell.set(`${cw}:${(wk - cw) / 7}`, r.c);
  }
  const cohorts = Array.from({ length: 10 }, (_, i) => thisWeek - (9 - i) * 7).map((w) => {
    const sz = size.get(w) ?? 0;
    return {
      week: new Date(w * DAY).toISOString().slice(0, 10),
      size: sz,
      retention: Array.from({ length: 9 }, (_, k) => (w + k * 7 > thisWeek ? null : sz ? Math.round(((cell.get(`${w}:${k}`) ?? 0) / sz) * 100) : 0)),
    };
  });

  return {
    range,
    totalVisitors: t.visitors,
    historyFrom: t.history ? new Date(t.history + "T00:00:00+05:30") : null,
    activeInWindow: t.active,
    newInWindow: t.newW,
    returningInWindow: t.ret,
    returningRate: pct(t.ret, t.active),
    newCameBackRate: pct(t.came, t.newW),
    repeatRate: pct(t.rep, t.visitors),
    daily: keys.map((k) => ({ day: k, new: daily.get(k)!.n, returning: daily.get(k)!.r })),
    freq,
    recency,
    gapMedian: quantile(0.5),
    gapP75: quantile(0.75),
    returnWithin: { d1: within(1), d7: within(7), d30: within(30) },
    stickiness: { dau: Math.round(dauSum30 / 30), dau7: Math.round(dauSum7 / 7), wau, mau, dauMau: pct(dauSum30 / 30, mau), dauWau: pct(dauSum7 / 7, wau) },
    cohorts,
    topReturning: f.top.map((v) => ({ id: v._id, days: v.nd, views: v.views, sessions: v.sessions, first: new Date(v.first + "T00:00:00+05:30"), last: new Date(v.last + "T00:00:00+05:30") })),
  };
}

/* ---------------- Time of week ---------------- */

async function _getTimePatterns(range: Range) {
  await connectDB();
  const since = new Date(Date.now() - range * DAY);
  const rows = await AnalyticsEventModel.aggregate<{ _id: { d: number; h: number }; n: number }>([
    { $match: { event: "page_view", timestamp: { $gte: since } } },
    { $group: { _id: { d: { $dayOfWeek: { date: "$timestamp", timezone: TZ } }, h: { $hour: { date: "$timestamp", timezone: TZ } } }, n: { $sum: 1 } } },
  ]);
  // Mongo: 1 = Sunday … 7 = Saturday. Show Monday first.
  const order = [2, 3, 4, 5, 6, 7, 1];
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const grid = order.map(() => Array<number>(24).fill(0));
  for (const r of rows) grid[order.indexOf(r._id.d)][r._id.h] += r.n;
  const max = Math.max(1, ...grid.flat());
  const slots = grid.flatMap((row, di) => row.map((n, h) => ({ day: names[di], hour: h, n }))).sort((a, b) => b.n - a.n).slice(0, 5);
  const byHour = Array.from({ length: 24 }, (_, h) => ({ label: `${h}:00`, value: grid.reduce((a, r) => a + r[h], 0) }));
  const byDay = names.map((label, i) => ({ label, value: grid[i].reduce((a, b) => a + b, 0) }));
  return { names, grid, max, slots, byHour, byDay, total: grid.flat().reduce((a, b) => a + b, 0) };
}

/* ---------------- Acquisition ---------------- */

const hostOf = (ref?: string | null) => {
  if (!ref) return "";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
const sourceLabel = (utm?: { source?: string; referrer?: string } | null) => utm?.source?.toLowerCase() || hostOf(utm?.referrer) || "direct";

/** Referrer URL → hostname, inside MongoDB. */
const hostExpr = (field: string) => ({
  $arrayElemAt: [{ $getField: { field: "captures", input: { $regexFind: { input: { $ifNull: [field, ""] }, regex: "^https?://(?:www\\.)?([^/:?#]+)" } } } }, 0],
});
const landingExpr = (field: string) => ({ $arrayElemAt: [{ $split: [{ $ifNull: [field, "/"] }, "?"] }, 0] });

async function _getAcquisition(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const tracked = await hasTracking(since);

  if (!tracked) {
    // History from the old analytics: sessions by referring site only (reduced inside MongoDB).
    const [r] = await AnalyticsEventModel.aggregate<{ sources: { _id: string; c: number }[]; landings: { _id: string; c: number }[]; total: { n: number }[] }>(
      [
        { $match: { event: "page_view", timestamp: { $gte: since }, sessionId: { $nin: ["unknown", "server", null] } } },
        { $sort: { timestamp: 1 } },
        { $group: { _id: "$sessionId", ref: { $first: "$referrer" }, landing: { $first: "$pagePath" } } },
        {
          $facet: {
            sources: [{ $group: { _id: { $ifNull: [hostExpr("$ref"), "direct"] }, c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 15 }],
            landings: [{ $group: { _id: landingExpr("$landing"), c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 15 }],
            total: [{ $count: "n" }],
          },
        },
      ],
      { allowDiskUse: true },
    );
    return {
      mode: "history" as const,
      sources: (r?.sources ?? []).map((x) => ({ label: x._id, sessions: x.c, leads: 0, carts: 0, buyers: 0, revenue: 0 })),
      campaigns: [] as { label: string; sessions: number }[],
      landings: (r?.landings ?? []).map((x) => ({ label: x._id, sessions: x.c, leads: 0, buyers: 0 })),
      sessions: r?.total[0]?.n ?? 0,
    };
  }

  type Row = { _id: { l: string; m?: string | null }; sessions: number; leads: number; carts: number };
  const [facet, purchaseRows] = await Promise.all([
    TrackingEventModel.aggregate<{
      sources: Row[];
      campaigns: { _id: string; c: number }[];
      landings: { _id: string; sessions: number; leads: number }[];
      withCarts: { label: string; medium?: string | null; lp: string; refs: string[] }[];
      total: { n: number }[];
    }>(
      [
        { $match: { ts: { $gte: since }, sessionId: { $nin: [null, "unknown"] } } },
        {
          // Every event of a session carries the same utm, so $max just picks it.
          $group: {
            _id: "$sessionId",
            src: { $max: "$utm.source" }, medium: { $max: "$utm.medium" }, campaign: { $max: "$utm.campaign" }, ref: { $max: "$utm.referrer" }, landing: { $max: "$utm.landing" },
            views: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } },
            ident: { $max: { $cond: [{ $eq: ["$event", "identify"] }, 1, 0] } },
            refs: { $addToSet: { $cond: [{ $eq: ["$event", "checkout_started"] }, "$props.ref", "$$REMOVE"] } },
          },
        },
        { $match: { views: { $gt: 0 } } },
        { $addFields: { host: hostExpr("$ref") } },
        { $addFields: { label: { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ["$src", ""] } }, 0] }, { $toLower: "$src" }, { $ifNull: ["$host", "direct"] }] }, lp: landingExpr("$landing") } },
        {
          $facet: {
            sources: [{ $group: { _id: { l: "$label", m: "$medium" }, sessions: { $sum: 1 }, leads: { $sum: "$ident" }, carts: { $sum: { $size: "$refs" } } } }, { $sort: { sessions: -1 } }, { $limit: 20 }],
            campaigns: [{ $match: { campaign: { $ne: null } } }, { $group: { _id: "$campaign", c: { $sum: 1 } } }, { $sort: { c: -1 } }, { $limit: 15 }],
            landings: [{ $group: { _id: "$lp", sessions: { $sum: 1 }, leads: { $sum: "$ident" } } }, { $sort: { sessions: -1 } }, { $limit: 15 }],
            withCarts: [{ $match: { "refs.0": { $exists: true } } }, { $project: { _id: 0, label: 1, medium: 1, lp: 1, refs: 1 } }],
            total: [{ $count: "n" }],
          },
        },
      ],
      { allowDiskUse: true },
    ),
    TrackingEventModel.find({ ts: { $gte: since }, event: "purchase" }, { "props.ref": 1, "props.total": 1 }).lean() as unknown as Promise<{ props?: { ref?: string; total?: number } }[]>,
  ]);
  const f = facet[0] ?? { sources: [], campaigns: [], landings: [], withCarts: [], total: [] };
  const paid = new Map(purchaseRows.map((p) => [p.props?.ref, Number(p.props?.total) || 0]));
  const bySource = new Map<string, { buyers: number; revenue: number }>();
  const byLanding = new Map<string, number>();
  for (const c of f.withCarts) {
    const key = c.label + (c.medium ? ` / ${c.medium}` : "");
    for (const ref of c.refs) {
      const total = paid.get(ref);
      if (total == null) continue;
      const cur = bySource.get(key) ?? { buyers: 0, revenue: 0 };
      cur.buyers++;
      cur.revenue += total;
      bySource.set(key, cur);
      byLanding.set(c.lp, (byLanding.get(c.lp) ?? 0) + 1);
    }
  }
  return {
    mode: "tracking" as const,
    sources: f.sources.map((r) => {
      const label = r._id.l + (r._id.m ? ` / ${r._id.m}` : "");
      return { label, sessions: r.sessions, leads: r.leads, carts: r.carts, buyers: bySource.get(label)?.buyers ?? 0, revenue: bySource.get(label)?.revenue ?? 0 };
    }),
    campaigns: f.campaigns.map((c) => ({ label: c._id, sessions: c.c })),
    landings: f.landings.map((l) => ({ label: l._id, sessions: l.sessions, leads: l.leads, buyers: byLanding.get(l._id) ?? 0 })),
    sessions: f.total[0]?.n ?? 0,
  };
}

/* ---------------- Buyers ---------------- */

async function _getBuyers() {
  await connectDB();
  const orders = (await OrderModel.find({ status: { $in: PAID }, email: { $nin: [null, ""] } }, { email: 1, total: 1, items: 1, createdAt: 1, ref: 1 }).sort({ createdAt: 1 }).lean()) as unknown as {
    email: string; total: number; items: { slug: string; title: string }[]; createdAt: Date; ref?: string;
  }[];
  const emails = [...new Set(orders.map((o) => o.email))];

  const [dl, mat, guide, sub, cr] = await Promise.all([
    FreeDownloadLeadModel.find({ email: { $in: emails } }, { email: 1, createdAt: 1 }).lean(),
    FreeMaterialLeadModel.find({ email: { $in: emails } }, { email: 1, createdAt: 1 }).lean(),
    FreeGuideLeadModel.find({ email: { $in: emails } }, { email: 1, createdAt: 1 }).lean(),
    SubscriberEmailModel.find({ email: { $in: emails } }, { email: 1, createdAt: 1 }).lean(),
    CopyRequestModel.find({ email: { $in: emails } }, { email: 1, createdAt: 1 }).lean(),
  ]);
  const firstLead = new Map<string, Date>();
  for (const l of [...dl, ...mat, ...guide, ...sub, ...cr] as unknown as { email: string; createdAt: Date }[]) {
    const cur = firstLead.get(l.email);
    if (!cur || l.createdAt < cur) firstLead.set(l.email, l.createdAt);
  }

  const byEmail = new Map<string, typeof orders>();
  for (const o of orders) byEmail.set(o.email, [...(byEmail.get(o.email) ?? []), o]);
  const gapsDays: number[] = [];
  let wasLead = 0, repeat = 0;
  for (const [email, list] of byEmail) {
    const fl = firstLead.get(email);
    if (fl && fl < list[0].createdAt) {
      wasLead++;
      gapsDays.push((+list[0].createdAt - +fl) / DAY);
    }
    if (list.length > 1) repeat++;
  }
  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const hours = Array<number>(24).fill(0);
  for (const o of orders) hours[Number(new Date(+o.createdAt + IST_MS).getUTCHours())]++;
  const pairs = new Map<string, number>();
  for (const o of orders) {
    const s = [...new Set(o.items.map((i) => i.title))].sort();
    for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) pairs.set(`${s[i]} + ${s[j]}`, (pairs.get(`${s[i]} + ${s[j]}`) ?? 0) + 1);
  }

  // What they did before buying, from tracking (checkout_started carries the visitor and session).
  const purchases = (await TrackingEventModel.find({ event: "purchase" }, { ts: 1, "props.ref": 1, "props.total": 1 }).sort({ ts: -1 }).limit(300).lean()) as unknown as { ts: Date; props?: { ref?: string } }[];
  const refs = purchases.map((p) => p.props?.ref).filter(Boolean) as string[];
  const checkouts = refs.length ? ((await TrackingEventModel.find({ event: "checkout_started", "props.ref": { $in: refs } }, { visitorId: 1, "props.ref": 1 }).lean()) as unknown as { visitorId?: string; props?: { ref?: string } }[]) : [];
  const visitorByRef = new Map(checkouts.map((c) => [c.props?.ref, c.visitorId]));
  const visitorIds = [...new Set(checkouts.map((c) => c.visitorId).filter(Boolean))] as string[];
  const events = visitorIds.length
    ? ((await TrackingEventModel.find({ visitorId: { $in: visitorIds }, event: { $in: ["page_view", "session_start", "search", "ask_question", "identify", "buy_click", "form_submit"] } }, { visitorId: 1, ts: 1, event: 1, path: 1, sessionId: 1, utm: 1 }).sort({ ts: 1 }).limit(20000).lean()) as unknown as { visitorId: string; ts: Date; event: string; path?: string; sessionId?: string; utm?: { source?: string; referrer?: string } }[])
    : [];
  const byVisitor = new Map<string, typeof events>();
  for (const e of events) byVisitor.set(e.visitorId, [...(byVisitor.get(e.visitorId) ?? []), e]);
  const visitsBefore: number[] = [], daysToBuy: number[] = [];
  const pagesSeen = new Map<string, number>(), srcs = new Map<string, number>();
  let askedAI = 0, gotLead = 0, searched = 0, counted = 0;
  for (const p of purchases) {
    const vid = visitorByRef.get(p.props?.ref);
    const evs = vid ? byVisitor.get(vid) : undefined;
    if (!vid || !evs?.length) continue;
    counted++;
    const before = evs.filter((e) => e.ts <= p.ts);
    visitsBefore.push(new Set(before.map((e) => e.sessionId)).size);
    daysToBuy.push((+p.ts - +before[0].ts) / DAY);
    if (before.some((e) => e.event === "ask_question")) askedAI++;
    if (before.some((e) => e.event === "identify")) gotLead++;
    if (before.some((e) => e.event === "search")) searched++;
    for (const path of new Set(before.filter((e) => e.event === "page_view").map((e) => (e.path || "").split("?")[0]))) pagesSeen.set(path, (pagesSeen.get(path) ?? 0) + 1);
    const label = sourceLabel(before[0].utm);
    srcs.set(label, (srcs.get(label) ?? 0) + 1);
  }

  return {
    buyers: byEmail.size,
    orders: orders.length,
    revenue,
    avgPerBuyer: byEmail.size ? Math.round(revenue / byEmail.size) : 0,
    repeatBuyers: repeat,
    repeatRate: pct(repeat, byEmail.size),
    wasLead,
    wasLeadRate: pct(wasLead, byEmail.size),
    leadToBuyMedianDays: median(gapsDays),
    byHour: hours.map((value, h) => ({ label: `${h}:00`, value })),
    pairs: [...pairs].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value })),
    tracked: {
      count: counted,
      medianVisits: median(visitsBefore),
      medianDays: median(daysToBuy),
      askedAI: pct(askedAI, counted),
      gotLead: pct(gotLead, counted),
      searched: pct(searched, counted),
      pages: [...pagesSeen].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([label, value]) => ({ label, value })),
      sources: [...srcs].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value })),
    },
  };
}

/* ---------------- Leads ---------------- */

async function _getLeads(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const keys = dayKeys(range);
  type L = { email: string; createdAt: Date; label: string };
  const [dl, mat, guide, sub, cr, paidEmails] = await Promise.all([
    FreeDownloadLeadModel.find({}, { email: 1, createdAt: 1, topperName: 1 }).lean(),
    FreeMaterialLeadModel.find({}, { email: 1, createdAt: 1 }).lean(),
    FreeGuideLeadModel.find({}, { email: 1, createdAt: 1 }).lean(),
    SubscriberEmailModel.find({}, { email: 1, createdAt: 1 }).lean(),
    CopyRequestModel.find({}, { email: 1, createdAt: 1, topperName: 1 }).lean(),
    OrderModel.distinct("email", { status: { $in: PAID }, email: { $nin: [null, ""] } }) as Promise<string[]>,
  ]);
  const all: L[] = [
    ...(dl as unknown as { email: string; createdAt: Date }[]).map((l) => ({ ...l, label: "Free answer copy" })),
    ...(mat as unknown as { email: string; createdAt: Date }[]).map((l) => ({ ...l, label: "Free material" })),
    ...(guide as unknown as { email: string; createdAt: Date }[]).map((l) => ({ ...l, label: "Free guide" })),
    ...(sub as unknown as { email: string; createdAt: Date }[]).map((l) => ({ ...l, label: "Newsletter / store" })),
    ...(cr as unknown as { email: string; createdAt: Date }[]).map((l) => ({ ...l, label: "Copy request" })),
  ].filter((l) => l.email && l.createdAt);

  const people = new Map<string, { first: Date; last: Date; forms: number; sources: Set<string> }>();
  for (const l of all) {
    const p = people.get(l.email) ?? { first: l.createdAt, last: l.createdAt, forms: 0, sources: new Set<string>() };
    if (l.createdAt < p.first) p.first = l.createdAt;
    if (l.createdAt > p.last) p.last = l.createdAt;
    p.forms++;
    p.sources.add(l.label);
    people.set(l.email, p);
  }
  const paid = new Set(paidEmails.map((e) => e.toLowerCase()));
  const sinceMs = +since;
  const newDaily = new Map<string, number>();
  const bySource = new Map<string, number>();
  let newInWindow = 0, multi = 0, buyers = 0, stale = 0;
  const firstSource = new Map<string, string>();
  for (const l of [...all].sort((a, b) => +a.createdAt - +b.createdAt)) if (!firstSource.has(l.email)) firstSource.set(l.email, l.label);
  for (const [email, p] of people) {
    if (+p.first >= sinceMs) {
      newInWindow++;
      const k = istDay(p.first);
      newDaily.set(k, (newDaily.get(k) ?? 0) + 1);
      const s = firstSource.get(email)!;
      bySource.set(s, (bySource.get(s) ?? 0) + 1);
    }
    if (p.forms > 1) multi++;
    if (paid.has(email)) buyers++;
    else if (Date.now() - +p.last > 30 * DAY) stale++;
  }
  const recent = [...people].sort((a, b) => +b[1].last - +a[1].last).slice(0, 25).map(([email, p]) => ({ email, first: p.first, last: p.last, forms: p.forms, sources: [...p.sources].join(", "), bought: paid.has(email) }));
  // Growth over time (cumulative unique emails), weekly, last 12 weeks
  const cumulative = (() => {
    const out: { label: string; value: number }[] = [];
    const sorted = [...people.values()].map((p) => +p.first).sort((a, b) => a - b);
    for (let w = 11; w >= 0; w--) {
      const end = Date.now() - w * 7 * DAY;
      out.push({ label: istDay(end).slice(5), value: sorted.filter((t) => t <= end).length });
    }
    return out;
  })();

  return {
    total: people.size,
    newInWindow,
    multi,
    buyers,
    buyerRate: pct(buyers, people.size),
    stale,
    daily: keys.map((day) => ({ day, value: newDaily.get(day) ?? 0 })),
    bySource: [...bySource].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    cumulative,
    recent,
  };
}

/* ---------------- AI mentor ---------------- */

async function _getAI(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const keys = dayKeys(range);
  const [convDaily, perConv, askers, quotaRows, evCounts, latency, errs] = await Promise.all([
    AskConversationModel.aggregate<{ _id: string; convs: number; qs: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $project: { d: dayExpr("$createdAt"), qs: { $size: { $filter: { input: "$messages", as: "m", cond: { $eq: ["$$m.role", "user"] } } } } } },
      { $group: { _id: "$d", convs: { $sum: 1 }, qs: { $sum: "$qs" } } },
    ]),
    AskConversationModel.aggregate<{ _id: number; n: number }>([
      { $match: { createdAt: { $gte: since } } },
      { $project: { qs: { $size: { $filter: { input: "$messages", as: "m", cond: { $eq: ["$$m.role", "user"] } } } } } },
      { $group: { _id: "$qs", n: { $sum: 1 } } },
    ]),
    AskConversationModel.aggregate<{ _id: string; convs: number; days: string[]; signed: boolean }>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$sessionId", convs: { $sum: 1 }, days: { $addToSet: dayExpr("$createdAt") }, signed: { $max: { $cond: [{ $ne: ["$userId", null] }, 1, 0] } } } },
    ]),
    // Who ran into the daily limit (5 anonymous, 20 signed in)
    (await import("@/models/ask.model")).AskSessionModel.aggregate<{ _id: null; anon: number; signed: number; anonMax: number; signedMax: number }>([
      { $match: { updatedAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          anon: { $sum: { $cond: [{ $eq: ["$userId", null] }, 1, 0] } },
          signed: { $sum: { $cond: [{ $ne: ["$userId", null] }, 1, 0] } },
          anonMax: { $sum: { $cond: [{ $and: [{ $eq: ["$userId", null] }, { $gte: ["$queriesToday", 5] }] }, 1, 0] } },
          signedMax: { $sum: { $cond: [{ $and: [{ $ne: ["$userId", null] }, { $gte: ["$queriesToday", 20] }] }, 1, 0] } },
        },
      },
    ]),
    TrackingEventModel.aggregate<{ _id: string; n: number }>([{ $match: { ts: { $gte: since }, event: { $in: ["ask_answer", "ask_error", "ask_limit", "ask_retry"] } } }, { $group: { _id: "$event", n: { $sum: 1 } } }]),
    TrackingEventModel.aggregate<{ _id: string; avg: number; p: number[]; n: number }>([
      { $match: { ts: { $gte: since }, event: "ask_answer", "props.ms": { $gt: 0 } } },
      { $group: { _id: "$props.path", avg: { $avg: "$props.ms" }, p: { $push: "$props.ms" }, n: { $sum: 1 } } },
    ]),
    TrackingEventModel.aggregate<{ _id: string; n: number }>([{ $match: { ts: { $gte: since }, event: "ask_error" } }, { $group: { _id: "$props.code", n: { $sum: 1 } } }, { $sort: { n: -1 } }]),
  ]);

  const dm = new Map(convDaily.map((r) => [r._id, r]));
  const totalConvs = convDaily.reduce((a, r) => a + r.convs, 0);
  const totalQs = convDaily.reduce((a, r) => a + r.qs, 0);
  const dist = { "1 question": 0, "2 questions": 0, "3–5 questions": 0, "6+ questions": 0 };
  for (const r of perConv) dist[r._id <= 1 ? "1 question" : r._id === 2 ? "2 questions" : r._id <= 5 ? "3–5 questions" : "6+ questions"] += r.n;
  const repeat = askers.filter((a) => a.days.length > 1).length;
  const q = quotaRows[0] ?? { anon: 0, signed: 0, anonMax: 0, signedMax: 0 };
  const ev = new Map(evCounts.map((e) => [e._id, e.n]));
  return {
    totalConvs,
    totalQs,
    avgQsPerConv: totalConvs ? Math.round((totalQs / totalConvs) * 10) / 10 : 0,
    askers: askers.length,
    signedShare: pct(askers.filter((a) => a.signed).length, askers.length),
    repeatAskers: repeat,
    repeatRate: pct(repeat, askers.length),
    perConv: Object.entries(dist).map(([label, value]) => ({ label, value })),
    questionsDaily: keys.map((day) => ({ day, value: dm.get(day)?.qs ?? 0 })),
    convsDaily: keys.map((day) => ({ day, value: dm.get(day)?.convs ?? 0 })),
    limits: { anon: q.anon, signed: q.signed, anonMax: q.anonMax, signedMax: q.signedMax, anonMaxRate: pct(q.anonMax, q.anon), signedMaxRate: pct(q.signedMax, q.signed) },
    tracked: { answers: ev.get("ask_answer") ?? 0, errors: ev.get("ask_error") ?? 0, limitHits: ev.get("ask_limit") ?? 0, retries: ev.get("ask_retry") ?? 0 },
    latency: latency.map((l) => ({ path: l._id || "?", avg: Math.round(l.avg), p75: percentile(l.p, 75), n: l.n })),
    errors: errs.map((e) => ({ label: e._id || "unknown", value: e.n })),
  };
}

/* ---------------- Tech, language, speed ---------------- */

export function parseUA(ua: string) {
  const u = ua || "";
  const inApp = /Instagram/i.test(u) ? "Instagram app" : /FBAN|FBAV/i.test(u) ? "Facebook app" : /Telegram/i.test(u) ? "Telegram app" : /WhatsApp/i.test(u) ? "WhatsApp app" : /; wv\)/.test(u) ? "Android webview" : "";
  const browser = inApp || (/SamsungBrowser/i.test(u) ? "Samsung Internet" : /UCBrowser|UCWEB/i.test(u) ? "UC Browser" : /OPR\/|Opera/i.test(u) ? "Opera" : /EdgA?\/|Edg\//i.test(u) ? "Edge" : /Firefox|FxiOS/i.test(u) ? "Firefox" : /CriOS|Chrome\//i.test(u) ? "Chrome" : /Safari\//i.test(u) ? "Safari" : "Other");
  const os = /Android/i.test(u) ? "Android" : /iPhone|iPad|iPod|iOS/i.test(u) ? "iOS" : /Windows/i.test(u) ? "Windows" : /Mac OS X|Macintosh/i.test(u) ? "macOS" : /CrOS/i.test(u) ? "ChromeOS" : /Linux/i.test(u) ? "Linux" : "Other";
  return { browser, os };
}

type SessionProps = { screen?: { w?: number }; langs?: string[]; connection?: { type?: string; save_data?: boolean }; dark?: boolean; standalone?: boolean; returning?: boolean; visit_number?: number };

async function _getTech(range: Range) {
  await connectDB();
  const { since } = windows(range);
  const [uaRows, sessions, vitals, vitalsByPage] = await Promise.all([
    AnalyticsEventModel.aggregate<{ _id: string; v: number }>([
      { $match: { event: "page_view", timestamp: { $gte: since }, visitorId: REAL_VISITOR } },
      { $group: { _id: { ua: "$userAgent", v: "$visitorId" } } },
      { $group: { _id: "$_id.ua", v: { $sum: 1 } } },
    ], { allowDiskUse: true }),
    TrackingEventModel.find({ ts: { $gte: since }, event: "session_start" }, { props: 1, lang: 1, tz: 1 }).limit(20000).lean() as unknown as Promise<{ props?: SessionProps; lang?: string; tz?: string }[]>,
    TrackingEventModel.find({ ts: { $gte: since }, event: "web_vitals" }, { props: 1, path: 1 }).limit(20000).lean() as unknown as Promise<{ props?: Record<string, number>; path?: string }[]>,
    Promise.resolve(null),
  ]);
  void vitalsByPage;
  const browsers = new Map<string, number>(), oses = new Map<string, number>();
  for (const r of uaRows) {
    const { browser, os } = parseUA(r._id);
    browsers.set(browser, (browsers.get(browser) ?? 0) + r.v);
    oses.set(os, (oses.get(os) ?? 0) + r.v);
  }
  const count = (arr: (string | undefined)[]) => {
    const m = new Map<string, number>();
    for (const x of arr) if (x) m.set(x, (m.get(x) ?? 0) + 1);
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, value]) => ({ label, value }));
  };
  const widthBucket = (w?: number) => (!w ? undefined : w < 400 ? "Under 400px" : w < 600 ? "400–599px" : w < 900 ? "600–899px" : w < 1280 ? "900–1279px" : w < 1600 ? "1280–1599px" : "1600px and up");
  const sd = sessions.map((s) => s.props ?? {});
  const total = sd.length;
  const share = (pred: (p: SessionProps) => boolean) => pct(sd.filter(pred).length, total);

  const pageVitals = new Map<string, { lcp: number[]; cls: number[]; inp: number[] }>();
  const all = { lcp: [] as number[], cls: [] as number[], inp: [] as number[], ttfb: [] as number[] };
  for (const v of vitals) {
    const p = v.props ?? {};
    const path = (v.path || "/").split("?")[0].replace(/\/[^/]+-rank-\d+-\d{4}$/, "/[topper]");
    const cur = pageVitals.get(path) ?? { lcp: [], cls: [], inp: [] };
    if (p.lcp != null) { cur.lcp.push(p.lcp); all.lcp.push(p.lcp); }
    if (p.cls != null) { cur.cls.push(p.cls); all.cls.push(p.cls); }
    if (p.inp != null) { cur.inp.push(p.inp); all.inp.push(p.inp); }
    if (p.ttfb != null) all.ttfb.push(p.ttfb);
    pageVitals.set(path, cur);
  }
  return {
    browsers: [...browsers].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    oses: [...oses].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    sessionsTracked: total,
    screens: count(sd.map((p) => widthBucket(p.screen?.w))),
    languages: count(sd.map((p) => (Array.isArray(p.langs) ? String(p.langs[0]).split("-")[0] : undefined))),
    connections: count(sd.map((p) => p.connection?.type)),
    timezones: count(sessions.map((s) => s.tz)),
    darkShare: share((p) => !!p.dark),
    standaloneShare: share((p) => !!p.standalone),
    saveDataShare: share((p) => !!p.connection?.save_data),
    returningShare: share((p) => !!p.returning),
    avgVisitNumber: total ? Math.round((sd.reduce((a, p) => a + (Number(p.visit_number) || 1), 0) / total) * 10) / 10 : 0,
    vitals: {
      samples: vitals.length,
      lcp: percentile(all.lcp, 75),
      cls: Math.round(percentile(all.cls, 75) * 1000) / 1000,
      inp: percentile(all.inp, 75),
      ttfb: percentile(all.ttfb, 75),
      goodLcp: pct(all.lcp.filter((x) => x <= 2500).length, all.lcp.length),
    },
    pages: [...pageVitals]
      .map(([path, v]) => ({ path, n: v.lcp.length, lcp: percentile(v.lcp, 75), cls: Math.round(percentile(v.cls, 75) * 1000) / 1000, inp: percentile(v.inp, 75) }))
      .filter((p) => p.n >= 1)
      .sort((a, b) => b.n - a.n)
      .slice(0, 15),
  };
}

/* Cached entry points: fresh for 45 s, then served stale while refreshing. */
export const getOverview = memo("getOverview", _getOverview);
export const getTraffic = memo("getTraffic", _getTraffic);
export const getDemand = memo("getDemand", _getDemand, 3 * 60_000, 30 * 60_000);
export const getFunnel = memo("getFunnel", _getFunnel);
export const getAudience = memo("getAudience", _getAudience, 3 * 60_000, 30 * 60_000);
export const getTimePatterns = memo("getTimePatterns", _getTimePatterns, 3 * 60_000, 30 * 60_000);
export const getAcquisition = memo("getAcquisition", _getAcquisition, 3 * 60_000, 30 * 60_000);
export const getBuyers = memo("getBuyers", _getBuyers, 3 * 60_000, 30 * 60_000);
export const getLeads = memo("getLeads", _getLeads, 3 * 60_000, 30 * 60_000);
export const getAI = memo("getAI", _getAI, 3 * 60_000, 30 * 60_000);
export const getTech = memo("getTech", _getTech, 3 * 60_000, 30 * 60_000);
