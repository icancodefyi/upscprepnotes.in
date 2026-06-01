"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  },
  {
    name: "Animesh Pradhan",
    rank: "AIR 2",
    highlight: "109 in GS1 (Top 1%)",
    speciality: "Presentations & Diagrams",
  },
  {
    name: "Kunal Rastogi",
    rank: "AIR 15",
    highlight: "134 in GS2 (Top 1%)",
    speciality: "Tabular Format Answers",
  },
  {
    name: "Shaurya Arora",
    rank: "AIR 14",
    highlight: "101 in GS3 (Top 1%)",
    speciality: "Argument & Example Method",
  },
  {
    name: "Aditya Shrivastava",
    rank: "AIR 1",
    highlight: "143 in GS4 (Top 1%)",
    speciality: "Multi-dimensional Approach",
  },
];

const TESTIMONIALS = [
  {
    name: "Amit Pandey",
    text: "I was struggling with answer structure. Looking at actual topper copies showed me exactly how to organize my thoughts. The marks-wise compilation helped me focus on what actually works.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    text: "The IBEC method is a game changer. I went from writing average answers to understanding how top scorers approach each paper. The GS2 and GS3 copies were especially helpful.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    text: "I had seen topper strategies before but never actual answer copies. Seeing how they use diagrams, tables, and structure their answers gave me a clear roadmap for my own preparation.",
    rating: 5,
  },
  {
    name: "Divya Patel",
    text: "What sets this apart is the marks-wise organisation. Instead of guessing which topper to follow, I could directly study copies that scored highest in each paper. Highly recommended.",
    rating: 5,
  },
];

const FAQS = [
  { q: "How many topper copies are included?", a: "50+ topper copies across GS1, GS2, GS3, GS4, and Essay papers." },
  { q: "Are the copies verified?", a: "Yes. Every copy is verified for authenticity and marks accuracy against published UPSC results." },
  { q: "What format will I receive?", a: "Individual PDFs for each paper, organized by topper and by subject. Instant digital access." },
  { q: "Is this a physical book?", a: "Currently available in digital PDF format only. Instant access after purchase." },
];

const WHATS_INCLUDED = [
  "GS1, GS2, GS3, GS4, and Essay answer copies",
  "Handwritten copies from 5+ toppers in each paper",
  "Marks-wise compilation — sorted by score, not by rank",
  "Micro-diagrams, data, facts, maps, and case studies",
  "Instant digital access (PDF format)",
  "Lifetime updates — new copies added regularly",
];

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

