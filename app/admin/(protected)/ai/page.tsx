"use client";

import { useEffect, useState, useCallback } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { slug: string; name: string }[];
};

type AnalyticsEvent = {
  _id: string;
  event: string;
  pagePath: string;
  timestamp: string;
  metadata: Record<string, unknown>;
};

type Conversation = {
  id: string;
  sessionId: string;
  title: string;
  messageCount: number;
  userMessages: number;
  assistantMessages: number;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  analyticsEvents: AnalyticsEvent[];
};

type ApiResponse = {
  success: boolean;
  conversations: Conversation[];
  total: number;
  page: number;
  totalPages: number;
};

function formatDate(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default function AdminAIPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Conversation | null>(null);

  const fetchData = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "50" });
      if (q) params.set("search", q);
      const res = await fetch(`/api/ai/admin/conversations?${params}`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (e) {
      console.error("Failed to load conversations", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, search);
  }, [page, fetchData]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchData(1, search);
  }

  const totalMessages = data?.conversations.reduce((s, c) => s + c.messageCount, 0) || 0;
  const totalUserMsgs = data?.conversations.reduce((s, c) => s + c.userMessages, 0) || 0;
  const avgMsgs = data?.conversations.length
    ? Math.round(totalMessages / data.conversations.length)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI Chats</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {data ? `${data.total} conversations` : "Loading..."}
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Conversations" value={String(data?.total || 0)} sub="All time" />
        <StatCard label="Total Messages" value={String(totalMessages)} sub={`${totalUserMsgs} from users`} />
        <StatCard label="Avg per Conversation" value={String(avgMsgs)} sub="Messages per chat" />
        <StatCard label="Active Today" value={String(data?.conversations.filter(c => {
          const d = new Date(c.updatedAt);
          const today = new Date();
          return d.toDateString() === today.toDateString();
        }).length || 0)} sub="Conversations updated today" />
      </div>

      {/* Conversation List */}
      {loading && !data ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      ) : data?.conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <p className="text-lg">No conversations found</p>
          <p className="mt-1 text-sm">{search ? "Try a different search term" : "Chats will appear here once users interact with Ask AI"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelected(selected?.id === conv.id ? null : conv)}
              className="group flex w-full items-start gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-sm font-bold text-emerald-700">
                {(conv.title || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-semibold text-zinc-800 truncate max-w-xs">
                    {conv.title}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500">
                    {conv.messageCount} msgs
                  </span>
                  <span className="text-zinc-400">{timeAgo(conv.updatedAt)}</span>
                </div>
                {conv.messages.length > 0 && (
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {conv.messages[conv.messages.length - 1].role === "user" ? "Q: " : "A: "}
                    {conv.messages[conv.messages.length - 1].content.slice(0, 120)}
                  </p>
                )}
              </div>
              <svg
                className={`mt-1 h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-500 ${
                  selected?.id === conv.id ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Chat Transcript Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[80vh] sm:max-w-3xl sm:rounded-3xl mx-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-black/[0.06] bg-white/90 backdrop-blur-sm px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{selected.title}</p>
                  <p className="text-xs text-zinc-400">
                    {selected.messageCount} messages · {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">Session: {selected.sessionId.slice(0, 16)}…</span>
                {selected.analyticsEvents.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                    {selected.analyticsEvents.filter(e => e.event === "checkout_completed").length} checkout completed
                  </span>
                )}
                {selected.analyticsEvents.filter(e => e.event === "file_download").length > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                    {selected.analyticsEvents.filter(e => e.event === "file_download").length} downloads
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 p-6">
              {selected.messages.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-8">No messages in this conversation</p>
              ) : (
                selected.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        {msg.content}
                      </div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className={`mt-2 flex flex-wrap gap-1.5 ${msg.role === "user" ? "text-emerald-200" : "text-zinc-400"}`}>
                          {msg.sources.map((s, j) => (
                            <span key={j} className="rounded-full bg-current/10 px-2 py-0.5 text-[10px] font-medium">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>
    </div>
  );
}
