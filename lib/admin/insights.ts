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

export async function getOverview(range: Range) {
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

export async function getTraffic(range: Range) {
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

export async function getDemand(range: Range) {
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

export async function getFunnel(range: Range) {
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
