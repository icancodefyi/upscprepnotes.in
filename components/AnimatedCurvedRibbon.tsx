"use client";

import React, { useEffect, useRef } from "react";

interface AnimatedCurvedRibbonProps {
  id: string;
  unitText: string;
  repeatCount?: number;
  direction?: 1 | -1;
  baseSpeed?: number;
  scrollSpeed?: number;
  angle?: number;
  containerClass?: string;
  containerStyle?: React.CSSProperties;
  svgWidth?: number;
  svgHeight?: number;
  viewBox?: string;
  pathD: string;
  strokeColor?: string;
  strokeWidth?: number;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  letterSpacing?: string;
  ariaLabel?: string;
}

export default function AnimatedCurvedRibbon({
  id,
  unitText,
  repeatCount = 10,
  direction = 1,
  baseSpeed = 0.7,
  scrollSpeed = 0.45,
  angle = -10,
  containerClass = "",
  containerStyle = {},
  svgWidth = 2032,
  svgHeight = 300,
  viewBox = "0 0 2032 300",
  pathD,
  strokeColor = "rgb(237, 242, 248)",
  strokeWidth = 72.8,
  textColor = "rgb(37, 91, 115)",
  fontSize = "24px",
  fontFamily = '"Instrument Sans", sans-serif',
  fontWeight = 600,
  letterSpacing = "2px",
  ariaLabel = "Animated Curved Ribbon",
}: AnimatedCurvedRibbonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const measureTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const textPath = textPathRef.current;
    const measureEl = measureTextRef.current;
    if (!textPath || !measureEl) return;

    // Measure exact length of single unit phrase in the active browser font
    let unitLength = 1200;
    try {
      const measured = measureEl.getComputedTextLength();
      if (measured > 100) {
        unitLength = measured;
      }
    } catch {
      // Fallback if measurement fails
      unitLength = unitText.length * 14;
    }

    let animId: number;
    let isVisible = true;
    let totalOffset = 0;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastTime = performance.now();

    // IntersectionObserver to pause loop when scrolled out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "400px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const updateDOM = () => {
      const normalized = ((totalOffset % unitLength) + unitLength) % unitLength - unitLength * 2;
      textPath.setAttribute("startOffset", `${normalized.toFixed(1)}px`);
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      // Instant scroll-linked shift
      totalOffset += diff * scrollSpeed * direction;
      updateDOM();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.666, 3);
      lastTime = now;

      if (isVisible) {
        totalOffset += baseSpeed * direction * (dt > 0 ? dt : 1);
        updateDOM();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, [unitText, direction, baseSpeed, scrollSpeed]);

  const fullText = Array(repeatCount).fill(unitText).join("");

  // Create an extended curve path by adding broad lead-in and lead-out vectors
  const extendedPathD = `M -6000 150 L -2000 150 ${pathD} L 3500 150 L 7500 150`;
  const maskId = `${id}-curve-mask`;
  const pathId = `${id}-path-extended`;

  return (
    <div
      ref={containerRef}
      className={containerClass}
      style={{
        transform: `rotate(${angle}deg)`,
        opacity: 1,
        pointerEvents: "none",
        userSelect: "none",
        ...containerStyle,
      }}
    >
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={viewBox}
          style={{ display: "block", overflow: "visible" }}
          aria-label={ariaLabel}
        >
          <defs>
            {/* Extended path used by textPath for infinite glide */}
            <path id={pathId} d={extendedPathD} />

            {/* Mask to clip text only along the visual ribbon segment */}
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <rect x="-2000" y="-500" width="6000" height="1500" fill="black" />
              <path
                d={pathD}
                fill="none"
                stroke="white"
                strokeWidth={strokeWidth * 2.1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>

          {/* Offscreen hidden element for exact text-length measurement */}
          <text
            ref={measureTextRef}
            x="-9999"
            y="-9999"
            style={{
              fontFamily,
              fontSize,
              fontWeight,
              letterSpacing,
              visibility: "hidden",
            }}
          >
            {unitText}
          </text>

          {/* Ribbon colored background stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ribbon Text flowing continuously on textPath */}
          <text
            dy="7"
            style={{
              fontFamily,
              fontSize,
              fontWeight,
              letterSpacing,
            }}
            fill={textColor}
            textAnchor="start"
            mask={`url(#${maskId})`}
          >
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset="0px"
              method="align"
              spacing="auto"
            >
              {fullText}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
