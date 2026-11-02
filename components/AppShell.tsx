"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { brandFonts } from "@/components/brand/fonts";
import Tracker from "@/components/Tracker";
import ConsentBanner from "@/components/ConsentBanner";
import { getConsent, onConsentChange } from "@/lib/consent";

/**
 * Root client shell. Every page brings its own frame (components/brand/BrandShell, or the admin layout),
 * except the AI chat, which gets a bare full-height frame here (its sidebar, answers and input are its whole UI).
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Restart the tracker when the visitor makes their choice, so the current page is counted too.
  const [consent, setConsentState] = useState("");
  useEffect(() => onConsentChange(() => setConsentState(getConsent() ?? "")), []);

  if (pathname?.startsWith("/ask")) {
    return (
      <div className={`ask-brand ${brandFonts} h-screen overflow-hidden bg-white`}>
        <Tracker key={consent} />
        <ConsentBanner />
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <>
      <Tracker key={consent} />
      <ConsentBanner />
      {children}
    </>
  );
}
