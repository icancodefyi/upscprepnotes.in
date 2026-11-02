"use client";

import Link from "next/link";
import { Mark } from "@/components/brand/Nav";

/** Slim top bar for the AI chat: brand mark and two ways out. */
export default function AskHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(11,12,16,0.08)] bg-white px-4">
      <Link href="/" className="flex items-center gap-2.5" data-track="ask-header-logo">
        <Mark size={24} />
        <span className="text-[15px] font-bold tracking-[-0.01em] text-[#0b0c10]">UPSCPrepNotes</span>
        <span className="rounded-full bg-[#e9edff] px-2 py-0.5 text-[12px] font-bold text-[#13238a]">AI Mentor</span>
      </Link>
      <nav className="flex items-center gap-5">
        <Link href="/store" className="text-[14px] font-bold text-[#3f4450] transition hover:text-[#1f3fd6]" data-track="ask-header-store">
          Store
        </Link>
        <Link href="/toppers" className="text-[14px] font-bold text-[#3f4450] transition hover:text-[#1f3fd6]" data-track="ask-header-toppers">
          Toppers
        </Link>
      </nav>
    </header>
  );
}
