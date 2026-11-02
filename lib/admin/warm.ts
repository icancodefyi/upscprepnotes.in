import { getAudience, getLeads, getOverview } from "@/lib/admin/insights";
import { loadUsers } from "@/lib/admin/users";

let last = 0;

/**
 * Called when any admin page renders. Fills the caches for the pages used most, in the background,
 * so the next click is instant. Runs at most once every 2 minutes per server process.
 */
export function warmAdminCaches() {
  if (Date.now() - last < 2 * 60_000) return;
  last = Date.now();
  void Promise.allSettled([getOverview(30), getAudience(30), getLeads(30), loadUsers()]);
}
