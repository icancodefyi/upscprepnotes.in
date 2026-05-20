"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PurchaseModal from "./PurchaseModal";

const TOPPERS = [
  { name: "Saurabh Sharma", rank: "AIR 23", highlight: "136 in Essay", speciality: "Art of Brainstorming" },
  { name: "Animesh Pradhan", rank: "AIR 2", highlight: "109 in GS1", speciality: "Presentations & Diagrams" },
  { name: "Kunal Rastogi", rank: "AIR 15", highlight: "134 in GS2", speciality: "Tabular Format Answers" },
  { name: "Shaurya Arora", rank: "AIR 14", highlight: "101 in GS3", speciality: "Argument & Example Method" },
  { name: "Aditya Shrivastava", rank: "AIR 1", highlight: "143 in GS4", speciality: "Multi-dimensional Approach" },
];

const PAPER_BENEFITS = [
  { paper: "GS1", highlights: ["Maps & diagrams in answers", "Visual storytelling", "Micro-diagrams for complex topics"] },
  { paper: "GS2", highlights: ["Policy-based crisp answers", "Real-world case studies", "Tabular data presentation"] },
  { paper: "GS3", highlights: ["Argument & counter-argument", "Data-driven answers", "Current affairs integration"] },
  { paper: "GS4", highlights: ["Stakeholder approach", "Ethical frameworks", "Case study structure"] },
  { paper: "Essay", highlights: ["Brainstorming techniques", "Connecting phrases", "Multi-dimensional essays"] },
];

