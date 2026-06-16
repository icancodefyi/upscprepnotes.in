"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StoreDialog from "@/components/StoreDialog";
import AskMentorButton from "@/components/AskMentorButton";
import AskHeader from "@/components/AskHeader";
import { CartProvider } from "@/lib/cart-context";
import { trackClientEvent } from "@/lib/client-analytics";
import { markPopup, wasDismissedToday } from "@/lib/popup-state";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [bannerOpen, setBannerOpen] = useState(true);
  const [canShowStoreDialog, setCanShowStoreDialog] = useState(false);

  useEffect(() => {
    if (pathname && !pathname.startsWith("/ask")) {
      trackClientEvent("page_view", { path: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    setCanShowStoreDialog(!wasDismissedToday("storeDialog") && !wasDismissedToday("exitIntent"));
  }, []);

  if (pathname?.startsWith("/ask")) {
    return (
      <CartProvider>
        <div className="flex h-screen flex-col overflow-hidden">
          <AskHeader />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </CartProvider>
    );
  }

  function handleBannerDismiss() {
    setBannerOpen(false);
    markPopup("banner", "dismissed");
  }

  return (
    <CartProvider>
      {bannerOpen && (
        <div className="group relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 sticky top-0 z-50 border-b border-gray-800 overflow-hidden">
          <a
            href="/store"
            className="block text-[11px] sm:text-xs font-medium tracking-wide cursor-pointer pr-10"
          >
            <div className="flex animate-marquee whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
              <span><span className="font-bold">39 Premium UPSC Products</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">Notes Bundles + Test Series + Teacher Materials</span><span className="text-white/60 mx-2">·</span><span>Starting at ₹99 →</span></span>
              <span><span className="font-bold">39 Premium UPSC Products</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">Notes Bundles + Test Series + Teacher Materials</span><span className="text-white/60 mx-2">·</span><span>Starting at ₹99 →</span></span>
              <span><span className="font-bold">39 Premium UPSC Products</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">Notes Bundles + Test Series + Teacher Materials</span><span className="text-white/60 mx-2">·</span><span>Starting at ₹99 →</span></span>
            </div>
          </a>
          <button
            type="button"
            onClick={handleBannerDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white/80"
            aria-label="Close announcement"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Header bannerOpen={bannerOpen} />
      <div>{children}</div>
      <div>
        <Footer />
      </div>
      <AskMentorButton />
      {canShowStoreDialog && <StoreDialog />}
    </CartProvider>
  );
}
