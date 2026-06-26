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
      <div className="mt-6 rounded-xl border-2 border-black bg-white p-4">
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