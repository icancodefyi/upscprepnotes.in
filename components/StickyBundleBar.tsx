"use client";

import { useState, useEffect, startTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IconClock, IconBolt } from "@tabler/icons-react";
import { trackClientEvent } from "@/lib/client-analytics";

const WHATSAPP_NUMBER = "919152750079";

function whatsappLink(tier: string) {
  const msg = encodeURIComponent(
    `Hi! I want to buy the "${tier}" on UPSCPrepNotes. Please share payment details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function randomSeconds() {
  return 300 + Math.floor(Math.random() * 180);
}

export default function StickyBundleBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    startTransition(() => {
      setTimeLeft(randomSeconds());
    });
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) return randomSeconds();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  function handleClick() {
    if (pathname === "/toppers/toppers-copy-compilation") {
      trackClientEvent("whatsapp_click", { tier: "Ultimate Bundle", location: "global-sticky-bar" });
      window.open(whatsappLink("Ultimate Bundle"), "_blank");
    } else {
      router.push("/toppers/toppers-copy-compilation");
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1.5 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 sm:px-3 sm:py-1 sm:text-xs">
            <IconClock size={11} className="shrink-0 sm:size-[13px]" />
            <span className="tabular-nums">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <IconBolt size={12} className="shrink-0 text-amber-500 sm:hidden" />
            <span className="truncate text-[12px] text-gray-600 sm:text-sm">
              <span className="hidden sm:inline">Limited Time — </span>
              <strong className="text-emerald-600">₹11</strong>
              <span className="sm:hidden">/copy</span>
              <span className="hidden sm:inline">/copy</span>
              <span className="hidden sm:inline"> — Ultimate Bundle</span>
            </span>
          </div>
        </div>
        <button
          onClick={handleClick}
          data-track="global-sticky-bar"
          className="shrink-0 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-500 sm:px-6 sm:py-2 sm:text-sm"
        >
          <span className="sm:hidden">Buy</span>
          <span className="hidden sm:inline">Get it now</span>
        </button>
      </div>
    </div>
  );
}
