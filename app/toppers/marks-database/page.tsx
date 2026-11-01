import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { topperImageSrc } from "@/lib/utils";
import { PRODUCTS } from "@/lib/store-products";
import { displayName, fmt, isComplete, isPlaceholder, median, n, optionalSlug, subjectOf, totalOf, type LeanTopper } from "@/lib/topper-stats";
import BrandShell from "@/components/brand/BrandShell";
import { Section, card } from "@/components/brand/ui";
import MarksDB, { type Row } from "./_components/MarksDB";

export const revalidate = 3600;

const URL = "https://upscprepnotes.in/toppers/marks-database";
const PAPER_KEYS = ["essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2"] as const;

/** A record with only the headline numbers (UPSC hasn't released paper-wise marks for it yet). */
const totalsOnly = (t: LeanTopper) => {
  const w = n(t, "written");
  const i = n(t, "interview");
  return PAPER_KEYS.every((k) => n(t, k) === 0) && w > 500 && w <= 1750 && i > 0 && i <= 275 && n(t, "total") === w + i;
};

async function load() {
  await connectDB();
  const all = (await TopperModel.find({}, { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, ProfileImage: 1 }).lean()) as LeanTopper[];

  const rows: Row[] = all
    .filter((t) => t.slug && !isPlaceholder(t) && (isComplete(t) || totalsOnly(t)))
    .map((t) => {
      const full = isComplete(t);
      const papers = PAPER_KEYS.reduce((s, k) => s + n(t, k), 0);
      const w = n(t, "written");
      return {
        slug: t.slug ?? "",
        name: displayName(t),
        rank: t.rank ?? 0,
        year: t.year ?? 0,
        optional: /^\d*$/.test((t.optionalSubject ?? "").trim()) ? "" : subjectOf(t.optionalSubject),
        avatar: topperImageSrc({ slug: t.slug, ProfileImage: t.ProfileImage, firstName: t.firstName ?? "", lastName: t.lastName ?? "" }),
        full,
        essay: n(t, "essay"),
        gs1: n(t, "gs1"),
        gs2: n(t, "gs2"),
        gs3: n(t, "gs3"),
        gs4: n(t, "gs4"),
        opt1: n(t, "optional1"),
        opt2: n(t, "optional2"),
        // Some stored written totals are broken; the papers themselves are the source of truth.
        written: full ? (w > 0 && w <= 1750 && Math.abs(w - papers) <= 2 ? w : papers) : w,
        interview: n(t, "interview"),
        total: full ? totalOf(t) : n(t, "total"),
      };
    });
  return rows;
}

