"use client";

import { useEffect, useState } from "react";

/**
 * Keeps its children folded away until the profile header has scrolled off screen, so the
 * header's own button and this one are never visible at the same time.
 */
export default function AfterHeader({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const header = document.getElementById("profile-header");
    if (!header) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(header);
    return () => io.disconnect();
  }, []);
  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease)] ${show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
