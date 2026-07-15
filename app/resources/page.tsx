import type { Metadata } from "next";
import Link from "next/link";
import upscFullForm from "@/data/content/upsc-full-form";
import upscSyllabus from "@/data/content/upsc-syllabus";
import upscFreeMaterial from "@/data/content/upsc-free-material";
import upscFullFormHindi from "@/data/content/upsc-full-form-hindi";
import answerWriting from "@/data/content/how-to-write-upsc-mains-answers";
import { ArrowRight } from "lucide-react";

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

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link href="/" data-track="resources-breadcrumb-home" className="hover:text-muted-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">Resources</span>
        </nav>

        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
          All UPSC Resources
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Everything we&apos;ve built to help you crack the UPSC Civil Services Examination — from understanding the basics to mastering answer writing.
        </p>

        <div className="mt-12 grid gap-6">
          {resources.map((r) => (
            <Link
              key={r.slug}
              href={`/content/${r.slug}`}
              data-track={`resources-card-${r.slug}`}
              className="group rounded-2xl border border-border p-6 transition-all hover:border-brand/20 hover:bg-brand-muted"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full bg-secondary px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {r.badge}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{r.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                    {r.h1}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {r.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 group-hover:text-brand transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bonus section */}
        <section className="mt-16 rounded-2xl border border-border bg-brand-muted p-6 sm:p-8">
          <h2 className="text-xl font-bold text-foreground">Not What You&apos;re Looking For?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These pages cover fundamentals and free resources. If you&apos;re ready to practice with actual topper answer copies, check out the compilation.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/free-materials"
              data-track="resources-free-materials"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-500"
            >
              Free Study Material <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/toppers"
              data-track="resources-browse-toppers"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
            >
              Browse Toppers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/store"
              data-track="resources-view-bundle"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-muted px-5 py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-brand-muted"
            >
              Browse Store <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pyq"
              data-track="resources-pyq-archive"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:border-gray-400"
            >
              PYQ Archive <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
