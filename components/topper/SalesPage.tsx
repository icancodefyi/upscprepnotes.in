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
import PayButton from "@/components/ui/PayButton";
import { trackViewItem } from "@/lib/analytics";
import { trackClientEvent } from "@/lib/client-analytics";
import LiveCounter from "@/components/topper/LiveCounter";

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



const WHATSAPP_NUMBER = "919152750079";
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "rakhangezaid8@pingpay";
const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_NAME || "UPSCPrepNotes";

const SITE = "upscprepnotes.in";

function whatsappLink(tier: string) {
  const msg = encodeURIComponent(
    `Hi! I want to buy the "${tier}" on UPSCPrepNotes (${SITE}). Please share payment details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function paidWhatsAppLink(tier: string, email: string, utr: string) {
  const msg = encodeURIComponent(
    `Paid for "${tier}" (₹799). UTR: ${utr}. Email: ${email}. Site: ${SITE}. Please send the download link.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

const FAQS = [
  {
    q: "Are these typed notes or handwritten answer copies?",
    a: "These are scanned copies of actual handwritten UPSC Mains answer sheets — exactly as toppers wrote them in the exam hall. If you're looking for typed notes, this compilation is not for you. These show you real handwriting, structure, underlining, and diagrams that scored 140+.",
  },
  {
    q: "Are these the actual UPSC answer sheets?",
    a: "Yes. All 50+ copies are real handwritten UPSC Mains answer sheets from verified toppers (AIR 1–1249). Each copy includes the original scorecard for verification.",
  },
  {
    q: "How is this different from free answer copies on Telegram?",
    a: "Free copies are scattered, unverified, and low-quality scans. This is a curated compilation organized by paper and marks — with original strategy guides, examiner commentary, and AI access that no free source provides.",
  },
  {
    q: "How will I receive the files?",
    a: "After payment verification, we email you a download link. The compilation comes as a single ZIP file organized by paper (GS1–4, Essay, Optional). You get lifetime access and free updates.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                  <strong className="text-gray-800">2,300+</strong> compilations
                  delivered
                </span>
              </div>
              <h1 className="mt-4 max-w-2xl text-[clamp(1.75rem,5.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">
                Stop losing marks on
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  presentation &amp; structure
                </span>
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500 sm:text-base">
                See exactly how 50+ toppers (AIR 1–1249) wrote their answers by hand — the same handwriting, structure, underlining, and presentation that scored 140+ in GS, Essay, and Optional papers.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <PayButton
                  amount={799}
                  tracking="upi-hero"
                  className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] sm:px-7 sm:py-3.5 sm:text-base ${btn}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                  Pay ₹799 — Get Instant Access
                </PayButton>
                <a
                  href={whatsappLink("Ultimate Compilation")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-hero"
                  onClick={() => trackWhatsApp("Ultimate Compilation", "hero")}
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
              <div className="mt-3 text-xs">
                <LiveCounter />
              </div>
            </div>
            <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-gray-50/80 to-white px-4 py-8 lg:min-h-[500px] lg:w-1/2 lg:px-8">
              <div className="relative w-full max-w-sm">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {TOPPERS.filter((_, i) => i < 6).map((t, i) => (
                    <div
                      key={t.name}
                      className="group relative overflow-hidden rounded-xl border border-black/[0.06] bg-gray-50 shadow-sm"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="aspect-[3/4]">
                        <img
                          src={t.previewImageUrl!}
                          alt={t.name}
                          className="h-full w-full object-cover transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.fallback) {
                              img.dataset.fallback = "1";
                              img.style.display = "none";
                            }
                          }}
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                        <p className="text-[11px] font-bold text-white drop-shadow-sm leading-tight">{t.name}</p>
                        <p className="text-[9px] text-white/70">{t.rank} · {t.subject}</p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 flex items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3">
                    <p className="text-[11px] font-semibold text-emerald-700 text-center leading-relaxed">
                      +50 more toppers<br />
                      <span className="text-emerald-500 font-normal">GS1–4 · Essay · Optional</span>
                    </p>
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
                  href={whatsappLink("Ultimate Compilation")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp-toppers-section"
                  onClick={() => trackWhatsApp("Ultimate Compilation", "toppers-section")}
                  className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] ${btn}`}
                >
                  View more in compilation
                  <IconArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>
        </FadeIn>


        {/* SECTION 6: WHAT YOU GET — Single compilation offer */}
        <FadeIn delay={40}>
          <section className="border-b border-black/[0.04] bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  The Complete Compilation
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
                      One Compilation
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
                      "50+ actual handwritten topper answer copy PDFs (GS1–4, Essay, Optional)",
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
                    <PayButton
                      amount={799}
                      tracking="upi-offer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-base ${btn}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                      Pay ₹799 — Get Instant Access
                    </PayButton>
                    <a
                      href={whatsappLink("Ultimate Compilation")}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="whatsapp-offer"
                      onClick={() => trackWhatsApp("Ultimate Compilation", "offer")}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 sm:px-8 sm:py-3.5 sm:text-base ${btn}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Chat on WhatsApp
                    </a>
                  </div>
                  <div className="relative mt-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-[10px] font-medium text-gray-400">
                        or try before you pay
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to see 3 sample answer copies before paying. From: upscprepnotes.in")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp-samples"
                    className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    See 3 sample copies — Pay after
                  </a>
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
                  <p className="text-sm text-gray-400 mt-1">Amount: <strong className="text-emerald-600">₹799</strong> (Ultimate Compilation)</p>
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
                          product: "Ultimate Compilation",
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
                    <a href={whatsappLink("Ultimate Compilation")} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold underline">
                      Chat on WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* SECTION 9: FAQ — Accordion */}
        <FadeIn delay={20}>
          <section className="border-b border-black/[0.04] bg-gray-50 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-gray-900 sm:text-2xl">
                Questions?
              </h2>
              <div className="mt-6 divide-y divide-black/[0.06] rounded-xl border border-black/[0.06] bg-white">
                {FAQS.map((faq, i) => (
                  <div key={faq.q}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:px-6"
                    >
                      {faq.q}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`shrink-0 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <p className="border-t border-black/[0.04] px-5 pb-4 pt-3 text-sm leading-relaxed text-gray-500 sm:px-6">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
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
          <PayButton
            amount={799}
            tracking="upi-mobile-sticky"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Get the Compilation
            <IconArrowRight size="14" />
          </PayButton>
        </div>
      </div>
    </>
  );
}
