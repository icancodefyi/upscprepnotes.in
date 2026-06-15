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

const SECTION_COLORS: Record<string, string> = {
  "National News": "bg-blue-500",
  "International Relations & Summits": "bg-indigo-500",
  "Economy & Finance": "bg-emerald-500",
  "Environment & Ecology": "bg-teal-500",
  "Science & Technology": "bg-violet-500",
  "Government Schemes & Policies": "bg-amber-500",
  "Important Reports & Indices": "bg-rose-500",
  "Awards & Honours": "bg-yellow-500",
  "Appointments": "bg-cyan-500",
  "Obituaries": "bg-gray-400",
  "Sports": "bg-orange-500",
  "Summits, Conferences & Important Days": "bg-pink-500",
};

const SECTION_BG: Record<string, string> = {
  "National News": "bg-blue-50",
  "International Relations & Summits": "bg-indigo-50",
  "Economy & Finance": "bg-emerald-50",
  "Environment & Ecology": "bg-teal-50",
  "Science & Technology": "bg-violet-50",
  "Government Schemes & Policies": "bg-amber-50",
  "Important Reports & Indices": "bg-rose-50",
  "Awards & Honours": "bg-yellow-50",
  "Appointments": "bg-cyan-50",
  "Obituaries": "bg-gray-100",
  "Sports": "bg-orange-50",
  "Summits, Conferences & Important Days": "bg-pink-50",
};

function extractKeyData(body: string): string[] {
  const patterns = [
    /\d[\d,]*\s*(?:%|GW|MW|sq km|crore(?:\s*people)?|lakh(?:\s*crore)?|billion|trillion)/gi,
    /Rs\s[\d,]+(?:\s*(?:lakh|crore|billion|trillion))?/gi,
    /\b\d+(?:th|st|nd|rd)\s*(?:rank|position|place)?/gi,
    /(?:rank|position|No\.)\s*#?\d+/gi,
    /\$\s*[\d,]+(?:\s*(?:billion|trillion|million))?/gi,
    /\d[\d,]*\s*(?:MW|GW|sq\s*km)/gi,
  ];
  const results = new Set<string>();
  for (const pat of patterns) {
    const matches = body.match(pat);
    if (matches) matches.forEach((m) => results.add(m.trim()));
  }
  return [...results].slice(0, 5);
}

function generateSessionId(): string {
  return `ca-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function SectionTab({
  title, active, onClick
}: {
  title: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "bg-[#1a1a2e] text-white shadow-sm"
          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300 hover:text-gray-900"
      }`}
    >
      {title}
    </button>
  );
}

