import mongoose, { model, models, Schema } from "mongoose";

/**
 * One "getting your files ready" page. Created when someone gives their email for a free
 * download, then opened at /get/<token>. Holds only what the page needs to show; it expires
 * on its own after a week.
 */
const fileSchema = new Schema({ name: { type: String, required: true }, url: { type: String, required: true } }, { _id: false });

const downloadHandoffSchema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    kind: { type: String, enum: ["answer-copy", "free-material", "guide", "schemes"], required: true },
    title: { type: String, required: true },
    files: { type: [fileSchema], default: [] },
    /** True when the file isn't ready yet (an answer copy still being scanned): the page says so instead of offering a download. */
    pending: { type: Boolean, default: false },
    /** Masked, e.g. "ab***@gmail.com". The full address is never stored on this record. */
    emailMasked: { type: String, default: "" },
    /** Page to send the visitor back to, a path on this site. */
    returnTo: { type: String, default: "/" },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
  },
  { versionKey: false },
);

export type DownloadHandoff = {
  token: string;
  kind: "answer-copy" | "free-material" | "guide" | "schemes";
  title: string;
  files: { name: string; url: string }[];
  pending: boolean;
  emailMasked: string;
  returnTo: string;
};

export const DownloadHandoffModel =
  (models.DownloadHandoff as mongoose.Model<DownloadHandoff>) || model<DownloadHandoff>("DownloadHandoff", downloadHandoffSchema);
