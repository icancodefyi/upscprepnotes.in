import { model, models, Schema } from "mongoose";

/** Addresses that asked not to get marketing email. Checked before every nurture / recovery send. */
const emailSuppressionSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    reason: { type: String, default: "unsubscribe" },
  },
  { timestamps: true }
);

export const EmailSuppressionModel =
  models.EmailSuppression || model("EmailSuppression", emailSuppressionSchema);
