"use client";

import { useState, useEffect, useCallback } from "react";

type FeedbackItem = {
  _id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  url: string;
  status: string;
  createdAt: string;
};

type FeedbackResponse = {
  items: FeedbackItem[];
  total: number;
  page: number;
  totalPages: number;
};

const TYPE_LABELS: Record<string, string> = {
  complaint: "Complaint",
  suggestion: "Suggestion",
  bug: "Bug",
  correction: "Correction",
  other: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-red-50 text-red-700",
  read: "bg-amber-50 text-amber-700",
  responded: "bg-emerald-50 text-emerald-700",
};

function FeedbackRow({ item, onStatusChange }: { item: FeedbackItem; onStatusChange: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="border-b border-black/[0.04] hover:bg-zinc-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="whitespace-nowrap p-4 text-xs text-zinc-500">
          {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </td>
        <td className="p-4">
          <span className="text-xs text-zinc-700">{item.name || "\u2014"}</span>
        </td>
        <td className="p-4 text-xs text-zinc-600">{item.email}</td>
        <td className="p-4">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-600">
            {TYPE_LABELS[item.type] || item.type}
          </span>
        </td>
        <td className="max-w-[200px] truncate p-4 text-xs text-zinc-500">{item.message}</td>
        <td className="p-4">
          <select
            value={item.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(item._id, e.target.value)}
            className={`rounded-lg border-0 px-2 py-1 text-[10px] font-medium ${STATUS_COLORS[item.status]} focus:outline-none`}
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-black/[0.04] bg-zinc-50">
          <td colSpan={6} className="p-4">
            <div className="space-y-2 text-xs text-zinc-600">
              <p className="whitespace-pre-wrap">{item.message}</p>
              {item.url && (
                <p className="text-zinc-400">
                  Page:{" "}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2">
                    {item.url}
                  </a>
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminFeedbackPage() {
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/feedback?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch {} finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch(`/api/feedback`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchFeedback();
    } catch {}
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Feedback</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {data ? `${data.total} submission${data.total !== 1 ? "s" : ""}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 focus:outline-none"
          >
            <option value="">All status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
          <button
            type="button"
            onClick={fetchFeedback}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-[32px] border border-black/[0.06] bg-white p-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="rounded-[32px] border border-black/[0.06] bg-white p-16 text-center">
          <p className="text-lg text-zinc-500">No feedback yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[32px] border border-black/[0.06] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="p-4 font-semibold text-xs">Date</th>
                <th className="p-4 font-semibold text-xs">Name</th>
                <th className="p-4 font-semibold text-xs">Email</th>
                <th className="p-4 font-semibold text-xs">Type</th>
                <th className="p-4 font-semibold text-xs">Message</th>
                <th className="p-4 font-semibold text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <FeedbackRow key={item._id} item={item} onStatusChange={handleStatusChange} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
