import Link from "next/link";
import AskLink from "@/components/AskLink";
import { fmt } from "@/lib/topper-stats";
import ReportLink from "./ReportLink";
import Toc from "@/components/brand/Toc";
import LiveCounter from "@/components/topper/LiveCounter";
import ReportButton from "@/components/ReportButton";
import AfterHeader from "./AfterHeader";
import { card } from "@/components/brand/ui";
import { Paperclip } from "@/components/brand/Props";
import InterviewPackPromo from "@/components/store/InterviewPackPromo";

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
 * The result as a statement of marks: straight, ruled and quiet, so it reads like a record rather
 * than a sticker. The photo is clipped into an ID frame; the only red on the sheet is the circled total.
 * Deliberately not styled as an official UPSC document; the footer names the source.
 */
function ResultCard({ h }: { h: HeaderData }) {
  const rows = [
    ...(h.written > 0 ? [{ k: "Written examination", max: "1,750", v: fmt(h.written) }] : []),
    ...(h.interview > 0 ? [{ k: "Personality test", max: "275", v: String(h.interview) }] : []),
  ];
  // Marked up like a printout: rank highlighted, optional in blue ink, total circled in red.
  const fields: { k: string; v: React.ReactNode }[] = [
    { k: "Candidate", v: <span className="font-bold">{h.name}</span> },
    { k: "All India Rank", v: <span className="swipe font-bold">{`AIR ${h.rank}`}</span> },
    ...(h.optional
      ? [{
          k: "Optional",
          v: h.optionalHref ? (
            <Link href={h.optionalHref} className="font-bold text-[var(--accent)] underline decoration-[var(--accent)]/40 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]">{h.optional}</Link>
          ) : (
            <span className="font-bold text-[var(--accent)]">{h.optional}</span>
          ),
        }]
      : []),
  ];
  return (
    <div className="w-full pt-5 lg:w-[410px]">
      <div className="relative rounded-[6px] border-t-[3px] border-[var(--ink)] bg-white px-6 pb-5 pt-5 shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.05),0_18px_40px_-20px_rgba(11,12,16,0.35)]">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-m font-bold">Statement of marks</p>
            <p className="text-s text-[var(--muted)]">{`Civil Services Examination ${h.year}`}</p>
            <dl className="mt-4 space-y-1.5 text-s">
              {fields.map((f) => (
                <div key={f.k} className="grid grid-cols-[100px_1fr] gap-2">
                  <dt className="text-[var(--muted)]">{f.k}</dt>
                  <dd className="min-w-0 break-words">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* photo in an ID frame, held by the clip */}
          <div className="relative -mt-9 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.avatar} alt={h.name} width={72} height={88} className="h-[88px] w-[72px] bg-[#e9edff] object-cover object-top shadow-[0_0_0_3px_#fff,0_0_0_4px_var(--line-2),0_6px_14px_-8px_rgba(11,12,16,0.45)]" />
            <Paperclip className="absolute -top-6 left-2 h-[80px] w-[29px] rotate-[-6deg]" />
          </div>
        </div>

        {h.total > 0 ? (
          <table className="mt-5 w-full border-collapse text-s">
            <thead>
              <tr className="border-b border-[var(--ink)] text-left">
                <th scope="col" className="pb-2 font-normal text-[var(--muted)]">Component</th>
                <th scope="col" className="pb-2 text-right font-normal text-[var(--muted)]">Max</th>
                <th scope="col" className="pb-2 pl-4 text-right font-normal text-[var(--muted)]">Obtained</th>
              </tr>
            </thead>
            <tbody className="tab">
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-[var(--line-2)]">
                  <td className="py-2.5">{r.k}</td>
                  <td className="py-2.5 text-right text-[var(--muted)]">{r.max}</td>
                  <td className="py-2.5 pl-4 text-right font-bold">{r.v}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="tab">
              <tr className="border-t-[3px] border-double border-[var(--ink)]">
                <td className="pt-3 font-bold">Total</td>
                <td className="pt-3 text-right text-[var(--muted)]">2,025</td>
                <td className="pt-3 pl-4 text-right">
                  <span className="relative inline-block">
                    <span className="t-display text-l leading-none">{fmt(h.total)}</span>
                    <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible" style={{ "--d": "500ms" } as React.CSSProperties}>
                      <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="mt-5 border-y border-[var(--ink)] py-3 text-s leading-[1.5] text-[var(--ink-2)]">Marks are being checked against UPSC&apos;s published result.</p>
        )}

        <p className="mt-5 flex items-center gap-2 border-t border-[var(--line)] pt-3 text-s text-[var(--muted)]">
          <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="8" cy="8" r="6.5" />
            <path d="M5.2 8.2l1.9 1.9 3.7-3.9" />
          </svg>
          {`As published in UPSC's final result, CSE ${h.year}`}
        </p>
      </div>
    </div>
  );
}

/** Two sentences up front; the full background stays on the page, one tap away. */
function Summary({ text }: { text: string }) {
  const sentences = text.split(/(?<![A-Z]\.)(?<!Dr\.)(?<!Mr\.)(?<!Mrs\.)(?<!Ms\.)(?<!St\.)(?<=[.!?])\s+(?=[A-Z“"])/).map((x) => x.trim()).filter(Boolean);
  let lead = "";
  let n = 0;
  for (const sent of sentences) {
    if (n >= 2 || (lead && (lead + " " + sent).length > 260)) break;
    lead = lead ? `${lead} ${sent}` : sent;
    n++;
  }
  const rest = text.slice(text.indexOf(lead) + lead.length).trim();
  return (
    <div className="mt-5 max-w-[38rem]">
      <p className="text-m leading-[1.6] text-[var(--ink-2)]">{lead || text}</p>
      {rest && (
        <details className="group mt-2">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 py-1 text-s font-bold text-[var(--accent)] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Read the full background</span>
            <span className="hidden group-open:inline">Show less</span>
            <span aria-hidden className="transition-transform duration-200 group-open:rotate-180">↓</span>
          </summary>
          <p className="mt-2 text-m leading-[1.7] text-[var(--ink-2)]">{rest}</p>
        </details>
      )}
    </div>
  );
}

/** Profile header: who and which rank on the left, the result on paper on the right. */
export function Header({ h, crumbs }: { h: HeaderData; crumbs: { href?: string; label: string }[] }) {
  return (
    <header id="profile-header">
      <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {c.href ? <Link href={c.href} className="hover:text-[var(--ink)]">{c.label}</Link> : <span aria-current="page" className="text-[var(--ink-2)]">{c.label}</span>}
          </span>
        ))}
      </nav>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-[40rem] lg:pt-10">
          <h1 className="t-display text-h1">{h.name}</h1>
          {/* original subline: AIR · year · optional */}
          <p className="mt-3 text-m font-bold text-[var(--accent)]">{[`AIR ${h.rank}`, h.year, h.optional].filter(Boolean).join(" · ")}</p>
          {h.summary && <Summary text={h.summary} />}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/store" data-track="topper-hero-store" className="btn btn-blue">
              Browse store &rarr;
            </Link>
            <AskLink query={`Tell me about ${h.name}'s UPSC strategy`} data-track="topper-ask-ai" className="btn btn-paper">
              Ask AI
            </AskLink>
          </div>
          <div className="mt-4">
            <InterviewPackPromo variant="line" track="topper-hero-interview-pack" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <LiveCounter />
            <ReportButton topperName={h.name} />
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
      <div className="hidden lg:block">
      <AfterHeader>
      <div className={`${card} mb-4 p-5`}>
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
      </AfterHeader>
      </div>

      <nav aria-label="On this page" className={`${card} hidden p-5 lg:block`}>
        <p className="text-m font-bold">On this page</p>
        <Toc items={s.toc} />
      </nav>

      <InterviewPackPromo variant="side" track="topper-side-interview-pack" />

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
        <p className="text-m font-bold">Explore</p>
        <ul className="mt-3 space-y-1 text-s">
          {[
            { href: `/year/${s.year}`, label: `All CSE ${s.year} toppers` },
            ...(s.optionalHref ? [{ href: s.optionalHref, label: `${s.optional} toppers` }] : []),
            { href: "/toppers/marks-database", label: "Marks database" },
            { href: "/toppers/highest-marks-in-upsc", label: "Highest marks in UPSC" },
            { href: "/toppers/upsc-interview-marks", label: "UPSC interview marks" },
            { href: "/store/upsc-interview-pack", label: "UPSC Interview Pack" },
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