function Dot({ filled }: { filled: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full transition-all ${
        filled ? "bg-[#1a1a2e] scale-125" : "bg-gray-200"
      }`}
    />
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 transition"
    >
      {copied ? (
        <>Copied</>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function CurrentAffairsPage() {
  const data = MAY_2026;
  const totalItems = data.sections.reduce((acc, s) => acc + s.items.length, 0);

  const [activeSection, setActiveSection] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [quizState, setQuizState] = useState<Record<number, {
    status: "idle" | "loading" | "ready" | "submitted";
    questions: QuizQuestion[];
    answers: number[];
    score: number | null;
  }>>({});
  const [readingProgress, setReadingProgress] = useState(0);

  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(generateSessionId());

  const toggleCard = useCallback((key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const section = data.sections[activeSection];
  const sectionColor = SECTION_COLORS[section?.title] || "bg-gray-400";

  // Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: { sectionIndex: number; itemIndex: number; headline: string; body: string }[] = [];
    data.sections.forEach((s, si) => {
      s.items.forEach((item, ii) => {
        if (item.headline.toLowerCase().includes(q) || item.body.toLowerCase().includes(q)) {
          results.push({ sectionIndex: si, itemIndex: ii, headline: item.headline, body: item.body });
        }
      });
    });
    return results;
  }, [searchQuery, data]);

  // Keyboard nav
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (viewAll || searchQuery) return;
      if (e.key === "ArrowLeft") {
        setActiveSection((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveSection((prev) => Math.min(data.sections.length - 1, prev + 1));
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewAll, searchQuery, data.sections.length]);

  // Reading progress
  useEffect(() => {
    function handleScroll() {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setReadingProgress(100);
        return;
      }
      const scrolled = -rect.top;
      const pct = Math.min(100, Math.max(0, Math.round((scrolled / total) * 100)));
      setReadingProgress(pct);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll active tab into view
  useEffect(() => {
    if (viewAll) return;
    const tabs = tabsRef.current;
    if (!tabs) return;
    const active = tabs.querySelector(`[data-active="true"]`);
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSection, viewAll]);

  // Generate quiz
  async function generateQuiz(sectionIndex: number) {
    const s = data.sections[sectionIndex];
    setQuizState((prev) => ({
      ...prev,
      [sectionIndex]: { status: "loading", questions: [], answers: [], score: null },
    }));

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
        body: JSON.stringify({ message: prompt, sessionId: sessionIdRef.current }),
      });
      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      let fullText = "";
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const questions = parseQuizQuestions(fullText);
      if (questions.length === 0) throw new Error("Could not parse questions");

      setQuizState((prev) => ({
        ...prev,
        [sectionIndex]: { status: "ready", questions, answers: new Array(5).fill(-1), score: null },
      }));
    } catch {
      setQuizState((prev) => ({ ...prev, [sectionIndex]: { status: "idle", questions: [], answers: [], score: null } }));
    }
  }

  function submitQuiz(sectionIndex: number) {
    const qs = quizState[sectionIndex];
    if (!qs || qs.questions.length === 0) return;
    const score = qs.answers.reduce((acc, ans, i) => (ans === qs.questions[i].correct ? acc + 1 : acc), 0);
    setQuizState((prev) => ({
      ...prev,
      [sectionIndex]: { ...prev[sectionIndex], status: "submitted", score },
    }));
  }

  function renderSectionContent(s: typeof section, si: number) {
    const dot = SECTION_COLORS[s.title] || "bg-gray-400";
    const bg = SECTION_BG[s.title] || "bg-gray-50";
    const quiz = quizState[si];

    return (
      <div key={si} className="mb-16 last:mb-0">
        <div className="flex items-center gap-3 mb-6">
          <span className={`h-3 w-3 rounded-full ${dot}`} />
          <h2 className="text-lg font-bold tracking-tight text-[#1a1a2e]">
            {s.title}
          </h2>
          <span className="ml-auto text-xs text-gray-400">{s.items.length} items</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {s.items.map((item, ii) => {
            const key = `${si}-${ii}`;
            const expanded = expandedCards[key];
            const keyData = extractKeyData(item.body);

            return (
              <div
                key={ii}
                className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${dot}`}>
                    {ii + 1}
                  </span>
                  <h3 className="flex-1 text-sm font-bold leading-snug text-[#1a1a2e]">
                    {item.headline}
                  </h3>
                </div>

                <div className="relative">
                  <p className={`mt-3 text-xs leading-[1.7] text-gray-500 transition-all ${expanded ? "" : "line-clamp-2"}`}>
                    {item.body}
                  </p>
                  {item.body.length > 180 && (
                    <button
                      onClick={() => toggleCard(key)}
                      className="mt-1 text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition"
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>

                {keyData.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {keyData.map((d, di) => (
                      <span key={di} className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500 ring-1 ring-gray-100">
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-3 pt-3 border-t border-gray-50">
                  <Link
                    href={`/ask?q=${encodeURIComponent(`Tell me more about: ${item.headline} (UPSC current affairs context)`)}`}
                    className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 transition"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Ask AI
                  </Link>
                  <CopyButton text={`${item.headline}\n\n${item.body.slice(0, 300)}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiz */}
        <div className={`mt-6 rounded-xl ${bg} p-5 sm:p-6`}>
          {(!quiz || quiz.status === "idle") && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1a1a2e]">Test yourself</p>
                <p className="text-xs text-gray-500 mt-0.5">Generate 5 MCQs from this section</p>
              </div>
              <button
                onClick={() => generateQuiz(si)}
                className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2a2a4e]"
              >
                Generate Quiz
              </button>
            </div>
          )}

          {quiz?.status === "loading" && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              Generating questions...
            </div>
          )}

          {quiz?.status === "ready" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#1a1a2e]">5 MCQs · Select the correct answer</p>
                <button
                  onClick={() => submitQuiz(si)}
                  disabled={quiz.answers.every((a) => a === -1)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  Check Answers
                </button>
              </div>
              {quiz.questions.map((q, qi) => (
                <div key={qi} className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-bold text-[#1a1a2e]">Q{qi + 1}. {q.question}</p>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = quiz.answers[qi] === oi;
                      const isCorrect = q.correct === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => {
                            if (quiz.status !== "ready") return;
                            const newAnswers = [...quiz.answers];
                            newAnswers[qi] = oi;
                            setQuizState((prev) => ({
                              ...prev,
                              [si]: { ...prev[si], answers: newAnswers },
                            }));
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                            selected
                              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                          }`}
                        >
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
                  <p className="text-sm font-bold text-[#1a1a2e]">
                    You scored {quiz.score ?? "?"} / {quiz.questions.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {quiz.score === 5 ? "Perfect!" : quiz.score !== null && quiz.score >= 3 ? "Good job!" : "Keep practicing"}
                  </p>
                </div>
                <button
                  onClick={() => generateQuiz(si)}
                  className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2a2a4e]"
                >
                  Retry
                </button>
              </div>
              {quiz.questions.map((q, qi) => {
                const selected = quiz.answers[qi];
                const correct = q.correct;
                return (
                  <div key={qi} className={`rounded-lg bg-white p-4 shadow-sm mb-3 ${selected === correct ? "ring-1 ring-emerald-200" : "ring-1 ring-red-200"}`}>
                    <p className="text-sm font-bold text-[#1a1a2e]">Q{qi + 1}. {q.question}</p>
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isSelected = selected === oi;
                        const isCorrect = correct === oi;
                        let cls = "rounded px-3 py-1.5 text-xs border ";
                        if (isCorrect) cls += "border-emerald-400 bg-emerald-50 text-emerald-700";
                        else if (isSelected && !isCorrect) cls += "border-red-300 bg-red-50 text-red-700";
                        else cls += "border-gray-100 text-gray-500";
                        return (
                          <div key={oi} className={cls}>
                            <span className="font-medium">{String.fromCharCode(65 + oi)}</span> {opt}
                            {isCorrect && <span className="ml-2 text-emerald-600 font-semibold">✓</span>}
                            {isSelected && !isCorrect && <span className="ml-2 text-red-500 font-semibold">✗</span>}
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-[11px] text-gray-500 italic">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const showSearchResults = searchResults !== null && searchQuery.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ===== READING PROGRESS ===== */}
      <div className="fixed top-[36px] left-0 right-0 z-50 h-0.5 bg-gray-200">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div ref={contentRef} className="mx-auto max-w-5xl px-5 py-14 sm:py-16">

        {/* ===== HERO ===== */}
        <header className="mb-8">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Monthly Edition
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-4xl">
            {data.month} {data.year}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="font-medium text-[#1a1a2e]">UPSC Monthly Current Affairs</span>
            <span className="text-gray-300">·</span>
            <span>{data.sections.length} sections</span>
            <span className="text-gray-300">·</span>
            <span>{totalItems} topics</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/api/generate-current-affairs?month=may-2026"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-[#1a1a2e]"
            >
              Browse Store →
            </Link>
          </div>
        </header>

        {/* ===== SEARCH ===== */}
        <div className="relative mb-6">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search across all 55 topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1a1a2e] placeholder-gray-400 shadow-sm transition focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ===== VIEW TOGGLE + TABS ===== */}
        <div className="sticky top-[calc(36px+theme(spacing.4))] z-40 -mx-5 px-5 sm:mx-0 sm:px-0 bg-[#faf9f7] pb-3">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1 rounded-lg bg-gray-200/60 p-0.5">
              <button
                onClick={() => setViewAll(false)}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold transition ${
                  !viewAll ? "bg-white text-[#1a1a2e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tabbed
              </button>
              <button
                onClick={() => setViewAll(true)}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold transition ${
                  viewAll ? "bg-white text-[#1a1a2e] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                View All
              </button>
            </div>
            {!viewAll && (
              <span className="text-[11px] text-gray-400">
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px]">←</kbd>
                <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] ml-0.5">→</kbd>
                navigate
              </span>
            )}
          </div>

          {!viewAll && (
            <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-none">
              {data.sections.map((s, i) => (
                <SectionTab
                  key={i}
                  title={s.title}
                  active={i === activeSection}
                  onClick={() => setActiveSection(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ===== SEARCH RESULTS ===== */}
        {showSearchResults && (
          <div className="mt-4 mb-8">
            {searchResults.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No results found for &quot;{searchQuery}&quot;</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;</p>
                <div className="space-y-2">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSearchQuery("");
                        setActiveSection(r.sectionIndex);
                        setViewAll(false);
                      }}
                      className="w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <span className={`h-2 w-2 rounded-full ${SECTION_COLORS[data.sections[r.sectionIndex].title] || "bg-gray-400"}`} />
                        {data.sections[r.sectionIndex].title}
                      </div>
                      <p className="text-sm font-semibold text-[#1a1a2e]">{r.headline}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{r.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CONTENT ===== */}
        {!showSearchResults && (
          <>
            {viewAll ? (
              /* View All: render all sections */
              <div className="mt-6 space-y-4">
                {data.sections.map((s, si) => renderSectionContent(s, si))}
              </div>
            ) : (
              /* Tabbed: render active section */
              <div className="mt-6" key={activeSection}>
                {renderSectionContent(section, activeSection)}
              </div>
            )}

            {/* ===== PREV / NEXT ===== */}
            {!viewAll && !showSearchResults && (
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-gray-200 pt-6">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-[#1a1a2e] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                  {data.sections.map((_, i) => (
                    <button key={i} onClick={() => setActiveSection(i)}>
                      <Dot filled={i === activeSection} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveSection(Math.min(data.sections.length - 1, activeSection + 1))}
                  disabled={activeSection === data.sections.length - 1}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-[#1a1a2e] disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ===== FOOTER ===== */}
            <footer className="mt-14 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">
                Prepare smarter
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#1a1a2e] sm:text-2xl">
                Get the full PDF + more
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Download the complete {data.month} {data.year} edition as a PDF for offline study,
                or browse our store for curated UPSC products.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/api/generate-current-affairs?month=may-2026"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a4e]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-[#1a1a2e]"
                >
                  Browse Store →
                </Link>
              </div>
              <p className="mt-5 text-xs text-gray-400">
                UPSCPrepNotes · {data.month} {data.year} Edition · Updated monthly
              </p>
            </footer>
          </>
        )}
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </main>
  );
}

function parseQuizQuestions(text: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const blocks = text.split(/(?=Q\d+:)/g);

  for (const block of blocks) {
    if (!block.trim()) continue;

    const qMatch = block.match(/Q\d+:\s*(.+?)(?:\n|$)/);
    const aMatch = block.match(/A\)\s*(.+?)(?:\n|$)/);
    const bMatch = block.match(/B\)\s*(.+?)(?:\n|$)/);
    const cMatch = block.match(/C\)\s*(.+?)(?:\n|$)/);
    const dMatch = block.match(/D\)\s*(.+?)(?:\n|$)/);
    const correctMatch = block.match(/Correct Answer:\s*([A-D])/i);
    const explanationMatch = block.match(/Explanation:\s*(.+?)(?:\n|$)/);

    if (!qMatch || !aMatch || !bMatch || !cMatch || !dMatch || !correctMatch) continue;

    const correctMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    const correctIndex = correctMap[correctMatch[1].toUpperCase()];

    if (correctIndex === undefined) continue;

    questions.push({
      id: questions.length + 1,
      question: qMatch[1].trim(),
      options: [aMatch[1].trim(), bMatch[1].trim(), cMatch[1].trim(), dMatch[1].trim()],
      correct: correctIndex,
      explanation: explanationMatch ? explanationMatch[1].trim() : "",
    });

    if (questions.length >= 5) break;
  }

  return questions;
}
