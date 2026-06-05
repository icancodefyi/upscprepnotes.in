"use client";

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

function getSessionId(): string {
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

export function trackClientEvent(
  event: string,
  metadata?: Record<string, unknown>
) {
  try {
    const payload = JSON.stringify({
      event,
      pagePath: window.location.pathname,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
      deviceType: /Mobile|Android|iPhone|iP(od|hone)/i.test(navigator.userAgent) && !/iPad/i.test(navigator.userAgent) ? "mobile" : /iPad|Tablet/i.test(navigator.userAgent) ? "tablet" : "desktop",
      metadata: metadata || {},
    });
    navigator.sendBeacon(
      "/api/analytics/event",
      new Blob([payload], { type: "application/json" })
    );
  } catch {
    /* silently fail */
  }
}
