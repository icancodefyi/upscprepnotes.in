import Link from "next/link";
import AskLink from "@/components/AskLink";
import { Paperclip } from "@/components/brand/Props";
import { fmt, type PaperStat } from "@/lib/topper-stats";

export type HeroData = {
  name: string;
  first: string;
  rank: number;
  year: number;
  optional: string;
  optionalHref: string | null;
  photo: string | null;
  total: number;
  written: number;
  interview: number;
  papers: PaperStat[];
  pool: number;
  hook: string;
  hasCopy: boolean;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Passport photo clipped to the sheet, as on an admit card. A monogram when we have no real photo. */
function Photo({ h }: { h: HeroData }) {
  return (
    <div className="relative w-[76px] shrink-0 rotate-[-3deg] rounded-[6px] bg-white p-1 shadow-[0_0_0_1px_var(--line),0_6px_12px_-6px_rgba(11,12,16,0.4)] sm:w-[88px]">
      {h.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={h.photo}
          alt={h.name}
          className="aspect-[4/5] w-full rounded-[3px] bg-[var(--canvas)] object-cover object-top"
        />
      ) : (
        <div
          aria-hidden
          className="grid aspect-[4/5] w-full place-items-center rounded-[3px] bg-[#e9edff]"
        >
          <span className="t-display text-[28px] text-[var(--accent)]">
            {initials(h.name)}
          </span>
        </div>
      )}
      <Paperclip className="absolute -top-5 right-2 h-[52px] w-[20px] rotate-[8deg]" />
    </div>
  );
}

