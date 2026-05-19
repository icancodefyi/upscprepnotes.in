"use client";

import { useState, useRef } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 300);
  }

  function handleLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className="bg-foreground text-background absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg px-3 py-2 text-xs leading-relaxed shadow-lg"
        >
          {content}
          <span className="bg-foreground absolute top-full left-1/2 -ml-1 h-2 w-2 -translate-y-1/2 rotate-45" />
        </span>
      )}
    </span>
  );
}
