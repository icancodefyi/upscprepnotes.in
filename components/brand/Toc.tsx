"use client";

import { useEffect, useState } from "react";

/** "On this page" with a marker that follows the section you're reading. */
export default function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const onScroll = () => {
      // The active section is the last one whose top has passed 35% of the viewport.
      const line = window.innerHeight * 0.35;
      let current = els[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      // At the very bottom, the last section wins even if it is short.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = els[els.length - 1]?.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const index = Math.max(0, items.findIndex((i) => i.id === active));

  return (
    <ol className="relative mt-3">
      {/* rail and moving marker */}
      <span aria-hidden className="absolute bottom-1 left-[7px] top-1 w-px bg-[var(--line-2)]" />
      <span
        aria-hidden
        className="absolute left-[5px] h-[22px] w-[5px] rounded-full bg-[var(--accent)] transition-transform duration-300 ease-[var(--ease)]"
        style={{ transform: `translateY(${index * 36 + 7}px)` }}
      />
      {items.map((t, i) => {
        const on = i === index;
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={on ? "location" : undefined}
              className={`flex h-9 items-center gap-3 rounded-[10px] pl-6 pr-2 text-s transition-colors duration-150 ${
                on ? "font-bold text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
              }`}
            >
              {/* one line per entry keeps the marker aligned; the full title shows on hover */}
              <span className="min-w-0 truncate" title={t.label}>{t.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
