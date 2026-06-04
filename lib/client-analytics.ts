"use client";

export function trackClientEvent(
  event: string,
  metadata?: Record<string, unknown>
) {
  try {
    const payload = JSON.stringify({
      event,
      pagePath: window.location.pathname,
      sessionId: sessionStorage.getItem("_sid") || "unknown",
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
