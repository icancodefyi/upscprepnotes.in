import { geoFrom } from "@/lib/geo";
import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { TrackingEventModel } from "@/models/tracking.model";
import { BOT_UA, normEmail, scrubProps, scrubText } from "@/lib/tracking/scrub";
import { trackingEnabled } from "@/lib/tracking/env";

export const dynamic = "force-dynamic";

const EVENT_NAME = /^[a-z][a-z0-9_]{1,39}$/;
const done = () => new Response(null, { status: 204 });

const pickStrings = (o: unknown, keys: string[]) => {
  if (!o || typeof o !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = (o as Record<string, unknown>)[k];
    if (typeof v === "string" && v) out[k] = scrubText(v, 200);
  }
  return Object.keys(out).length ? out : undefined;
};
const ATTR_KEYS = ["source", "medium", "campaign", "term", "content", "gclid", "fbclid", "ref", "landing", "referrer"];

/** Batched browser events (sent by lib/track.ts) into the `tracking` collection. */
export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(req, "analytics");
  if (rl) return rl;

  // Only the live site writes; dev, local runs, previews and bots never reach the collection.
  if (!trackingEnabled()) return done();
  const host = req.headers.get("host") || "";
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|$)/.test(host)) return done();
  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT_UA.test(ua)) return done();

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 120_000) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const events = Array.isArray(body.events) ? body.events.slice(0, 50) : [];
  if (!events.length) return done();

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const salt = process.env.TRACKING_SALT || process.env.AUTH_SECRET || "upscprepnotes";
  const ipHash = ip ? createHash("sha256").update(ip + salt).digest("hex").slice(0, 16) : undefined;
  const geo = geoFrom(req.headers);
  const screen = (body.screen || {}) as { w?: number; h?: number };
  const w = Number(screen.w) || undefined;
  const common = {
    source: "client" as const,
    visitorId: typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : undefined,
    sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : undefined,
    referrer: body.referrer ? scrubText(body.referrer, 300) : undefined,
    utm: pickStrings(body.utm, ATTR_KEYS),
    firstTouch: pickStrings(body.firstTouch, ATTR_KEYS),
    device: {
      type: /Mobile|Android|iPhone|iPod/i.test(ua) && !/iPad/i.test(ua) ? "mobile" : /iPad|Tablet/i.test(ua) ? "tablet" : "desktop",
      w,
      h: Number(screen.h) || undefined,
      ua: ua.slice(0, 300),
    },
    lang: typeof body.lang === "string" ? body.lang.slice(0, 20) : undefined,
    tz: typeof body.tz === "string" ? body.tz.slice(0, 60) : undefined,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    ipHash,
  };

  const now = Date.now();
  const docs = events.flatMap((raw: unknown) => {
    if (!raw || typeof raw !== "object") return [];
    const e = raw as { event?: unknown; ts?: unknown; path?: unknown; props?: unknown };
    const name = String(e.event || "");
    if (!EVENT_NAME.test(name)) return [];
    const props = (scrubProps(e.props ?? {}) || {}) as Record<string, unknown>;
    // Identity: the email lives in its own field, never in props.
    let email: string | undefined;
    if (name === "identify") {
      email = normEmail((e.props as Record<string, unknown> | undefined)?.email);
      delete props.email;
      if (!email) return [];
    }
    const clientTs = Number(e.ts);
    return [
      {
        ...common,
        event: name,
        ts: new Date(),
        clientTs: Number.isFinite(clientTs) && Math.abs(now - clientTs) < 7 * 864e5 ? new Date(clientTs) : undefined,
        path: scrubText(e.path, 300) || undefined,
        email,
        props,
      },
    ];
  });
  if (!docs.length) return done();

  try {
    await connectDB();
    await TrackingEventModel.insertMany(docs, { ordered: false });
  } catch (err) {
    console.error("track insert failed:", err);
  }
  return done();
}
