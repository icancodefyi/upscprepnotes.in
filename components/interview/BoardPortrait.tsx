/**
 * A board member drawn in formal dress (Interview Lab). Flat illustration, Indian skin tones.
 * Members blink now and then; the one speaking moves their mouth.
 */

type Look = {
  skin: string;
  hair: string;
  style: "receding" | "short" | "side" | "bun" | "long";
  attire: "suit" | "bandhgala" | "saree" | "blazer";
  cloth: string;
  accent: string;
  glasses?: boolean;
  moustache?: boolean;
  bindi?: boolean;
};

export const LOOKS: Look[] = [
  // Chairman: senior, grey hair, glasses, dark suit
  { skin: "#B98157", hair: "#D7D5D2", style: "receding", attire: "suit", cloth: "#1F2A44", accent: "#7A1F2B", glasses: true, moustache: true },
  // Member: education and optional, saree
  { skin: "#C98E62", hair: "#2B1D16", style: "bun", attire: "saree", cloth: "#2F6B5A", accent: "#C9A13B", bindi: true },
  // Member: state and economy, bandhgala
  { skin: "#9A6440", hair: "#1E1712", style: "side", attire: "bandhgala", cloth: "#3A3F4A", accent: "#B8A98A", glasses: true },
  // Member: interests, blazer
  { skin: "#D7A47A", hair: "#3A2A20", style: "long", attire: "blazer", cloth: "#4A2E4F", accent: "#EDE6DC", glasses: false },
  // Member: administration and ethics, grey suit
  { skin: "#A86F48", hair: "#5E5A57", style: "short", attire: "suit", cloth: "#4B5262", accent: "#1F3FD6", moustache: true },
];

