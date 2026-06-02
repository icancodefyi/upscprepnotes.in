"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trackViewItem } from "@/lib/analytics";
import PurchaseModal from "./PurchaseModal";

const TOPPERS = [
  {
    name: "Saurabh Sharma",
    rank: "AIR 23",
    highlight: "136 in Essay (Top 1%)",
    speciality: "Art of Brainstorming",
    img: "/images/sales/toppers/topper-saurabh-sharma.svg",
  },
  {
    name: "Animesh Pradhan",
    rank: "AIR 2",
    highlight: "109 in GS1 (Top 1%)",
    speciality: "Presentations & Diagrams",
    img: "/images/sales/toppers/topper-animesh-pradhan.svg",
  },
  {
    name: "Kunal Rastogi",
    rank: "AIR 15",
    highlight: "134 in GS2 (Top 1%)",
    speciality: "Tabular Format Answers",
    img: "/images/sales/toppers/topper-kunal-rastogi.svg",
  },
  {
    name: "Shaurya Arora",
    rank: "AIR 14",
    highlight: "101 in GS3 (Top 1%)",
    speciality: "Argument & Example Method",
    img: "/images/sales/toppers/topper-shaurya-arora.svg",
  },
  {
    name: "Aditya Shrivastava",
    rank: "AIR 1",
    highlight: "143 in GS4 (Top 1%)",
    speciality: "Multi-dimensional Approach",
    img: "/images/sales/toppers/topper-aditya-shrivastava.svg",
  },
];

const TESTIMONIALS = [
  {
    name: "Amit Pandey",
    title: "CSE 2025 Aspirant, Delhi",
    text: "I was struggling with answer structure. Looking at actual topper copies showed me exactly how to organize my thoughts. The marks-wise compilation helped me focus on what actually works.",
  },
  {
    name: "Priya Sharma",
    title: "CSE 2025 Aspirant, Bengaluru",
    text: "The IBEC method is a game changer. I went from writing average answers to understanding how top scorers approach each paper. The GS2 and GS3 copies were especially helpful.",
  },
  {
    name: "Rahul Verma",
    title: "CSE 2024 Aspirant, Lucknow",
    text: "I had seen topper strategies before but never actual answer copies. Seeing how they use diagrams, tables, and structure their answers gave me a clear roadmap for my own preparation.",
  },
  {
    name: "Divya Patel",
    title: "CSE 2025 Aspirant, Ahmedabad",
    text: "What sets this apart is the marks-wise organisation. Instead of guessing which topper to follow, I could directly study copies that scored highest in each paper.",
  },
];

const FAQS = [
  { q: "How many items are included?", a: "30+ resources including 21 strategy guides, 3+ topper answer copies, 50+ ethics case studies, interview prep (100 questions, DAF analysis, mock tips), schemes compendium, value-addition data, maps reference, and more." },
  { q: "Are the answer copies verified?", a: "Yes. Every topper copy is verified for authenticity against published UPSC results." },
  { q: "What format will I receive?", a: "All resources are in PDF format. Instant digital access after purchase." },
  { q: "Is this a physical book?", a: "Currently available in digital PDF format only. Instant access after purchase." },
  { q: "Will the price really go up to ₹4,999?", a: "Yes. ₹799 is the limited launch price. Once we reach our early adopter target, the bundle moves to ₹4,999." },
  { q: "How do I get the 3 free copies?", a: "Enter your WhatsApp number below and we'll send you 3 verified topper answer copies instantly — no purchase needed." },
];

const CATEGORIES = [
  {
    title: "Strategy Guides",
    count: "4 Guides",
    desc: "GS1-4 comprehensive strategy with PYQ trends, 90-day plans & resources",
    img: "/images/sales/categories/category-strategy.jpg",
  },
  {
    title: "Writing Skills",
    count: "4 Guides",
    desc: "Essay framework, IBEC method, answer writing plan & CA note-making",
    img: "/images/sales/categories/category-writing.jpg",
  },
  {
    title: "Prelims & CSAT",
    count: "2 Guides",
    desc: "Subject-wise strategy, elimination techniques & 180-day plan",
    img: "/images/sales/categories/category-prelims.jpg",
  },
  {
    title: "Interview Prep",
    count: "3 Guides",
    desc: "100 questions, DAF analysis & mock interview tips",
    img: "/images/sales/categories/category-interview.jpg",
  },
  {
    title: "Supporting Materials",
    count: "6 Resources",
    desc: "Schemes, judgments, maps, ethics cases, diagrams & value-addition data",
    img: "/images/sales/categories/category-supporting.jpg",
  },
  {
    title: "Selection Guides",
    count: "2 Guides",
    desc: "Optional subject analysis & service-specific interview questions",
    img: "/images/sales/categories/category-selection.jpg",
  },
];

