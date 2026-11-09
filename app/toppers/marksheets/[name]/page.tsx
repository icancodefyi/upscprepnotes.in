import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import BrandShell from "@/components/brand/BrandShell";
import { card } from "@/components/brand/ui";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import InterviewPackPromo from "@/components/store/InterviewPackPromo";
import { displayName, fmt, freeCopiesOf, isComplete, median, n, paperStats, subjectOf, totalOf, type LeanTopper } from "@/lib/topper-stats";
import official2025 from "@/data/official/cse-2025-recommended-marks.json";
import { MARKSHEET_PAGES } from "@/lib/marksheet-pages";
import PopularLinks from "@/components/brand/PopularLinks";
import QuizTeaser from "@/components/quiz/QuizTeaser";


export const revalidate = 86400;
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(MARKSHEET_PAGES).map((name) => ({ name }));
}

type Props = { params: Promise<{ name: string }> };
const SITE = "https://upscprepnotes.in";

const ROWS: { key: string; label: string; max: number }[] = [
  { key: "essay", label: "Essay", max: 250 },
  { key: "gs1", label: "General Studies I", max: 250 },
  { key: "gs2", label: "General Studies II", max: 250 },
  { key: "gs3", label: "General Studies III", max: 250 },
  { key: "gs4", label: "General Studies IV (Ethics)", max: 250 },
  { key: "optional1", label: "Optional Paper I", max: 250 },
  { key: "optional2", label: "Optional Paper II", max: 250 },
];

