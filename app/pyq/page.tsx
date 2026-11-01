import Link from "next/link";
import { Metadata } from "next";
import { getAllPYQYears } from "@/data/upsc/pyq/cse-pyq";
import BrandShell from "@/components/brand/BrandShell";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many years of PYQs should I solve for UPSC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most toppers recommend solving at least the last 10 years' PYQs for Prelims and at least 5 years for Mains. However, solving 15-20 years of papers gives you a comprehensive understanding of UPSC's question patterns and helps identify high-yield topics across all subjects.",
      },
    },
    {
      "@type": "Question",
      name: "Are PYQs enough to clear UPSC Prelims?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PYQs are essential but not sufficient. They help you understand the exam pattern, question difficulty, and topic weighting, but you need standard textbooks (NCERTs, Laxmikanth, Spectrum, etc.) and current affairs for comprehensive coverage. PYQs should form about 30% of your preparation strategy, not 100%.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I download UPSC previous year question papers PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can download official UPSC previous year question papers PDF for free on UPSCPrepNotes. We provide Prelims (GS + CSAT) and Mains (Essay + GS 1-4) papers for years 2022–2025. Each paper is available in its original PDF format as released by the UPSC commission.",
      },
    },
    {
      "@type": "Question",
      name: "Does UPSC repeat questions from previous years?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UPSC rarely repeats exact questions, but they frequently repeat themes and concepts. For example, questions on Fundamental Rights, Panchayati Raj, and Climate Change appear in different forms across years. Analyzing PYQs helps you identify these recurring themes and prepare accordingly.",
      },
    },
    {
      "@type": "Question",
      name: "Should I solve Prelims and Mains PYQs together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Prelims and Mains require different approaches. Solve Prelims PYQs during your Prelims preparation phase (focus on speed, accuracy, and elimination techniques). Solve Mains PYQs during your Mains answer writing practice (focus on structure, depth, and time management).",
      },
    },
    {
      "@type": "Question",
      name: "How should I analyze UPSC PYQs for maximum benefit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by categorizing questions by subject and topic. Identify which subjects carry the most weight. Note the year-wise distribution — some topics cycle in importance. Track the difficulty level and question format changes. Finally, align your study plan to prioritize high-weightage and frequently tested topics.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "UPSC Previous Year Question Papers (PYQ) PDF - Prelims & Mains Free Download",
  description:
    "Download official UPSC Civil Services Examination Previous Year Question Papers (PYQ) PDF for Prelims and Mains. Free archive of GS, CSAT, Essay, and Optional papers from 2022-2025.",
  alternates: {
    canonical: "https://upscprepnotes.in/pyq",
  },
  openGraph: {
    title: "UPSC PYQ Archive PDF - Free Download Official Question Papers",
    description:
      "Access the complete archive of UPSC CSE Previous Year Questions PDF. Essential for understanding exam pattern, topic weighting, and trends.",
  },
};

