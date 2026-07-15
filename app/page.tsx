import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { getFeaturedToppers } from "@/services/topper.service";
import { Button } from "@/components/ui/button";
import { topperImageSrc } from "@/lib/utils";
import { PRODUCTS } from "@/lib/store-products";
import {
  ArrowRight,
  Brain,
  Database,
  FileText,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import HeroLeadForm from "@/components/hero/HeroLeadForm";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides for UPSC CSE",
  description:
    "Access 280+ UPSC topper profiles with verified marks, 50+ handwritten answer copies (GS1-4, Essay, Optional), optional subject analysis, AI mentor, and a curated store of strategy compilations.",
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
  "PSIR", "Anthropology", "Sociology", "Mathematics",
  "Geography", "History", "Public Administration", "Philosophy",
];

const YEARS = [2022, 2023, 2024, 2025];

const STRATEGY_GUIDES = [
  { title: "Score 130+ in GS1", desc: "Indian Society, History, and Geography — topper-backed strategies with real marks data.", href: "/content/how-to-score-130-plus-in-gs1", score: "130+", paper: "GS1" },
  { title: "Score 120+ in GS2", desc: "Polity, Governance, and Social Justice — framework-based answer writing.", href: "/content/how-to-score-120-plus-in-gs2", score: "120+", paper: "GS2" },
  { title: "Score 120+ in GS3", desc: "Economy, Agriculture, and Environment — data-driven answers with current affairs.", href: "/content/how-to-score-120-plus-in-gs3", score: "120+", paper: "GS3" },
  { title: "Score 100+ in GS4", desc: "Ethics, Integrity, and Case Studies — stakeholder analysis and ethical frameworks.", href: "/content/how-to-score-100-plus-in-gs4", score: "100+", paper: "GS4" },
  { title: "Score 300+ in PSIR Optional", desc: "Political Science & IR — complete strategy with topper marks and answer patterns.", href: "/content/how-to-score-300-plus-in-psir-optional", score: "300+", paper: "PSIR" },
  { title: "Optional Subject Marks Analysis", desc: "Which optionals score highest? Full ranking of 9 subjects with topper data.", href: "/content/upsc-optional-subject-marks-analysis", score: "Analysis", paper: "All" },
];

const FAQS = [
  { q: "Is UPSCPrepNotes free?", a: "Yes. All topper profiles, marks data, 2,700+ free PDFs, and the AI tutor are completely free. We charge only for premium strategy reports and answer copy compilations." },
  { q: "How is the topper data collected?", a: "Every mark is manually extracted from UPSC's official result PDFs on UPSC.gov.in. We verify each profile against the published gazette. Our dataset spans 2022-2025 with 271+ toppers." },
  { q: "Can I download answer copies?", a: "Free sample answer copies are available on many topper profiles. The full compilation (50+ toppers, all GS papers + essay) is available in the store." },
  { q: "How does the AI tutor work?", a: "Ask AI uses vector search over our topper strategy database to answer your UPSC questions with real, data-backed insights. Free tier: 20 queries/day." },
  { q: "Which optional subjects are covered?", a: "We cover 37 optional subjects with marks analysis, score trends, and topper profiles — including PSIR, Anthropology, Sociology, Geography, History, and more." },
  { q: "How often is the data updated?", a: "Topper profiles are updated within 2-4 weeks of UPSC results. Current affairs and free materials are updated weekly." },
];

