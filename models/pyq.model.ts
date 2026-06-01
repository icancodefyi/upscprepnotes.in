import mongoose, { model, models, Schema } from "mongoose";

const pyqSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

pyqSchema.index({ year: 1, category: 1, title: 1 }, { unique: true });

export const PYQModel = models.PYQ || model("PYQ", pyqSchema);
