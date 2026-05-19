import Link from "next/link";

export const metadata = {
  title: "Score 120+ Marks in Each GS via 50+ Toppers Using IBEC Method",
  description:
    "India's first marks-wise UPSC topper answer copy compilation. 50+ verified copies across GS1-4, Essay. Learn the IBEC Method from toppers who scored 120+.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
  },
};

const TOPPERS = [
  {
    name: "Saurabh Sharma",
    rank: "AIR 23",
    highlight: "136 Marks in Essay",
    speciality: "Art of Brainstorming",
    takeaway: "Learn the power of connecting phrases from his answer copies",
    color: "bg-zinc-900",
  },
  {
    name: "Animesh Pradhan",
    rank: "AIR 2",
    highlight: "109 Marks in GS1",
    speciality: "Art of Presentations",
    takeaway: "Learn using diagrams, micro-diagrams, examples from his answer copies",
    color: "bg-zinc-800",
  },
  {
    name: "Kunal Rastogi",
    rank: "AIR 15",
    highlight: "134 Marks in GS2",
    speciality: "Writing Perfect GS2 Answers",
    takeaway: "Learn the art of writing more in limited words with tabular format",
    color: "bg-zinc-900",
  },
  {
    name: "Shaurya Arora",
    rank: "AIR 14",
    highlight: "101 Marks in GS3",
    speciality: "Scoring in the Lowest Scoring Paper",
    takeaway: "See how Shaurya used argument and example method in GS3",
    color: "bg-zinc-800",
  },
  {
    name: "Aditya Shrivastava",
    rank: "AIR 1",
    highlight: "143 Marks in GS4",
    speciality: "Multi-dimensional Approach",
    takeaway: "Replicate the stakeholder, ethical issues approach of writing case studies",
    color: "bg-zinc-900",
  },
];

const IBEC_STEPS = [
  {
    letter: "I",
    title: "INTRODUCTIONS",
    points: [
      "Start with clear, focused introductions for strong impact",
      "Use quotes or data to set context quickly",
      "Align introductions precisely with the question's demand",
    ],
  },
  {
    letter: "B",
    title: "BODY",
    points: [
      "Write concise, direct answers without extra details",
      "Use tables, diagrams, and bullet points for clarity",
      "Include facts, examples, and visuals effectively",
    ],
  },
  {
    letter: "E",
    title: "ENHANCEMENTS",
    points: [
      "Use quick diagrams and maps to boost answers",
      "Recycle points for multidimensional coverage",
      "Integrate perspectives from multiple subjects easily",
    ],
  },
  {
    letter: "C",
    title: "CONCLUSIONS",
    points: [
      "Summarize key points without repeating the content",
      "End with solutions or forward-looking statements",
      "Keep conclusions concise and impactful",
    ],
  },
];

const PACKAGES = [
  { name: "All", price: "999", original: "4999", popular: true },
  { name: "Essay", price: "499", original: "999", popular: false },
  { name: "GS 1", price: "499", original: "999", popular: false },
  { name: "GS 2", price: "499", original: "999", popular: false },
  { name: "GS 3", price: "499", original: "999", popular: false },
  { name: "GS 4", price: "499", original: "999", popular: false },
];

const FEATURE_ROWS = [
  "Keywords",
  "Facts",
  "Data",
  "Maps",
  "Diagrams",
  "Micro Diagrams",
  "Crisp Introductions",
  "Forward Looking Conclusions",
  "Bouncer Questions",
  "5 Sec Diagram Collections",
];

const TESTIMONIALS = [
  {
    name: "Amit Pandey",
    text: "Helped me learn the \"Structure\" of the answer. The General studies is so vast. I was looking for previous year question and answer notes on the internet and I found this one. This is the best hand written notes that helped me how to create structure for our answers.",
    rating: 5,
  },
  {
    name: "Vishnu Gowda",
    text: "I will be attempting the exam next year. After going through the books written by toppers, I have confidence that even I can write UPSC Mains answers.",
    rating: 5,
  },
  {
    name: "Nisha Jacobs",
    text: "With this one book, I covered nearly 50% of the GS Paper 2 syllabus, that too with high quality content. I don't have to make separate notes now.",
    rating: 5,
  },
  {
    name: "Biswajeet Das",
    text: "This book is written very nicely. This gives a deep insight on how IAS toppers approach a question and how I should be writing answers.",
    rating: 5,
  },
];

const FAQS = [
  { q: "How many topper copies are there?", a: "51 topper copies across all GS papers, Essay, and optional subjects." },
  { q: "Are all topper copies verified?", a: "Yes. Every copy is verified for authenticity and marks accuracy." },
  { q: "How many PDFs will I get?", a: "You get individual PDFs for each paper, organized by topper and by subject." },
  { q: "Will I get in hardcopy format?", a: "Currently available in digital PDF format. Instant access after purchase." },
];

