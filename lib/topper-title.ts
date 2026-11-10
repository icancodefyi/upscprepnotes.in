/** "Abhishek Sharma (AIR 38, 2024)" → name, rank number and year. Anything else comes back as just a name. */
export function parseTopperTitle(title: string): { name: string; rank?: string; rankNumber?: number; year?: string; yearNumber?: number } {
  const m = title.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (!m) return { name: title };
  const parts = m[2].split(",").map((s) => s.trim());
  const rank = parts.find((p) => /^AIR\s*\d+/i.test(p));
  const year = parts.find((p) => /^\d{4}$/.test(p));
  return {
    name: m[1],
    rank,
    rankNumber: rank ? Number(rank.replace(/\D/g, "")) : undefined,
    year,
    yearNumber: year ? Number(year) : undefined,
  };
}
