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
  { q: "How many resources are included?", a: "50+ topper answer copies across GS1-4, Essay & Optional + 21 original strategy guides (booklist, prelims, answer writing, essay, optional, interview, ethics case studies, value-addition data, and more)." },
  { q: "Are the answer copies verified?", a: "Yes. Every topper copy is verified for authenticity against published UPSC results." },
  { q: "How do I receive the bundle?", a: "Pay via UPI (scan QR or click to pay), upload your payment screenshot, and we'll email you the download link within 2 hours. The bundle is delivered as a single ZIP file with all PDFs organized by category." },
  { q: "What format will I receive?", a: "All resources are in PDF format, delivered as a ZIP file via email after payment verification." },
  { q: "Is this a physical book?", a: "Digital only. You get an instant download link after we verify your payment. No shipping, no delays." },
  { q: "Can I buy individual topper copies?", a: "Individual copies are not sold separately. The bundle includes all 50+ topper copies for one price — best value if you're preparing across multiple papers." },
  { q: "How long does delivery take?", a: "We verify payments manually within 2 hours (usually within 2-4 hours during business hours). You'll receive the download link via email once verified." },
  { q: "What if I'm not satisfied?", a: "If the bundle doesn't meet your expectations, email us within 7 days and we'll refund your payment — no questions asked. We'd rather you be happy than keep your money." },
  { q: "Do I get lifetime access?", a: "Yes. Once purchased, you get the download link plus any future updates to the bundle. No recurring fees." },
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
    color: "from-blue-500 to-blue-600",
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
    color: "from-emerald-500 to-emerald-600",
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
    color: "from-purple-500 to-purple-600",
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
    color: "from-amber-500 to-amber-600",
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

  const [guideEmail, setGuideEmail] = useState("");
  const [guideName, setGuideName] = useState("");
  const [guideSubmitting, setGuideSubmitting] = useState(false);
  const [guideDone, setGuideDone] = useState(false);
  const [guideError, setGuideError] = useState("");

  useEffect(() => {
    trackViewItem("Topper Answer Copy Compilation", 799);
  }, []);

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadPhone.trim()) return;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! I want my 3 free topper answer copies. My number is ${leadPhone}.`)}`;
    window.open(waUrl, "_blank");
    setLeadSent(true);
    try { window.gtag?.("event", "generate_lead", { event_label: "sales-lead-form", value: 1 }); } catch {}
  }

  async function handleGuideSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuideError("");
    if (!guideName.trim() || !guideEmail.trim()) {
      setGuideError("Please enter your name and email.");
      return;
    }
    setGuideSubmitting(true);
    try {
      const res = await fetch("/api/free-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guideName.trim(), email: guideEmail.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setGuideDone(true);
      try { window.gtag?.("event", "generate_lead", { event_label: "free-guides-form", value: 1 }); } catch {}
    } catch (err: any) {
      setGuideError(err.message || "Something went wrong. Please try again.");
    } finally {
      setGuideSubmitting(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {modalOpen && <PurchaseModal onClose={() => setModalOpen(false)} />}

        {/* HERO */}
        <section className="border-b border-gray-100 bg-white pt-24 pb-14 sm:pt-32 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              50+ Topper Answer Copies &amp; 21 Strategy Guides — One Complete Bundle
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base sm:leading-relaxed">
              Every answer copy you see across this site — GS papers, Essay, Optional — all in one ZIP. Plus 21 original strategy guides not available anywhere else. Convenience, not exclusivity.
            </p>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-2 sm:gap-3">
                <span className="text-4xl font-bold text-gray-900 sm:text-5xl">₹799</span>
                <span className="text-base text-gray-400 line-through sm:text-lg">₹4,999</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 sm:px-3 sm:text-xs">Save 84%</span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-emerald-600">
                Just <span className="text-lg font-bold">₹11</span> per answer copy — less than a chai!
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
                Get Complete Bundle at ₹799 →
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400 sm:text-xs">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                50+ Topper Copies
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                21 Strategy Guides
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Interview Prep
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Ethics Case Studies
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-gray-400 sm:text-xs">
              <span className="flex items-center gap-1.5">
                <svg className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Delivered via Email (ZIP)
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

        {/* FREE GUIDES — email capture */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-emerald-50/50 to-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              {!guideDone ? (
                <>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                    <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Get 3 Free Strategy Guides — Instant Download
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                    Enter your name &amp; email and we&apos;ll send you 3 verified strategy guides instantly. No purchase needed. See what&apos;s inside the bundle before you buy.
                  </p>

                  <form onSubmit={handleGuideSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={guideName}
                        onChange={(e) => setGuideName(e.target.value)}
                        className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm outline-none transition focus:border-gray-400"
                        required
                      />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={guideEmail}
                        onChange={(e) => setGuideEmail(e.target.value)}
                        className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm outline-none transition focus:border-gray-400"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={guideSubmitting}
                      className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {guideSubmitting ? "Sending..." : "Send Free Guides"}
                    </Button>
                  </form>
                  {guideError && (
                    <p className="mt-3 text-sm text-red-500">{guideError}</p>
                  )}
                  <p className="mt-3 text-xs text-gray-400">No spam. Unsubscribe anytime. We&apos;ll also send the download link via email.</p>
                </>
              ) : (
                <div className="py-4">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                    <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Your Guides Are Ready, {guideName.split(" ")[0]}!
                  </h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                    Download them now. We&apos;ve also sent them to <strong>{guideEmail}</strong>.
                  </p>

                  <div className="mx-auto mt-8 grid max-w-md gap-3">
                    <a
                      href="/pdfs/free-guides/guide-answer-writing.pdf"
                      target="_blank"
                      className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:shadow-md"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Answer Writing Strategy Guide</p>
                        <p className="text-xs text-gray-500">PDF &bull; 251 KB</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Download</span>
                    </a>
                    <a
                      href="/pdfs/free-guides/guide-ibec-method.pdf"
                      target="_blank"
                      className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:shadow-md"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">IBEC Method — Answer Framework</p>
                        <p className="text-xs text-gray-500">PDF &bull; 267 KB</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Download</span>
                    </a>
                    <a
                      href="/pdfs/free-guides/guide-gs1-strategy.pdf"
                      target="_blank"
                      className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:shadow-md"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">GS1 Strategy Guide</p>
                        <p className="text-xs text-gray-500">PDF &bull; 248 KB</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Download</span>
                    </a>
                  </div>

                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                    <p className="text-sm font-semibold text-emerald-800">Want 50+ topper copies + all 21 guides?</p>
                    <p className="mt-1 text-xs text-emerald-700">Get the Complete Bundle — just ₹11 per copy (₹799)</p>
                    <Button
                      onClick={() => setModalOpen(true)}
                      size="lg"
                      className="mt-4 rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
                    >
                      Get Bundle at ₹799 →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — Delivery flow */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">Simple Delivery</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How You Get the Bundle</h2>
            </div>

            <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
              {[
                { step: "1", title: "Pay via UPI", desc: "Scan the QR code or click to pay with GPay, PhonePe, Paytm. ₹799 one-time." },
                { step: "2", title: "Upload Screenshot", desc: "Upload your payment confirmation. We verify it manually." },
                { step: "3", title: "Get ZIP via Email", desc: "We email you the download link within 2 hours. Full bundle ready to download." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-600">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE — Category Grid */}
        <section className="border-t border-gray-100 bg-gray-50/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">Everything Included</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What&apos;s Inside the Bundle</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                50+ topper copies + 21 strategy guides + interview prep + supporting materials
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.title}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-gray-50">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const colors = [
                            "from-emerald-50 to-emerald-100",
                            "from-blue-50 to-blue-100",
                            "from-purple-50 to-purple-100",
                            "from-amber-50 to-amber-100",
                            "from-rose-50 to-rose-100",
                            "from-teal-50 to-teal-100",
                          ];
                          const idx = CATEGORIES.findIndex((c) => c.title === cat.title);
                          parent.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br ${colors[idx % colors.length]}"><span class="text-6xl font-black text-gray-200">${cat.title.charAt(0)}</span></div>`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm backdrop-blur-sm">
                      {cat.count}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900">{cat.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                data-track="sales-mid-cta"
                className="rounded-full bg-emerald-600 px-10 py-6 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
              >
                Get Complete Bundle at ₹799 →
              </Button>
            </div>
          </div>
        </section>

        {/* TOPPERS — Premium Cards */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">Learn from the Best</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Toppers</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                Study verified answer copies from actual toppers. Every copy checked against published UPSC results.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {TOPPERS.map((t) => (
                <div
                  key={t.name}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Gradient header area */}
                  <div className="relative h-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                  </div>

                  {/* Avatar — overlaps the gradient */}
                  <div className="relative -mt-12 flex justify-center">
                    <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg ring-2 ring-gray-100">
                      <img
                        src={t.img}
                        alt={t.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50"><span class="text-2xl font-bold text-gray-400">${t.name.charAt(0)}</span></div>`;
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Rank badge */}
                  <div className="mt-3 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600">
                      {t.rank}
                    </span>
                  </div>

                  <div className="px-5 pb-5 text-center">
                    <h3 className="mt-2 text-base font-bold text-gray-900">{t.name}</h3>
                    <p className="text-xs text-gray-500">{t.highlight}</p>

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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IBEC METHOD */}
        <section className="border-t border-gray-100 bg-gray-50/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">The Framework</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The IBEC Method</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
                A proven answer-writing framework used by top 1% scorers. Each stage builds on the last.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {IBEC_STEPS.map((step) => (
                <div
                  key={step.letter}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                    <img
                      src={step.img}
                      alt={`${step.title} example`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br ${step.color}"><span class="text-6xl font-black text-white/30">${step.letter}</span></div>`;
                        }
                      }}
                    />
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-sm font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                      {step.letter}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {step.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
                          <span className="mt-0.5 shrink-0 text-emerald-500">&#10003;</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">Testimonials</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Aspirants Say</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8">
                  <div className="flex gap-1 text-amber-400 text-sm">{"★".repeat(5)}</div>
                  <p className="mt-4 leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 text-sm font-bold text-gray-500">
                      {t.name.charAt(0)}
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

        {/* PRICING + DELIVERY */}
        <section className="border-t border-gray-100 bg-gray-50/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
              <div className="text-center">
                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">Pricing</p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Invest ₹11 Per Copy in Your Preparation</h2>
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Complete Bundle — 50+ Topper Copies + 21 Strategy Guides
                  </p>
                </div>
                <div className="p-8 text-center sm:p-10">
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">₹799</span>
                    <span className="text-lg text-gray-400 line-through">₹4,999</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-emerald-600">
                    <span className="text-lg font-bold">₹11/copy</span> — 50+ topper copies + 21 guides for less than a samosa each
                  </p>

                  <div className="mt-8 space-y-3 rounded-2xl bg-gray-50 p-5 text-left text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">50+ Topper Answer Copies</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">21 Strategy Guides</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Interview Prep (3 Guides)</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">50+ Ethics Case Studies</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Value-Addition Data & Maps</span>
                      <span className="font-semibold text-emerald-600">✓ Included</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <span className="text-gray-600">Market Value</span>
                      <span className="font-semibold text-gray-900">₹4,999+</span>
                    </div>
                  </div>

                  {/* Delivery process */}
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">How Delivery Works</p>
                    <ol className="mt-3 space-y-2 text-sm text-emerald-700">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-800">1</span>
                        Pay ₹799 via UPI (QR code or tap to pay)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-800">2</span>
                        Upload your payment screenshot
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-800">3</span>
                        We verify within 2 hours and email you the download link
                      </li>
                    </ol>
                  </div>

                  <Button
                    size="lg"
                    data-track="sales-pricing-cta"
                    onClick={() => setModalOpen(true)}
                    className="mt-8 w-full rounded-full bg-emerald-600 py-6 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
                  >
                    Get Complete Bundle at ₹799 →
                  </Button>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verified & Authentic Copies. Delivered via email.
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-400">
                <p>Pay via UPI • QR Code • GPay • PhonePe • Paytm</p>
                <p className="mt-1">Delivered within 2 hours of payment verification</p>
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
                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">FAQ</p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
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
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get the Complete Bundle — All 50+ Copies &amp; 21 Strategy Guides
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
              50+ topper copies across GS1-4, Essay &amp; Optional • 21 original strategy guides • Interview prep • Ethics case studies
            </p>

            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-white">₹799</span>
              <span className="text-lg text-gray-500 line-through">₹4,999</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">Save 84%</span>
            </div>
            <p className="mt-1 text-sm text-emerald-400">That&apos;s just <span className="font-bold">₹11</span> per copy — less than the price of a tea!</p>

            <div className="mt-8">
              <Button
                size="lg"
                data-track="sales-final-cta"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-emerald-600 px-12 py-6 text-base font-bold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500"
              >
                Get Complete Bundle at ₹799 →
              </Button>
            </div>

            <p className="mt-6 text-xs text-gray-500">
              Delivered via email (ZIP) &bull; Verified content &bull; Lifetime access &bull; <span className="text-emerald-400">100% Satisfaction or Refund</span>
            </p>
          </div>
        </section>

        {/* STICKY BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2 sm:px-6 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] text-gray-400 line-through sm:text-sm">₹4,999</span>
              <span className="text-sm font-bold text-gray-900 sm:text-lg">₹799</span>
              <span className="hidden text-[10px] text-emerald-600 font-semibold sm:inline">(₹11/copy)</span>
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
