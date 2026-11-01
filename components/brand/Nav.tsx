"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Brand mark: an answer booklet — margin rule, three written lines, the last in ballpoint blue. */
export function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--ink)" />
      <path d="M7.5 5v14" stroke="var(--mark)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 8.5h7M10.5 12h7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 15.5h4.5" stroke="#8fa2ff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const LINKS = [
  { href: "/toppers", label: "Toppers" },
  { href: "/toppers/marks-database", label: "Marks" },
  { href: "/free-materials", label: "Free materials" },
  { href: "/current-affairs", label: "Current affairs" },
];

// Shown in the mobile menu only, under the main links.
const MORE = [
  { href: "/pyq", label: "Previous year questions" },
  { href: "/ask", label: "Ask AI mentor" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);

  // Close the menu when the route changes.
  if (open && openedOn !== pathname) {
    setOpen(false);
    setOpenedOn(pathname);
  }

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  const toggle = () => {
    setOpenedOn(pathname);
    setOpen((v) => !v);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-[max(12px,env(safe-area-inset-top))]">
      <nav
        data-scrolled={scrolled || open}
        aria-label="Main"
        className="nav pointer-events-auto mx-auto flex h-14 max-w-[1000px] items-center justify-between rounded-full pl-4 pr-2"
      >
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em]">
          <Mark />
          UPSCPrepNotes
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className="rounded-full px-3.5 py-2 text-[14px] text-[var(--ink-2)] transition-colors duration-150 hover:bg-[var(--canvas)] hover:text-[var(--ink)] aria-[current=page]:text-[var(--ink)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/store" className="btn btn-ink h-10 px-4 text-[14px]">
            Store
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="brand-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--canvas)] md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="brand-menu"
          className="pointer-events-auto mx-auto mt-2 max-w-[1000px] rounded-[28px] bg-white p-3 shadow-[0_0_0_1px_var(--line),0_12px_28px_-14px_rgba(11,12,16,0.35)] md:hidden"
        >
          <ul>
            {[...LINKS, ...MORE].map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-[16px] px-4 py-3 text-[16px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
