"use client";

import { useState } from "react";
import Link from "next/link";
import { Instrument_Sans, Libre_Baskerville, JetBrains_Mono } from "next/font/google";
import {
  ArrowRight,
  Search,
  Command,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Download,
  Sparkles,
  ArrowUpRight,
  Bookmark,
  Layers,
  Award,
} from "lucide-react";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  variable: "--font-baskerville",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

// Real Topper Dataset
const TOPPERS = [
  {
    id: "aditya",
    name: "Aditya Srivastava",
    rank: "AIR 01",
    year: "2023",
    roll: "6304892",
    optional: "Electrical Engg",
    totalMarks: 1099,
    written: 899,
    interview: 200,
    highlightBadge: "Highest GS4 Ethics Score in CSE History",
    activePaperKey: "GS 4 (Ethics)",
    paperRows: [
      { code: "ES", name: "Essay Paper", score: 122, max: 250, badge: "Balanced" },
      { code: "GS1", name: "General Studies I", score: 114, max: 250, badge: "Geography Edge" },
      { code: "GS2", name: "General Studies II", score: 112, max: 250, badge: "Judicial Precedents" },
      { code: "GS3", name: "General Studies III", score: 103, max: 250, badge: "Budget Points" },
      { code: "GS4", name: "GS 4 (Ethics)", score: 143, max: 250, highlight: "Batch Record", badgeColor: "sky" },
      { code: "OP1", name: "Electrical Engg I", score: 153, max: 250, badge: "Formula Proofs" },
      { code: "OP2", name: "Electrical Engg II", score: 153, max: 250, badge: "Technical Edge" },
    ],
    sampleQuestion: {
      number: "Q.3 (b) · 15 Marks",
      question: "Examine the ethical dilemmas faced by civil servants during compulsory land acquisition for major infrastructure corridors. How can development imperatives be reconciled with community rehabilitation?",
      evaluatorGrade: "8.5 / 10",
      frameworkSteps: [
        { label: "01. Introduction", text: "Eminent Domain doctrine vs Article 21 rights (Supreme Court K.T. Plantation precedent)." },
        { label: "02. Stakeholder Dilemma", text: "State economic growth vs Displaced vulnerable communities vs District Magistrate's legal duty." },
        { label: "03. Ethical Balance", text: "Utilitarian national development vs Deontological duty towards displaced tribals/farmers." },
        { label: "04. Administrative Solution", text: "Social Impact Assessment (SIA) + Land Pooling + Equity annuity compensation." },
      ],
    },
  },
  {
    id: "ananya",
    name: "Donuru Ananya Reddy",
    rank: "AIR 03",
    year: "2023",
    roll: "0801234",
    optional: "Anthropology",
    totalMarks: 1065,
    written: 875,
    interview: 190,
    highlightBadge: "Top Anthropology Scorer (298/500)",
    activePaperKey: "Anthropology I",
    paperRows: [
      { code: "ES", name: "Essay Paper", score: 128, max: 250, badge: "Philosophical" },
      { code: "GS1", name: "General Studies I", score: 115, max: 250, badge: "Society Focus" },
      { code: "GS2", name: "General Studies II", score: 118, max: 250, badge: "Top GS2 Marks" },
      { code: "GS3", name: "General Studies III", score: 98, max: 250, badge: "Environment" },
      { code: "GS4", name: "GS 4 (Ethics)", score: 141, max: 250, highlight: "Top Tier", badgeColor: "sky" },
      { code: "OP1", name: "Anthropology Paper I", score: 148, max: 250, badge: "Case Studies" },
      { code: "OP2", name: "Anthropology Paper II", score: 150, max: 250, badge: "Tribal Studies" },
    ],
    sampleQuestion: {
      number: "Q.2 (a) · 20 Marks",
      question: "Critically examine Franz Boas's Historical Particularism as a methodological rupture against 19th-century unilinear cultural evolutionism.",
      evaluatorGrade: "9.0 / 10",
      frameworkSteps: [
        { label: "01. Theoretical Context", text: "Critique of Morgan & Tylor's armchair ethnology and racial hierarchy assumptions." },
        { label: "02. Methodological Rigor", text: "Primary empirical fieldwork (Kwakiutl) + 4-field holistic anthropological model." },
        { label: "03. Conceptual Core", text: "Culture traits develop through historical diffusion and internal adaptation, not uniform stages." },
        { label: "04. Scientific Legacy", text: "Dismantled scientific racism; established cultural relativism as academic standard." },
      ],
    },
  },
];

