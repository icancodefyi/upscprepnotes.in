import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { topperImageSrc } from "@/lib/utils";
import {
  PAPERS,
  displayName,
  fmt,
  freeCopiesOf,
  isPlaceholder,
  subjectOf,
  totalOf,
  n,
  type LeanTopper,
} from "@/lib/topper-stats";
import BrandShell from "@/components/brand/BrandShell";
import ComparePicker, { type PickItem } from "@/components/brand/ComparePicker";

export const revalidate = 3600;

type Props = { params: Promise<{ pair: string }> };

const SEP = "-vs-";
const split = (pair: string) => {
  const i = pair.indexOf(SEP);
  return i > 0 ? [pair.slice(0, i), pair.slice(i + SEP.length)] : [null, null];
};

const avatarOf = (t: LeanTopper) =>
  topperImageSrc({ slug: t.slug, ProfileImage: t.ProfileImage, firstName: t.firstName ?? "", lastName: t.lastName ?? "" });

async function load(pair: string) {
  const [sa, sb] = split(pair);
  if (!sa || !sb || sa === sb) return null;
  await connectDB();
  const all = (await TopperModel.find(
    {},
    { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, freeAnswerCopyUrls: 1, freeAnswerCopyUrl: 1, ProfileImage: 1 },
  ).lean()) as LeanTopper[];
  const a = all.find((t) => t.slug === sa);
  const b = all.find((t) => t.slug === sb);
  if (!a || !b) return null;
  return { a, b, all };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const d = await load(pair);
  if (!d) return { title: "Comparison not found" };
  const [x, y] = [d.a, d.b].sort((p, q) => (p.slug ?? "").localeCompare(q.slug ?? ""));
  const title = `${displayName(d.a)} vs ${displayName(d.b)}: UPSC Marks Compared Paper by Paper`;
  const description = `${displayName(d.a)} (AIR ${d.a.rank}, CSE ${d.a.year}) and ${displayName(d.b)} (AIR ${d.b.rank}, CSE ${d.b.year}) side by side: essay, GS I–IV, optional and interview marks from UPSC's final result.`;
  return {
    title,
    description,
    // One canonical URL per pair, whichever order it was opened in.
    alternates: { canonical: `https://upscprepnotes.in/compare/${x.slug}${SEP}${y.slug}` },
    openGraph: { title, description, url: `https://upscprepnotes.in/compare/${x.slug}${SEP}${y.slug}`, siteName: "UPSCPrepNotes" },
  };
}

