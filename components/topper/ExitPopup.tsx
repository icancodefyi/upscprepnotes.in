"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { markPopup, wasDismissedToday, wasShownToday } from "@/lib/popup-state";

export default function ExitPopup() {
  const [show, setShow] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    markPopup("topperExit", "dismissed");
    setShow(false);
  }, []);

  useEffect(() => {
    // The `fired` flag only lived for the lifetime of one mounted page, so the
    // popup re-armed on every topper profile the visitor opened. Persist the
    // shown/dismissed state for the day so it triggers at most once.
    if (wasShownToday("topperExit") || wasDismissedToday("topperExit")) return;
    let fired = false;
    const handler = (e: MouseEvent) => {
      if (fired || e.clientY > 10) return;
      if (wasShownToday("topperExit") || wasDismissedToday("topperExit")) return;
      fired = true;
      markPopup("topperExit", "shown");
      setShow(true);
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && show) {
        close();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, close]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      setTimeout(() => dialogRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Special offer"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl bg-card shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close popup"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-muted">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="mt-4 text-lg font-bold">Special Offer!</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Starting at <strong className="text-brand">₹99</strong> · Instant download.
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-foreground p-4 text-center">
          <p className="text-xs text-brand font-semibold uppercase tracking-wider">Offer</p>
          <p className="mt-1 text-3xl font-bold text-background">₹99</p>
          <p className="text-xs text-background/70">All Products</p>
        </div>

        <div className="mt-5 space-y-2.5">
          <Link
            href="/store"
            onClick={close}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-bold text-brand-foreground hover:bg-brand/90"
          >
            Shop Now →
          </Link>
        </div>

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Starting at ₹99 · Instant download
        </p>
      </div>
    </div>
  );
}
