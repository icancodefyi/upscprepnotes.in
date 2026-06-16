"use client";

import Link from "next/link";

export default function AskHeader() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-zinc-100 bg-white px-4 shrink-0">
      <Link href="/" className="flex items-center gap-2" data-track="ask-header-logo">
        <img src="/logo.png" alt="UPSCPrepNotes" className="h-6 w-auto" />
        <span className="text-sm font-semibold text-zinc-800">AI Mentor</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/store" className="text-xs font-medium text-zinc-500 transition hover:text-zinc-800" data-track="ask-header-store">
          Store
        </Link>
        <Link href="/toppers" className="text-xs font-medium text-zinc-500 transition hover:text-zinc-800" data-track="ask-header-toppers">
          Toppers
        </Link>
      </nav>
    </header>
  );
}
