import mongoose, { model, models, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    screenshotUrl: { type: String, default: "" },
    orderId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["paid", "verified", "access_granted"],
      default: "paid",
    },
  },
  { timestamps: true }
);

export const CustomerModel =
  models.Customer || model("Customer", customerSchema);
