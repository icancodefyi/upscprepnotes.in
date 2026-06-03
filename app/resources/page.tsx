import type { Metadata } from "next";
import Link from "next/link";
import upscFullForm from "@/data/content/upsc-full-form";
import upscSyllabus from "@/data/content/upsc-syllabus";
import upscFreeMaterial from "@/data/content/upsc-free-material";
import upscFullFormHindi from "@/data/content/upsc-full-form-hindi";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "UPSC Resources — Full Form, Syllabus, Free Material & More",
  description:
    "Browse all UPSCPrepNotes resources: UPSC full form, complete syllabus, free study material (280+ topper profiles, PYQs, AI tutor), and Hindi guides.",
  alternates: {
    canonical: "https://upscprepnotes.in/resources",
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
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <nav className="mb-8 text-xs text-gray-400">
          <Link href="/" data-track="resources-breadcrumb-home" className="hover:text-gray-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">Resources</span>
        </nav>

        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl">
          All UPSC Resources
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Everything we&apos;ve built to help you crack the UPSC Civil Services Examination — from understanding the basics to mastering answer writing.
        </p>

        <div className="mt-12 grid gap-6">
          {resources.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.slug}`}
              data-track={`resources-card-${r.slug}`}
              className="group rounded-2xl border border-gray-200 p-6 transition-all hover:border-emerald-200 hover:bg-emerald-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      {r.badge}
                    </span>
                    <span className="text-[11px] text-gray-400">{r.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {r.h1}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-gray-500">
                    {r.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 group-hover:text-emerald-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bonus section */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">Not What You&apos;re Looking For?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            These pages cover fundamentals and free resources. If you&apos;re ready to practice with actual topper answer copies, check out the bundle.
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
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
            >
              Browse Toppers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/toppers/toppers-copy-compilation"
              data-track="resources-view-bundle"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              View Bundle <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pyq"
              data-track="resources-pyq-archive"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 transition-colors hover:border-gray-400"
            >
              PYQ Archive <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
