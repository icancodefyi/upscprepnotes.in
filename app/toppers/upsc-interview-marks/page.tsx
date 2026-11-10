import type { Metadata } from "next";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";
import AdRail from "@/components/brand/AdRail";
import { card } from "@/components/brand/ui";
import Toc from "@/components/brand/Toc";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import PayButton from "@/components/ui/PayButton";
import { getInterviewData, INTERVIEW_URL, INTERVIEW_PACK_SLUG, type IVTopper } from "@/lib/interview-marks";
import { IV_TRANSCRIPTS, transcriptStats } from "@/data/content/interview-transcripts";
import { getProductBySlug } from "@/lib/store-products";
import { PackGlimpse } from "@/components/store/InterviewPackPromo";
import QuizTeaser from "@/components/quiz/QuizTeaser";

export const revalidate = 86400;

const URL = `https://upscprepnotes.in${INTERVIEW_URL}`;
const TITLE = "UPSC Interview Marks: Highest, Average and What Boards Ask (2026)";
const DESC =
  "UPSC interview marks of 282 toppers: median 182, highest 215, by rank band. Plus what boards asked in 14 real 2026 interviews, and how to prepare your DAF.";
const OG = "/og/interview-marks.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, siteName: "UPSCPrepNotes", type: "article", images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG] },
};

const P = ({ children }: { children: React.ReactNode }) => <p className="text-m leading-[1.7] text-[var(--ink-2)]">{children}</p>;

function TopperLink({ t }: { t: IVTopper }) {
  if (!t.slug) return <>{t.name}</>;
  return (
    <Link href={`/upsc-topper/${t.slug}`} className="font-bold text-[var(--ink)] underline decoration-[var(--line-2)] underline-offset-[3px] hover:text-[var(--accent)] hover:decoration-[var(--accent)]">
      {t.name}
    </Link>
  );
}

function PackCard({ compact = false }: { compact?: boolean }) {
  const pack = getProductBySlug(INTERVIEW_PACK_SLUG);
  if (!pack) return null;
  return (
    <div className={`relative grid items-center gap-8 rounded-[28px] bg-[var(--accent)] text-white sm:grid-cols-[1fr_150px] md:grid-cols-[1fr_170px] ${compact ? "p-6" : "p-7 sm:p-9"}`}>
      <div className="min-w-0">
      <p className="t-head text-l">The UPSC Interview Pack</p>
      <p className="mt-3 max-w-[36rem] text-m leading-[1.55] text-white/80">
        This page shows what happens in the room. The pack is how you prepare for it: a field-by-field DAF worksheet, question patterns for your degree, a home district dossier, answer methods, 150 practice questions and a day-by-day 30-day plan. A 22-page PDF to print and write on.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <PayButton amount={pack.price} items={[{ slug: pack.slug, quantity: 1, price: pack.price }]} tracking={compact ? "interview-pack-buy-bottom" : "interview-pack-buy"} className="btn btn-paper h-12 px-6 [--btn-fs:16px]">
          {`Get it for ₹${pack.price}`}
        </PayButton>
        <Link href={`/store/${pack.slug}`} data-track="interview-pack-details" className="text-s font-bold text-white underline underline-offset-4">See what&rsquo;s inside</Link>
      </div>
      <p className="mt-4 text-s text-white/70">Instant email delivery · 7-day refund · No subscription</p>
      </div>
      <PackGlimpse className="mx-auto mt-4 w-[150px] sm:mt-0 sm:w-full" />
    </div>
  );
}

const DAF_ROWS: [string, string][] = [
  ["Home state and district", "History, economy and problems; “why is it behind?”; “as DM, what would you fix?”"],
  ["Graduation subject", "Two to five technical questions, usually pulled towards a policy problem"],
  ["Work and gaps", "What exactly you did, why you left, what you have done since"],
  ["Hobbies", "Depth, recent news and the policy angle. The most-mined field on the form"],
  ["Achievements and roles", "What you did, and whether it actually worked"],
  ["Languages", "Language policy, the three-language formula, mother-tongue schooling"],
  ["Service preference", "Why this service first. Asked less often than people expect"],
];

