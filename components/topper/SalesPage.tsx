"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  IconArrowRight,
  IconCheck,
  IconDownload,
  IconMail,
  IconUser,
  IconStarFilled,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { trackViewItem } from "@/lib/analytics";
import Link from "next/link";
import PurchaseModal from "./PurchaseModal";

const TOPPERS = [
  { name: "Aditya Shrivastava", slug: "aditya-shrivastava", rank: "AIR 1", mark: "143 in GS4" },
  { name: "Animesh Pradhan", slug: "animesh-pradhan", rank: "AIR 2", mark: "109 in GS1" },
  { name: "Shaurya Arora", slug: "shaurya-arora", rank: "AIR 14", mark: "101 in GS3" },
  { name: "Kunal Rastogi", slug: "kunal-rastogi", rank: "AIR 15", mark: "134 in GS2" },
  { name: "Saurabh Sharma", slug: "saurabh-sharma", rank: "AIR 23", mark: "136 in Essay" },
];

const CATEGORIES = [
  { slug: "prelims", title: "Prelims", count: "2 papers" },
  { slug: "writing", title: "Answer Writing", count: "14 copies" },
  { slug: "strategy", title: "Strategy Guides", count: "21 guides" },
  { slug: "selection", title: "Optional Subject", count: "8+ subjects" },
  { slug: "supporting", title: "Supporting Material", count: "50+ docs" },
  { slug: "interview", title: "Interview Prep", count: "100 questions" },
];

const HOW = [
  { verb: "Pay", detail: "₹799 via UPI. Scan QR or tap to pay with GPay, PhonePe, or Paytm.", img: "/images/sales/ibec/ibec-intro.jpg" },
  { verb: "Upload", detail: "Share your payment screenshot. We verify it within 2 hours.", img: "/images/sales/ibec/ibec-body.jpg" },
  { verb: "Receive", detail: "Download link lands in your inbox. Full bundle organized by paper.", img: "/images/sales/ibec/ibec-conclusion.jpg" },
];

const TIERS = [
  {
    name: "Answer Copies",
    price: 549,
    original: 2499,
    desc: "50+ verified topper answer copies across GS1-4, Essay, and Optional papers.",
    features: [
      "50+ topper answer copies",
      "GS1, GS2, GS3, GS4 papers",
      "Essay & Optional copies",
      "Marks-wise organization",
    ],
  },
  {
    name: "Ultimate Bundle",
    price: 799,
    original: 1198,
    desc: "Everything — answer copies, strategy guides, interview prep, ethics case studies, PLUS access to our AI trained for UPSC aspirants.",
    features: [
      "Everything in both packs",
      "Access to AI trained for UPSC aspirants",
      "72 resources total",
      "Lifetime access & updates",
      "₹11 per resource",
    ],
    popular: true,
    save: 399,
  },
  {
    name: "Strategy Pro",
    price: 649,
    original: 4999,
    desc: "21 original strategy guides, interview preparation, and ethics case studies.",
    features: [
      "21 original strategy guides",
      "Interview preparation pack",
      "Ethics case studies",
      "Answer writing frameworks",
    ],
  },
];

const FAQS = [
  { q: "What exactly do I get?", a: "50+ verified topper answer copies across GS1-4, Essay and Optional papers. 21 original strategy guides. Interview prep materials. Ethics case studies. Access to our AI trained for UPSC aspirants. All delivered as PDFs in a single ZIP file." },
  { q: "How is delivery different from free copies online?", a: "This is a curated compilation with marks-wise organization and topper commentary. The 21 strategy guides are original content you won't find on any free platform." },
  { q: "Can I buy individual papers?", a: "We offer three packs: Answer Copies (₹549), Strategy Pro (₹649), and the Ultimate Bundle (₹799). Individual papers are not available. The Ultimate Bundle gives you 72 resources at ₹11 per copy and saves you ₹399 over buying separate packs." },
  { q: "What if I am not satisfied?", a: "Email us within 7 days of receiving the download link. We will refund your payment. No questions asked." },
  { q: "How long does delivery take?", a: "Most verifications complete within 2 hours. You receive an email with the download link once confirmed." },
];

