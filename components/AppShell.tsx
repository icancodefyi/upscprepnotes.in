"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ScrollSlideIn from "@/components/ScrollSlideIn";
import TimedBundleBanner from "@/components/TimedBundleBanner";
import StickyBundleBar from "@/components/StickyBundleBar";
import FeedbackFloatingWidget from "@/components/FeedbackFloatingWidget";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/ask")) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="group bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 sticky top-0 z-50 border-b border-gray-800 overflow-hidden">
        <a
          href="/toppers/toppers-copy-compilation"
          className="block text-[11px] sm:text-xs font-medium tracking-wide cursor-pointer"
        >
          <div className="flex animate-marquee whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
            <span><span className="font-bold">30+ UPSC Resources Bundle</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span><span className="text-white/60 mx-2">·</span><span>₹799 Launch Offer →</span></span>
            <span><span className="font-bold">30+ UPSC Resources Bundle</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span><span className="text-white/60 mx-2">·</span><span>₹799 Launch Offer →</span></span>
            <span><span className="font-bold">30+ UPSC Resources Bundle</span><span className="text-white/60 mx-2">·</span><span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span><span className="text-white/60 mx-2">·</span><span>₹799 Launch Offer →</span></span>
          </div>
        </a>
      </div>

      <Header />
      <div className="pb-16">{children}</div>
      <div className="pb-16">
        <Footer />
      </div>
      <ExitIntentPopup />
      <ScrollSlideIn />
      <TimedBundleBanner />
      <StickyBundleBar />
      <FeedbackFloatingWidget />
    </>
  );
}
