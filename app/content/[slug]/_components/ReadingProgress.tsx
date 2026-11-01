"use client";

import { useEffect, useState } from "react";

/** A thin ink line along the top edge that fills as you read the article. */
export default function ReadingProgress({ target }: { target: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setP(Math.min(1, Math.max(0, -r.top / Math.max(total, 1))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div className="h-full origin-left bg-[var(--accent)] transition-transform duration-100 ease-linear" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
