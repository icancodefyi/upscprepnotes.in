"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconUser,
  IconStar,
  IconShieldCheck,
  IconBolt,
  IconBooks,
  IconWriting,
  IconTarget,
  IconMoodSmile,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { trackViewItem } from "@/lib/analytics";
import Link from "next/link";
import PurchaseModal from "./PurchaseModal";
import { UPILogo, GPayLogo, PhonePeLogo, PaytmLogo } from "@/components/logos";

const TOPPERS = [
  {
    name: "Garima Lohia",
    rank: "AIR 2",
    subject: "Essay",
    score: "141/250",
    year: "2022",
    previewImageUrl:"/preview/garima-lohia.png"
  },
  {
    name: "Ayan Jain",
    rank: "AIR 16",
    subject: "GS Paper 2",
    score: "118/250",
    year: "2023",
    previewImageUrl:"/preview/ayan-jain.png"
  },
  {
    name: "Divya Tanwar",
    rank: "AIR 105",
    subject: "GS Paper 3",
    score: "121/250",
    year: "2022",
    previewImageUrl:"/preview/divya-tanwar.png"
  },
  {
    name: "Komal Meena",
    rank: "AIR 765",
    subject: "Essay",
    score: "129/250",
    year: "2022",
    
  },
  {
    name: "Manika Gupta",
    rank: "AIR 372",
    subject: "GS Paper 1",
    score: "112/250",
    year: "2023",
  },
  {
    name: "Srishti Sharma",
    rank: "AIR 47",
    subject: "GS Paper 4",
    score: "135/250",
    year: "2022",
  },
  {
    name: "Rohan Kiran",
    rank: "AIR 295",
    subject: "Essay",
    score: "126/250",
    year: "2021",
  },
  {
    name: "Shubham Ghadge",
    rank: "AIR 132",
    subject: "GS Paper 2",
    score: "119/250",
    year: "2023",
  },
  {
    name: "Samiksha Jain",
    rank: "AIR 242",
    subject: "GS Paper 1",
    score: "108/250",
    year: "2023",
  },
  {
    name: "Aniket Kailas",
    rank: "AIR 404",
    subject: "GS Paper 3",
    score: "114/250",
    year: "2023",
  },
  {
    name: "Nidhi Kaushal",
    rank: "AIR 590",
    subject: "Essay",
    score: "131/250",
    year: "2021",
  },
  {
    name: "Akhilesh Kumar",
    rank: "AIR 1249",
    subject: "GS Paper 4",
    score: "106/250",
    year: "2023",
  },
];

const HOW = [
  {
    verb: "Pay",
    detail: "₹799 via UPI. Scan QR or tap to pay with GPay, PhonePe, or Paytm.",
  },
  {
    verb: "Upload",
    detail: "Share your payment screenshot. We verify it within 2 hours.",
  },
  {
    verb: "Receive",
    detail:
      "Download link lands in your inbox. Full bundle organized by paper.",
  },
];

