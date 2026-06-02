"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type NavItem = { label: string; href: string; tag?: "hot" | "new" };

const NAV_ITEMS: NavItem[] = [
  { label: "Toppers", href: "/toppers" },
  { label: "Answer Copies", href: "/toppers/toppers-copy-compilation", tag: "hot" },
  { label: "Resources", href: "/resources", tag: "new" },
  { label: "PYQs", href: "/pyq", tag: "hot" },
  { label: "Ask AI", href: "/ask" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-[36px] z-40 bg-[#F8F9FA] border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white text-xs font-bold">PN</span>
          </div>
          <span className="font-bold text-lg tracking-tight">
            UPSCPrepNotes
          </span>
        </Link>

         <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              data-track={item.href === "/toppers/toppers-copy-compilation" ? "nav-answer-copies" : undefined}
              className="hover:text-black transition-colors flex items-center gap-1.5"
            >
              {item.label}
              {item.tag === "hot" && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">🔥</span>
              )}
              {item.tag === "new" && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">New</span>
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                data-track={item.href === "/toppers/toppers-copy-compilation" ? "nav-mobile-answer-copies" : undefined}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors py-2"
              >
                {item.label}
                {item.tag === "hot" && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">🔥</span>
                )}
                {item.tag === "new" && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">New</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
