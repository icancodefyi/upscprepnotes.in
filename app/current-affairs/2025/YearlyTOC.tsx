"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className={`sticky top-24 space-y-4 transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-80"}`}>
        <div className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)]">
          <p className="text-m font-bold">Jump to Month</p>
          <nav className="mt-3 space-y-0.5">
            {MONTHS.map((label, i) => {
              const slug = SLUGS[i];
              const isActive = active === slug;
              return (
                <a
                  key={slug}
                  href={`#${slug}`}
                  className={`flex items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-s transition-colors ${isActive ? "bg-[var(--ink)] font-bold text-white" : "text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"}`}
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-[var(--line-2)]"}`} />
                  {label}
                </a>
              );
            })}
          </nav>
          <a href="/api/generate-current-affairs?month=2025" className="btn btn-blue mt-4 h-10 w-full justify-center [--btn-fs:14px]">
            Download PDF
          </a>
        </div>
        {/* Product Ads */}
        <div className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)]">
          <p className="text-m font-bold">Premium Resources</p>
          <div className="mt-3 space-y-2">
            {[
              { href: "/store/top-10-rankers-strategy", t: "Top 10 Rankers Strategy", d: "Compiled strategies · ₹299" },
              { href: "/store/answer-copies-compilation", t: "Answer Copies Compilation", d: "60+ topper answer copies · ₹199" },
              { href: "/store/all-strategy-reports", t: "Complete Strategy Bundle", d: "280+ toppers · ₹199" },
            ].map((x) => (
              <Link key={x.href} href={x.href} className="block rounded-[14px] bg-[var(--canvas)] p-3 hover:bg-[#e9edff]">
                <p className="text-s font-bold leading-tight">{x.t}</p>
                <p className="mt-0.5 text-s text-[var(--muted)]">{x.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
