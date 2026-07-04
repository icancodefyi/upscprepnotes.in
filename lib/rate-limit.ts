import mongoose from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "./mongodb";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  ai: { maxRequests: 30, windowMs: 60000 },
  broadcast: { maxRequests: 5, windowMs: 60000 },
  cron: { maxRequests: 10, windowMs: 60000 },
  "debug-email": { maxRequests: 3, windowMs: 60000 },
  outreach: { maxRequests: 10, windowMs: 60000 },
  leads: { maxRequests: 10, windowMs: 60000 },
  analytics: { maxRequests: 100, windowMs: 60000 },
  form: { maxRequests: 20, windowMs: 60000 },
};

export async function rateLimit(
  ip: string,
  route: string,
  config?: RateLimitConfig,
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const cfg = config || DEFAULTS[route] || { maxRequests: 30, windowMs: 60000 };
  const key = `ratelimit:${route}:${ip}`;
  const now = Date.now();

  await connectDB();
  const coll = mongoose.connection.db!.collection("ratelimits");

  await coll.createIndex({ createdAt: 1 }, { expireAfterSeconds: Math.ceil(cfg.windowMs / 1000) });
  await coll.createIndex({ key: 1 });

  const windowStart = now - cfg.windowMs;

  const [countResult] = await Promise.all([
    coll.countDocuments({ key, createdAt: { $gte: new Date(windowStart) } }),
    coll.insertOne({ key, createdAt: new Date(now) }),
  ]);

  const allowed = countResult < cfg.maxRequests;
  const remaining = Math.max(0, cfg.maxRequests - countResult - 1);

  return { allowed, remaining, resetIn: cfg.windowMs };
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "127.0.0.1";
}

export async function checkRateLimit(
  req: NextRequest,
  route: string,
  config?: RateLimitConfig,
): Promise<NextResponse | null> {
  const ip = getIp(req);
  const result = await rateLimit(ip, route, config);
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(result.resetIn / 1000)) } },
    );
  }
  return null;
}