const btn = "transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]";

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 600ms ease-[cubic-bezier(0.23,1,0.32,1)], transform 600ms ease-[cubic-bezier(0.23,1,0.32,1)]`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function CTAButton({ children, onClick, className = "", tracking }: { children: React.ReactNode; onClick: () => void; className?: string; tracking?: string }) {
  return (
    <button
      onClick={onClick}
      data-track={tracking}
      className={`group inline-flex items-center gap-2.5 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 sm:px-8 sm:py-4 sm:text-base ${btn} ${className}`}
    >
      <span>{children}</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 sm:h-7 sm:w-7">
        <IconArrowRight size={14} className="sm:size-[15px]" />
      </span>
    </button>
  );
}

export default function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<string | undefined>(undefined);
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gLoading, setGLoading] = useState(false);
  const [gDone, setGDone] = useState(false);
  const [gError, setGError] = useState("");

  useEffect(() => { trackViewItem("Topper Answer Copy Compilation", 799); }, []);

  useEffect(() => {
    function handler() { openModal("Ultimate Bundle"); }
    window.addEventListener("open-purchase-modal", handler);
    return () => window.removeEventListener("open-purchase-modal", handler);
  }, []);

  const openModal = useCallback((product?: string) => {
    setModalProduct(product);
    setModalOpen(true);
  }, []);

  async function handleFree(e: React.FormEvent) {
    e.preventDefault();
    setGError("");
    if (!gName.trim() || !gEmail.trim()) { setGError("Name and email are required."); return; }
    setGLoading(true);
    try {
      const r = await fetch("/api/free-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gName.trim(), email: gEmail.trim() }),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || "Failed"); }
      setGDone(true);
      try { window.gtag?.("event", "generate_lead", { event_label: "free-guides-form" }); } catch {}
    } catch (err: any) { setGError(err.message); }
    finally { setGLoading(false); }
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {modalOpen && <PurchaseModal onClose={() => setModalOpen(false)} defaultProduct={modalProduct} />}

        {/* 1. HERO — Full-width with topper photo on right */}
        <section className="border-b border-black/[0.04]">
          <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
            <div className="flex flex-col justify-center px-5 pt-20 pb-10 sm:px-8 lg:w-1/2 lg:py-28 lg:pl-12 xl:pl-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Verified answer copies
              </p>
              <h1 className="mt-3 max-w-2xl text-[clamp(1.75rem,5.5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">
                Stop guessing how toppers write.
                <br />
                <span className="text-emerald-600">Study their actual copies.</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-gray-500 sm:text-base">
                50+ verified answer copies from AIR 1-50 toppers. 21 original strategy guides. One bundle delivered to your email.
              </p>
              <div className="mt-7 flex items-center gap-4">
                <CTAButton onClick={() => openModal("Ultimate Bundle")} tracking="sales-hero-cta">
                  Get the bundle
                </CTAButton>
                <span className="text-xs text-gray-400 sm:text-sm">7-day refund</span>
              </div>
            </div>
            <div className="relative min-h-[300px] bg-gray-50 lg:min-h-[500px] lg:w-1/2">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 p-4 lg:p-6">
                {TOPPERS.slice(0, 5).map((t, i) => (
                  <div
                    key={t.slug}
                    className={`relative overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-6px_rgba(0,0,0,0.08)] ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <Image
                      src={`/images/sales/toppers/topper-${t.slug}.svg`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[10px] text-white/80">{t.rank}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. CATEGORY IMAGE GRID — Visual bento */}
        <FadeIn>
          <section className="border-b border-black/[0.04] py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                What you get
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                Everything you need to master answer writing
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                72 resources across 6 categories. Curated, verified, organized.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {CATEGORIES.slice(0, 3).map((c) => (
                  <div key={c.slug} className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]">
                    <Image
                      src={`/images/sales/categories/category-${c.slug}.jpg`}
                      alt={c.title}
                      width={600}
                      height={400}
                      className="h-64 w-full object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-lg font-bold text-white">{c.title}</p>
                      <p className="text-sm text-white/70">{c.count}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {CATEGORIES.slice(3).map((c) => (
                  <div key={c.slug} className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]">
                    <Image
                      src={`/images/sales/categories/category-${c.slug}.jpg`}
                      alt={c.title}
                      width={600}
                      height={400}
                      className="h-56 w-full object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-lg font-bold text-white">{c.title}</p>
                      <p className="text-sm text-white/70">{c.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 3. TOPPER CARDS — Image grid */}
        <FadeIn delay={60}>
          <section className="border-b border-black/[0.04] bg-gray-50 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Featured toppers
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                Real copies from top rankers
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {TOPPERS.slice(0, 3).map((t) => (
                  <div key={t.slug} className="group relative h-56 overflow-hidden rounded-2xl bg-gray-900 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]">
                    <Image
                      src={`/images/sales/toppers/topper-${t.slug}.svg`}
                      alt={t.name}
                      fill
                      className="object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-lg font-bold text-white">{t.name}</p>
                      <p className="text-sm text-white/70">{t.rank}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                        {t.mark}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {TOPPERS.slice(3).map((t) => (
                  <div key={t.slug} className="group relative h-56 overflow-hidden rounded-2xl bg-gray-900 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]">
                    <Image
                      src={`/images/sales/toppers/topper-${t.slug}.svg`}
                      alt={t.name}
                      fill
                      className="object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-lg font-bold text-white">{t.name}</p>
                      <p className="text-sm text-white/70">{t.rank}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                        {t.mark}
                      </span>
                    </div>
                  </div>
                ))}
                <Link
                  href="/toppers"
                  className="group relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-700 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">View all toppers</p>
                    <p className="mt-1 text-sm text-emerald-200/70">50+ verified copies</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 4. FREE GUIDES + HOW IT WORKS — Side by side with IBEC images */}
        <FadeIn delay={30}>
          <section className="border-b border-black/[0.04] py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="flex flex-col gap-16 lg:flex-row lg:gap-16">
                <div className="flex-1">
                  {!gDone ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                        Try before you buy
                      </p>
                      <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                        Get 3 strategy guides free
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-gray-500">
                        Enter your name and email. We will send download links instantly. No purchase needed.
                      </p>
                      <form onSubmit={handleFree} className="mt-8 space-y-3.5">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-500">Name</label>
                          <div className="relative">
                            <IconUser size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                              type="text"
                              placeholder="Your name"
                              value={gName}
                              onChange={(e) => setGName(e.target.value)}
                              className="h-12 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm outline-none transition-colors duration-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-500">Email</label>
                          <div className="relative">
                            <IconMail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={gEmail}
                              onChange={(e) => setGEmail(e.target.value)}
                              className="h-12 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm outline-none transition-colors duration-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20"
                              required
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={gLoading}
                          className={`h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 ${btn}`}
                        >
                          {gLoading ? "Sending..." : "Send free guides"}
                        </Button>
                      </form>
                      {gError && <p className="mt-3 text-sm text-red-500">{gError}</p>}
                      <p className="mt-4 text-xs text-gray-400">No spam. Unsubscribe anytime.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                        <IconCheck size={24} className="text-emerald-600" />
                      </div>
                      <h2 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                        Your guides are ready, {gName.split(" ")[0]}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Download below. Also sent to <strong className="text-gray-700">{gEmail}</strong>.
                      </p>
                      <div className="mt-6 flex flex-col gap-2">
                        {[
                          { href: "/pdfs/free-guides/guide-answer-writing.pdf", name: "Answer Writing Strategy" },
                          { href: "/pdfs/free-guides/guide-ibec-method.pdf", name: "IBEC Method - Answer Framework" },
                          { href: "/pdfs/free-guides/guide-gs1-strategy.pdf", name: "GS1 Strategy Guide" },
                        ].map((g) => (
                          <a
                            key={g.href}
                            href={g.href}
                            target="_blank"
                            className="group flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 text-left text-sm transition-all duration-200 hover:border-emerald-200/60 hover:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)]"
                          >
                            <span className="flex items-center gap-3">
                              <IconDownload size={16} className="text-gray-300 transition-colors group-hover:text-emerald-500" />
                              <span className="font-medium text-gray-900">{g.name}</span>
                            </span>
                            <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[10px] font-semibold text-gray-500">PDF</span>
                          </a>
                        ))}
                      </div>
                      <div className="mt-6 rounded-[1.75rem] border border-emerald-200/60 bg-emerald-50 p-[3px]">
                        <div className="rounded-[calc(1.75rem-3px)] bg-white px-5 py-4">
                          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <div>
                              <p className="text-sm font-semibold text-emerald-800">Want all 72 resources?</p>
                              <p className="text-xs text-emerald-700">11 per copy. 50+ topper copies + 21 guides.</p>
                            </div>
                            <CTAButton onClick={() => openModal("Ultimate Bundle")} className="!shrink-0 !px-5 !py-2.5 !text-sm" tracking="sales-guide-upsell">
                              Bundle
                            </CTAButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    How it works
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                    Three steps to get started
                  </h3>
                  <div className="mt-8 space-y-8">
                    {HOW.map((h) => (
                      <div key={h.verb} className="flex gap-5">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] sm:h-28 sm:w-28">
                          <Image src={h.img} alt={h.verb} fill className="object-cover" />
                        </div>
                        <div className="pt-1">
                          <p className="text-base font-bold text-gray-900">{h.verb}</p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-500">{h.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 5. TESTIMONIALS */}
        <FadeIn delay={50}>
          <section className="border-b border-black/[0.04] bg-gray-50 py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                From aspirants
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                What our users say
              </h2>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {[
                  {
                    name: "Amit Pandey", initials: "AP", title: "CSE 2025, Delhi",
                    text: "Going through actual topper copies showed me exactly how to structure my answers. The marks breakdown helped me understand what the examiner actually rewards. My GS2 score improved by 18 marks in the next attempt.",
                  },
                  {
                    name: "Rahul Verma", initials: "RV", title: "CSE 2024, Lucknow",
                    text: "The GS3 and ethics case studies alone were worth it. Seeing how toppers integrate examples and diagrams into their answers gave me a clear template to follow.",
                  },
                ].map((t) => (
                  <div key={t.name} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.04)]">
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => <IconStarFilled key={i} size={14} />)}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 text-xs font-bold text-gray-500">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 6. PRICING — Three tiers */}
        <FadeIn delay={40}>
          <section className="border-b border-black/[0.04] py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Pricing
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                  Pick the pack that fits your prep
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  Start with answer copies, or get everything with the bundle including AI access.
                </p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
                {TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.06)] sm:p-8 ${
                      (tier as any).popular
                        ? "border-emerald-200 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] lg:-mt-4 lg:pb-10 lg:pt-12"
                        : "border-black/[0.06]"
                    }`}
                  >
                    {(tier as any).popular && (
                      <>
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                          Best Value
                        </span>
                        {(tier as any).save && (
                          <span className="absolute -top-3 right-4 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
                            Save ₹{(tier as any).save}
                          </span>
                        )}
                      </>
                    )}
                    <p className="text-sm font-bold text-gray-900">{tier.name}</p>
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-4xl font-bold tracking-[-0.03em] text-gray-900">
                        ₹{tier.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{tier.original.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      {tier.desc}
                    </p>
                    <div className="mt-6 space-y-3 border-t border-black/[0.06] pt-6">
                      {tier.features.map((f) => {
                        const isAi = f.includes("AI");
                        return (
                          <div key={f} className={`flex items-center gap-2.5 ${isAi ? "-mx-3 rounded-lg bg-emerald-50/80 px-3 py-2" : ""}`}>
                            {isAi ? (
                              <IconSparkles size={14} className="shrink-0 text-emerald-600" />
                            ) : (
                              <IconCheck size={14} className="shrink-0 text-emerald-500" />
                            )}
                            <span className={`text-sm ${isAi ? "font-semibold text-emerald-800" : "text-gray-600"}`}>
                              {f}
                            </span>
                            {isAi && (
                              <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                                Exclusive
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-8">
                      {(tier as any).popular ? (
                        <CTAButton
                          onClick={() => openModal("Ultimate Bundle")}
                          className="w-full justify-center"
                          tracking="sales-tier-ultimate-bundle"
                        >
                          Get the bundle
                        </CTAButton>
                      ) : (
                        <button
                          onClick={() => openModal(tier.name)}
                          className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 sm:px-8 sm:py-4 sm:text-base ${btn}`}
                        >
                          <span>Get {tier.name}</span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 sm:h-7 sm:w-7">
                            <IconArrowRight size={14} className="sm:size-[15px]" />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center text-xs text-gray-400">
                UPI &middot; GPay &middot; PhonePe &middot; Paytm &middot; 7-day money-back guarantee
              </p>
            </div>
          </section>
        </FadeIn>

        {/* 7. FAQ */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-gray-50 py-24 sm:py-28">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">Questions?</h2>
              <div className="mt-10 divide-y divide-black/[0.06]">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 8. FINAL CTA */}
        <FadeIn delay={30}>
          <section className="bg-gray-900 py-24 text-center sm:py-32">
            <div className="mx-auto max-w-2xl px-5 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Start today</p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                You know this is what you need.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
                Ultimate Bundle: 72 resources + AI access for ₹799. That is ₹11 per verified topper answer copy. Save ₹399 over separate packs.
              </p>
              <div className="mt-8 inline-block">
                <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-[3px]">
                  <div className="rounded-[calc(1.75rem-3px)] bg-gray-900 px-6 py-5 sm:px-8">
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">₹799</span>
                      <span className="text-sm text-gray-500 line-through">₹1,198</span>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">Save ₹399</span>
                    </div>
                    <div className="mt-5">
                      <CTAButton onClick={() => openModal("Ultimate Bundle")} tracking="sales-final-cta">
                        Get the bundle
                      </CTAButton>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs text-gray-500">
                Delivered as PDFs via email (ZIP) &middot; Verified content &middot; Lifetime access
              </p>
            </div>
          </section>
        </FadeIn>

        <p className="text-center text-xs text-gray-400">
          UPSCPrepNotes is an independent platform. Answer copies sourced from publicly available materials for educational reference.
        </p>
      </main>
    </>
  );
}
