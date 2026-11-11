import mongoose, { model, models, Schema } from "mongoose";

const freeMaterialLeadSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    pdfSlug: { type: String, required: true },
    pdfTitle: { type: String, required: true },
    category: { type: String, default: "" },
    source: { type: String, default: "free_materials" },
    sentDay1FollowUp: { type: Boolean, default: false },
    sentDay3FollowUp: { type: Boolean, default: false },
    /** Answers from the request form (see lib/lead-profile.ts). Fixed choices plus a WhatsApp number. */
    profile: {
      stage: String, attempt: String, mode: String, working: String, optional: String, state: String, phone: String,
    },
    /** Approximate location from the request's network headers, captured at submit (see lib/geo.ts). */
    country: { type: String, default: "" },
    region: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

freeMaterialLeadSchema.index({ email: 1, pdfSlug: 1 }, { unique: true });

export const FreeMaterialLeadModel =
  models.FreeMaterialLead || model("FreeMaterialLead", freeMaterialLeadSchema);
