"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconStar,
  IconShieldCheck,
  IconBolt,
  IconMoodSmile,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { trackViewItem } from "@/lib/analytics";
import { trackClientEvent } from "@/lib/client-analytics";
import Link from "next/link";

const TOPPERS = [
  {
    name: "Ishita Kishore",
    rank: "AIR 1",
    subject: "PSIR",
    year: "2022",
    previewImageUrl:"/previews/ishita-kishore.png"
  },
  {
    name: "Garima Lohia",
    rank: "AIR 2",
    subject: "Commerce & Accountancy",
    year: "2022",
    previewImageUrl:"/previews/garima-lohia.png"
  },
  {
    name: "Harshita Goyal",
    rank: "AIR 2",
    subject: "PSIR",
    year: "2024",
    previewImageUrl:"/previews/harshita-goyal.png"
  },
  {
    name: "Uma Harathi",
    rank: "AIR 3",
    subject: "Anthropology",
    year: "2022",
    previewImageUrl:"/previews/uma-harathi.png"
  },
  {
    name: "Divya Tanwar",
    rank: "AIR 105",
    subject: "Hindi Literature",
    year: "2022",
    previewImageUrl:"/previews/divya-tanwar.png"
  },
  {
    name: "Ayan Jain",
    rank: "AIR 16",
    subject: "Mathematics",
    year: "2023",
    previewImageUrl:"/previews/ayan-jain.png"
  },
  {
    name: "Shivani Ettaboyina",
    rank: "AIR 11",
    subject: "Anthropology",
    year: "2024",
    previewImageUrl:"/previews/shivani-ettaboyina.png"
  },
  {
    name: "Vaishali Chopra",
    rank: "AIR 23",
    subject: "Mathematics",
    year: "2022",
    previewImageUrl:"/previews/vaishali-chopra.png"
  },
];

