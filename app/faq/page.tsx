import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import BrandShell from "@/components/brand/BrandShell";

export const metadata: Metadata = {
  title: "UPSC Topper Answer Copies & Marksheets FAQ — Free Download, Pricing & How to Use",
  description:
    "Answers to common questions about UPSC topper answer copies: which copies are available, how to download free PDFs, pricing, authenticity, and how to use them in your preparation.",
  alternates: {
    canonical: "https://upscprepnotes.in/faq",
  },
  openGraph: {
    title: "UPSC Topper Answer Copies & Marksheets FAQ — Free Download, Pricing & How to Use",
    description:
      "Answers to common questions about UPSC topper answer copies: which copies are available, how to download free PDFs, pricing, authenticity, and how to use them in your preparation.",
    url: "https://upscprepnotes.in/faq",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

const FAQS = [
  {
    q: "Is UPSCPrepNotes free?",
    a: "Yes. All topper profiles, marks data, free materials (2,700+ PDFs), and the AI tutor are completely free. We charge only for premium products like strategy reports and answer copy compilations.",
  },
  {
    q: "How is topper data collected?",
    a: "We collect marks data from official UPSC results gazettes and topper interviews. Each profile is verified against published results. Our dataset spans 2022-2025 with 280+ toppers.",
  },
  {
    q: "Can I download answer copies?",
    a: "Free sample answer copies are available for many toppers. The full compilation (50+ toppers, all GS papers + essay) is a paid product at Rs 199.",
  },
  {
    q: "How does the AI tutor work?",
    a: "The Ask AI feature lets you ask UPSC-specific questions. It uses a vector search over our topper strategy database to give you personalized answers. Free tier: 20 queries/day.",
  },
  {
    q: "Are the free materials actually free?",
    a: "Yes. 2,700+ resources including test series, notes, books, and magazines from top coaching institutes. No hidden charges. Some materials require email registration for access.",
  },
  {
    q: "Which optional subjects are covered?",
    a: "We cover 13 optional subjects: Sociology, PSIR, Geography, History, Public Administration, Anthropology, Economics, Philosophy, Psychology, Law, Commerce, Agriculture, and Medical Science.",
  },
  {
    q: "How often is data updated?",
    a: "Topper profiles are updated within 2-4 weeks of UPSC results. Current affairs and free materials are updated weekly. PYQ papers are updated when new exam papers are released.",
  },
  {
    q: "Do you have Hindi content?",
    a: "Yes. Key guides (UPSC full form, syllabus, free material, answer writing) are available in Hindi. We're expanding Hindi content based on demand.",
  },
];

export default async function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <BrandShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">FAQ</span>
        </nav>

        <header className="mt-8 max-w-[46rem]">
          <h1 className="t-display text-h1">UPSC Topper Answer Copies & Marksheets — FAQ</h1>
          <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
            Everything you need to know about UPSC topper answer copies, marksheet data, free downloads, pricing, and how to use them in your preparation.
          </p>
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Question index (desktop) */}
          <nav aria-label="Questions" className="hidden lg:block">
            <ol className="sticky top-28 space-y-1 border-l border-[var(--line)]">
              {FAQS.map((faq, i) => (
                <li key={i}>
                  <a href={`#q${i + 1}`} className="-ml-px flex gap-3 border-l-2 border-transparent py-1.5 pl-4 text-s leading-snug text-[var(--ink-2)] hover:border-[var(--accent)] hover:text-[var(--ink)]">
                    <span className="tab text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</span>
                    {faq.q}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <section key={i} id={`q${i + 1}`} className="scroll-mt-28 rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)] sm:p-7">
                <div className="flex gap-4">
                  <span aria-hidden className="tab grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-s font-bold text-[var(--accent)]">{i + 1}</span>
                  <div className="min-w-0">
                    <h2 className="pt-1 text-m font-bold leading-snug">{faq.q}</h2>
                    <p className="mt-2 text-m leading-[1.7] text-[var(--ink-2)]">{faq.a}</p>
                  </div>
                </div>
              </section>
            ))}

            <div className="relative !mt-10 overflow-hidden rounded-[28px] bg-[var(--accent)] p-7 text-white sm:p-9">
              <svg aria-hidden viewBox="0 0 200 140" className="pointer-events-none absolute -right-6 -top-8 h-40 w-56 rotate-[12deg] text-white/10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"><rect x="8" y="8" width="184" height="124" rx="10" /><path d="M10 14l90 66 90-66" /></svg>
              <p className="relative text-m">
                Still have questions?{" "}
                <Link href="/contact" className="font-bold underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
