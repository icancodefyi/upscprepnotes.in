import type { Metadata } from "next";
import Link from "next/link";

import { getFeaturedToppers } from "@/services/topper.service";
import { Button } from "@/components/ui/button";
import { topperImageSrc } from "@/lib/utils";
import { PRODUCTS } from "@/lib/store-products";
import {
  ArrowRight,
  Brain,
  Newspaper,
  BookOpen,
  Database,
  FileQuestion,
  FileText,
} from "lucide-react";
import HeroLeadForm from "@/components/hero/HeroLeadForm";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides for UPSC CSE",
  description:
    "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, marks breakdowns, optional subject analysis, an AI mentor for prep guidance, and a curated store — all in one platform.",
  openGraph: {
    title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides",
    description:
      "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, marks breakdowns, optional subject analysis, an AI mentor for prep guidance, and a curated store.",
    url: "https://upscprepnotes.in",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides",
    description:
      "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, optional analysis, and an AI mentor.",
  },
  alternates: {
    canonical: "https://upscprepnotes.in",
  },
};

const OPTIONAL_SUBJECTS = [
  "PSIR",
  "Anthropology",
  "Sociology",
  "Mathematics",
  "Geography",
  "History",
  "Public Administration",
  "Philosophy",
];

const YEARS = [2022, 2023, 2024, 2025];

const PLATFORM_FEATURES = [
  {
    icon: Brain,
    title: "Ask AI Mentor",
    desc: "Get instant answers about any topper's strategy, marks, or preparation approach.",
    href: "/ask",
    dark: true,
    badge: "New",
  },
  {
    icon: Database,
    title: "Marks Database",
    desc: "Paper-wise marks breakdown for 271 toppers — compare scores across years and optionals.",
    href: "/toppers/marks-database",
  },
  {
    icon: FileText,
    title: "Answer Copies",
    desc: "50+ actual handwritten answer sheets from rank holders. See real structure and diagrams.",
    href: "/toppers/toppers-copy-compilation",
  },
  {
    icon: Newspaper,
    title: "Current Affairs",
    desc: "Monthly current affairs compilations — 55 topics across 11 sections, every month.",
    href: "/current-affairs",
  },
  {
    icon: BookOpen,
    title: "Free Materials",
    desc: "2,700+ free test series, notes, and magazines from top coaching institutes.",
    href: "/free-materials",
  },
  {
    icon: FileQuestion,
    title: "Previous Year Questions",
    desc: "PYQs organized by year and paper with topic analysis and answer patterns.",
    href: "/pyq",
  },
];