/** The marks statement, as a sheet of paper. The total gets the examiner's red circle. */
function Statement({ h }: { h: HeroData }) {
  return (
    <div className="paper relative rotate-[1.2deg] p-6 pt-7 sm:p-8">
      <div className="flex items-start gap-4 border-b border-[var(--line)] pb-5">
        <Photo h={h} />
        <div className="min-w-0 flex-1 pt-1">
          <p className="t-meta">{`MARKS STATEMENT · CSE ${h.year}`}</p>
          <p className="t-head mt-1.5 text-[20px] sm:text-[22px]">{h.name}</p>
          {h.optional && (
            <p className="mt-1 truncate text-[13px] text-[var(--muted)]">{`Optional: ${h.optional}`}</p>
          )}
        </div>
        <span
          className="stamp grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full border-[3px] border-[var(--mark)] text-center text-[var(--mark)]"
          style={{ "--d": "500ms" } as React.CSSProperties}
        >
          <span className="leading-none">
            <span className="block text-[11px] font-bold tracking-[0.08em]">
              AIR
            </span>
            <span className="t-display tab block text-[28px]">{h.rank}</span>
          </span>
        </span>
      </div>

      {h.papers.length > 0 ? (
        <ul className="mt-3 space-y-0.5">
          {h.papers.map((p) => (
            <li
              key={p.key}
              className="grid grid-cols-[1fr_5.5rem_3.2rem] items-center gap-3 py-[7px] text-[14px]"
            >
              <span className="truncate text-[var(--ink-2)]">
                {p.short === "Optional" ? `Optional · ${h.optional}` : p.label}
              </span>
              <span className="relative h-[6px] overflow-hidden rounded-full bg-[var(--canvas)] shadow-[inset_0_0_0_1px_var(--line)]">
                <span
                  className="bar absolute inset-0 rounded-full bg-[var(--accent)]"
                  style={{ transform: `scaleX(${p.score / p.max})` }}
                />
              </span>
              <span className="tab text-right font-semibold">{p.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-[14.5px] leading-[1.55] text-[var(--ink-2)]">
          {h.total > 0
            ? "UPSC's published result gives this topper's written and interview totals. Paper-by-paper marks are not on record yet."
            : "We're checking this topper's marks against UPSC's published result. They'll appear here once they match."}
        </p>
      )}

      {h.total > 0 && (
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-4">
          <div className="text-[13px] leading-[1.5] text-[var(--muted)]">
            {h.written > 0 && (
              <p className="tab">{`Written ${fmt(h.written)} + interview ${h.interview}`}</p>
            )}
            <p>Total, out of 2,025</p>
          </div>
          <span className="relative mr-2">
            <span className="t-display tab text-[48px] sm:text-[56px]">
              {fmt(h.total)}
            </span>
            <svg
              aria-hidden
              viewBox="0 0 160 70"
              preserveAspectRatio="none"
              className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible"
              style={{ "--d": "900ms" } as React.CSSProperties}
            >
              <path
                d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30"
                pathLength={1}
                fill="none"
                stroke="var(--mark)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

export default function ProfileHero({
  h,
  crumbs,
}: {
  h: HeroData;
  crumbs: { href?: string; label: string }[];
}) {
  const facts = [
    ...(h.total > 0
      ? [{ label: "Total", value: fmt(h.total), note: "out of 2,025" }]
      : []),
    ...(h.written > 0
      ? [{ label: "Written", value: fmt(h.written), note: "out of 1,750" }]
      : []),
    ...(h.interview > 0
      ? [{ label: "Interview", value: String(h.interview), note: "out of 275" }]
      : []),
    ...h.papers
      .filter((p) => p.key === "optional")
      .map((p) => ({
        label: "Optional",
        value: String(p.score),
        note: "out of 500",
      })),
  ];

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
      <div className="mx-auto max-w-[1120px] px-6">
        <nav
          aria-label="Breadcrumb"
          className="t-meta flex flex-wrap items-center gap-x-2 gap-y-1"
        >
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-[var(--ink)]">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-[var(--ink-2)]">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <h1 className="t-display h-hero">
              {h.name}
              <span className="mt-3 block text-[0.42em] leading-[1.1] tracking-[-0.025em] text-[var(--ink-2)]">
                {"AIR "}
                <span className="swipe text-[var(--ink)]">{`${h.rank}, CSE ${h.year}`}</span>
                {h.optional && (
                  <>
                    {" · "}
                    {h.optionalHref ? (
                      <Link
                        href={h.optionalHref}
                        className="text-[var(--accent)] hover:underline"
                      >
                        {h.optional}
                      </Link>
                    ) : (
                      h.optional
                    )}
                  </>
                )}
              </span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[18px] leading-[1.55] text-[var(--ink-2)] sm:text-[19px]">
              {h.hook}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={h.papers.length ? "#marks" : "#answer-copy"}
                data-track="topper-hero-primary"
                className="btn btn-blue"
              >
                {h.papers.length
                  ? "See every paper"
                  : `${h.first}'s answer copy`}{" "}
                <span className="knob">↓</span>
              </a>
              {h.hasCopy && h.papers.length > 0 && (
                <a
                  href="#answer-copy"
                  data-track="topper-hero-copy"
                  className="btn btn-paper"
                >
                  Read the answer copy
                </a>
              )}
              <AskLink
                query={`Tell me about ${h.name}'s UPSC strategy`}
                data-track="topper-ask-ai"
                className="px-2 text-[15px] font-semibold text-[var(--accent)] hover:underline"
              >
                {`Ask AI about ${h.first} →`}
              </AskLink>
            </div>

            {facts.length > 0 && (
              <dl className="mt-12 grid max-w-[34rem] grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-[var(--line)] shadow-[0_0_0_1px_var(--line)] sm:grid-cols-4">
                {facts.map((f) => (
                  <div key={f.label} className="bg-white px-4 py-4">
                    <dt className="t-meta">{f.label.toUpperCase()}</dt>
                    <dd className="t-head tab mt-1.5 text-[26px]">{f.value}</dd>
                    <dd className="text-[12px] text-[var(--muted)]">
                      {f.note}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            {/* a second sheet underneath, so the statement reads as paper on a desk */}
            <div
              aria-hidden
              className="paper absolute inset-x-4 inset-y-6 -rotate-[3deg] opacity-70"
            />
            <div className="relative">
              <Statement h={h} />
              <p className="t-meta mt-5 text-right">
                Source:{" "}
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {`UPSC CSE ${h.year} final result`}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
