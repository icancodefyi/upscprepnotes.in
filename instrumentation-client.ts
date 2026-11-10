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
  // The payment provider's success URL carries the buyer's email. Strip it from every URL property before sending.
  sanitize_properties: (props) => {
    for (const key of Object.keys(props)) {
      const value = props[key];
      if (typeof value !== "string" || !value.includes("email=")) continue;
      try {
        const u = new URL(value);
        u.searchParams.delete("email");
        props[key] = u.toString();
      } catch {}
    }
    return props;
  },
  debug: process.env.NODE_ENV === "development",
});
