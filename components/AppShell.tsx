"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StoreDialog from "@/components/StoreDialog";
import AskMentorButton from "@/components/AskMentorButton";
import { trackClientEvent } from "@/lib/client-analytics";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !pathname.startsWith("/ask")) {
      trackClientEvent("page_view", { path: pathname });
    }
  }, [pathname]);

  if (pathname?.startsWith("/ask")) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="group bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 sticky top-0 z-50 border-b border-gray-800 overflow-hidden">
        <a
          href="/store"
          className="block text-[11px] sm:text-xs font-medium tracking-wide cursor-pointer"
        >
          <div className="flex animate-marquee whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
            <span><span className="font-bold">39 Premium UPSC Products</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">Notes Bundles + Test Series + Teacher Materials</span><span className="text-white/60 mx-2">·</span><span>Starting at ₹99 →</span></span>
            <span><span className="font-bold">39 Premium UPSC Products</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">Notes Bundles + Test Series + Teacher Materials</span><span className="text-white/60 mx-2">·</span><span>Starting at ₹99 →</span></span>
            <span><span className="font-bold">39 Premium UPSC Products</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">Notes Bundles + Test Series + Teacher Materials</span><span className="text-white/60 mx-2">·</span><span>Starting at ₹99 →</span></span>
          </div>
        </a>
      </div>

      <Header />
      <div>{children}</div>
      <div>
        <Footer />
      </div>
      <AskMentorButton />
      <StoreDialog />
    </>
  );
}
