import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { Types } from "mongoose";

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

function extractKeywords(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2 || /^\d+$/.test(w));
  return [...new Set(words)];
}

function buildRegexQueries(keywords: string[]) {
  const nameParts = keywords.filter((w) => isNaN(Number(w)));
  const yearMatch = keywords.find((w) => /^\d{4}$/.test(w));
  const rankMatch = keywords.find((w) => /^\d+$/.test(w) && !/^\d{4}$/.test(w));

  const orConditions: any[] = [];

  if (nameParts.length > 0) {
    orConditions.push(
      ...nameParts.map((kw) => ({
        $or: [
          { firstName: { $regex: kw, $options: "i" } },
          { firstname: { $regex: kw, $options: "i" } },
          { lastName: { $regex: kw, $options: "i" } },
          { lastname: { $regex: kw, $options: "i" } },
          { optionalSubject: { $regex: kw, $options: "i" } },
          { slug: { $regex: kw, $options: "i" } },
        ],
      })),
    );
  }

  if (yearMatch) {
    orConditions.push({ year: parseInt(yearMatch) });
  }

  if (rankMatch) {
    orConditions.push({ rank: parseInt(rankMatch) });
  }

  return orConditions.length > 0 ? { $or: orConditions } : {};
}

function scoreTopper(topper: any, keywords: string[]): number {
  let score = 0;
  const searchText = [
    topper.firstName,
    topper.firstname,
    topper.lastName,
    topper.lastname,
    topper.optionalSubject,
    topper.bio,
    topper.strategy,
    ...(topper.insights || []),
    topper.year?.toString(),
    topper.rank?.toString(),
    topper.slug,
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
  if (topper.rank <= 10) score += 10;
  else if (topper.rank <= 50) score += 5;
  else if (topper.rank <= 100) score += 2;

  return score;
}

export async function searchToppers(query: string): Promise<TopperResult[]> {
  await connectDB();

  const keywords = extractKeywords(query);
  const filter = buildRegexQueries(keywords);

  let matchedToppers: any[] = [];

  if (Object.keys(filter).length > 0) {
    matchedToppers = await TopperModel.find(filter)
      .select(
        "firstName lastName firstname lastname slug rank year optionalSubject marks bio strategy insights isFeatured",
      )
      .limit(30)
      .lean();
  }

  if (matchedToppers.length < 5) {
    const excludeIds = matchedToppers.map((t) => t._id);
    const popularToppers = await TopperModel.find(
      excludeIds.length > 0 ? { _id: { $nin: excludeIds } } : {},
    )
      .select(
        "firstName lastName firstname lastname slug rank year optionalSubject marks bio strategy insights isFeatured",
      )
      .sort({ rank: 1 })
      .limit(10)
      .lean();
    matchedToppers = [...matchedToppers, ...popularToppers];
  }

  const scored = matchedToppers
    .map((t) => ({
      topper: t,
      score: scoreTopper(t, keywords),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const results = scored.map((s) => ({
    name: `${s.topper.firstName || s.topper.firstname || ""} ${s.topper.lastName || s.topper.lastname || ""}`.trim(),
    slug: s.topper.slug,
    rank: s.topper.rank,
    year: s.topper.year,
    optionalSubject: s.topper.optionalSubject || "",
    marks: (s.topper.marks as Record<string, number>) || {},
    bio: s.topper.bio || "",
    strategy: (s.topper.strategy || "").slice(0, 2000),
    insights: s.topper.insights || [],
  }));

  return results;
}
