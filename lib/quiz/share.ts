import { MARK_RIGHT, MARK_WRONG, SET_SIZE } from "./engine";

/**
 * A shared result, packed into a short link: /quiz/s/410-3 means 4 right, 1 wrong, 0 skipped,
 * on a 3-day streak. The score is worked out from the counts, so it can't be faked to more
 * than the counts allow.
 */
export type SharedResult = { right: number; wrong: number; skipped: number; streak: number; score: number };

export function shareCode(r: { right: number; wrong: number; skipped: number; streak: number }): string {
  return `${r.right}${r.wrong}${r.skipped}-${Math.max(0, Math.min(999, r.streak))}`;
}

export function parseShareCode(code: string): SharedResult | null {
  const m = /^([0-5])([0-5])([0-5])-(\d{1,3})$/.exec(code);
  if (!m) return null;
  const [right, wrong, skipped, streak] = m.slice(1).map(Number);
  if (right + wrong + skipped !== SET_SIZE) return null;
  const score = Math.round((right * MARK_RIGHT + wrong * MARK_WRONG) * 100) / 100;
  return { right, wrong, skipped, streak, score };
}

/** Plain ASCII minus for images, where some fonts lack the "−" sign. */
export function scoreText(score: number, minus = "−"): string {
  const v = Math.abs(score) < 0.005 ? 0 : score;
  return `${v > 0 ? "+" : v < 0 ? minus : ""}${Math.abs(v).toFixed(2)}`;
}
