"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MAY_2026 } from "@/lib/current-affairs-content";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const CANVAS = "#f6f5f4";
const SURFACE = "#ffffff";
const INK = "#000000";
const INK_SECONDARY = "#31302e";
const INK_MUTED = "#615d59";
const INK_FAINT = "#a39e98";
const HAIRLINE = "#e6e6e6";
const NOTION_BLUE = "#0075de";
const DARK_INDIGO = "#213183";

const STICKER: Record<string, string> = {
  sky: "#62aef0", purple: "#d6b6f6", pink: "#ff64c8",
  orange: "#dd5b00", teal: "#2a9d99", green: "#1aae39",
};

const SECTION_DOTS: Record<string, string> = {
  "National News": STICKER.sky,
  "International Relations & Summits": STICKER.purple,
  "Economy & Finance": STICKER.green,
  "Environment & Ecology": STICKER.teal,
  "Science & Technology": STICKER.orange,
  "Government Schemes & Policies": STICKER.pink,
  "Important Reports & Indices": STICKER.sky,
  "Awards & Honours": STICKER.purple,
  "Appointments": STICKER.teal,
  "Obituaries": INK_FAINT,
  "Sports": STICKER.orange,
  "Summits, Conferences & Important Days": STICKER.pink,
};

function dotColor(title: string) { return SECTION_DOTS[title] || INK_FAINT; }

function extractKeyData(body: string): string[] {
  const patterns = [
    /\d[\d,]*\s*(?:%|GW|MW|sq km|crore(?:\s*people)?|lakh(?:\s*crore)?|billion|trillion)/gi,
    /Rs\s[\d,]+(?:\s*(?:lakh|crore|billion|trillion))?/gi,
    /\b\d+(?:th|st|nd|rd)\s*(?:rank|position|place)?/gi,
    /(?:rank|position|No\.)\s*#?\d+/gi,
    /\$\s*[\d,]+(?:\s*(?:billion|trillion|million))?/gi,
  ];
  const results = new Set<string>();
  for (const pat of patterns) {
    const matches = body.match(pat);
    if (matches) matches.forEach((m) => results.add(m.trim()));
  }
  return [...results].slice(0, 4);
}

function sessionId() {
  return `ca-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function PillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-semibold tracking-[0.125px] text-white">
      {children}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="flex items-center gap-1 text-[13px] font-medium transition"
      style={{ color: INK_FAINT }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function CurrentAffairsPage() {
  const data = MAY_2026;
  const totalItems = data.sections.reduce((a, s) => a + s.items.length, 0);
  const sessionRef = useRef(sessionId());

  const [activeSection, setActiveSection] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [quizState, setQuizState] = useState<Record<number, {
    status: "idle" | "loading" | "ready" | "submitted";
    questions: QuizQuestion[]; answers: number[]; score: number | null;
  }>>({});

  const tabsRef = useRef<HTMLDivElement>(null);

  const toggleCard = useCallback((key: string) => {
    setExpandedCards((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const section = data.sections[activeSection];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const r: { si: number; ii: number; hl: string; body: string }[] = [];
    data.sections.forEach((s, si) => s.items.forEach((item, ii) => {
      if (item.headline.toLowerCase().includes(q) || item.body.toLowerCase().includes(q))
        r.push({ si, ii, hl: item.headline, body: item.body });
    }));
    return r;
  }, [searchQuery, data]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (viewAll || searchQuery) return;
      if (e.key === "ArrowLeft") setActiveSection((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setActiveSection((p) => Math.min(data.sections.length - 1, p + 1));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewAll, searchQuery, data.sections.length]);

  useEffect(() => {
    if (viewAll) return;
    const tabs = tabsRef.current;
    const active = tabs?.querySelector(`[data-active="true"]`);
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSection, viewAll]);

  async function generateQuiz(sectionIndex: number) {
    const s = data.sections[sectionIndex];
    setQuizState((p) => ({ ...p, [sectionIndex]: { status: "loading", questions: [], answers: [], score: null } }));
    const prompt = `You are a UPSC exam question generator. Create exactly 5 multiple choice questions based on these current affairs topics:

${s.items.map((item, i) => `${i + 1}. ${item.headline}: ${item.body.slice(0, 200)}`).join("\n\n")}

Format each question EXACTLY like this (one blank line between questions):

Q1: [question text]
A) [option]
B) [option]
C) [option]
D) [option]
Correct Answer: [A/B/C/D]
Explanation: [1-2 sentence explanation]

