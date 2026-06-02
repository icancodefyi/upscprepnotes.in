import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

function normalizeTopper(topper: any) {
  return {
    _id: topper._id?.toString(),
    firstName: topper.firstName,
    lastName: topper.lastName,

    rank: topper.rank,
    year: topper.year,

    optionalSubject: topper.optionalSubject,

    marks: {
      gs1: topper.marks?.gs1 || 0,
      gs2: topper.marks?.gs2 || 0,
      gs3: topper.marks?.gs3 || 0,
      gs4: topper.marks?.gs4 || 0,

      essay: topper.marks?.essay || 0,

      optional1: topper.marks?.optional1 || 0,
      optional2: topper.marks?.optional2 || 0,

      interview: topper.marks?.interview || 0,
      written: topper.marks?.written || 0,
      total: topper.marks?.total || 0,
    },

    bio: topper.bio || "",

    strategy: topper.strategy || "",

    slug: topper.slug,

    ProfileImage: topper.ProfileImage,

    insights: topper.insights || [],

    answerCopies: {
      gs1: topper.answerCopies?.gs1 || [],
      gs2: topper.answerCopies?.gs2 || [],
      gs3: topper.answerCopies?.gs3 || [],
      gs4: topper.answerCopies?.gs4 || [],
      essay: topper.answerCopies?.essay || [],
    },

    resources: {
      essayLinks: topper.resources?.essayLinks || [],
      gs1Links: topper.resources?.gs1Links || [],
      gs2Links: topper.resources?.gs2Links || [],
      gs3Links: topper.resources?.gs3Links || [],
      gs4Links: topper.resources?.gs4Links || [],
    },

    isFeatured: topper.isFeatured || false,
    isIndexed: topper.isIndexed || false,
  };
}

export async function getTopperBySlug(slug: string) {
  await connectDB();

  const topper = await TopperModel.findOne({ slug }).lean();

  if (!topper) return null;

  return normalizeTopper(topper);
}

export async function getFeaturedToppers() {
  await connectDB();

  const toppers = await TopperModel.find({ isFeatured: true })
    .sort({ rank: 1 })
    .limit(10)
    .lean();

  return toppers.map(normalizeTopper);
}

export async function getRelatedToppers(
  optionalSubject: string,
  currentSlug: string
) {
  await connectDB();

  const toppers = await TopperModel.find({
    optionalSubject: optionalSubject,
    slug: { $ne: currentSlug },
  })
    .limit(6)
    .lean();

  return toppers.map(normalizeTopper);
}

export async function getToppersByRank(rank: number, currentSlug: string) {
  await connectDB();

  const toppers = await TopperModel.find({
    rank,
    slug: { $ne: currentSlug },
  })
    .sort({ year: -1 })
    .limit(6)
    .lean();

  return toppers.map(normalizeTopper);
}

export async function getToppersByYear(year: number, currentSlug: string) {
  await connectDB();

  const toppers = await TopperModel.find({
    year,
    slug: { $ne: currentSlug },
  })
    .sort({ rank: 1 })
    .limit(10)
    .lean();

  return toppers.map(normalizeTopper);
}

export async function getAllIndexedToppers() {
  await connectDB();

  const toppers = await TopperModel.find({ isIndexed: true })
    .select("slug updatedAt createdAt")
    .lean();

  return toppers;
}

export async function getAllToppersList() {
  await connectDB();

  const toppers = await TopperModel.find({ isIndexed: true })
    .select("firstName lastName rank year optionalSubject slug isFeatured")
    .sort({ year: -1, rank: 1 })
    .lean();

  return toppers.map((t: any) => ({
    firstName: t.firstName,
    lastName: t.lastName,
    rank: t.rank,
    year: t.year,
    optionalSubject: t.optionalSubject || "",
    slug: t.slug,
    isFeatured: t.isFeatured || false,
  }));
}