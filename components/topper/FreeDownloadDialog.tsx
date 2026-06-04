"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconDownload, IconMail, IconCheck, IconX } from "@tabler/icons-react";

interface FreeDownloadDialogProps {
  topperName: string;
  topperSlug: string;
  onOpenChange: (open: boolean) => void;
}

export function FreeDownloadDialog({ topperName, topperSlug, onOpenChange }: FreeDownloadDialogProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "sent" | "error">("form");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "" };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topperSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStep("error");
        return;
      }

      setPdfUrl(data.pdfUrl);
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

            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <IconDownload size={22} />
            </div>

            <h2 className="text-lg font-semibold">Download Free Answer Copy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email to get a free answer copy of <strong>{topperName}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
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
                className="w-full rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {loading ? "Sending..." : "Send Download Link →"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                We&apos;ll also send you the complete bundle offer. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}

        {step === "sent" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IconCheck size={26} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Check Your Inbox!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent the download link for <strong>{topperName}</strong> to your email.
            </p>
            <a
              href={pdfUrl}
              download
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <IconDownload size={16} />
              Download Now
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              Didn&apos;t receive it? Check spam or try the download button above.
            </p>
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
              className="mt-6 rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
