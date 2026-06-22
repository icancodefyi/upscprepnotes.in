import mongoose, { model, models, Schema } from "mongoose";

const freeMaterialLeadSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    pdfSlug: { type: String, required: true },
    pdfTitle: { type: String, required: true },
    category: { type: String, default: "" },
    source: { type: String, default: "free_materials" },
  },
  { timestamps: true }
);

freeMaterialLeadSchema.index({ email: 1, pdfSlug: 1 }, { unique: true });

export const FreeMaterialLeadModel =
  models.FreeMaterialLead || model("FreeMaterialLead", freeMaterialLeadSchema);
