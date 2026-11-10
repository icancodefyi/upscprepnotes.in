import type { Metadata } from "next";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";
import AdRail from "@/components/brand/AdRail";
import { card } from "@/components/brand/ui";
import Toc from "@/components/brand/Toc";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getHandbook, CUTOFFS, HANDBOOK_PDF, HANDBOOK_URL, type HBRecord, type HBTopper, type Handbook, type PaperKey } from "@/lib/marks-handbook";
import InterviewPackPromo from "@/components/store/InterviewPackPromo";
import PopularLinks from "@/components/brand/PopularLinks";
import QuizTeaser from "@/components/quiz/QuizTeaser";

export const revalidate = 86400;

const URL = `https://upscprepnotes.in${HANDBOOK_URL}`;
const TITLE = "Highest Marks in UPSC: Paper-wise Topper Marks (CSE 2022–25)";
const DESC =
  "Highest marks in UPSC Essay, GS 1–4, Ethics, Optional and Interview from 236 real topper marksheets, with AIR 1 totals, cut-offs and a free PDF.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, siteName: "UPSCPrepNotes", type: "article", images: [{ url: "/og/marks-handbook.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og/marks-handbook.png"] },
};

const fmt = (x: number) => x.toLocaleString("en-IN");
const who = (t: HBTopper) => `${t.name} (AIR ${t.rank}, CSE ${t.year})`;

function TopperLink({ t, children }: { t: HBTopper; children?: React.ReactNode }) {
  if (!t.slug) return <>{children ?? t.name}</>;
  return (
    <Link href={`/upsc-topper/${t.slug}`} className="font-bold text-[var(--ink)] underline decoration-[var(--line-2)] underline-offset-[3px] hover:text-[var(--accent)] hover:decoration-[var(--accent)]">
      {children ?? t.name}
    </Link>
  );
}

function Score({ v, max, accent = false }: { v: number; max: number; accent?: boolean }) {
  return (
    <span className="tab whitespace-nowrap">
      <span className={`font-bold ${accent ? "text-[var(--accent)]" : ""}`}>{fmt(v)}</span>
      <span className="text-[var(--muted)]">{` of ${fmt(max)}`}</span>
    </span>
  );
}

const P = ({ children }: { children: React.ReactNode }) => <p className="text-m leading-[1.7] text-[var(--ink-2)]">{children}</p>;

