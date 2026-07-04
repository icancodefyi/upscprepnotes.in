"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DownloadPdfButton from "./DownloadPdfButton";

const MONTHS = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
];

const SLUGS = [
  "january-2025",
  "february-2025",
  "march-2025",
  "april-2025",
  "may-2025",
  "june-2025",
  "july-2025",
  "august-2025",
  "september-2025",
  "october-2025",
  "november-2025",
  "december-2025",
];

export default function YearlyTOC() {
  const [active, setActive] = useState("january-2025");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SLUGS.forEach((slug) => {
      const el = document.getElementById(slug);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(slug);
          });
        },
        { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <aside className={`hidden lg:block w-56 shrink-0 transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-60"}`}>
      <div className="sticky top-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.125em] text-[#a39e98] mb-4">Jump to Month</p>
        <nav className="space-y-0.5">
          {MONTHS.map((label, i) => {
            const slug = SLUGS[i];
            const isActive = active === slug;
            return (
              <a
                key={slug}
                href={`#${slug}`}
                className={`block rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#000000e8] text-white"
                    : "text-[#615d59] hover:bg-[#e6e6e6] hover:text-[#000000e8]"
                }`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                  isActive ? "bg-white" : "bg-[#d4d4d4]"
                }`} />
                {label}
              </a>
            );
          })}
        </nav>
        <div className="mt-6 border-t border-[#e6e6e6] pt-4">
          <DownloadPdfButton
            month="2025"
            iconClassName="h-3 w-3"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#000000e8] px-4 py-2 text-[11px] font-semibold text-white transition hover:opacity-90"
          />
        </div>

        {/* Product Ads */}
        <div className="mt-8 border-t border-[#e6e6e6] pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.125em] text-[#a39e98] mb-3">Premium Resources</p>
          <div className="space-y-3">
            <Link
              href="/store/top-10-rankers-strategy"
              className="block rounded-lg bg-gradient-to-r from-amber-50 to-white p-3 ring-1 ring-[#e6e6e6] hover:ring-amber-200 transition"
            >
              <p className="text-[11px] font-bold text-[#000000e8] leading-tight">Top 10 Rankers Strategy</p>
              <p className="text-[10px] text-[#615d59] mt-0.5">Compiled strategies · ₹299</p>
            </Link>
            <Link
              href="/store/answer-copies-compilation"
              className="block rounded-lg bg-gradient-to-r from-blue-50 to-white p-3 ring-1 ring-[#e6e6e6] hover:ring-blue-200 transition"
            >
              <p className="text-[11px] font-bold text-[#000000e8] leading-tight">Answer Copies Compilation</p>
              <p className="text-[10px] text-[#615d59] mt-0.5">60+ topper answer copies · ₹799</p>
            </Link>
            <Link
              href="/store/all-strategy-reports"
              className="block rounded-lg bg-gradient-to-r from-emerald-50 to-white p-3 ring-1 ring-[#e6e6e6] hover:ring-emerald-200 transition"
            >
              <p className="text-[11px] font-bold text-[#000000e8] leading-tight">Complete Strategy Bundle</p>
              <p className="text-[10px] text-[#615d59] mt-0.5">280+ toppers · ₹799</p>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
