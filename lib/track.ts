"use client";

/**
 * Browser side of the `tracking` collection. `track()` queues an event; the queue is sent in batches
 * to /api/track every few seconds, when it reaches 20 events, and with sendBeacon when the page hides.
 * Global capture (page views, clicks, forms, search typing, scroll, errors) lives in components/Tracker.tsx.
 * Event list: docs/tracking.md.
 */

type Props = Record<string, unknown>;
type QueuedEvent = { event: string; ts: number; path: string; props: Props };

const ENDPOINT = "/api/track";
const queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

const ATTR_PARAMS: [string, string][] = [
  ["utm_source", "source"],
  ["utm_medium", "medium"],
  ["utm_campaign", "campaign"],
  ["utm_term", "term"],
  ["utm_content", "content"],
  ["gclid", "gclid"],
  ["fbclid", "fbclid"],
  ["ref", "ref"],
];

/** Anonymous browser id (cookie `_vid`, one year) and per-tab session id. */
export function getVisitorId(): string {
  try {
    const match = document.cookie.match(/(?:^|;\s*)_vid=([^;]*)/);
    if (match) return match[1];
    const id = "v" + Date.now() + Math.random().toString(36).slice(2, 12);
    document.cookie = `_vid=${id};path=/;max-age=31536000;SameSite=Lax`;
    return id;
  } catch {
    return "unknown";
  }
}

export function getSessionId(): string {
  try {
    let s = sessionStorage.getItem("_sid");
    if (!s) {
      s = "s" + Date.now() + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem("_sid", s);
    }
    return s;
  } catch {
    return "unknown";
  }
}

/**
 * Tracking runs only on the live site: production build, not localhost, not /admin, not Do Not Track / GPC.
 * Open any page with ?optex=1 to exclude your own browser (?optex=0 switches it back on).
 */
function enabled() {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)) return false;
  if (window.location.pathname.startsWith("/admin")) return false;
  try {
    const q = new URLSearchParams(window.location.search).get("optex");
    if (q === "1") localStorage.setItem("_optex", "1");
    else if (q === "0") localStorage.removeItem("_optex");
    if (localStorage.getItem("_optex") === "1") return false;
  } catch {}
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return false;
  return true;
}

function read(store: Storage | undefined, key: string): Record<string, string> | undefined {
  try {
    const v = store?.getItem(key);
    return v ? JSON.parse(v) : undefined;
  } catch {
    return undefined;
  }
}

/** Remember where this session (and this visitor, ever) came from. Call once on load. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const [param, key] of ATTR_PARAMS) {
      const v = q.get(param);
      if (v) found[key] = v.slice(0, 200);
    }
    const landing = window.location.pathname;
    const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer.slice(0, 300) : "";
    if (!sessionStorage.getItem("_tutm")) {
      sessionStorage.setItem("_tutm", JSON.stringify({ ...found, landing, ...(referrer ? { referrer } : {}) }));
    } else if (Object.keys(found).length) {
      sessionStorage.setItem("_tutm", JSON.stringify({ ...read(sessionStorage, "_tutm"), ...found }));
    }
    if (!localStorage.getItem("_tfirst")) {
      localStorage.setItem("_tfirst", JSON.stringify({ ...found, landing, ...(referrer ? { referrer } : {}), at: new Date().toISOString().slice(0, 10) }));
    }
  } catch {}
}

function schedule() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    flush();
  }, 4000);
}

/** Queue one event. `path` defaults to the current page. */
export function track(event: string, props: Props = {}, opts: { path?: string } = {}) {
  if (!enabled()) return;
  queue.push({
    event,
    ts: Date.now(),
    path: opts.path ?? window.location.pathname + window.location.search,
    props,
  });
  if (queue.length >= 20) flush();
  else schedule();
}

/** Link this visitor to an email they gave us (lead form, checkout, sign-in). */
export function identify(email: string, source: string) {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return;
  try {
    const key = `_tid_${e}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {}
  track("identify", { email: e, source });
  flush();
}

/** Send the queue now. `beacon` survives the page closing. */
export function flush(beacon = false) {
  if (typeof window === "undefined" || !queue.length) return;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  while (queue.length) {
    const events = queue.splice(0, 50);
    const body = JSON.stringify({
      v: 1,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      referrer: document.referrer || "",
      utm: read(sessionStorage, "_tutm"),
      firstTouch: read(localStorage, "_tfirst"),
      screen: { w: window.innerWidth, h: window.innerHeight },
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      events,
    });
    try {
      if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
      }
    } catch {}
  }
}
