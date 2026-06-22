import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

export interface TopperResult {
  name: string;
  slug: string;
  rank: number;
  year: number;
  optionalSubject: string;
  marks: Record<string, number>;
  bio: string;
  strategy: string;
  insights: string[];
}

const KEYWORDS = [
  "gs1", "gs2", "gs3", "gs4", "essay", "interview", "optional",
  "strategy", "preparation", "prelims", "mains", "answer writing",
  "time management", "revision", "notes", "current affairs",
];

function extractKeywords(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2 || /^\d+$/.test(w));
  return [...new Set(words)];
}

function scoreTopper(topper: any, keywords: string[]): number {
  let score = 0;
  const searchText = [
    topper.firstName,
    topper.lastName,
    topper.optionalSubject,
    topper.bio,
    topper.strategy,
    ...(topper.insights || []),
    topper.year?.toString(),
    topper.rank?.toString(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const kw of keywords) {
    if (searchText.includes(kw)) {
      score += kw.length;
    }
  }

  if (topper.isFeatured) score += 5;
  if (topper.rank <= 5) score += 3;

  return score;
}

export async function searchToppers(query: string): Promise<TopperResult[]> {
  await connectDB();

  const keywords = extractKeywords(query);
  const allToppers = await TopperModel.find({})
    .select(
      "firstName lastName slug rank year optionalSubject marks bio strategy insights isFeatured",
    )
    .lean();

  const scored = allToppers
    .map((t) => ({
      topper: t,
      score: scoreTopper(t, keywords),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return scored.filter((s) => s.score > 0).map((s) => ({
    name: `${s.topper.firstName} ${s.topper.lastName}`.trim(),
    slug: s.topper.slug,
    rank: s.topper.rank,
    year: s.topper.year,
    optionalSubject: s.topper.optionalSubject || "",
    marks: (s.topper.marks as Record<string, number>) || {},
    bio: s.topper.bio || "",
    strategy: (s.topper.strategy || "").slice(0, 500),
    insights: s.topper.insights || [],
  }));
}
