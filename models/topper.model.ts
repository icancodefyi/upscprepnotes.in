import mongoose, { model, models, Schema } from "mongoose";

const topperSchema = new Schema(
  {
    firstName: String,
    lastName: String,

    rank: Number,
    year: Number,

    optionalSubject: String,

    marks: {
      gs1: Number,
      gs2: Number,
      gs3: Number,
      gs4: Number,

      essay: Number,

      optional1: Number,
      optional2: Number,

      interview: Number,
      written: Number,
      total: Number,
    },

    bio: String,
    strategy: String,

    slug: {
      type: String,
      unique: true,
    },

    ProfileImage: String,

    insights: [String],

    answerCopies: {
      gs1: [String],
      gs2: [String],
      gs3: [String],
      gs4: [String],
      essay: [String],
    },
    resources: {
      essayLinks: [String],
      gs1Links: [String],
      gs2Links: [String],
      gs3Links: [String],
      gs4Links: [String],
    },
    image: {
      profileImage: String,
      imageUrl: String,
    },
    metadata: {
      migratedAt: Date,
      enrichedAt: Date,
      lastTriedAt: Date,
    },
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isIndexed: {
      type: Boolean,
      default: false,
    },
    freeAnswerCopyUrl: String,
    freeAnswerCopyUrls: [String],
  },
  {
    timestamps: true,
  }
);

export const TopperModel =
  models.Topper || model("Topper", topperSchema);
