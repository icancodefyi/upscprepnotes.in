"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { brandFonts } from "@/components/brand/fonts";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AskMentorButton from "@/components/AskMentorButton";
import AskHeader from "@/components/AskHeader";
import { CartProvider } from "@/lib/cart-context";
import { trackClientEvent } from "@/lib/client-analytics";
import { markPopup } from "@/lib/popup-state";
import { isLegacyRoute } from "@/components/brand/routes";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [bannerOpen, setBannerOpen] = useState(true);

  useEffect(() => {
    if (pathname && !pathname.startsWith("/ask")) {
      trackClientEvent("page_view", { path: pathname });
    }
  }, [pathname]);

  if (pathname?.startsWith("/ask")) {
    return (
      <CartProvider>
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
      </CartProvider>
    );
  }

  function handleBannerDismiss() {
    setBannerOpen(false);
    markPopup("banner", "dismissed");
  }

  const isAdmin = pathname?.startsWith("/admin");
  // Only the old homepage (until /try replaces it) and admin still use the old chrome. Everything else,
  // redesigned pages and any 404, brings its own nav and footer (components/brand/BrandShell).
  if (!isLegacyRoute(pathname)) {
    return <CartProvider>{children}</CartProvider>;
  }

  return (
    <CartProvider>
      {!isAdmin && bannerOpen && (
        <div className="group relative bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white py-2.5 sticky top-0 z-50 border-b border-brand/20 overflow-hidden">
          <a href="/store" className="block text-[11px] sm:text-xs font-medium tracking-wide cursor-pointer pr-10">
            <div className="flex animate-marquee whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
              <span><span className="text-brand font-bold">Govt Schemes Compilation</span><span className="text-white/60 mx-2">—</span><span className="text-white font-semibold">₹49</span><span className="text-white/60 mx-2">·</span><span>7-day refund guarantee</span></span>
              <span><span className="text-brand font-bold">Answer Copies</span><span className="text-white/60 mx-2">—</span><span className="text-white font-semibold">₹199</span><span className="text-white/60 mx-2">·</span><span>50+ topper sheets</span></span>
            </div>
          </a>
          <button
            type="button"
            onClick={handleBannerDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white/80"
            aria-label="Close announcement"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {isAdmin ? children : (
        <>
          <Header bannerOpen={bannerOpen} />
          <div>{children}</div>
          <div>
            <Footer />
          </div>
          <AskMentorButton />
        </>
      )}
    </CartProvider>
  );
}
