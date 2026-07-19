import mongoose, { model, models, Schema } from "mongoose";

const pendingPurchaseSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    orderId: { type: String, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    total: { type: Number, required: true },
    downloadToken: { type: String, required: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PendingPurchaseModel =
  models.PendingPurchase || model("PendingPurchase", pendingPurchaseSchema);