async function load(name: string) {
  const slug = MARKSHEET_PAGES[name];
  if (!slug) return null;
  await connectDB();
  const all = (await TopperModel.find({}, { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1, freeAnswerCopyUrls: 1, freeAnswerCopyUrl: 1 }).lean()) as LeanTopper[];
  const t = all.find((x) => x.slug === slug);
  if (!t) return null;
  const pool = all.filter(isComplete);
  const written = n(t, "written") || ROWS.reduce((a, r) => a + n(t, r.key), 0);
  const interview = n(t, "interview");
  const total = totalOf(t) || written + interview;
  return { t, all, pool, written, interview, total, stats: paperStats(t, pool), copies: freeCopiesOf(t).length };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const d = await load(name);
  if (!d) return { title: "Marksheet not found" };
  const nm = displayName(d.t);
  const opt = subjectOf(d.t.optionalSubject);
  const title = `${nm} Marksheet: UPSC ${d.t.year} Marks (AIR ${d.t.rank}, ${fmt(d.total)})`;
  const description = `${nm}'s UPSC CSE ${d.t.year} marksheet: ${fmt(d.total)} of 2,025 (written ${fmt(d.written)}, interview ${d.interview})${opt ? `, ${opt} optional` : ""}. Paper-wise marks compared with other toppers, plus the answer copy.`;
  const url = `${SITE}/toppers/marksheets/${name}`;
  const image = `${SITE}/upsc-topper/${d.t.slug}/opengraph-image`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "UPSCPrepNotes", type: "article", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function MarksheetPage({ params }: Props) {
  const { name } = await params;
  const d = await load(name);
  if (!d) notFound();
  const { t, all, pool, written, interview, total, stats, copies } = d;
  const nm = displayName(t);
  const first = nm.split(" ")[0];
  const opt = subjectOf(t.optionalSubject);
  const year = t.year ?? 0;
  const profile = `/upsc-topper/${t.slug}`;
  const optTotal = n(t, "optional1") + n(t, "optional2");
  const hasPapers = ROWS.some((r) => n(t, r.key) > 0);
  const statOf = (k: string) => stats.find((s) => s.key === k);

  // The same year's top 10, for context: UPSC's official list for 2025, our marksheets otherwise.
  const yearTop = year === 2025
    ? (official2025 as { rank: number; name: string; written: number; pt: number; total: number }[]).slice(0, 10).map((r) => ({ rank: r.rank, name: r.name.replace(/\b(\w)(\w*)/g, (_, a: string, b: string) => a + b.toLowerCase()), written: r.written, interview: r.pt, total: r.total, slug: all.find((x) => x.year === 2025 && x.rank === r.rank)?.slug }))
    : all.filter((x) => x.year === year && (x.rank ?? 99) <= 10 && totalOf(x) > 0).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)).map((x) => ({ rank: x.rank ?? 0, name: displayName(x), written: n(x, "written") || ROWS.reduce((a, r) => a + n(x, r.key), 0), interview: n(x, "interview"), total: totalOf(x), slug: x.slug }));

  const best = [...stats].filter((s) => s.max === 250).sort((a, b) => b.beats - a.beats)[0];
  const weak = [...stats].filter((s) => s.max === 250).sort((a, b) => a.beats - b.beats)[0];
  const ivMedian = median(pool.map((x) => n(x, "interview")));
  const wrMedian = median(pool.map((x) => ROWS.reduce((a, r) => a + n(x, r.key), 0)));

  const answer = `${nm}'s UPSC marksheet for CSE ${year} shows ${fmt(total)} out of 2,025 and All India Rank ${t.rank}: ${fmt(written)} of 1,750 in the written (Mains) examination and ${interview} of 275 in the interview.${optTotal ? ` In ${opt || "the optional"}, ${first} scored ${optTotal} of 500 (Paper I ${n(t, "optional1")}, Paper II ${n(t, "optional2")}).` : ""}`;

  const faqs = [
    { q: `What are ${nm}'s total marks in UPSC?`, a: `${fmt(total)} out of 2,025 in CSE ${year} (AIR ${t.rank}).` },
    { q: `How much did ${nm} score in the UPSC interview?`, a: `${interview} out of 275. The median of the ${pool.length} toppers in our marks database is ${ivMedian}.` },
    { q: `What were ${nm}'s Mains (written) marks?`, a: `${fmt(written)} out of 1,750.` },
    ...(opt && optTotal ? [{ q: `What was ${nm}'s optional subject and score?`, a: `${opt}: ${optTotal} out of 500 (Paper I ${n(t, "optional1")}, Paper II ${n(t, "optional2")}).` }] : []),
    ...(n(t, "essay") ? [{ q: `How much did ${nm} score in the Essay paper?`, a: `${n(t, "essay")} out of 250.` }] : []),
    { q: `Where can I see ${nm}'s answer copy?`, a: copies ? `On ${first}'s profile page: the free answer copy downloads straight away.` : `On ${first}'s profile page: enter your email and get the free answer copy.` },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Toppers", href: "/toppers" }, { name: "Marks database", href: "/toppers/marks-database" }, { name: `${nm} marksheet`, href: `/toppers/marksheets/${name}` }]} />
      <div className="mx-auto max-w-[920px] px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-2">
          <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link><span aria-hidden>/</span>
          <Link href="/toppers/marks-database" className="hover:text-[var(--ink)]">Marks database</Link><span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">{`${nm} marksheet`}</span>
        </nav>

        <h1 className="t-display text-h1 mt-6">{`${nm} UPSC Marksheet ${year}`}</h1>
        <p className="mt-3 text-m font-bold text-[var(--accent)]">{[`AIR ${t.rank}`, `CSE ${year}`, opt].filter(Boolean).join(" · ")}</p>
        <p className="mt-5 max-w-[44rem] text-m leading-[1.7] text-[var(--ink-2)]">{answer}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`${profile}#answer-copy`} data-track="marksheet-page-copy" className="btn btn-blue">{copies ? `${first}'s answer copy, free ↓` : "Get a free answer copy ↓"}</Link>
          <Link href={profile} data-track="marksheet-page-profile" className="btn btn-paper">{`${first}'s full profile`}</Link>
        </div>

        {/* THE MARKSHEET */}
        <section className="mt-12" aria-labelledby="ms">
          <h2 id="ms" className="t-head text-l">{`Paper-wise marks, CSE ${year}`}</h2>
          <div className={`${card} mt-5 overflow-x-auto`}>
            <table className="w-full min-w-[520px] text-s sm:text-m">
              <caption className="sr-only">{`${nm} UPSC ${year} marksheet`}</caption>
              <thead>
                <tr className="border-b border-[var(--line-2)] text-left text-[var(--muted)]">
                  <th scope="col" className="px-5 py-3 font-normal">Paper</th>
                  <th scope="col" className="px-3 py-3 text-right font-normal">Marks</th>
                  <th scope="col" className="px-3 py-3 text-right font-normal">Out of</th>
                  <th scope="col" className="px-5 py-3 text-right font-normal">Median topper</th>
                </tr>
              </thead>
              <tbody className="tab">
                {hasPapers && ROWS.filter((r) => n(t, r.key) > 0).map((r) => (
                  <tr key={r.key} className="border-b border-[var(--line)]">
                    <td className="px-5 py-3">{r.key.startsWith("optional") && opt ? `${opt} Paper ${r.key.endsWith("1") ? "I" : "II"}` : r.label}</td>
                    <td className="px-3 py-3 text-right font-bold">{n(t, r.key)}</td>
                    <td className="px-3 py-3 text-right text-[var(--muted)]">{r.max}</td>
                    <td className="px-5 py-3 text-right text-[var(--muted)]">{statOf(r.key)?.median ?? median(pool.map((x) => n(x, r.key)))}</td>
                  </tr>
                ))}
                <tr className="border-b border-[var(--line)]">
                  <td className="px-5 py-3 font-bold">Written (Mains) total</td>
                  <td className="px-3 py-3 text-right font-bold">{fmt(written)}</td>
                  <td className="px-3 py-3 text-right text-[var(--muted)]">1,750</td>
                  <td className="px-5 py-3 text-right text-[var(--muted)]">{fmt(wrMedian)}</td>
                </tr>
                <tr className="border-b border-[var(--line)]">
                  <td className="px-5 py-3 font-bold">Interview (Personality Test)</td>
                  <td className="px-3 py-3 text-right font-bold">{interview}</td>
                  <td className="px-3 py-3 text-right text-[var(--muted)]">275</td>
                  <td className="px-5 py-3 text-right text-[var(--muted)]">{ivMedian}</td>
                </tr>
                <tr className="bg-[var(--accent-soft)]">
                  <td className="px-5 py-3.5 font-bold">Final total</td>
                  <td className="px-3 py-3.5 text-right text-l font-bold text-[var(--accent)]">{fmt(total)}</td>
                  <td className="px-3 py-3.5 text-right text-[var(--muted)]">2,025</td>
                  <td className="px-5 py-3.5 text-right text-[var(--muted)]">{fmt(median(pool.map(totalOf)))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-s text-[var(--muted)]">
            {hasPapers
              ? `Medians are from the ${pool.length} complete topper marksheets in our database. Source: ${first}'s published UPSC marksheet.`
              : `UPSC publishes the written, interview and final marks of every recommended candidate (CSE ${year} list, 10 March 2026). Paper-wise marks are released only to the candidate; we'll add ${first}'s if they are made public.`}
          </p>
        </section>

        {best && weak && best.key !== weak.key && (
          <section className="mt-12">
            <h2 className="t-head text-l">{`What ${first}'s marks tell you`}</h2>
            <ul className="mt-4 space-y-2.5 text-m leading-[1.65] text-[var(--ink-2)]">
              <li>{`Strongest paper: ${best.label}, ${best.score} of ${best.max}, higher than ${best.beats}% of toppers in our database.`}</li>
              <li>{`Weakest paper: ${weak.label}, ${weak.score} of ${weak.max}, higher than ${weak.beats}% of toppers. A top rank does not need every paper to be high.`}</li>
              <li>{`Interview: ${interview} of 275, ${interview >= ivMedian ? `${interview - ivMedian} above` : `${ivMedian - interview} below`} the median topper (${ivMedian}).`}</li>
            </ul>
          </section>
        )}

        {yearTop.length > 1 && (
          <section className="mt-12">
            <h2 className="t-head text-l">{`How ${first} compares with the CSE ${year} top 10`}</h2>
            <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">To see the marks each rank needed in CSE {year}, read <Link href="/toppers/upsc-mains-marks-needed" className="underline">UPSC Mains marks needed for a rank</Link>.</p>
            <div className={`${card} mt-5 overflow-x-auto`}>
              <table className="w-full min-w-[480px] text-s">
                <thead>
                  <tr className="border-b border-[var(--line-2)] text-left text-[var(--muted)]">
                    <th className="px-5 py-2.5 font-normal">AIR</th><th className="px-3 py-2.5 font-normal">Name</th>
                    <th className="px-3 py-2.5 text-right font-normal">Written</th><th className="px-3 py-2.5 text-right font-normal">Interview</th><th className="px-5 py-2.5 text-right font-normal">Total</th>
                  </tr>
                </thead>
                <tbody className="tab">
                  {yearTop.map((r) => (
                    <tr key={r.rank} className={`border-b border-[var(--line)] ${r.rank === t.rank ? "bg-[#fffbe6] font-bold" : ""}`}>
                      <td className="px-5 py-2.5">{r.rank}</td>
                      <td className="px-3 py-2.5">{r.slug ? <Link href={`/upsc-topper/${r.slug}`} className="hover:text-[var(--accent)]">{r.name}</Link> : r.name}</td>
                      <td className="px-3 py-2.5 text-right">{fmt(r.written)}</td><td className="px-3 py-2.5 text-right">{r.interview}</td><td className="px-5 py-2.5 text-right">{fmt(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="mt-12">
          <InterviewPackPromo first={first} interview={interview} track="marksheet-page-interview-pack" />
        </div>

        <PopularLinks track="marksheet-popular" exclude={t.slug} />
        <QuizTeaser track="marksheet" />

        <section className="mt-12">
          <h2 className="t-head text-l">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className={`${card} group p-5`}>
                <summary className="cursor-pointer list-none text-m font-bold [&::-webkit-details-marker]:hidden">{f.q}</summary>
                <p className="mt-2 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-[var(--line)] pt-8">
          <div className="flex flex-wrap gap-2">
            {[
              { href: profile, label: `${nm}: profile, strategy and answer copy →` },
              { href: `/year/${year}`, label: `All CSE ${year} toppers →` },
              { href: "/toppers/marks-database", label: "Marks of 290 toppers →" },
              { href: "/toppers/highest-marks-in-upsc", label: "Highest marks in UPSC →" },
              { href: "/toppers/upsc-interview-marks", label: "UPSC interview marks →" },
              ...Object.keys(MARKSHEET_PAGES).filter((k) => k !== name).map((k) => ({ href: `/toppers/marksheets/${k}`, label: `${k.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")} marksheet →` })),
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full bg-white px-4 py-2 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--accent)]">{l.label}</Link>
            ))}
          </div>
        </section>
      </div>
    </BrandShell>
  );
}
