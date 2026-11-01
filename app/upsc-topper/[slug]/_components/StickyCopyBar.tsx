"use client";

import { useEffect, useState } from "react";

/**
 * Mobile only: once the header scrolls away, a slim bar keeps the answer copy one tap away.
 * It hides again while the answer copy section itself is on screen.
 */
export default function StickyCopyBar({ label, note }: { label: string; note: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    const target = document.getElementById("answer-copy");
    let pastHeader = false;
    let atCopy = false;
    const update = () => setShow(pastHeader && !atCopy);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === header) pastHeader = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === target) atCopy = e.isIntersecting;
      }
      update();
    });
    if (header) io.observe(header);
    if (target) io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300 ease-[var(--ease)] lg:hidden ${show ? "translate-y-0" : "pointer-events-none translate-y-[130%]"}`}
    >
      <a
        href="#answer-copy"
        tabIndex={show ? 0 : -1}
        data-track="topper-sticky-copy"
        className="mx-auto flex max-w-[520px] items-center justify-between gap-3 rounded-full bg-[var(--ink)] py-2 pl-5 pr-2 text-white shadow-[0_12px_30px_-10px_rgba(11,12,16,0.6)]"
      >
        <span className="min-w-0">
          <span className="block truncate text-[14.5px] font-semibold">{label}</span>
          <span className="block truncate text-[12px] text-white/60">{note}</span>
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--hl)] text-[var(--ink)]">↓</span>
      </a>
    </div>
  );
}
