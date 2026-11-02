import mongoose, { Schema } from "mongoose";

/**
 * One user interaction, in its own `tracking` collection (separate from `analyticsevents`).
 * Written by /api/track (browser) and lib/tracking/server.ts (checkout, payment webhook).
 * See docs/tracking.md for the event list.
 */
export interface ITrackingEvent {
  event: string;
  source: "client" | "server";
  ts: Date;
  clientTs?: Date;
  visitorId?: string;
  sessionId?: string;
  email?: string;
  path?: string;
  referrer?: string;
  utm?: Record<string, string>;
  firstTouch?: Record<string, string>;
  props?: Record<string, unknown>;
  device?: { type?: string; w?: number; h?: number; ua?: string };
  lang?: string;
  tz?: string;
  country?: string;
  region?: string;
  city?: string;
  ipHash?: string;
}

const TrackingEventSchema = new Schema<ITrackingEvent>(
  {
    event: { type: String, required: true },
    source: { type: String, default: "client" },
    ts: { type: Date, default: Date.now },
    clientTs: Date,
    visitorId: String,
    sessionId: String,
    email: String,
    path: String,
    referrer: String,
    utm: Schema.Types.Mixed,
    firstTouch: Schema.Types.Mixed,
    props: Schema.Types.Mixed,
    device: Schema.Types.Mixed,
    lang: String,
    tz: String,
    country: String,
    region: String,
    city: String,
    ipHash: String,
  },
  { collection: "tracking", versionKey: false },
);

TrackingEventSchema.index({ event: 1, ts: -1 });
TrackingEventSchema.index({ visitorId: 1, ts: -1 });
TrackingEventSchema.index({ sessionId: 1, ts: 1 });
TrackingEventSchema.index({ path: 1, ts: -1 });
TrackingEventSchema.index({ email: 1 }, { sparse: true });
// Keep about 13 months of behaviour; older events expire on their own.
TrackingEventSchema.index({ ts: 1 }, { expireAfterSeconds: 400 * 24 * 60 * 60 });

export const TrackingEventModel =
  (mongoose.models.TrackingEvent as mongoose.Model<ITrackingEvent>) ||
  mongoose.model<ITrackingEvent>("TrackingEvent", TrackingEventSchema);
