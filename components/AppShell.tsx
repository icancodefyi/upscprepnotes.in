"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { brandFonts } from "@/components/brand/fonts";
import AskHeader from "@/components/AskHeader";
import { trackClientEvent } from "@/lib/client-analytics";

/**
 * Root client shell. Every page brings its own frame (components/brand/BrandShell, or the admin layout),
 * except the AI chat, which gets a full-height app frame here.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !pathname.startsWith("/ask")) {
      trackClientEvent("page_view", { path: pathname });
    }
  }, [pathname]);

  if (pathname?.startsWith("/ask")) {
    return (
      <div className={`ask-brand ${brandFonts} flex h-screen flex-col overflow-hidden bg-white`}>
        <Link href="/store" className="relative z-50 block shrink-0 bg-[#0b0c10] px-4 py-2 text-center text-white">
          <span className="text-[13px] font-bold sm:text-[14px]">
            <span className="text-[#ffe45c]">Best Value</span>
            <span className="mx-2 text-white/40">—</span>
            Starting at <span className="text-[#ffe45c]">₹49</span>
            <span className="mx-2 hidden text-white/40 sm:inline">—</span>
            <span className="hidden text-white/60 sm:inline">Instant download</span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[12px] font-bold text-[#0b0c10] sm:ml-3">
              Shop &rarr;
            </span>
          </span>
        </Link>
        <AskHeader />
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
}
