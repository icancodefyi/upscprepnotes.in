"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

type NavItem = { label: string; href: string; tag?: "new"; dataTrack: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Store", href: "/store", dataTrack: "nav-store", tag: "new" },
  { label: "Toppers", href: "/toppers", dataTrack: "nav-toppers" },
  { label: "Ask AI", href: "/ask", dataTrack: "nav-ask-ai" },
];

const FREE_MATERIALS_CATEGORIES = [
  { label: "Test Series", href: "/free-materials?category=test-series" },
  { label: "Notes & Material", href: "/free-materials?category=notes" },
  { label: "Books", href: "/free-materials?category=books" },
  { label: "Magazines", href: "/free-materials?category=magazines" },
  { label: "Current Affairs", href: "/free-materials?category=current-affairs" },
  { label: "Optional Subjects", href: "/free-materials?category=optional" },
];

const PYQ_YEARS = ["2023", "2024", "2025"];

function DropdownItem({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block whitespace-nowrap px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-emerald-700"
    >
      {label}
    </Link>
  );
}

function NavDropdown({
  label,
  dataTrack,
  children,
}: {
  label: string;
  dataTrack: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        data-track={dataTrack}
        className="flex items-center gap-1 hover:text-black transition-colors"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2">
          <div className="min-w-48 rounded-2xl border border-black/[0.06] bg-white p-2 shadow-lg">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-[36px] z-40 bg-[#F8F9FA] border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" data-track="nav-logo" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="UPSCPrepNotes"
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg tracking-tight">
            UPSCPrepNotes
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link
            href="/store"
            data-track="nav-store"
            className="flex items-center gap-1.5 hover:text-black transition-colors"
          >
            Store
            <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">New</span>
          </Link>
          <Link
            href="/toppers"
            data-track="nav-toppers"
            className="hover:text-black transition-colors"
          >
            Toppers
          </Link>

          <NavDropdown label="Free Materials" dataTrack="nav-free-materials">
            {FREE_MATERIALS_CATEGORIES.map((cat) => (
              <DropdownItem key={cat.href} href={cat.href} label={cat.label} />
            ))}
            <div className="mt-1 border-t border-black/[0.06] pt-1">
              <DropdownItem href="/free-materials" label="View All →" />
            </div>
          </NavDropdown>

          <NavDropdown label="PYQs" dataTrack="nav-pyq">
            {PYQ_YEARS.map((year) => (
              <DropdownItem key={year} href={`/pyq/${year}`} label={year} />
            ))}
            <div className="mt-1 border-t border-black/[0.06] pt-1">
              <DropdownItem href="/pyq" label="View All →" />
            </div>
          </NavDropdown>

          <Link
            href="/ask"
            data-track="nav-ask-ai"
            className="flex items-center gap-1.5 hover:text-black transition-colors"
          >
            Ask AI
            <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">New</span>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          data-track="nav-mobile-toggle"
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
            <Link
              href="/store"
              onClick={() => setMobileOpen(false)}
              data-track="nav-mobile-store"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors py-2"
            >
              Store
              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">New</span>
            </Link>
            <Link
              href="/toppers"
              onClick={() => setMobileOpen(false)}
              data-track="nav-mobile-toppers"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors py-2"
            >
              Toppers
            </Link>

            <div className="py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Free Materials</p>
              <div className="ml-2 space-y-1">
                {FREE_MATERIALS_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-gray-600 hover:text-black py-1"
                  >
                    {cat.label}
                  </Link>
                ))}
                <Link
                  href="/free-materials"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-emerald-600 hover:text-emerald-700 py-1"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">PYQs</p>
              <div className="ml-2 space-y-1">
                {PYQ_YEARS.map((year) => (
                  <Link
                    key={year}
                    href={`/pyq/${year}`}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-gray-600 hover:text-black py-1"
                  >
                    {year}
                  </Link>
                ))}
                <Link
                  href="/pyq"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-emerald-600 hover:text-emerald-700 py-1"
                >
                  View All →
                </Link>
              </div>
            </div>
            <Link
              href="/ask"
              onClick={() => setMobileOpen(false)}
              data-track="nav-mobile-ask-ai"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors py-2"
            >
              Ask AI
              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">New</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
