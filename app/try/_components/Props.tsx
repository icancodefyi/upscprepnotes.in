import { useId } from "react";

/**
 * Desk props drawn as detailed vector art: shaded, lit from the top-left, with a short contact
 * shadow on the paper. Vector so they stay sharp at any size and cost nothing to load.
 */

const TONES = {
  red: { light: "#FF8F86", base: "#FF4A3D", dark: "#B3241B", deep: "#7A140E" },
  blue: { light: "#7D93FF", base: "#1F3FD6", dark: "#13238A", deep: "#0B1556" },
  yellow: { light: "#FFF3A8", base: "#FFE45C", dark: "#D9B400", deep: "#8C7300" },
} as const;

/** A push pin seen from above, as if pressed into a notice board. */
export function Pin({ tone = "red", className = "" }: { tone?: keyof typeof TONES; className?: string }) {
  const id = `pin-${tone}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const c = TONES[tone];
  return (
    <svg viewBox="0 0 48 52" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-cap`} cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.45" stopColor={c.base} />
          <stop offset="0.85" stopColor={c.dark} />
          <stop offset="1" stopColor={c.deep} />
        </radialGradient>
        <linearGradient id={`${id}-grip`} x1="0" x2="1">
          <stop offset="0" stopColor={c.dark} />
          <stop offset="0.3" stopColor={c.base} />
          <stop offset="0.55" stopColor={c.light} />
          <stop offset="1" stopColor={c.deep} />
        </linearGradient>
        <radialGradient id={`${id}-top`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.6" stopColor={c.base} />
          <stop offset="1" stopColor={c.dark} />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      {/* contact shadow, cast down-right */}
      <ellipse cx="27" cy="33" rx="15" ry="11" fill="rgba(11,12,16,0.32)" filter={`url(#${id}-blur)`} />
      {/* base flange */}
      <ellipse cx="22" cy="26" rx="16" ry="14" fill={`url(#${id}-cap)`} />
      <ellipse cx="22" cy="26" rx="16" ry="14" fill="none" stroke={c.deep} strokeOpacity="0.35" strokeWidth="0.75" />
      {/* grip cylinder */}
      <path d="M14 22 v-5 a8 6 0 0 1 16 0 v5 a8 6 0 0 1 -16 0z" fill={`url(#${id}-grip)`} />
      <ellipse cx="22" cy="17" rx="8" ry="6" fill={`url(#${id}-top)`} />
      {/* speculars */}
      <ellipse cx="13.5" cy="20" rx="4.5" ry="2.6" fill="#fff" opacity="0.45" transform="rotate(-30 13.5 20)" />
      <ellipse cx="19" cy="14.5" rx="2.6" ry="1.5" fill="#fff" opacity="0.8" transform="rotate(-25 19 14.5)" />
      <path d="M17 20.5 v1.5" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** A steel gem paperclip. Hang it over the top edge of a sheet. */
export function Paperclip({ className = "" }: { className?: string }) {
  const id = `clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const wire = "M13 34 V86 A8 8 0 0 0 29 86 V18 A11.5 11.5 0 0 0 6 18 V92 A15 15 0 0 0 36 92 V30";
  return (
    <svg viewBox="0 0 42 112" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F6F9" />
          <stop offset="0.25" stopColor="#B9BFC9" />
          <stop offset="0.5" stopColor="#EEF0F4" />
          <stop offset="0.75" stopColor="#8E95A1" />
          <stop offset="1" stopColor="#D5D9E0" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-40%" y="-20%" width="180%" height="140%">
          <feDropShadow dx="1.4" dy="2.2" stdDeviation="1.3" floodColor="#0B0C10" floodOpacity="0.28" />
        </filter>
      </defs>
      <g fill="none" strokeLinecap="round" filter={`url(#${id}-shadow)`}>
        <path d={wire} stroke="#5F6672" strokeWidth="4.4" />
        <path d={wire} stroke={`url(#${id}-steel)`} strokeWidth="3.2" />
        <path d={wire} stroke="#fff" strokeOpacity="0.75" strokeWidth="0.9" transform="translate(-0.7 -0.5)" />
      </g>
    </svg>
  );
}
