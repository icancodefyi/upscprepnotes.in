"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";

// Types
type FunnelStage = [number, number, number, number, number];
type Stats = {
  totalEvents: number; totalSessions: number; uniqueVisitors: number; pageViews: number;
  todayEvents: number; todaySessions: number;
  whatsappClicks: number; fileDownloads: number; salesPageViews: number; conversions: number;
  aiConversations: number; aiMessages: number;
  returningVisitors: number; bounceSessions: number;
  eventsByType: { _id: string; count: number }[];
  dailyTimeline: { _id: string; count: number }[];
  topPages: { _id: string; count: number }[];
  topClicks: { _id: { text: string; url: string; trackAttr: string }; count: number }[];
  recentEvents: any[];
  sessionJourneys: any[];
  userJourneys: any[];
  deviceBreakdown: { _id: string; count: number }[];
  hourlyActivity: { _id: number; count: number }[];
  referrers: { _id: string; count: number }[];
  scrollDepths: { _id: string; count: number }[];
  topExits: { _id: string; count: number }[];
  dialogData: { _id: { event: string; dialog: string }; count: number }[];
  funnelStages: FunnelStage;
};

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#6366f1"];
const DEVICE_COLORS = ["#6366f1", "#059669", "#f59e0b"];

function formatNumber(n: number) { return n.toLocaleString("en-IN"); }

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchStats = useCallback(async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?days=${d}`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) { console.error("Failed to fetch analytics", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(days); }, [days, fetchStats]);

  // Derived metrics
  const bounceRate = stats ? (stats.totalSessions > 0 ? (stats.bounceSessions / stats.totalSessions * 100).toFixed(1) : "0") : "0";
  const returningPct = stats ? (stats.uniqueVisitors > 0 ? (stats.returningVisitors / stats.uniqueVisitors * 100).toFixed(1) : "0") : "0";
  const conversionRate = stats ? (stats.uniqueVisitors > 0 ? (stats.conversions / stats.uniqueVisitors * 100).toFixed(1) : "0") : "0";
  const funnelLabels = ["Visitors", "Opened Dialog", "Free Lead", "Downloaded", "WhatsApp"];


  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <p className="text-lg">No analytics data yet</p>
        <p className="mt-1 text-sm">Events will appear here once users visit the site</p>
      </div>
    );
  }

  const timelineData = stats.dailyTimeline.map(d => ({ date: d._id, events: d.count }));
  const typeData = stats.eventsByType.map(d => ({ name: d._id, value: d.count }));
  const deviceData = stats.deviceBreakdown.map(d => ({ name: d._id || "unknown", value: d.count }));
  const scrollData = stats.scrollDepths.map(d => ({ depth: d._id, count: d.count }));

  // Hourly heatmap data → fill all 24 hours
  const hourMap = new Map(stats.hourlyActivity.map(h => [h._id, h.count]));
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    count: hourMap.get(i) || 0,
    h24: i,
  }));
  const maxHourly = Math.max(...hourlyData.map(h => h.count), 1);

  // Pre-compute all template literals to avoid TSX parser issues
  const heroToday = formatNumber(stats.todaySessions) + " sessions";
  const heroTotal = formatNumber(stats.uniqueVisitors) + " unique visitors";
  const heroPages = stats.totalSessions + " sessions";
  const heroBounce = stats.bounceSessions + " of " + stats.totalSessions + " sessions";
  const heroConversion = stats.conversions + " converting users";
  const heroReturning = stats.returningVisitors + " of " + stats.uniqueVisitors;
  const heroWhatsApp = stats.fileDownloads + " file downloads";
  const funnelPct = stats.funnelStages[0] > 0 ? (stats.funnelStages[1] / stats.funnelStages[0] * 100).toFixed(0) : "0";
  const leadPct = stats.funnelStages[0] > 0 ? (stats.funnelStages[2] / stats.funnelStages[0] * 100).toFixed(0) : "0";
  const submitRate = "Submit rate: " + funnelPct + "%";

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {days === 1 ? "Today" : days === 7 ? "This Week" : days === 30 ? "This Month" : "Last " + days + "d"}
            {lastUpdated ? " \u00B7 Updated " + lastUpdated : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 7, 30, 90].map(d => {
            const active = days === d;
            return (
              <button key={d} onClick={() => setDays(d)}
                className={"rounded-lg px-3.5 py-1.5 text-xs font-medium transition " + (active ? "bg-zinc-900 text-white" : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50")}
              >{d === 1 ? "Today" : d + "d"}</button>
            );
          })}
          <div className="mx-1 h-5 w-px bg-zinc-200" />
          <a href={"/api/analytics/export?days=" + days + "&format=csv"} download
            className="rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50">
            Export CSV
          </a>
          <button onClick={() => fetchStats(days)}
            className="rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50">
            Refresh
          </button>
        </div>
      </div>

      {/* ===== HERO METRICS ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HeroCard label="Today" value={formatNumber(stats.todayEvents)} sub={heroToday} />
        <HeroCard label="Total Events" value={formatNumber(stats.totalEvents)} sub={heroTotal} />
        <HeroCard label="Page Views" value={formatNumber(stats.pageViews)} sub={heroPages} />
        <HeroCard label="Bounce Rate" value={bounceRate + "%"} sub={heroBounce} />
        <HeroCard label="Conversion Rate" value={conversionRate + "%"} sub={heroConversion} accent />
        <HeroCard label="Returning Visitors" value={returningPct + "%"} sub={heroReturning} />
        <HeroCard label="WhatsApp Clicks" value={formatNumber(stats.whatsappClicks)} sub={heroWhatsApp} accent />
        <HeroCard label="Sales Page Views" value={formatNumber(stats.salesPageViews)} sub="/toppers-copy-compilation" />
      </div>

      {/* ===== CHARTS ROW 1 ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* DAILY TIMELINE */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Events Over Time</h2>
            <p className="text-xs text-zinc-400">Daily event count</p>
          </div>
          {timelineData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#18181b" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#18181b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e4e4e7", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: 13 }} labelStyle={{ fontWeight: 600 }} />
                <Area type="monotone" dataKey="events" stroke="#18181b" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* EVENT TYPE BREAKDOWN */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Events by Type</h2>
            <p className="text-xs text-zinc-400">All event categories</p>
          </div>
          {typeData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-400">No data yet</div>
          ) : (
            <div className="max-h-[220px] space-y-1.5 overflow-y-auto pr-1">
              {typeData.slice(0, 12).map((d, i) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="flex-1 truncate text-xs text-zinc-700">{d.name}</span>
                  <span className="text-xs font-semibold tabular-nums text-zinc-900">{formatNumber(d.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== HOURLY HEATMAP + FUNNEL ===== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* HOURLY ACTIVITY HEATMAP */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Hourly Activity</h2>
            <p className="text-xs text-zinc-400">Event distribution across 24 hours</p>
          </div>
          <div className="grid grid-cols-24 gap-1">
            {hourlyData.map(h => {
              const intensity = h.count / maxHourly;
              const bg = h.count === 0 ? "bg-zinc-50" : intensity > 0.7 ? "bg-zinc-900" : intensity > 0.4 ? "bg-zinc-600" : intensity > 0.2 ? "bg-zinc-400" : "bg-zinc-200";
              return (
                <div key={h.hour} className="group relative flex flex-col items-center">
                  <div className={`h-12 w-full rounded-md ${bg} transition hover:opacity-80`} />
                  <span className="mt-1 text-[9px] text-zinc-400">{h.hour.slice(0, 2)}</span>
                  <div className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block">
                    {h.hour}: {h.count} events
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONVERSION FUNNEL */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Conversion Funnel</h2>
            <p className="text-xs text-zinc-400">Visitor drop-off at each stage</p>
          </div>
          <div className="space-y-3">
            {stats.funnelStages.map((count, i) => {
              const pct = stats.funnelStages[0] > 0 ? (count / stats.funnelStages[0] * 100) : 0;
              const drop = i > 0 ? (1 - count / stats.funnelStages[i - 1]) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-zinc-700">{funnelLabels[i]}</span>
                    <span className="font-semibold tabular-nums text-zinc-900">{formatNumber(count)} <span className="text-zinc-400 font-normal">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div className="relative h-6 w-full rounded-md bg-zinc-100 overflow-hidden">
                    <div className="h-full rounded-md transition-all duration-500" style={{ width: `${pct}%`, background: i === 4 ? "#059669" : ["#18181b", "#52525b", "#a1a1aa", "#d4d4d8"][i] || "#e4e4e7" }} />
                  </div>
                  {i > 0 && drop > 0 && (
                    <p className="mt-0.5 text-[10px] text-red-500">-{drop.toFixed(0)}% drop from previous</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== DEVICE + SCROLL + REFERRERS ===== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* DEVICE BREAKDOWN */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-2">
            <h2 className="text-sm font-semibold">Devices</h2>
          </div>
          {deviceData.length === 0 ? (
            <p className="text-xs text-zinc-400">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {deviceData.map((_, i) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="mt-1 flex justify-center gap-4 text-xs">
            {deviceData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                <span className="text-zinc-600">{d.name}</span>
                <span className="font-semibold">{formatNumber(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SCROLL DEPTH */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Scroll Depth</h2>
            <p className="text-xs text-zinc-400">How far users scroll</p>
          </div>
          {scrollData.length === 0 ? (
            <p className="text-xs text-zinc-400">No scroll data</p>
          ) : (
            <div className="space-y-2">
              {scrollData.map(s => {
                const maxScroll = Math.max(...scrollData.map(x => x.count), 1);
                const pct = s.count / maxScroll * 100;
                return (
                  <div key={s.depth} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-medium text-zinc-600">{s.depth}</span>
                    <div className="flex-1 h-4 rounded bg-zinc-100 overflow-hidden">
                      <div className="h-full rounded bg-zinc-800 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 text-right font-semibold tabular-nums">{formatNumber(s.count)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REFERRERS */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Traffic Sources</h2>
            <p className="text-xs text-zinc-400">Where visitors come from</p>
          </div>
          {stats.referrers.length === 0 ? (
            <p className="text-xs text-zinc-400">No referrer data (mostly direct traffic)</p>
          ) : (
            <div className="space-y-2">
              {stats.referrers.slice(0, 8).map(r => {
                const maxRef = Math.max(...stats.referrers.slice(0, 8).map(x => x.count), 1);
                const pct = r.count / maxRef * 100;
                const label = r._id.replace(/^https?:\/\//, "").replace(/\/$/, "").substring(0, 30);
                return (
                  <div key={r._id} className="flex items-center gap-3 text-xs">
                    <span className="flex-1 truncate text-zinc-600">{label}</span>
                    <div className="w-20 h-2 rounded bg-zinc-100 overflow-hidden">
                      <div className="h-full rounded bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-semibold tabular-nums">{r.count}</span>
                  </div>
                );
              })}
            </div>
          )}
          {stats.referrers.length === 0 && (
            <p className="text-[10px] text-zinc-400 mt-2">Direct / unknown sources not shown</p>
          )}
        </div>
      </div>

      {/* ===== TOP PAGES + EXITS ===== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* TOP PAGES */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Top Pages</h2>
            <p className="text-xs text-zinc-400">Most visited pages</p>
          </div>
          {stats.topPages.length === 0 ? (
            <p className="text-xs text-zinc-400">No data yet</p>
          ) : (
            <div className="space-y-1">
              {stats.topPages.slice(0, 10).map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs hover:bg-zinc-50 transition">
                  <span className="w-4 text-zinc-400 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-zinc-800">{p._id || "/"}</p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-zinc-900">{formatNumber(p.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP EXITS */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Top Exit Pages</h2>
            <p className="text-xs text-zinc-400">Pages where users leave most</p>
          </div>
          {stats.topExits.length === 0 ? (
            <p className="text-xs text-zinc-400">No exit data</p>
          ) : (
            <div className="space-y-1">
              {stats.topExits.slice(0, 10).map((e, i) => (
                <div key={e._id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs hover:bg-zinc-50 transition">
                  <span className="w-4 text-zinc-400 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-zinc-800">{e._id || "/"}</p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-red-600">{formatNumber(e.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== TOP CLICKS + DIALOGS ===== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* TOP CLICKS */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Top Clicks</h2>
            <p className="text-xs text-zinc-400">Most interacted elements</p>
          </div>
          {stats.topClicks.length === 0 ? (
            <p className="text-xs text-zinc-400">No click data</p>
          ) : (
            <div className="space-y-1">
              {stats.topClicks.slice(0, 10).map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs hover:bg-zinc-50 transition">
                  <span className="w-4 text-zinc-400 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-zinc-800">{c._id.text || c._id.trackAttr || "(click)"}</p>
                    {c._id.url && <p className="truncate text-zinc-400">{c._id.url}</p>}
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">{formatNumber(c.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIALOG INTERACTIONS */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Dialog Interactions</h2>
            <p className="text-xs text-zinc-400">Free download dialog performance</p>
          </div>
          {stats.dialogData.length === 0 ? (
            <p className="text-xs text-zinc-400">No dialog interactions</p>
          ) : (
            (() => {
              const summary: Record<string, { open: number; close: number; submit: number }> = {};
              stats.dialogData.forEach(d => {
                const name = d._id.dialog || "unknown";
                if (!summary[name]) summary[name] = { open: 0, close: 0, submit: 0 };
                summary[name][d._id.event === "dialog_open" ? "open" : d._id.event === "dialog_close" ? "close" : "submit"] += d.count;
              });
              return (
                <div className="space-y-3">
                  {Object.entries(summary).map(([name, data]) => {
                    const submitRate = data.open > 0 ? (data.submit / data.open * 100).toFixed(0) : "0";
                    return (
                      <div key={name}>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-medium text-zinc-700">{name}</span>
                          <span className="text-zinc-400">{data.submit} / {data.open} submitted ({submitRate}%)</span>
                        </div>
                        <div className="flex gap-1.5 h-4">
                          <div className="rounded bg-zinc-300 transition-all" style={{ flex: data.open }} title={`Opened: ${data.open}`} />
                          <div className="rounded bg-zinc-500 transition-all" style={{ flex: data.close }} title={`Closed: ${data.close}`} />
                          <div className="rounded bg-emerald-500 transition-all" style={{ flex: data.submit }} title={`Submitted: ${data.submit}`} />
                        </div>
                        <div className="flex gap-3 mt-1 text-[10px] text-zinc-400">
                          <span>Opened: {data.open}</span>
                          <span>Closed: {data.close}</span>
                          <span>Submitted: {data.submit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* ===== EVENT FUNNEL TABLE ===== */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold">Event Funnel Breakdown</h2>
          <p className="text-xs text-zinc-400">All event types with counts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400">
                <th className="pb-2 pr-4 font-medium">Event</th>
                <th className="pb-2 pr-4 font-medium text-right">Count</th>
                <th className="pb-2 font-medium text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.eventsByType.map((e, i) => (
                <tr key={e._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-zinc-800">{e._id}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-right font-semibold tabular-nums">{formatNumber(e.count)}</td>
                  <td className="py-2 text-right text-zinc-500 tabular-nums">{stats.totalEvents > 0 ? (e.count / stats.totalEvents * 100).toFixed(1) : "0"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== SUB-COMPONENTS =====

function HeroCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border ${accent ? "border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white" : "border-zinc-200 bg-white"} p-4`}>
      <p className={`text-xs font-medium ${accent ? "text-indigo-600" : "text-zinc-500"}`}>{label}</p>
      <p className={`mt-1 text-xl font-bold tracking-tight ${accent ? "text-indigo-900" : "text-zinc-900"}`}>{value}</p>
      <p className={`mt-0.5 text-xs ${accent ? "text-indigo-500" : "text-zinc-400"}`}>{sub}</p>
    </div>
  );
}
