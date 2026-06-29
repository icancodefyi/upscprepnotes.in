"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function HeroLeadForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/hero-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero_form" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-6 space-y-3">
        <div className="rounded-xl border-2 border-black bg-white p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C4F9D7] border border-black">
              <Check size={15} className="text-black" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">Check your email!</p>
              <p className="text-xs text-gray-500 mt-0.5">
                We&apos;ve sent your free <span className="font-semibold">Government Schemes</span> compendium (worth ₹99).
              </p>
            </div>
          </div>
        </div>
        <a
          href="https://t.me/+VYMxrig-a8AzZmNl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border-2 border-[#0088cc]/30 bg-[#e8f4fd] px-4 py-3 text-xs font-semibold text-[#0088cc] transition hover:bg-[#d4edfc]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Join 100+ aspirants on Telegram for daily current affairs →
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-[#C4F9D7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black border border-black">
          Free
        </span>
        <span className="text-sm font-medium text-gray-600">
          Get our <span className="font-bold text-black">Government Schemes</span> compendium free <span className="text-gray-400 line-through">₹99</span>
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-full border-2 border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {status === "loading" ? (
            "Sending..."
          ) : (
            <>
              Get Free PDF <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}