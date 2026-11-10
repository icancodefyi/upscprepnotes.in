import type { Metadata } from "next";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";
import { card } from "@/components/brand/ui";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import PopularLinks from "@/components/brand/PopularLinks";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { buildHandbook, CUTOFFS } from "@/lib/marks-handbook";
import { median } from "@/lib/topper-stats";
import { getProductBySlug } from "@/lib/store-products";
import official from "@/data/official/cse-2025-recommended-marks.json";
import QuizTeaser from "@/components/quiz/QuizTeaser";
import MarksCalculator from "@/components/marks/MarksCalculator";

export const revalidate = 86400;

const URL = "https://upscprepnotes.in/toppers/upsc-mains-marks-needed";
const TITLE = "UPSC Mains Marks Needed for a Rank: CSE 2025 by Rank";
const DESC = "How many marks you need in UPSC Mains for a rank: written, interview and final marks of all 958 CSE 2025 rank holders by rank band, Mains cut-offs, and the papers where top rankers pull away.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, siteName: "UPSCPrepNotes", type: "article", images: [{ url: "/og/marks-handbook.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og/marks-handbook.png"] },
};

type Row = { rank: number; name: string; written: number; pt: number; total: number };
const ROWS = official as Row[];
const BANDS: [number, number][] = [[1, 10], [11, 50], [51, 100], [101, 300], [301, 600], [601, ROWS.length]];

