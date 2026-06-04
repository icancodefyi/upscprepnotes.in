"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconMail, IconCheck, IconX, IconBell } from "@tabler/icons-react";

interface RequestCopyDialogProps {
  topperName: string;
  topperSlug: string;
  onOpenChange: (open: boolean) => void;
}

export function RequestCopyDialog({ topperName, topperSlug, onOpenChange }: RequestCopyDialogProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "sent" | "error">("form");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "" };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/request-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topperSlug }),
      });

      if (!res.ok) {
        setStep("error");
        return;
      }

      setStep("sent");
    } catch {
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
        {step === "form" && (
          <>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <IconX size={18} />
            </button>

            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <IconBell size={22} />
            </div>

            <h2 className="text-lg font-semibold">Request Answer Copy</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              We don&apos;t have <strong>{topperName}&apos;s</strong> answer copy yet. Leave your email and we&apos;ll notify you the moment it&apos;s available.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="req-email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="req-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border/50 bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-amber-600 text-sm font-semibold text-white hover:bg-amber-700"
              >
                {loading ? "Sending..." : "Notify Me When Available →"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                We&apos;ll only email you once — when {topperName}&apos;s copy is ready.
              </p>
            </form>
          </>
        )}

        {step === "sent" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <IconCheck size={26} className="text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold">You&apos;re on the list!</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We&apos;ll email you at <strong>{email}</strong> the moment <strong>{topperName}&apos;s</strong> answer copy is available.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 rounded-full bg-amber-600 px-6 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Got it
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <IconX size={26} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">Please try again or email us at support@upscprepnotes.in</p>
            <Button
              onClick={() => setStep("form")}
              className="mt-6 rounded-full bg-amber-600 px-6 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
