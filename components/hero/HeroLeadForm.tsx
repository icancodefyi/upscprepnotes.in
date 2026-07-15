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
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-muted">
          <Check size={13} className="text-brand" />
        </span>
        <p className="text-xs font-medium">
          Sent! Check your inbox for the free <span className="font-bold">Govt Schemes</span> PDF.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:block">Free Govt Schemes PDF:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-foreground px-3.5 py-2 text-sm font-bold text-background transition hover:bg-foreground/90 disabled:opacity-50"
        >
          {status === "loading" ? "..." : <>Get <ArrowRight size={13} /></>}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-1.5 text-xs text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}