const IBEC_STEPS = [
  {
    letter: "I",
    title: "Introductions",
    color: "bg-blue-500",
    points: [
      "Start with clear, focused introductions for strong impact",
      "Use quotes or data to set context quickly",
      "Align introductions precisely with the question's demand",
    ],
    img: "/images/sales/ibec/ibec-intro.jpg",
  },
  {
    letter: "B",
    title: "Body",
    color: "bg-emerald-500",
    points: [
      "Write concise, direct answers without extra details",
      "Use tables, diagrams, and bullet points for clarity",
      "Include relevant facts, examples, and visuals effectively",
    ],
    img: "/images/sales/ibec/ibec-body.jpg",
  },
  {
    letter: "E",
    title: "Enhancements",
    color: "bg-purple-500",
    points: [
      "Use quick diagrams and maps to boost answers",
      "Recycle points for multidimensional coverage",
      "Integrate perspectives from multiple subjects easily",
    ],
    img: "/images/sales/ibec/ibec-enhancements.jpg",
  },
  {
    letter: "C",
    title: "Conclusions",
    color: "bg-amber-500",
    points: [
      "Summarize key points without repeating content",
      "End with solutions or forward-looking statements",
      "Keep conclusions concise and impactful",
    ],
    img: "/images/sales/ibec/ibec-conclusion.jpg",
  },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919152750079";

export default function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const { mounted, display, spotsLeft } = useTimer();

  useEffect(() => {
    trackViewItem("Topper Answer Copy Compilation", 799);
    try { localStorage.setItem("visited_sales_page", "1"); } catch {}
  }, []);

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadPhone.trim()) return;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! I want my 3 free topper answer copies. My number is ${leadPhone}.`)}`;
    window.open(waUrl, "_blank");
    setLeadSent(true);
    try { window.gtag?.("event", "generate_lead", { event_label: "sales-lead-form", value: 1 }); } catch {}
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {modalOpen && <PurchaseModal onClose={() => setModalOpen(false)} />}

        {/* HERO */}
        <section className="border-b border-gray-100 bg-white pt-24 pb-14 sm:pt-32 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide text-emerald-700">Limited Launch — ₹799</span>
            </div>

            <h1 className="text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Score Higher with Verified&nbsp;Topper&nbsp;Copies
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base sm:leading-relaxed">
              Strategy guides, topper answer copies, interview prep, ethics case studies & value-addition data — one complete bundle for your UPSC prep.
            </p>

            {/* Price + Timer */}
            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-2 sm:gap-3">
                <span className="text-4xl font-bold text-gray-900 sm:text-5xl">₹799</span>
                <span className="text-base text-gray-400 line-through sm:text-lg">₹4,999</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 sm:px-3 sm:text-xs">Save 84%</span>
              </div>

              {/* Urgency: Countdown timer */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs text-gray-400 sm:text-sm">Offer expires in</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 font-bold text-red-600 tabular-nums text-sm sm:text-base ${mounted ? "animate-pulse" : "opacity-0"}`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {mounted ? display : "—"}
                </span>
              </div>

              {/* Scarcity: spots left */}
              <p className="mt-1.5 text-xs text-gray-400">
                Only <span className="font-semibold text-gray-700">{spotsLeft} bundles</span> sold at launch price
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8">
              <Button
                size="lg"
                data-track="sales-hero-cta"
                onClick={() => setModalOpen(true)}
                className="w-full rounded-full bg-emerald-600 px-10 py-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 sm:w-auto sm:px-14 sm:py-6 sm:text-base"
              >
                Claim Bundle at ₹799 →
              </Button>
            </div>

            {/* What's included — social proof strip near CTA */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400 sm:text-xs">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                21 Strategy Guides
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                3+ Topper Copies
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Interview Prep
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                50+ Case Studies
              </span>
            </div>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-gray-400 sm:text-xs">
              <span className="flex items-center gap-1.5">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Instant PDF Access
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Verified Content
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                UPI / QR Payment
              </span>
            </div>
          </div>
        </section>



        {/* WHAT'S INSIDE */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                Everything Included
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What&apos;s Inside the Bundle
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                21 strategy guides + topper copies + interview prep + supporting materials — organized into 6 categories.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <Card
                  key={cat.title}
                  className="group overflow-hidden rounded-2xl border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-gray-50">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                              <div class="text-center p-6">
                                <div class="mx-auto mb-3 h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                  <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                  </svg>
                                </div>
                                <p class="text-sm font-medium text-gray-900">${cat.title}</p>
                                <p class="text-xs text-gray-500">Add image</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{cat.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-gray-500">{cat.desc}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-600">
                        {cat.count}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                data-track="sales-mid-cta"
                className="rounded-full bg-emerald-600 px-10 py-6 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
              >
                Claim Bundle at ₹799 →
              </Button>
              <p className="mt-2 text-xs text-gray-400">Price moves to ₹4,999 after launch period</p>
            </div>
          </div>
        </section>

        {/* TOPPERS */}
        <section className="border-t border-gray-100 bg-gray-50/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                Learn from the Best
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Featured Toppers
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                Study verified answer copies from actual toppers. Every copy checked against published UPSC results.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {TOPPERS.map((t) => (
                <Card
                  key={t.name}
                  className="group rounded-2xl border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
                >
                  <CardContent className="p-6 text-center">
                    {/* IMAGE SLOT: Topper photo */}
                    <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50 ring-2 ring-white">
                      <img
                        src={t.img}
                        alt={t.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                                <span class="text-lg font-bold text-gray-400">${t.name.charAt(0)}</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>

                    <Badge className="mb-3 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-500/20">
                      {t.rank}
                    </Badge>

                    <h3 className="text-base font-semibold text-gray-900">{t.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">{t.highlight}</p>

                    <div className="mt-4 space-y-1.5 text-left text-xs leading-relaxed text-gray-500">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                        <span>Scored {t.highlight}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                        <span>{t.speciality}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* IBEC METHOD */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                The Framework
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                The IBEC Method
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                A proven answer-writing framework used by top 1% scorers. Four stages that transform average answers into high-scoring responses.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {IBEC_STEPS.map((step) => (
                <Card
                  key={step.letter}
                  className="group overflow-hidden rounded-2xl border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
                >
                  <div className={`flex h-28 items-center justify-center ${step.color} bg-gradient-to-br from-gray-50 to-gray-100`}>
                    {/* IMAGE SLOT: IBEC example screenshot */}
                    <img
                      src={step.img}
                      alt={`${step.title} example`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex h-full w-full items-center justify-center">
                              <span class="text-5xl font-bold text-gray-300">${step.letter}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
                      {step.letter}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {step.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
                          <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-t border-gray-100 bg-gray-50/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                Testimonials
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What Aspirants Say
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} className="rounded-2xl border border-gray-100 shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-1 text-amber-400 text-sm">{"★".repeat(5)}</div>
                    <p className="mt-4 leading-relaxed text-gray-600">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 text-sm font-bold text-gray-500">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
              <div className="text-center">
                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                  Pricing
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Invest in Your Preparation
                </h2>
              </div>

              <Card className="mt-8 overflow-hidden rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    🔥 Flash Sale — Expires in {mounted ? display : "05:00"}
                  </p>
                </div>
                <CardContent className="p-8 text-center sm:p-10">
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">₹799</span>
                    <span className="text-lg text-gray-400 line-through">₹4,999</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Save 84% — only <span className="font-semibold text-gray-700">{spotsLeft} bundles</span> sold at this price</p>
                  <p className="mt-0.5 text-xs text-red-500">Offer expires in {mounted ? display : "—"}</p>

                  {/* Value comparison */}
                  <div className="mt-8 space-y-3 rounded-2xl bg-gray-50 p-5 text-left text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">21 Strategy Guides</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">3+ Topper Answer Copies</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">50+ Ethics Case Studies</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Interview Prep (3 Guides)</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <span className="text-gray-600">Market Value</span>
                      <span className="font-semibold text-gray-900">₹4,999+</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    data-track="sales-pricing-cta"
                    onClick={() => setModalOpen(true)}
                    className="mt-8 w-full rounded-full bg-emerald-600 py-6 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
                  >
                    Claim Bundle at ₹799 →
                  </Button>

                  {/* Guarantee */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verified & Authentic Copies. Satisfaction guaranteed.
                  </div>
                </CardContent>
              </Card>

              {/* Payment methods */}
              <div className="mt-6 text-center text-xs text-gray-400">
                <p>Pay via UPI • QR Code • GPay • PhonePe • Paytm</p>
                <p className="mt-1">Instant access after verification (within 24 hrs)</p>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE — 3 Free Copies */}
        <section id="free-copies" className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Get 3 Topper Answer Copies Free
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                Enter your WhatsApp number and we&apos;ll send you 3 verified topper answer copies instantly. No purchase needed.
              </p>

              <form onSubmit={handleLeadSubmit} data-track="sales-lead-form" className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm outline-none ring-0 transition focus:border-gray-400 focus:ring-0"
                  required
                />
                <Button
                  type="submit"
                  disabled={leadSent}
                  data-track="sales-lead-submit"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {leadSent ? "✓ Sent! Check WhatsApp" : "Send Free Copies"}
                </Button>
              </form>
              <p className="mt-3 text-xs text-gray-400">No spam. We respect your privacy.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-gray-100 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10 text-center">
                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                  FAQ
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide text-emerald-300">Only {spotsLeft} bundles left at ₹799</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get the Bundle Before Price Goes&nbsp;Up
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
              30+ resources • 21 strategy guides • Topper copies • Interview prep<br />
              <span className="text-red-400">Offer expires in {mounted ? display : "—"} → ₹799 now</span>
            </p>

            <div className="mt-8">
              <Button
                size="lg"
                data-track="sales-final-cta"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-emerald-600 px-12 py-6 text-base font-bold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500"
              >
                Claim Bundle at ₹799 →
              </Button>
            </div>

            <p className="mt-6 text-xs text-gray-500">
              Instant PDF access &bull; Verified content &bull; Lifetime updates
            </p>
          </div>
        </section>

        {/* STICKY BOTTOM BAR — Timer + Pricing */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2 sm:px-6 sm:py-3">
            {/* Timer (desktop only to avoid overlap on mobile) */}
            <div className="hidden items-center gap-1.5 text-xs font-semibold text-gray-900 sm:flex sm:text-sm">
              {mounted ? (
                <>
                  <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ends in&nbsp;</span>
                  <span className="tabular-nums text-red-600">{display}</span>
                </>
              ) : (
                <span className="text-gray-300">—</span>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] text-gray-400 line-through sm:text-sm">₹4,999</span>
              <span className="text-sm font-bold text-gray-900 sm:text-lg">₹799</span>
              {mounted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 tabular-nums sm:hidden">
                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {display}
                </span>
              )}
            </div>

              <Button
                onClick={() => setModalOpen(true)}
                data-track="sales-bottom-bar"
                className="shrink-0 rounded-full bg-emerald-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-500 sm:px-8 sm:py-2 sm:text-sm"
              >
                Buy at ₹799
              </Button>
          </div>
        </div>



        <p className="pb-16 text-center text-[11px] text-gray-400">
          UPSCPrepNotes is an independent educational platform. Answer copies are sourced from publicly available materials for educational reference.
        </p>
      </main>
    </>
  );
}

function useTimer() {
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState("05:00");
  const [spotsLeft, setSpotsLeft] = useState(42);

  useEffect(() => {
    setMounted(true);
    // 10-minute countdown per session
    const stored = sessionStorage.getItem("offerDeadline10");
    let deadline: number;

    if (stored) {
      deadline = parseInt(stored, 10);
      if (deadline <= Date.now()) {
        deadline = Date.now() + 10 * 60 * 1000;
        sessionStorage.setItem("offerDeadline10", String(deadline));
      }
    } else {
      deadline = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem("offerDeadline10", String(deadline));
    }

    function format(remaining: number) {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    const update = () => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      if (remaining <= 0) {
        setDisplay("00:00");
        return;
      }
      setDisplay(format(remaining));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { mounted, display, spotsLeft };
}