export default async function HomePage() {
  const toppers = await getFeaturedToppers();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ verified handwritten answer copies, marks breakdowns, optional subject analysis, and AI-powered preparation insights.",
    url: "https://upscprepnotes.in",
    publisher: {
      "@type": "Organization",
      name: "UPSCPrepNotes",
      url: "https://upscprepnotes.in",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <main className="min-h-screen bg-[#F8F9FA]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gray-200">
          <div
    className="pointer-events-none absolute inset-0 opacity-50"
    style={{
      backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    }}
  />
          <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
              {/* LEFT */}
              <div className="lg:col-span-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300">01</span>
                  <span className="h-px w-8 bg-gray-300" />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                    UPSC Intelligence Database
                  </span>
                </div>
                <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.25rem]">
                  What separates{" "}
                  <span className="italic font-light text-gray-400">rank holders</span>
                  <br />
                  from the rest?
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
                  <span className="font-semibold text-black">271 verified profiles.</span>{" "}
                  37 optional subjects. Every mark manually extracted from UPSC&apos;s official result PDFs — free to explore.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-full bg-black px-8 shadow-lg hover:bg-gray-800">
                    <Link data-track="home-hero-cta" href="/year/2025">
                      Browse Free Profiles <ArrowRight size={16} className="ml-1 inline" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                    <Link data-track="home-hero-secondary" href="/store">
                      Visit Store
                    </Link>
                  </Button>
                </div>
                <HeroLeadForm />
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-200 pt-6">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verified from UPSC.gov.in
                  </span>
                  <span className="text-sm text-gray-500">Built by Zaid Rakhange</span>
                  <span className="text-sm text-gray-500">Free to explore</span>
                </div>
              </div>

              {/* RIGHT: Featured topper data card */}
              <div className="lg:col-span-5">
                {toppers[0] && (
                  <div className="relative">
                    <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl bg-[#C4F9D7]" />
                    <div className="relative rounded-2xl border-2 border-black bg-white p-6 shadow-xl">
                      <Link href={`/upsc-topper/${toppers[0].slug}`} data-track="home-hero-topper-card" className="flex items-center gap-4">
                        <img
                          src={topperImageSrc(toppers[0])}
                          alt={`${toppers[0].firstName} ${toppers[0].lastName}`}
                          className="h-14 w-14 rounded-xl border-2 border-gray-200 bg-white"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-bold leading-tight">
                            {toppers[0].firstName} {toppers[0].lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            AIR {toppers[0].rank} &middot; {toppers[0].year}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#C4F9D7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-black">
                          Verified
                        </span>
                      </Link>

                      <div className="mt-5 flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-[11px] uppercase tracking-wider text-gray-400">Optional Subject</span>
                        <span className="text-sm font-semibold">{toppers[0].optionalSubject}</span>
                      </div>

                      <div className="mt-4">
                        <p className="mb-3 text-[11px] uppercase tracking-wider text-gray-400">Marks Breakdown</p>
                        <div className="space-y-2.5">
                          {[
                            { label: "Essay", val: toppers[0].marks.essay, max: 250 },
                            { label: "GS1", val: toppers[0].marks.gs1, max: 250 },
                            { label: "GS2", val: toppers[0].marks.gs2, max: 250 },
                            { label: "GS3", val: toppers[0].marks.gs3, max: 250 },
                            { label: "GS4", val: toppers[0].marks.gs4, max: 250 },
                            { label: "Optional", val: toppers[0].marks.optional1 + toppers[0].marks.optional2, max: 500 },
                            { label: "Interview", val: toppers[0].marks.interview, max: 275 },
                          ].map((p) => (
                            <div key={p.label} className="flex items-center gap-3">
                              <span className="w-12 text-xs text-gray-500">{p.label}</span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-emerald-500"
                                  style={{ width: `${Math.min((p.val / p.max) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-xs font-semibold">{p.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
                        <span className="text-sm font-semibold">Total Score</span>
                        <span className="text-3xl font-bold tracking-tight">{toppers[0].marks.total}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <span className="text-emerald-500 font-bold">&#10003;</span>
                          Source: UPSC.gov.in
                        </span>
                        <Link href={`/upsc-topper/${toppers[0].slug}`} data-track="home-hero-topper-link" className="font-medium text-black underline underline-offset-2 hover:text-gray-600">
                          View profile &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

<div className="mx-auto max-w-7xl px-4 pb-32">

        {/* FEATURED TOPPERS */}
        <section className="mb-24 pt-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300">02</span>
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              Featured Toppers
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Real rank holders.{" "}
            <span className="italic font-light text-gray-400">Real marks.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Every profile is built from UPSC&apos;s official result PDFs — marks, optionals, and strategies manually verified.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toppers.slice(0, 6).map((topper: any) => (
              <Link
                data-track={`home-topper-${topper.slug}`}
                key={topper.slug}
                href={`/upsc-topper/${topper.slug}`}
                className="group bg-white border-2 border-gray-200 p-5 hover:border-black transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={topperImageSrc(topper)}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="h-12 w-12 shrink-0 rounded-xl border-2 border-gray-200 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold">
                      {topper.firstName} {topper.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      AIR {topper.rank} &middot; {topper.year}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500">{topper.optionalSubject}</span>
                  <span className="text-lg font-bold tracking-tight">{topper.marks.total}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min((topper.marks.total / 2050) * 100, 100)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-400">Browse by year:</span>
            {YEARS.map((year) => (
              <Link
                data-track={`home-year-${year}`}
                key={year}
                href={`/year/${year}`}
                className="inline-flex items-center px-4 py-2 border-2 border-gray-200 text-sm font-medium hover:border-black transition-all bg-white"
              >
                {year}
              </Link>
            ))}
            <Link
              data-track="home-browse-toppers"
              href="/year/2025"
              className="ml-auto text-sm font-medium text-black underline underline-offset-4 hover:text-gray-500 transition-colors"
            >
              Browse all 280+ profiles &rarr;
            </Link>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section className="mb-24 border-t border-gray-200 pt-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300">03</span>
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              Explore the Platform
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need,{" "}
            <span className="italic font-light text-gray-400">in one place.</span>
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_FEATURES.map((feat) => {
              const Icon = feat.icon;
              if (feat.dark) {
                return (
                  <Link
                    data-track={`home-feature-${feat.title.toLowerCase().replace(/\s+/g, "-")}`}
                    key={feat.title}
                    href={feat.href}
                    className="group bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-6 hover:from-black hover:to-[#1A1A1A] transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-[#C4F9D7]" />
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                      {feat.badge && (
                        <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                          {feat.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{feat.desc}</p>
                  </Link>
                );
              }
              return (
                <Link
                  data-track={`home-feature-${feat.title.toLowerCase().replace(/\s+/g, "-")}`}
                  key={feat.title}
                  href={feat.href}
                  className="group bg-white border-2 border-gray-200 p-6 hover:border-black transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-black" />
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500">{feat.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* STORE PRODUCTS */}
        <section className="mb-24 border-t border-gray-200 pt-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300">04</span>
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              Premium Store
            </span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Curated products,{" "}
              <span className="italic font-light text-gray-400">starting at ₹99.</span>
            </h2>
            <Link
              data-track="home-store-link"
              href="/store"
              className="hidden shrink-0 text-sm font-medium text-black underline underline-offset-4 hover:text-gray-500 transition-colors md:block"
            >
              View all products &rarr;
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.slice(0, 4).map((product) => (
              <Link
                data-track={`home-product-${product.slug}`}
                key={product.slug}
                href={`/store/${product.slug}`}
                className="group bg-white border-2 border-gray-200 hover:border-black transition-all flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-gray-200 bg-gray-50">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                  {product.badge && (
                    <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-black ${
                      product.badgeColor === "emerald" ? "bg-[#C4F9D7] text-black" :
                      product.badgeColor === "amber" ? "bg-amber-100 text-amber-900" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-bold leading-tight">{product.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">{product.tagline}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <span className="text-amber-500">&#9733;</span>
                      <span>{product.rating}</span>
                      <span className="text-gray-300">({product.reviewCount})</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              data-track="home-store-link-mobile"
              href="/store"
              className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-500 transition-colors md:hidden"
            >
              View all products &rarr;
            </Link>
          </div>
        </section>

        {/* OPTIONAL SUBJECTS */}
        <section className="mb-24 border-t border-gray-200 pt-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300">05</span>
            <span className="h-px w-8 bg-gray-300" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              Optional Subjects
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Compare scores across{" "}
            <span className="italic font-light text-gray-400">37 optionals.</span>
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OPTIONAL_SUBJECTS.map((subject) => (
              <Link
                data-track={`home-optional-${subject.toLowerCase().replace(/\s+/g, "-")}`}
                key={subject}
                href={`/optional/${subject.toLowerCase()}`}
                className="group bg-white border-2 border-gray-200 p-4 hover:border-black transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">{subject}</h3>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Score trends &amp; topper strategies
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="border-t border-gray-200 pt-16">
          <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-8 md:p-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C4F9D7] opacity-60" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#C4F9D7] opacity-40" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                  Built by Zaid Rakhange
                </span>
              </div>
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                Stop guessing.{" "}
                <span className="italic font-light text-gray-400">Start studying what works.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-gray-500">
                271 verified topper profiles. Every mark sourced from UPSC.gov.in. Free to explore — no signup required.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full bg-black px-8 shadow-lg hover:bg-gray-800">
                  <Link data-track="home-closing-cta" href="/year/2025">
                    Browse Free Profiles <ArrowRight size={16} className="ml-1 inline" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link data-track="home-closing-secondary" href="/store">
                    Visit Store
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}
