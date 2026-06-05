"use client";

import { useState } from "react";
import { trackClientEvent } from "@/lib/client-analytics";

type FeedbackType = "complaint" | "suggestion" | "bug" | "correction" | "other";

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: "complaint", label: "Complaint" },
  { value: "correction", label: "Factual correction" },
  { value: "bug", label: "Bug report" },
  { value: "suggestion", label: "Feature suggestion" },
  { value: "other", label: "Other" },
];

export default function FeedbackDialog({
  open,
  onClose,
  prefilledUrl,
}: {
  open: boolean;
  onClose: () => void;
  prefilledUrl?: string;
}) {
  const [type, setType] = useState<FeedbackType>("other");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type,
          message: message.trim(),
          url: prefilledUrl || (typeof window !== "undefined" ? window.location.href : ""),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit");
      }

      trackClientEvent("feedback_submitted", { type });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setType("other");
    setEmail("");
    setName("");
    setMessage("");
    setSent(false);
    setError("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl mx-auto">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-800">
            {sent ? "Thanks!" : "Send feedback"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-800">We got your message</p>
            <p className="mt-1 text-xs text-zinc-500">We review all feedback and respond within 2-3 business days if needed.</p>
            <button
              type="button"
              onClick={() => { handleReset(); onClose(); }}
              className="mt-6 rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-500">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none"
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500">
                Name <span className="text-zinc-300">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-300 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500">Email <span className="text-red-400">*</span></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-300 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500">Message <span className="text-red-400">*</span></label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-300 focus:border-zinc-400 focus:outline-none resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending || !email.trim() || !message.trim()}
              className="w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
