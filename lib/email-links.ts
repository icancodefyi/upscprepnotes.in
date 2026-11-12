import { createHmac, timingSafeEqual } from "crypto";

export const SITE = (process.env.SITE_URL || "https://upscprepnotes.in").replace(/\/$/, "");

function secret(): string {
  const s = process.env.AUTH_SECRET || process.env.CRON_SECRET;
  if (!s) throw new Error("Set AUTH_SECRET or CRON_SECRET to sign email links");
  return s;
}

export function emailToken(email: string): string {
  return createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}

export function verifyEmailToken(email: string, token: string): boolean {
  try {
    const a = Buffer.from(emailToken(email));
    const b = Buffer.from(token || "");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const LEAVE_REASONS = ["expensive", "failed", "unsure"] as const;
export type LeaveReason = (typeof LEAVE_REASONS)[number];

/** One-tap "why did you leave" link for an abandoned order. The token ties the answer to that order. */
export function checkoutFeedbackUrl(orderId: string, reason: LeaveReason): string {
  return `${SITE}/api/checkout-feedback?o=${encodeURIComponent(orderId)}&r=${reason}&t=${emailToken(`co:${orderId}:${reason}`)}`;
}

/** Page a person lands on from the email footer. */
export function unsubscribePageUrl(email: string): string {
  return `${SITE}/unsubscribe?e=${encodeURIComponent(email)}&t=${emailToken(email)}`;
}

/** One-click endpoint used by the List-Unsubscribe header. */
export function unsubscribeApiUrl(email: string): string {
  return `${SITE}/api/unsubscribe?e=${encodeURIComponent(email)}&t=${emailToken(email)}`;
}

export function unsubscribeHeaders(email: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeApiUrl(email)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
