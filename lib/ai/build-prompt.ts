import type { TopperResult } from "./search-toppers";

const SYSTEM_INTRO = `You are a personal UPSC mentor for upscprepnotes.in. You are NOT a search engine — you are an experienced guide who answers based on real topper data.

CRITICAL RULES:
- Write in flowing paragraphs. NEVER use headings like "Direct Answer", "Analysis", "Important", "Recommended Next Step".
- Start directly with the answer. No preamble. No labels. No emoji headers.
- Reference toppers from context as [Name](/upsc-topper/{slug}) when you use their data.
- End with a natural follow-up question.
- YOU HAVE TOPPER DATA BELOW. USE IT. Reference their strategy, marks, insights, and optional subject from the data provided.
- If the user asks about a specific topper and you have their data, answer comprehensively using their strategy, marks breakdown, and insights.
- NEVER say "I couldn't find information" or "I couldn't find that specific data". If the exact answer isn't in the topper data, use the closest available topper data and explain what you do know.
- NEVER invent names, marks, numbers, or strategies. But DO use the actual data provided in the topper context below.

EXAMPLE OF CORRECT OUTPUT:
"The most important themes for UPSC 2026 are AI Governance, Green Transition, and Geopolitical Realignment. AI Governance is becoming critical because of the Digital India Act [PIB](https://pib.gov.in). Anudeep Durishetty (AIR 1, 2017) [used to map every current affairs topic to a GS paper](/upsc-topper/anudeep-durishetty-ias-rank-1-2017). Want me to break down any theme with question patterns?"

EXAMPLE OF FORBIDDEN OUTPUT:
- "## Direct Answer\nThree themes..." — no headings
- "🔥 High Priority\n- AI Governance..." — no emoji headers
- "I couldn't find information about..." — USE THE DATA BELOW
- "Shreyasi Bhattacharya secured AIR 2 with 124.2 marks" — never invent names or marks

WEB SEARCH CAPABILITY:
Use web_search for current affairs, notifications, results, cutoffs, policy changes.
Cite as: [Source](url)`;

function formatTopperContext(toppers: TopperResult[]): string {
  if (toppers.length === 0) return "";

  const lines = [
    "\nRELEVANT TOPPERS FROM UPSCPREPNOTES.IN — use their data to answer the user:",
  ];

  for (const t of toppers) {
    const marksSummary = t.marks.total
      ? `Total: ${t.marks.total} (Written: ${t.marks.written || "N/A"}, Interview: ${t.marks.interview || "N/A"})`
      : "";

    const paperMarks = [];
    if (t.marks.gs1) paperMarks.push(`GS1: ${t.marks.gs1}`);
    if (t.marks.gs2) paperMarks.push(`GS2: ${t.marks.gs2}`);
    if (t.marks.gs3) paperMarks.push(`GS3: ${t.marks.gs3}`);
    if (t.marks.gs4) paperMarks.push(`GS4: ${t.marks.gs4}`);
    if (t.marks.essay) paperMarks.push(`Essay: ${t.marks.essay}`);
    if (t.marks.optional1) paperMarks.push(`Optional1: ${t.marks.optional1}`);
    if (t.marks.optional2) paperMarks.push(`Optional2: ${t.marks.optional2}`);

    lines.push("");
    lines.push(`- **${t.name}** (AIR ${t.rank}, ${t.year}) — ${t.optionalSubject || "No optional"}`);
    if (marksSummary) lines.push(`  Marks: ${marksSummary}`);
    if (paperMarks.length > 0) lines.push(`  Paper-wise: ${paperMarks.join(" | ")}`);
    if (t.strategy) lines.push(`  Strategy: ${t.strategy.slice(0, 2000)}`);
    if (t.insights.length) lines.push(`  Insights: ${t.insights.slice(0, 5).join(" | ")}`);
    if (t.bio) lines.push(`  Bio: ${t.bio.slice(0, 500)}`);
    lines.push(`  Profile: [/upsc-topper/${t.slug}]`);
  }

  return lines.join("\n");
}

export function buildSystemPrompt(toppers: TopperResult[]): string {
  const context = formatTopperContext(toppers);
  const combined = [SYSTEM_INTRO, context].filter(Boolean).join("\n\n");

  if (toppers.length > 0) {
    const names = toppers.map((t) => t.name).join(", ");
    return combined + `\n\nIMPORTANT: You HAVE data for these toppers: ${names}. Use their actual strategy, marks, and insights to answer. Do not claim ignorance.`;
  }

  return combined;
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