export default async function PYQIndexPage() {
  const years = await getAllPYQYears();

  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-28 sm:pt-32">
        <Link href="/" data-track="pyq-back-home" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
          ← Back to Home
        </Link>

        {/* Hero */}
        <header className="mt-8 max-w-[48rem]">
          <h1 className="t-display text-h1">
            UPSC <span className="swipe">Previous Year Papers</span> PDF
          </h1>
          <p className="mt-2 text-s font-bold text-[var(--muted)]">Free Question Papers PDF</p>
          <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
            Download official UPSC Civil Services Examination previous year question papers PDF for Prelims (GS + CSAT) and Mains (Essay + GS 1-4 + Optional subjects). Free archive of UPSC PYQ PDF downloads from 2022 to 2025.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-s text-[var(--ink-2)]">
            {[
              { v: "3+", k: "Years Archive" },
              { v: "300+", k: "Papers" },
              { v: "Free", k: "PDF Download" },
            ].map((x) => (
              <li key={x.k} className="flex items-center gap-2">
                <span className="tab rounded-[6px] bg-[var(--ink)] px-1.5 py-0.5 text-s font-bold text-white">{x.v}</span>
                {x.k}
              </li>
            ))}
          </ul>
        </header>

        {/* Years Grid */}
        <section className="mt-14">
          <h2 className="t-head text-l">Browse by Year</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {years.map((year) => (
              <Link key={year} href={`/pyq/${year}`} data-track={`pyq-year-card-${year}`} className={`${card} group flex flex-col p-7 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-1`}>
                <span className="t-display tab text-l text-[var(--muted)] group-hover:text-[var(--accent)]">{year}</span>
                <h3 className="mt-4 text-m font-bold">UPSC CSE {year} Papers</h3>
                <p className="mt-1 flex-1 text-s leading-[1.55] text-[var(--ink-2)]">Includes Prelims (GS + CSAT) and Mains (Essay + GS 1-4) official papers.</p>
                <span className="mt-6 text-s font-bold text-[var(--accent)]">
                  Download Papers <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-20 max-w-[52rem] space-y-20">
          {/* Paper Categories */}
          <section>
            <h2 className="t-head text-l">UPSC PYQ PDF Categories</h2>
            <p className="mt-4 text-m leading-[1.6] text-[var(--ink-2)]">
              Our UPSC previous year question papers PDF archive covers every paper released by the commission. Download individual PDFs for each examination component.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Prelims GS Paper 1", desc: "General Studies including History, Geography, Polity, Economy, Science & Technology, Environment, and Current Affairs." },
                { title: "Prelims CSAT Paper 2", desc: "Civil Services Aptitude Test covering Comprehension, Interpersonal Skills, Logical Reasoning, and Quantitative Aptitude." },
                { title: "Mains Essay Paper", desc: "Two essays to be written on philosophical, social, and contemporary topics totaling 250 marks." },
                { title: "Mains GS Paper 1", desc: "Indian Heritage & Culture, History, Geography of India and the World, and Society." },
                { title: "Mains GS Paper 2", desc: "Governance, Constitution, Polity, Social Justice, and International Relations." },
                { title: "Mains GS Paper 3", desc: "Technology, Economic Development, Biodiversity, Environment, Security, and Disaster Management." },
              ].map((item) => (
                <div key={item.title} className={`${card} p-5`}>
                  <h3 className="text-m font-bold">{item.title}</h3>
                  <p className="mt-1 text-s leading-[1.55] text-[var(--ink-2)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Solve PYQs */}
          <section>
            <h2 className="t-head text-l">Why Solve UPSC Previous Year Papers?</h2>
            <p className="mt-4 text-m leading-[1.6] text-[var(--ink-2)]">
              Previous Year Questions (PYQs) are the most reliable tool for UPSC preparation. They reveal the examiner&apos;s mindset, topic weighting, and evolving question patterns. Every serious aspirant must integrate PYQ analysis into their study routine.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Identify High-Yield Topics", desc: "UPSC consistently tests certain themes across years. PYQs reveal which topics carry the most marks, helping you prioritize your study time effectively." },
                { title: "Understand Question Trends", desc: "Track how question formats evolve — from direct factual recall to application-based and analytical questions. Adapt your preparation accordingly." },
                { title: "Practice Time Management", desc: "Solving full papers under timed conditions builds the speed and accuracy needed for both Prelims (200 questions in 2 hours) and Mains (3-hour papers)." },
                { title: "Self-Assessment & Gap Analysis", desc: "Identify your weak areas by analyzing which questions you get wrong. PYQ practice reveals knowledge gaps that textbooks alone cannot highlight." },
                { title: "Develop Answer Writing Skills", desc: "For Mains, PYQs are the best answer writing practice. Structure your responses to match UPSC's expectations — introduction, body, conclusion with relevant examples." },
                { title: "Build Exam Confidence", desc: "Regular PYQ practice reduces exam anxiety. Familiarity with the paper pattern, difficulty level, and question style builds the confidence needed on exam day." },
              ].map((item) => (
                <div key={item.title} className="border-l-[3px] border-[var(--accent)] pl-4">
                  <h3 className="text-m font-bold">{item.title}</h3>
                  <p className="mt-1 text-s leading-[1.55] text-[var(--ink-2)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How to Use PYQs */}
          <section>
            <h2 className="t-head text-l">How to Use UPSC PYQs Effectively</h2>
            <p className="mt-4 text-m leading-[1.6] text-[var(--ink-2)]">
              Simply downloading UPSC previous year question papers PDF is not enough. Follow this systematic approach to maximize your learning from every paper.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { step: "01", title: "Categorize & Analyze", desc: "Group questions by subject and topic. Create a topic-wise frequency chart to identify which areas UPSC tests most often. This data-driven approach ensures you focus on high-yield topics first." },
                { step: "02", title: "Solve & Review", desc: "Attempt each paper under exam conditions — strictly timed, no distractions. After solving, review every incorrect answer in detail. Maintain an error log tracking recurring mistakes." },
                { step: "03", title: "Align Your Strategy", desc: "Use PYQ insights to refine your study plan. Increase time on frequently tested topics, adjust your note-making style to match question demands, and practice answer writing for identified weak areas." },
              ].map((item) => (
                <li key={item.step} className={`${card} p-5`}>
                  <span className="tab grid h-8 w-8 place-items-center rounded-full bg-[var(--accent-soft)] text-s font-bold text-[var(--accent)]">{item.step}</span>
                  <h3 className="mt-4 text-m font-bold">{item.title}</h3>
                  <p className="mt-1 text-s leading-[1.55] text-[var(--ink-2)]">{item.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="t-head text-l">Frequently Asked Questions about UPSC PYQs</h2>
            <div className={`${card} mt-6 divide-y divide-[var(--line)]`}>
              {[
                { q: "How many years of PYQs should I solve for UPSC?", a: "Most toppers recommend at least 10 years of Prelims PYQs and 5 years of Mains PYQs. For comprehensive coverage, 15-20 years is ideal. This helps you identify all recurring themes and question patterns." },
                { q: "Are PYQs enough to clear UPSC Prelims?", a: "PYQs are essential but not sufficient alone. They should form about 30% of your preparation. You still need NCERTs, standard reference books, and current affairs for full syllabus coverage." },
                { q: "Does UPSC repeat questions?", a: "UPSC rarely repeats exact questions but frequently repeats themes. Concepts from Polity (Fundamental Rights, DPSPs), Environment (Climate Change, Conservation), and Modern History appear in different forms across years." },
                { q: "Should I solve Prelims and Mains PYQs differently?", a: "Yes. Prelims PYQs focus on speed, accuracy, and elimination techniques. Mains PYQs focus on answer structure, depth of content, and time management across 3-hour papers." },
                { q: "Where can I download UPSC previous year question papers PDF?", a: "You can download UPSC previous year question papers PDF for free right here on UPSCPrepNotes. We provide official PDFs for Prelims (GS + CSAT) and Mains (Essay + GS 1-4) for 2022, 2023, 2024, and 2025." },
                { q: "How do I analyze PYQs for topic weighting?", a: "Create a spreadsheet with columns for year, subject, topic, and marks. After solving 5+ years of papers, sort by topic to see which areas carry the most weight. Allocate study time proportionally to this data." },
              ].map((faq) => (
                <details key={faq.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <span className="text-m font-bold">{faq.q}</span>
                    <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                  </summary>
                  <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Free Materials CTA */}
        <section className={`${card} mt-20 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
          <div>
            <h2 className="text-m font-bold">Free Study Material</h2>
            <p className="mt-1 text-s text-[var(--ink-2)]">Practice with test series, revise with notes, and stay updated with current affairs compilations — all free.</p>
          </div>
          <Link href="/free-materials" data-track="pyq-browse-free-materials" className="btn btn-blue shrink-0 self-start [--btn-fs:14px] sm:self-center">
            Browse Free Materials &rarr;
          </Link>
        </section>

        {/* CTA */}
        <section className="mt-4 flex flex-col gap-6 rounded-[28px] bg-[var(--ink)] p-8 text-white md:flex-row md:items-center md:p-12">
          <div className="flex-1">
            <h2 className="t-head text-l">PYQs + Answer Copy Compilation</h2>
            <p className="mt-1 text-s font-bold text-[var(--hl)]">RECOMMENDED</p>
            <p className="mt-3 max-w-xl text-m text-white/70">
              See how toppers actually wrote their answers. 50+ verified copies across GS1-4 and Essay with marks-wise compilation.
            </p>
          </div>
          <Link href="/store" data-track="pyq-main-cta" className="btn btn-blue shrink-0 self-start md:self-center">
            Browse Store <span className="knob">→</span>
          </Link>
        </section>
      </div>
    </BrandShell>
  );
}
