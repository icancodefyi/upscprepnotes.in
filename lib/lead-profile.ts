/**
 * What we ask a free-copy requester about their preparation. Every field is a fixed choice so the
 * answers stay clean and filterable. Plain data: safe to import on the server and in the browser.
 */
export type Option = { value: string; label: string };

const o = (...labels: string[]): Option[] => labels.map((l) => ({ value: l, label: l }));

export const STAGES = o("Just starting", "Prelims 2027", "Mains 2026 or 2027", "Interview stage");
export const ATTEMPTS = o("First attempt", "Second attempt", "Third attempt", "Fourth or more");
export const MODES = o("Self-study", "Coaching", "Self-study plus coaching");
export const WORKING = o("Full-time preparation", "Working and preparing", "Still studying");
export const OPTIONALS = o(
  "Not decided", "Agriculture", "Animal Husbandry", "Anthropology", "Botany", "Chemistry", "Civil Engineering",
  "Commerce and Accountancy", "Economics", "Electrical Engineering", "Geography", "Geology", "History", "Law",
  "Literature", "Management", "Mathematics", "Mechanical Engineering", "Medical Science", "Philosophy", "Physics",
  "PSIR", "Psychology", "Public Administration", "Sociology", "Statistics", "Zoology",
);
export const STATES = o(
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "North-East states", "Other Indian state or UT", "Outside India",
);

export type LeadProfile = {
  stage?: string;
  attempt?: string;
  mode?: string;
  working?: string;
  optional?: string;
  state?: string;
  /** Optional WhatsApp or mobile number, digits only, 10 digits. */
  phone?: string;
};

const LISTS: Record<Exclude<keyof LeadProfile, "phone">, Option[]> = {
  stage: STAGES, attempt: ATTEMPTS, mode: MODES, working: WORKING, optional: OPTIONALS, state: STATES,
};

/** Keeps only values from our own lists and a valid 10-digit Indian mobile number. Safe to run on untrusted input. */
export function sanitizeProfile(raw: unknown): LeadProfile {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: LeadProfile = {};
  for (const k of Object.keys(LISTS) as (keyof typeof LISTS)[]) {
    const v = r[k];
    if (typeof v === "string" && LISTS[k].some((x) => x.value === v)) out[k] = v;
  }
  if (typeof r.phone === "string") {
    const d = r.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (/^[6-9]\d{9}$/.test(d)) out.phone = d;
  }
  return out;
}

export const PROFILE_KEY = "upsc-lead-profile";
