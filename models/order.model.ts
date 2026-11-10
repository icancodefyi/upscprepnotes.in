import mongoose, { model, models, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    email: { type: String, lowercase: true, trim: true },
    items: [
      {
        slug: { type: String, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    offeredPrice: { type: Number },
    ref: { type: String, unique: true, sparse: true },
    dodoSessionId: { type: String, unique: true, sparse: true },
    dodoPaymentId: { type: String },
    /** Which payment provider took the money. Orders created before this field are Dodo orders. */
    provider: { type: String, enum: ["dodo", "razorpay"], default: "dodo" },
    razorpayOrderId: { type: String, unique: true, sparse: true },
    razorpayPaymentId: { type: String },
    downloadToken: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ["pending", "paid", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const OrderModel =
  models.Order || model("Order", orderSchema);
