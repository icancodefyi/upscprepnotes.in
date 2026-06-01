"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Toppers", href: "/year/2025" },
  { label: "Answer Copies", href: "/toppers/toppers-copy-compilation" },
  { label: "Optional Subjects", href: "/optional/psir" },
  { label: "Ask AI", href: "/ask" },
  { label: "PYQs", href: "/pyq" },
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
              className="hover:text-black transition-colors"
            >
              {item.label}
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
                className="block text-sm font-medium text-gray-600 hover:text-black transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