export default async function Page() {
  await connectDB();
  const raw = (await TopperModel.find({}, { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, optionalSubject: 1, marks: 1 }).lean()) as never[];
  const h = buildHandbook(raw);
  const bands = BANDS.map(([a, b]) => {
    const g = ROWS.filter((r) => r.rank >= a && r.rank <= b);
    return { label: `AIR ${a}–${b}`, n: g.length, written: median(g.map((r) => r.written)), pt: median(g.map((r) => r.pt)), total: median(g.map((r) => r.total)) };
  });
  const at = (r: number) => ROWS[r - 1];
  const top = h.bands[0];
  const last = h.bands[h.bands.length - 1];
  const pack = getProductBySlug("upsc-mains-2027-pack");
  const packLive = pack && !pack.comingSoon;
  const latestCut = CUTOFFS[CUTOFFS.length - 1];

  const faqs = [
    { q: "How many marks are needed in UPSC Mains for a rank?", a: `In CSE 2025 the median written score was ${bands[2].written} out of 1,750 for ranks 51–100, ${bands[3].written} for ranks 101–300 and ${bands[4].written} for ranks 301–600 (all categories, UPSC's official list). AIR 100 wrote ${at(100).written}.` },
    { q: "What is the UPSC Mains cut-off?", a: `The General-category Mains cut-off (marks of the last candidate called for interview) was ${CUTOFFS.map((c) => `${c.mains} in CSE ${c.year}`).join(", ")}, out of 1,750. Reaching the interview is not enough for a rank: the final list is decided on written plus interview marks out of 2,025.` },
    { q: "How many marks did AIR 1 get in UPSC Mains 2025?", a: `${at(1).name.replace(/\b(\w)(\w*)/g, (_, a: string, b: string) => a + b.toLowerCase())} wrote ${at(1).written} of 1,750 and scored ${at(1).pt} in the interview: ${at(1).total.toLocaleString("en-IN")} of 2,025.` },
    { q: "Which Mains paper decides the rank most?", a: `Comparing the median ${top.label} topper with the median ${last.label} topper in our ${h.n} marksheets, the biggest gap is in ${h.gaps[0].short} (${h.gaps[0].gap} marks), then ${h.gaps[1].short} (${h.gaps[1].gap}) and ${h.gaps[2].short} (${h.gaps[2].gap}).` },
  ];
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Toppers", href: "/toppers" }, { name: "UPSC Mains marks needed", href: "/toppers/upsc-mains-marks-needed" }]} />
      <div className="mx-auto max-w-[920px] px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-2">
          <Link href="/toppers" className="hover:text-[var(--ink)]">Toppers</Link><span aria-hidden>/</span><span className="text-[var(--ink-2)]">UPSC Mains marks needed</span>
        </nav>
        <h1 className="t-display text-h1 mt-6">UPSC Mains marks needed for a rank</h1>
        <p className="mt-5 max-w-[44rem] text-m leading-[1.7] text-[var(--ink-2)]">
          {`The UPSC Mains marks needed for a rank depend on the rank you want: in CSE 2025, ranks 51–100 had a median written score of ${bands[2].written} out of 1,750, and ranks 301–600 a median of ${bands[4].written}. These are the official marks of all ${ROWS.length} recommended candidates, published by UPSC on 10 March 2026, and below, the papers where top rankers gain their marks.`}
        </p>
        <PopularLinks track="mains-needed-popular" />

        <section className="mt-12">
          <h2 className="t-head text-l">Written marks by rank, CSE 2025</h2>
          <div className={`${card} mt-5 overflow-x-auto`}>
            <table className="w-full min-w-[520px] text-s sm:text-m">
              <thead><tr className="border-b border-[var(--line-2)] text-left text-[var(--muted)]"><th className="px-5 py-3 font-normal">Rank band</th><th className="px-3 py-3 text-right font-normal">Candidates</th><th className="px-3 py-3 text-right font-normal">Median written /1750</th><th className="px-3 py-3 text-right font-normal">Median interview /275</th><th className="px-5 py-3 text-right font-normal">Median final /2025</th></tr></thead>
              <tbody className="tab">
                {bands.map((b) => (
                  <tr key={b.label} className="border-b border-[var(--line)]"><td className="px-5 py-3 font-bold">{b.label}</td><td className="px-3 py-3 text-right">{b.n}</td><td className="px-3 py-3 text-right font-bold text-[var(--accent)]">{b.written}</td><td className="px-3 py-3 text-right">{b.pt}</td><td className="px-5 py-3 text-right">{b.total.toLocaleString("en-IN")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-s text-[var(--muted)]">{`All categories together. Single ranks: AIR 1 wrote ${at(1).written}, AIR 10 ${at(10).written}, AIR 100 ${at(100).written}, AIR 300 ${at(300).written}, AIR 500 ${at(500).written}. Source: UPSC, marks of recommended candidates, CSE 2025.`}</p>
        </section>

        <section className="mt-12" id="where-you-stand">
          <h2 className="t-head text-l">Where does your Mains score land?</h2>
          <p className="mt-3 max-w-[44rem] text-m leading-[1.7] text-[var(--ink-2)]">Enter marks from a mock test, or the marks you are aiming for in each paper. You will see which rank band your written total matches and which papers are furthest from the median topper.</p>
          <div className="mt-5">
            <MarksCalculator
              official={bands.map((b) => ({ label: b.label, written: b.written }))}
              paperBands={h.bands.map((b) => ({ label: b.label, n: b.n, med: { essay: b.med.essay, gs1: b.med.gs1, gs2: b.med.gs2, gs3: b.med.gs3, gs4: b.med.gs4, optional: b.med.optional } }))}
              packHref={packLive ? "/store/upsc-mains-2027-pack" : "/store/answer-copies-compilation"}
              packLabel={packLive ? `Get the target marksheet in the Mains 2027 Pack · ₹${pack!.price}` : "See how these marks were written"}
            />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="t-head text-l">UPSC Mains cut-off</h2>
          <p className="mt-3 text-m leading-[1.7] text-[var(--ink-2)]">
            {`The General-category Mains cut-off, the marks of the last candidate called for interview, was ${CUTOFFS.map((c) => `${c.mains} (CSE ${c.year})`).join(", ")}. Crossing it gets you an interview; the rank comes from written plus interview. In CSE ${latestCut.year} the last General-category rank scored ${latestCut.final} of 2,025 in total.`}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="t-head text-l">Where top rankers pull away, paper by paper</h2>
          <p className="mt-3 text-m leading-[1.7] text-[var(--ink-2)]">{`Median marks by rank band, from ${h.n} complete topper marksheets (CSE ${h.yearsLabel}). The gap column shows where top rankers pull away.`}</p>
          <div className={`${card} mt-5 overflow-x-auto`}>
            <table className="w-full min-w-[520px] text-s">
              <thead><tr className="border-b border-[var(--line-2)] text-left text-[var(--muted)]"><th className="px-5 py-2.5 font-normal">Paper</th><th className="px-3 py-2.5 text-right font-normal">{top.label}</th><th className="px-3 py-2.5 text-right font-normal">{last.label}</th><th className="px-5 py-2.5 text-right font-normal">Gap</th></tr></thead>
              <tbody className="tab">
                {h.gaps.map((g) => (
                  <tr key={g.key} className="border-b border-[var(--line)]"><td className="px-5 py-2.5 font-bold">{g.short}</td><td className="px-3 py-2.5 text-right">{top.med[g.key]}</td><td className="px-3 py-2.5 text-right">{last.med[g.key]}</td><td className="px-5 py-2.5 text-right font-bold text-[var(--accent)]">+{g.gap}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-4 rounded-[24px] bg-[var(--accent)] p-6 text-white sm:p-7">
          <p className="t-head text-l">{packLive ? "Plan Mains 2027 from these numbers" : "See how these marks were written"}</p>
          <p className="text-m leading-[1.55] text-white/85">
            {packLive
              ? "The Mains 2027 Pack has the target marksheet for every rank band, what toppers scored in your optional, 471 past GS questions sorted by theme and 63 real topper copies."
              : "63 handwritten Mains booklets from 27 toppers, each named with the topper and the marks."}
          </p>
          <Link href={packLive ? "/store/upsc-mains-2027-pack" : "/store/answer-copies-compilation"} data-track="mains-needed-cta" className="btn btn-paper h-11 self-start px-5 [--btn-fs:15px]">
            {packLive ? `See the Mains 2027 Pack · ₹${pack!.price}` : "See the Answer Copies Compilation · ₹199"}
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="t-head text-l">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className={`${card} p-5`}>
                <summary className="cursor-pointer list-none text-m font-bold [&::-webkit-details-marker]:hidden">{f.q}</summary>
                <p className="mt-2 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-s text-[var(--muted)]">
          More: <Link href="/toppers/highest-marks-in-upsc" className="underline">highest marks in UPSC</Link> · <Link href="/toppers/marks-database" className="underline">marks of 290 toppers</Link> · <Link href="/pyq/2026" className="underline">UPSC Mains 2026 questions</Link> · <Link href="/content/best-upsc-coaching-2027" className="underline">best UPSC coaching 2027</Link>
        </p>
      </div>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="mains-marks-needed" />
      </div>
    </BrandShell>
  );
}
