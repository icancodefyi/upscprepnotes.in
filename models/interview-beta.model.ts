import mongoose, { model, models, Schema } from "mongoose";

/** People who asked to test the mock interview tool, with what they want from it. One record per email. */
const interviewBetaSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    name: { type: String, required: true },
    phone: String,
    stage: String,
    attempt: String,
    optional: String,
    faced: String,
    device: String,
    features: [String],
    pay: String,
    wish: String,
    source: String,
    visitorId: String,
    submissions: Number,
  },
  { timestamps: true, collection: "interviewbetas" },
);

export const InterviewBetaModel =
  (models.InterviewBeta as mongoose.Model<mongoose.InferSchemaType<typeof interviewBetaSchema>>) || model("InterviewBeta", interviewBetaSchema);