/** One paper: the record, the numbers that matter, and what to do with them. */
function PaperSection({ id, r, children, h }: { id: string; r: HBRecord; children: React.ReactNode; h: Handbook }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-[var(--line)] pt-10">
      <h3 className="t-head text-l">{`Highest marks in ${r.label}`}</h3>
      <dl className={`${card} mt-5 grid grid-cols-2 divide-[var(--line)] sm:grid-cols-4 sm:divide-x`}>
        {[
          { k: "Highest", v: r.best, accent: true },
          { k: "Top 10% from", v: r.top10 },
          { k: "Median topper", v: r.median },
          { k: `${fmt(r.strongLine)}+ scored by`, v: r.strongCount, count: true },
        ].map((x) => (
          <div key={x.k} className="px-5 py-4">
            <dt className="text-s text-[var(--muted)]">{x.k}</dt>
            <dd className="mt-1 text-l leading-none">
              {x.count ? (
                <span className="tab"><span className="t-display">{x.v}</span><span className="text-s text-[var(--muted)]">{` of ${h.n}`}</span></span>
              ) : (
                <span className="tab"><span className={`t-display ${x.accent ? "text-[var(--accent)]" : ""}`}>{x.v}</span><span className="text-s text-[var(--muted)]">{` of ${r.max}`}</span></span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 max-w-[44rem] space-y-4">{children}</div>
      <div className={`${card} mt-6 overflow-x-auto`}>
        <table className="w-full min-w-[480px] text-s">
          <caption className="px-5 pt-4 text-left text-m font-bold">{`Five highest ${r.short} scores`}</caption>
          <thead>
            <tr className="text-left text-[var(--muted)]">
              <th scope="col" className="px-5 py-2.5 font-normal">Topper</th>
              <th scope="col" className="px-3 py-2.5 font-normal">Optional</th>
              <th scope="col" className="px-3 py-2.5 text-right font-normal">{r.short}</th>
              <th scope="col" className="px-5 py-2.5 text-right font-normal">Final total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {r.top.map((t) => (
              <tr key={`${t.slug}-${t.score}`}>
                <td className="px-5 py-2.5"><TopperLink t={t} /><span className="text-[var(--muted)]">{` · AIR ${t.rank}, ${t.year}`}</span></td>
                <td className="px-3 py-2.5 text-[var(--ink-2)]">{t.optional}</td>
                <td className="tab px-3 py-2.5 text-right font-bold">{t.score}</td>
                <td className="tab px-5 py-2.5 text-right text-[var(--ink-2)]">{fmt(t.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {r.guide && (
        <p className="mt-4 text-s">
          <Link href={r.guide.href} className="font-bold text-[var(--accent)] hover:underline">{`${r.guide.label} →`}</Link>
        </p>
      )}
    </section>
  );
}

function DownloadCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-[var(--accent)] text-white ${compact ? "p-6" : "p-7 sm:p-9"}`}>
      <p className="t-head text-l">The Topper Marks Handbook, free</p>
      <p className="mt-3 max-w-[34rem] text-m leading-[1.55] text-white/80">
        Every table on this page in one clean PDF: records by paper, AIR 1 vs the cut-off, what separates the top 10, optional-wise marks and a target marksheet to plan against.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={HANDBOOK_PDF} data-track="handbook-pdf" className="btn btn-paper h-12 px-6 [--btn-fs:16px]">
          Download the PDF
        </a>
        <span className="text-s text-white/70">No sign-up. Share it freely.</span>
      </div>
    </div>
  );
}

export default async function HighestMarksPage() {
  const h = await getHandbook();
  const rec = (k: PaperKey) => h.records.find((r) => r.key === k)!;
  const essay = rec("essay"), gs1 = rec("gs1"), gs2 = rec("gs2"), gs3 = rec("gs3"), gs4 = rec("gs4"), opt = rec("optional"), intv = rec("interview"), written = rec("written"), total = rec("total");
  const top = h.bands[0];
  const rest = h.bands[h.bands.length - 1];
  const t100 = h.targets[0];
  const tAll = h.targets[1];
  const latest = h.air1[h.air1.length - 1];
  const updated = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const cutRange = `${Math.min(...CUTOFFS.map((c) => c.final))}–${Math.max(...CUTOFFS.map((c) => c.final))}`;

  const faqs: { q: string; a: string }[] = [
    {
      q: "What is the highest mark ever scored in UPSC CSE?",
      a: `In the ${h.n} marksheets we hold (CSE ${h.yearsLabel}), the highest final total is ${fmt(total.best)} of 2,025, scored by ${total.holders.map(who).join(" and ")}. UPSC does not publish an all-time list, so any "highest ever" figure you see online is really the highest of one year.`,
    },
    {
      q: "What are the highest marks in Ethics (GS Paper IV)?",
      a: `${gs4.best} of 250, by ${gs4.holders.map(who).join(" and ")}. Ethics is the most generous GS paper: the median topper scored ${gs4.median}, and ${gs4.strongCount} of ${h.n} toppers crossed ${gs4.strongLine}.`,
    },
    {
      q: "What are the highest marks in the UPSC Essay paper?",
      a: `${essay.best} of 250, by ${essay.holders.map(who).join(" and ")}. Nobody in our data crossed 150. Only ${essay.strongCount} of ${h.n} toppers scored ${essay.strongLine} or more; the median was ${essay.median}.`,
    },
    {
      q: "What are the highest marks in GS Paper III?",
      a: `${gs3.best} of 250, by ${gs3.holders.map(who).join(" and ")}. GS III is the lowest-scoring paper on the marksheet: the median topper scored ${gs3.median}, and ${gs3.top10} already puts you in the top 10% of rank holders.`,
    },
    {
      q: "What are the highest optional subject marks in UPSC?",
      a: `${opt.best} of 500 (both papers), by ${opt.holders.map((t) => `${who(t)} in ${t.optional}`).join(" and ")}. Only ${opt.strongCount} of ${h.n} toppers crossed 300, and ${h.counts.optional320} crossed 320.${h.optionals.find((o) => o.subject === "PSIR") ? ` In PSIR the best was ${h.optionals.find((o) => o.subject === "PSIR")!.best}.` : ""}`,
    },
    {
      q: "What are the highest interview marks in UPSC?",
      a: `${intv.best} of 275, by ${intv.holders.map(who).join(" and ")}. The median topper scored ${intv.median}, and ${h.counts.interviewUnder160} toppers made the final list with less than 160.`,
    },
    {
      q: "How many marks do you need to clear UPSC?",
      a: `For the General category, the last recommended candidate scored ${cutRange} of 2,025 in CSE ${CUTOFFS[0].year}–${String(CUTOFFS[CUTOFFS.length - 1].year).slice(2)}, and the Mains cut-off to reach the interview was ${Math.min(...CUTOFFS.map((c) => c.mains))}–${Math.max(...CUTOFFS.map((c) => c.mains))} of 1,750. A top-100 rank needed a median of ${fmt(t100.med.total)}.`,
    },
    ...(latest
      ? [{
          q: `How much did AIR 1 score in UPSC CSE ${latest.year}?`,
          a: `${latest.name} scored ${fmt(latest.total)} of 2,025: ${fmt(latest.written)} in the written Mains and ${latest.interview} in the interview, with ${latest.optional} as the optional.`,
        }]
      : []),
    {
      q: "Is the Topper Marks Handbook PDF free?",
      a: "Yes. It is free, needs no sign-up, and you can share it. It carries the same numbers as this page, laid out for printing and revision.",
    },
  ];

  const toc = [
    { id: "short-answer", label: "The short answer" },
    { id: "by-paper", label: "Highest marks by paper" },
    { id: "how-marks-work", label: "How the marks add up" },
    { id: "air1", label: "AIR 1 vs the cut-off" },
    { id: "papers", label: "Paper by paper" },
    { id: "top-10", label: "What the top 10 do differently" },
    { id: "optionals", label: "By optional subject" },
    { id: "interview-swing", label: "How much the interview moves you" },
    { id: "targets", label: "A target marksheet" },
    { id: "method", label: "Where the numbers come from" },
    { id: "faq", label: "Questions" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESC,
      url: URL,
      mainEntityOfPage: URL,
      dateModified: new Date().toISOString(),
      author: { "@type": "Organization", name: "UPSCPrepNotes", url: "https://upscprepnotes.in" },
      publisher: { "@type": "Organization", name: "UPSCPrepNotes", logo: { "@type": "ImageObject", url: "https://upscprepnotes.in/logo.png" } },
      image: "https://upscprepnotes.in/og/marks-handbook.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "UPSC topper marks: paper-wise records, CSE " + h.yearsLabel,
      description: `Paper-wise marks (Essay, GS I–IV, Optional, Interview, written and final totals) of ${h.n} UPSC Civil Services rank holders, with records, medians and rank-band analysis.`,
      url: URL,
      creator: { "@type": "Organization", name: "UPSCPrepNotes", url: "https://upscprepnotes.in" },
      temporalCoverage: `${h.years[0]}/${h.years[h.years.length - 1]}`,
      variableMeasured: ["Essay marks", "GS Paper I marks", "GS Paper II marks", "GS Paper III marks", "GS Paper IV (Ethics) marks", "Optional marks", "Interview marks", "Written total", "Final total"],
      isAccessibleForFree: true,
      distribution: [{ "@type": "DataDownload", encodingFormat: "application/pdf", contentUrl: `https://upscprepnotes.in${HANDBOOK_PDF}` }],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const table: HBRecord[] = [essay, gs1, gs2, gs3, gs4, opt, intv, written, total];

  return (
    <BrandShell>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Toppers", href: "/toppers" }, { name: "Highest marks in UPSC", href: HANDBOOK_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 xl:max-w-[1380px]">
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Highest marks in UPSC</span>
          </nav>

          {/* Hero */}
          <header className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="t-display text-h1">
                Highest marks in UPSC, <span className="whitespace-nowrap px-1 [box-decoration-break:clone]" style={{ backgroundImage: "linear-gradient(transparent 58%, var(--hl) 58%, var(--hl) 92%, transparent 92%)" }}>paper by paper</span>
              </h1>
              <p className="mt-5 max-w-[42rem] text-m leading-[1.6] text-[var(--ink-2)]">
                {`The best score in every Mains paper and the interview, taken from ${h.n} real marksheets of UPSC rank holders (CSE ${h.yearsLabel}). Not estimates and not one year's headlines. Each number links to the topper who scored it.`}
              </p>
              <p className="mt-3 text-s text-[var(--muted)]">{`Updated ${updated} · Source: UPSC marks of recommended candidates`}</p>
              <div className="mt-5"><InterviewPackPromo variant="line" track="highest-marks-interview-pack" /></div>
              <PopularLinks track="highest-popular" />
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={HANDBOOK_PDF} data-track="handbook-pdf-hero" className="btn btn-blue h-12 px-6 [--btn-fs:16px]">Download the free PDF</a>
                <Link href="/toppers/marks-database" className="btn btn-paper h-12 px-6 [--btn-fs:16px]">Search all marksheets</Link>
              </div>
            </div>
            <dl className={`${card} grid grid-cols-2 divide-y divide-[var(--line)]`}>
              {[
                { k: "Highest final total", v: fmt(total.best), of: "2,025" },
                { k: "Highest written", v: fmt(written.best), of: "1,750" },
                { k: "Highest interview", v: String(intv.best), of: "275" },
                { k: "Marksheets analysed", v: String(h.n), of: "" },
              ].map((x, i) => (
                <div key={x.k} className={`px-5 py-4 ${i % 2 ? "border-l border-[var(--line)]" : ""}`}>
                  <dt className="text-s text-[var(--muted)]">{x.k}</dt>
                  <dd className="mt-1"><span className="t-display tab block text-l leading-none">{x.v}</span><span className="mt-1 block text-s text-[var(--muted)]">{x.of ? `of ${x.of}` : "rank holders"}</span></dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mt-16 grid gap-12 lg:grid-cols-[220px_1fr] xl:grid-cols-[200px_minmax(0,1fr)_300px]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-s font-bold">On this page</p>
                <Toc items={toc} />
              </div>
            </aside>

            <article className="min-w-0 space-y-16">
              {/* Short answer */}
              <section id="short-answer" className="scroll-mt-28">
                <h2 className="t-head text-l">The short answer</h2>
                <div className="mt-5 max-w-[44rem] space-y-4">
                  <P>
                    {`The highest final score in our data is ${fmt(total.best)} of 2,025, by `}<TopperLink t={total.holders[0]} />{` (AIR ${total.holders[0].rank}, CSE ${total.holders[0].year}). That is ${Math.round((total.best / 2025) * 100)}% of the maximum. Nobody becomes a topper by scoring close to full marks. UPSC is marked hard, and a rank is won by being a little better than everyone else in almost every paper.`}
                  </P>
                  <P>
                    {`Paper by paper, the ceilings are lower than most aspirants think: ${essay.best} in Essay, ${gs4.best} in Ethics, ${gs2.best} in GS II, ${gs1.best} in GS I and only ${gs3.best} in GS III. In the optional, the best combined score was ${opt.best} of 500. In the interview, ${intv.best} of 275.`}
                  </P>
                </div>
              </section>

              {/* Records table */}
              <section id="by-paper" className="scroll-mt-28">
                <h2 className="t-head text-l">Highest marks in every paper</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">{`Records across ${h.n} complete marksheets. "Median topper" is the score of the middle rank holder, a fairer target than the record.`}</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[640px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Paper</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Highest</th>
                        <th scope="col" className="px-3 py-3 font-normal">Scored by</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Median topper</th>
                        <th scope="col" className="px-5 py-3 text-right font-normal">Top 10% from</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {table.map((r) => (
                        <tr key={r.key}>
                          <th scope="row" className="px-5 py-3 text-left font-bold">{r.label}</th>
                          <td className="px-3 py-3 text-right"><Score v={r.best} max={r.max} accent /></td>
                          <td className="px-3 py-3">
                            {r.holders.slice(0, 2).map((t, i) => (
                              <span key={t.slug}>{i ? ", " : ""}<TopperLink t={t} /><span className="text-[var(--muted)]">{` · AIR ${t.rank}, ${t.year}`}</span></span>
                            ))}
                          </td>
                          <td className="tab px-3 py-3 text-right">{fmt(r.median)}</td>
                          <td className="tab px-5 py-3 text-right">{fmt(r.top10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* How marks work */}
              <section id="how-marks-work" className="scroll-mt-28">
                <h2 className="t-head text-l">How UPSC marks add up</h2>
                <div className="mt-5 max-w-[44rem] space-y-4">
                  <P>Your rank comes from two numbers: the written Mains, out of 1,750, and the interview, out of 275. Together that is 2,025. Prelims only decides whether you sit Mains; its marks never reach the final list.</P>
                </div>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[480px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Paper</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Marks</th>
                        <th scope="col" className="px-5 py-3 font-normal">Counts for rank?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {[
                        ["Paper A: Indian language", "300", "No, qualifying only"],
                        ["Paper B: English", "300", "No, qualifying only"],
                        ["Essay", "250", "Yes"],
                        ["GS Papers I, II, III", "250 each", "Yes"],
                        ["GS Paper IV: Ethics, Integrity and Aptitude", "250", "Yes"],
                        ["Optional Papers I and II", "250 each", "Yes"],
                        ["Written total", "1,750", ""],
                        ["Interview (Personality Test)", "275", "Yes"],
                        ["Final total", "2,025", ""],
                      ].map(([a, b, c]) => (
                        <tr key={a} className={c ? "" : "bg-[var(--canvas)] font-bold"}>
                          <td className="px-5 py-2.5">{a}</td>
                          <td className="tab px-3 py-2.5 text-right">{b}</td>
                          <td className="px-5 py-2.5 text-[var(--ink-2)]">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 max-w-[44rem] text-s text-[var(--muted)]">
                  If you fail either language paper, your other Mains papers are not evaluated. Check the exact qualifying standard in the official notification for your year. <Link href="/content/upsc-syllabus" className="font-bold text-[var(--accent)] hover:underline">Full UPSC syllabus →</Link>
                </p>
              </section>

              {/* AIR 1 vs cut-off */}
              <section id="air1" className="scroll-mt-28">
                <h2 className="t-head text-l">AIR 1 vs the cut-off, year by year</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">The cut-off is the General-category score of the last person to make the final list. The distance between AIR 1 and that line is smaller than it looks.</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[640px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Exam year</th>
                        <th scope="col" className="px-3 py-3 font-normal">AIR 1</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Written</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Interview</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Total</th>
                        <th scope="col" className="px-5 py-3 text-right font-normal">General cut-off</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {[...h.air1].reverse().map((a) => (
                        <tr key={a.year}>
                          <td className="tab px-5 py-3 font-bold">{`CSE ${a.year}`}</td>
                          <td className="px-3 py-3">{a.slug ? <Link href={`/upsc-topper/${a.slug}`} className="font-bold hover:text-[var(--accent)]">{a.name}</Link> : a.name}<span className="text-[var(--muted)]">{` · ${a.optional}`}</span></td>
                          <td className="tab px-3 py-3 text-right">{fmt(a.written)}</td>
                          <td className="tab px-3 py-3 text-right">{a.interview}</td>
                          <td className="tab px-3 py-3 text-right font-bold text-[var(--accent)]">{fmt(a.total)}</td>
                          <td className="tab px-5 py-3 text-right">{a.cutoff ? `${fmt(a.cutoff)} (gap ${a.total - a.cutoff})` : "Not yet published"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>
                    {`Across these years, AIR 1 finished between ${Math.min(...h.air1.filter((a) => a.cutoff).map((a) => a.total - (a.cutoff ?? 0)))} and ${Math.max(...h.air1.filter((a) => a.cutoff).map((a) => a.total - (a.cutoff ?? 0)))} marks above the last General-category selection. Spread over eight papers, that is roughly ${Math.round(Math.min(...h.air1.filter((a) => a.cutoff).map((a) => a.total - (a.cutoff ?? 0))) / 8)} to ${Math.round(Math.max(...h.air1.filter((a) => a.cutoff).map((a) => a.total - (a.cutoff ?? 0))) / 8)} marks a paper. The difference between "selected" and "AIR 1" is not genius. It is a steady extra 10 to 15 marks in nearly every paper.`}
                  </P>
                  <p className="text-s text-[var(--muted)]">Cut-offs: UPSC final results for CSE 2022, 2023 and 2024 (General category, out of 2,025; Mains out of 1,750: 748, 741 and 729).</p>
                </div>
              </section>

              <DownloadCard />

              {/* Paper by paper */}
              <section id="papers" className="scroll-mt-28 space-y-12">
                <div>
                  <h2 className="t-head text-l">Paper by paper: what the records actually tell you</h2>
                  <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">For each paper: the record, the realistic range, and what it means for how you spend your next three months.</p>
                </div>

                <PaperSection id="essay" r={essay} h={h}>
                  <P>{`Nobody in ${h.n} marksheets crossed 150 in Essay. The best was ${essay.best}, by `}<TopperLink t={essay.holders[0]} />{`, and only ${essay.strongCount} toppers reached ${essay.strongLine}. The median topper scored ${essay.median}.`}</P>
                  <P>{`Essay is also where the very top pulls away. The median AIR 1–10 essay was ${top.med.essay}, against ${rest.med.essay} for ranks below 300: a ${h.gaps.find((g) => g.key === "essay")?.gap}-mark gap from a single paper${h.gaps[0]?.key === "essay" ? ", the largest of any paper" : ""}. Two essays in three hours.`}</P>
                  <P>What to do with that: write one full essay every week under time, and get it read by someone who will mark it hard. A clear structure and a balanced argument are what separate a 120 from a 140.</P>
                </PaperSection>

                <PaperSection id="gs1" r={gs1} h={h}>
                  <P>{`GS I scores sit in a tight band. The median topper scored ${gs1.median}, the top 10% started at ${gs1.top10}, and the best was ${gs1.best}. With history, geography and society in one paper, marks are spread thin across many short answers.`}</P>
                  <P>{`A ${gs1.top10} here already puts you among the best rank holders. Chasing 130 is less useful than making sure you never drop below 95.`}</P>
                </PaperSection>

                <PaperSection id="gs2" r={gs2} h={h}>
                  <P>{`GS II is the friendliest GS paper after Ethics. The median topper scored ${gs2.median}, ${gs2.strongCount} of ${h.n} crossed ${gs2.strongLine}, and the record is ${gs2.best} by `}<TopperLink t={gs2.holders[0]} />.</P>
                  <P>Polity and governance answers reward the same habits every time: the right article or committee, a current example, and a short way forward. It is the most predictable place to bank marks.</P>
                </PaperSection>

                <PaperSection id="gs3" r={gs3} h={h}>
                  <P>{`GS III is the hardest paper on the UPSC marksheet. The median topper scored only ${gs3.median}. The best in our data is ${gs3.best}. If you score ${gs3.top10}, you are already in the top 10% of rank holders.`}</P>
                  <P>{`Here is the number that should calm you down: in ${h.top10.gs3Weakest} of the ${h.top10.n} AIR 1–10 marksheets we hold, GS III was their weakest paper. Even AIR 1 loses marks here. The gap between the top 10 and ranks below 300 is just ${h.gaps.find((g) => g.key === "gs3")?.gap} marks, the smallest of any paper.`}</P>
                  <P>What to do with that: do not try to win GS III. Protect it. Aim for the mid-90s with clean, data-backed answers on economy and security, and spend the hours you save on Essay and Ethics, where marks are easier to gain.</P>
                </PaperSection>

                <PaperSection id="ethics" r={gs4} h={h}>
                  <P>{`Ethics is the highest-scoring GS paper. The median topper scored ${gs4.median}, ${gs4.strongCount} crossed ${gs4.strongLine}, and the record is ${gs4.best} by `}<TopperLink t={gs4.holders[0]} />.</P>
                  <P>Case studies carry half the paper, and they reward a calm, practical answer more than quotations. Toppers who score well here name the stakeholders, weigh the options and choose one, in that order.</P>
                </PaperSection>

                <PaperSection id="optional" r={opt} h={h}>
                  <P>{`The optional is worth 500 marks, and it has the widest spread of any paper. The median topper scored ${opt.median}, the record is ${opt.best} by `}<TopperLink t={opt.holders[0]} />{` in ${opt.holders[0].optional}, and only ${opt.strongCount} of ${h.n} crossed 300.`}</P>
                  <P>{`One surprise: the top 10 do not win on the optional. The median AIR 1–10 optional was ${top.med.optional}, close to the ${rest.med.optional} of ranks below 300. A strong optional keeps you in the race; it rarely decides AIR 1.`}</P>
                </PaperSection>

                <PaperSection id="interview" r={intv} h={h}>
                  <P>{`The median topper scored ${intv.median} of 275 in the interview, and the best was ${intv.best} by `}<TopperLink t={intv.holders[0]} />{`. ${h.counts.interviewUnder160} toppers made the final list with less than 160, so a weak interview does not end your chances if the written is strong.`}</P>
                  <p className="text-s"><Link href="/toppers/upsc-interview-marks" className="font-bold text-[var(--accent)] hover:underline">UPSC interview marks by rank, and what boards ask →</Link></p>
                </PaperSection>
              </section>

              {/* Top 10 */}
              <section id="top-10" className="scroll-mt-28">
                <h2 className="t-head text-l">What the top 10 do differently</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">Median marks by rank band. Read across a row to see a typical marksheet at that rank.</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[760px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Rank band</th>
                        {(["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview", "total"] as PaperKey[]).map((k) => (
                          <th key={k} scope="col" className="px-3 py-3 text-right font-normal">{rec(k).short}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {h.bands.map((b) => (
                        <tr key={b.label}>
                          <th scope="row" className="px-5 py-3 text-left font-bold">{b.label}<span className="font-normal text-[var(--muted)]">{` · ${b.n}`}</span></th>
                          {(["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview", "total"] as PaperKey[]).map((k) => (
                            <td key={k} className={`tab px-3 py-3 text-right ${k === "total" ? "font-bold" : ""}`}>{fmt(b.med[k])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>{`Between the median AIR 1–10 and the median rank below 300, the written gap is ${top.med.written - rest.med.written} marks. ${h.gsGap} of those come from the four GS papers and ${h.gaps.find((g) => g.key === "essay")?.gap} from the Essay. The optional and the interview add ${h.gaps.find((g) => g.key === "optional")?.gap} and ${h.gaps.find((g) => g.key === "interview")?.gap}.`}</P>
                  <P>{`So the top 10 are not people with one brilliant paper. They are people with no bad paper. And even they have a weak spot: ${h.top100.below100} of the ${h.top100.n} top-100 rankers in our data scored below 100 in at least one GS paper.`}</P>
                </div>
              </section>

              {/* Optionals */}
              <section id="optionals" className="scroll-mt-28">
                <h2 className="t-head text-l">Highest marks by optional subject</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">Both optional papers together, out of 500. Subjects with at least five marksheets.</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[640px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Optional</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Toppers</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Median</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Highest</th>
                        <th scope="col" className="px-5 py-3 font-normal">Scored by</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {h.optionals.map((o) => (
                        <tr key={o.subject}>
                          <th scope="row" className="px-5 py-3 text-left font-bold">{o.slug ? <Link href={`/optional/${o.slug}`} className="hover:text-[var(--accent)]">{o.subject}</Link> : o.subject}</th>
                          <td className="tab px-3 py-3 text-right">{o.n}</td>
                          <td className="tab px-3 py-3 text-right">{o.median}</td>
                          <td className="tab px-3 py-3 text-right font-bold">{o.best}</td>
                          <td className="px-5 py-3"><TopperLink t={o.bestBy} /><span className="text-[var(--muted)]">{` · AIR ${o.bestBy.rank}, ${o.bestBy.year}`}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>Read this table carefully before you pick an optional for that reason. A higher median usually means a smaller, self-selected group of candidates with a strong background in the subject, not an easier paper.</P>
                  <p className="text-s"><Link href="/content/upsc-optional-subject-marks-analysis" className="font-bold text-[var(--accent)] hover:underline">Full optional subject marks analysis →</Link></p>
                </div>
              </section>

              {/* Interview swing */}
              {h.swing && (
                <section id="interview-swing" className="scroll-mt-28">
                  <h2 className="t-head text-l">How much can the interview move your rank?</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[h.swing.a, h.swing.b].map((t) => (
                      <div key={t.slug} className={`${card} p-6`}>
                        <p className="text-m font-bold"><TopperLink t={t} /></p>
                        <p className="mt-1 text-s text-[var(--muted)]">{`CSE ${t.year} · ${t.optional}`}</p>
                        <dl className="mt-4 grid grid-cols-3 gap-3 text-s">
                          <div><dt className="text-[var(--muted)]">Written</dt><dd className="tab mt-0.5 text-l font-bold leading-none">{t.written}</dd></div>
                          <div><dt className="text-[var(--muted)]">Interview</dt><dd className="tab mt-0.5 text-l font-bold leading-none">{t.interview}</dd></div>
                          <div><dt className="text-[var(--muted)]">Rank</dt><dd className="tab mt-0.5 text-l font-bold leading-none text-[var(--mark-deep)]">{`AIR ${t.rank}`}</dd></div>
                        </dl>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 max-w-[44rem] space-y-4">
                    <P>{`Same year, almost the same written marks: ${h.swing.a.written} and ${h.swing.b.written}. A ${h.swing.a.interview - h.swing.b.interview}-mark difference in the interview put one at AIR ${h.swing.a.rank} and the other at AIR ${h.swing.b.rank}. Near the middle of the list, ranks are packed so tightly that every mark in the interview is worth several places.`}</P>
                    <P>The interview is 275 marks you can prepare for. Your detailed application form, your home state, your graduation subject and the news of the last six months cover most of what you will be asked.</P>
                  </div>
                </section>
              )}

              {/* Targets */}
              <section id="targets" className="scroll-mt-28">
                <h2 className="t-head text-l">A realistic target marksheet</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">Aim at a typical topper, not the record. These are the median marks of real rank holders.</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[520px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Paper</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">To make the list</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">For a top-100 rank</th>
                        <th scope="col" className="px-5 py-3 text-right font-normal">Record</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {(["essay", "gs1", "gs2", "gs3", "gs4", "optional", "written", "interview", "total"] as PaperKey[]).map((k) => (
                        <tr key={k} className={k === "written" || k === "total" ? "bg-[var(--canvas)] font-bold" : ""}>
                          <th scope="row" className="px-5 py-2.5 text-left">{rec(k).label}</th>
                          <td className="tab px-3 py-2.5 text-right">{fmt(tAll.med[k])}</td>
                          <td className="tab px-3 py-2.5 text-right">{fmt(t100.med[k])}</td>
                          <td className="tab px-5 py-2.5 text-right text-[var(--muted)]">{fmt(rec(k).best)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 max-w-[44rem] text-s text-[var(--muted)]">{`"To make the list" is the median of all ${tAll.n} rank holders; "top-100" is the median of the ${t100.n} who ranked inside 100. Medians do not add up exactly to the totals shown.`}</p>
              </section>

              {/* Method */}
              <section id="method" className="scroll-mt-28">
                <h2 className="t-head text-l">Where the numbers come from</h2>
                <div className="mt-5 max-w-[44rem] space-y-4">
                  <P>{`After each final result, UPSC publishes the marks of every recommended candidate. We take the paper-wise marks of rank holders from those lists and count a marksheet only when every paper is present and adds up. That leaves ${h.n} complete marksheets: ${h.perYear.map((y) => `${y.n} from CSE ${y.year}`).join(", ")}.`}</P>
                  <P>Two honest limits. First, this is a sample of toppers, not every candidate, so medians here are higher than for the full list. Second, &ldquo;highest&rdquo; means highest in this data. UPSC does not publish an all-time record, and an unlisted candidate may have scored more in a single paper.</P>
                  <p className="text-s"><Link href="/content/data-methodology-and-editorial-standards" className="font-bold text-[var(--accent)] hover:underline">Our data methodology →</Link></p>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-28">
                <h2 className="t-head text-l">Questions people ask</h2>
                <div className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {faqs.map((f) => (
                    <details key={f.q} className="group py-4">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-m font-bold">
                        <h3 className="text-m font-bold">{f.q}</h3>
                        <span aria-hidden className="mt-1 text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 max-w-[44rem] text-m leading-[1.7] text-[var(--ink-2)]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <DownloadCard compact />

              {/* Related */}
              <section aria-labelledby="related" className="scroll-mt-28">
                <h2 id="related" className="t-head text-l">Keep going</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { href: "/toppers/marks-database", t: "Topper marks database", d: "Sort every marksheet by any paper." },
                    { href: "/toppers/upsc-interview-marks", t: "UPSC interview marks", d: "What toppers scored and what 2026 boards asked." },
                    { href: "/compare/ishita-kishore-rank-1-2022-vs-aditya-srivastava-rank-1-2023", t: "Compare two AIR 1 marksheets", d: "Ishita Kishore vs Aditya Srivastava, paper by paper." },
                    { href: "/content/upsc-topper-answer-copies", t: "Topper answer copies", d: "See how the marks above were written." },
                    { href: "/content/how-to-write-upsc-mains-answers", t: "How to write Mains answers", d: "Structure, time and presentation." },
                    { href: "/content/upsc-optional-subject-marks-analysis", t: "Optional marks analysis", d: "Which optional scores, and why." },
                    { href: "/toppers", t: "All UPSC toppers", d: "Profiles, strategies and free copies." },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={`${card} block p-5 transition-colors hover:bg-[var(--canvas)]`}>
                        <span className="block text-m font-bold">{l.t}</span>
                        <span className="mt-1 block text-s text-[var(--ink-2)]">{l.d}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-s text-[var(--muted)]">
                  {`AIR 1 marksheets: `}
                  {h.air1.map((a, i) => (
                    <span key={a.year}>{i ? " · " : ""}{a.slug ? <Link href={`/upsc-topper/${a.slug}`} className="font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">{`${a.name} (${a.year})`}</Link> : a.name}</span>
                  ))}
                  {" · "}
                  {[2025, 2024, 2023, 2022].map((y, i) => (
                    <span key={y}>{i ? " · " : ""}<Link href={`/year/${y}`} className="font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">{`Toppers ${y}`}</Link></span>
                  ))}
                </p>
              </section>
            </article>

            <aside className="hidden xl:block xl:self-start xl:[@media(min-height:760px)]:sticky xl:[@media(min-height:760px)]:top-28">
              <AdRail page="highest-marks-in-upsc" product="upsc-mains-2027-pack" />
            </aside>
          </div>

          <div className="mt-12 xl:hidden">
            <AdRail page="highest-marks-in-upsc" product="upsc-mains-2027-pack" inline />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="highest-marks" />
      </div>
    </BrandShell>
  );
}
