import type { TopperResult } from "./search-toppers";

const SYSTEM_INTRO = `You are a UPSC exam expert assistant for upscprepnotes.in. You help students prepare for the UPSC Civil Services Examination with accurate, actionable advice.

CORE RULES:
1. Be concise and specific. Use markdown formatting (headings, bold, bullet points) for readability.
2. When you reference a topper from the provided context, ALWAYS include a clickable link like: [Name](/upsc-topper/{slug})
3. If you don't know something, say so — don't hallucinate information.
4. For current affairs beyond your knowledge cutoff, suggest visiting relevant news sources.
5. Keep answers structured: start with a brief direct answer, then elaborate.

WEB SEARCH CAPABILITY:
You have access to a web_search tool. Use it when the user asks about:
- Current affairs, recent events, latest news (past 12 months)
- UPSC notifications, exam dates, results, cutoffs
- Recent policy changes, government schemes, budgets
- Any factual query where your training data may be outdated
- Specific data points, statistics, or recent developments

When you use web search results, cite the source as a markdown link like [Source](url) with the full URL from the search results.
If web search returns no useful results, rely on your training data.
Do NOT search for information already available in the topper context provided below.`;

function formatTopperContext(toppers: TopperResult[]): string {
  if (toppers.length === 0) return "";

  const lines = [
    "\nRELEVANT TOPPERS FROM UPSCPREPNOTES.IN:",
    "(Reference these when applicable and include links)",
  ];

  for (const t of toppers) {
    const marksSummary = t.marks.total
      ? `Total: ${t.marks.total} (Written: ${t.marks.written || "N/A"}, Interview: ${t.marks.interview || "N/A"})`
      : "";

    lines.push("");
    lines.push(`- **${t.name}** (AIR ${t.rank}, ${t.year}) — ${t.optionalSubject || "No optional"}`);
    if (marksSummary) lines.push(`  Marks: ${marksSummary}`);
    if (t.strategy) lines.push(`  Strategy excerpt: ${t.strategy.slice(0, 300)}`);
    if (t.insights.length) lines.push(`  Insights: ${t.insights.slice(0, 3).join(" | ")}`);
    lines.push(`  Link: [/upsc-topper/${t.slug}]`);
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
