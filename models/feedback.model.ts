import mongoose, { model, models, Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ["complaint", "suggestion", "bug", "correction", "other"],
      default: "other",
    },
    message: { type: String, required: true },
    url: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "read", "responded"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const FeedbackModel =
  models.Feedback || model("Feedback", feedbackSchema);
