import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

function normalizeTopper(topper: any) {
  return {
    firstName: topper.firstname,
    lastName: topper.lastname,

    rank: topper.rank,
    year: topper.year,

    optionalSubject: topper.optionalSub,

    marks: {
      gs1: topper.gs1marks,
      gs2: topper.gs2marks,
      gs3: topper.gs3marks,
      gs4: topper.gs4marks,

      essay: topper.essayMarks,

      optional1: topper.optional1Marks,
      optional2: topper.optional2Marks,

      interview: topper.interviewMarks,
      written: topper.writtenMarks,
      total: topper.totalMarks,
    },

    bio: topper.bio,

    strategy: topper.strategy,

    slug: topper.slug,

    imageUrl: topper.imageUrl,

    insights: topper.insights || [],

    answerCopies: {
      gs1: topper.gs1Links || [],
      gs2: topper.gs2Links || [],
      gs3: topper.gs3Links || [],
      gs4: topper.gs4Links || [],
      essay: topper.essayLinks || [],
    },
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

  const toppers = await TopperModel.find()
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
    optionalSub: optionalSubject,
    slug: { $ne: currentSlug },
  })
    .limit(6)
    .lean();

  return toppers.map(normalizeTopper);
}