Q2: ... and so on for all 5 questions.`;

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, sessionId: sessionRef.current }),
      });
      if (!res.ok) throw new Error("API error");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      let text = "";
      const dec = new TextDecoder();
      while (true) { const { done, value } = await reader.read(); if (done) break; text += dec.decode(value, { stream: true }); }
      const questions = parseQuiz(text);
      if (!questions.length) throw new Error("parse fail");
      setQuizState((p) => ({ ...p, [sectionIndex]: { status: "ready", questions, answers: new Array(5).fill(-1), score: null } }));
    } catch {
      setQuizState((p) => ({ ...p, [sectionIndex]: { status: "idle", questions: [], answers: [], score: null } }));
    }
  }

  function submitQuiz(si: number) {
    const qs = quizState[si];
    if (!qs || !qs.questions.length) return;
    const score = qs.answers.reduce((a, ans, i) => (ans === qs.questions[i].correct ? a + 1 : a), 0);
    setQuizState((p) => ({ ...p, [si]: { ...p[si], status: "submitted", score } }));
  }

  function SectionContent({ s, si }: { s: typeof section; si: number }) {
    const dot = dotColor(s.title);
    const quiz = quizState[si];
    return (
      <div className="mb-20 last:mb-0">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: dot }} />
          <h2 className="text-[22px] font-bold tracking-[-0.25px]" style={{ color: INK }}>{s.title}</h2>
          <span style={{ color: INK_FAINT }} className="ml-auto text-[14px]">{s.items.length} items</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {s.items.map((item, ii) => {
            const key = `${si}-${ii}`;
            const expanded = expandedCards[key];
            const kd = extractKeyData(item.body);
            return (
              <div key={ii} className="rounded-xl p-5 transition hover:shadow-[0_0.175px_1.041px_rgba(0,0,0,0.01),0_0.8px_2.925px_rgba(0,0,0,0.02),0_2.025px_7.847px_rgba(0,0,0,0.027),0_4px_18px_rgba(0,0,0,0.04)]" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white" style={{ backgroundColor: dot }}>{ii + 1}</span>
                  <h3 className="flex-1 text-[15px] font-bold leading-snug tracking-[-0.125px]" style={{ color: INK }}>{item.headline}</h3>
                </div>
                <p className={`mt-3 text-[14px] leading-[1.5] transition-all`} style={{ color: INK_MUTED }}>{expanded ? item.body : item.body.length > 180 ? `${item.body.slice(0, 180)}…` : item.body}</p>
                {item.body.length > 180 && (
                  <button onClick={() => toggleCard(key)} className="mt-1 text-[13px] font-medium transition" style={{ color: INK_FAINT }}>{expanded ? "Show less" : "Read more"}</button>
                )}
                {kd.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {kd.map((d, di) => (
                      <span key={di} className="rounded px-2 py-0.5 text-[12px] font-medium" style={{ backgroundColor: CANVAS, border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>{d}</span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4 pt-3" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                  <Link href={`/ask?q=${encodeURIComponent(`Tell me more about: ${item.headline}`)}`} className="flex items-center gap-1 text-[13px] font-medium transition" style={{ color: NOTION_BLUE }}>Ask AI</Link>
                  <CopyBtn text={`${item.headline}\n\n${item.body.slice(0, 300)}`} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Quiz */}
        <div className="mt-6 rounded-xl p-5 sm:p-6" style={{ backgroundColor: CANVAS, border: `1px solid ${HAIRLINE}` }}>
          {(!quiz || quiz.status === "idle") && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold" style={{ color: INK }}>Test yourself</p>
                <p className="text-[14px] mt-0.5" style={{ color: INK_MUTED }}>Generate 5 MCQs from this section</p>
              </div>
              <button onClick={() => generateQuiz(si)} className="rounded-full px-5 py-2 text-[14px] font-semibold text-white transition hover:scale-95" style={{ backgroundColor: NOTION_BLUE }}>Generate Quiz</button>
            </div>
          )}
          {quiz?.status === "loading" && <div className="flex items-center gap-3 text-[14px]" style={{ color: INK_MUTED }}><span className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: HAIRLINE, borderTopColor: NOTION_BLUE }} />Generating questions…</div>}
          {quiz?.status === "ready" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-bold" style={{ color: INK }}>5 MCQs · Select the correct answer</p>
                <button onClick={() => submitQuiz(si)} disabled={quiz.answers.every((a) => a === -1)} className="rounded-full px-5 py-2 text-[13px] font-semibold text-white transition hover:scale-95 disabled:opacity-40" style={{ backgroundColor: NOTION_BLUE }}>Check Answers</button>
              </div>
              {quiz.questions.map((q, qi) => (
                <div key={qi} className="rounded-lg p-4" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                  <p className="text-[15px] font-bold" style={{ color: INK }}>Q{qi + 1}. {q.question}</p>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oi) => {
                      const sel = quiz.answers[qi] === oi;
                      return (
                        <button key={oi} onClick={() => { if (quiz.status !== "ready") return; const a = [...quiz.answers]; a[qi] = oi; setQuizState((p) => ({ ...p, [si]: { ...p[si], answers: a } })); }}
                          className="w-full rounded-lg border px-3 py-2 text-left text-[14px] transition" style={{ borderColor: sel ? NOTION_BLUE : HAIRLINE, backgroundColor: sel ? "#e8f4ff" : SURFACE, color: sel ? NOTION_BLUE : INK_SECONDARY }}>
                          <span className="font-medium">{String.fromCharCode(65 + oi)}</span> {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {quiz?.status === "submitted" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[15px] font-bold" style={{ color: INK }}>You scored {quiz.score ?? "?"} / {quiz.questions.length}</p>
                  <p className="text-[14px] mt-0.5" style={{ color: INK_MUTED }}>{quiz.score === 5 ? "Perfect!" : quiz.score !== null && quiz.score >= 3 ? "Good job!" : "Keep practicing"}</p>
                </div>
                <button onClick={() => generateQuiz(si)} className="rounded-full px-5 py-2 text-[13px] font-semibold text-white transition hover:scale-95" style={{ backgroundColor: NOTION_BLUE }}>Retry</button>
              </div>
              {quiz.questions.map((q, qi) => {
                const sel = quiz.answers[qi];
                const corr = q.correct;
                return (
                  <div key={qi} className="rounded-lg p-4 mb-3" style={{ backgroundColor: SURFACE, border: `1px solid ${sel === corr ? "#1aae39" : "#ff64c8"}`, borderLeftWidth: 3 }}>
                    <p className="text-[15px] font-bold" style={{ color: INK }}>Q{qi + 1}. {q.question}</p>
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isSel = sel === oi, isCorr = corr === oi;
                        let bg = SURFACE, bc = HAIRLINE, c = INK_SECONDARY;
                        if (isCorr) { bg = "#e8fae8"; bc = "#1aae39"; c = "#1aae39"; }
                        else if (isSel && !isCorr) { bg = "#fde8f0"; bc = "#ff64c8"; c = "#ff64c8"; }
                        return (
                          <div key={oi} className="rounded border px-3 py-1.5 text-[14px]" style={{ backgroundColor: bg, borderColor: bc, color: c }}>
                            <span className="font-medium">{String.fromCharCode(65 + oi)}</span> {opt}
                            {isCorr && <span className="ml-2 font-semibold" style={{ color: "#1aae39" }}>✓</span>}
                            {isSel && !isCorr && <span className="ml-2 font-semibold" style={{ color: "#ff64c8" }}>✗</span>}
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-[13px] italic" style={{ color: INK_FAINT }}>{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const showSearch = searchResults !== null && searchQuery.trim().length > 0;

  return (
    <main style={{ backgroundColor: CANVAS, minHeight: "100vh" }}>
      {/* ===== DARK HERO ===== */}
      <section className="relative overflow-hidden" style={{ backgroundColor: DARK_INDIGO }}>
        {/* Starfield */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 10% 20%, rgba(255,255,255,0.6), transparent),
                            radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.4), transparent),
                            radial-gradient(1.5px 1.5px at 50% 15%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 70% 45%, rgba(255,255,255,0.3), transparent),
                            radial-gradient(1.5px 1.5px at 85% 75%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 40% 85%, rgba(255,255,255,0.3), transparent),
                            radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.4), transparent),
                            radial-gradient(1.5px 1.5px at 15% 85%, rgba(255,255,255,0.5), transparent),
                            radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.25), transparent),
                            radial-gradient(1.5px 1.5px at 45% 35%, rgba(255,255,255,0.4), transparent)`
        }} />
        {/* Sticker orbs */}
        <div className="absolute -right-16 top-6 hidden sm:block w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: STICKER.sky }} />
        <div className="absolute -left-20 bottom-6 hidden sm:block w-28 h-28 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: STICKER.purple }} />
        <div className="absolute right-1/3 bottom-4 hidden sm:block w-16 h-16 rounded-full opacity-25 blur-2xl" style={{ backgroundColor: STICKER.orange }} />

        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 relative">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[12px] font-semibold tracking-[0.125px] text-white">
            Monthly Edition
          </span>
          <h1 className="mt-6 text-[54px] font-bold leading-[1.04] tracking-[-1.875px] text-white sm:text-[64px] sm:tracking-[-2.125px]">
            {data.month} {data.year}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.5]" style={{ color: "rgba(255,255,255,0.65)" }}>
            UPSC Monthly Current Affairs — {data.sections.length} sections, {totalItems} topics.
            Each topic includes key facts, data points, and context structured for quick revision.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/api/generate-current-affairs?month=may-2026"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-all hover:scale-95 active:scale-90"
              style={{ backgroundColor: NOTION_BLUE }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Link>
            <Link href="/store"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all hover:scale-95 active:scale-90"
              style={{ backgroundColor: SURFACE, color: INK, boxShadow: "0 0.175px 1.041px rgba(0,0,0,0.01),0 0.8px 2.925px rgba(0,0,0,0.02),0 2.025px 7.847px rgba(0,0,0,0.027),0 4px 18px rgba(0,0,0,0.04)" }}>
              Browse Store
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 -mt-8 relative z-10 pb-20">
        {/* ===== SEARCH ===== */}
        <div className="relative mb-6" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 8 }}>
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: INK_FAINT }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search across all 55 topics…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 text-[15px] outline-none rounded" style={{ backgroundColor: "transparent", color: INK }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: INK_FAINT }}>✕</button>
          )}
        </div>

        {/* ===== TOGGLE + TABS ===== */}
        <div className="sticky top-[calc(36px+theme(spacing.4))] z-40 pb-3" style={{ backgroundColor: CANVAS }}>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ backgroundColor: HAIRLINE }}>
              <button onClick={() => setViewAll(false)} className="rounded-md px-3 py-1 text-[12px] font-semibold transition"
                style={{ backgroundColor: !viewAll ? SURFACE : "transparent", color: !viewAll ? INK : INK_MUTED, boxShadow: !viewAll ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}>
                Tabbed
              </button>
              <button onClick={() => setViewAll(true)} className="rounded-md px-3 py-1 text-[12px] font-semibold transition"
                style={{ backgroundColor: viewAll ? SURFACE : "transparent", color: viewAll ? INK : INK_MUTED, boxShadow: viewAll ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}>
                View All
              </button>
            </div>
            {!viewAll && <span className="text-[12px]" style={{ color: INK_FAINT }}>← → navigate</span>}
          </div>
          {!viewAll && (
            <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-none">
              {data.sections.map((s, i) => (
                <button key={i} data-active={i === activeSection} onClick={() => setActiveSection(i)}
                  className="shrink-0 rounded-[8px] px-3.5 py-1.5 text-[12px] font-semibold transition whitespace-nowrap"
                  style={{
                    backgroundColor: i === activeSection ? DARK_INDIGO : SURFACE,
                    color: i === activeSection ? "#fff" : INK_SECONDARY,
                    border: i === activeSection ? "none" : `1px solid ${HAIRLINE}`,
                  }}>
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== SEARCH RESULTS ===== */}
        {showSearch && (
          <div className="mt-4 mb-8">
            {searchResults.length === 0 ? (
              <p className="text-[14px] py-8 text-center" style={{ color: INK_FAINT }}>No results for &ldquo;{searchQuery}&rdquo;</p>
            ) : (
              <div className="space-y-2">
                <p className="text-[14px]" style={{ color: INK_FAINT }}>{searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;</p>
                <div className="space-y-2">
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={() => { setSearchQuery(""); setActiveSection(r.si); setViewAll(false); }}
                      className="w-full rounded-xl p-4 text-left transition hover:shadow-[0_0.175px_1.041px_rgba(0,0,0,0.01),0_0.8px_2.925px_rgba(0,0,0,0.02),0_2.025px_7.847px_rgba(0,0,0,0.027),0_4px_18px_rgba(0,0,0,0.04)]"
                      style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                      <div className="flex items-center gap-2 text-[13px] mb-1" style={{ color: INK_FAINT }}>
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor(data.sections[r.si].title) }} />
                        {data.sections[r.si].title}
                      </div>
                      <p className="text-[15px] font-semibold tracking-[-0.125px]" style={{ color: INK }}>{r.hl}</p>
                      <p className="text-[14px] mt-1 line-clamp-1" style={{ color: INK_MUTED }}>{r.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CONTENT ===== */}
        {!showSearch && (
          <>
            {viewAll ? (
              <div className="mt-6 space-y-4">
                {data.sections.map((s, si) => <SectionContent key={si} s={s} si={si} />)}
              </div>
            ) : (
              <div className="mt-6" key={activeSection}>
                <SectionContent s={section} si={activeSection} />
              </div>
            )}

            {/* ===== PREV / NEXT ===== */}
            {!viewAll && (
              <div className="mt-8 flex items-center justify-between gap-4 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                <button onClick={() => setActiveSection(Math.max(0, activeSection - 1))} disabled={activeSection === 0}
                  className="flex items-center gap-1.5 rounded-[8px] px-4 py-2 text-[14px] font-medium transition disabled:opacity-30" style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}`, backgroundColor: SURFACE }}>
                  ← Previous
                </button>
                <div className="hidden sm:flex items-center gap-1.5">
                  {data.sections.map((_, i) => (
                    <button key={i} onClick={() => setActiveSection(i)} className="h-2 w-2 rounded-full transition"
                      style={{ backgroundColor: i === activeSection ? DARK_INDIGO : HAIRLINE }} />
                  ))}
                </div>
                <button onClick={() => setActiveSection(Math.min(data.sections.length - 1, activeSection + 1))} disabled={activeSection === data.sections.length - 1}
                  className="flex items-center gap-1.5 rounded-[8px] px-4 py-2 text-[14px] font-medium transition disabled:opacity-30" style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}`, backgroundColor: SURFACE }}>
                  Next →
                </button>
              </div>
            )}

            {/* ===== FOOTER ===== */}
            <footer className="mt-16 rounded-xl p-8 text-center sm:p-10" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold" style={{ borderColor: NOTION_BLUE, color: NOTION_BLUE }}>
                Prepare smarter
              </span>
              <h2 className="mt-4 text-[26px] font-bold tracking-[-0.625px]" style={{ color: INK }}>Get the full PDF + more</h2>
              <p className="mt-2 text-[15px]" style={{ color: INK_MUTED }}>
                Download the complete {data.month} {data.year} edition as a PDF for offline study, or browse our store for curated UPSC products.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/api/generate-current-affairs?month=may-2026"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition hover:scale-95" style={{ backgroundColor: NOTION_BLUE }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </Link>
                <Link href="/store" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition hover:scale-95"
                  style={{ backgroundColor: SURFACE, color: INK, border: `1px solid ${HAIRLINE}`, boxShadow: "0 0.175px 1.041px rgba(0,0,0,0.01),0 0.8px 2.925px rgba(0,0,0,0.02),0 2.025px 7.847px rgba(0,0,0,0.027),0 4px 18px rgba(0,0,0,0.04)" }}>
                  Browse Store →
                </Link>
              </div>
              <p className="mt-5 text-[14px]" style={{ color: INK_FAINT }}>UPSCPrepNotes · {data.month} {data.year} Edition · Updated monthly</p>
            </footer>
          </>
        )}
      </div>

      <style>{`.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.8s linear infinite; }`}</style>
    </main>
  );
}

function parseQuiz(text: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const blocks = text.split(/(?=Q\d+:)/g);
  for (const block of blocks) {
    if (!block.trim()) continue;
    const q = block.match(/Q\d+:\s*(.+?)(?:\n|$)/);
    const a = block.match(/A\)\s*(.+?)(?:\n|$)/);
    const b = block.match(/B\)\s*(.+?)(?:\n|$)/);
    const c = block.match(/C\)\s*(.+?)(?:\n|$)/);
    const d = block.match(/D\)\s*(.+?)(?:\n|$)/);
    const cr = block.match(/Correct Answer:\s*([A-D])/i);
    const ex = block.match(/Explanation:\s*(.+?)(?:\n|$)/);
    if (!q || !a || !b || !c || !d || !cr) continue;
    const ci: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    const idx = ci[cr[1].toUpperCase()];
    if (idx === undefined) continue;
    questions.push({ id: questions.length + 1, question: q[1].trim(), options: [a[1].trim(), b[1].trim(), c[1].trim(), d[1].trim()], correct: idx, explanation: ex ? ex[1].trim() : "" });
    if (questions.length >= 5) break;
  }
  return questions;
}