export default function AltruistInspiredHero() {
  const [topperId, setTopperId] = useState("aditya");
  const [selectedPaperCode, setSelectedPaperCode] = useState("GS4");

  const topper = TOPPERS.find((t) => t.id === topperId) || TOPPERS[0];

  return (
    <div className={`min-h-screen bg-[#FFFFFC] text-[#121317] ${instrumentSans.className}`}>
      
      {/* ─────────────────────────────────────────────────────────────
          HEADER (Altruist Floating Style: Friendly, Clean, Rounded)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#0000000a] bg-[#FFFFFC]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo with playful icon */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#116E99] text-white shadow-xs">
              <span className="font-serif text-base font-bold italic">U</span>
            </div>
            <span className="text-base font-bold tracking-tight text-[#16202A]">
              UPSCPrepNotes
            </span>
            <span className="rounded-full bg-[#DEEFF8] px-2 py-0.5 text-[10px] font-semibold text-[#116E99]">
              Verified Gazette
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 text-xs font-medium text-[#4A5568] md:flex">
            <button className="transition hover:text-black">Marks Database</button>
            <button className="transition hover:text-black">Answer Copies</button>
            <button className="transition hover:text-black">Optional Analysis</button>
            <button className="transition hover:text-black">AI Strategy Mentor</button>
            <button className="transition hover:text-black">Store</button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-[#4A5568] transition hover:border-black/20 sm:flex">
              <Search size={12} />
              <span>Search toppers, optionals...</span>
              <kbd className="font-mono text-[10px] text-zinc-400">⌘K</kbd>
            </button>

            <button className="inline-flex items-center gap-1.5 rounded-full bg-[#116E99] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0E5B7E] active:scale-[0.98]">
              <span>Explore 280+ Marksheets</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (Altruist Playful EdTech Rhythm)
      ───────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        
        {/* Soft Eyebrow Pill Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#116e9920] bg-[#DEEFF8] px-3 py-1 text-xs font-semibold text-[#116E99]">
            <Sparkles size={12} /> Civil Services Exam Intelligence
          </span>
          <span className="inline-flex items-center rounded-full border border-black/5 bg-[#FFF2E3] px-3 py-1 text-xs font-semibold text-[#6E4616]">
            CSE 2022–2025
          </span>
          <span className="inline-flex items-center rounded-full border border-black/5 bg-[#F9FAE3] px-3 py-1 text-xs font-semibold text-[#6E5F16]">
            280+ Gazette Profiles
          </span>
        </div>

        {/* Display Headline with Playful Italic Serif Accent */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-[#16202A] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
            Every mark. Every topper.
            <br />
            Decoded for your{" "}
            <span className={`${libreBaskerville.className} font-normal italic text-[#116E99]`}>
              daily preparation.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4A5568]">
            Paper-wise marksheets, verified score trends, and real handwritten answer sheets with examiner feedback—organized with academic rigor and zero fluff.
          </p>

          {/* Action Row with Altruist Pill Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-[#16202A] px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98]">
              <span>Explore Marksheet Database</span>
              <ArrowRight size={13} />
            </button>

            <button className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold text-[#16202A] transition hover:bg-[#F7F7F2] active:scale-[0.98]">
              <FileText size={13} className="text-[#116E99]" />
              <span>Download Free Sample Copy</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            THE INTERACTIVE PLAYFUL WORKSPACE (Split Card View)
            Soft pastel surfaces, crisp 1px borders, rounded-2xl geometry.
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-14">
          
          {/* Main Container Card */}
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            
            {/* Top Bar: Profile Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/6 bg-[#FAF9F5] px-5 py-3 text-xs">
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7A828E]">
                  Select Topper:
                </span>
                {TOPPERS.map((t) => {
                  const isSelected = topperId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTopperId(t.id)}
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                        isSelected
                          ? "bg-[#116E99] text-white shadow-xs"
                          : "bg-white text-[#4A5568] border border-black/8 hover:text-black hover:border-black/15"
                      }`}
                    >
                      {t.name} <span className="opacity-80">({t.rank})</span>
                    </button>
                  );
                })}
              </div>

              {/* Gazette Verification Pill */}
              <div className="flex items-center gap-2 rounded-full border border-[#116e9925] bg-[#DEEFF8] px-3 py-1 font-mono text-[11px] text-[#116E99]">
                <CheckCircle2 size={12} />
                <span>UPSC Gazette Roll #{topper.roll} · Verified</span>
              </div>

            </div>

            {/* Split Content: Left Marks Ledger / Right Evaluated Answer Sheet */}
            <div className="grid lg:grid-cols-12">
              
              {/* Left Column (7 cols): Marksheet Table with Playful Badges */}
              <div className="p-6 sm:p-8 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-black/6">
                
                {/* Topper Summary Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#FFF2E3] px-2 py-0.5 font-mono text-[11px] font-bold text-[#6E4616]">
                        {topper.rank}
                      </span>
                      <h2 className="text-xl font-bold tracking-tight text-[#16202A]">
                        {topper.name}
                      </h2>
                    </div>
                    <p className="mt-1 text-xs text-[#5A6679]">
                      CSE {topper.year} · Optional: <strong className="text-[#16202A]">{topper.optional}</strong>
                    </p>
                  </div>

                  <div className="rounded-xl border border-black/6 bg-[#FAF9F5] px-3.5 py-2 text-right">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#7A828E]">Total Score</p>
                    <p className="font-mono text-xl font-bold text-[#116E99]">
                      {topper.totalMarks} <span className="text-xs font-normal text-zinc-400">/ 2025</span>
                    </p>
                  </div>
                </div>

                {/* Stat Badges in Soft Altruist Colors */}
                <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-xl border border-black/5 bg-[#EEF7F2] p-2.5">
                    <span className="text-[10px] font-semibold text-[#1A4D32] uppercase tracking-wider">Written Marks</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-black">{topper.written} / 1750</p>
                  </div>
                  <div className="rounded-xl border border-black/5 bg-[#FFF2E3]/80 p-2.5">
                    <span className="text-[10px] font-semibold text-[#6E4616] uppercase tracking-wider">Interview Score</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[#6E4616]">{topper.interview} / 275</p>
                  </div>
                  <div className="rounded-xl border border-black/5 bg-[#F9FAE3] p-2.5">
                    <span className="text-[10px] font-semibold text-[#6E5F16] uppercase tracking-wider">Percentile</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-[#6E5F16]">Top 0.01%</p>
                  </div>
                </div>

                {/* Tabular Marks Ledger */}
                <div className="mt-6">
                  <div className="flex items-center justify-between pb-2 text-xs">
                    <span className="font-mono font-semibold uppercase tracking-wider text-[#7A828E] text-[11px]">
                      Paper-by-Paper Performance
                    </span>
                    <span className="text-[#7A828E]">Click row to preview answer sheet</span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-black/6">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-black/6 bg-[#FAF9F5] font-mono text-[10px] uppercase text-[#7A828E]">
                        <tr>
                          <th className="py-2.5 px-3.5 font-medium">Code</th>
                          <th className="py-2.5 px-3.5 font-medium">Paper Name</th>
                          <th className="py-2.5 px-3.5 text-right font-medium">Score</th>
                          <th className="py-2.5 px-3.5 text-right font-medium">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/4 font-mono text-[11px]">
                        {topper.paperRows.map((row) => {
                          const isSelected = selectedPaperCode === row.code;
                          return (
                            <tr
                              key={row.code}
                              onClick={() => setSelectedPaperCode(row.code)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-[#DEEFF8]/50" : "hover:bg-[#FAF9F5]"
                              }`}
                            >
                              <td className="py-2.5 px-3.5 font-semibold text-[#16202A]">{row.code}</td>
                              <td className="py-2.5 px-3.5 font-sans text-xs">
                                <span className={isSelected ? "font-bold text-[#116E99]" : "text-[#4A5568]"}>
                                  {row.name}
                                </span>
                                {row.highlight && (
                                  <span className="ml-2 rounded-full bg-[#DEEFF8] px-2 py-0.5 font-mono text-[9px] font-bold text-[#116E99]">
                                    ★ {row.highlight}
                                  </span>
                                )}
                              </td>
                              <td className={`py-2.5 px-3.5 text-right font-bold tabular-nums ${isSelected ? "text-[#116E99]" : "text-[#16202A]"}`}>
                                {row.score}
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-zinc-400 tabular-nums">
                                {row.max}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (5 cols): Evaluated Answer Copy Viewport */}
              <div className="flex flex-col justify-between bg-[#FDFBF7] p-6 sm:p-8 lg:col-span-5">
                
                <div>
                  {/* Viewport Header */}
                  <div className="flex items-center justify-between border-b border-black/6 pb-3">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-[#116E99]" />
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#16202A]">
                        Evaluated Copy Snippet
                      </span>
                    </div>
                    <span className="rounded-full bg-[#FFF2E3] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#6E4616]">
                      Evaluator Score: {topper.sampleQuestion.evaluatorGrade}
                    </span>
                  </div>

                  {/* Lined Paper Mockup Box */}
                  <div className="relative mt-4 rounded-xl border border-black/8 bg-white p-4 shadow-2xs">
                    {/* Red margin line on the left */}
                    <div className="absolute top-0 bottom-0 left-6 w-px bg-red-300/60" />

                    <div className="pl-4">
                      <p className="font-mono text-[10px] text-[#7A828E] uppercase">
                        {topper.sampleQuestion.number} · {topper.activePaperKey}
                      </p>
                      <p className={`${libreBaskerville.className} mt-1.5 text-xs font-normal leading-relaxed text-[#16202A]`}>
                        &ldquo;{topper.sampleQuestion.question}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Structural Framework Breakdown */}
                  <div className="mt-4 space-y-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#7A828E]">
                      Answer Structure Executed:
                    </p>
                    <div className="space-y-2 rounded-xl border border-black/6 bg-white p-4 text-xs shadow-2xs">
                      {topper.sampleQuestion.frameworkSteps.map((step, idx) => (
                        <div key={idx} className="border-b border-black/4 pb-1.5 last:border-b-0 last:pb-0">
                          <p className="font-mono text-[10px] font-bold text-[#116E99]">{step.label}</p>
                          <p className="mt-0.5 text-xs leading-normal text-[#4A5568]">{step.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 border-t border-black/6 pt-4">
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#116E99] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0E5B7E] active:scale-[0.98]">
                    <span>Download Full Answer Copy (54 Pages PDF)</span>
                    <Download size={13} />
                  </button>
                  <p className="mt-2 text-center text-[10px] text-[#7A828E]">
                    Scanned verified copy with evaluator red ink markings.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
