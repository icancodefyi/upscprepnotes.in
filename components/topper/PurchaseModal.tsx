"use client";

import { useState, FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  trackAddToCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
} from "@/lib/analytics";

const PRODUCTS = [
  {
    name: "Full Bundle (All Papers)",
    price: 999,
    desc: "All papers — best value",
    bestValue: true,
  },
  { name: "GS1 Compilation", price: 299, desc: "15+ answer copies", outOfStock: true },
  { name: "GS2 Compilation", price: 299, desc: "12+ answer copies", outOfStock: true },
  { name: "GS3 Compilation", price: 299, desc: "10+ answer copies", outOfStock: true },
  { name: "GS4 (Ethics) Compilation", price: 299, desc: "8+ answer copies", outOfStock: true },
  { name: "Essay Compilation", price: 299, desc: "10+ answer copies", outOfStock: true },
];

interface Props {
  onClose: () => void;
}

type Step = "select" | "form" | "submitting" | "payment" | "done";

function ProductCard({
  p,
  onSelect,
}: {
  p: (typeof PRODUCTS)[0];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={"outOfStock" in p && p.outOfStock}
      className={`group relative flex w-full items-center justify-between rounded-2xl border bg-card p-4 text-left shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:p-5 ${
        "outOfStock" in p && p.outOfStock
          ? "cursor-not-allowed border-zinc-200 opacity-50"
          : "border-border/50 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {"bestValue" in p && p.bestValue && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
          Best Value
        </span>
      )}
      <div className="min-w-0 flex-1 pr-4">
        <p className="text-sm font-semibold sm:text-base">{p.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {"outOfStock" in p && p.outOfStock ? "Out of stock" : p.desc}
        </p>
      </div>
      <div className="shrink-0 text-lg font-bold text-primary sm:text-xl">
        {"outOfStock" in p && p.outOfStock ? "—" : `₹${p.price}`}
      </div>
    </button>
  );
}

export default function PurchaseModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>("select");
  const [product, setProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  function selectProduct(p: (typeof PRODUCTS)[0]) {
    setProduct(p);
    setStep("form");
    trackAddToCart(p.name, p.price);
  }

  function handleBack() {
    if (step === "form") {
      setStep("select");
      setProduct(null);
    } else if (step === "payment") {
      setStep("form");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setErrMsg("All fields are required.");
      return;
    }

    setStep("payment");
    if (product) {
      trackBeginCheckout(product.name, product.price);
      trackAddPaymentInfo(product.name, product.price);
    }
  }

  async function handlePayAndUpload() {
    if (!product || !screenshotFile) {
      setErrMsg("Please upload your payment screenshot.");
      return;
    }

    setStep("submitting");
    setErrMsg("");

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", screenshotFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload screenshot");
      }

      const { url: screenshotUrl } = await uploadRes.json();

      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product: product.name,
          amount: product.price,
          screenshotUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setStep("done");
      if (product) {
        trackPurchase(product.name, product.price, `txn_${Date.now()}`);
      }
    } catch {
      setErrMsg("Something went wrong. Please try again.");
      setStep("payment");
    }
  }

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setScreenshotFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImgPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImgPreview(null);
      }
    },
    []
  );

  const upiLink = process.env.NEXT_PUBLIC_UPI_ID
    ? `upi://pay?pa=${process.env.NEXT_PUBLIC_UPI_ID}&pn=${
        process.env.NEXT_PUBLIC_MERCHANT_NAME || "UPSCPrepNotes"
      }&am=${product?.price || 0}&cu=INR&tn=${encodeURIComponent(
        product?.name || "Purchase"
      )}`
    : "#";

  const qrUrl = process.env.NEXT_PUBLIC_PAYMENT_QR_URL || "/qr.png";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4">
      <Card className="relative flex max-h-[95dvh] w-full flex-col overflow-y-auto rounded-t-[32px] border-border/50 shadow-2xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-[32px] lg:max-w-xl">
        {/* Close button — fixed top-right on all steps */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition hover:bg-muted hover:text-foreground sm:right-5 sm:top-5"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <CardContent className="flex flex-col px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14">
          {/* STEP 1 — Select Product */}
          {step === "select" && (
            <div className="flex flex-col">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:text-[11px]">
                  Step 1 of 3 — Choose Package
                </p>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Select Your Compilation
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Pick the papers you need
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-3.5">
                {PRODUCTS.map((p) => (
                  <ProductCard
                    key={p.name}
                    p={p}
                    onSelect={() => selectProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 & 3 — Form + Payment */}
          {(step === "form" ||
            step === "payment" ||
            step === "submitting") && (
            <div className="flex flex-col">
              {/* Header with back */}
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:text-[11px]">
                    {step === "form" ? "Step 2 of 3 — Your Details" : "Step 3 of 3 — Pay"}
                  </p>
                  <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                    {product?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    ₹{product?.price}
                  </p>
                </div>
              </div>

              {/* FORM */}
              {step === "form" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="h-12 rounded-2xl text-base sm:h-11 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="h-12 rounded-2xl text-base sm:h-11 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 "
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="h-12 rounded-2xl text-base sm:h-11 sm:text-sm"
                    />
                  </div>

                  {errMsg && (
                    <p className="text-sm text-destructive">{errMsg}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-2 w-full rounded-full py-4 text-base sm:py-3 sm:text-sm"
                  >
                    Continue to Pay ₹{product?.price}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              )}

              {/* PAYMENT + UPLOAD */}
              {(step === "payment" || step === "submitting") && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/30 p-5 sm:gap-5 sm:p-8">
                    <div className="rounded-xl border border-border/50 bg-white p-2 shadow-sm sm:p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl}
                        alt="Payment QR Code"
                        className="h-44 w-44 object-contain sm:h-52 sm:w-52"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Scan QR with any UPI app or{" "}
                        <a
                          href={upiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap font-semibold text-primary underline underline-offset-2 transition hover:text-primary/80"
                        >
                          tap to pay via UPI
                        </a>
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Amount:{" "}
                        <span className="font-bold text-foreground">
                          ₹{product?.price}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
                      Upload Payment Screenshot
                    </label>

                    <label className="relative flex min-h-[6rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-card px-4 py-6 text-center transition hover:border-primary/40 hover:bg-primary/[0.02] sm:min-h-[7rem] sm:py-8">
                      {imgPreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgPreview}
                            alt="Payment screenshot preview"
                            className="mb-2 max-h-28 rounded-lg object-contain sm:max-h-32"
                          />
                          <p className="text-xs text-muted-foreground">
                            Tap to change
                          </p>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2 text-muted-foreground/60"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          <p className="text-sm font-medium text-muted-foreground">
                            Tap to upload screenshot
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground/60">
                            PNG, JPG or WEBP
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        capture="environment"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                  </div>

                  {errMsg && (
                    <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {errMsg}
                    </p>
                  )}

                  <Button
                    onClick={handlePayAndUpload}
                    disabled={step === "submitting"}
                    size="lg"
                    className="w-full rounded-full py-4 text-base sm:py-3 sm:text-sm"
                  >
                    {step === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Submitting…
                      </span>
                    ) : (
                      "Submit for Verification"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 — Done */}
          {step === "done" && (
            <div className="flex flex-col items-center py-4 text-center sm:py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary sm:h-20 sm:w-20 sm:text-4xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
                Payment Submitted!
              </h2>

              <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
                Your purchase for{" "}
                <strong>
                  {product?.name} (₹{product?.price})
                </strong>{" "}
                has been recorded. We&apos;ll verify your payment and grant
                access within 24 hours.
              </p>

              <div className="mt-6 w-full rounded-2xl bg-muted/50 px-5 py-4 text-left text-sm">
                <p className="font-medium text-foreground">{form.name}</p>
                <p className="mt-0.5 text-muted-foreground">{form.email}</p>
                <p className="text-muted-foreground">{form.phone}</p>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                You&apos;ll receive a confirmation at{" "}
                <span className="font-medium text-foreground">
                  {form.email}
                </span>
              </p>

              <Button
                onClick={onClose}
                size="lg"
                className="mt-8 w-full rounded-full sm:mt-10 sm:w-auto sm:px-12"
              >
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
