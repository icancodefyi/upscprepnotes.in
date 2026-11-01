import Link from "next/link";
import AskLink from "@/components/AskLink";
import { fmt } from "@/lib/topper-stats";
import ReportLink from "./ReportLink";
import Toc from "@/components/brand/Toc";
import { RankStamp, card } from "@/components/brand/ui";
import { Paperclip } from "@/components/brand/Props";

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

/**
 * The result as a printed marks statement clipped to the page: a passport photo held by a paperclip,
 * ruled rows like a real marksheet, the AIR stamped in red and the total circled in examiner's ink.
 * Deliberately not styled as an official UPSC document; the source line says where the marks come from.
 */
function ResultCard({ h }: { h: HeaderData }) {
  const rows = [
    ...(h.written > 0 ? [{ k: "Written (mains)", max: "1,750", v: fmt(h.written) }] : []),
    ...(h.optionalScore > 0 ? [{ k: "incl. Optional", max: "500", v: String(h.optionalScore), sub: true }] : []),
    ...(h.interview > 0 ? [{ k: "Personality test", max: "275", v: String(h.interview) }] : []),
  ];
  return (
    <div className="relative w-full pt-4 lg:w-[380px]">
      {/* the sheet underneath, slightly askew */}
      <div aria-hidden className="paper absolute inset-x-4 bottom-2 top-7 rotate-[2.5deg] opacity-70" />
      <div className="paper relative -rotate-[0.8deg] px-6 pb-5 pt-6">
        {/* passport photo, clipped on */}
        <div className="absolute -top-4 right-6 rotate-[4deg]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={h.avatar} alt={h.name} width={64} height={78} className="h-[78px] w-[64px] bg-[#e9edff] object-cover object-top shadow-[0_0_0_3px_#fff,0_0_0_4px_var(--line-2),0_6px_12px_-6px_rgba(11,12,16,0.4)]" />
          <Paperclip className="absolute -top-7 left-3 h-[84px] w-[31px] rotate-[-8deg]" />
        </div>

        <p className="t-meta">MARKS STATEMENT</p>
        <p className="mt-0.5 text-m font-bold">{`Civil Services Examination ${h.year}`}</p>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-s">
          <dt className="text-[var(--muted)]">Name</dt>
          <dd className="truncate font-bold">{h.name}</dd>
          {h.optional && (
            <>
              <dt className="text-[var(--muted)]">Optional</dt>
              <dd className="truncate">{h.optional}</dd>
            </>
          )}
        </dl>

        {h.total > 0 ? (
          <table className="mt-4 w-full border-collapse text-s">
            <thead>
              <tr className="border-y-2 border-[var(--ink)] text-left">
                <th scope="col" className="py-1.5 font-bold">Paper</th>
                <th scope="col" className="py-1.5 text-right font-bold">Max</th>
                <th scope="col" className="py-1.5 pl-3 text-right font-bold">Marks</th>
              </tr>
            </thead>
            <tbody className="tab">
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-[var(--line-2)]">
                  <td className={`max-w-0 truncate py-1.5 ${r.sub ? "pl-3 text-[var(--muted)]" : ""}`}>{r.k}</td>
                  <td className="py-1.5 text-right text-[var(--muted)]">{r.max}</td>
                  <td className={`py-1.5 pl-3 text-right ${r.sub ? "text-[var(--muted)]" : "font-bold"}`}>{r.v}</td>
                </tr>
              ))}
              <tr className="border-b-2 border-[var(--ink)]">
                <td className="py-2 font-bold">Grand total</td>
                <td className="py-2 text-right text-[var(--muted)]">2,025</td>
                <td className="py-2 pl-3 text-right">
                  <span className="relative inline-block">
                    <span className="t-display text-l leading-none">{fmt(h.total)}</span>
                    <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible" style={{ "--d": "500ms" } as React.CSSProperties}>
                      <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="mt-4 border-y-2 border-[var(--ink)] py-3 text-s leading-[1.5] text-[var(--ink-2)]">Marks are being checked against UPSC&apos;s published result.</p>
        )}

        <div className="mt-3 flex items-start justify-between gap-3">
          <p className="pt-1 text-s leading-[1.4] text-[var(--muted)]">{`Source: UPSC final result, CSE ${h.year}`}</p>
          {/* pressed onto the sheet, overlapping the closing rule */}
          <span className="-mt-6 mr-20 opacity-90 mix-blend-multiply">
            <RankStamp rank={h.rank} size={64} />
          </span>
        </div>

        {h.requests > 0 && (
          <a href="#answer-copy" className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-[#e9edff] px-3.5 py-2.5 text-s text-[var(--accent-deep)] hover:bg-[#dfe5ff]">
            <span>
              <span className="tab font-bold">{fmt(h.requests)}</span>
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
          <h1 className="t-display text-l leading-[1]">{h.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-m text-[var(--ink-2)]">
            <span className="rounded-full bg-[var(--hl)] px-2.5 py-0.5 font-bold text-[var(--ink)]">{`AIR ${h.rank}`}</span>
            <Link href={`/year/${h.year}`} className="hover:text-[var(--accent)]">{`UPSC CSE ${h.year}`}</Link>
            {h.optional && (
              <>
                <span aria-hidden>·</span>
                {h.optionalHref ? <Link href={h.optionalHref} className="text-[var(--accent)] hover:underline">{`${h.optional} optional`}</Link> : <span>{`${h.optional} optional`}</span>}
              </>
            )}
          </p>
          <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">{h.summary}</p>
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
        <a href="#answer-copy" data-track="topper-side-copy" className="btn btn-blue w-full justify-between [--btn-fs:14px]">
          {s.copyLabel} <span className="knob">↓</span>
        </a>
        <p className="mt-2.5 text-center text-s text-[var(--muted)]">{s.copyNote}</p>
        <AskLink
          query={`Tell me about ${s.name}'s UPSC strategy`}
          data-track="topper-ask-ai-side"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-full py-2 text-s font-bold text-[var(--accent)] hover:bg-[var(--accent-soft)]"
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
            <span className="block text-m font-bold leading-tight group-hover:text-[var(--accent)]">{s.compilation.title}</span>
            <span className="mt-1 block text-s leading-[1.45] text-[var(--muted)]">{s.compilation.detail}</span>
            <span className="mt-2 inline-block rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-s font-bold">{`₹${s.compilation.price}`}</span>
          </span>
        </Link>
      )}

      <div className={`${card} p-5`}>
        <p className="t-meta">EXPLORE</p>
        <ul className="mt-3 space-y-1 text-s">
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
