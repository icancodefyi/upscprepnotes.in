"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 md:top-[25px] left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[880px]">
        <nav
          className="w-full rounded-[15px] border border-black/5 bg-white/95 px-3.5 py-2 sm:px-5 sm:py-2.5 backdrop-blur-md transition-all duration-200"
          style={{
            boxShadow:
              "inset 0px 0px 14px 0px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.04)",
          }}
          aria-label="Main Navigation"
        >
          <div className="flex items-center justify-between">
            {/* Brand Logo Wordmark */}
            <div className="flex items-center pl-1 sm:pl-2">
              <Link
                href="/"
                data-track="nav-home-logo"
                className="whitespace-nowrap text-[18px] sm:text-[19px] font-bold tracking-tight text-black transition hover:opacity-80"
              >
                <Image
                  src="/logo.png"
                  alt="UPSCPrepNotes Wordmark Logo"
                  width={180}
                  height={42}
                  priority
                  className="h-[40px] w-auto sm:h-[44px]"
                />
              </Link>
            </div>

            {/* Right Group: Links + CTA Button */}
            <div className="flex items-center gap-5 lg:gap-7">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-[14px] font-semibold text-black/75">
                <Link
                  href="/toppers"
                  data-track="nav-toppers"
                  className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                >
                  Toppers
                </Link>
                <Link
                  href="/toppers/marks-database"
                  data-track="nav-marks-database"
                  className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                >
                  Marks Database
                </Link>
                <a
                  href="#impacts"
                  data-track="nav-answer-copies"
                  className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                >
                  Answer Copies
                </a>
                <Link
                  href="/free-materials"
                  data-track="nav-free-materials"
                  className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                >
                  Materials
                </Link>
                <Link
                  href="/current-affairs"
                  data-track="nav-current-affairs"
                  className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                >
                  Current Affairs
                </Link>
                <Link
                  href="/pyq"
                  data-track="nav-pyq"
                  className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                >
                  PYQs
                </Link>
                <Link
                  href="/ask"
                  data-track="nav-ask-ai"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-[#16526E] bg-[#DEEFF8] border border-[#BEE0F2] px-2.5 py-1 rounded-full text-[13px] transition hover:bg-[#CFE8F7]"
                >
                  <Sparkles size={13} className="text-[#16526E]" />
                  <span>Ask AI</span>
                </Link>
              </div>

              {/* Right Action: Cohesive Slate Navy CTA Button */}
              <div className="flex items-center gap-2">
                <Link
                  href="/store"
                  data-track="nav-store-cta"
                  className="hidden lg:flex h-[40px] items-center justify-center rounded-[10px] bg-[#16526E] px-5 text-[14px] font-semibold text-white whitespace-nowrap shadow-xs transition hover:bg-[#114258] active:scale-[0.98]"
                >
                  Explore Store
                </Link>

                {/* Mobile Menu Hamburger */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-black transition hover:bg-black/5 lg:hidden"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? (
                    <X size={20} className="text-black" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-[4px] w-5">
                      <span className="h-[2px] w-5 rounded-full bg-black" />
                      <span className="h-[2px] w-5 rounded-full bg-black" />
                      <span className="h-[2px] w-5 rounded-full bg-black" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-3 flex flex-col gap-1 border-t border-black/5 pt-3 lg:hidden animate-in fade-in duration-150">
              <Link
                href="/toppers"
                data-track="nav-mobile-toppers"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-[#16526E]"
              >
                Toppers Marksheets
              </Link>
              <Link
                href="/toppers/marks-database"
                data-track="nav-mobile-marks-database"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-[#16526E]"
              >
                Marks Database (271+ Profiles)
              </Link>
              <a
                href="#impacts"
                data-track="nav-mobile-answer-copies"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-[#16526E]"
              >
                Evaluated Answer Copies
              </a>
              <Link
                href="/free-materials"
                data-track="nav-mobile-free-materials"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-[#16526E]"
              >
                Free Materials & Test Series
              </Link>
              <Link
                href="/current-affairs"
                data-track="nav-mobile-current-affairs"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-[#16526E]"
              >
                Current Affairs Hub
              </Link>
              <Link
                href="/pyq"
                data-track="nav-mobile-pyq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-[#16526E]"
              >
                PYQs (2022–2025)
              </Link>
              <Link
                href="/ask"
                data-track="nav-mobile-ask-ai"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-[8px] bg-[#DEEFF8]/50 px-3 py-2 text-[14px] font-semibold text-[#16526E] transition hover:bg-[#DEEFF8]"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#16526E]" />
                  <span>Ask AI Mentor</span>
                </div>
                <span className="rounded-[4px] bg-[#16526E] px-2 py-0.5 text-[10px] font-bold text-white">
                  NEW
                </span>
              </Link>
              <div className="pt-2 border-t border-black/5 mt-1">
                <Link
                  href="/store"
                  data-track="nav-mobile-store"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-[42px] w-full items-center justify-center rounded-[10px] bg-[#16526E] text-[14px] font-semibold text-white shadow-xs transition hover:bg-[#114258]"
                >
                  Explore Store
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
