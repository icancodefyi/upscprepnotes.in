import { connectDB } from "@/lib/mongodb";
import { TrackingEventModel } from "@/models/tracking.model";
import { normEmail, scrubProps } from "./scrub";

/**
 * Record a server-side event (checkout, payment) in the `tracking` collection.
 * Never throws: tracking must not break a checkout or a webhook.
 */
export async function trackServer(
  event: string,
  data: { visitorId?: string; sessionId?: string; email?: string; path?: string; props?: Record<string, unknown> } = {},
) {
  try {
    await connectDB();
    await TrackingEventModel.create({
      event,
      source: "server",
      ts: new Date(),
      visitorId: data.visitorId?.slice(0, 64),
      sessionId: data.sessionId?.slice(0, 64),
      email: normEmail(data.email),
      path: data.path,
      props: scrubProps(data.props ?? {}) as Record<string, unknown>,
    });
  } catch (err) {
    console.error("trackServer failed:", event, err);
  }
}
