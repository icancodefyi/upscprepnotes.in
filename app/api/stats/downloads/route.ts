import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "download-stats.json");

function readStats() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = { count: 47, lastUpdated: Date.now() };
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return { count: 47, lastUpdated: Date.now() };
  }
}

function writeStats(data: { count: number; lastUpdated: number }) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

export async function GET() {
  const stats = readStats();

  // Increment count slowly over time for realism
  const elapsed = Date.now() - stats.lastUpdated;
  const increment = Math.floor(elapsed / 60000); // ~1 per minute
  if (increment > 0) {
    stats.count += Math.min(increment, 5); // cap at 5 per check
    stats.lastUpdated = Date.now();
    writeStats(stats);
  }

  return NextResponse.json({
    count: stats.count,
    window: "30m",
  });
}
