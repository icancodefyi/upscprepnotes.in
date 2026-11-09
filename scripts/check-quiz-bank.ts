/**
 * Checks the quiz question bank before anything ships.
 * Run: npx tsx scripts/check-quiz-bank.ts
 * Exits non-zero on any error; warnings are printed but don't fail.
 */
import { PRELIMS_2024, type QuizQuestion } from "../lib/quiz/prelims-2024";
import { SETS, SET_SIZE } from "../lib/quiz/engine";
import { HINTS_2024 } from "../lib/quiz/hints-2024";

const BANKS: Record<string, QuizQuestion[]> = { "prelims-2024": PRELIMS_2024 };
const SUBJECTS = ["Geography", "Environment", "Economy", "Polity", "History & Culture", "International", "Schemes"];

let errors = 0;
let warnings = 0;
const err = (id: string, m: string) => { errors++; console.log(`  ✗ ${id}: ${m}`); };
const warn = (id: string, m: string) => { warnings++; console.log(`  ! ${id}: ${m}`); };
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const seenIds = new Set<string>();
const seenText = new Map<string, string>();

for (const [bank, qs] of Object.entries(BANKS)) {
  console.log(`\n${bank}: ${qs.length} questions`);
  for (const q of qs) {
    if (seenIds.has(q.id)) err(q.id, "duplicate id");
    seenIds.add(q.id);
    if (!/^p\d{2}-\d{1,3}$/.test(q.id)) warn(q.id, "id should look like p24-61 (paper year + question number)");
    if (q.options.length !== 4 || q.options.some((o) => !o.trim())) err(q.id, "needs exactly 4 non-empty options");
    if (new Set(q.options.map(norm)).size !== 4) err(q.id, "two options are the same");
    if (![0, 1, 2, 3].includes(q.answer)) err(q.id, "answer must be 0–3");
    if (!SUBJECTS.includes(q.subject)) err(q.id, `unknown subject "${q.subject}"`);
    if (!q.question.trim()) err(q.id, "empty question");
    if (q.explain.length < 60) warn(q.id, "explanation is very short; say why the answer is right and why the trap is wrong");
    if (q.explain.length > 420) warn(q.id, "explanation is long; keep it to 2–3 sentences for phones");
    if (/[|]|\b(ofthe|tbe|aud)\b|\s{2,}/.test(q.question + (q.items || []).join(" ") + q.options.join(" ")))
      warn(q.id, "looks like an OCR artefact (|, 'ofthe', 'tbe', double spaces); re-check against the paper");
    if (!q.verified) warn(q.id, "answer not yet verified against UPSC's official key");
    const h = HINTS_2024[q.id];
    if (!h) warn(q.id, "no 50:50 hint (Gilu will cross out two wrong options without reasons)");
    else {
      if (h.cross[0] === h.cross[1]) err(q.id, "50:50 crosses the same option twice");
      if (h.cross.includes(q.answer)) err(q.id, "50:50 crosses out the RIGHT answer");
      if (h.cross.some((k) => k < 0 || k > 3)) err(q.id, "50:50 option index must be 0–3");
      h.why.forEach((w, n) => { if (w.length < 15 || w.length > 110) warn(q.id, `50:50 reason ${n + 1} should be one short line (15–110 chars)`); });
    }
    const key = norm(q.question + " " + (q.items || []).join(" "));
    if (seenText.has(key)) err(q.id, `same question text as ${seenText.get(key)}`);
    seenText.set(key, q.id);
  }
  const bySubject: Record<string, number> = {};
  for (const q of qs) bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
  console.log("  subjects:", Object.entries(bySubject).map(([s, n]) => `${s} ${n}`).join(", "));
  const byAnswer = [0, 1, 2, 3].map((k) => qs.filter((q) => q.answer === k).length);
  console.log("  answers a/b/c/d:", byAnswer.join("/"));
}

const used = SETS.length * SET_SIZE;
console.log(`\nSets: ${SETS.length} sets of ${SET_SIZE} = ${used} of ${Object.values(BANKS).flat().length} questions used (the rest wait for a full set)`);
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
