import { PRELIMS_2024, type QuizQuestion, type Subject } from "./prelims-2024";
import { PRODUCTS } from "@/lib/store-products";

/** UPSC Prelims GS marking: +2 right, −1/3 of that (0.66) wrong, 0 for a skip. */
export const MARK_RIGHT = 2;
export const MARK_WRONG = -0.66;
export const SET_SIZE = 5;
/** Time UPSC gives per GS question: 120 minutes for 100 questions. */
export const EXAM_PACE_S = 72;
/** UPSC CSE Prelims 2024 cut-off (General), out of 200. */
export const CUTOFF_2024_GENERAL = 87.98;

export type Pick = number | "skip";
export type Answer = { qid: string; pick: Pick; correct: boolean; ms: number };
export type Run = {
  setIndex: number;
  daily: boolean;
  answers: Answer[];
  maxCombo: number;
  xp: number;
};

export type Badge = { id: string; name: string; hint: string };
export const BADGES: Badge[] = [
  { id: "first", name: "First quiz", hint: "Finish your first set" },
  { id: "hattrick", name: "Hat-trick", hint: "3 right in a row" },
  { id: "clean", name: "No negatives", hint: "A set with no wrong answers" },
  { id: "perfect", name: "Perfect 5", hint: "All 5 right in a set" },
  { id: "topper", name: "Topper energy", hint: "Score 8 or more out of 10" },
  { id: "streak3", name: "3-day streak", hint: "Play the daily quiz 3 days running" },
  { id: "speed", name: "Speedster", hint: "Average under 45s a question, 3+ right" },
];

export const LEVELS = [
  { name: "Aspirant", xp: 0 },
  { name: "Serious aspirant", xp: 120 },
  { name: "Prelims warrior", xp: 300 },
  { name: "Mains hopeful", xp: 550 },
  { name: "Interview ready", xp: 900 },
  { name: "LBSNAA bound", xp: 1400 },
];

export type Progress = {
  v: 1;
  xp: number;
  streak: number;
  bestStreak: number;
  lastDailyDay: string | null;
  /** Day the player joined the 30-day challenge (null = not joined). Rewards need this. */
  joined: string | null;
  /** Streak shields: each one covers a single missed day. */
  shields: number;
  /** Milestone ids already unlocked. */
  unlocked: string[];
  best: number | null;
  badges: string[];
  subjects: Partial<Record<Subject, { right: number; total: number }>>;
  history: { day: string; setIndex: number; daily: boolean; score: number; right: number; wrong: number; skipped: number }[];
};

export const EMPTY: Progress = {
  v: 1, xp: 0, streak: 0, bestStreak: 0, lastDailyDay: null, joined: null, shields: 0, unlocked: [], best: null, badges: [], subjects: {}, history: [],
};

const KEY = "upn-quiz-v1";
export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const p = JSON.parse(raw);
    return p?.v === 1 ? { ...EMPTY, ...p } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}
export function saveProgress(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}
export function resetProgress() {
  try { localStorage.removeItem(KEY); } catch {}
}

/** Calendar day in India, e.g. "2026-11-09". */
export function istDay(d = new Date()): string {
  return new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}
function prevDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** A fixed shuffle so every player gets the same sets, in the same order. */
function seeded(list: QuizQuestion[], seed: number): QuizQuestion[] {
  const a = [...list];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const ORDERED = seeded(PRELIMS_2024, 2024);
export const SETS: QuizQuestion[][] = Array.from(
  { length: Math.floor(ORDERED.length / SET_SIZE) },
  (_, i) => ORDERED.slice(i * SET_SIZE, i * SET_SIZE + SET_SIZE),
);

/** Today's set rotates through the bank one day at a time. */
export function dailySetIndex(day = istDay()): number {
  const n = Math.floor(new Date(`${day}T00:00:00Z`).getTime() / 86_400_000);
  return n % SETS.length;
}
export function nextPracticeSet(after: number): number {
  return (after + 1) % SETS.length;
}

export function markFor(a: Answer): number {
  return a.pick === "skip" ? 0 : a.correct ? MARK_RIGHT : MARK_WRONG;
}
export function totalMarks(answers: Answer[]): number {
  return Math.round(answers.reduce((s, a) => s + markFor(a), 0) * 100) / 100;
}
export function fmtMarks(n: number): string {
  const v = Math.abs(n) < 0.005 ? 0 : n;
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(2)}`;
}

/** XP for one answer, given the combo it extends. */
export function xpFor(a: Answer, combo: number): number {
  if (a.pick === "skip") return 2;
  if (!a.correct) return 4;
  return 20 + Math.min(20, 5 * Math.max(0, combo - 1));
}

export function levelFor(xp: number) {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k].xp) i = k;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const pct = next ? Math.min(1, (xp - cur.xp) / (next.xp - cur.xp)) : 1;
  return { index: i + 1, name: cur.name, next, pct };
}

/** Fold a finished run into the saved progress. Returns the new progress and badges earned now. */
export function finishRun(prev: Progress, run: Run, questions: QuizQuestion[]) {
  const day = istDay();
  const right = run.answers.filter((a) => a.pick !== "skip" && a.correct).length;
  const wrong = run.answers.filter((a) => a.pick !== "skip" && !a.correct).length;
  const skipped = run.answers.length - right - wrong;
  const score = totalMarks(run.answers);
  const bonus = 25 + (right === SET_SIZE ? 30 : 0);

  const p: Progress = JSON.parse(JSON.stringify(prev));
  p.xp += run.xp + bonus;
  p.best = p.best === null ? score : Math.max(p.best, score);

  let usedShield = false;
  if (run.daily && p.lastDailyDay !== day) {
    if (p.lastDailyDay === prevDay(day)) p.streak += 1;
    else if (p.lastDailyDay === prevDay(prevDay(day)) && p.shields > 0) { p.shields -= 1; p.streak += 1; usedShield = true; }
    else p.streak = 1;
    p.lastDailyDay = day;
    p.bestStreak = Math.max(p.bestStreak, p.streak);
  }
  const milestones = unlockMilestones(p);

  for (const a of run.answers) {
    const q = questions.find((x) => x.id === a.qid);
    if (!q || a.pick === "skip") continue;
    const s = (p.subjects[q.subject] ||= { right: 0, total: 0 });
    s.total += 1;
    if (a.correct) s.right += 1;
  }

  p.history.unshift({ day, setIndex: run.setIndex, daily: run.daily, score, right, wrong, skipped });
  p.history = p.history.slice(0, 60);

  const answered = run.answers.filter((a) => a.pick !== "skip");
  const avgS = answered.length ? answered.reduce((s, a) => s + a.ms, 0) / answered.length / 1000 : 99;
  const earned = new Set<string>();
  const give = (id: string, ok: boolean) => { if (ok && !p.badges.includes(id)) { p.badges.push(id); earned.add(id); } };
  give("first", true);
  give("hattrick", run.maxCombo >= 3);
  give("clean", wrong === 0 && right >= 3);
  give("perfect", right === SET_SIZE);
  give("topper", score >= 8);
  give("streak3", p.streak >= 3);
  give("speed", avgS < 45 && right >= 3);

  return { progress: p, earned: BADGES.filter((b) => earned.has(b.id)), milestones, usedShield, score, right, wrong, skipped, bonus, avgS };
}

/* ---------- the 30-day challenge ---------- */

const product = (slug: string) => PRODUCTS.find((x) => x.slug === slug);
const priceOf = (slug: string) => product(slug)?.price ?? 0;

export type Milestone = {
  id: string;
  day: number;
  title: string;
  /** What the reward is, in a few words: "Free", "50% off", "₹200 off", "Shield". */
  reward: string;
  /** The real store price, so "worth ₹199" is always true. Null for non-product rewards. */
  worth: number | null;
  /** Price after the reward (0 = free). Null for non-product rewards. */
  pay: number | null;
  href: string | null;
  detail: string;
};

/** Rewards for daily streaks. Free items are low-cost; best-sellers get discounts, not giveaways. */
export const MILESTONES: Milestone[] = [
  { id: "m3", day: 3, title: "Streak shield", reward: "Shield", worth: null, pay: null, href: null, detail: "Miss one day without losing your streak." },
  { id: "m7", day: 7, title: product("top-10-rankers-strategy")?.title ?? "Top 10 Rankers Strategy", reward: "Free", worth: priceOf("top-10-rankers-strategy"), pay: 0, href: "/store/top-10-rankers-strategy", detail: "How the top 10 of UPSC 2024 prepared." },
  { id: "m10", day: 10, title: product("government-schemes-compilation")?.title ?? "Government Schemes Compilation", reward: "Free", worth: priceOf("government-schemes-compilation"), pay: 0, href: "/store/government-schemes-compilation", detail: "Every major scheme, made for Prelims." },
  { id: "m21", day: 21, title: product("answer-copies-compilation")?.title ?? "Answer Copies Compilation", reward: "50% off", worth: priceOf("answer-copies-compilation"), pay: Math.round(priceOf("answer-copies-compilation") / 2), href: "/store/answer-copies-compilation", detail: "63 handwritten topper answer copies." },
  { id: "m30", day: 30, title: product("upsc-mains-2027-pack")?.title ?? "UPSC Mains 2027 Pack", reward: "₹200 off", worth: priceOf("upsc-mains-2027-pack"), pay: Math.max(0, priceOf("upsc-mains-2027-pack") - 200), href: "/store/upsc-mains-2027-pack", detail: "The playbook and topper marks spreadsheet." },
];

export function nextMilestone(streak: number): Milestone | null {
  return MILESTONES.find((m) => m.day > streak) ?? null;
}

/** Unlock every milestone the streak has reached. Only challenge members earn rewards. */
export function unlockMilestones(p: Progress): Milestone[] {
  if (!p.joined) return [];
  const fresh = MILESTONES.filter((m) => p.streak >= m.day && !p.unlocked.includes(m.id));
  for (const m of fresh) {
    p.unlocked.push(m.id);
    if (m.id === "m3") p.shields += 1;
  }
  return fresh;
}

export function joinChallenge(prev: Progress): Progress {
  const p: Progress = JSON.parse(JSON.stringify(prev));
  if (!p.joined) p.joined = istDay();
  return p;
}
