import mongoose, { Schema, type Document } from "mongoose";

export interface IAnalyticsEvent extends Document {
  event: string;
  pagePath: string;
  timestamp: Date;
  sessionId: string;
  visitorId: string;
  referrer: string;
  userAgent: string;
  deviceType: string;
  metadata: Record<string, unknown>;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    event: { type: String, required: true, index: true },
    pagePath: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    sessionId: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    deviceType: { type: String, default: "desktop" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: false }
);

AnalyticsEventSchema.index({ event: 1, timestamp: -1 });
AnalyticsEventSchema.index({ pagePath: 1, timestamp: -1 });
AnalyticsEventSchema.index({ timestamp: -1 });

export const AnalyticsEventModel =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
