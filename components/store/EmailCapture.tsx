"use client";

import { useState, FormEvent } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/store/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="flex items-center gap-3 rounded-[24px] bg-[#d4f1df] p-6 text-m font-bold text-[#14532d]">
          <span aria-hidden>✓</span>
          <span>You&rsquo;re subscribed! We&rsquo;ll notify you when new resources drop.</span>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1120px] px-6">
      <div data-track-view="store_email_band" className="relative grid gap-6 overflow-hidden rounded-[28px] bg-[var(--accent)] p-7 text-white sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
        <svg aria-hidden viewBox="0 0 200 140" className="pointer-events-none absolute -right-6 -top-8 hidden h-40 w-56 rotate-[12deg] text-white/10 md:block" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"><rect x="8" y="8" width="184" height="124" rx="10" /><path d="M10 14l90 66 90-66" /></svg>
        <div>
          <h3 className="t-head text-l">New resources every week</h3>
          <p className="mt-2 max-w-[34rem] text-m leading-[1.6] text-white/80">
            Get notified when we add new answer copies, notes bundles, and strategy reports.
          </p>
        </div>
        <div className="relative md:w-[400px]">
          <form onSubmit={handleSubmit} className="flex items-center rounded-full bg-white p-1.5 pl-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address"
              className="h-10 min-w-0 flex-1 bg-transparent text-m text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            />
            <button type="submit" disabled={status === "loading"} className="btn btn-ink h-10 shrink-0 px-5 [--btn-fs:14px]">
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          {status === "error" && <p className="mt-2 text-s text-white">Something went wrong. Try again.</p>}
        </div>
      </div>
    </section>
  );
}
