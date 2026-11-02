/**
 * Faint line illustrations for coloured bands and CTAs: one big, low-contrast outline that hints at what the
 * section is for (the envelope behind an email form, the shield behind a trust line). Decorative only.
 * Place with className, e.g. "-right-6 -top-8 h-40 w-56 rotate-[12deg] text-white/10"; the parent needs `relative overflow-hidden`.
 */
const PATHS = {
  envelope: (
    <>
      <rect x="8" y="8" width="184" height="124" rx="10" />
      <path d="M10 14l90 66 90-66" />
    </>
  ),
  shield: (
    <>
      <path d="M100 6l78 28v40c0 40-30 62-78 78-48-16-78-38-78-78V34z" />
      <path d="M64 76l26 26 48-52" />
    </>
  ),
  file: (
    <>
      <path d="M44 6h74l44 44v84H44z" />
      <path d="M118 6v44h44M70 82h66M70 106h66M70 130h40" />
    </>
  ),
  chat: (
    <>
      <path d="M12 12h130a8 8 0 018 8v66a8 8 0 01-8 8H66l-36 28V94H12a8 8 0 01-8-8V20a8 8 0 018-8z" />
      <path d="M44 42h66M44 64h44" />
    </>
  ),
  pen: (
    <>
      <path d="M150 10l32 32-96 96-44 12 12-44z" />
      <path d="M130 30l32 32M42 106l32 32" />
    </>
  ),
  calendar: (
    <>
      <rect x="10" y="22" width="180" height="112" rx="12" />
      <path d="M10 56h180M52 6v28M148 6v28M44 84h28M86 84h28M128 84h28M44 108h28M86 108h28" />
    </>
  ),
  book: (
    <>
      <path d="M100 30c-20-18-56-22-90-14v108c34-8 70-4 90 14 20-18 56-22 90-14V16c-34-8-70-4-90 14z" />
      <path d="M100 30v108" />
    </>
  ),
} as const;

export type OutlineKind = keyof typeof PATHS;

export default function Outline({ kind, className = "" }: { kind: OutlineKind; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pointer-events-none absolute ${className}`}
    >
      {PATHS[kind]}
    </svg>
  );
}
