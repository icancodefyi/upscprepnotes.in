import Link from "next/link";
import AskLink from "@/components/AskLink";
import { fmt } from "@/lib/topper-stats";
import ReportLink from "./ReportLink";
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

/** Profile header: who, which rank, and the five numbers people come for. */
export function Header({ h, crumbs }: { h: HeaderData; crumbs: { href?: string; label: string }[] }) {
  const COLS: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5" };

  const stats = [
    ...(h.total > 0 ? [{ k: "Total marks", v: fmt(h.total), n: "of 2,025" }] : []),
    ...(h.written > 0 ? [{ k: "Written", v: fmt(h.written), n: "of 1,750" }] : []),
    ...(h.interview > 0 ? [{ k: "Interview", v: String(h.interview), n: "of 275" }] : []),
    ...(h.optionalScore > 0 ? [{ k: "Optional", v: String(h.optionalScore), n: "of 500" }] : []),
    { k: "Copy requests", v: fmt(h.requests), n: "aspirants" },
  ];

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

      <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-center">
        <div className="relative w-fit shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={h.avatar}
            alt={h.name}
            width={136}
            height={136}
            className="h-[112px] w-[112px] rounded-[32px] bg-[#e9edff] object-cover object-top shadow-[0_0_0_1px_var(--line),0_10px_24px_-14px_rgba(11,12,16,0.45)] sm:h-[136px] sm:w-[136px]"
          />
          <span className="absolute -bottom-3 -right-4 rounded-full bg-white p-1 shadow-[0_6px_14px_-8px_rgba(11,12,16,0.5)]">
            <RankStamp rank={h.rank} size={58} />
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="t-display text-[clamp(36px,4.4vw,56px)] leading-[1]">{h.name}</h1>
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
          <p className="mt-4 max-w-[40rem] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">{h.summary}</p>
        </div>
      </div>

      <dl className={`${card} mt-9 grid grid-cols-2 divide-[var(--line)] ${COLS[Math.min(stats.length, 5)]} sm:divide-x`}>
        {stats.map((s, i) => (
          <div
            key={s.k}
            className={`px-5 py-4 ${i >= 2 ? "border-t border-[var(--line)] sm:border-t-0" : ""} ${i % 2 === 1 ? "border-l border-[var(--line)] sm:border-l-0" : ""} ${i === stats.length - 1 && stats.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <dt className="t-meta">{s.k.toUpperCase()}</dt>
            <dd className={`t-head tab mt-1.5 text-[26px] ${s.k === "Copy requests" ? "text-[var(--accent)]" : ""}`}>{s.v}</dd>
            <dd className="text-[12px] text-[var(--muted)]">{s.n}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3 lg:hidden">
        <a href="#answer-copy" data-track="topper-mobile-copy" className="btn btn-blue">
          {h.copyLabel} <span className="knob">↓</span>
        </a>
        <AskLink query={`Tell me about ${h.name}'s UPSC strategy`} data-track="topper-ask-ai" className="btn btn-paper">
          {`Ask AI about ${h.first}`}
        </AskLink>
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
        <ol className="mt-3 space-y-0.5">
          {s.toc.map((t, i) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="flex items-center gap-3 rounded-[10px] px-2 py-1.5 text-[14.5px] text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                <span className="t-meta tab w-5">{String(i + 1).padStart(2, "0")}</span>
                {t.label}
              </a>
            </li>
          ))}
        </ol>
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
