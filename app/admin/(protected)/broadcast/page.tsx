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

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => { if (d.total !== undefined) setLeadsTotal(d.total); })
      .catch(() => {});
  }, []);

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
    const confirmed = window.confirm(`Send this email to ${leadsTotal} leads?`);
    if (!confirmed) return;
    setSending(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html }),
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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-bold">Email Broadcast</h1>
        {leadsTotal !== null && (
          <p className="text-xs text-zinc-500">{leadsTotal} unique leads</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-zinc-600">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            placeholder="Great Weekend Sale — Starting at ₹99"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-600">HTML Body</label>
            <button
              onClick={() => setPreview(!preview)}
              className="text-xs text-emerald-600 hover:underline"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div
              className="mt-1 min-h-[300px] rounded-lg border border-zinc-200 bg-white p-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={22}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-zinc-400"
              placeholder={`<h1>UPSC Topper Resources</h1>\n<p>Answer copies, strategy guides, and notes from AIR 1–1249. Starting at ₹99.</p>`}
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {result && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            {result.mode === "test"
              ? `✅ Test email sent to ${result.testEmail || "recipient"}`
              : `✅ Sent to ${result.sent} / ${result.total} leads`}
            {result.errors && (
              <div className="mt-2 text-xs text-amber-600">
                {result.errors.length} errors
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => sendTo("impic.tech@gmail.com")}
            disabled={sending || !subject.trim() || !html.trim()}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send to impic.tech"}
          </button>
          <button
            onClick={() => sendTo("upscprepnotes.in@gmail.com")}
            disabled={sending || !subject.trim() || !html.trim()}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send to upscprepnotes.in"}
          </button>
          <button
            onClick={sendAll}
            disabled={sending || !subject.trim() || !html.trim() || !leadsTotal}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
          >
            {sending ? "Sending..." : `Send to All (${leadsTotal || "..."})`}
          </button>
        </div>
      </div>
    </div>
  );
}
