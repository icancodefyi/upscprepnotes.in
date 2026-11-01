"use client";

import { useRef } from "react";

/** A real scan with a magnifier that follows the mouse. Touch devices just see the scan. */
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
      className={`relative overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={`${src}?tr=w-800,f-auto,q-80`} alt={alt} draggable={false} loading="lazy" className={`block w-full select-none ${imgClassName}`} />
      <div ref={lens} aria-hidden className="lens" style={{ width: size, height: size, backgroundImage: `url("${big}")` }} />
    </div>
  );
}
