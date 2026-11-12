import { layout, p, ul, button, link } from "@/lib/email-layout";
import { checkoutFeedbackUrl, type LeaveReason } from "@/lib/email-links";

export interface RecoveryContext {
  orderId: string;
  email: string;
  slug: string;
  titles: string[];
  total: number;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const what = (c: RecoveryContext) => (c.titles.length === 1 ? c.titles[0] : c.titles.join(" and "));

const REASONS: { r: LeaveReason; label: string }[] = [
  { r: "expensive", label: "It felt too expensive" },
  { r: "failed", label: "The payment did not work" },
  { r: "unsure", label: "I am not sure yet" },
];

/** Three one-tap answers. Each link saves the reason on the order and stops further reminders. */
function reasonButtons(orderId: string): string {
  return (
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 18px"><tr><td>' +
    REASONS.map(
      ({ r, label }) =>
        `<a href="${checkoutFeedbackUrl(orderId, r)}" style="display:block;margin:0 0 8px;padding:12px 18px;border-radius:999px;border:1.5px solid #cfd8ff;background:#f4f6ff;color:#1f3fd6;font-weight:700;font-size:15px;text-decoration:none">${label}</a>`,
    ).join("") +
    "</td></tr></table>"
  );
}

/** Stage 1: roughly an hour after checkout was opened. Short, warm, and asks what went wrong. */
export function recoveryEmail1(c: RecoveryContext) {
  return {
    subject: "Did something go wrong with your order?",
    html: layout({
      email: c.email,
      preheader: "Nothing was charged. Tell us what happened, we would love to help.",
      body:
        p("Hi,") +
        p(`You started checkout for <strong>${what(c)}</strong> (${inr(c.total)}) a little while ago and it did not go through. Nothing was charged.`) +
        p("If something went wrong, or you simply changed your mind, we would really like to know, and we would love to help you out. <strong>What made you leave?</strong> One tap is enough:") +
        reasonButtons(c.orderId) +
        p("Still want it? The link below takes you back, and the file reaches your email right after payment.") +
        button(link(`/store/${c.slug}`, "recovery-1"), "Go back to checkout") +
        p("Or just reply to this email. A real person reads every reply.") +
        p("Thank you,<br>The UPSCPrepNotes team"),
    }),
  };
}

/** Stage 2: about a day later. Answers the usual hesitations, no pressure and no fake discount. */
export function recoveryEmail2(c: RecoveryContext) {
  return {
    subject: "Before you decide: delivery, refund and what is inside",
    html: layout({
      email: c.email,
      preheader: "Instant email delivery, 7-day refund, no subscription.",
      body:
        p("Hi,") +
        p(`You looked at <strong>${what(c)}</strong> yesterday. Here is what people ask before paying:`) +
        ul([
          "<strong>When do I get it?</strong> By email right after payment, with a download page you can open on a phone.",
          "<strong>What if it is not useful?</strong> Write to us within 7 days and we refund you.",
          "<strong>Does it renew?</strong> No. It is a one-time payment. There is no subscription.",
          "<strong>Payment failed?</strong> Reply to this email and we will help, or retry with another UPI app.",
        ]) +
        button(link(`/store/${c.slug}`, "recovery-2"), "See it again") +
        p("If you have not told us yet, what stopped you? One tap:") +
        reasonButtons(c.orderId) +
        p("If it is not for you, ignore this email. You will not get more reminders about this order."),
    }),
  };
}
