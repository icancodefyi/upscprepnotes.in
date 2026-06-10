"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const WHATSAPP_NUMBER = "919152750079";

const SITE = "upscprepnotes.in";

function whatsappLink(tier: string) {
  const msg = encodeURIComponent(
    `Hi! I want to buy the "${tier}" on UPSCPrepNotes (${SITE}). Please share payment details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export default function StickyBundleBar() {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    if (pathname === "/toppers/toppers-copy-compilation") {
      window.open(whatsappLink("Ultimate Compilation"), "_blank");
    } else {
      router.push("/toppers/toppers-copy-compilation");
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1.5 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          <span className="truncate text-[12px] text-gray-600 sm:text-sm">
            <strong className="text-emerald-600">50+ topper copies</strong>
            <span className="hidden sm:inline"> — GS1–4, Essay, Optional, strategy guides & AI</span>
          </span>
        </div>
        <button
          onClick={handleClick}
          data-track="global-sticky-bar"
          className="shrink-0 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-500 sm:px-6 sm:py-2 sm:text-sm"
        >
          <span className="sm:hidden">Compilation</span>
          <span className="hidden sm:inline">Get the Compilation — ₹799</span>
        </button>
      </div>
    </div>
  );
}
