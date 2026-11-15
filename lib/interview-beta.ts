/**
 * The mock interview beta form: fixed choices so answers stay clean. Plain data: safe on the server and in the browser.
 */
import { ATTEMPTS, OPTIONALS, STAGES, type Option } from "@/lib/lead-profile";

const o = (...labels: string[]): Option[] => labels.map((l) => ({ value: l, label: l }));

export { STAGES, ATTEMPTS, OPTIONALS };
export const FACED = o("No, not yet", "Yes, once", "Yes, more than once");
export const DEVICES = o("Phone", "Laptop or computer", "Both");
export const FEATURES = o(
  "Questions built from my own DAF",
  "Board voices that sound real (Indian accent)",
  "Follow-ups and counter-questions",
  "Interruptions, like the real board",
  "A scored report with better answers",
  "Video replay to check my body language",
  "Practice in Hindi",
  "This year's current affairs questions",
  "Compare with toppers' interview transcripts",
  "A human mentor reviews my mock",
);
export const PAY = o(
  "Only if it is free",
  "Up to ₹99 per mock",
  "₹100 to ₹299 per mock",
  "₹300 to ₹999 for a full pack",
  "More, if it is really good",
);

export type BetaAnswers = {
  name: string;
  email: string;
  phone?: string;
  stage?: string;
  attempt?: string;
  optional?: string;
  faced?: string;
  device?: string;
  features: string[];
  pay?: string;
  wish?: string;
};

const pick = (v: unknown, list: Option[]) => (typeof v === "string" && list.some((x) => x.value === v) ? v : undefined);

/** Keeps only known choices, a valid email and an Indian mobile. Returns null if name or email is missing. */
export function sanitizeBeta(raw: unknown): BetaAnswers | null {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const name = String(r.name ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  const email = String(r.email ?? "").trim().toLowerCase().slice(0, 120);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  const out: BetaAnswers = {
    name,
    email,
    stage: pick(r.stage, STAGES),
    attempt: pick(r.attempt, ATTEMPTS),
    optional: pick(r.optional, OPTIONALS),
    faced: pick(r.faced, FACED),
    device: pick(r.device, DEVICES),
    features: Array.isArray(r.features) ? [...new Set(r.features.filter((f): f is string => typeof f === "string" && FEATURES.some((x) => x.value === f)))] : [],
    pay: pick(r.pay, PAY),
    wish: String(r.wish ?? "").trim().slice(0, 600) || undefined,
  };
  if (typeof r.phone === "string") {
    const d = r.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (/^[6-9]\d{9}$/.test(d)) out.phone = d;
  }
  return out;
}
