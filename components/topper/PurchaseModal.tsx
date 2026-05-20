"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md rounded-[32px] border-border/50 shadow-2xl">
        <CardContent className="p-8">
          {step === "done" ? (
            <div className="text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-3xl text-primary">
                &#10003;
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">Request Received!</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                We&apos;ll reach out to you within 24 hours with payment details
                and access instructions for <strong>{pkg.name}</strong>.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check your email and phone for updates.
              </p>
              <Button
                onClick={onClose}
                className="mt-8 rounded-full px-8"
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Complete Purchase
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">₹{pkg.price}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                >
                  &#10005;
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+91 "
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 rounded-2xl"
                  />
                </div>

                {errMsg && (
                  <p className="text-sm text-destructive">{errMsg}</p>
                )}

                <Button
                  type="submit"
                  disabled={step === "submitting"}
                  className="w-full rounded-full py-4"
                >
                  {step === "submitting" ? "Submitting..." : `Buy ${pkg.name} — ₹${pkg.price}`}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