const TIERS = [
  {
    name: "Answer Copies",
    price: 549,
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
    desc: "Everything — answer copies, strategy guides, interview prep, ethics case studies, PLUS access to our AI trained for UPSC aspirants.",
    features: [
      "Everything in both packs",
      "Access to AI trained for UPSC aspirants",
      "72 resources total",
      "Lifetime access & updates",
      "₹11 per resource",
    ],
    popular: true,
  },
  {
    name: "Strategy Pro",
    price: 649,
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
  {
    q: "What exactly do I get?",
    a: "50+ verified topper answer copies across GS1-4, Essay and Optional papers. 21 original strategy guides. Interview prep materials. Ethics case studies. Access to our AI trained for UPSC aspirants. All delivered as PDFs in a single ZIP file.",
  },
  {
    q: "How is delivery different from free copies online?",
    a: "This is a curated compilation with marks-wise organization and topper commentary. The 21 strategy guides are original content you won't find on any free platform.",
  },
  {
    q: "Can I buy individual papers?",
    a: "We offer three packs: Answer Copies (₹549), Strategy Pro (₹649), and the Ultimate Bundle (₹799). Individual papers are not available. The Ultimate Bundle gives you 72 resources at ₹11 per copy and saves you ₹399 over buying separate packs.",
  },
  {
    q: "What if I am not satisfied?",
    a: "Email us within 7 days of receiving the download link. We will refund your payment. No questions asked.",
  },
  {
    q: "How long does delivery take?",
    a: "Most verifications complete within 2 hours. You receive an email with the download link once confirmed.",
  },
];

const btn =
  "transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]";

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
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

function CTAButton({
  children,
  onClick,
  className = "",
  tracking,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  tracking?: string;
}) {
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
  const [modalProduct, setModalProduct] = useState<string | undefined>(
    undefined,
  );
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gLoading, setGLoading] = useState(false);
  const [gDone, setGDone] = useState(false);
  const [gError, setGError] = useState("");

  useEffect(() => {
    trackViewItem("Topper Answer Copy Compilation", 799);
  }, []);

  useEffect(() => {
    function handler() {
      openModal("Ultimate Bundle");
    }
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
    if (!gEmail.trim()) {
      setGError("Email is required.");
      return;
    }
    setGLoading(true);
    try {
      const r = await fetch("/api/free-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gName.trim(), email: gEmail.trim() }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || "Failed");
      }
      setGDone(true);
      try {
        window.gtag?.("event", "generate_lead", {
          event_label: "free-guides-form",
        });
      } catch {}
    } catch (err: any) {
      setGError(err.message);
    } finally {
      setGLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {modalOpen && (
          <PurchaseModal
            onClose={() => setModalOpen(false)}
            defaultProduct={modalProduct}
          />
        )}

        {/* SECTION 1: HERO — Outcome-first, warm, high-trust */}
        <section className="relative overflow-hidden border-b border-black/[0.04]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/30" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
          <div className="relative mx-auto flex max-w-7xl flex-col lg:flex-row">
            <div className="flex flex-col justify-center px-5 pt-20 pb-12 sm:px-8 lg:w-1/2 lg:py-28 lg:pl-12 xl:pl-16">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-5 w-5 overflow-hidden rounded-full ring-2 ring-white"
                    >
                      <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    </div>
                  ))}
                </div>
                <span>
                  <strong className="text-gray-800">2,300+</strong> bundles
                  delivered
                </span>
              </div>
              <h1 className="mt-4 max-w-2xl text-[clamp(1.75rem,5.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">
                Write 140+ mark answers.
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Study 50+ verified
                </span>{" "}
                topper copies.
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500 sm:text-base">
                See the exact structure, language, and presentation that earned
                Garima Lohia (AIR 2), Ayan Jain (AIR 16), and 50+ others their
                top scores.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CTAButton
                  onClick={() => openModal("Ultimate Bundle")}
                  tracking="sales-hero-cta"
                >
                  Start Learning — from ₹549
                </CTAButton>
                <a
                  href="#previews"
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 sm:px-6 sm:py-4"
                >
                  See previews
                  <IconArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <IconShieldCheck size={11} className="text-emerald-500" />
                  7-day refund
                </span>
                <span className="flex items-center gap-1">
                  <IconBolt size={11} className="text-emerald-500" />
                  2-hour delivery
                </span>
                <span className="flex items-center gap-1">
                  <IconCheck size={11} className="text-emerald-500" />
                  Verified copies
                </span>
                <span className="flex items-center gap-1">
                  <IconMoodSmile size={11} className="text-emerald-500" />
                  UPI / GPay
                </span>
              </div>
            </div>
            <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-gray-50/80 to-white px-4 py-8 lg:min-h-[500px] lg:w-1/2 lg:px-8">
              <div className="relative w-full max-w-sm">
                <div className="absolute -right-1 bottom-0 h-[90%] w-[98%] rounded-2xl border border-black/[0.04] bg-gray-50/50 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.06)]" />
                <div className="absolute -right-0.5 bottom-0.5 h-[95%] w-[99%] rounded-2xl border border-black/[0.04] bg-gray-50/80 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08)]" />
                <div className="relative rounded-2xl bg-white shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03]">
                  <div className="flex items-center justify-between border-b border-black/[0.06] bg-gradient-to-r from-emerald-50 to-white px-5 pt-5 pb-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                        UPSC CSE Mains 2022
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        Essay Paper
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      AIR 2
                    </span>
                  </div>
                  <div className="absolute right-4 top-16 rounded-lg bg-emerald-600 px-2.5 py-1 text-center shadow-sm">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                      Score
                    </p>
                    <p className="text-lg font-extrabold leading-none text-white">
                      141
                    </p>
                    <p className="text-[8px] text-emerald-300">/ 250</p>
                  </div>
                  <div className="px-5 pt-4 pb-2">
                    <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-[9px] font-bold text-emerald-700">
                        Q
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">
                        Essay Question
                      </span>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <p className="text-[11px] leading-relaxed text-gray-600">
                        &ldquo;In the context of rapid urbanization, discuss the
                        role of local governance in ensuring equitable access to
                        public goods.&rdquo;
                      </p>
                      <div className="border-l-2 border-emerald-300 bg-emerald-50/60 pl-3 py-2">
                        <p className="text-[10px] italic leading-relaxed text-gray-700">
                          Urbanization in India has outpaced institutional
                          capacity. Local governance, particularly through urban
                          local bodies, plays a critical role in bridging this
                          gap&hellip;
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mx-5 rounded-lg bg-amber-50/60 px-3 py-2 ring-1 ring-amber-200/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-amber-700">
                        Examiner&apos;s note:
                      </span>
                      <span className="text-[8px] text-amber-500">
                        Excellent structure &amp; examples
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-1 ring-white" />
                        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-1 ring-white" />
                        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-1 ring-white" />
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Garima Lohia
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Verified copy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRUST — Topper Hall of Fame (builds credibility before showing product) */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Who is inside
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  Copies from 12 toppers across 4 years
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Each copy verified with original scorecard. Rank range: AIR 2
                  – AIR 1249.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {TOPPERS.map((t) => (
                  <div
                    key={t.name}
                    className="group rounded-xl border border-black/[0.06] bg-gradient-to-b from-white to-gray-50/50 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-200/60 hover:shadow-[0_4px_16px_-10px_rgba(5,150,105,0.15)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-[11px] font-bold text-emerald-700">
                        {t.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {t.name}
                        </p>
                        <p className="text-[10px] font-semibold text-emerald-600">
                          {t.rank}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-black/[0.04] pt-2.5">
                      <span className="text-[10px] text-gray-400">
                        {t.subject} · {t.year}
                      </span>
                      <span className="text-xs font-extrabold text-gray-800">
                        {t.score.split("/")[0]}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        style={{
                          width: `${(parseInt(t.score.split("/")[0]) / parseInt(t.score.split("/")[1])) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-gray-400">
                <IconStar
                  size={11}
                  className="inline -mt-0.5 mr-1 text-emerald-500"
                />
                Every copy includes the original scorecard for verification
              </p>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 3: PREVIEW GALLERY */}
        <FadeIn delay={20}>
          <section id="previews" className="border-b border-black/[0.04] bg-gray-50/50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Inside the Bundle
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  Browse actual answer sheets
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Screenshots from real topper copies included in this bundle
                </p>
              </div>
              <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .preview-card { scroll-snap-align: start; }
              `}</style>
              <div className="mt-10 flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12">
                {[
                  { name: "Ishita Kishore", rank: 1, year: 2022, subject: "PSIR" },
                  { name: "Garima Lohia", rank: 2, year: 2022, subject: "Commerce & Accountancy" },
                  { name: "Harshita Goyal", rank: 2, year: 2024, subject: "PSIR" },
                  { name: "Uma Harathi", rank: 3, year: 2022, subject: "Anthropology" },
                  { name: "Divya Tanwar", rank: 105, year: 2022, subject: "Hindi Literature" },
                  { name: "Ayan Jain", rank: 16, year: 2023, subject: "Mathematics" },
                  { name: "Shivani Ettaboyina", rank: 11, year: 2024, subject: "Anthropology" },
                  { name: "Vaishali Chopra", rank: 23, year: 2022, subject: "Mathematics" },
                ].map((p) => {
                  const slug = p.name.toLowerCase().replace(/\s+/g, "-");
                  const imgPath = `/previews/${slug}.png`;
                  return (
                    <div
                      key={p.name}
                      className="preview-card flex w-[240px] shrink-0 flex-col rounded-xl border border-black/[0.06] bg-gradient-to-b from-white to-gray-50/50 sm:w-[280px]"
                    >
                      <div className="flex items-center justify-center rounded-t-xl bg-gradient-to-b from-gray-50 to-white p-4">
                        <div className="flex items-center justify-center">
                          <img
                            src={imgPath}
                            alt={p.name}
                            className="max-h-52 w-full rounded-lg object-contain sm:max-h-60"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (!img.dataset.fallback) {
                                img.dataset.fallback = "1";
                                img.style.display = "none";
                                const parent = img.parentElement;
                                if (parent) {
                                  const ph = document.createElement("div");
                                  ph.className = "flex h-44 w-full items-center justify-center rounded-lg sm:h-52";
                                  const initials = p.name.split(" ").map(w => w[0]).join("");
                                  ph.innerHTML = `<span class="text-4xl font-bold text-gray-200">${initials}</span>`;
                                  parent.appendChild(ph);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="border-t border-black/[0.04] px-4 py-3">
                        <p className="text-sm font-bold text-gray-900 leading-snug">
                          {p.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-gray-400">
                          AIR {p.rank} · {p.subject} · {p.year}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 4: PAIN → SOLUTION — Why 80 ≠ 140 */}
        <FadeIn delay={30}>
          <section className="border-b border-black/[0.04] bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-3xl">
                <div className="text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    The gap
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                    You know the syllabus. But do you know what a 140-mark
                    answer looks like?
                  </h2>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-red-200/60 bg-red-50/40 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-500">
                      80–100 marks
                    </p>
                    <div className="mt-2 space-y-2 text-sm leading-relaxed text-gray-600">
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-red-300">✕</span>
                        Generic structure, copied from coaching notes
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-red-300">✕</span>
                        No real-world examples or data
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-red-300">✕</span>
                        Poor presentation, no diagram usage
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-red-300">✕</span>
                        Wasting time on random Telegram PDFs
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                      130–150 marks
                    </p>
                    <div className="mt-2 space-y-2 text-sm leading-relaxed text-gray-600">
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-400">✓</span>
                        Clear argument structure with flow
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-400">✓</span>
                        Relevant examples from current affairs
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-400">✓</span>
                        Diagrams, keywords, presentation
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-400">✓</span>
                        Study from verified topper copies
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 rounded-xl border border-black/[0.06] bg-gradient-to-r from-emerald-50/30 to-amber-50/30 p-5 text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    The difference between 80 and 140 isn&apos;t luck —
                    it&apos;s structure, language, and presentation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 5: WHAT'S INSIDE — Full breakdown */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-gray-50/50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Everything Included
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  72 resources, organized by paper
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Every copy tagged by marks, year, and subject so you can study
                  what&apos;s relevant to you.
                </p>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <IconWriting size={15} className="text-emerald-700" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-900">
                    GS Paper 1–4
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    28 topper copies across all 4 GS papers. Includes diagrams,
                    keywords, and examiner comments.
                  </p>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <IconBooks size={15} className="text-emerald-700" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-900">
                    Essay Copies
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    12 topper essays with scoring breakdowns. See how AIR 2 and
                    AIR 16 structured their essays.
                  </p>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <IconTarget size={15} className="text-emerald-700" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-900">
                    Optional Subjects
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Answer copies from 8+ optional subjects including Sociology,
                    PSIR, Geography, and more.
                  </p>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <IconSparkles size={15} className="text-emerald-700" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-900">
                    Strategy Guides
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    21 original strategy guides covering answer writing
                    frameworks, time management, and paper planning.
                  </p>
                </div>
                <div className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <IconUser size={15} className="text-emerald-700" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-900">
                    Interview Prep
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Toppers&apos; DAF analysis, 100+ practice questions, and
                    personality test strategies.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                    <IconBolt size={15} className="text-white" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-900">
                    AI Assistant
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Access to our AI trained on these exact topper copies. Get
                    your answers evaluated instantly.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 6: PRICING — Three tiers */}
        <FadeIn delay={40}>
          <section className="border-b border-black/[0.04] bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Pricing
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                  Pick the pack that fits your prep
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  Start with answer copies, or get everything with the bundle
                  including AI access.
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
                      </>
                    )}
                    <p className="text-sm font-bold text-gray-900">
                      {tier.name}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-4xl font-bold tracking-[-0.03em] text-gray-900">
                        ₹{tier.price}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      {tier.desc}
                    </p>
                    <div className="mt-6 space-y-3 border-t border-black/[0.06] pt-6">
                      {tier.features.map((f) => {
                        const isAi = f.includes("AI");
                        return (
                          <div
                            key={f}
                            className={`flex items-center gap-2.5 ${isAi ? "-mx-3 rounded-lg bg-emerald-50/80 px-3 py-2" : ""}`}
                          >
                            {isAi ? (
                              <IconSparkles
                                size={14}
                                className="shrink-0 text-emerald-600"
                              />
                            ) : (
                              <IconCheck
                                size={14}
                                className="shrink-0 text-emerald-500"
                              />
                            )}
                            <span
                              className={`text-sm ${isAi ? "font-semibold text-emerald-800" : "text-gray-600"}`}
                            >
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
                            <IconArrowRight
                              size={14}
                              className="sm:size-[15px]"
                            />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-1.5 rounded-full bg-black/[0.03] px-3 py-1.5">
                  <UPILogo className="h-4 w-auto" />
                  <span className="text-xs font-medium text-gray-700">UPI</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/[0.03] px-3 py-1.5">
                  <GPayLogo className="h-4 w-auto" />
                  <span className="text-xs font-medium text-gray-700">
                    GPay
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/[0.03] px-3 py-1.5">
                  <PhonePeLogo className="h-4 w-auto" />
                  <span className="text-xs font-medium text-gray-700">
                    PhonePe
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/[0.03] px-3 py-1.5">
                  <PaytmLogo className="h-4 w-auto" />
                  <span className="text-xs font-medium text-gray-700">
                    Paytm
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-emerald-600"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs font-medium text-emerald-700">
                    7-day refund
                  </span>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 7: HOW IT WORKS */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
                  How it works
                </h2>
                <div className="mt-10 grid gap-8 sm:grid-cols-3">
                  {HOW.map((step, i) => (
                    <div key={step.verb} className="text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-700">
                        {i + 1}
                      </div>
                      <p className="mt-4 text-sm font-bold text-gray-900">
                        {step.verb}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 8: FAQ */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-gray-50 py-24 sm:py-28">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                Questions?
              </h2>
              <div className="mt-10 divide-y divide-black/[0.06]">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {faq.q}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 9: FINAL CTA */}
        <FadeIn delay={30}>
          <section className="bg-gray-900 py-24 text-center sm:py-32">
            <div className="mx-auto max-w-2xl px-5 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Start today
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                See what a 140+ answer looks like.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
                72 resources: 50+ topper answer copies, 21 strategy guides, and
                AI access. Delivered to your email as PDFs.
              </p>
              <div className="mt-8 inline-block">
                <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] p-[3px]">
                  <div className="rounded-[calc(1.75rem-3px)] bg-gray-900 px-6 py-5 sm:px-8">
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                        ₹799
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        ₹11 per copy
                      </span>
                    </div>
                    <div className="mt-5">
                      <CTAButton
                        onClick={() => openModal("Ultimate Bundle")}
                        tracking="sales-final-cta"
                      >
                        Get the bundle
                      </CTAButton>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs text-gray-500">
                Delivered as PDFs via email &middot; Verified content &middot;
                Lifetime access
              </p>
            </div>
          </section>
        </FadeIn>

        <p className="text-center text-xs text-gray-400">
          UPSCPrepNotes is an independent platform. Answer copies sourced from
          publicly available materials for educational reference.
        </p>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              ₹799
            </span>
            <span className="text-[10px] text-gray-400">
              72 resources · 7-day refund
            </span>
          </div>
          <button
            onClick={() => openModal("Ultimate Bundle")}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97]"
          >
            Get Bundle
            <IconArrowRight size="14" />
          </button>
        </div>
      </div>
    </>
  );
}
