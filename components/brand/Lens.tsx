"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** A real scan with a magnifier that follows the mouse. On touch screens, tapping opens it full screen to pan and pinch-zoom. */
export default function Lens({
  src,
  alt,
  size = 150,
  zoom = 2.4,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  size?: number;
  zoom?: number;
  className?: string;
  imgClassName?: string;
}) {
  const lens = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const big = `${src}?tr=w-1400,f-auto,q-80`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onTap = () => {
    if (window.matchMedia("(hover: none)").matches) setOpen(true);
  };

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !lens.current || !img.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const l = lens.current;
    l.style.opacity = "1";
    l.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
    l.style.backgroundSize = `${img.current.clientWidth * zoom}px ${img.current.clientHeight * zoom}px`;
    l.style.backgroundPosition = `${-(x * zoom - size / 2)}px ${-(y * zoom - size / 2)}px`;
  };

  return (
    <div
      onPointerMove={move}
      onPointerLeave={() => lens.current && (lens.current.style.opacity = "0")}
      onClick={onTap}
      className={`relative overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={`${src}?tr=w-800,f-auto,q-80`} alt={alt} draggable={false} loading="lazy" className={`block w-full select-none ${imgClassName}`} />
      <div ref={lens} aria-hidden className="lens" style={{ width: size, height: size, backgroundImage: `url("${big}")` }} />
      {open && createPortal(
        <div role="dialog" aria-label={alt} className="fixed inset-0 z-[80] bg-[rgba(11,12,16,0.94)]" onClick={(e) => e.stopPropagation()}>
          <div className="h-full w-full overflow-auto overscroll-contain [touch-action:pan-x_pan-y_pinch-zoom]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={big} alt={alt} className="mx-auto block w-[200%] max-w-none sm:w-full sm:max-w-[900px]" />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] grid h-11 w-11 place-items-center rounded-full bg-white text-[22px] font-bold leading-none text-[var(--ink,#0b0c10)] shadow-lg"
          >
            ×
          </button>
          <p className="pointer-events-none absolute inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] text-center text-[13px] text-white/70">Drag to pan, pinch to zoom</p>
        </div>,
        document.body,
      )}
    </div>
  );
}
