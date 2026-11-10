import Razorpay from "razorpay";

/** Server-side Razorpay client. KEY_SECRET is read here only and never reaches the browser. */
export function getRazorpay(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error("RAZORPAY_NOT_CONFIGURED");
  return new Razorpay({ key_id, key_secret });
}
