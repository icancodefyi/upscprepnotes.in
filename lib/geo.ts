/**
 * Approximate location of the visitor, read from headers that the hosting layer adds to each request.
 * It is an estimate from the connection, never a verified address. The raw IP is not stored here.
 *
 * Set GEO_PROVIDER to the host that fronts this site:
 *   - "vercel"      Vercel adds x-vercel-ip-* headers (country, region, city).
 *   - "cloudflare"  Cloudflare adds cf-ipcountry (country on every plan; region on some plans).
 *   - "proxy"       Your own reverse proxy sets x-geo-country / x-geo-region / x-geo-city.
 *                   It MUST overwrite those headers on every request, or visitors can fake them.
 *   - unset         No location is recorded. Vercel is detected automatically while it hosts the site.
 */
export type Geo = { country?: string; region?: string; city?: string };

type Provider = "vercel" | "cloudflare" | "proxy" | "none";

function provider(): Provider {
  const p = (process.env.GEO_PROVIDER || (process.env.VERCEL ? "vercel" : "none")).toLowerCase();
  return p === "vercel" || p === "cloudflare" || p === "proxy" ? p : "none";
}

const HEADERS: Record<Exclude<Provider, "none">, { country: string; region?: string; city?: string }> = {
  vercel: { country: "x-vercel-ip-country", region: "x-vercel-ip-country-region", city: "x-vercel-ip-city" },
  cloudflare: { country: "cf-ipcountry", region: "cf-region-code", city: "cf-ipcity" },
  proxy: { country: "x-geo-country", region: "x-geo-region", city: "x-geo-city" },
};

function clean(v: string | null, max: number): string | undefined {
  if (!v) return undefined;
  let s = v;
  try {
    s = decodeURIComponent(v);
  } catch {
    /* keep the raw value */
  }
  s = s.replace(/[\u0000-\u001f<>"']/g, "").trim().slice(0, max);
  return s || undefined;
}

/** Country as a two-letter code, region as a short code (for example "UP"), city as plain text. */
export function geoFrom(headers: Headers): Geo {
  const p = provider();
  if (p === "none") return {};
  const h = HEADERS[p];
  const rawCountry = headers.get(h.country)?.trim().toUpperCase() ?? "";
  return {
    country: /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : undefined,
    region: h.region ? clean(headers.get(h.region), 10)?.toUpperCase() : undefined,
    city: h.city ? clean(headers.get(h.city), 80) : undefined,
  };
}
