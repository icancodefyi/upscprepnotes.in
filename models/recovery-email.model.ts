import { model, models, Schema } from "mongoose";

/** One row per abandoned-checkout email sent, so no order is mailed the same stage twice. */
const recoveryEmailSchema = new Schema(
  {
    orderId: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    stage: { type: Number, required: true },
  },
  { timestamps: true }
);

recoveryEmailSchema.index({ orderId: 1, stage: 1 }, { unique: true });
recoveryEmailSchema.index({ email: 1, createdAt: -1 });

export const RecoveryEmailModel =
  models.RecoveryEmail || model("RecoveryEmail", recoveryEmailSchema);
