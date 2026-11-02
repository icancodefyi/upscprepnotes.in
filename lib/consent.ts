"use client";

/** The visitor's analytics choice, kept in this browser only. `null` = not asked yet. */
export type Consent = "yes" | "no" | null;

const KEY = "_consent";
const EVENT = "up-consent";

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: "yes" | "no") {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function onConsentChange(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
