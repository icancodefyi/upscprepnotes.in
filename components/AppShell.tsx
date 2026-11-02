"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { brandFonts } from "@/components/brand/fonts";
import { trackClientEvent } from "@/lib/client-analytics";

/**
 * Root client shell. Every page brings its own frame (components/brand/BrandShell, or the admin layout),
 * except the AI chat, which gets a bare full-height frame here (its sidebar, answers and input are its whole UI).
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
      <div className={`ask-brand ${brandFonts} h-screen overflow-hidden bg-white`}>
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
}
