import type { Metadata } from "next";
import Link from "next/link";
import upscFullForm from "@/data/content/upsc-full-form";
import upscSyllabus from "@/data/content/upsc-syllabus";
import upscFreeMaterial from "@/data/content/upsc-free-material";
import upscFullFormHindi from "@/data/content/upsc-full-form-hindi";
import answerWriting from "@/data/content/how-to-write-upsc-mains-answers";
import bestCoaching from "@/data/content/best-upsc-coaching-2027";
import BrandShell from "@/components/brand/BrandShell";
import Outline from "@/components/brand/Outline";
import QuizTeaser from "@/components/quiz/QuizTeaser";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export const metadata: Metadata = {
  title: "UPSC Resources — Full Form, Syllabus, Free Material & More",
  description:
    "Browse all UPSCPrepNotes resources: UPSC full form, complete syllabus, free study material (280+ topper profiles, PYQs, AI tutor), and Hindi guides.",
  alternates: {
    canonical: "https://upscprepnotes.in/resources",
  },
  openGraph: {
    title: "UPSC Resources — Full Form, Syllabus & Free Material",
    description:
      "Browse all UPSCPrepNotes resources: UPSC full form, complete syllabus, free study material, 280+ topper profiles, PYQs, AI tutor, and Hindi guides.",
    url: "https://upscprepnotes.in/resources",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

const resources = [
  {
    ...upscFullForm,
    badge: "Guide",
    readTime: "4 min",
  },
  {
    ...upscSyllabus,
    badge: "Syllabus",
    readTime: "7 min",
  },
  {
    ...upscFreeMaterial,
    badge: "Resources",
    readTime: "5 min",
  },
  {
    ...upscFullFormHindi,
    badge: "हिंदी",
    readTime: "5 min",
  },
  {
    ...answerWriting,
    badge: "Guide",
    readTime: "8 min",
  },
  {
    ...bestCoaching,
    badge: "Guide",
    readTime: "20 min",
  },
  {
    slug: "how-to-score-130-plus-in-gs1",
    h1: "How to Score 130+ in GS Paper 1",
    description: "Data-driven GS1 strategy with actual topper marks — history, geography, society, and culture breakdown across 50 indexed profiles.",
    badge: "Strategy",
    readTime: "3 min",
  },
  {
    slug: "how-to-score-120-plus-in-gs2",
    h1: "How to Score 120+ in GS Paper 2",
    description: "GS2 marks analysis from 50 toppers — governance, constitution, polity, and social justice with score distributions and section-wise strategy.",
    badge: "Strategy",
    readTime: "3 min",
  },
];

export default async function ResourcesPage() {
  return (
    <BrandShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
          <Link href="/" data-track="resources-breadcrumb-home" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">Resources</span>
        </nav>

        <h1 className="t-display mt-8 text-h1">All UPSC Resources</h1>
        <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
          Everything we&apos;ve built to help you crack the UPSC Civil Services Examination — from understanding the basics to mastering answer writing.
        </p>

        <div className="mt-12 grid gap-3">
          {resources.map((r) => (
            <Link key={r.slug} href={`/content/${r.slug}`} data-track={`resources-card-${r.slug}`} className={`${card} group flex items-start justify-between gap-4 p-6 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--canvas)] px-2.5 py-0.5 text-s font-bold text-[var(--ink-2)]">{r.badge}</span>
                  <span className="text-s text-[var(--muted)]">{r.readTime}</span>
                </div>
                <h2 className="mt-3 text-m font-bold group-hover:text-[var(--accent)]">{r.h1}</h2>
                <p className="mt-1 text-s leading-[1.55] text-[var(--ink-2)]">{r.description}</p>
              </div>
              <span aria-hidden className="mt-1 text-m text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]">→</span>
            </Link>
          ))}
        </div>

        {/* Bonus section */}
        <section className="relative mt-14 overflow-hidden rounded-[24px] bg-[#e9edff] p-6 sm:p-8">
          <Outline kind="book" className="-right-6 -top-6 h-40 w-56 rotate-[10deg] text-[var(--accent)]/[0.10]" />
          <h2 className="t-head relative text-l">Not What You&apos;re Looking For?</h2>
          <p className="relative mt-2 text-m leading-[1.6] text-[var(--ink-2)]">
            These pages cover fundamentals and free resources. If you&apos;re ready to practice with actual topper answer copies, check out the compilation.
          </p>
          <div className="relative mt-6 flex flex-wrap gap-2">
            <Link href="/free-materials" data-track="resources-free-materials" className="btn btn-blue h-11 px-5 [--btn-fs:14px]">Free Study Material →</Link>
            <Link href="/toppers" data-track="resources-browse-toppers" className="btn btn-ink h-11 px-5 [--btn-fs:14px]">Browse Toppers →</Link>
            <Link href="/store" data-track="resources-view-bundle" className="btn btn-paper h-11 px-5 [--btn-fs:14px]">Browse Store →</Link>
            <Link href="/pyq" data-track="resources-pyq-archive" className="btn btn-paper h-11 px-5 [--btn-fs:14px]">PYQ Archive →</Link>
          </div>
        </section>
      </div>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="resources" />
      </div>
    </BrandShell>
  );
}
