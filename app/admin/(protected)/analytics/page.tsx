"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

type EventsByType = { _id: string; count: number }[];
type DailyTimeline = { _id: string; count: number }[];
type TopPage = { _id: string; count: number };
type TopClick = { _id: { text: string; url: string; trackAttr: string }; count: number };
type RecentEvent = {
  _id: string;
  event: string;
  pagePath: string;
  timestamp: string;
  sessionId: string;
  visitorId?: string;
  metadata: Record<string, unknown>;
};

type SessionJourney = {
  sessionId: string;
  eventCount: number;
  firstEvent: string;
  lastEvent: string;
  deviceType: string;
  userAgent: string;
  events: { event: string; pagePath: string; timestamp: string; metadata: Record<string, unknown> }[];
};

type UserJourney = {
  visitorId: string;
  eventCount: number;
  firstEvent: string;
  lastEvent: string;
  sessionCount: number;
  deviceType: string;
  userAgent: string;
  events: { event: string; pagePath: string; timestamp: string; sessionId: string; metadata: Record<string, unknown> }[];
};

type Stats = {
  totalEvents: number;
  totalSessions: number;
  uniqueVisitors: number;
  pageViews: number;
  todayEvents: number;
  todaySessions: number;
  whatsappClicks: number;
  fileDownloads: number;
  salesPageViews: number;
  conversions: number;
  aiConversations: number;
  aiMessages: number;
  eventsByType: EventsByType;
  dailyTimeline: DailyTimeline;
  topPages: TopPage[];
  topClicks: TopClick[];
  recentEvents: RecentEvent[];
  sessionJourneys: SessionJourney[];
  userJourneys: UserJourney[];
};

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6"];
const PIE_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#6366f1"];

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${encodeURIComponent(seed)}`;
}

function formatNumber(n: number) {
  return n.toLocaleString("en-IN");
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

function daysAgoLabel(days: number) {
  if (days === 1) return "Today";
  if (days === 7) return "This Week";
  if (days === 30) return "This Month";
  return `Last ${days}d`;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [journeyView, setJourneyView] = useState<"sessions" | "users">("sessions");
  const [selectedJourney, setSelectedJourney] = useState<SessionJourney | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserJourney | null>(null);

  const fetchStats = useCallback(async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?days=${d}`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Failed to fetch analytics", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(days); }, [days, fetchStats]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
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

  const timelineData = stats.dailyTimeline.map((d) => ({ date: d._id, events: d.count }));
  const typeData = stats.eventsByType.map((d) => ({ name: d._id, value: d.count }));

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {daysAgoLabel(days)} &middot; Updated {lastUpdated || "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                days === d
                  ? "bg-emerald-600 text-white"
                  : "border border-black/10 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {d === 1 ? "Today" : `${d}d`}
            </button>
          ))}
          <a
            href={`/api/analytics/export?days=${days}&format=csv`}
            download
            className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Download CSV
          </a>
          <button
            onClick={() => fetchStats(days)}
            className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Today Events" value={formatNumber(stats.todayEvents)} sub={`${formatNumber(stats.todaySessions)} sessions`} />
        <SummaryCard label="All Events" value={formatNumber(stats.totalEvents)} sub={`${daysAgoLabel(days)}`} />
        <SummaryCard label="Unique Visitors" value={formatNumber(stats.uniqueVisitors)} sub={`distinct visitor IDs`} />
        <SummaryCard label="Page Views" value={formatNumber(stats.pageViews)} sub={`${daysAgoLabel(days)}`} />
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="WhatsApp Clicks"
          value={formatNumber(stats.whatsappClicks)}
          sub={`${daysAgoLabel(days)}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          }
        />
        <MetricCard
          label="File Downloads"
          value={formatNumber(stats.fileDownloads)}
          sub={`${daysAgoLabel(days)}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          }
        />
        <MetricCard
          label="Sales Page Views"
          value={formatNumber(stats.salesPageViews)}
          sub={`${daysAgoLabel(days)}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          }
        />
        <MetricCard
          label="Conversions"
          value={formatNumber(stats.conversions)}
          sub={`${stats.totalSessions > 0 ? Math.round(stats.conversions / stats.totalSessions * 100) + "% of sessions" : "—"}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
          }
        />
      </div>

      {/* AI Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
        <MetricCard
          label="AI Conversations"
          value={formatNumber(stats.aiConversations)}
          sub={`${daysAgoLabel(days)}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
          }
        />
        <MetricCard
          label="AI Messages"
          value={formatNumber(stats.aiMessages)}
          sub={`${stats.aiConversations > 0 ? Math.round(stats.aiMessages / stats.aiConversations) + " avg per chat" : "—"}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          }
        />
        <MetricCard
          label="Ask Questions"
          value={formatNumber(stats.eventsByType.find(e => e._id === "ask_question")?.count || 0)}
          sub={`${daysAgoLabel(days)}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Daily Timeline */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Events Over Time</h2>
          <p className="mb-6 text-xs text-zinc-400">Daily event count</p>
          {timelineData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 13 }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="events" stroke="#059669" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Event Type Breakdown */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Events by Type</h2>
          <p className="mb-6 text-xs text-zinc-400">Breakdown of all events</p>
          {typeData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 13 }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tables Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Top Pages</h2>
          <p className="mb-4 text-xs text-zinc-400">Most visited pages</p>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-zinc-400">No data yet</p>
          ) : (
            <div className="space-y-2">
              {stats.topPages.slice(0, 10).map((page, i) => (
                <div key={page._id} className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm">
                  <span className="w-5 text-xs font-medium text-zinc-400">{i + 1}</span>
                  <span className="flex-1 truncate font-mono text-xs text-zinc-700">{page._id || "/"}</span>
                  <span className="shrink-0 font-semibold text-emerald-700">{formatNumber(page.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Clicks */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Top Clicks</h2>
          <p className="mb-4 text-xs text-zinc-400">Most clicked elements</p>
          {stats.topClicks.length === 0 ? (
            <p className="text-sm text-zinc-400">No data yet</p>
          ) : (
            <div className="space-y-2">
              {stats.topClicks.slice(0, 10).map((click, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm">
                  <span className="w-5 text-xs font-medium text-zinc-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium text-zinc-800">
                      {click._id.text || click._id.trackAttr || "(no text)"}
                    </p>
                    {click._id.url && (
                      <p className="truncate text-[10px] text-zinc-400">{click._id.url}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-semibold text-emerald-700">{formatNumber(click.count)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Journey Toggle */}
      {(stats.sessionJourneys?.length > 0 || stats.userJourneys?.length > 0) && (
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setJourneyView("sessions")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              journeyView === "sessions"
                ? "bg-emerald-600 text-white"
                : "border border-black/10 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            Sessions ({stats.sessionJourneys?.length || 0})
          </button>
          <button
            onClick={() => setJourneyView("users")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              journeyView === "users"
                ? "bg-emerald-600 text-white"
                : "border border-black/10 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            Returning Users ({stats.userJourneys?.length || 0})
          </button>
        </div>
      )}

      {/* Session Journeys */}
      {journeyView === "sessions" && stats.sessionJourneys && stats.sessionJourneys.length > 0 && (
        <>
          <JourneyDetailModal
            session={selectedJourney}
            onClose={() => setSelectedJourney(null)}
          />
          <div className="mb-8">
            <h2 className="mb-1 text-sm font-semibold text-zinc-900">Session Journeys</h2>
            <p className="mb-4 text-xs text-zinc-400">Click a session to see the full event trace</p>
            <div className="grid gap-3">
              {stats.sessionJourneys.map((session) => {
                const duration = session.firstEvent && session.lastEvent
                  ? Math.round((new Date(session.lastEvent).getTime() - new Date(session.firstEvent).getTime()) / 1000)
                  : 0;
                const pages = [...new Set(session.events.map(e => e.pagePath))];
                const hasConversion = session.events.some(e =>
                  e.event === "click" && (
                    (e.metadata as any)?.trackAttr?.includes("bundle") ||
                    (e.metadata as any)?.trackAttr?.includes("download") ||
                    (e.metadata as any)?.trackAttr?.includes("purchase")
                  ) ||
                  e.event === "form_submit" ||
                  e.event === "dialog_submit"
                );
                return (
                  <button
                    key={session.sessionId}
                    onClick={() => setSelectedJourney(session)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dicebearUrl(session.sessionId)} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="font-mono text-zinc-500">{session.sessionId.slice(0, 12)}…</span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500">{session.deviceType}</span>
                        {hasConversion && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">Converted</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        {session.eventCount} events · {pages.length} page{pages.length !== 1 ? "s" : ""} · {duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`}
                        {session.events[0] && <> · Entry: <span className="font-mono">{session.events[0].pagePath}</span></>}
                        {session.events[session.events.length - 1] && session.events[session.events.length - 1].event === "page_exit" && <> · Exited</>}
                      </p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* User Journeys (by visitorId) */}
      {journeyView === "users" && stats.userJourneys && stats.userJourneys.length > 0 && (
        <>
          <UserJourneyModal
            userData={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
          <div className="mb-8">
            <h2 className="mb-1 text-sm font-semibold text-zinc-900">Returning Users</h2>
            <p className="mb-4 text-xs text-zinc-400">Users tracked across multiple sessions via cookie-based ID</p>
            <div className="grid gap-3">
              {stats.userJourneys.map((user) => {
                const duration = user.firstEvent && user.lastEvent
                  ? Math.round((new Date(user.lastEvent).getTime() - new Date(user.firstEvent).getTime()) / 1000)
                  : 0;
                const pages = [...new Set(user.events.map(e => e.pagePath))];
                const hasConversion = user.events.some(e =>
                  e.event === "whatsapp_click" ||
                  e.event === "file_download" ||
                  e.event === "form_submit" ||
                  e.event === "dialog_submit" ||
                  (e.event === "click" && (
                    (e.metadata as any)?.trackAttr?.includes("bundle") ||
                    (e.metadata as any)?.trackAttr?.includes("download") ||
                    (e.metadata as any)?.trackAttr?.includes("purchase")
                  ))
                );
                const uniqueSessions = [...new Set(user.events.map(e => e.sessionId || ""))].filter(Boolean);
                return (
                  <button
                    key={user.visitorId}
                    onClick={() => setSelectedUser(user)}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dicebearUrl(user.visitorId)} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="font-mono text-emerald-700">{user.visitorId.slice(0, 14)}…</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">{uniqueSessions.length} session{uniqueSessions.length !== 1 ? "s" : ""}</span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500">{user.deviceType}</span>
                        {hasConversion && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">Converted</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        {user.eventCount} events · {pages.length} page{pages.length !== 1 ? "s" : ""} · {duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`}
                        {user.events[0] && <> · First seen: <span className="font-mono">{user.events[0].pagePath}</span></>}
                      </p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Recent Events */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">Recent Events</h2>
        <p className="mb-4 text-xs text-zinc-400">Latest 50 events</p>
        {stats.recentEvents.length === 0 ? (
          <p className="text-sm text-zinc-400">No events yet</p>
        ) : (
          <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] text-zinc-400">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Event</th>
                  <th className="pb-2 pr-4 font-medium">Visitor</th>
                  <th className="pb-2 pr-4 font-medium">Page</th>
                  <th className="pb-2 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEvents.map((ev) => {
                  const vid = (ev as any).visitorId || "";
                  return (
                  <tr key={ev._id} className="border-b border-black/[0.03] hover:bg-zinc-50">
                    <td className="py-2 pr-4 text-zinc-400 whitespace-nowrap">{timeAgo(ev.timestamp)}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                        {ev.event}
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-mono text-zinc-400">
                      {vid ? vid.slice(0, 10) + "…" : "—"}
                    </td>
                    <td className="max-w-[150px] truncate py-2 pr-4 font-mono text-zinc-600">{ev.pagePath}</td>
                    <td className="max-w-[150px] truncate py-2 text-zinc-500">
                      {ev.event === "click"
                        ? String(ev.metadata?.linkText || ev.metadata?.trackAttr || "")
                        : ev.event === "whatsapp_click"
                        ? `→ ${ev.metadata?.tier} (${ev.metadata?.location})`
                        : ev.event === "file_download"
                        ? String(ev.metadata?.topperName || ev.metadata?.trackAttr || "")
                        : ev.event === "scroll_depth"
                        ? `Depth: ${ev.metadata?.depth}`
                        : ev.event === "page_view"
                        ? String(ev.metadata?.title || "")
                        : ev.event === "form_submit"
                        ? String(ev.metadata?.formText || "")
                        : ev.event === "page_exit"
                        ? `Time: ${ev.metadata?.timeOnPage}`
                        : ""}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function UserJourneyModal({ userData, onClose }: { userData: UserJourney | null; onClose: () => void }) {
  if (!userData) return null;

  const duration = userData.firstEvent && userData.lastEvent
    ? Math.round((new Date(userData.lastEvent).getTime() - new Date(userData.firstEvent).getTime()) / 1000)
    : 0;
  const pages = [...new Set(userData.events.map(e => e.pagePath))];
  const uniqueSessions = [...new Set(userData.events.map(e => e.sessionId || ""))].filter(Boolean);
  const hasConversion = userData.events.some(e =>
    e.event === "whatsapp_click" ||
    e.event === "file_download" ||
    e.event === "form_submit" ||
    e.event === "dialog_submit" ||
    (e.event === "click" && (
      (e.metadata as any)?.trackAttr?.includes("bundle") ||
      (e.metadata as any)?.trackAttr?.includes("download") ||
      (e.metadata as any)?.trackAttr?.includes("purchase")
    ))
  );
  const avatarUrl = dicebearUrl(userData.visitorId);

  // deduplicate consecutive scroll_depth events
  const cleaned: typeof userData.events = [];
  for (const ev of userData.events) {
    if (ev.event === "scroll_depth") {
      const last = cleaned[cleaned.length - 1];
      if (last && last.event === "scroll_depth") continue;
    }
    cleaned.push(ev);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[80vh] sm:max-w-2xl sm:rounded-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-black/[0.06] bg-white/90 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold">User Journey</p>
                <p className="text-xs text-zinc-400 font-mono">{userData.visitorId.slice(0, 20)}…</p>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">{uniqueSessions.length} session{uniqueSessions.length !== 1 ? "s" : ""}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{userData.deviceType}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{userData.eventCount} events</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{pages.length} page{pages.length !== 1 ? "s" : ""}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`}</span>
            {hasConversion && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">Converted</span>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          {cleaned.length === 0 ? (
            <p className="text-sm text-zinc-400">No events for this user</p>
          ) : (
            <div className="relative ml-2 space-y-0">
              {cleaned.map((ev, i) => (
                <div key={i} className="flex gap-3 pb-2">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      ev.event === "page_view" ? "bg-blue-500" :
                      ev.event === "click" ? (ev.metadata as any)?.trackAttr?.includes("purchase") ? "bg-emerald-500" : "bg-amber-400" :
                      ev.event === "whatsapp_click" ? "bg-green-500" :
                      ev.event === "file_download" ? "bg-blue-400" :
                      ev.event === "form_submit" || ev.event === "dialog_submit" ? "bg-emerald-500" :
                      ev.event === "dialog_open" || ev.event === "dialog_close" ? "bg-violet-400" :
                      ev.event === "ask_question" || ev.event === "ask_response" ? "bg-purple-500" :
                      ev.event === "page_exit" ? "bg-red-400" :
                      ev.event === "scroll_depth" ? "bg-zinc-300" :
                      "bg-zinc-300"
                    }`} />
                    {i < cleaned.length - 1 && <div className="w-px flex-1 bg-zinc-100" />}
                  </div>
                  <div className="min-w-0 pb-3 text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-semibold ${
                        ev.event === "page_view" ? "text-blue-600" :
                        ev.event === "click" ? "text-amber-700" :
                        ev.event === "whatsapp_click" ? "text-green-700" :
                        ev.event === "file_download" ? "text-blue-600" :
                        ev.event === "ask_question" || ev.event === "ask_response" ? "text-purple-600" :
                        ev.event === "form_submit" || ev.event === "dialog_submit" ? "text-emerald-700" :
                        ev.event === "page_exit" ? "text-red-600" :
                        "text-zinc-700"
                      }`}>{ev.event}</span>
                      <span className="text-xs text-zinc-400">{timeAgo(ev.timestamp)}</span>
                    </div>
                    {ev.sessionId && <p className="mt-0.5 text-[10px] font-mono text-zinc-300">session: {ev.sessionId.slice(0, 12)}…</p>}
                    <div className="mt-0.5 space-y-0.5 text-xs text-zinc-500">
                      {ev.pagePath && <p className="font-mono">{ev.pagePath}</p>}
                      {ev.event === "click" && (ev.metadata as any)?.linkText && (
                        <p>→ {(ev.metadata as any).linkText} {(ev.metadata as any)?.trackAttr ? <span className="text-zinc-400">[{(ev.metadata as any).trackAttr}]</span> : ""}</p>
                      )}
                      {ev.event === "whatsapp_click" && <p>→ {(ev.metadata as any)?.tier} <span className="text-zinc-400">[{(ev.metadata as any)?.location}]</span></p>}
                      {ev.event === "file_download" && <p>→ {(ev.metadata as any)?.topperName || (ev.metadata as any)?.fileType || ""}</p>}
                      {ev.event === "form_submit" && <p>→ {(ev.metadata as any)?.formText || (ev.metadata as any)?.formLabel || ""}</p>}
                      {ev.event === "dialog_submit" && <p>→ {(ev.metadata as any)?.dialog} ({(ev.metadata as any)?.status})</p>}
                      {ev.event === "dialog_open" && <p>→ {(ev.metadata as any)?.dialog}</p>}
                      {ev.event === "dialog_close" && <p>→ {(ev.metadata as any)?.dialog}</p>}
                      {ev.event === "scroll_depth" && <p>Depth: {(ev.metadata as any)?.depth}</p>}
                      {ev.event === "page_exit" && <p>{(ev.metadata as any)?.timeOnPage ? `After ${(ev.metadata as any).timeOnPage}` : ""}</p>}
                      {ev.event === "ask_question" && <p>→ {(ev.metadata as any)?.messageLength} chars</p>}
                      {ev.event === "ask_response" && <p>→ {(ev.metadata as any)?.responseLength} chars response</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>
    </div>
  );
}

function MetricCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-emerald-700">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      <p className="mt-0.5 text-xs text-emerald-600">{sub}</p>
    </div>
  );
}

function JourneyDetailModal({ session, onClose }: { session: SessionJourney | null; onClose: () => void }) {
  if (!session) return null;

  const duration = session.firstEvent && session.lastEvent
    ? Math.round((new Date(session.lastEvent).getTime() - new Date(session.firstEvent).getTime()) / 1000)
    : 0;
  const pages = [...new Set(session.events.map(e => e.pagePath))];
  const hasConversion = session.events.some(e =>
    e.event === "click" && (
      (e.metadata as any)?.trackAttr?.includes("bundle") ||
      (e.metadata as any)?.trackAttr?.includes("download") ||
      (e.metadata as any)?.trackAttr?.includes("purchase")
    ) ||
    e.event === "form_submit" ||
    e.event === "dialog_submit"
  );
  const avatarUrl = dicebearUrl(session.sessionId);

  // deduplicate consecutive scroll_depth events
  const cleaned: typeof session.events = [];
  for (const ev of session.events) {
    if (ev.event === "scroll_depth") {
      const last = cleaned[cleaned.length - 1];
      if (last && last.event === "scroll_depth") continue;
    }
    cleaned.push(ev);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[80vh] sm:max-w-2xl sm:rounded-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-black/[0.06] bg-white/90 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold">Session Journey</p>
                <p className="text-xs text-zinc-400 font-mono">{session.sessionId.slice(0, 16)}…</p>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{session.deviceType}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{session.eventCount} events</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{pages.length} page{pages.length !== 1 ? "s" : ""}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">{duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`}</span>
            {hasConversion && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">Converted</span>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          {cleaned.length === 0 ? (
            <p className="text-sm text-zinc-400">No events in this session</p>
          ) : (
            <div className="relative ml-2 space-y-0">
              {cleaned.map((ev, i) => (
                <div key={i} className="flex gap-3 pb-2">
                  <div className="flex flex-col items-center">
                    <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      ev.event === "page_view" ? "bg-blue-500" :
                      ev.event === "click" ? (ev.metadata as any)?.trackAttr?.includes("purchase") ? "bg-emerald-500" : "bg-amber-400" :
                      ev.event === "form_submit" || ev.event === "dialog_submit" ? "bg-emerald-500" :
                      ev.event === "dialog_open" || ev.event === "dialog_close" ? "bg-violet-400" :
                      ev.event === "purchase_product_select" || ev.event === "purchase_form_submit" || ev.event === "purchase_completed" ? "bg-emerald-500" :
                      ev.event === "page_exit" ? "bg-red-400" :
                      ev.event === "scroll_depth" ? "bg-zinc-300" :
                      ev.event === "form_field_focus" ? "bg-zinc-300" :
                      "bg-zinc-300"
                    }`} />
                    {i < cleaned.length - 1 && <div className="w-px flex-1 bg-zinc-100" />}
                  </div>
                  <div className="min-w-0 pb-3 text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-semibold ${
                        ev.event === "page_view" ? "text-blue-600" :
                        ev.event === "click" ? "text-amber-700" :
                        ev.event === "form_submit" || ev.event === "dialog_submit" || ev.event === "purchase_completed" ? "text-emerald-700" :
                        ev.event === "page_exit" ? "text-red-600" :
                        "text-zinc-700"
                      }`}>{ev.event}</span>
                      <span className="text-xs text-zinc-400">{timeAgo(ev.timestamp)}</span>
                    </div>
                    <div className="mt-0.5 space-y-0.5 text-xs text-zinc-500">
                      {ev.pagePath && <p className="font-mono">{ev.pagePath}</p>}
                      {ev.event === "click" && (ev.metadata as any)?.linkText && (
                         <p>→ {(ev.metadata as any).linkText} {(ev.metadata as any)?.trackAttr ? <span className="text-zinc-400">[{(ev.metadata as any).trackAttr}]</span> : ""}</p>
                       )}
                       {ev.event === "whatsapp_click" && <p>→ {(ev.metadata as any)?.tier} <span className="text-zinc-400">[{(ev.metadata as any)?.location}]</span></p>}
                       {ev.event === "file_download" && <p>→ {(ev.metadata as any)?.topperName || (ev.metadata as any)?.fileType || ""}</p>}
                       {ev.event === "form_submit" && <p>→ {(ev.metadata as any)?.formText || (ev.metadata as any)?.formLabel || ""}</p>}
                      {ev.event === "dialog_submit" && <p>→ {(ev.metadata as any)?.dialog} ({(ev.metadata as any)?.status})</p>}
                      {ev.event === "dialog_open" && <p>→ {(ev.metadata as any)?.dialog}</p>}
                      {ev.event === "dialog_close" && <p>→ {(ev.metadata as any)?.dialog}</p>}
                      {ev.event === "scroll_depth" && <p>Depth: {(ev.metadata as any)?.depth}</p>}
                      {ev.event === "page_exit" && <p>{(ev.metadata as any)?.timeOnPage ? `After ${(ev.metadata as any).timeOnPage}` : ""}</p>}
                      {ev.event === "purchase_product_select" && <p>→ {(ev.metadata as any)?.product}</p>}
                      {ev.event === "purchase_form_submit" && <p>→ {(ev.metadata as any)?.product}</p>}
                      {ev.event === "purchase_completed" && <p>→ {(ev.metadata as any)?.product}</p>}
                      {ev.event === "purchase_modal_open" && <p>→ {(ev.metadata as any)?.product}</p>}
                      {ev.event === "purchase_modal_close" && <p>→ {(ev.metadata as any)?.product} (step: {(ev.metadata as any)?.step})</p>}
                      {ev.event === "purchase_form_focus" && <p>→ {(ev.metadata as any)?.field}</p>}
                      {ev.event === "purchase_screenshot_upload" && <p>→ {(ev.metadata as any)?.hasFile ? "Uploaded" : "Cleared"}</p>}
                      {ev.event === "purchase_submit_start" && <p>Verifying payment…</p>}
                      {ev.event === "form_field_focus" && <p>→ {(ev.metadata as any)?.dialog || (ev.metadata as any)?.field}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
