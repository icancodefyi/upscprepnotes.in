import Link from "next/link";
import AskLink from "@/components/AskLink";
import { fmt } from "@/lib/topper-stats";
import ReportLink from "./ReportLink";
import Toc from "./Toc";
import { RankStamp, card } from "./ui";

export type HeaderData = {
  name: string;
  first: string;
  rank: number;
  year: number;
  optional: string;
  optionalHref: string | null;
  avatar: string;
  total: number;
  written: number;
  interview: number;
  optionalScore: number;
  requests: number;
  copyLabel: string;
  summary: string;
};

/** The result as a marks statement on paper, with the examiner's red circle round the total. */
function ResultCard({ h }: { h: HeaderData }) {
  const rows = [
    ...(h.written > 0 ? [{ k: "Written", v: fmt(h.written), of: "1,750" }] : []),
    ...(h.interview > 0 ? [{ k: "Interview", v: String(h.interview), of: "275" }] : []),
    ...(h.optionalScore > 0 ? [{ k: `Optional${h.optional ? ` · ${h.optional}` : ""}`, v: String(h.optionalScore), of: "500" }] : []),
  ];
  return (
    <div className="relative w-full lg:w-[340px]">
      <div aria-hidden className="paper absolute inset-x-3 inset-y-3 rotate-[3deg] opacity-60" />
      <div className="paper relative -rotate-[1deg] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="t-meta">{`RESULT · UPSC CSE ${h.year}`}</p>
            <p className="mt-1 text-[13.5px] text-[var(--ink-2)]">Final total, out of 2,025</p>
          </div>
          <RankStamp rank={h.rank} size={54} />
        </div>
        {h.total > 0 ? (
          <p className="relative mt-3 inline-block">
            <span className="t-display tab text-[64px] leading-none">{fmt(h.total)}</span>
            <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible" style={{ "--d": "500ms" } as React.CSSProperties}>
              <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </p>
        ) : (
          <p className="mt-4 text-[14px] leading-[1.5] text-[var(--ink-2)]">Marks are being checked against UPSC&apos;s published result.</p>
        )}
        {rows.length > 0 && (
          <dl className="mt-5 space-y-2 border-t border-dashed border-[var(--line-2)] pt-4 text-[14px]">
            {rows.map((r) => (
              <div key={r.k} className="flex items-baseline justify-between gap-3">
                <dt className="truncate text-[var(--ink-2)]">{r.k}</dt>
                <dd className="tab shrink-0">
                  <span className="font-semibold">{r.v}</span>
                  <span className="text-[var(--muted)]">{` / ${r.of}`}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
        {h.requests > 0 && (
          <a href="#answer-copy" className="mt-5 flex items-center justify-between gap-3 rounded-[12px] bg-[#e9edff] px-3.5 py-2.5 text-[13.5px] text-[var(--accent-deep)] hover:bg-[#dfe5ff]">
            <span>
              <span className="tab font-semibold">{fmt(h.requests)}</span>
              {` aspirant${h.requests === 1 ? "" : "s"} requested ${h.first}'s copy`}
            </span>
            <span aria-hidden>↓</span>
          </a>
        )}
      </div>
    </div>
  );
}

/** Profile header: who and which rank on the left, the result on paper on the right. */
export function Header({ h, crumbs }: { h: HeaderData; crumbs: { href?: string; label: string }[] }) {
  return (
    <header>
      <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {c.href ? <Link href={c.href} className="hover:text-[var(--ink)]">{c.label}</Link> : <span aria-current="page" className="text-[var(--ink-2)]">{c.label}</span>}
          </span>
        ))}
      </nav>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-[40rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={h.avatar}
            alt={h.name}
            width={96}
            height={96}
            className="h-[88px] w-[88px] rounded-[26px] bg-[#e9edff] object-cover object-top shadow-[0_0_0_1px_var(--line),0_10px_24px_-14px_rgba(11,12,16,0.45)] sm:h-[96px] sm:w-[96px]"
          />
          <h1 className="t-display mt-6 text-[clamp(38px,4.6vw,60px)] leading-[1]">{h.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] text-[var(--ink-2)]">
            <span className="rounded-full bg-[var(--hl)] px-2.5 py-0.5 font-semibold text-[var(--ink)]">{`AIR ${h.rank}`}</span>
            <Link href={`/year/${h.year}`} className="hover:text-[var(--accent)]">{`UPSC CSE ${h.year}`}</Link>
            {h.optional && (
              <>
                <span aria-hidden>·</span>
                {h.optionalHref ? <Link href={h.optionalHref} className="text-[var(--accent)] hover:underline">{`${h.optional} optional`}</Link> : <span>{`${h.optional} optional`}</span>}
              </>
            )}
          </p>
          <p className="mt-5 text-[17px] leading-[1.6] text-[var(--ink-2)]">{h.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#answer-copy" data-track="topper-header-copy" className="btn btn-blue">
              {h.copyLabel} <span className="knob">↓</span>
            </a>
            <AskLink query={`Tell me about ${h.name}'s UPSC strategy`} data-track="topper-ask-ai" className="btn btn-paper">
              {`Ask AI about ${h.first}`}
            </AskLink>
          </div>
        </div>
        <ResultCard h={h} />
      </div>
    </header>
  );
}

export type SidebarData = {
  name: string;
  first: string;
  year: number;
  optional: string;
  optionalHref: string | null;
  copyLabel: string;
  copyNote: string;
  toc: { id: string; label: string }[];
  compilation: { href: string; title: string; price: number; image: string | null; detail: string } | null;
};

/** Sticky on desktop: where things are on the page, the copy, and the one store product that fits. */
export function Sidebar({ s }: { s: SidebarData }) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className={`${card} hidden p-5 lg:block`}>
        <a href="#answer-copy" data-track="topper-side-copy" className="btn btn-blue w-full justify-between">
          {s.copyLabel} <span className="knob">↓</span>
        </a>
        <p className="mt-2.5 text-center text-[12.5px] text-[var(--muted)]">{s.copyNote}</p>
        <AskLink
          query={`Tell me about ${s.name}'s UPSC strategy`}
          data-track="topper-ask-ai-side"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-full py-2 text-[14px] font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)]"
        >
          {`Ask AI about ${s.first} →`}
        </AskLink>
      </div>

      <nav aria-label="On this page" className={`${card} hidden p-5 lg:block`}>
        <p className="t-meta">ON THIS PAGE</p>
        <Toc items={s.toc} />
      </nav>

      {s.compilation && (
        <Link href={s.compilation.href} data-track="topper-side-store" className={`${card} group flex gap-4 p-4`}>
          {s.compilation.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.compilation.image} alt="" aria-hidden loading="lazy" className="h-[92px] w-[72px] shrink-0 rounded-[8px] object-cover shadow-[0_0_0_1px_var(--line)]" />
          )}
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold leading-tight group-hover:text-[var(--accent)]">{s.compilation.title}</span>
            <span className="mt-1 block text-[13px] leading-[1.45] text-[var(--muted)]">{s.compilation.detail}</span>
            <span className="mt-2 inline-block rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-[14px] font-bold">{`₹${s.compilation.price}`}</span>
          </span>
        </Link>
      )}

      <div className={`${card} p-5`}>
        <p className="t-meta">EXPLORE</p>
        <ul className="mt-3 space-y-1 text-[14.5px]">
          {[
            { href: `/year/${s.year}`, label: `All CSE ${s.year} toppers` },
            ...(s.optionalHref ? [{ href: s.optionalHref, label: `${s.optional} toppers` }] : []),
            { href: "/toppers/marks-database", label: "Marks database" },
            { href: "/free-materials", label: "Free study material" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                {l.label} <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-[var(--line)] pt-4">
          <ReportLink first={s.first} />
        </div>
      </div>
    </aside>
  );
}
