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
    /** Optional answers from the request page. Fixed choices only (see lib/lead-profile.ts). */
    profile: {
      stage: String, attempt: String, mode: String, working: String, optional: String, state: String, phone: String,
    },
    /** Approximate location from the request's network headers, captured at submit (see lib/geo.ts). Not typed by the visitor. */
    country: { type: String, default: "" },
    region: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

export const FreeDownloadLeadModel =
  models.FreeDownloadLead || model("FreeDownloadLead", freeDownloadLeadSchema);
