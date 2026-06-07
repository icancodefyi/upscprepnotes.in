import mongoose, { model, models, Schema } from "mongoose";

const freeDownloadLeadSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    topperSlug: { type: String, required: true },
    topperName: { type: String, required: true },
    source: { type: String, default: "" },
    sourceUrl: { type: String, default: "" },
    available: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FreeDownloadLeadModel =
  models.FreeDownloadLead || model("FreeDownloadLead", freeDownloadLeadSchema);
