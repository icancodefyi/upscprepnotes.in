"use client";

import { useEffect, useState } from "react";

// Prices change at this moment (IST). Until then, every product shows its current price.
export const PRICE_RISE_AT = new Date("2026-11-10T23:59:00+05:30");
const BANNER_HEIGHT = "44px";

function remainingParts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function PriceRiseBanner() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const active = now !== null && now < PRICE_RISE_AT.getTime();

  // The fixed nav sits below this bar while it shows.
  useEffect(() => {
    const root = document.documentElement;
    if (active) root.style.setProperty("--banner-h", BANNER_HEIGHT);
    else root.style.removeProperty("--banner-h");
    return () => {
      root.style.removeProperty("--banner-h");
    };
  }, [active]);

  // Render nothing on the server and until the clock is read, so the countdown never mismatches.
  if (!active || now === null) return null;

  const t = remainingParts(PRICE_RISE_AT.getTime() - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] flex h-[44px] items-center justify-center gap-3 bg-[#ffd43b] px-4 text-[#0b0c10]"
    >
      <p className="text-xs font-bold sm:text-base">Prices go up 10 Nov, 11:59pm IST. Buy at today&apos;s price</p>
      <p className="tabular-nums rounded-md bg-[#0b0c10] px-2.5 py-1 text-xs font-extrabold text-[#ffd43b] sm:text-base">
        {t.d}d {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
      </p>
    </div>
  );
}
