import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import CurrentAffairsClient from "./CurrentAffairsClient";
import BrandShell from "@/components/brand/BrandShell";
import { getMonth, getCanonical, monthMeta, getSlug, MONTHS } from "@/lib/current-affairs-utils";
import QuizTeaser from "@/components/quiz/QuizTeaser";

export async function generateStaticParams() {
  return Object.keys(MONTHS).map((slug) => ({ month: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }): Promise<Metadata> {
  const { month } = await params;
  const data = getMonth(month);
  if (!data) return {};
  const meta = monthMeta(month, data);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    alternates: { canonical: getCanonical(month) },
  };
}

const editionLinks = Object.entries(MONTHS).map(([slug, data]) => ({
  slug,
  label: `${data.month} ${data.year}`,
}));

export default async function MonthPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const data = getMonth(month);
  if (!data) notFound();

  const canonical = getCanonical(month);
  const totalTopics = data.sections.reduce((a, s) => a + s.items.length, 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
      { "@type": "ListItem", position: 2, name: "Current Affairs", item: "https://upscprepnotes.in/current-affairs" },
      { "@type": "ListItem", position: 3, name: `Current Affairs ${data.month} ${data.year}`, item: canonical },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is covered in the ${data.month} ${data.year} current affairs edition?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${data.month} ${data.year} current affairs edition covers ${totalTopics} topics across ${data.sections.length} UPSC-relevant sections including National News, International Relations, Economy, Environment, Science & Technology, Government Schemes, Important Reports, Awards & Honours, Appointments, Obituaries, and Sports.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I download the ${data.month} ${data.year} current affairs PDF?`,
        acceptedAnswer: { "@type": "Answer", text: "Yes, it is available as a free downloadable PDF from the Current Affairs download page." },
      },
      {
        "@type": "Question",
        name: `Does the ${data.month} ${data.year} edition include a quiz?`,
        acceptedAnswer: { "@type": "Answer", text: "Yes, it includes an interactive quiz feature that generates practice questions with instant explanations." },
      },
    ],
  };

  const otherEditions = editionLinks.filter((e) => e.slug !== month);

  return (
    <BrandShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pt-28 sm:pt-32">
        <header className="mx-auto max-w-[1120px] px-6 pb-12">
          <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/current-affairs" className="hover:text-[var(--ink)]">Current Affairs</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">{data.month} {data.year}</span>
          </nav>
          <h1 className="t-display mt-8 text-h1">
            {data.month} {data.year}
          </h1>
          <p className="mt-2 text-s font-bold text-[var(--muted)]">Monthly Edition</p>
          <p className="mt-4 max-w-xl text-m leading-[1.6] text-[var(--ink-2)]">
            UPSC Monthly Current Affairs — {data.sections.length} sections, {totalTopics} topics. Each topic includes key facts, data points, and context structured for quick revision.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={`/api/generate-current-affairs?month=${month}`} className="btn btn-blue">
              Download PDF <span className="knob">↓</span>
            </Link>
            <Link href="/store" className="btn btn-paper">
              Browse Store
            </Link>
            <a href="https://t.me/+2eV0YCTGdNcyNmFl" target="_blank" rel="noopener noreferrer" className="btn btn-paper">
              Telegram
            </a>
          </div>
        </header>
      </div>

      <CurrentAffairsClient slug={month} />

      <section className="mx-auto max-w-[1120px] px-6 pb-24">
        <div className="rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2)] sm:p-8">
          <h2 className="text-m font-bold">More Resources for UPSC Preparation</h2>
          <div className="mt-4 grid gap-2 text-s sm:grid-cols-2">
            {[
              ...otherEditions.map((e) => ({ href: `/current-affairs/${e.slug}`, label: `${e.label} Edition` })),
              { href: "/current-affairs/2025", label: "2025 Yearly Compilation — All 12 Months" },
              { href: "/current-affairs/download", label: "Download Current Affairs PDFs" },
              { href: "/toppers", label: "Topper Strategies & Marks" },
              { href: "/store", label: "Premium Notes & Test Series" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-[12px] bg-[var(--canvas)] px-4 py-3 text-[var(--ink-2)] hover:text-[var(--ink)]">
                {l.label} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="current-affairs-month" />
      </div>
    </BrandShell>
  );
}
