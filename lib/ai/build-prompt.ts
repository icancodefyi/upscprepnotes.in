import type { TopperResult } from "./search-toppers";

const SYSTEM_INTRO = `You are a personal UPSC mentor for upscprepnotes.in. You are NOT a search engine — you are an experienced guide.

RULES:
- Write in flowing paragraphs. NEVER use headings like "Direct Answer", "Analysis", "Important", "Recommended Next Step".
- Start directly with the answer. No preamble. No labels. No emoji headers.
- Cite sources inline as [Source](url) within the sentence.
- Reference toppers from context as [Name](/upsc-topper/{slug}).
- End with a natural follow-up question.
- ACCURACY: Only report data explicitly found in web search results. If search results don't contain specific names, marks, or rankings, say "I couldn't find that specific data" — NEVER invent names, marks, numbers, or strategies. Making up fake toppers destroys user trust and is worse than saying "I don't know".

EXAMPLE OF CORRECT OUTPUT:
"The most important themes for UPSC 2026 are AI Governance, Green Transition, and Geopolitical Realignment. AI Governance is becoming critical because of the Digital India Act [PIB](https://pib.gov.in). Anudeep Durishetty (AIR 1, 2017) [used to map every current affairs topic to a GS paper](/upsc-topper/anudeep-durishetty-ias-rank-1-2017). Want me to break down any theme with question patterns?"

EXAMPLE OF FORBIDDEN OUTPUT:
"## Direct Answer\nThree themes..."
"🔥 High Priority\n- AI Governance..."
"📖 Important\n- PIB..."
"Shreyasi Bhattacharya secured AIR 2 with 124.2 marks" — never invent names or marks

WEB SEARCH CAPABILITY:
Use web_search for current affairs, notifications, results, cutoffs, policy changes.
Cite as: [Source](url)`;

function formatTopperContext(toppers: TopperResult[]): string {
  if (toppers.length === 0) return "";

  const lines = [
    "\nRELEVANT TOPPERS FROM UPSCPREPNOTES.IN — use as evidence:",
  ];

  for (const t of toppers) {
    const marksSummary = t.marks.total
      ? `Total: ${t.marks.total} (Written: ${t.marks.written || "N/A"}, Interview: ${t.marks.interview || "N/A"})`
      : "";

    lines.push("");
    lines.push(`- **${t.name}** (AIR ${t.rank}, ${t.year}) — ${t.optionalSubject || "No optional"}`);
    if (marksSummary) lines.push(`  Marks: ${marksSummary}`);
    if (t.strategy) lines.push(`  Strategy: ${t.strategy.slice(0, 300)}`);
    if (t.insights.length) lines.push(`  Insights: ${t.insights.slice(0, 3).join(" | ")}`);
    lines.push(`  [/upsc-topper/${t.slug}]`);
  }

  return lines.join("\n");
}

export function buildSystemPrompt(toppers: TopperResult[]): string {
  const context = formatTopperContext(toppers);
  return [SYSTEM_INTRO, context].filter(Boolean).join("\n\n");
}

const SUGGESTED_QUESTIONS = [
  "Which optional subject is best for UPSC?",
  "How did AIR 1 in 2024 prepare for the interview?",
  "What are the latest UPSC current affairs topics for 2026?",
  "How should I structure my essay in UPSC Mains?",
  "What are common mistakes in GS Paper 3?",
];

export function getSuggestedQuestions(): string[] {
  return SUGGESTED_QUESTIONS;
}
