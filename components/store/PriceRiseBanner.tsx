"use client";

import { useEffect, useState } from "react";

// Prices change at this moment (IST). Until then, every product shows its current price.
export const PRICE_RISE_AT = new Date("2026-11-10T23:59:00+05:30");

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

  // Render nothing on the server and until the clock is read, so the countdown never mismatches.
  if (now === null || now >= PRICE_RISE_AT.getTime()) return null;

  const t = remainingParts(PRICE_RISE_AT.getTime() - now);
  return (
    <div className="w-full bg-[#1f3fd6] px-4 py-2.5 text-center text-white">
      <p className="text-xs font-bold sm:text-sm">
        Prices go up on 10 November, 11:59pm IST. Buy at today&apos;s price before then ·{" "}
        <span className="tabular-nums">
          {t.d}d {String(t.h).padStart(2, "0")}h {String(t.m).padStart(2, "0")}m {String(t.s).padStart(2, "0")}s
        </span>
      </p>
    </div>
  );
}