export default async function InterviewMarksPage() {
  const d = await getInterviewData();
  const ts = transcriptStats();
  const row = (k: string) => ts.rows.find((r) => r.key === k)!;
  const updated = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const maxBucket = Math.max(...d.buckets.map((b) => b.count));
  const p0 = d.pairs[0];

  const faqs: { q: string; a: string }[] = [
    {
      q: "What is the highest marks in the UPSC interview?",
      a: `In the ${d.n} topper marksheets we hold (CSE ${d.yearsLabel}), the highest interview mark is ${d.best} of 275, scored by ${d.bestHolders.map((t) => `${t.name} (AIR ${t.rank}, CSE ${t.year})`).join(" and ")}. Only ${d.count200} of ${d.n} toppers reached 200. UPSC does not publish an all-time record.`,
    },
    {
      q: "What is a good score in the UPSC interview?",
      a: `The median topper scored ${d.median} of 275. Most rank holders scored between ${d.p10} and ${d.p90}. Anything above 190 is strong; the median for AIR 1–10 was ${d.bands[0]?.median}.`,
    },
    {
      q: "What is the lowest interview mark that still got a rank?",
      a: `${d.lowest} of 275, at AIR ${d.lowestHolders[0]?.rank} in CSE ${d.lowestHolders[0]?.year}. ${d.countUnder160} of ${d.n} toppers made the final list with less than 160, so a weak interview does not end your chances if your written score is strong.`,
    },
    {
      q: "How many marks is the UPSC interview out of?",
      a: `275. It is added to your written Mains score (out of 1,750) to make the final total out of 2,025. For the median topper it was ${d.share}% of the final score.`,
    },
    {
      q: "Can the interview change your rank a lot?",
      a: p0 ? `Yes. In CSE ${p0.a.year}, ${p0.a.name} and ${p0.b.name} had almost identical written marks (${p0.a.written} and ${p0.b.written}). Their interviews were ${p0.a.interview} and ${p0.b.interview}, and they finished at AIR ${p0.a.rank} and AIR ${p0.b.rank}.` : "Yes. Candidates with the same written marks regularly finish hundreds of ranks apart because of the interview.",
    },
    {
      q: "What do UPSC interview boards ask?",
      a: `In ${ts.n} transcripts from the CSE 2025 interviews (January–February 2026), ${row("current").share}% of questions were current affairs, ${row("opinion").share}% opinion questions, ${row("hobby").share}% hobbies and ${row("home").share}% home state. Only ${row("why").count} of ${ts.total} questions were "why civil services". Most current-affairs questions were linked to the candidate's degree, job or state.`,
    },
    {
      q: "Does a high Mains score mean a high interview score?",
      a: `No. Across ${d.n} toppers the correlation between written and interview marks is close to zero (${d.correlation.toFixed(2)}). ${d.strongWrittenWeakIv[0] ? `${d.strongWrittenWeakIv[0].name} wrote ${d.strongWrittenWeakIv[0].written} in Mains and got ${d.strongWrittenWeakIv[0].interview} in the interview.` : ""}`,
    },
    {
      q: "How long is the UPSC interview?",
      a: `Candidates in the transcripts we read reported 20 to 30 minutes, with about ${ts.avg} questions on average from the chairperson and four members.`,
    },
  ];

  const toc = [
    { id: "short-answer", label: "The short answer" },
    { id: "by-rank", label: "Interview marks by rank" },
    { id: "spread", label: "How the marks spread" },
    { id: "highest", label: "Highest interview marks" },
    { id: "swing", label: "How much it moves your rank" },
    { id: "boards", label: "What boards actually ask" },
    { id: "daf", label: "Your DAF decides the questions" },
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
      image: `https://upscprepnotes.in${OG}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `UPSC interview (Personality Test) marks of toppers, CSE ${d.yearsLabel}`,
      description: `Interview marks out of 275 of ${d.n} UPSC Civil Services rank holders, with medians by rank band, highest and lowest marks, and written-vs-interview comparisons.`,
      url: URL,
      creator: { "@type": "Organization", name: "UPSCPrepNotes", url: "https://upscprepnotes.in" },
      temporalCoverage: `${d.years[0]}/${d.years[d.years.length - 1]}`,
      variableMeasured: ["Interview marks", "Written total", "All India Rank"],
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <BrandShell>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Toppers", href: "/toppers" }, { name: "UPSC interview marks", href: INTERVIEW_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 xl:max-w-[1380px]">
          <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">UPSC interview marks</span>
          </nav>

          <header className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="t-display text-h1">
                UPSC interview marks, and <span className="px-1 [box-decoration-break:clone]" style={{ backgroundImage: "linear-gradient(transparent 58%, var(--hl) 58%, var(--hl) 92%, transparent 92%)" }}>what boards ask</span>
              </h1>
              <p className="mt-5 max-w-[42rem] text-m leading-[1.6] text-[var(--ink-2)]">
                {`What ${d.n} UPSC toppers actually scored in the Personality Test (CSE ${d.yearsLabel}), how far the interview moved their rank, and what boards asked in ${ts.n} real interviews held in January–February 2026.`}
              </p>
              <p className="mt-3 text-s text-[var(--muted)]">{`Updated ${updated} · Source: UPSC marks of recommended candidates; candidate-written board transcripts`}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/store/${INTERVIEW_PACK_SLUG}`} data-track="interview-pack-hero" className="btn btn-blue h-12 px-6 [--btn-fs:16px]">Get the Interview Pack</Link>
                <Link href="/toppers/highest-marks-in-upsc" className="btn btn-paper h-12 px-6 [--btn-fs:16px]">Highest marks in every paper</Link>
              </div>
            </div>
            <dl className={`${card} grid grid-cols-2 divide-y divide-[var(--line)]`}>
              {[
                { k: "Median topper", v: String(d.median), of: "of 275" },
                { k: "Highest", v: String(d.best), of: "of 275" },
                { k: "Lowest with a rank", v: String(d.lowest), of: "of 275" },
                { k: "Toppers analysed", v: String(d.n), of: `CSE ${d.yearsLabel}` },
              ].map((x, i) => (
                <div key={x.k} className={`px-5 py-4 ${i % 2 ? "border-l border-[var(--line)]" : ""}`}>
                  <dt className="text-s text-[var(--muted)]">{x.k}</dt>
                  <dd className="mt-1"><span className="t-display tab block text-l leading-none">{x.v}</span><span className="mt-1 block text-s text-[var(--muted)]">{x.of}</span></dd>
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
              <section id="short-answer" className="scroll-mt-28">
                <h2 className="t-head text-l">The short answer</h2>
                <div className="mt-5 max-w-[44rem] space-y-4">
                  <P>{`The UPSC interview is out of 275. The median topper in our data scored ${d.median}, and most rank holders landed between ${d.p10} and ${d.p90}. The highest mark we have is ${d.best}, by `}<TopperLink t={d.bestHolders[0]} />{` (AIR ${d.bestHolders[0].rank}, CSE ${d.bestHolders[0].year}). The lowest that still made the final list was ${d.lowest}.`}</P>
                  <P>{`Those numbers sit in a narrow band, which is exactly why the interview matters. Candidates with the same written marks regularly finish hundreds of ranks apart because of it, and your Mains score tells you almost nothing about how your interview will go.`}</P>
                </div>
              </section>

              <section id="by-rank" className="scroll-mt-28">
                <h2 className="t-head text-l">Interview marks by rank</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">Median interview marks of toppers in each rank band, with the range most of them fell in.</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[520px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Rank band</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Toppers</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Median interview</th>
                        <th scope="col" className="px-5 py-3 text-right font-normal">Most scored between</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {d.bands.map((b) => (
                        <tr key={b.label}>
                          <th scope="row" className="px-5 py-3 text-left font-bold">{b.label}</th>
                          <td className="tab px-3 py-3 text-right">{b.n}</td>
                          <td className="tab px-3 py-3 text-right font-bold text-[var(--accent)]">{b.median}</td>
                          <td className="tab px-5 py-3 text-right">{`${b.p10}–${b.p90}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>{`The top 50 had a median of ${d.bands[1]?.median ?? d.bands[0].median}; ranks below 600 had ${d.bands[d.bands.length - 1].median}. That ${(d.bands[0].median - d.bands[d.bands.length - 1].median)}-mark difference is the interview's share of the gap between a top rank and a rank near the end of the list. None of the ${d.top100.n} top-100 rankers in our data scored below ${d.top100.lowest}.`}</P>
                </div>
              </section>

              <section id="spread" className="scroll-mt-28">
                <h2 className="t-head text-l">How the marks spread</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">{`All ${d.n} interview marks, in 10-mark steps.`}</p>
                <div className={`${card} mt-6 p-5 sm:p-6`}>
                  <div className="flex h-48 items-end gap-1.5 sm:gap-2.5" role="img" aria-label={`Distribution of ${d.n} UPSC interview marks: most between ${d.p10} and ${d.p90}`}>
                    {d.buckets.map((b) => (
                      <div key={b.from} className="flex h-full flex-1 flex-col items-center justify-end">
                        <span className="tab mb-1 text-s text-[var(--ink-2)]">{b.count}</span>
                        <span className="block w-full rounded-t-[6px] bg-[var(--accent)]" style={{ height: `${(b.count / maxBucket) * 80}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-1.5 sm:gap-2.5">
                    {d.buckets.map((b) => (
                      <span key={b.from} className="tab flex-1 text-center text-s text-[var(--muted)]">{b.from}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>{`Only ${d.count200} of ${d.n} toppers reached 200, and ${d.countUnder160} made the list with less than 160. Most of the list sits within about 40 marks of each other, so moving from ${d.p10} to ${d.median} is worth more ranks than almost any single Mains paper.`}</P>
                </div>
              </section>

              <section id="highest" className="scroll-mt-28">
                <h2 className="t-head text-l">Highest marks in the UPSC interview</h2>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[560px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Topper</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Interview</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Written</th>
                        <th scope="col" className="px-5 py-3 font-normal">Optional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {d.top.map((t) => (
                        <tr key={`${t.slug}-${t.interview}`}>
                          <td className="px-5 py-2.5"><TopperLink t={t} /><span className="text-[var(--muted)]">{` · AIR ${t.rank}, ${t.year}`}</span></td>
                          <td className="tab px-3 py-2.5 text-right font-bold">{t.interview}</td>
                          <td className="tab px-3 py-2.5 text-right text-[var(--ink-2)]">{t.written ?? "–"}</td>
                          <td className="px-5 py-2.5 text-[var(--ink-2)]">{t.optional || "–"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>Look at the written column. Several of these toppers had ordinary Mains scores, and the interview is what pulled them into a good rank.</P>
                  <p className="text-s"><Link href="/toppers/marks-database" className="font-bold text-[var(--accent)] hover:underline">Sort every marksheet by interview marks →</Link></p>
                </div>
              </section>

              <section id="swing" className="scroll-mt-28">
                <h2 className="t-head text-l">How much the interview moves your rank</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">Pairs from the same exam year with written marks within three of each other.</p>
                <div className="mt-6 grid gap-4">
                  {d.pairs.slice(0, 3).map((p) => (
                    <div key={p.a.slug + p.b.slug} className={`${card} grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center`}>
                      {[p.a, p.b].map((t, i) => (
                        <div key={t.slug}>
                          <p className="text-s text-[var(--muted)]">{`CSE ${t.year}${t.optional ? ` · ${t.optional}` : ""}`}</p>
                          <p className="mt-1"><TopperLink t={t} /></p>
                          <p className="tab mt-1 text-s text-[var(--ink-2)]">{`Written ${t.written} · Interview ${t.interview}`}</p>
                          <p className={`t-display tab mt-1 text-l ${i ? "text-[var(--ink-2)]" : "text-[var(--accent)]"}`}>{`AIR ${t.rank}`}</p>
                        </div>
                      ))}
                      <p className="tab text-s text-[var(--muted)] sm:text-right">{`${p.gap} interview marks`}<br />{`${p.ranks.toLocaleString("en-IN")} ranks apart`}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>{`And a great written score doesn't carry you. `}{d.strongWrittenWeakIv.map((t, i) => (
                    <span key={t.slug}>{i ? " " : ""}<TopperLink t={t} />{` wrote ${t.written} in Mains in CSE ${t.year} and got ${t.interview} in the interview: AIR ${t.rank}.`}</span>
                  ))}{` Across all ${d.n} toppers, the correlation between written and interview marks is ${d.correlation.toFixed(2)}, which is effectively none. The interview is its own paper.`}</P>
                </div>
              </section>

              <PackCard />

              <section id="boards" className="scroll-mt-28">
                <h2 className="t-head text-l">What UPSC boards actually ask</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">{`We read ${ts.n} transcripts from the CSE 2025 interviews, held in January and February 2026 and written up by the candidates themselves, and sorted all ${ts.total} questions. The average interview had ${ts.avg} questions.`}</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[520px] text-s">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-3 font-normal">Type of question</th>
                        <th scope="col" className="px-3 py-3 text-right font-normal">Share of questions</th>
                        <th scope="col" className="px-5 py-3 text-right font-normal">Came up in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {ts.rows.map((r) => (
                        <tr key={r.key}>
                          <th scope="row" className="px-5 py-2.5 text-left font-bold">{r.label}</th>
                          <td className="tab px-3 py-2.5 text-right">{`${r.share}%`}</td>
                          <td className="tab px-5 py-2.5 text-right text-[var(--ink-2)]">{`${r.interviews} of ${ts.n} interviews`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>{`Current affairs is the biggest block at ${row("current").share}%, but it is rarely random. A civil engineer was asked about drainage and coastal regulation, an electrical engineer about grid stability and transformers, a doctor about medical tourism and violence against doctors. The candidate's own form chose the topics.`}</P>
                  <P>{`Home state came up in ${ts.homeAsked} of the ${ts.homeKnown} interviews where the candidate's state was known, and hobbies in ${ts.hobbyAsked} of ${ts.hobbyKnown} where they were listed. One board asked nine questions about cricket and sketching alone. "Why civil services" was asked just ${row("why").count} times in ${ts.total} questions, and the optional made up only ${row("optional").share}%.`}</P>
                </div>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[640px] text-s">
                    <caption className="px-5 pt-4 text-left text-m font-bold">A few questions from the 2026 boards, in our words</caption>
                    <thead>
                      <tr className="text-left text-[var(--muted)]">
                        <th scope="col" className="px-5 py-2.5 font-normal">Board</th>
                        <th scope="col" className="px-3 py-2.5 font-normal">Candidate</th>
                        <th scope="col" className="px-5 py-2.5 font-normal">Asked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {IV_TRANSCRIPTS.slice(0, 2).map((t) => (
                        <tr key={t.url}>
                          <td className="px-5 py-2.5 font-bold">{t.board}</td>
                          <td className="px-3 py-2.5 text-[var(--ink-2)]">{[t.background, t.home].filter(Boolean).join(" · ")}</td>
                          <td className="px-5 py-2.5 text-[var(--ink-2)]">{t.examples[0]}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="px-5 py-3">
                          <Link href={`/store/${INTERVIEW_PACK_SLUG}`} data-track="interview-page-questions-more" className="font-bold text-[var(--accent)] hover:underline">
                            {`All ${ts.n} interviews and 150 practice questions are in the Interview Pack →`}
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="daf" className="scroll-mt-28">
                <h2 className="t-head text-l">Your DAF decides most of the questions</h2>
                <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">{`About ${ts.dafShare}% of questions came straight from the Detailed Application Form, and most current-affairs questions were linked to it. Here is what the two most-asked parts of the form trigger.`}</p>
                <div className={`${card} mt-6 overflow-x-auto`}>
                  <table className="w-full min-w-[520px] text-s">
                    <tbody className="divide-y divide-[var(--line)]">
                      {DAF_ROWS.slice(0, 2).map(([f, t]) => (
                        <tr key={f}>
                          <th scope="row" className="w-[34%] px-5 py-3 text-left align-top font-bold">{f}</th>
                          <td className="px-5 py-3 text-[var(--ink-2)]">{t}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={2} className="px-5 py-3">
                          <Link href={`/store/${INTERVIEW_PACK_SLUG}`} data-track="interview-page-daf-more" className="font-bold text-[var(--accent)] hover:underline">
                            Every DAF field, with a worksheet to fill in before you submit, is in the Interview Pack →
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[44rem] space-y-4">
                  <P>Two rules follow. Write only what you can talk about for ten minutes. And prepare your district, your degree and your hobbies before you prepare anything else: that is where boards spend their time.</P>
                </div>
              </section>

              <section id="method" className="scroll-mt-28">
                <h2 className="t-head text-l">Where the numbers come from</h2>
                <div className="mt-5 max-w-[44rem] space-y-4">
                  <P>{`Interview marks are from the marks UPSC publishes for recommended candidates after each final result. We use ${d.n} rank holders from CSE ${d.yearsLabel} (${d.perYear.map((y) => `${y.n} from ${y.year}`).join(", ")}). It is a sample of toppers, not every candidate, and the recent years are smaller and lean towards top ranks.`}</P>
                  <P>{`The board questions come from ${ts.n} transcripts of CSE 2025 interviews, written by the candidates and published on ForumIAS. They are recollections and often incomplete. We sorted every question by hand and quote nothing word for word.`}</P>
                  <p className="text-s"><Link href="/content/data-methodology-and-editorial-standards" className="font-bold text-[var(--accent)] hover:underline">Our data methodology →</Link></p>
                </div>
              </section>

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

              <PackCard compact />

              <section aria-labelledby="related" className="scroll-mt-28">
                <h2 id="related" className="t-head text-l">Keep going</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { href: "/toppers/highest-marks-in-upsc", t: "Highest marks in UPSC", d: "Records and medians for every Mains paper, with a free PDF." },
                    { href: "/toppers/marks-database", t: "Topper marks database", d: "Sort every marksheet by interview or any paper." },
                    { href: "/content/upsc-interview-guidance-programs-2026", t: "Interview guidance programs 2026", d: "Which programs are free, which cost money, and what each includes." },
                    { href: "/content/upsc-optional-subject-marks-analysis", t: "Optional marks analysis", d: "Which optional scores, and why." },
                    { href: "/content/upsc-topper-answer-copies", t: "Topper answer copies", d: "How rank holders wrote their Mains." },
                    { href: "/store/answer-copies-compilation", t: "Answer Copies Compilation", d: "63 topper answer booklets in one download." },
                    { href: "/toppers", t: "All UPSC toppers", d: "Profiles, marksheets and strategies." },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={`${card} block p-5 transition-colors hover:bg-[var(--canvas)]`}>
                        <span className="block text-m font-bold">{l.t}</span>
                        <span className="mt-1 block text-s text-[var(--ink-2)]">{l.d}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </article>

            <aside className="hidden xl:block xl:self-start xl:[@media(min-height:760px)]:sticky xl:[@media(min-height:760px)]:top-28">
              <AdRail page="upsc-interview-marks" product="upsc-interview-pack" />
            </aside>
          </div>

          <div className="mt-12 xl:hidden">
            <AdRail page="upsc-interview-marks" product="upsc-interview-pack" inline />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="interview-marks" />
      </div>
    </BrandShell>
  );
}
