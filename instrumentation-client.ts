import posthog from "posthog-js";

const isProduction = process.env.NODE_ENV === "production";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  // Only autocapture exceptions in production. In development this would
  // otherwise report dev-only errors (e.g. Turbopack's HMR ChunkLoadError)
  // that never ship to real users, adding noise to error tracking.
  capture_exceptions: isProduction,
  // Capture dead clicks — taps on elements that look interactive but do
  // nothing (e.g. hover-highlighted rows with no link, or CTAs hidden
  // under fixed overlays). Without this, single-tap-then-bounce frustration
  // never crosses the $rageclick threshold and stays invisible in analytics.
  capture_dead_clicks: true,
  debug: process.env.NODE_ENV === "development",
});
