import Link from "next/link";
import Lens from "@/components/brand/Lens";
import type { Booklet } from "./types";
import SectionHead from "@/components/brand/SectionHead";

const fmt = (n: number) => n.toLocaleString("en-IN");

const ROWS = [
  { key: "essay", label: "Essay", max: 250 },
  { key: "gs1", label: "GS I", max: 250 },
  { key: "gs2", label: "GS II", max: 250 },
  { key: "gs3", label: "GS III", max: 250 },
  { key: "gs4", label: "GS IV", max: 250 },
  { key: "optional", label: "Optional", max: 500 },
  { key: "interview", label: "Interview", max: 275 },
] as const;

// Each sheet gets its own stock, like different coloured exam papers on a pile.
const THEMES = [
  { bg: "var(--accent)", fg: "#fff", sub: "rgba(255,255,255,0.7)", rule: "rgba(255,255,255,0.18)", stamp: "#fff" },
  { bg: "var(--hl)", fg: "var(--ink)", sub: "rgba(11,12,16,0.6)", rule: "rgba(11,12,16,0.14)", stamp: "var(--mark-deep)" },
  { bg: "#ffffff", fg: "var(--ink)", sub: "var(--muted)", rule: "var(--line)", stamp: "var(--mark)" },
  { bg: "var(--ink)", fg: "#fff", sub: "rgba(255,255,255,0.6)", rule: "rgba(255,255,255,0.14)", stamp: "var(--hl)" },
  { bg: "#e9edff", fg: "var(--ink)", sub: "var(--ink-2)", rule: "rgba(31,63,214,0.15)", stamp: "var(--accent)" },
];

function Sheet({ b, i }: { b: Booklet; i: number }) {
  const t = THEMES[i % THEMES.length];
  const p = b.papers!;
  const best = ROWS.filter((r) => r.max === 250).reduce((a, r) => (p[r.key] > p[a.key] ? r : a)).key;

  return (
    <article
      className="stack-card relative overflow-hidden rounded-[32px] p-6 shadow-[0_10px_24px_-14px_rgba(11,12,16,0.35)] sm:p-10 lg:p-12"
      style={{ background: t.bg, color: t.fg }}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="t-display text-l">{b.name}</h3>
              <p className="mt-2 text-s" style={{ color: t.sub }}>{`CSE ${b.year} · ${b.optional}`}</p>
            </div>
            {/* rubber stamp */}
            <div
              className="stamp grid h-[92px] w-[92px] shrink-0 place-items-center rounded-full border-[3px] text-center sm:h-[112px] sm:w-[112px]"
              style={{ borderColor: t.stamp, color: t.stamp, "--d": "200ms" } as React.CSSProperties}
            >
              <div>
                <p className="t-meta text-s tracking-[0.12em]" style={{ color: t.stamp }}>AIR</p>
                <p className="t-display tab text-l">{b.rank}</p>
              </div>
            </div>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-x-8 sm:grid-cols-2">
            {ROWS.map((r) => (
              <li
                key={r.key}
                className="flex items-baseline justify-between gap-3 py-2.5 text-m"
                style={{ borderBottom: `1px solid ${t.rule}` }}
              >
                <span style={{ color: t.sub }}>{r.label}</span>
                <span className="relative tab font-bold">
                  {p[r.key]}
                  {r.key === best && (
                    <svg aria-hidden viewBox="0 0 60 34" preserveAspectRatio="none" className="pointer-events-none absolute -left-5 -top-2 h-[calc(100%+16px)] w-[calc(100%+30px)] overflow-visible">
                      <path d="M8 18 C 8 6, 40 2, 54 10 C 62 16, 54 30, 30 31 C 12 32, 2 24, 10 12" fill="none" stroke={t.stamp} strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  )}
                  <span className="ml-1 text-s font-normal" style={{ color: t.sub }}>{`/${r.max}`}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-display tab text-l">
                {fmt(b.total)}
                <span className="ml-2 text-m tracking-normal" style={{ color: t.sub }}>marks</span>
              </p>
            </div>
            <Link
              href={`/upsc-topper/${b.slug}`}
              className="btn"
              style={{ background: t.fg, color: t.bg === "#ffffff" || t.bg === "#e9edff" || t.bg === "var(--hl)" ? "#fff" : t.bg === "var(--ink)" ? "var(--ink)" : "var(--accent)" }}
            >
              Open profile <span className="knob" style={{ background: "rgba(127,127,127,0.18)" }}>↗</span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[380px]" style={{ transform: `rotate(${i % 2 ? 2.5 : -2.5}deg)` }}>
          <div className="paper overflow-hidden">
            <Lens src={b.src} alt={`Answer booklet of ${b.name}`} imgClassName="aspect-[5/7] object-cover object-top" />
          </div>
          {/* tape */}
          <span aria-hidden className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-[-4deg] rounded-[3px] bg-white/55 shadow-[0_1px_2px_rgba(0,0,0,0.08)] backdrop-blur-[1px]" />
        </div>
      </div>
    </article>
  );
}

export default function StackedSheets({ booklets }: { booklets: Booklet[] }) {
  return (
    <section id="sheets" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>They sat the same exam. <span className="text-[var(--accent)]">Here&apos;s what they wrote.</span></>}
          lead="Real UPSC topper answer copies beside the marks each paper earned. Hover a scan to read the handwriting."
        />

        <div className="mt-14">
          {booklets.map((b, i) => (
            <div key={b.slug} className="mb-6 last:mb-0 lg:sticky lg:mb-[12vh]" style={{ top: `${96 + i * 22}px` }}>
              <Sheet b={b} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
