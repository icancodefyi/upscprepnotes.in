import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

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
    a: "Free sample answer copies are available for many toppers. The full compilation (50+ toppers, all GS papers + essay) is a paid product at Rs 799.",
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

export default function FAQPage() {
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
    <main className="mx-auto max-w-3xl px-4 py-20">
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
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        UPSC Topper Answer Copies & Marksheets — FAQ
      </h1>
      <p className="mt-4 text-lg text-gray-500">
        Everything you need to know about UPSC topper answer copies, marksheet data, free downloads, pricing, and how to use them in your preparation.
      </p>
      <div className="mt-12 divide-y divide-gray-200">
        {FAQS.map((faq, i) => (
          <div key={i} className="py-6">
            <h2 className="text-lg font-semibold text-gray-900">{faq.q}</h2>
            <p className="mt-2 text-base leading-7 text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          Still have questions?{" "}
          <Link
            href="/contact"
            className="font-medium text-emerald-600 hover:text-emerald-500"
          >
            Contact us
          </Link>
        </p>
      </div>
    </main>
  );
}
