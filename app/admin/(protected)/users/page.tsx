"use client";

import { useState, useEffect, useCallback } from "react";

type UserSummary = {
  name: string;
  email: string;
  firstSeen: string;
  lastSeen: string;
  sources: string[];
  downloads: number;
  feedbacks: number;
  orders: number;
  nurtureStep: number;
  tags: string[];
  toppers: string[];
  events: number;
};

type UsersResponse = {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  users: UserSummary[];
};

const TAG_COLORS: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  lead: "bg-blue-50 text-blue-700",
  feedback: "bg-amber-50 text-amber-700",
  nurture_completed: "bg-purple-50 text-purple-700",
};

const SOURCE_LABELS: Record<string, string> = {
  free_download: "Download",
  free_guide: "Guide",
  free_material: "Material",
  copy_request: "Copy Req",
  customer: "Customer",
  order: "Order",
  subscriber: "Subscriber",
  feedback: "Feedback",
  nurture: "Nurture",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function timeSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

function getInitials(name: string, email: string) {
  const s = name || email;
  return s.charAt(0).toUpperCase();
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const [slideoverUser, setSlideoverUser] = useState<UserSummary | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTarget, setEmailTarget] = useState<UserSummary | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sourceFilter) params.set("source", sourceFilter);
      if (sort) params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "25");

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch {} finally {
      setLoading(false);
    }
  }, [search, sourceFilter, sort, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  function openSlideover(user: UserSummary) {
    setSlideoverUser(user);
  }

  function openEmailModal(user: UserSummary) {
    setEmailTarget(user);
    setShowEmailModal(true);
  }

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {data ? `${total} total user${total !== 1 ? "s" : ""}` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email, name, topper..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-zinc-400"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </form>

        <select
          value={sourceFilter}
          onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-600 outline-none transition focus:border-zinc-400"
        >
          <option value="">All sources</option>
          <option value="free_download">Downloads</option>
          <option value="free_guide">Guides</option>
          <option value="free_material">Materials</option>
          <option value="order">Orders</option>
          <option value="feedback">Feedback</option>
          <option value="subscriber">Subscribers</option>
        </select>

        <select
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1); }}
          className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-600 outline-none transition focus:border-zinc-400"
        >
          <option value="recent">Most recent</option>
          <option value="downloads">Most downloads</option>
          <option value="orders">Most orders</option>
        </select>

        <button
          onClick={fetchUsers}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center rounded-[24px] border border-zinc-100 bg-white p-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
        </div>
      ) : !data || data.users.length === 0 ? (
        <div className="rounded-[24px] border border-zinc-100 bg-white p-16 text-center">
          <p className="text-zinc-400">No users found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-[24px] border border-zinc-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="p-4 font-semibold text-xs text-zinc-500">User</th>
                    <th className="p-4 font-semibold text-xs text-zinc-500">Sources</th>
                    <th className="p-4 font-semibold text-xs text-zinc-500">Activity</th>
                    <th className="p-4 font-semibold text-xs text-zinc-500">Last seen</th>
                    <th className="p-4 font-semibold text-xs text-zinc-500">Tags</th>
                    <th className="p-4 font-semibold text-xs text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr
                      key={user.email}
                      className="border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/50 transition cursor-pointer"
                      onClick={() => openSlideover(user)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                            {getInitials(user.name, user.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-800">{user.name || "—"}</p>
                            <p className="truncate text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {user.sources.slice(0, 3).map(s => (
                            <span key={s} className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                              {SOURCE_LABELS[s] || s}
                            </span>
                          ))}
                          {user.sources.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-400">
                              +{user.sources.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3 text-xs text-zinc-600">
                          <span title="Downloads">{user.downloads} DL</span>
                          <span title="Feedbacks">{user.feedbacks} FB</span>
                          {user.orders > 0 && <span className="font-semibold text-emerald-600">{user.orders} ORD</span>}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-zinc-500 whitespace-nowrap">
                        {timeSince(user.lastSeen)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {user.tags.map(tag => (
                            <span key={tag} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag] || "bg-zinc-100 text-zinc-600"}`}>
                              {tag.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openSlideover(user); }}
                            className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEmailModal(user); }}
                            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
                          >
                            Email
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Slideover */}
      {slideoverUser && (
        <UserSlideover
          user={slideoverUser}
          onClose={() => setSlideoverUser(null)}
          onSendEmail={(user) => { setSlideoverUser(null); openEmailModal(user); }}
        />
      )}

      {/* Email Modal */}
      {showEmailModal && emailTarget && (
        <SendEmailModal
          user={emailTarget}
          onClose={() => { setShowEmailModal(false); setEmailTarget(null); }}
          onSent={() => { setShowEmailModal(false); setEmailTarget(null); }}
        />
      )}
    </div>
  );
}

/* ===== User Slideover ===== */

function UserSlideover({
  user,
  onClose,
  onSendEmail,
}: {
  user: UserSummary;
  onClose: () => void;
  onSendEmail: (user: UserSummary) => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-white shadow-xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              {getInitials(user.name, user.email)}
            </div>
            <div>
              <p className="font-semibold text-zinc-800">{user.name || "—"}</p>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendEmail(user)}
              className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800"
            >
              Send Email
            </button>
            <button onClick={onClose} className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-100 px-6">
          {(["overview", "activity"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab === "overview" ? "Overview" : "Activity"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Downloads", value: user.downloads },
                  { label: "Orders", value: user.orders },
                  { label: "Feedback", value: user.feedbacks },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 text-center">
                    <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">First seen</span>
                    <span className="font-medium text-zinc-800">{formatDate(user.firstSeen)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last seen</span>
                    <span className="font-medium text-zinc-800">{formatDate(user.lastSeen)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Nurture step</span>
                    <span className="font-medium text-zinc-800">{user.nurtureStep}/4</span>
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Sources</h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.sources.map(s => (
                    <span key={s} className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {SOURCE_LABELS[s] || s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {user.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.tags.map(tag => (
                      <span key={tag} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TAG_COLORS[tag] || "bg-zinc-100 text-zinc-700"}`}>
                        {tag.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Toppers */}
              {user.toppers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Toppers</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.toppers.map(t => (
                      <span key={t} className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { event: "first_seen", date: user.firstSeen, detail: "First appeared in database" },
                  { event: "last_seen", date: user.lastSeen, detail: "Last activity" },
                  ...user.toppers.map(t => ({ event: "download", date: "", detail: `Downloaded: ${t}` })),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-white p-3">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-zinc-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-700">{item.detail}</p>
                      {item.date && <p className="text-xs text-zinc-400">{timeSince(item.date)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}

/* ===== Send Email Modal ===== */

function SendEmailModal({
  user,
  onClose,
  onSent,
}: {
  user: UserSummary;
  onClose: () => void;
  onSent: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setError("");

    try {
      const html = body
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/_(.+?)_/g, "<em>$1</em>");

      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.email, subject, html: `<p>${html}</p>` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(onSent, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Send Email</h2>
              <p className="text-sm text-zinc-500">To: {user.email}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="font-medium text-emerald-800">Email sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Subject</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400"
                  placeholder="Subject line..."
                  required
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-600">Message</label>
                  <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className="text-xs text-zinc-400 hover:text-zinc-600 transition"
                  >
                    {preview ? "Edit" : "Preview"}
                  </button>
                </div>
                {preview ? (
                  <div
                    className="min-h-[160px] rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, "<br>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/_(.+?)_/g, "<em>$1</em>") }}
                  />
                ) : (
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 resize-y"
                    placeholder="Write your message... (use **bold** and _italic_ formatting)"
                    required
                  />
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !subject.trim() || !body.trim()}
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-40"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </span>
                  ) : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
