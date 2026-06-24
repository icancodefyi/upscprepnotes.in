import type { Metadata } from "next";
import Link from "next/link";

import { getFeaturedToppers } from "@/services/topper.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { topperImageSrc } from "@/lib/utils";
import {
  Trophy,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Target,
  Award,
} from "lucide-react";

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

const IBEC_STEPS = [
  {
    letter: "I",
    title: "Introductions",
    points: [
      "Start with clear, focused introductions for strong impact",
      "Use quotes or data to set context quickly",
      "Align introductions precisely with the question's demand",
    ],
  },
  {
    letter: "B",
    title: "Body",
    points: [
      "Write concise, direct answers without extra details",
      "Use tables, diagrams, and bullet points for clarity",
      "Include relevant facts, examples, and visuals effectively",
    ],
  },
  {
    letter: "E",
    title: "Enhancements",
    points: [
      "Use quick diagrams and maps to boost answers",
      "Recycle points for multidimensional coverage",
      "Integrate perspectives from multiple subjects easily",
    ],
  },
  {
    letter: "C",
    title: "Conclusions",
    points: [
      "Summarize key points without repeating content",
      "End with solutions or forward-looking statements",
      "Keep conclusions concise and impactful",
    ],
  },
];

const PAPER_BENEFITS = [
  {
    paper: "GS1",
    highlights: [
      "Maps & diagrams in answers",
      "Visual storytelling techniques",
      "Micro-diagrams for complex topics",
    ],
  },
  {
    paper: "GS2",
    highlights: [
      "Policy-based crisp answers",
      "Real-world case studies",
      "Tabular data presentation",
    ],
  },
  {
    paper: "GS3",
    highlights: [
      "Argument & counter-argument",
      "Data-driven answers",
      "Current affairs integration",
    ],
  },
  {
    paper: "GS4",
    highlights: [
      "Stakeholder approach",
      "Ethical frameworks",
      "Case study structure",
    ],
  },
  {
    paper: "Essay",
    highlights: [
      "Brainstorming techniques",
      "Connecting phrases",
      "Multi-dimensional essays",
    ],
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
      <div className="mx-auto max-w-7xl px-4 pb-32">
        {/* HERO */}
        <section className="pt-16 pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C4F9D7] text-black border border-black rounded-full text-xs font-bold tracking-wider uppercase mb-6">
              <Sparkles size={12} />
              Topper Answer Copies
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              Score 120+ Marks
              <br />
              <span className="text-gray-500">
                in Each GS Paper
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
              39 premium UPSC products — notes bundles, test series, teacher materials, and original compilations starting at ₹99.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg">
              <Link data-track="home-hero-cta" href="/store">
                Browse the Store &rarr;
              </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link data-track="home-hero-secondary" href="/year/2025">
                Browse Toppers
              </Link>
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span data-track="home-price-badge" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span>39 Products</span>
              </span>
              <span className="text-xs text-gray-400">Notes, Test Series, Teacher Materials & More</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-gray-400">
              <span>Instant Digital Access</span>
              <span className="text-gray-300">·</span>
              <span>Verified Copies</span>
              <span className="text-gray-300">·</span>
              <span>Lifetime Updates</span>
              <span className="text-gray-300">·</span>
              <span>PDF Format</span>
            </div>
          </div>

          {/* BENEFIT CARDS */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Get answer copies of toppers in each paper (Verified Only)",
              "Handwritten Answers from 20+ toppers",
              "Includes Micro-diagrams, Data, Facts, Examples",
              "All GS Papers — GS1, GS2, GS3, GS4 & Essay Covered",
            ].map((text) => (
              <div key={text} className="bg-white border-2 border-gray-200 p-5 hover:border-black transition-all">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[#C4F9D7] font-bold">&#10003;</span>
                  <p className="text-sm leading-6 text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* STORE CATEGORIES */}
        <section className="mb-20">
          <div className="mb-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gray-400">
              Premium Store
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Curated UPSC Products
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              39 products across 5 categories — all verified, organized, and ready to download instantly.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/store"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white transition hover:shadow-lg hover:scale-[1.02]"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">10 Products</p>
              <h3 className="mt-2 text-lg font-bold">Notes Bundles</h3>
              <p className="mt-1 text-sm text-white/80">GS1-4, Polity, History, Ethics, Geography & more</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                Browse Notes <ArrowRight size={13} />
              </span>
            </Link>
            <Link
              href="/store"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white transition hover:shadow-lg hover:scale-[1.02]"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">9 Products</p>
              <h3 className="mt-2 text-lg font-bold">By Teachers</h3>
              <p className="mt-1 text-sm text-white/80">Mrunal, Satyam Gandhi, Madhav, Antriksh & more</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                Browse Teachers <ArrowRight size={13} />
              </span>
            </Link>
            <Link
              href="/store"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-white transition hover:shadow-lg hover:scale-[1.02]"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">8 Products</p>
              <h3 className="mt-2 text-lg font-bold">Test Series</h3>
              <p className="mt-1 text-sm text-white/80">VisionIAS, OnlyIAS, IAS BABA, VP 2026 & more</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                Browse Tests <ArrowRight size={13} />
              </span>
            </Link>
            <Link
              href="/store"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 p-6 text-white transition hover:shadow-lg hover:scale-[1.02]"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">5 Products</p>
              <h3 className="mt-2 text-lg font-bold">Originals</h3>
              <p className="mt-1 text-sm text-white/80">Strategy reports, answer copies & combo bundles</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                Browse Originals <ArrowRight size={13} />
              </span>
            </Link>
            <Link
              href="/store"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 p-6 text-white transition hover:shadow-lg hover:scale-[1.02]"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">2 Products</p>
              <h3 className="mt-2 text-lg font-bold">Optionals</h3>
              <p className="mt-1 text-sm text-white/80">Geography & Anthropology complete bundles</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                Browse Optionals <ArrowRight size={13} />
              </span>
            </Link>
            <Link
              href="/store"
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 p-6 text-gray-400 transition hover:border-gray-300 hover:text-gray-600"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest">View All</p>
              <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-black">All 39 Products</h3>
              <p className="mt-1 text-sm">Starting at ₹99 — instant PDF delivery</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold group-hover:text-black transition-colors">
                Visit Store <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </section>

        {/* QUICK LINKS GRID */}
        <section className="mb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link data-track="home-card-upsc-toppers"
              href="/year/2025"
              className="group bg-white border-2 border-gray-200 p-6 hover:border-black transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-10 h-10 text-[#FFD700]" />
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold mb-2">UPSC Toppers</h3>
              <p className="text-sm text-gray-500">
                Strategies, marks breakdowns, and insights from 280+ successful candidates.
              </p>
            </Link>

            <Link data-track="home-quick-link"
              href="/store"
              className="group bg-white border-2 border-gray-200 p-6 hover:border-black transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-10 h-10 text-[#C4F9D7]" />
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Store</h3>
              <p className="text-sm text-gray-500">
                39 curated products — notes bundles, test series, optionals, and teacher materials.
              </p>
            </Link>

            <Link data-track="home-card-optional-subjects"
              href="/optional/psir"
              className="group bg-white border-2 border-gray-200 p-6 hover:border-black transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-10 h-10 text-[#D8D4FF]" />
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold mb-2">Optional Subjects</h3>
              <p className="text-sm text-gray-500">
                Score trends, topper strategies, and performance analysis for 18 subjects.
              </p>
            </Link>

            <Link data-track="home-card-ask-ai"
              href="/ask"
              className="group bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white p-6 hover:from-black hover:to-[#1A1A1A] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="w-10 h-10 text-[#C4F9D7]" />
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">Ask AI</h3>
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">New</span>
              </div>
              <p className="text-sm text-gray-400">
                Get instant answers about any topper&apos;s strategy and preparation approach.
              </p>
            </Link>
          </div>
        </section>

        {/* FREE STUDY MATERIALS */}
        <section className="mb-20 border-t border-gray-200 pt-12 md:pt-16">
          <div className="mb-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gray-400">
              Free Resources
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              2,700+ Free Study Resources
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">
              Download test series, notes, books, magazines, and current affairs compilations from top UPSC coaching institutes — all free.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link data-track="home-free-test-series"
              href="/free-materials?category=test-series"
              className="group bg-white border-2 border-gray-200 p-6 hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📝</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  2,354 items
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Test Series</h3>
              <p className="text-sm text-gray-500">
                Vision IAS, Forum IAS, Insights IAS, Shankar IAS — prelims and mains papers with solutions.
              </p>
            </Link>

            <Link data-track="home-free-notes-material"
              href="/free-materials?category=notes"
              className="group bg-white border-2 border-gray-200 p-6 hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📓</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  204 items
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Notes &amp; Material</h3>
              <p className="text-sm text-gray-500">
                Drishti IAS, MK Yadav, Forum IAS Ethics — handwritten and compiled notes for quick revision.
              </p>
            </Link>

            <Link data-track="home-free-magazines-current-affairs"
              href="/free-materials?category=magazines"
              className="group bg-white border-2 border-gray-200 p-6 hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📰</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  167 items
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Magazines &amp; Current Affairs</h3>
              <p className="text-sm text-gray-500">
                Yojana, Kurukshetra, Vision IAS Monthly, daily and yearly current affairs compilations.
              </p>
            </Link>
          </div>

          <div className="mt-6">
            <Link data-track="home-browse-free-materials"
              href="/free-materials"
              className="text-sm font-medium text-emerald-700 underline underline-offset-4 hover:text-emerald-600 transition-colors"
            >
              Browse all free study materials &rarr;
            </Link>
          </div>
        </section>

        {/* IBEC METHOD */}
        <section className="mb-20 border-t border-gray-200 pt-12 md:pt-16">
          <div className="mb-10">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gray-400">
              The Framework
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What Is the IBEC Method?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              A proven answer-writing framework used by top 1% scorers. Four
              stages that transform average answers into high-scoring responses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {IBEC_STEPS.map((step) => (
              <div key={step.letter} className="bg-white border-2 border-gray-200 p-6 md:p-8 hover:border-black transition-all">
                <div className="mb-5 flex h-12 w-12 items-center justify-center bg-black text-xl font-bold text-white">
                  {step.letter}
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Learn the Perfect {step.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-6 text-gray-500"
                    >
                      <span className="mt-0.5 shrink-0 text-[#C4F9D7] font-bold">&#10003;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full px-8">
              <Link data-track="home-ibec-cta" href="/store">
                Browse Products &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* FEATURED TOPPERS */}
        <section className="mb-20 border-t border-gray-200 pt-12 md:pt-16">
          <div className="mb-10">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gray-400">
              Featured Toppers
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Learn from the Best
            </h2>
          </div>

          <div className="grid gap-3">
            {toppers.slice(0, 6).map((topper: any) => (
              <Link data-track={`home-topper-${topper.slug}`}
                key={topper.slug}
                href={`/upsc-topper/${topper.slug}`}
                className="flex items-center gap-4 bg-white border-2 border-gray-200 px-4 py-4 hover:border-black transition-all md:gap-6 md:px-6"
              >
                <img
                  src={topperImageSrc(topper)}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  className="h-12 w-12 shrink-0 rounded-xl border-2 border-gray-200 bg-white md:h-14 md:w-14"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold md:text-xl">
                      {topper.firstName} {topper.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      AIR {topper.rank} &middot; {topper.year}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {topper.optionalSubject} &middot; Total {topper.marks.total}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm text-gray-500 md:block">
                  View Profile &rarr;
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link data-track="home-browse-toppers"
              href="/year/2025"
              className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-500 transition-colors"
            >
              Browse all 280+ topper profiles &rarr;
            </Link>
          </div>
        </section>

        {/* PAPER-WISE BREAKDOWN */}
        <section className="mb-20 border-t border-gray-200 pt-12 md:pt-16">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gray-400">
              Paper-wise Expertise
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What Each Paper Covers
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PAPER_BENEFITS.map((p) => (
              <div key={p.paper} className="bg-white border-2 border-gray-200 p-6 md:p-8 hover:border-black transition-all">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C4F9D7] text-black border border-black rounded-full text-xs font-bold tracking-wider uppercase mb-4">
                  {p.paper}
                </div>
                <ul className="space-y-4">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm leading-6 text-gray-500"
                    >
                      <span className="mt-0.5 shrink-0 text-[#C4F9D7] font-bold">&#10003;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full px-8">
              <Link data-track="home-expertise-cta" href="/store">
                Browse Store &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* BROWSE TOPPERS BY YEAR */}
        <section className="mb-20 border-t border-gray-200 pt-12 md:pt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse Toppers by Year
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Explore structured profiles of 280+ UPSC toppers. Filter by rank,
              year, or subject.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {YEARS.map((year) => (
              <Link data-track={`home-year-${year}`}
                key={year}
                href={`/year/${year}`}
                className="inline-flex items-center px-5 py-2.5 border-2 border-gray-200 text-sm font-medium hover:border-black transition-all bg-white"
              >
                {year}
              </Link>
            ))}
            <Button asChild className="rounded-full">
              <Link data-track="home-view-all-toppers" href="/year/2025">View All Toppers &rarr;</Link>
            </Button>
          </div>
        </section>

        {/* OPTIONAL SUBJECTS */}
        <section className="mb-20 border-t border-gray-200 pt-12 md:pt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Optional Subjects
            </h2>
          </div>

          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            {OPTIONAL_SUBJECTS.map((subject) => (
              <Link data-track={`home-optional-${subject.toLowerCase().replace(/\s+/g, '-')}`}
                key={subject}
                href={`/optional/${subject.toLowerCase()}`}
                className="group border-b border-gray-200 pb-5 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight transition group-hover:translate-x-1">
                    {subject}
                  </h3>
                  <span className="text-gray-400 transition group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Topper strategies, score trends, and performance analysis for{" "}
                  {subject}.
                </p>
              </Link>
            ))}
          </div>
        </section>





      </div>
    </main>
    </>
  );
}
