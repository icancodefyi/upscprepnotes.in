"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { brandFonts } from "@/components/brand/fonts";

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

  const field = "mt-1.5 w-full bg-white px-5 text-m text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] outline-none placeholder:text-[var(--muted)] focus:shadow-[0_0_0_2px_var(--accent)]";
  const dialog = (
    <div className={`up ${brandFonts} fixed inset-0 z-[70] flex items-end justify-center bg-transparent sm:items-center sm:p-4`}>
      <div className="fixed inset-0 bg-[rgba(11,12,16,0.55)]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Send feedback"
        className="relative z-10 flex max-h-[92dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_24px_60px_-20px_rgba(11,12,16,0.45)] sm:rounded-[28px]"
      >
        <div className="flex items-center justify-between px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
          <h3 className="t-head text-l">{sent ? "Thank you" : "Send feedback"}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--canvas)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {sent ? (
          <div className="px-6 pb-8 pt-4 text-center sm:px-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="mt-4 text-m font-bold">We got your message</p>
            <p className="mt-1 text-s text-[var(--ink-2)]">We read all feedback and reply within 2-3 business days when needed.</p>
            <button type="button" onClick={() => { handleReset(); onClose(); }} className="btn btn-ink mt-6 h-11 justify-center px-8 [--btn-fs:14px]">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pb-8">
            <div>
              <label className="text-s font-bold">What is it about?</label>
              <select value={type} onChange={(e) => setType(e.target.value as FeedbackType)} className={`${field} h-12 rounded-full`}>
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-s font-bold">Name <span className="font-normal text-[var(--muted)]">(optional)</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className={`${field} h-12 rounded-full`} />
            </div>
            <div>
              <label className="text-s font-bold">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${field} h-12 rounded-full`} />
            </div>
            <div>
              <label className="text-s font-bold">Message</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what's on your mind" rows={5} className={`${field} resize-none rounded-[24px] py-3.5`} />
            </div>
            {error && <p className="text-s text-[var(--mark-deep)]" role="alert">{error}</p>}
            <button type="submit" disabled={sending || !email.trim() || !message.trim()} className="btn btn-blue h-12 w-full justify-center disabled:opacity-50 [--btn-fs:16px]">
              {sending ? "Sending..." : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return typeof document === "undefined" ? null : createPortal(dialog, document.body);
}
