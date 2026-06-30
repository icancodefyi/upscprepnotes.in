"use client";

import { useState, useRef, useEffect } from "react";

type Point = { date: string; count: number; x: number; y: number };

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return n.toString();
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function TrafficChart({
  data,
}: {
  data: { _id: string; count: number }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 240 });
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        setDims({ w: Math.max(320, w), h: Math.max(140, Math.round(w * 0.3)) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!data || data.length < 2) {
    return (
      <div ref={containerRef} className="traffic-chart">
        <div className="traffic-chart__empty">
          Not enough data to show a chart yet.
        </div>
      </div>
    );
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a._id).getTime() - new Date(b._id).getTime()
  );
  const pad = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = dims.w - pad.left - pad.right;
  const innerH = dims.h - pad.top - pad.bottom;
  const maxVal = Math.max(...sorted.map((d) => d.count), 4);

  const points: Point[] = sorted.map((d, i) => ({
    date: d._id,
    count: d.count,
    x: pad.left + (i / Math.max(sorted.length - 1, 1)) * innerW,
    y: pad.top + (1 - d.count / maxVal) * innerH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${pad.top + innerH} L ${points[0].x} ${pad.top + innerH} Z`;

  const ys = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * maxVal));
  const xLabelCount = Math.min(6, sorted.length);
  const xStep = Math.max(1, Math.floor((sorted.length - 1) / (xLabelCount - 1)));
  const xIndices = Array.from({ length: xLabelCount }, (_, i) =>
    Math.min(i * xStep, sorted.length - 1)
  );

  const hi = hovered !== null ? points[hovered] : null;

  return (
    <div ref={containerRef} className="traffic-chart">
      <svg
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        style={{ display: "block" }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="advAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.58 0.18 158)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.58 0.18 158)" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="advAreaGradDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.18 158)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.65 0.18 158)" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {ys.map((v) => (
          <line
            key={v}
            x1={pad.left}
            x2={dims.w - pad.right}
            y1={pad.top + (1 - v / maxVal) * innerH}
            y2={pad.top + (1 - v / maxVal) * innerH}
            stroke="oklch(0.93 0 0)"
            strokeWidth="1"
          />
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#advAreaGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="oklch(0.58 0.18 158)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Y-axis labels */}
        {ys.map((v) => (
          <text
            key={v}
            x={pad.left - 8}
            y={pad.top + (1 - v / maxVal) * innerH + 4}
            textAnchor="end"
            fill="oklch(0.65 0 0)"
            fontSize="11"
            fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
          >
            {formatCompact(v)}
          </text>
        ))}

        {/* X-axis labels */}
        {xIndices.map((i) => (
          <text
            key={i}
            x={points[i].x}
            y={dims.h - 8}
            textAnchor="middle"
            fill="oklch(0.65 0 0)"
            fontSize="11"
            fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
          >
            {formatDateLabel(sorted[i]._id)}
          </text>
        ))}

        {/* Hit targets & dots */}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill={
                hovered === i
                  ? "oklch(0.58 0.18 158)"
                  : "oklch(0.995 0 0)"
              }
              stroke="oklch(0.58 0.18 158)"
              strokeWidth="2"
              style={{ transition: "fill 100ms" }}
            />
            <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
          </g>
        ))}

        {/* Tooltip */}
        {hi && (
          <>
            <line
              x1={hi.x}
              x2={hi.x}
              y1={pad.top}
              y2={pad.top + innerH}
              stroke="oklch(0.58 0.18 158)"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.6"
            />
            <rect
              x={Math.min(
                Math.max(hi.x - 60, pad.left),
                dims.w - pad.right - 120
              )}
              y={Math.max(hi.y - 42, pad.top)}
              width="120"
              height="32"
              rx="6"
              fill="oklch(0.15 0 0)"
            />
            <text
              x={Math.min(
                Math.max(hi.x, pad.left + 60),
                dims.w - pad.right - 60
              )}
              y={Math.max(hi.y - 22, pad.top + 12)}
              textAnchor="middle"
              fill="oklch(0.995 0 0)"
              fontSize="10"
              fontWeight="600"
              fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
            >
              {hi.count.toLocaleString()} views
            </text>
            <text
              x={Math.min(
                Math.max(hi.x, pad.left + 60),
                dims.w - pad.right - 60
              )}
              y={Math.max(hi.y - 22, pad.top + 24)}
              textAnchor="middle"
              fill="oklch(0.75 0 0)"
              fontSize="9"
              fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
            >
              {formatDateLabel(hi.date)}
            </text>
          </>
        )}
      </svg>

      <div className="traffic-chart__legend">
        <span className="traffic-chart__legend-dot" />
        Daily page views (30 days)
      </div>
    </div>
  );
}
