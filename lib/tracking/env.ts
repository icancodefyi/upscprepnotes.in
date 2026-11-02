/**
 * Tracking records only the live site. On Vercel that means the Production deployment (not Preview);
 * elsewhere, any production build. `next dev` and local `next start` runs never write.
 */
export function trackingEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return false;
  return true;
}
