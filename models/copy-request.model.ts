import mongoose, { model, models, Schema } from "mongoose";

const copyRequestSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    topperSlug: { type: String, required: true },
    topperName: { type: String, required: true },
  },
  { timestamps: true }
);

export const CopyRequestModel =
  models.CopyRequest || model("CopyRequest", copyRequestSchema);
