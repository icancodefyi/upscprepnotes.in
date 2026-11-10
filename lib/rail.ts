/** What the right rail says, per product. Plain data: safe to import anywhere. */
export type Pitch = { headline: string; line: string; cta: string };

export const PITCH: Record<string, Pitch> = {
  "answer-copies-compilation": {
    headline: "See how toppers wrote their Mains answers",
    line: "63 handwritten copies from 27 toppers, each with its marks.",
    cta: "See the copies",
  },
  "upsc-interview-pack": {
    headline: "Know what the board will ask",
    line: "347 questions from 14 real 2026 interviews, a DAF worksheet and a 30-day plan.",
    cta: "See the pack",
  },
  "upsc-mains-2027-pack": {
    headline: "Plan Mains 2027 from real marks",
    line: "The target marksheet for every rank band and 471 past GS questions sorted by theme.",
    cta: "See the pack",
  },
  "government-schemes-compilation": {
    headline: "Every central scheme in one PDF",
    line: "Objective, budget and beneficiaries, sorted by ministry for Prelims and Mains.",
    cta: "See the PDF",
  },
  "all-strategy-reports": {
    headline: "Read how 280+ toppers prepared",
    line: "Strategy, paper-wise marks and score analysis for every topper profile.",
    cta: "See the reports",
  },
};

/** Which product the shell rail shows, by route. Unlisted routes get the answer copies. */
export function railProductFor(path: string): string {
  if (path.startsWith("/pyq") || path.startsWith("/current-affairs")) return "government-schemes-compilation";
  if (path.startsWith("/upsc-topper") || path.startsWith("/year") || path === "/toppers" || path.startsWith("/toppers/marks") || path.startsWith("/compare")) return "all-strategy-reports";
  if (path.startsWith("/optional")) return "upsc-mains-2027-pack";
  return "answer-copies-compilation";
}

/** Routes with no rail: money pages, tools, the home page and pages that carry their own rail. */
const NO_RAIL = ["/store", "/download", "/get", "/quiz", "/ask", "/admin", "/unsubscribe", "/advertise", "/content/", "/toppers/highest-marks-in-upsc", "/toppers/upsc-interview-marks", "/toppers/upsc-mains-marks-needed"];

export function hasShellRail(path: string): boolean {
  if (path === "/") return false;
  return !NO_RAIL.some((p) => path === p || path.startsWith(p.endsWith("/") ? p : p + "/") || path === p.replace(/\/$/, ""));
}
