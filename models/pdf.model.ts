import mongoose, { model, models, Schema } from "mongoose";

const pdfSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["test-series", "notes", "books", "magazines", "current-affairs", "optional", "other"],
      required: true,
    },
    brand: { type: String, default: "" },
    author: { type: String, default: "" },
    imagekitUrl: { type: String, default: "" },
    fileSize: { type: String, default: "" },
    pageCount: { type: Number, default: 0 },
    year: { type: Number },
    language: { type: String, enum: ["en", "hi", "both"], default: "en" },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pdfSchema.index({ category: 1, brand: 1 });
pdfSchema.index({ tags: 1 });
pdfSchema.index({ slug: 1 }, { unique: true });

export const PDFModel = models.PDF || model("PDF", pdfSchema);