function Person({ t, lead, side }: { t: LeanTopper; lead: boolean; side: "a" | "b" }) {
  const total = isPlaceholder(t) ? 0 : totalOf(t);
  return (
    <Link
      href={`/upsc-topper/${t.slug}`}
      className={`group relative flex min-w-0 flex-1 flex-col items-center rounded-[24px] bg-white px-3 pb-5 pt-9 text-center sm:px-5 sm:pb-6 sm:pt-7 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5 ${side === "a" ? "sm:items-start sm:text-left" : "sm:items-end sm:text-right"}`}
    >
      {lead && total > 0 && (
        <span className={`absolute top-3 rounded-full bg-[var(--hl)] px-2 py-0.5 text-[11px] font-semibold text-[var(--hl-ink)] sm:top-4 sm:px-2.5 sm:text-[12px] ${side === "a" ? "left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0" : "left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0"}`}>
          Higher total
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatarOf(t)} alt={displayName(t)} className="h-14 w-14 rounded-[18px] bg-[#e9edff] object-cover object-top shadow-[0_0_0_1px_var(--line)] sm:h-20 sm:w-20 sm:rounded-[24px]" />
      <p className="t-head mt-3 line-clamp-2 text-[17px] group-hover:text-[var(--accent)] sm:mt-4 sm:text-[28px]">{displayName(t)}</p>
      <p className="mt-1 text-[13px] text-[var(--ink-2)] sm:text-[14.5px]">{`AIR ${t.rank} · CSE ${t.year}`}</p>
      {t.optionalSubject && <p className="truncate text-[12px] text-[var(--muted)] sm:text-[13.5px]">{`${subjectOf(t.optionalSubject)} optional`}</p>}
      <p className="relative mt-5 inline-block">
        <span className="t-display tab text-[32px] leading-none sm:text-[48px]">{total > 0 ? fmt(total) : "—"}</span>
        {lead && total > 0 && (
          <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible" style={{ "--d": "500ms" } as React.CSSProperties}>
            <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </p>
      <p className="mt-1 text-[12.5px] text-[var(--muted)]">out of 2,025</p>
    </Link>
  );
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const d = await load(pair);
  if (!d) notFound();
  const { a, b, all } = d;
  const an = displayName(a);
  const bn = displayName(b);
  const af = an.split(" ")[0];
  const bf = bn.split(" ")[0];
  const unverified = isPlaceholder(a) || isPlaceholder(b);

  // Paper rows: only papers both toppers have a valid mark for.
  const rows = unverified
    ? []
    : PAPERS.flatMap((p) => {
        const x = p.get(a);
        const y = p.get(b);
        if (x <= 0 || y <= 0 || x > p.max || y > p.max) return [];
        return [{ key: p.key, label: p.key === "optional" ? "Optional · Papers I + II" : p.label, max: p.max, x, y }];
      });
  const ta = unverified ? 0 : totalOf(a);
  const tb = unverified ? 0 : totalOf(b);
  const aWins = rows.filter((r) => r.x > r.y).length;
  const bWins = rows.filter((r) => r.y > r.x).length;
  const gap = [...rows].sort((p, q) => Math.abs(q.x - q.y) - Math.abs(p.x - p.y))[0];

  let verdict = "";
  if (unverified) verdict = "One of these records has marks that failed our checks, so we're not comparing them until they're verified against UPSC's result.";
  else if (ta && tb) {
    const leader = ta === tb ? null : ta > tb ? af : bf;
    verdict = leader
      ? `${leader} scored ${Math.abs(ta - tb)} more in total (${fmt(Math.max(ta, tb))} vs ${fmt(Math.min(ta, tb))}).`
      : `Both finished on exactly ${fmt(ta)}.`;
    if (rows.length) verdict += ` ${af} won ${aWins} of ${rows.length} papers, ${bf} won ${bWins}.`;
    if (gap && gap.x !== gap.y) verdict += ` The biggest gap was ${gap.label}: ${Math.abs(gap.x - gap.y)} marks in ${gap.x > gap.y ? af : bf}'s favour.`;
  }

  const items: PickItem[] = [...all]
    .sort((p, q) => (q.year ?? 0) - (p.year ?? 0) || (p.rank ?? 0) - (q.rank ?? 0))
    .map((t) => ({ slug: t.slug ?? "", name: displayName(t), rank: t.rank ?? 0, year: t.year ?? 0, optional: subjectOf(t.optionalSubject), avatar: avatarOf(t) }));

  // A few more comparisons people make: same optional and same year, for each side.
  const suggest = (base: LeanTopper, other: LeanTopper) =>
    all
      .filter((t) => t.slug !== base.slug && t.slug !== other.slug && !isPlaceholder(t) && totalOf(t) > 0)
      .filter((t) => subjectOf(t.optionalSubject) === subjectOf(base.optionalSubject) || t.year === base.year)
      .sort((p, q) => Number(subjectOf(q.optionalSubject) === subjectOf(base.optionalSubject)) - Number(subjectOf(p.optionalSubject) === subjectOf(base.optionalSubject)) || (p.rank ?? 0) - (q.rank ?? 0))
      .slice(0, 3)
      .map((t) => ({ href: `/compare/${base.slug}${SEP}${t.slug}`, label: `${displayName(base).split(" ")[0]} vs ${displayName(t)}` }));
  const more = [...suggest(a, b), ...suggest(b, a)];

  const free = [a, b].filter((t) => freeCopiesOf(t).length > 0);

  return (
    <BrandShell>
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1000px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Compare</span>
          </nav>

          <h1 className="t-display mt-8 text-[clamp(32px,4vw,52px)] leading-[1.02]">
            {an} <span className="text-[var(--muted)]">vs</span> {bn}
          </h1>
          <p className="mt-4 max-w-[44rem] text-[17px] leading-[1.6] text-[var(--ink-2)]">{verdict || "UPSC marks, paper by paper, from the final result."}</p>

          <div className="relative mt-10 flex gap-2.5 sm:gap-3">
            <Person t={a} lead={ta > tb} side="a" />
            <span className="t-display absolute left-1/2 top-1/2 z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--ink)] text-[14px] text-white shadow-[0_8px_20px_-8px_rgba(11,12,16,0.6)] sm:h-14 sm:w-14 sm:text-[18px]">
              vs
            </span>
            <Person t={b} lead={tb > ta} side="b" />
          </div>

          {rows.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2)]">
              <div className="t-meta grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[var(--line)] px-5 py-3.5 sm:px-6">
                <span className="truncate">{af.toUpperCase()}</span>
                <span>PAPER</span>
                <span className="truncate text-right">{bf.toUpperCase()}</span>
              </div>
              <ul className="divide-y divide-[var(--line)]">
                {rows.map((r) => {
                  const aw = r.x > r.y;
                  const bw = r.y > r.x;
                  return (
                    <li key={r.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 sm:px-6">
                      {/* A: bar grows leftwards from the centre */}
                      <div className="flex items-center justify-end gap-3">
                        <span className={`tab text-[17px] ${aw ? "font-bold text-[var(--accent)]" : "text-[var(--ink-2)]"}`}>{r.x}</span>
                        <span className="hidden h-[8px] w-full max-w-[220px] justify-end overflow-hidden rounded-full bg-[var(--canvas)] sm:flex">
                          <span className={`h-full rounded-full ${aw ? "bg-[var(--accent)]" : "bg-[#c5cbd8]"}`} style={{ width: `${(r.x / r.max) * 100}%` }} />
                        </span>
                      </div>
                      <div className="w-[118px] text-center sm:w-[170px]">
                        <p className="text-[13.5px] font-semibold leading-tight sm:text-[14.5px]">{r.label}</p>
                        <p className="tab text-[12px] text-[var(--muted)]">
                          {r.x === r.y ? `level · of ${r.max}` : `${aw ? "◀" : ""} ${Math.abs(r.x - r.y)} ${bw ? "▶" : ""} · of ${r.max}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden h-[8px] w-full max-w-[220px] overflow-hidden rounded-full bg-[var(--canvas)] sm:flex">
                          <span className={`h-full rounded-full ${bw ? "bg-[var(--accent)]" : "bg-[#c5cbd8]"}`} style={{ width: `${(r.y / r.max) * 100}%` }} />
                        </span>
                        <span className={`tab text-[17px] ${bw ? "font-bold text-[var(--accent)]" : "text-[var(--ink-2)]"}`}>{r.y}</span>
                      </div>
                    </li>
                  );
                })}
                {n(a, "written") > 0 && n(b, "written") > 0 && (
                  <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 bg-[var(--canvas)]/70 px-5 py-4 sm:px-6">
                    <span className={`tab text-right text-[17px] ${n(a, "written") > n(b, "written") ? "font-bold" : ""}`}>{fmt(n(a, "written"))}</span>
                    <span className="w-[118px] text-center text-[14px] font-semibold sm:w-[170px]">Written total</span>
                    <span className={`tab text-[17px] ${n(b, "written") > n(a, "written") ? "font-bold" : ""}`}>{fmt(n(b, "written"))}</span>
                  </li>
                )}
                <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 bg-[#e9edff] px-5 py-5 sm:px-6">
                  <span className={`t-head tab text-right text-[24px] ${ta > tb ? "text-[var(--accent-deep)]" : "text-[var(--ink-2)]"}`}>{fmt(ta)}</span>
                  <span className="w-[118px] text-center text-[14px] font-semibold text-[var(--accent-deep)] sm:w-[170px]">Final total</span>
                  <span className={`t-head tab text-[24px] ${tb > ta ? "text-[var(--accent-deep)]" : "text-[var(--ink-2)]"}`}>{fmt(tb)}</span>
                </li>
              </ul>
              <p className="border-t border-[var(--line)] px-6 py-3.5 text-[13px] text-[var(--muted)]">
                {`Marks from UPSC's final results for CSE ${a.year === b.year ? a.year : `${a.year} and ${b.year}`}. Blue marks the higher score in each paper.`}
              </p>
            </div>
          )}

          {!unverified && rows.length === 0 && (
            <p className="mt-10 rounded-[24px] bg-white p-6 text-[15.5px] leading-[1.6] text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)]">
              Paper-by-paper marks aren&apos;t on record for one of these toppers, so only the totals can be compared.
            </p>
          )}

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-[15px] font-semibold">{`Compare ${af} with someone else`}</p>
              <div className="mt-3">
                <ComparePicker base={a.slug ?? ""} items={items} side="b" />
              </div>
            </div>
            <div>
              <p className="text-[15px] font-semibold">{`Compare ${bf} with someone else`}</p>
              <div className="mt-3">
                <ComparePicker base={b.slug ?? ""} items={items} side="b" />
              </div>
            </div>
          </div>

          {more.length > 0 && (
            <div className="mt-12">
              <h2 className="t-head text-[24px]">More comparisons</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {more.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} className="inline-flex rounded-full bg-white px-4 py-2 text-[14px] font-medium text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)]">
                      {m.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            {[a, b].map((t) => (
              <Link key={t.slug} href={`/upsc-topper/${t.slug}`} className="btn btn-paper">
                {`${displayName(t)}'s full profile`} <span className="knob">↗</span>
              </Link>
            ))}
            {free.length > 0 && (
              <Link href={`/upsc-topper/${free[0].slug}#answer-copy`} className="btn btn-blue">
                {`Read ${displayName(free[0]).split(" ")[0]}'s free answer copy`} <span className="knob">↗</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
