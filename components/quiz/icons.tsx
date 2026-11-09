/**
 * The quiz's single icon style, matching Gilu: bold dark outline, flat colour fill, a soft white
 * highlight. Badges, rewards, the streak flame and the answer ticks all come from here, so
 * nothing in the quiz is drawn from text characters or in a different style.
 */

const INK = "#1d1f27";

/** A five-point star centred on (cx, cy) with outer radius r. */
function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

const MEDALS: Record<string, { color: string; ribbon: string }> = {
  first: { color: "#1f3fd6", ribbon: "#ff4a3d" },
  hattrick: { color: "#ff8a1f", ribbon: "#1f3fd6" },
  clean: { color: "#1a8a4a", ribbon: "#ffe45c" },
  perfect: { color: "#ff4a3d", ribbon: "#1f3fd6" },
  topper: { color: "#f5b400", ribbon: "#ff4a3d" },
  streak3: { color: "#ff6a1a", ribbon: "#1f3fd6" },
  speed: { color: "#6f4cf0", ribbon: "#ffe45c" },
};

const w = { fill: "#ffffff", stroke: INK, strokeWidth: 2.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** The picture inside a medal, drawn around the point (24, 22). */
function Glyph({ id }: { id: string }) {
  switch (id) {
    case "first":
      return (
        <g>
          <path d="M17.5 12.5V32" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path {...w} d="M18.5 13.5H31.5L28.4 19.2L31.5 24.9H18.5Z" />
        </g>
      );
    case "hattrick":
      return (
        <g>
          <path {...w} strokeWidth="1.9" d={starPath(15, 25, 6)} />
          <path {...w} strokeWidth="1.9" d={starPath(33, 25, 6)} />
          <path {...w} strokeWidth="1.9" d={starPath(24, 19, 7.4)} />
        </g>
      );
    case "clean":
      return (
        <g>
          <path {...w} d="M24 11.5L32.5 14.6V22C32.5 27.6 28.9 31.2 24 33.2C19.1 31.2 15.5 27.6 15.5 22V14.6Z" />
          <path d="M19.6 22.4L23 25.8L29 18.6" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "perfect":
      return (
        <g>
          <circle cx="24" cy="22" r="10.5" {...w} />
          <circle cx="24" cy="22" r="6.2" fill="#ff4a3d" stroke={INK} strokeWidth="2" />
          <circle cx="24" cy="22" r="2.2" fill={INK} />
        </g>
      );
    case "topper":
      return (
        <g>
          <path {...w} d="M14 29.5L13 15.5L19.4 21L24 12.5L28.6 21L35 15.5L34 29.5Z" />
          <path d="M14.5 33.2H33.5" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );
    case "streak3":
      return (
        <path {...w} d="M24 10C25 16.4 32.2 18.4 32.2 26.4A8.2 8.2 0 0 1 15.8 26.4C15.8 22.6 17.8 20.6 19.8 18.4C20.4 21.2 22 22.2 23 22.4C22.4 18.4 23 14.2 24 10Z" />
      );
    case "speed":
      return <path {...w} d="M27.4 9.5L15 25H22.6L20 35L33 18.6H25.2Z" />;
    default:
      return <path {...w} d={starPath(24, 22, 9)} />;
  }
}

/** A badge: a round medal on a ribbon. Locked badges are grey, so the picture is still visible. */
export function Medal({ id, locked = false, size = 48 }: { id: string; locked?: boolean; size?: number }) {
  const m = MEDALS[id] ?? MEDALS.first;
  const disc = locked ? "#e3e6ee" : m.color;
  const rib = locked ? "#cfd4e0" : m.ribbon;
  return (
    <svg viewBox="0 0 48 58" width={size} height={Math.round((size * 58) / 48)} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d="M13 35L8.5 54L17 49L21.5 55L25 37Z" fill={rib} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M35 35L39.5 54L31 49L26.5 55L23 37Z" fill={rib} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="24" cy="22" r="20" fill={disc} stroke={INK} strokeWidth="3" />
      <circle cx="24" cy="22" r="15.6" fill="none" stroke="#ffffff" strokeOpacity={locked ? 0.7 : 0.4} strokeWidth="2" />
      <path d="M9.5 17.5A15.5 15.5 0 0 1 19.5 7.8" fill="none" stroke="#ffffff" strokeOpacity={locked ? 0.9 : 0.75} strokeWidth="3" strokeLinecap="round" />
      <g opacity={locked ? 0.55 : 1}>
        <Glyph id={id} />
      </g>
    </svg>
  );
}

/** A stop on the 30-day track: a round token with a shield or a gift. */
export function TrackIcon({ id, got, size = 32 }: { id: string; got: boolean; size?: number }) {
  const fill = got ? "#ffe45c" : "#ffffff";
  const sw = got ? INK : "#aab0bd";
  const g = { fill: got ? "#ffffff" : "#f4f5f9", stroke: sw, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>
      <circle cx="16" cy="16" r="14.2" fill={fill} stroke={sw} strokeWidth="2.4" />
      <path d="M7.5 12A10 10 0 0 1 14 6.4" fill="none" stroke="#ffffff" strokeOpacity={got ? 0.9 : 0.8} strokeWidth="2" strokeLinecap="round" />
      {id === "m3" ? (
        <path {...g} d="M16 8L22.4 10.4V15C22.4 19 19.7 21.7 16 23.6C12.3 21.7 9.6 19 9.6 15V10.4Z" />
      ) : (
        <g>
          <path {...g} d="M9.5 15H22.5V23.2H9.5Z" />
          <path {...g} d="M8.5 11.4H23.5V15H8.5Z" />
          <path d="M16 11.4V23.2" fill="none" stroke={sw} strokeWidth="2" strokeLinecap="round" />
          <path {...g} d="M16 11.4C13.4 6.8 9.6 8.6 11.8 11.4ZM16 11.4C18.6 6.8 22.4 8.6 20.2 11.4Z" />
        </g>
      )}
    </svg>
  );
}

/** The streak flame, in the same outlined style. Grey when there is no streak. */
export function Flame({ on, size = 22 }: { on: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>
      <path d="M12 2.4C12.9 7.6 18.6 9.2 18.6 14.6A6.6 6.6 0 0 1 5.4 14.6C5.4 11.6 7 10 8.6 8.4C8.9 10.4 9.9 11.3 10.9 11.5C10.3 8.5 10.9 5.4 12 2.4Z" fill={on ? "#ff7a1a" : "#c9cfdd"} stroke={INK} strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 13.4C12.9 14.6 14.5 15.2 14.5 17A2.5 2.5 0 0 1 9.5 17C9.5 15.8 11 15.1 12 13.4Z" fill={on ? "#ffe45c" : "#e9ecf3"} />
      <path d="M8 9.6A4.4 4.4 0 0 0 7.4 11" fill="none" stroke="#ffffff" strokeOpacity={on ? 0.75 : 0.9} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Right (check) or wrong (cross) marker, drawn in the same bold rounded stroke. */
export function Mark({ kind, size = 16 }: { kind: "check" | "cross"; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>
      {kind === "check" ? (
        <path d="M5.5 12.8L10 17.2L18.6 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M7 7L17 17M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      )}
    </svg>
  );
}
