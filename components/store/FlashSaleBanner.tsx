"use client";

import { useEffect, useState } from "react";
import { isFlashSaleActive, FLASH_SALE } from "@/lib/flash-sale";

export default function FlashSaleBanner() {
  const [active, setActive] = useState(isFlashSaleActive());
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      force((v) => v + 1);
      setActive(isFlashSaleActive());
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!active) return null;

  const remaining = Math.max(0, new Date(FLASH_SALE.endDate).getTime() - Date.now());
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return (
    <div className="sticky top-0 z-40 w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 px-4 py-2.5 text-center text-emerald-50">
      <p className="text-xs font-bold sm:text-sm">
        ⚡ Launch Sale — every compilation at <span className="text-white">₹99</span> (84% off) ·{" "}
        <span className="tabular-nums">
          ends in {hours}h {minutes}m
        </span>
      </p>
    </div>
  );
}
