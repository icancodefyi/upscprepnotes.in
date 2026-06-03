import mongoose, { model, models, Schema } from "mongoose";

const freeGuideLeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const FreeGuideLeadModel =
  models.FreeGuideLead || model("FreeGuideLead", freeGuideLeadSchema);
