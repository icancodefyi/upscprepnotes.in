import mongoose, { model, models, Schema } from "mongoose";

const nurtureCampaignSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    topperName: { type: String, default: "" },
    step: { type: Number, default: 0 },
    nextScheduledAt: { type: Date, default: () => new Date() },
    sentAt: [{ type: Date }],
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

nurtureCampaignSchema.index({ email: 1 });
nurtureCampaignSchema.index({ nextScheduledAt: 1, step: 1 });

export const NurtureCampaignModel =
  models.NurtureCampaign || model("NurtureCampaign", nurtureCampaignSchema);
