/**
 * Order and download icons, drawn in the same style as Gilu and the quiz badges:
 * a bold dark outline, flat colour, a soft white highlight. Nothing here is a text character.
 */

const INK = "#1d1f27";
const BLUE = "#1f3fd6";
const BLUE_SOFT = "#dbe2fb";
const YELLOW = "#ffe45c";
const YELLOW_SOFT = "#fff8d6";

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 48 48", "aria-hidden": true as const, style: { display: "block", flexShrink: 0 } });

/** A ZIP archive: blue file with a folded corner, a white zipper and a yellow pull tab. */
export function ZipIcon({ size = 48, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5H28.5L39 15.5V40a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" fill={BLUE} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M28.5 5V12.5a3 3 0 0 0 3 3H39" fill={BLUE_SOFT} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M13.6 12.5v17" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={i % 2 ? 24.4 : 20.4} y={9 + i * 4} width="3.4" height="2.5" rx=".8" fill="#fff" stroke={INK} strokeWidth="1.2" />
      ))}
      <rect x="20.8" y="29.5" width="6.4" height="10" rx="2.2" fill={YELLOW} stroke={INK} strokeWidth="2" />
      <circle cx="24" cy="35.4" r="1.5" fill={INK} />
    </svg>
  );
}

/** A single PDF: white page, folded corner, a blue label and text lines. */
export function FileIcon({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5H28.5L39 15.5V40a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" fill="#fff" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M28.5 5V12.5a3 3 0 0 0 3 3H39" fill={BLUE_SOFT} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="14" y="21" width="14" height="6" rx="1.6" fill={BLUE} stroke={INK} strokeWidth="1.8" />
      <path d="M14 33.5h20M14 38h13" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** An envelope with a blue flap, for "check your inbox". */
export function MailIcon({ size = 40, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5.5" y="11" width="37" height="26" rx="4.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
      <path d="M7.5 14.5 24 27.5 40.5 14.5" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 15.6 24 26.8 38.5 15.6V13a2 2 0 0 0-2-2h-25a2 2 0 0 0-2 2Z" fill={BLUE_SOFT} opacity=".9" />
      <path d="M9.5 33.5 18 25M38.5 33.5 30 25" fill="none" stroke={INK} strokeOpacity=".35" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="37.5" cy="11" r="5" fill={YELLOW} stroke={INK} strokeWidth="2" />
    </svg>
  );
}

/** A speech bubble with three dots, for "we're a reply away". */
export function ChatIcon({ size = 40, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 9.5h30a4 4 0 0 1 4 4v15a4 4 0 0 1-4 4H23l-9 7v-7h-5a4 4 0 0 1-4-4v-15a4 4 0 0 1 4-4Z" fill={YELLOW_SOFT} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M10.5 13.5v8" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16.5" cy="21" r="2.2" fill={INK} />
      <circle cx="24" cy="21" r="2.2" fill={INK} />
      <circle cx="31.5" cy="21" r="2.2" fill={INK} />
    </svg>
  );
}

/** Download arrow into a tray. Uses currentColor so it can sit on any button. */
export function DownloadIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} style={{ display: "block", flexShrink: 0 }}>
      <path d="M12 3.5v11M12 14.5l-4.2-4.2M12 14.5l4.2-4.2M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