export default function CopyCompilationPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-black">
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-10">
        {/* BREADCRUMB */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/" className="transition hover:text-black">Home</Link>
          <span>•</span>
          <span className="text-zinc-400">Answer Copy Compilation</span>
        </div>

        {/* ─────────────── HERO ─────────────── */}
        <section className="mb-28">
          <div className="max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-wide">
                50+ Topper Copies
              </span>
              <span className="rounded-full bg-black px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white">
                Marks Wise • Not Rank Wise
              </span>
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl leading-[1.1]">
              Score 120+ Marks in Each GS
              <br />
              <span className="text-zinc-500">via 50+ Toppers Using</span>
              <br />
              IBEC Method
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
              India&apos;s first marks-wise UPSC topper answer copy compilation.
              Learn the exact technique that helped toppers score in the top 1
              percentile across every GS paper.
            </p>

            {/* RATING ROW */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex text-lg">★★★★★</div>
                <span className="ml-1 text-sm font-medium">190+ Reviews</span>
              </div>
              <span className="hidden text-zinc-300 md:inline">|</span>
              <span className="text-sm text-zinc-500">Trusted by 5000+ Aspirants</span>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-full bg-black px-10 py-4 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-800 hover:shadow-xl">
                Check Price →
              </button>
              <button className="rounded-full border border-black/10 bg-white px-10 py-4 text-sm font-medium transition hover:bg-black hover:text-white">
                Preview Sample Copies
              </button>
            </div>
          </div>

          {/* BENEFIT BULLETS */}
          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Get answer copies of toppers in each paper (Verified ONLY)",
              "Handwritten Answers from 20+ toppers",
              "Includes Micro-diagrams, Data, Facts, Examples",
              "All GS Papers — GS1, GS2, GS3, GS4 & Essay Covered",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-white p-5">
                <span className="mt-0.5 text-lg">✓</span>
                <p className="text-sm leading-6 text-zinc-700">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────── IBEC METHOD ─────────────── */}
        <section className="mb-28">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">The Framework</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">What Is the IBEC Method?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-600">
              A proven answer-writing framework used by top 1% scorers. Four stages that transform
              average answers into high-scoring responses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {IBEC_STEPS.map((step) => (
              <div
                key={step.letter}
                className="group rounded-[32px] border border-black/[0.06] bg-white p-8 transition duration-300 hover:-translate-y-[2px] hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white">
                  {step.letter}
                </div>

                <h3 className="text-xl font-semibold tracking-tight">
                  Learn the Perfect {step.title}
                </h3>

                <ul className="mt-6 space-y-3">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
                      <span className="mt-0.5 text-green-600">✅</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className="rounded-full bg-black px-10 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-zinc-800">
              BUY NOW →
            </button>
          </div>
        </section>

        {/* ─────────────── TOPPERS ─────────────── */}
        <section className="mb-28">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">Who Are These IAS Toppers?</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Learn from the Best</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TOPPERS.map((t) => (
              <div
                key={t.name}
                className="group rounded-[32px] border border-black/[0.06] bg-white p-6 transition duration-300 hover:-translate-y-[2px] hover:shadow-lg"
              >
                <div className={`mb-4 inline-block rounded-2xl px-4 py-2 text-xs font-medium text-white ${t.color}`}>
                  {t.rank}
                </div>

                <h3 className="text-2xl font-semibold tracking-tight">{t.name}</h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
                    <span className="mt-0.5 text-green-600">✅</span>
                    Scored {t.highlight} (Top 1 percentile)
                  </div>
                  <div className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
                    <span className="mt-0.5 text-green-600">✅</span>
                    Specialises in {t.speciality}
                  </div>
                  <div className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
                    <span className="mt-0.5 text-green-600">✅</span>
                    {t.takeaway}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────── MARKS WISE BANNER ─────────────── */}
        <section className="mb-28 overflow-hidden rounded-[36px] bg-black px-8 py-14 text-white md:px-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">A Must Buy Compilation for Beginners</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              India&apos;s First — Marks Wise Compilation
            </h2>
            <p className="mt-4 text-lg font-medium text-zinc-300">NOT Rank Wise!</p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400">
              Stop guessing. Start learning from toppers who actually scored the highest marks
              in each paper — organized by what works, not by who they are.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Strategic Learning", desc: "Focus on high-scoring techniques with our marks-wise compilation of handwritten answers." },
              { title: "Expert Insights", desc: "Learn from 5 IAS toppers who share their proven strategies for crafting compelling responses." },
              { title: "Maximized Score Potential", desc: "Discover how to write impactful answers organized by marks achieved for a competitive edge." },
              { title: "Comprehensive Content", desc: "Covers all GS papers (GS1, GS2, GS3, GS4, and Essay) with full coverage from 2017 to 2023 CSE Mains." },
              { title: "Exclusive Learning Tools", desc: "Includes micro-diagrams and micro-angles to enhance your answers and improve your scores." },
              { title: "Join the Community", desc: "Access a private Telegram group for interaction, sharing, and exclusive sessions with toppers." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────── GS TOPPER STYLES ─────────────── */}
        <section className="mb-28">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">Paper-wise Expertise</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Topper Among GS Toppers</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* GS1 */}
            <div className="rounded-[32px] border border-black/[0.06] bg-white p-8">
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">GS 1 — Includes Maps & Diagrams</h3>
              <p className="mb-6 text-sm text-zinc-500">The Diagram Maestro Approach</p>

              <ul className="space-y-3">
                {[
                  "Use visually enriching diagrams in your answers, increase marks instantly",
                  "Use the 5 seconds maps/diagrams from topper copies — directly plug in your answers",
                  "Master the art of recycling points for multiple dimensional coverage",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
                    <span className="mt-0.5 text-green-600">✅</span>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3 border-t border-black/[0.06] pt-6">
                {[
                  "Balanced diagrams with concise explanations",
                  "Used micro-diagrams to clarify complex ideas",
                  "Delivered maximum content in fewer words",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
                    <span className="mt-0.5">✦</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* GS2 */}
            <div className="rounded-[32px] border border-black/[0.06] bg-white p-8">
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">GS 2 — Policy & Case Studies</h3>
              <p className="mb-6 text-sm text-zinc-500">The Policy Prodigy Approach</p>

              <ul className="space-y-3">
                {[
                  "Use crisp policy-based content in your answers to maximize impact",
                  "Incorporate real-world case studies from topper copies to provide depth",
                  "Master concise tabular presentation for complex data, simplifying answers & save time",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
                    <span className="mt-0.5 text-green-600">✅</span>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3 border-t border-black/[0.06] pt-6">
                {[
                  "Excelled in concise, policy-based answers",
                  "Used data and tables to present key points clearly",
                  "Focused on connecting current affairs with static content",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
                    <span className="mt-0.5">✦</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── PRICING TABLE ─────────────── */}
        <section className="mb-28">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">Choose Your Package</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Invest in Your Answer Writing</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-[28px] border bg-white p-6 transition duration-300 hover:-translate-y-[2px] hover:shadow-lg ${
                  pkg.popular ? "border-black ring-2 ring-black" : "border-black/[0.06]"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                    Best Value
                  </span>
                )}

                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <div className="mt-4">
                  <p className="text-sm text-zinc-400 line-through">₹{pkg.original}</p>
                  <p className="text-3xl font-bold tracking-tight">₹{pkg.price}</p>
                </div>

                <button
                  className={`mt-6 w-full rounded-full py-3 text-sm font-medium transition ${
                    pkg.popular
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "border border-black/10 bg-white hover:bg-black hover:text-white"
                  }`}
                >
                  BUY NOW
                </button>
              </div>
            ))}
          </div>

          {/* FEATURE COMPARISON TABLE */}
          <div className="mt-14 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="pb-4 pr-6 font-semibold">Features</th>
                  {PACKAGES.map((pkg) => (
                    <th key={pkg.name} className="pb-4 pr-6 font-semibold last:pr-0">{pkg.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((feature) => (
                  <tr key={feature} className="border-b border-black/[0.04]">
                    <td className="py-4 pr-6 text-zinc-700">{feature}</td>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.name} className="py-4 pr-6 text-zinc-500 last:pr-0">
                        {pkg.name === "All" || pkg.name === feature.split(" ")[0] || feature === "Keywords" ? "✓" : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─────────────── URGENCY ─────────────── */}
        <section className="mb-28 overflow-hidden rounded-[36px] border border-black/[0.06] bg-white p-10 md:p-16">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Steal Deal — Only For Today</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Offer Ends Today</h2>

            <div className="mt-8">
              <p className="text-6xl font-bold tracking-tight md:text-7xl">₹999</p>
              <p className="mt-2 text-lg text-zinc-400 line-through">₹4,999</p>
              <p className="mt-2 text-sm font-medium text-green-600">Save 80% — Limited spots remaining</p>
            </div>

            <div className="mt-10 flex justify-center gap-4">
              <button className="rounded-full bg-black px-12 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-zinc-800">
                BUY NOW — ₹999
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────── TESTIMONIALS ─────────────── */}
        <section className="mb-28">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">Students Love the Compilation</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">What Students Think</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-[28px] border border-black/[0.06] bg-white p-6 md:p-8">
                <div className="mb-3 text-lg">{"★".repeat(t.rating)}</div>
                <p className="leading-8 text-zinc-700">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-6 text-sm font-medium">{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────── FAQ ─────────────── */}
        <section className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">FAQ</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-[28px] border border-black/[0.06] bg-white p-6">
                <h3 className="text-lg font-semibold">{faq.q}</h3>
                <p className="mt-3 leading-8 text-zinc-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <p className="mt-20 text-center text-xs text-zinc-400">
          UPSCPrepNotes is an independent educational platform. All answer copies are sourced from publicly available materials and used for educational reference purposes.
        </p>
      </div>
    </main>
  );
}