export async function generateMetadata(): Promise<Metadata> {
  const rows = await load();
  const full = rows.filter((r) => r.full).length;
  const title = "UPSC Topper Marks Database — Optional, GS1-4, Essay & Interview Scores";
  const description = `Search and sort the marks of ${fmt(rows.length)} UPSC toppers: GS1, GS2, GS3, GS4, Essay, Optional (PSIR, Sociology, Anthropology and more), Written, Interview and Total. ${fmt(full)} complete paper-wise marksheets, free.`;
  return {
    title,
    description,
    alternates: { canonical: URL },
    openGraph: { title: "UPSC Topper Marks Database — Optional, GS1-4 & Interview Scores", description, url: URL, siteName: "UPSCPrepNotes", images: [{ url: "/og/default.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: ["/og/default.png"] },
  };
}

const PAPERS = [
  { key: "essay", label: "Essay", max: 250, get: (r: Row) => r.essay },
  { key: "gs1", label: "GS Paper I", max: 250, get: (r: Row) => r.gs1 },
  { key: "gs2", label: "GS Paper II", max: 250, get: (r: Row) => r.gs2 },
  { key: "gs3", label: "GS Paper III", max: 250, get: (r: Row) => r.gs3 },
  { key: "gs4", label: "GS Paper IV · Ethics", max: 250, get: (r: Row) => r.gs4 },
  { key: "opt", label: "Optional · I + II", max: 500, get: (r: Row) => r.opt1 + r.opt2 },
  { key: "written", label: "Written total", max: 1750, get: (r: Row) => r.written },
  { key: "interview", label: "Interview", max: 275, get: (r: Row) => r.interview },
  { key: "total", label: "Final total", max: 2025, get: (r: Row) => r.total },
];

export default async function MarksDatabasePage() {
  const rows = await load();
  const full = rows.filter((r) => r.full);
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a);
  const optCounts = new Map<string, number>();
  for (const r of rows) if (r.optional) optCounts.set(r.optional, (optCounts.get(r.optional) ?? 0) + 1);
  const optionals = [...optCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  // Highest score in each paper, ties shown together.
  const records = PAPERS.map((p) => {
    const pool = (p.key === "written" || p.key === "interview" || p.key === "total" ? rows : full).filter((r) => p.get(r) > 0);
    const best = Math.max(...pool.map(p.get));
    return { ...p, best, who: pool.filter((r) => p.get(r) === best), median: median(pool.map(p.get)) };
  });
  const rec = Object.fromEntries(records.map((r) => [r.key, r]));

  // What the numbers say: plain comparisons computed from the table.
  const top100 = full.filter((r) => r.rank <= 100);
  const after500 = full.filter((r) => r.rank > 500);
  const ivs = rows.map((r) => r.interview);
  const optByMedian = optionals
    .filter(([, c]) => c >= 10)
    .map(([s]) => ({ s, m: median(full.filter((r) => r.optional === s).map((r) => r.opt1 + r.opt2)), c: full.filter((r) => r.optional === s).length }))
    .filter((o) => o.c >= 10)
    .sort((a, b) => b.m - a.m);
  const gsMedians = (["gs1", "gs2", "gs3", "gs4"] as const).map((k) => ({ k, m: rec[k].median }));
  const easiestGs = [...gsMedians].sort((a, b) => b.m - a.m)[0];
  const hardestGs = [...gsMedians].sort((a, b) => a.m - b.m)[0];
  const label = (k: string) => rec[k].label.replace(" · Ethics", "");

  const facts = [
    top100.length >= 10 && after500.length >= 10
      ? `Ranks 1–100 wrote a median ${fmt(median(top100.map((r) => r.written)))} in mains; ranks after 500 wrote ${fmt(median(after500.map((r) => r.written)))}. The interview medians were ${median(top100.map((r) => r.interview))} and ${median(after500.map((r) => r.interview))}.`
      : null,
    `Interview marks ran from ${Math.min(...ivs)} to ${Math.max(...ivs)} out of 275. Among people who all cleared mains, the interview alone produced a ${Math.max(...ivs) - Math.min(...ivs)}-mark spread.`,
    `${label(hardestGs.k)} is the toughest GS paper here (median ${hardestGs.m}); ${label(easiestGs.k)} is the most generous (median ${easiestGs.m}). Nobody in the table crossed ${Math.max(rec.gs1.best, rec.gs2.best, rec.gs3.best, rec.gs4.best)} in any GS paper.`,
    optByMedian.length >= 2
      ? `Among optionals with at least 10 marksheets, ${optByMedian[0].s} has the highest median (${optByMedian[0].m}/500, ${optByMedian[0].c} toppers) and ${optByMedian[optByMedian.length - 1].s} the lowest (${optByMedian[optByMedian.length - 1].m}/500). Small samples, so read it as a tendency, not a rule.`
      : null,
  ].filter(Boolean) as string[];

  // Comparisons to start with: AIR 1s across years, and 1 vs 2 within a year.
  const air = (rank: number, year: number) => full.find((r) => r.rank === rank && r.year === year);
  const pairs: { a: Row; b: Row }[] = [];
  for (let i = 0; i < years.length - 1; i++) {
    const a = air(1, years[i]);
    const b = air(1, years[i + 1]);
    if (a && b) pairs.push({ a, b });
  }
  for (const y of years) {
    const a = air(1, y);
    const b = air(2, y);
    if (a && b) pairs.push({ a, b });
  }
  const best = rec.total.who[0];
  const firstOfBestYear = air(1, best?.year ?? 0);
  if (best && firstOfBestYear && best.slug !== firstOfBestYear.slug) pairs.push({ a: best, b: firstOfBestYear });
  const starters = pairs.slice(0, 6);

  const comp = PRODUCTS.find((p) => p.slug === "answer-copies-compilation" && !p.comingSoon);
  const booklets = comp?.specs?.find((s) => s.label === "Answer Sheets")?.value;

  const faqs = [
    {
      q: "What are the total marks in the UPSC Civil Services exam?",
      a: "The final merit list is out of 2,025: 1,750 for the seven written mains papers (Essay, GS I–IV and two optional papers, 250 each) and 275 for the personality test. The two language papers are qualifying and don't count towards rank.",
    },
    {
      q: "How much do UPSC toppers score in GS papers?",
      a: `Across ${fmt(full.length)} complete marksheets, the median was ${rec.gs1.median} in GS I, ${rec.gs2.median} in GS II, ${rec.gs3.median} in GS III and ${rec.gs4.median} in GS IV, out of 250 each. The highest single GS score in the table is ${Math.max(rec.gs1.best, rec.gs2.best, rec.gs3.best, rec.gs4.best)}.`,
    },
    {
      q: "What is a good essay score in UPSC mains?",
      a: `The median essay score among these toppers is ${rec.essay.median}/250, and the best is ${rec.essay.best} (${rec.essay.who.map((r) => `${r.name}, AIR ${r.rank}, CSE ${r.year}`).join("; ")}).`,
    },
    {
      q: "Which optional subject scores the most?",
      a: optByMedian.length
        ? `By median optional total among subjects with 10 or more marksheets here: ${optByMedian.map((o) => `${o.s} ${o.m}`).join(", ")} (out of 500). The highest single optional total is ${rec.opt.best}, by ${rec.opt.who.map((r) => `${r.name} (${r.optional})`).join(" and ")}.`
        : "There aren't enough marksheets per optional yet to compare them fairly.",
    },
    {
      q: "Where do these marks come from?",
      a: "UPSC publishes the marks of recommended candidates after the final result. We copy each topper's paper-wise marks from that release and check them: a record only enters the table when every paper is within its maximum and the totals add up. Records that fail are left out until they're fixed.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "UPSC Civil Services topper marks database",
      description: `Paper-wise UPSC CSE marks (Essay, GS I–IV, Optional I–II, Written, Interview, Total) of ${rows.length} rank holders from CSE ${years[years.length - 1]}–${years[0]}.`,
      url: URL,
      creator: { "@type": "Organization", name: "UPSCPrepNotes", url: "https://upscprepnotes.in" },
      isAccessibleForFree: true,
      temporalCoverage: `${years[years.length - 1]}/${years[0]}`,
      variableMeasured: ["Essay", "GS Paper I", "GS Paper II", "GS Paper III", "GS Paper IV", "Optional Paper I", "Optional Paper II", "Written total", "Interview", "Final total"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
        { "@type": "ListItem", position: 2, name: "Toppers", item: "https://upscprepnotes.in/toppers" },
        { "@type": "ListItem", position: 3, name: "Marks Database", item: URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Marks database</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="t-display text-h1">UPSC topper marks, paper by paper</h1>
              <p className="mt-4 max-w-[46rem] text-m leading-[1.6] text-[var(--ink-2)]">
                {`Essay, GS I–IV, optional, interview and final total for ${fmt(rows.length)} rank holders from CSE ${years[years.length - 1]}–${years[0]}, taken from UPSC's published marks. Sort any column, filter by optional, and press + on two rows to compare them.`}
              </p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-s text-[var(--muted)]">
                <span><span className="tab font-bold text-[var(--ink)]">{fmt(full.length)}</span> complete marksheets</span>
                <span><span className="tab font-bold text-[var(--ink)]">{optionals.length}</span> optionals</span>
                <span>Median total <span className="tab font-bold text-[var(--ink)]">{fmt(rec.total.median)}</span> marks</span>
              </p>
            </div>
            {/* The best score on record, written like an examiner's note */}
            {best && (
              <Link href={`/upsc-topper/${best.slug}`} className={`${card} group hidden w-[300px] p-5 lg:block`}>
                <p className="relative mt-2 inline-block">
                  <span className="t-display tab text-l leading-none">{fmt(best.total)}</span>
                  <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible">
                    <path d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30" pathLength={1} fill="none" stroke="var(--mark)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </p>
                <p className="mt-3 text-m font-bold group-hover:text-[var(--accent)]">{best.name}</p>
                <p className="text-s text-[var(--muted)]">{`Highest total on record · AIR ${best.rank}, CSE ${best.year}`}</p>
              </Link>
            )}
          </div>

          <div className="mt-10">
            <MarksDB rows={rows} years={years} optionals={optionals} />
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-14">
              <Section id="records" title="Best score in each paper" meta={`from ${fmt(full.length)} complete marksheets`}>
                <ul className={`${card} divide-y divide-[var(--line)]`}>
                  {records.map((r) => (
                    <li key={r.key} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[180px_120px_1fr] sm:px-6">
                      <span className="text-m font-bold">{r.label}</span>
                      <span className="tab whitespace-nowrap text-right text-m sm:text-left">
                        <span className="font-bold text-[var(--accent)]">{fmt(r.best)}</span>
                        <span className="text-[var(--muted)]">{` of ${fmt(r.max)}`}</span>
                      </span>
                      <span className="col-span-2 text-s text-[var(--ink-2)] sm:col-span-1">
                        {r.who.slice(0, 3).map((w, i) => (
                          <span key={w.slug}>
                            {i > 0 && ", "}
                            <Link href={`/upsc-topper/${w.slug}`} className=" hover:text-[var(--accent)] hover:underline">{w.name}</Link>
                            <span className="text-[var(--muted)]">{` (AIR ${w.rank}, ${w.year})`}</span>
                          </span>
                        ))}
                        {r.who.length > 3 && <span className="text-[var(--muted)]">{` +${r.who.length - 3} more`}</span>}
                        <span className="block text-s text-[var(--muted)]">{`Median ${fmt(r.median)}`}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="patterns" title="What the numbers say">
                <ol className="space-y-4">
                  {facts.map((f, i) => (
                    <li key={i} className="flex gap-4 text-m leading-[1.65] text-[var(--ink-2)]">
                      <span className="t-meta tab mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <p>{f}</p>
                    </li>
                  ))}
                </ol>
              </Section>

              {starters.length > 0 && (
                <Section id="compare" title="Comparisons to start with">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {starters.map(({ a, b }) => (
                      <li key={`${a.slug}-${b.slug}`}>
                        <Link href={`/compare/${a.slug}-vs-${b.slug}`} className={`${card} group flex items-center gap-3 p-4 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
                          <span className="flex shrink-0 -space-x-2">
                            {[a, b].map((t) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={t.slug} src={t.avatar} alt="" aria-hidden loading="lazy" width={36} height={36} className="h-9 w-9 rounded-full bg-[#e9edff] object-cover object-top shadow-[0_0_0_2px_#fff]" />
                            ))}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-m font-bold group-hover:text-[var(--accent)]">{`${a.name.split(" ")[0]} vs ${b.name.split(" ")[0]}`}</span>
                            <span className="block truncate text-s text-[var(--muted)]">{`AIR ${a.rank} '${String(a.year).slice(2)} · AIR ${b.rank} '${String(b.year).slice(2)}`}</span>
                          </span>
                          <span aria-hidden className="text-[var(--muted)] group-hover:text-[var(--accent)]">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section id="faq" title="Questions">
                <div className={`${card} divide-y divide-[var(--line)]`}>
                  {faqs.map((f, i) => (
                    <details key={f.q} open={i === 0} className="group px-6 py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-m font-bold tracking-[-0.01em]">{f.q}</h3>
                        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-m transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                      </summary>
                      <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className={`${card} p-5`}>
                <p className="text-m font-bold">By optional</p>
                <ul className="mt-3 space-y-1 text-s">
                  {optionals.slice(0, 8).map(([s, c]) => (
                    <li key={s}>
                      <Link href={`/optional/${optionalSlug(s)}`} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                        {`${s} toppers`} <span className="tab text-s text-[var(--muted)]">{c}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {comp && (
                <Link href={`/store/${comp.slug}`} data-track="marks-db-side-store" className={`${card} group flex gap-4 p-4`}>
                  {comp.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={comp.image} alt="" aria-hidden loading="lazy" className="h-[92px] w-[72px] shrink-0 rounded-[8px] object-cover shadow-[0_0_0_1px_var(--line)]" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-m font-bold leading-tight group-hover:text-[var(--accent)]">{comp.title}</span>
                    <span className="mt-1 block text-s leading-[1.45] text-[var(--muted)]">{`${booklets ? `${booklets} handwritten booklets` : comp.tagline}: see how these marks were written`}</span>
                    <span className="mt-2 inline-block rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-s font-bold">{`₹${comp.price}`}</span>
                  </span>
                </Link>
              )}

              <div className={`${card} p-5`}>
                <p className="text-m font-bold">Explore</p>
                <ul className="mt-3 space-y-1 text-s">
                  {[
                    ...years.map((y) => ({ href: `/year/${y}`, label: `All CSE ${y} toppers` })),
                    { href: "/toppers", label: "Every topper profile" },
                    { href: "/free-materials", label: "Free study material" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                        {l.label} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
