/** Cleaning for tracking payloads: no stray emails or phone numbers in free text, bounded sizes. */

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// Indian mobiles (optionally +91 / 0 prefixed) and any long digit run that looks like a phone.
const PHONE = /(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}\b|\b\d{10,13}\b/g;

export function scrubText(s: unknown, max = 500): string {
  return String(s ?? "")
    .replace(EMAIL, "[email]")
    .replace(PHONE, "[phone]")
    .slice(0, max);
}

/** Recursively bound and scrub an event's props: depth 3, 30 keys, 30 array items, 500 chars per string. */
export function scrubProps(v: unknown, depth = 0): unknown {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "string") return scrubText(v, depth === 0 ? 1000 : 500);
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "boolean") return v;
  if (depth >= 3) return undefined;
  if (Array.isArray(v)) return v.slice(0, 30).map((x) => scrubProps(x, depth + 1));
  if (typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>).slice(0, 30)) {
      if (!/^[A-Za-z0-9_.-]{1,40}$/.test(k)) continue;
      const c = scrubProps(val, depth + 1);
      if (c !== undefined) out[k] = c;
    }
    return out;
  }
  return undefined;
}

export function normEmail(e: unknown): string | undefined {
  const s = String(e ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254 ? s : undefined;
}

export const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegrambot|curl|wget|python-requests|axios|node-fetch/i;
