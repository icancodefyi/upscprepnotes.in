import mongoose, { model, models, Schema } from "mongoose";

const subscriberEmailSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const SubscriberEmailModel =
  models.SubscriberEmail || model("SubscriberEmail", subscriberEmailSchema);
