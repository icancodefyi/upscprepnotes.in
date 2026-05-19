"use client";

import { useState, FormEvent } from "react";

interface Props {
  pkg: { name: string; price: string };
  onClose: () => void;
}

export default function PurchaseModal({ pkg, onClose }: Props) {
  const [step, setStep] = useState<"form" | "submitting" | "done" | "error">("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setErrMsg("All fields are required.");
      return;
    }

    setStep("submitting");

    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          package: pkg.name,
          amount: parseInt(pkg.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setStep("done");
    } catch {
      setErrMsg("Something went wrong. Please try again.");
      setStep("form");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[32px] border border-black/[0.06] bg-white p-8 shadow-2xl">
        {step === "done" ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">Request Received!</h3>
            <p className="mt-4 leading-7 text-zinc-600">
              We&apos;ll reach out to you within 24 hours with payment details
              and access instructions for <strong>{pkg.name}</strong>.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Check your email and phone for updates.
            </p>
            <button
              onClick={onClose}
              className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                  Complete Purchase
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{pkg.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">₹{pkg.price}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-sm transition hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Full Name</label>
                <input
                  type="text"
                  placeholder="Amit Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f8f7f4] px-5 py-3.5 text-sm outline-none transition focus:border-black/30"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Email Address</label>
                <input
                  type="email"
                  placeholder="amit@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f8f7f4] px-5 py-3.5 text-sm outline-none transition focus:border-black/30"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f8f7f4] px-5 py-3.5 text-sm outline-none transition focus:border-black/30"
                />
              </div>

              {errMsg && (
                <p className="text-sm text-red-500">{errMsg}</p>
              )}

              <button
                type="submit"
                disabled={step === "submitting"}
                className="w-full rounded-full bg-black py-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {step === "submitting" ? "Submitting..." : `Buy ${pkg.name} — ₹${pkg.price}`}
              </button>

              <p className="text-center text-xs text-zinc-400">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