const HOW = [
  {
    verb: "Pay via UPI",
    detail: "Tap 'Pay ₹799' to open GPay/PhonePe. Complete the payment in your UPI app.",
  },
  {
    verb: "Share Transaction ID",
    detail: "Enter your UTR number and email below. We verify your payment instantly.",
  },
  {
    verb: "Get Download Link",
    detail: "We email the download link within 2 hours. Full bundle organized by paper.",
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

const WHATSAPP_NUMBER = "919152750079";
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "rakhangezaid8@pingpay";
const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_NAME || "UPSCPrepNotes";

function whatsappLink(tier: string) {
  const msg = encodeURIComponent(
    `Hi! I want to buy the "${tier}" on UPSCPrepNotes. Please share payment details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function upiDeepLink(amount: number, note: string) {
  const uri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT)}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
  return uri;
}

function paidWhatsAppLink(tier: string, email: string, utr: string) {
  const msg = encodeURIComponent(
    `Paid for "${tier}" (₹799). UTR: ${utr}. Email: ${email}. Please send the download link.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

const FAQS = [
  {
    q: "Are these the actual UPSC answer sheets?",
    a: "Yes. All 50+ copies are real UPSC Mains answer sheets from verified toppers (AIR 1–1249). Each copy includes the original scorecard for verification.",
  },
  {
    q: "How is this different from free answer copies on Telegram?",
    a: "Free copies are scattered, unverified, and low-quality scans. This is a curated compilation organized by paper and marks — with original strategy guides, examiner commentary, and AI access that no free source provides.",
  },
  {
    q: "How will I receive the files?",
    a: "After payment verification, we email you a download link. The bundle comes as a single ZIP file organized by paper (GS1–4, Essay, Optional). You get lifetime access and free updates.",
  },
  {
    q: "What if I am not satisfied?",
    a: "Email us within 7 days of receiving the download link. We will refund your payment. No questions asked.",
  },
  {
    q: "Can I pay via GPay or PhonePe?",
    a: 'Yes. Tap the "Pay ₹799" button anywhere on the page to open your UPI app. You can also manually pay to rakhangezaid8@pingpay via GPay, PhonePe, or any UPI app.',
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
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gLoading, setGLoading] = useState(false);
  const [gDone, setGDone] = useState(false);
  const [gError, setGError] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    trackViewItem("Topper Answer Copy Compilation", 799);
  }, []);

  useEffect(() => {
    if (!previewImg) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setPreviewImg(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [previewImg]);

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

  function trackWhatsApp(tier: string, location: string) {
    trackClientEvent("whatsapp_click", { tier, location });
  }

  return (
    <>
      <main className="min-h-screen bg-white">
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
                50+ UPSC Topper
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Answer Copies
                </span>{" "}
                — ₹799
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500 sm:text-base">
                Actual UPSC Mains answer sheets from Garima Lohia (AIR 2),
                Ayan Jain (AIR 16), Ishita Kishore (AIR 1) and 50+ toppers.
                GS1–4, Essay, Optional papers with marks. Delivered as PDFs.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={upiDeepLink(799, "Ultimate Bundle")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="upi-hero"
                  className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] sm:px-7 sm:py-3.5 sm:text-base ${btn}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                  Pay ₹799 — Get Instant Access
                </a>
                <a
                  href={whatsappLink("Ultimate Bundle")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-hero"
                  onClick={() => trackWhatsApp("Ultimate Bundle", "hero")}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 sm:px-6 sm:py-4"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
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

        {/* SECTION 2: TRUST — Topper image grid */}
        <FadeIn delay={20}>
          <section id="toppers" className="border-b border-black/[0.04] bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Who is inside
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  50+ toppers across 4 years
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Each copy verified with original scorecard. Rank range: AIR 1
                  – AIR 1249.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TOPPERS.filter(t => t.previewImageUrl).map((t) => {
                  const initials = t.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                  return (
                      <div
                        key={t.name}
                        className="group relative overflow-hidden rounded-xl border border-black/[0.06] bg-gray-50"
                      >
                        <div className="aspect-[3/4]">
                          <img
                            src={t.previewImageUrl!}
                            alt={t.name}
                            className="h-full w-full cursor-pointer object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                            onClick={() => setPreviewImg(t.previewImageUrl!)}
                            onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.fallback) {
                              img.dataset.fallback = "1";
                              img.style.display = "none";
                              const parent = img.parentElement;
                              if (parent) {
                                const ph = document.createElement("div");
                                ph.className = "flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50";
                                ph.innerHTML = `<span class="text-2xl font-bold text-gray-300">${initials}</span>`;
                                parent.appendChild(ph);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                        <p className="text-sm font-bold text-white drop-shadow-sm">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-white/80">
                          {t.rank} · {t.subject}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-center text-xs text-gray-400">
                <IconStar
                  size={11}
                  className="inline -mt-0.5 mr-1 text-emerald-500"
                />
                Every copy includes the original scorecard for verification
              </p>
              <div className="mt-6 text-center">
                <a
                  href={whatsappLink("Ultimate Bundle")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-toppers-section"
                  onClick={() => trackWhatsApp("Ultimate Bundle", "toppers-section")}
                  className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] ${btn}`}
                >
                  View more in bundle
                  <IconArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 4: THE GAP — Real before/after comparison */}
        <FadeIn delay={30}>
          <section className="border-b border-black/[0.04] bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  The gap
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  Same question. Same syllabus. Totally different marks.
                </h2>
                <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                  Both answers below are on the same essay topic. One scored 80. The other scored 141.
                  The difference isn't what they studied — it's how they wrote.
                </p>
              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-2">
                {/* BEFORE — 80-mark answer */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-600">✕</span>
                    <span className="text-sm font-bold text-red-600">Typical 80-mark answer</span>
                    <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">80 / 250</span>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50/30 p-5">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <p className="text-[11px] leading-relaxed text-gray-700">
                        &ldquo;Urbanization is the process of population shift from rural to urban areas.
                        It is happening rapidly in India. Many people are moving to cities for jobs
                        and better facilities. Local governance is important for managing this.
                        The 73rd and 74th Constitutional Amendments gave power to local bodies.
                        However, there are many challenges like lack of funds and corruption.&rdquo;
                      </p>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        { text: "Textbook opening — no hook, no context", type: "struct" },
                        { text: "Zero data or example to back the claim", type: "data" },
                        { text: 'No argument — just "this is important"', type: "arg" },
                      ].map(({ text }) => (
                        <div key={text} className="flex items-start gap-2 rounded-md bg-red-100/60 px-3 py-2">
                          <span className="mt-0.5 text-[10px] text-red-400">→</span>
                          <span className="text-[11px] text-red-700">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AFTER — 141-mark answer */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-600">✓</span>
                    <span className="text-sm font-bold text-emerald-600">Garima Lohia&apos;s 141-mark answer</span>
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">141 / 250</span>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <p className="text-[11px] leading-relaxed text-gray-700">
                        &ldquo;Urbanization in India has outpaced institutional capacity. Local
                        governance, particularly through urban local bodies, plays a critical
                        role in bridging this gap. Consider this: while 34% of India&apos;s
                        population lives in urban areas, they contribute 63% of the GDP — yet
                        ULBs account for barely 1% of the GDP. The 74th Amendment envisioned
                        devolution, but the reality remains fragmented.&rdquo;
                      </p>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        { text: "Direct, confident opening — thesis in first sentence", type: "struct" },
                        { text: "34% vs 63% — real data makes the point instantly", type: "data" },
                        { text: "One clear argument: capacity vs reality", type: "arg" },
                      ].map(({ text }) => (
                        <div key={text} className="flex items-start gap-2 rounded-md bg-emerald-100/60 px-3 py-2">
                          <span className="mt-0.5 text-[10px] text-emerald-500">→</span>
                          <span className="text-[11px] text-emerald-800">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-xl border border-black/[0.06] bg-gradient-to-r from-emerald-50/40 to-amber-50/30 p-6 text-center">
                <p className="text-sm font-semibold text-gray-800">
                  75% of the marks come from presentation, structure, and examples — not from how much you know.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  The bundle shows you exactly how toppers structure every paper. Not theory — real copies.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 5: WHAT'S INSIDE — Checklist + previews */}
        <FadeIn delay={20}>
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          <section className="border-b border-black/[0.04] bg-white py-16 sm:py-20">
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
              <div className="mx-auto mt-10 max-w-2xl divide-y divide-black/[0.06] rounded-xl border border-black/[0.06] bg-white">
                {[
                  { label: "GS Paper 1–4", count: "28 copies", detail: "Diagrams, keywords, examiner comments" },
                  { label: "Essay Copies", count: "12 copies", detail: "AIR 2, AIR 16 essay structures with scores" },
                  { label: "Optional Subjects", count: "8+ subjects", detail: "Sociology, PSIR, Geography, Anthropology & more" },
                  { label: "Strategy Guides", count: "21 guides", detail: "Answer writing, time management, paper planning" },
                  { label: "Interview Prep", count: "100+ Qs", detail: "DAF analysis, practice questions, personality test" },
                  { label: "AI Assistant", count: "Exclusive", detail: "AI trained on these copies. Get instant evaluation." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="mt-0.5 text-[12px] text-gray-400">{item.detail}</p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-auto mt-6 max-w-2xl">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  <span className="shrink-0 text-[11px] font-medium text-gray-400">Previews:</span>
                  {["ishita-kishore","garima-lohia","harshita-goyal","uma-harathi","divya-tanwar","ayan-jain","shivani-ettaboyina","vaishali-chopra"].map((slug) => (
                    <div key={slug} className="h-14 w-10 shrink-0 overflow-hidden rounded-md border border-black/[0.06] bg-gray-50 sm:h-16 sm:w-12">
                      <img
                        src={`/previews/${slug}.png`}
                        alt=""
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() => setPreviewImg(`/previews/${slug}.png`)}
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallback) {
                            img.dataset.fallback = "1";
                            img.style.display = "none";
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
        {/* SECTION 6: WHAT YOU GET — Single bundle offer */}
        <FadeIn delay={40}>
          <section className="border-b border-black/[0.04] bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  The Complete Bundle
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-gray-900 sm:text-3xl">
                  72 resources for ₹799
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  Everything you need in one pack. No tiers, no upselling.
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-lg">
                <div className="rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] sm:p-8">
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                      One Bundle
                    </span>
                    <div className="mt-4 flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold tracking-[-0.03em] text-gray-900">
                        ₹799
                      </span>
                      <span className="text-sm text-gray-400 line-through">₹1,198</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">₹11 per resource · 50+ topper copies included</p>
                  </div>
                  <div className="mt-6 space-y-3 border-t border-black/[0.06] pt-6">
                    {[
                      "50+ actual topper answer copy PDFs (GS1–4, Essay, Optional)",
                      "21 original strategy guides by rank holders",
                      "Interview preparation pack with 100+ questions",
                      "Ethics case studies with model answers",
                      "AI assistant trained on these copies for instant feedback",
                      "Organised by paper, marks, and year — ready to download",
                      "Lifetime access + free updates",
                    ].map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 space-y-2.5">
                    <a
                      href={upiDeepLink(799, "Ultimate Bundle")}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="upi-offer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-base ${btn}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                      Pay ₹799 — Get Instant Access
                    </a>
                    <a
                      href={whatsappLink("Ultimate Bundle")}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="whatsapp-offer"
                      onClick={() => trackWhatsApp("Ultimate Bundle", "offer")}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 sm:px-8 sm:py-3.5 sm:text-base ${btn}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Chat on WhatsApp
                    </a>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      7-day refund
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Verified copies
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C4.5 2 2 7 2 12c0 3 1 6 3 8l-1 3 4-1c2 1 4 2 7 2 7 0 10-5 10-10S19 2 12 2z"/></svg>
                      UPI / GPay / PhonePe
                    </span>
                  </div>
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

        {/* SECTION 8: PAYMENT — Pay via UPI + confirm */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-2xl px-5 sm:px-8 lg:px-12">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  How to Pay
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  Pay ₹799 via UPI — Get Instant Access
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Step 1: Pay ₹799 to the UPI ID below. Step 2: Enter your details and UTR to receive the download link.
                </p>
              </div>

              <div className="mt-8 rounded-xl border border-black/[0.06] bg-white p-6 sm:p-8">
                <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Pay to this UPI ID:</p>
                  <p className="text-lg font-bold text-gray-900 tracking-tight">{UPI_ID}</p>
                  <p className="text-sm text-gray-400 mt-1">Amount: <strong className="text-emerald-600">₹799</strong> (Ultimate Bundle)</p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const data = Object.fromEntries(new FormData(form));
                    try {
                      const r = await fetch("/api/customer", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: data.name,
                          email: data.email,
                          phone: data.phone,
                          product: "Ultimate Bundle",
                          amount: 799,
                          screenshotUrl: "",
                        }),
                      });
                      if (!r.ok) throw new Error("Failed");
                      form.innerHTML = `<div class="text-center py-8"><div class="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" class="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg></div><p class="font-bold text-gray-900">Payment Received!</p><p class="text-sm text-gray-500 mt-1">We will email your download link within 2 hours.</p></div>`;
                      try { window.gtag?.("event", "purchase", { transaction_id: data.email, value: 799, currency: "INR" }); } catch {}
                    } catch {
                      alert("Something went wrong. Please WhatsApp us your details.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Full Name</label>
                      <input name="name" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Phone</label>
                      <input name="phone" required type="tel" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Phone number" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <input name="email" required type="email" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="We will send download link here" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">UPI Transaction ID (UTR)</label>
                    <input name="utr" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. 123456789012" />
                    <p className="text-[11px] text-gray-400 mt-1">Find this in your UPI app payment history</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Your data is secure. We only use this to verify payment and send your download link.
                  </div>
                  <button type="submit" className="w-full rounded-full bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] transition-all">
                    Confirm Payment — Get Download Link
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Having issues?{" "}
                    <a href={whatsappLink("Ultimate Bundle")} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold underline">
                      Chat on WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 9: FAQ */}
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
                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                      <a
                        href={upiDeepLink(799, "Ultimate Bundle")}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="upi-footer"
                        className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] ${btn}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                        Pay ₹799 — Get Instant Access
                      </a>
                      <a
                        href={whatsappLink("Ultimate Bundle")}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="whatsapp-footer"
                        onClick={() => trackWhatsApp("Ultimate Bundle", "footer")}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/20"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Chat on WhatsApp
                      </a>
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

      {previewImg && (
        <div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewImg(null)}
        >
          <button
            onClick={() => setPreviewImg(null)}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img
            src={previewImg}
            alt="Preview"
            className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
          <a
            href={upiDeepLink(799, "Ultimate Bundle")}
            target="_blank"
            rel="noopener noreferrer"
            data-track="upi-mobile-sticky"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Get the Bundle
            <IconArrowRight size="14" />
          </a>
        </div>
      </div>
    </>
  );
}