export default async function HomePage() {
  const toppers = await getFeaturedToppers();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description: "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ verified handwritten answer copies, marks breakdowns, optional subject analysis, and AI-powered preparation insights.",
    url: "https://upscprepnotes.in",
    publisher: { "@type": "Organization", name: "UPSCPrepNotes", url: "https://upscprepnotes.in" },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" }] },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <main className="min-h-screen bg-background">

        {/* ──────────────────────────── HERO ──────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">

              {/* LEFT — headline + CTAs */}
              <div className="lg:col-span-7">
                <h1 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.75rem]">
                  Every mark. Every topper.
                  <br />
                  <span className="text-brand">Sourced from UPSC.gov.in.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  271 topper profiles with paper-wise marks breakdowns, 50+ handwritten answer copies, and an AI mentor trained on real topper strategies. All free.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-full bg-brand px-7 text-brand-foreground hover:bg-brand/90">
                    <Link data-track="home-hero-cta" href="/year/2025">
                      Explore topper profiles <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                    <Link data-track="home-hero-store" href="/store">
                      Browse store
                    </Link>
                  </Button>
                </div>
                <HeroLeadForm />
                <p className="mt-8 text-sm text-muted-foreground">
                  No signup required. Data sourced from official UPSC result PDFs.
                </p>
              </div>

              {/* RIGHT — live topper data card */}
              <div className="lg:col-span-5">
                {toppers[0] && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <Link href={`/upsc-topper/${toppers[0].slug}`} data-track="home-hero-topper-card" className="flex items-center gap-4">
                      <img
                        src={topperImageSrc(toppers[0])}
                        alt={`${toppers[0].firstName} ${toppers[0].lastName}`}
                        width={56} height={56}
                        className="h-14 w-14 rounded-xl border border-border bg-secondary object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold leading-tight">{toppers[0].firstName} {toppers[0].lastName}</p>
                        <p className="text-sm text-muted-foreground">AIR {toppers[0].rank} · {toppers[0].year}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">Verified</span>
                    </Link>

                    <div className="mt-5 flex items-center justify-between border-b border-border pb-3">
                      <span className="text-xs text-muted-foreground">Optional</span>
                      <span className="text-sm font-semibold">{toppers[0].optionalSubject}</span>
                    </div>

                    <div className="mt-4">
                      <p className="mb-3 text-xs text-muted-foreground">Marks breakdown</p>
                      <div className="space-y-2">
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
                            <span className="w-14 text-xs text-muted-foreground">{p.label}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                              <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min((p.val / p.max) * 100, 100)}%` }} />
                            </div>
                            <span className="w-9 text-right text-xs font-semibold tabular-nums">{p.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-2xl font-bold tabular-nums">{toppers[0].marks.total}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-brand font-bold">✓</span>
                        Source: UPSC.gov.in
                      </span>
                      <Link href={`/upsc-topper/${toppers[0].slug}`} data-track="home-hero-topper-link" className="font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground">
                        View profile →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────── FEATURED TOPPERS ────────────────────── */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                  More topper profiles
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Each profile includes paper-wise marks, optional subject, and strategy notes.
                </p>
              </div>
              <Link data-track="home-browse-toppers" href="/year/2025" className="hidden shrink-0 text-sm font-medium text-brand hover:text-brand/80 md:block">
                Browse all 271 →
              </Link>
            </div>

            {/* Compact topper grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {toppers.slice(1, 7).map((topper: any) => (
                <Link
                  data-track={`home-topper-${topper.slug}`}
                  key={topper.slug}
                  href={`/upsc-topper/${topper.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={topperImageSrc(topper)}
                      alt={`${topper.firstName} ${topper.lastName}`}
                      width={36} height={36}
                      loading="lazy"
                      className="h-9 w-9 rounded-lg border border-border bg-secondary object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{topper.firstName} {topper.lastName}</p>
                      <p className="text-xs text-muted-foreground">AIR {topper.rank} · {topper.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="truncate text-xs text-muted-foreground">{topper.optionalSubject}</span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-brand">{topper.marks.total}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Year filter */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Browse by year:</span>
              {YEARS.map((year) => (
                <Link
                  data-track={`home-year-${year}`}
                  key={year}
                  href={`/year/${year}`}
                  className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-secondary"
                >
                  {year}
                </Link>
              ))}
              <Link
                data-track="home-browse-toppers-mobile"
                href="/year/2025"
                className="ml-auto text-sm font-medium text-brand hover:text-brand/80 md:hidden"
              >
                Browse all →
              </Link>
            </div>
          </div>
        </section>

        {/* ──────────────────── PLATFORM FEATURES ─────────────────────── */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {/* AI Mentor — highlighted feature */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl bg-foreground p-8 text-background">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
                    <Brain className="h-5 w-5 text-brand-foreground" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">Ask AI Mentor</h3>
                  <p className="mt-2 text-sm leading-relaxed text-background/70">
                    Get instant answers about any topper's strategy, marks, or preparation approach. Trained on 271 verified profiles.
                  </p>
                  <Link
                    data-track="home-feature-ask-ai-mentor"
                    href="/ask"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand"
                  >
                    Try it free <ArrowRight size={14} />
                  </Link>
                  <p className="mt-3 text-xs text-background/50">20 queries/day free</p>
                </div>
              </div>

              {/* Other features — list format, not card grid */}
              <div className="lg:col-span-2">
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl mb-8">
                  Tools & resources
                </h2>
                <div className="divide-y divide-border">
                  {[
                    { icon: Database, title: "Marks Database", desc: "Paper-wise marks breakdown for 271 toppers — compare scores across years and optionals.", href: "/toppers/marks-database" },
                    { icon: FileText, title: "Answer Copies", desc: "50+ actual handwritten answer sheets from rank holders. See real structure and diagrams.", href: "/toppers/toppers-copy-compilation" },
                    { icon: FileText, title: "Current Affairs", desc: "Monthly compilations — 55 topics across 11 sections, every month.", href: "/current-affairs" },
                    { icon: FileText, title: "Free Materials", desc: "2,700+ free test series, notes, and magazines from top coaching institutes.", href: "/free-materials" },
                    { icon: FileText, title: "Previous Year Questions", desc: "PYQs organized by year and paper with topic analysis and answer patterns.", href: "/pyq" },
                  ].map((feat) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={feat.title}
                        href={feat.href}
                        data-track={`home-feature-${feat.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group flex items-center gap-5 py-5 transition-colors hover:bg-secondary/50 -mx-4 px-4 rounded-lg"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-brand">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold">{feat.title}</h3>
                          <p className="mt-0.5 text-sm text-muted-foreground">{feat.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────── STORE PRODUCTS ──────────────────────── */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                  Strategy guides
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Premium products starting at ₹99 — built from real topper data.
                </p>
              </div>
              <Link data-track="home-store-link" href="/store" className="hidden shrink-0 text-sm font-medium text-brand hover:text-brand/80 md:block">
                View all products →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.slice(0, 4).map((product) => (
                <Link
                  data-track={`home-product-${product.slug}`}
                  key={product.slug}
                  href={`/store/${product.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden border-b border-border bg-secondary">
                    {product.image && (
                      <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    )}
                    {product.badge && (
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        product.badgeColor === "emerald" ? "bg-brand-muted text-brand" :
                        product.badgeColor === "amber" ? "bg-brand-muted text-brand" :
                        "bg-secondary text-foreground"
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-bold leading-tight">{product.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 flex-1">{product.tagline}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-bold tabular-nums">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 md:hidden">
              <Link data-track="home-store-link-mobile" href="/store" className="text-sm font-medium text-brand hover:text-brand/80">
                View all products →
              </Link>
            </div>
          </div>
        </section>

        {/* ────────────────── OPTIONAL SUBJECTS + STRATEGY ────────────── */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Optional subjects — pill grid */}
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                  Optional subjects
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Compare scores, analyze trends, and find the best optional for your preparation.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {OPTIONAL_SUBJECTS.map((subject) => (
                    <Link
                      data-track={`home-optional-${subject.toLowerCase().replace(/\s+/g, "-")}`}
                      key={subject}
                      href={`/optional/${subject.toLowerCase()}`}
                      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all hover:border-foreground/20 hover:bg-secondary"
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
                      {subject}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Strategy guides — compact list */}
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                  Score targets
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Each guide breaks down what it takes to score in a specific paper.
                </p>
                <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
                  {STRATEGY_GUIDES.map((guide) => (
                    <Link
                      data-track={`home-guide-${guide.paper.toLowerCase()}`}
                      key={guide.paper}
                      href={guide.href}
                      className="group flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-xs font-bold text-brand">
                        {guide.paper}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-tight">{guide.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{guide.desc}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-brand">{guide.score}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link data-track="home-methodology-link" href="/content/data-methodology-and-editorial-standards" className="text-sm font-medium text-brand hover:text-brand/80">
                    Read our data methodology →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────── FAQ ──────────────────────────── */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              Frequently asked
            </h2>
            <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 list-none">
                    <h3 className="text-sm font-bold leading-tight">{faq.q}</h3>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-6">
              <Link data-track="home-faq-link" href="/faq" className="text-sm font-medium text-brand hover:text-brand/80">
                See all FAQs →
              </Link>
            </div>
          </div>
        </section>

        {/* ──────────────────────── ABOUT / FOUNDER ───────────────────── */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              Built by a software engineer, not a coaching institute.
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  I'm Zaid Rakhange — a software engineer fascinated by UPSC data. I manually extract every mark from UPSC's official result PDFs because I believe the best prep resources should be accurate, free, and built with care.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  No coaching institute agenda. No recycled content. Just verified data and tools that actually help you prepare smarter. 271 profiles, 37 optional subjects, 50+ answer copies — all sourced from UPSC.gov.in.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-brand px-7 text-brand-foreground hover:bg-brand/90">
                <Link data-track="home-about-cta" href="/about">
                  Read the full story <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                <Link data-track="home-contact-cta" href="/contact">
                  Get in touch
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ──────────────────────── CLOSING CTA ──────────────────────── */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              Stop guessing. Start studying what works.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              271 verified topper profiles. Every mark sourced from UPSC.gov.in. Free to explore — no signup required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-brand px-7 text-brand-foreground hover:bg-brand/90">
                <Link data-track="home-closing-cta" href="/year/2025">
                  Browse profiles <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                <Link data-track="home-closing-secondary" href="/store">
                  Visit store
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
