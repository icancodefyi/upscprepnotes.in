import Link from "next/link";

export const metadata = {
  title: "50+ UPSC Topper Answer Copy Compilation — UPSCPrepNotes",
  description:
    "Curated compilation of 50+ topper answer copies across GS papers, essay, and optional subjects. Learn answer writing from real UPSC toppers.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
  },
};

const FEATURES = [
  {
    title: "GS Paper Copies",
    desc: "Real answer copies from AIR 1-100 toppers across GS1, GS2, GS3, and GS4 papers. See how top scorers structure their answers.",
  },
  {
    title: "Essay Copies",
    desc: "High-scoring essay copies with actual marks. Study the approach, structure, and content that secured top scores in the essay paper.",
  },
  {
    title: "Optional Subject Copies",
    desc: "Subject-specific answer copies for PSIR, Sociology, Anthropology, Geography, Public Administration, and more.",
  },
  {
    title: "Marks Breakdown",
    desc: "Every copy comes with the topper's marks breakdown — see exactly what scores each paper received.",
  },
  {
    title: "Strategy Notes",
    desc: "Each compilation includes preparation strategy notes from the topper covering their approach, resources, and common mistakes.",
  },
  {
    title: "Regular Updates",
    desc: "New answer copies added every month. Once purchased, you get access to all future additions at no extra cost.",
  },
];

const HIGHLIGHTS = [
  { label: "Answer Copies", value: "50+" },
  { label: "Toppers Covered", value: "30+" },
  { label: "Optional Subjects", value: "12+" },
  { label: "Exam Years", value: "2020–2025" },
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
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <span>•</span>
          <span className="text-zinc-400">Answer Copy Compilation</span>
        </div>

        {/* HERO */}
        <section className="mb-32">
          <div className="max-w-4xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Premium Resource Compilation
            </p>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              50+ UPSC Topper
              <br />
              Answer Copy Compilation
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-zinc-700">
              A curated collection of real answer copies from UPSC toppers —
              GS papers, essay, and optional subjects. Study actual answers that
              secured top ranks and understand what the UPSC evaluator looks
              for.
            </p>

            {/* STATS */}
            <div className="mt-10 grid overflow-hidden rounded-[30px] border border-black/[0.06] bg-white md:grid-cols-4">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.label}
                  className="border-b border-black/[0.05] p-6 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                    {h.label}
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">
                    {h.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap gap-4">
              <button className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800">
                Get Instant Access — ₹499
              </button>
              <button className="rounded-full border border-black/10 bg-white px-8 py-3.5 text-sm font-medium transition hover:bg-black hover:text-white">
                Preview Sample Copies
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mb-32">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                What You Get
              </p>
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Everything You Need to Master Answer Writing
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-zinc-800">
              Real copies with real marks. Study the exact answers that secured
              top ranks across multiple UPSC CSE years.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-[28px] border border-black/[0.06] bg-white p-6 transition duration-300 hover:-translate-y-[2px]"
              >
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="mt-4 leading-7 text-zinc-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TOPPERS COVERED */}
        <section className="mb-32 rounded-[36px] border border-black/[0.06] bg-white p-10 md:p-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              Featured Toppers
            </p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Answers from the Best
            </h2>
            <p className="mt-6 leading-8 text-zinc-600">
              The compilation includes answer copies from multiple UPSC toppers
              across different years, optional subjects, and rank categories.
              Each copy is annotated with marks and examiner feedback where
              available.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                "AIR 1 — 2024",
                "AIR 2 — 2024",
                "AIR 5 — 2023",
                "AIR 8 — 2023",
                "AIR 12 — 2022",
                "AIR 21 — 2022",
                "AIR 3 — 2021",
                "AIR 9 — 2021",
                "AIR 15 — 2020",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-black/[0.06] bg-[#f8f7f4] px-5 py-4"
                >
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING CTA */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="rounded-[36px] border border-black/[0.06] bg-white p-10 md:p-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              One-Time Purchase
            </p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              Get Instant Access to 50+ Answer Copies
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-8 text-zinc-600">
              One payment. Lifetime access. Regular updates with new answer
              copies every month. No subscription fees.
            </p>

            <div className="mt-8">
              <p className="text-5xl font-semibold tracking-tight">₹499</p>
              <p className="mt-2 text-sm text-zinc-500">Lifetime access</p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button className="rounded-full bg-black px-10 py-4 text-sm font-medium text-white transition hover:bg-zinc-800">
                Buy Now — ₹499
              </button>
              <button className="rounded-full border border-black/10 bg-white px-10 py-4 text-sm font-medium transition hover:bg-black hover:text-white">
                View Sample
              </button>
            </div>

            <p className="mt-6 text-xs text-zinc-400">
              30-day satisfaction guarantee. Full refund if not satisfied.
            </p>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <p className="mt-20 text-center text-xs text-zinc-400">
          UPSCPrepNotes is an independent educational platform. All answer
          copies are sourced from publicly available materials and used for
          educational reference purposes.
        </p>
      </div>
    </main>
  );
}