function useTimer() {
  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState(600);
  const [expired, setExpired] = useState(false);
  const DURATION = 600;

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("salesTimerEnd");
    let end: number;

    if (stored) {
      end = parseInt(stored, 10);
      const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
      if (remaining <= 0) {
        end = Date.now() + DURATION * 1000;
        localStorage.setItem("salesTimerEnd", String(end));
        setSeconds(DURATION);
      } else {
        setSeconds(remaining);
      }
    } else {
      end = Date.now() + DURATION * 1000;
      localStorage.setItem("salesTimerEnd", String(end));
      setSeconds(DURATION);
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining <= 0) {
        setExpired(true);
        const newEnd = Date.now() + DURATION * 1000;
        end = newEnd;
        localStorage.setItem("salesTimerEnd", String(newEnd));
        setSeconds(DURATION);
        setExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return { mounted, expired, display: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}` };
}

function PlaceholderImage({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/30 md:min-h-[280px]">
      <div className="px-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">Preview image</p>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ibecSlides, setIbecSlides] = useState<Record<string, number>>({});
  const { mounted, expired, display } = useTimer();

  useEffect(() => {
    trackViewItem("Topper Answer Copy Compilation", 999);
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextSlide = useCallback(
    (step: string, total: number) =>
      setIbecSlides((prev) => ({
        ...prev,
        [step]: ((prev[step] || 0) + 1) % total,
      })),
    []
  );

  const prevSlide = useCallback(
    (step: string, total: number) =>
      setIbecSlides((prev) => ({
        ...prev,
        [step]: ((prev[step] || 0) - 1 + total) % total,
      })),
    []
  );

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-primary/5 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-medium text-foreground sm:text-sm md:gap-3">
          {mounted ? (
            expired ? (
              <span>Limited time offer — grab it now</span>
            ) : (
              <>
                <span>Limited Time Offer</span>
                <span className="hidden sm:inline">—</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 font-mono text-sm tracking-wider text-primary">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {display}
                </span>
              </>
            )
          ) : (
            <span>Limited Time Offer</span>
          )}
        </div>
      </div>

      {/* STICKY TOP BAR */}
      <div
        className={`fixed left-0 right-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ top: "41px" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2.5">
          <p className="text-xs font-medium sm:text-sm">
            50+ Topper Copies <span className="text-muted-foreground">• Marks Wise</span>
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            size="sm"
            className="rounded-full px-5 text-xs"
          >
            ₹999
          </Button>
        </div>
      </div>

      <main className="min-h-screen">
        {modalOpen && <PurchaseModal onClose={() => setModalOpen(false)} />}

        <div className="mx-auto max-w-5xl px-5 pb-28 pt-24 sm:px-6 sm:pt-28">
          {/* HERO */}
          <section className="mb-16 md:mb-20">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-medium">
                50+ Topper Copies
              </Badge>
              <Badge className="rounded-full px-3 py-1 text-[10px] font-medium">
                Marks Wise • Not Rank Wise
              </Badge>
            </div>

            <h1 className="max-w-4xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Score 120+ Marks in Each GS Paper
              <br />
              <span className="text-muted-foreground">
                via 50+ Toppers Using the IBEC Method
              </span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-sm">★★★★★</span>
                <span className="text-sm font-semibold">4.8/5</span>
              </div>
              <span className="text-xs text-muted-foreground">(190+ verified reviews)</span>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base md:text-lg">
              India&apos;s first marks-wise UPSC topper answer copy compilation.
              Verified copies across GS1&ndash;4 and Essay. Learn the exact
              technique that helped toppers score in the top 1 percentile.
            </p>

            <div className="mt-6 space-y-2.5 text-sm sm:text-base">
              {[
                "Get answer copies of toppers in each paper (Verified ONLY)",
                "Handwritten Answers from 20+ toppers",
                "Includes Micro-diagrams, Data, Facts, Examples",
                "All GS Papers — GS1, GS2, GS3, GS4 & Essay Covered",
                "Learn the subject specific way of writing answers",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-sm text-primary">&#10003;</span>
                  <span className="leading-6 text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                onClick={() => setModalOpen(true)}
                className="rounded-full px-10 shadow-lg shadow-primary/20"
              >
                Buy Now — ₹999
              </Button>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {mounted && <span>Price drops in {display}</span>}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> Instant Digital Access</span>
              <span className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> Verified Copies</span>
              <span className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> Lifetime Updates</span>
              <span className="flex items-center gap-1.5"><span className="text-primary">&#10003;</span> PDF Format</span>
            </div>
          </section>

          {/* IBEC METHOD */}
          <section className="mb-16 border-t border-border pt-12 md:mb-20 md:pt-16">
            <div className="mb-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                The Framework
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                What Is the IBEC Method?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                A proven answer-writing framework used by top 1% scorers. Four stages
                that transform average answers into high-scoring responses.
              </p>
            </div>

            <div className="space-y-8">
              {IBEC_STEPS.map((step, i) => {
                const slideIndex = ibecSlides[step.letter] || 0;
                const totalSlides = 5;

                return (
                  <div
                    key={step.letter}
                    className={`flex flex-col gap-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm md:gap-10 md:p-10 ${
                      i % 2 === 1 ? "md:flex-row-reverse" : ""
                    } md:flex-row`}
                  >
                    <div className="w-full md:w-1/2">
                      <div className="relative">
                        <PlaceholderImage label={`${step.title} Example ${slideIndex + 1}`} />
                        <div className="mt-3 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => prevSlide(step.letter, totalSlides)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition hover:bg-muted"
                            aria-label="Previous"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                          </button>
                          <div className="flex gap-1.5">
                            {Array.from({ length: totalSlides }).map((_, j) => (
                              <span
                                key={j}
                                className={`h-1.5 w-1.5 rounded-full transition ${
                                  j === slideIndex ? "bg-primary" : "bg-border"
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => nextSlide(step.letter, totalSlides)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition hover:bg-muted"
                            aria-label="Next"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col justify-center md:w-1/2">
                      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {step.letter}
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        Learn the Perfect {step.title}
                      </h3>
                      <div className="mt-5 space-y-3">
                        {step.points.map((point) => (
                          <div key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                            <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                            {point}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button
                          onClick={() => setModalOpen(true)}
                          variant="outline"
                          className="rounded-full px-6"
                        >
                          See Examples &rarr;
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TOPPERS */}
          <section className="mb-16 border-t border-border pt-12 md:mb-20 md:pt-16">
            <div className="mb-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Featured Toppers
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Learn from the Best
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Every copy is verified against published UPSC results.
                Study the exact answers that scored in the top 1%.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TOPPERS.map((t) => (
                <Card
                  key={t.name}
                  className="group rounded-3xl border-border/50 transition duration-300 hover:-translate-y-[2px] hover:shadow-lg"
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-border/50 bg-muted/30">
                      <img
                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.name.replace(/\s+/g, "")}`}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <Badge className="mb-3 rounded-full px-4 py-1.5 text-xs font-semibold">
                      {t.rank}
                    </Badge>

                    <h3 className="text-xl font-semibold tracking-tight">{t.name}</h3>

                    <div className="mt-5 space-y-2.5 text-left text-sm leading-6">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                        <span className="text-muted-foreground">Scored {t.highlight}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                        <span className="text-muted-foreground">Specialises in {t.speciality}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                        <span className="text-muted-foreground">Learn directly from verified answer copies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section className="mb-16 border-t border-border pt-12 md:mb-20 md:pt-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Pricing
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Invest in Your Answer Writing
              </h2>
            </div>

            <div className="mx-auto max-w-md">
              <Card className="overflow-hidden rounded-3xl border-border/50 shadow-lg">
                <div className="bg-primary/5 px-6 py-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Limited Time Offer
                  </p>
                  {mounted && (
                    <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Price drops in {display}
                    </p>
                  )}
                </div>
                <CardContent className="p-8 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Complete Compilation
                  </p>

                  <div className="mt-4 flex items-baseline justify-center gap-3">
                    <span className="text-5xl font-bold tracking-tight sm:text-6xl">₹999</span>
                    <span className="text-base text-muted-foreground line-through">₹4,999</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Save 80%</p>

                  <Button
                    size="lg"
                    onClick={() => setModalOpen(true)}
                    className="mt-8 w-full rounded-full py-6 text-base shadow-lg"
                  >
                    Buy Now — ₹999
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mx-auto mt-12 max-w-xl">
              <h3 className="mb-6 text-center text-base font-semibold">What&apos;s Included</h3>
              <div className="space-y-3">
                {WHATS_INCLUDED.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-6">
                    <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="mb-16 rounded-3xl bg-primary/5 px-6 py-12 md:mb-20 md:px-12 md:py-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Testimonials
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                What Aspirants Say
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} className="rounded-2xl border-border/50 shadow-sm">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex gap-1 text-amber-400 text-sm">{"★".repeat(t.rating)}</div>
                    <p className="mt-4 leading-7 text-foreground">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <p className="mt-5 text-sm font-semibold">{t.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16 border-t border-border pt-12 md:mb-20 md:pt-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                FAQ
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mx-auto max-w-3xl divide-y divide-border">
              {FAQS.map((faq) => (
                <div key={faq.q} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold sm:text-base">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to Improve Your Answer Writing?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              50+ topper copies. Marks-wise organised. Instant access.
            </p>
            {mounted && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Offer ends in {display}
              </p>
            )}
            <Button
              size="lg"
              onClick={() => setModalOpen(true)}
              className="mt-6 rounded-full px-12 shadow-lg"
            >
              Buy Now — ₹999
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Instant digital access &bull; PDF format &bull; Lifetime updates
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              Have questions?{" "}
              <a
                href="https://wa.me/919152750079?text=Hi!%20I%20have%20a%20question%20about%20the%20topper%20answer%20copy%20compilation."
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Chat on WhatsApp &rarr;
              </a>
            </p>
          </section>

          {/* FOOTER NOTE */}
          <p className="mt-16 text-center text-[11px] text-muted-foreground">
            UPSCPrepNotes is an independent educational platform. Answer copies are
            sourced from publicly available materials for educational reference purposes.
          </p>
        </div>

        {/* WHATSAPP FLOATING BUTTON */}
        <a
          href="https://wa.me/919152750079?text=Hi!%20I%20want%20to%20know%20more%20about%20the%20topper%20answer%20copy%20compilation."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:shadow-xl sm:bottom-24"
          aria-label="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        {/* FLOATING BOTTOM CTA */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/90 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-6">
            <div className="min-w-0 flex-1 pr-4">
              <p className="truncate text-sm font-medium">50+ Topper Answer Copy Compilation</p>
              <p className="truncate text-xs text-muted-foreground">Marks Wise &bull; IBEC Method &bull; Lifetime Access</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <p className="text-base font-bold sm:text-lg">₹999</p>
              <Button
                onClick={() => setModalOpen(true)}
                className="rounded-full px-6 text-xs sm:px-8 sm:text-sm"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
