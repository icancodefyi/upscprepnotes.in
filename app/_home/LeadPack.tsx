"use client";

import { useState } from "react";
import Outline from "@/components/brand/Outline";

/** Lead magnet: posts to the existing /api/hero-lead, which emails the Government Schemes Compendium. */
export default function LeadPack() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/hero-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing_starter_pack", returnTo: window.location.pathname }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      // Send them to the "getting your files ready" page; the download is delivered there.
      const data = await res.json().catch(() => ({}));
      if (data.redirect) {
        window.location.assign(data.redirect);
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section>
      <div data-track-view="home_lead_pack" className="panel grain relative overflow-clip bg-[var(--accent)] px-6 py-16 text-white sm:px-14 sm:py-20">
        <Outline kind="envelope" className="-bottom-5 -left-5 h-48 w-72 rotate-[-8deg] text-white/[0.11]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="t-display h-sec">
              Start tonight, <span className="text-[var(--hl)]">for free.</span>
            </h2>
            <p className="mt-5 max-w-[30rem] text-m leading-[1.55] text-white/70">
              Get the Government Schemes Compendium: central schemes, ministry by ministry, with the facts prelims and mains ask for. We&apos;ll email you the PDF.
            </p>

            {status === "done" ? (
              <p className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-m font-bold text-[var(--accent)]">
                Sent. Check your inbox, and the Promotions or Spam folder.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-9 flex max-w-[30rem] items-center rounded-full bg-white p-1.5 pl-6 ">
                <label htmlFor="lead-email" className="sr-only">Email address</label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={status === "loading"}
                  className="min-w-0 flex-1 bg-transparent text-m text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                />
                <button type="submit" disabled={status === "loading"} data-track="try-lead-submit" className="btn btn-ink h-12">
                  {status === "loading" ? "Sending…" : "Send it"}
                </button>
              </form>
            )}
            {status === "error" && <p className="mt-3 text-s text-[var(--hl)]">That didn&apos;t go through. Try again in a moment.</p>}
            <p className="mt-4 text-s text-white/60">One email with the PDF, then occasional topper breakdowns. Unsubscribe any time.</p>
          </div>

          {/* The compendium as a physical document */}
          <div aria-hidden className="relative mx-auto h-[300px] w-full max-w-[360px]">
            {[2, 1, 0].map((k) => (
              <div
                key={k}
                className="absolute inset-x-6 top-0 h-[280px] rounded-[10px] bg-white shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)]"
                style={{ transform: `rotate(${k * 5 - 4}deg) translateY(${k * 8}px)`, opacity: 1 - k * 0.12 }}
              >
                {k === 0 && (
                  <div className="p-6 text-[var(--ink)]">
                    <p className="t-meta">UPSCPrepNotes</p>
                    <p className="t-display mt-3 text-m leading-[1.1]">Government Schemes Compendium</p>
                    <div className="mt-5 space-y-2">
                      {[90, 70, 84, 60, 76].map((w, i) => (
                        <span key={i} className="block h-2 rounded-full bg-[var(--canvas)]" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                    <span className="stamp absolute bottom-6 right-6 grid h-16 w-16 place-items-center rounded-full border-[2.5px] border-[var(--mark)] text-s font-bold text-[var(--mark)]" style={{ "--d": "300ms" } as React.CSSProperties}>
                      FREE
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
