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
    /** Who started this checkout (from our tracker), so a pending order can be matched to what that visitor did. */
    visitorId: { type: String },
    sessionId: { type: String },
    /** What happened in the payment window, newest last (kept to the last 10). */
    payAttempts: [{ at: { type: Date, default: Date.now }, kind: { type: String, enum: ["failed", "dismissed"] }, reason: { type: String }, _id: false }],
    /** Why they left, chosen with one tap from the reminder email. Once set, no more reminders are sent. */
    leftReason: { type: String, enum: ["expensive", "failed", "unsure"] },
    leftReasonAt: { type: Date },
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
