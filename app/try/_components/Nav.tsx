"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-[max(12px,env(safe-area-inset-top))]">
      <nav
        data-scrolled={scrolled}
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
              className="rounded-full px-3.5 py-2 text-[14px] text-[var(--ink-2)] transition-colors duration-150 hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/store" className="btn btn-ink h-10 px-4 text-[14px]">
          Store
        </Link>
      </nav>
    </div>
  );
}