const TESTIMONIALS = [
  { name: "Amit Pandey", text: "I was struggling with answer structure. Looking at actual topper copies showed me exactly how to organize my thoughts. The marks-wise compilation helped me focus on what actually works." },
  { name: "Priya Sharma", text: "The IBEC method is a game changer. I went from writing average answers to understanding how top scorers approach each paper. The GS2 and GS3 copies were especially helpful." },
  { name: "Rahul Verma", text: "I had seen topper strategies before but never actual answer copies. Seeing how they use diagrams, tables, and structure their answers gave me a clear roadmap for my own preparation." },
  { name: "Divya Patel", text: "What sets this apart is the marks-wise organisation. Instead of guessing which topper to follow, I could directly study copies that scored highest in each paper. Highly recommended." },
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

export default function SalesPage() {
  const [modalPkg, setModalPkg] = useState<{ name: string; price: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* STICKY TOP BAR */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <p className="text-sm font-medium">
            50+ Topper Copies <span className="text-muted-foreground">• Marks Wise</span>
          </p>
          <Button
            onClick={() => setModalPkg({ name: "All", price: "999" })}
            className="rounded-full px-6 py-2 text-xs"
          >
            Buy at ₹999
          </Button>
        </div>
      </div>

      <main className="min-h-screen">
        {modalPkg && (
          <PurchaseModal pkg={modalPkg} onClose={() => setModalPkg(null)} />
        )}

        <div className="mx-auto max-w-5xl px-6 pb-32 pt-10">
          {/* BREADCRUMB */}
          <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">Home</Link>
            <span>&bull;</span>
            <span className="text-muted-foreground">Answer Copy Compilation</span>
          </div>

          {/* ═══ HERO ═══ */}
          <section className="mb-20">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
              50+ Topper Copies
            </Badge>
            <Badge className="rounded-full px-3 py-1 text-xs font-medium">
              Marks Wise • Not Rank Wise
            </Badge>
          </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl leading-[1.1] max-w-4xl">
              Score 120+ Marks in Each GS Paper
              <br />
              <span className="text-muted-foreground">via 50+ Toppers Using IBEC Method</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              India&apos;s first marks-wise UPSC topper answer copy compilation.
              Verified copies across GS1&ndash;4 and Essay. Learn the exact
              technique that helped toppers score in the top 1 percentile.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => setModalPkg({ name: "All", price: "999" })}
                className="rounded-full px-10 shadow-lg shadow-primary/20"
              >
                Buy Now — ₹999
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <span>Instant Digital Access</span>
              <span>Verified Copies</span>
              <span>Lifetime Updates</span>
              <span>PDF Format</span>
            </div>

            {/* BENEFITS */}
            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Get answer copies of toppers in each paper (Verified Only)",
                "Handwritten Answers from 20+ toppers",
                "Includes Micro-diagrams, Data, Facts, Examples",
                "All GS Papers — GS1, GS2, GS3, GS4 & Essay Covered",
              ].map((text) => (
                <Card key={text} className="rounded-2xl border-border/50">
                  <CardContent className="flex items-start gap-3 p-5">
                    <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                    <p className="text-sm leading-6 text-muted-foreground">{text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ═══ IBEC METHOD ═══ */}
          <section className="mb-20 border-t border-border pt-12 md:pt-16">
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

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  letter: "I", title: "Introductions",
                  points: [
                    "Start with clear, focused introductions for strong impact",
                    "Use quotes or data to set context quickly",
                    "Align introductions precisely with the question's demand",
                  ],
                },
                {
                  letter: "B", title: "Body",
                  points: [
                    "Write concise, direct answers without extra details",
                    "Use tables, diagrams, and bullet points for clarity",
                    "Include relevant facts, examples, and visuals effectively",
                  ],
                },
                {
                  letter: "E", title: "Enhancements",
                  points: [
                    "Use quick diagrams and maps to boost answers",
                    "Recycle points for multidimensional coverage",
                    "Integrate perspectives from multiple subjects easily",
                  ],
                },
                {
                  letter: "C", title: "Conclusions",
                  points: [
                    "Summarize key points without repeating content",
                    "End with solutions or forward-looking statements",
                    "Keep conclusions concise and impactful",
                  ],
                },
              ].map((step) => (
                <Card key={step.letter} className="rounded-3xl border-border/50 transition duration-300 hover:-translate-y-[2px]">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                      {step.letter}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      Learn the Perfect {step.title}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {step.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                          <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ═══ TOPPERS ═══ */}
          <section className="mb-20 border-t border-border pt-12 md:pt-16">
            <div className="mb-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Featured Toppers
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Learn from the Best
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {TOPPERS.map((t) => (
                <Card key={t.name} className="rounded-3xl border-border/50 transition duration-300 hover:-translate-y-[2px]">
                  <CardContent className="p-6">
                    <Badge className="mb-4 rounded-2xl px-4 py-2 text-xs font-medium">
                      {t.rank}
                    </Badge>
                    <h3 className="text-2xl font-semibold tracking-tight">{t.name}</h3>
                    <div className="mt-4 space-y-3">
                      {[
                        `Scored ${t.highlight} (Top 1 percentile)`,
                        `Specialises in ${t.speciality}`,
                        "Learn directly from their verified answer copies",
                      ].map((line) => (
                        <div key={line} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                          <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                          {line}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ═══ PAPER-WISE BREAKDOWN ═══ */}
          <section className="mb-20 border-t border-border pt-12 md:pt-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Paper-wise Expertise
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                What Each Paper Covers
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PAPER_BENEFITS.map((p) => (
                <Card key={p.paper} className="rounded-3xl border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <Badge className="mb-4 rounded-full px-4 py-1 text-xs font-medium">
                      {p.paper}
                    </Badge>
                    <ul className="space-y-4">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                          <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                onClick={() => setModalPkg({ name: "All", price: "999" })}
                className="rounded-full px-10"
              >
                Start Learning — ₹999
              </Button>
            </div>
          </section>

          {/* ═══ PRICING ═══ */}
          <section className="mb-20 border-t border-border pt-12 md:pt-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Pricing
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Invest in Your Answer Writing
              </h2>
            </div>

            <div className="mx-auto max-w-md">
              <Card className="rounded-3xl border-border p-8 text-center">
                <CardContent className="p-0">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Complete Compilation
                  </p>
                  <p className="mt-6 text-6xl font-bold tracking-tight">₹999</p>
                  <p className="mt-2 text-sm text-muted-foreground line-through">₹4,999</p>
                  <p className="mt-2 text-xs text-muted-foreground">Save 80%</p>
                  <Button
                    size="lg"
                    onClick={() => setModalPkg({ name: "All", price: "999" })}
                    className="mt-8 w-full rounded-full px-8"
                  >
                    Buy Now — ₹999
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* WHAT'S INCLUDED */}
            <div className="mt-12 mx-auto max-w-xl">
              <h3 className="mb-6 text-center text-lg font-semibold">What&apos;s Included</h3>
              <div className="space-y-4">
                {WHATS_INCLUDED.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ TESTIMONIALS ═══ */}
          <section className="mb-20 border-t border-border pt-12 md:pt-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Testimonials
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                What Aspirants Say
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} className="rounded-3xl border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <p className="leading-8 text-foreground">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <p className="mt-6 text-sm font-medium">{t.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ═══ FAQ ═══ */}
          <section className="mb-16 border-t border-border pt-12 md:pt-16">
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
                  <h3 className="text-base font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ FINAL CTA ═══ */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to Improve Your Answer Writing?
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base leading-7 text-muted-foreground">
              50+ topper copies. Marks-wise organised. Instant access.
            </p>
            <Button
              size="lg"
              onClick={() => setModalPkg({ name: "All", price: "999" })}
              className="mt-8 rounded-full px-12 shadow-lg"
            >
              Buy Now — ₹999
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Instant digital access &bull; PDF format &bull; Lifetime updates
            </p>
          </section>

          {/* FOOTER NOTE */}
          <p className="mt-20 text-center text-xs text-muted-foreground">
            UPSCPrepNotes is an independent educational platform. Answer copies are
            sourced from publicly available materials for educational reference purposes.
          </p>
        </div>

        {/* FLOATING BOTTOM CTA */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/90 backdrop-blur-md transition-all duration-300 ${
            scrolled ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <div>
              <p className="text-sm font-medium">50+ Topper Answer Copy Compilation</p>
              <p className="text-xs text-muted-foreground">Marks Wise • IBEC Method • Lifetime Access</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold">₹999</p>
              <Button
                onClick={() => setModalPkg({ name: "All", price: "999" })}
                className="rounded-full px-8"
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
