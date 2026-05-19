import mongoose, { model, models, Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    package: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["lead", "contacted", "converted", "cancelled"],
      default: "lead",
    },
    source: { type: String, default: "toppers-copy-compilation" },
  },
  { timestamps: true }
);

export const PurchaseModel =
  models.Purchase || model("Purchase", purchaseSchema);