export default function BoardPortrait({ member, talking, label }: { member: number; talking: boolean; label: string }) {
  const l = LOOKS[member] ?? LOOKS[0];
  const shade = "rgba(0,0,0,0.14)";
  return (
    <svg viewBox="0 0 120 150" role="img" aria-label={label} className="board-portrait h-full w-full" style={{ ["--blink-delay" as string]: `${member * 1.7}s` }}>
      {/* back hair (long styles sit behind the head) */}
      {l.style === "long" && <path d="M33 58 C30 90 34 112 40 118 L80 118 C86 112 90 90 87 58 Z" fill={l.hair} />}
      {l.style === "bun" && <circle cx="60" cy="33" r="11" fill={l.hair} />}

      {/* body and attire */}
      {l.attire === "saree" ? (
        <>
          <path d="M14 150 C14 122 32 106 60 104 C88 106 106 122 106 150 Z" fill={l.cloth} />
          <path d="M60 104 C70 105 79 108 86 113 L98 150 L78 150 Z" fill={l.accent} opacity="0.9" />
          <path d="M44 106 C50 112 70 112 76 106 L72 104 C66 108 54 108 48 104 Z" fill={shade} />
        </>
      ) : (
        <>
          <path d="M10 150 C10 120 30 105 60 103 C90 105 110 120 110 150 Z" fill={l.cloth} />
          {l.attire === "suit" && (
            <>
              <path d="M49 104 L60 132 L71 104 C67 103 53 103 49 104 Z" fill="#F4F1EC" />
              <path d="M57 108 L63 108 L61.5 113 L64 130 L60 135 L56 130 L58.5 113 Z" fill={l.accent} />
              <path d="M49 104 L42 110 L56 136 L60 132 Z M71 104 L78 110 L64 136 L60 132 Z" fill={shade} />
            </>
          )}
          {l.attire === "blazer" && (
            <>
              <path d="M50 104 L60 124 L70 104 C66 103 54 103 50 104 Z" fill={l.accent} />
              <path d="M50 104 L43 111 L56 132 L60 124 Z M70 104 L77 111 L64 132 L60 124 Z" fill={shade} />
            </>
          )}
          {l.attire === "bandhgala" && (
            <>
              <path d="M50 101 L70 101 L70 107 C65 109 55 109 50 107 Z" fill={l.cloth} stroke={shade} strokeWidth="1" />
              <line x1="60" y1="109" x2="60" y2="150" stroke={shade} strokeWidth="1.2" />
              {[116, 126, 136, 146].map((y) => <circle key={y} cx="60" cy={y} r="1.6" fill={l.accent} />)}
            </>
          )}
        </>
      )}

      {/* neck and head */}
      <path d="M52 88 L52 104 C56 107 64 107 68 104 L68 88 Z" fill={l.skin} />
      <path d="M52 96 C56 100 64 100 68 96 L68 92 C64 95 56 95 52 92 Z" fill={shade} />
      <ellipse cx="38.5" cy="66" rx="4" ry="6" fill={l.skin} />
      <ellipse cx="81.5" cy="66" rx="4" ry="6" fill={l.skin} />
      <ellipse cx="60" cy="63" rx="21" ry="26" fill={l.skin} />

      {/* hair */}
      {l.style === "receding" && <path d="M39 62 C38 46 46 37 60 37 C74 37 82 46 81 62 C79 54 77 50 74 48 C68 46 52 46 46 48 C43 50 41 54 39 62 Z" fill={l.hair} />}
      {l.style === "short" && <path d="M39 60 C37 42 48 35 60 35 C73 35 83 42 81 60 C79 50 74 45 60 45 C47 45 41 50 39 60 Z" fill={l.hair} />}
      {l.style === "side" && <path d="M38 62 C35 40 48 33 61 33 C76 33 85 42 82 62 C80 52 76 46 68 44 C60 47 48 47 42 50 C40 53 39 57 38 62 Z" fill={l.hair} />}
      {(l.style === "bun" || l.style === "long") && <path d="M38 66 C35 44 46 36 60 36 C74 36 85 44 82 66 C80 54 74 46 60 46 C50 46 42 52 40 58 C39 61 38 63 38 66 Z" fill={l.hair} />}

      {/* face */}
      <g className="brows" stroke="#2A1E18" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <path d="M47 55 Q51.5 53 56 55" fill="none" />
        <path d="M64 55 Q68.5 53 73 55" fill="none" />
      </g>
      <g className="eyes">
        <ellipse cx="51.5" cy="62" rx="2.2" ry="2.4" fill="#21170F" />
        <ellipse cx="68.5" cy="62" rx="2.2" ry="2.4" fill="#21170F" />
      </g>
      {l.glasses && (
        <g stroke="#2B2B2B" strokeWidth="1.4" fill="rgba(255,255,255,0.08)">
          <rect x="44.5" y="56.5" width="14" height="11" rx="4" />
          <rect x="61.5" y="56.5" width="14" height="11" rx="4" />
          <path d="M58.5 61 L61.5 61" />
        </g>
      )}
      <path d="M60 64 L58 73 C59 74 61 74 62 73" fill="none" stroke={shade} strokeWidth="1.4" strokeLinecap="round" />
      {l.bindi && <circle cx="60" cy="50.5" r="1.6" fill="#B3261E" />}
      {l.moustache && <path d="M52 77.5 C55 75 58 75.5 60 76.5 C62 75.5 65 75 68 77.5 C65 78.8 62 78.6 60 77.8 C58 78.6 55 78.8 52 77.5 Z" fill={l.hair === "#D7D5D2" ? "#BDBAB6" : l.hair} />}
      <g className={talking ? "mouth talking" : "mouth"} style={{ transformOrigin: "60px 80px" }}>
        <path d="M54 80 Q60 83.5 66 80 Q60 85 54 80 Z" fill="#7A3B2E" />
      </g>
      <style>{`
        .board-portrait .eyes { transform-origin: 60px 62px; animation: blink 5.5s infinite; animation-delay: var(--blink-delay); }
        .board-portrait .mouth.talking { animation: talk .28s ease-in-out infinite alternate; }
        @keyframes blink { 0%, 94%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
        @keyframes talk { from { transform: scaleY(0.6); } to { transform: scaleY(2.1); } }
        @media (prefers-reduced-motion: reduce) { .board-portrait .eyes, .board-portrait .mouth.talking { animation: none; } }
      `}</style>
    </svg>
  );
}
