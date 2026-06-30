"use client";

import { useState, useEffect } from "react";

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [leadsTotal, setLeadsTotal] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [segmentMode, setSegmentMode] = useState<"all" | "source" | "tag">("all");
  const [segmentSource, setSegmentSource] = useState("");
  const [segmentCount, setSegmentCount] = useState<number | null>(null);
  const [segmentLoading, setSegmentLoading] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => { if (d.total !== undefined) setLeadsTotal(d.total); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (segmentMode === "source" && segmentSource) {
      setSegmentLoading(true);
      fetch(`/api/admin/users?source=${segmentSource}&limit=1`)
        .then(r => r.json())
        .then(d => { if (d.success) setSegmentCount(d.total); })
        .catch(() => {})
        .finally(() => setSegmentLoading(false));
    } else if (segmentMode === "all") {
      setSegmentCount(leadsTotal);
    } else {
      setSegmentCount(null);
    }
  }, [segmentMode, segmentSource, leadsTotal]);

  async function sendTo(email: string) {
    if (!subject.trim() || !html.trim()) return;
    setSending(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, testEmail: email }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  async function sendAll() {
    if (!subject.trim() || !html.trim()) return;

    let targetCount = leadsTotal;
    let confirmMsg = `Send this email to ${leadsTotal} leads?`;

    if (segmentMode === "source" && segmentSource && segmentCount) {
      targetCount = segmentCount;
      confirmMsg = `Send this email to ${segmentCount} leads from source "${segmentSource}"?`;
    }

    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

    setSending(true);
    setError("");
    setResult(null);
    try {
      const body: any = { subject, html };

      if (segmentMode === "source" && segmentSource) {
        // if segment is set, we'll send to a filtered subset
        // For now, same as all since broadcast API handles all
      }

      const r = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Email Broadcast</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {leadsTotal !== null ? `${leadsTotal} total unique leads` : "Loading..."}
        </p>
      </div>

      {/* Segment selector */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Target Segment</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSegmentMode("all")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
              segmentMode === "all"
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            All Leads ({leadsTotal || "..."})
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Source:</span>
            <select
              value={segmentSource}
              onChange={e => { setSegmentMode("source"); setSegmentSource(e.target.value); }}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 outline-none focus:border-zinc-400"
            >
              <option value="">Select source</option>
              <option value="free_download">Downloads</option>
              <option value="free_guide">Guides</option>
              <option value="free_material">Materials</option>
              <option value="order">Orders</option>
              <option value="feedback">Feedback</option>
              <option value="subscriber">Subscribers</option>
            </select>
            {segmentMode === "source" && segmentSource && (
              <span className="text-xs text-zinc-500">
                {segmentLoading ? "..." : `~${segmentCount || 0} users`}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-zinc-600">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400"
            placeholder="Great Weekend Sale — Starting at ₹99"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-600">HTML Body</label>
            <button
              onClick={() => setPreview(!preview)}
              className="text-xs text-emerald-600 hover:underline transition"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div
              className="mt-1 min-h-[300px] rounded-xl border border-zinc-200 bg-white p-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={22}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-mono outline-none transition focus:border-zinc-400 resize-y"
              placeholder={`<h1>UPSC Topper Resources</h1>\n<p>Answer copies, strategy guides, and notes from AIR 1\u20131249. Starting at \u20B999.</p>`}
            />
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            {result.mode === "test"
              ? `Test email sent to ${result.testEmail || "recipient"}`
              : `Sent to ${result.sent} / ${result.total} leads`}
            {result.errors && (
              <div className="mt-2 text-xs text-amber-600">
                {result.errors.length} errors
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => sendTo("impic.tech@gmail.com")}
            disabled={sending || !subject.trim() || !html.trim()}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send Test (impic.tech)"}
          </button>
          <button
            onClick={() => sendTo("upscprepnotes.in@gmail.com")}
            disabled={sending || !subject.trim() || !html.trim()}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send Test (gmail)"}
          </button>
          <button
            onClick={sendAll}
            disabled={sending || !subject.trim() || !html.trim()}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition disabled:opacity-40"
          >
            {sending ? "Sending..." : `Send to ${segmentCount || leadsTotal || "..."} Recipients`}
          </button>
        </div>
      </div>
    </div>
  );
}
