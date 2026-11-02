import { layout, p, ul, button, link } from "@/lib/email-layout";

export interface RecoveryContext {
  email: string;
  slug: string;
  titles: string[];
  total: number;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const what = (c: RecoveryContext) => (c.titles.length === 1 ? c.titles[0] : c.titles.join(" and "));

/** Stage 1: roughly an hour after checkout was opened. Short and practical. */
export function recoveryEmail1(c: RecoveryContext) {
  return {
    subject: `Your ${c.titles[0]} is waiting`,
    html: layout({
      email: c.email,
      preheader: "Nothing was charged. Pick up where you left off.",
      body:
        p("Hi,") +
        p(`You opened checkout for <strong>${what(c)}</strong> (${inr(c.total)}) but did not finish. Nothing was charged.`) +
        p("If you still want it, the link below takes you back. The file reaches your email right after payment.") +
        button(link(`/store/${c.slug}`, "recovery-1"), "Go back to checkout") +
        p("If something went wrong during payment, such as a UPI failure or a page that would not load, just reply to this email and we will sort it out.") +
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
        p("If it is not for you, ignore this email. You will not get more reminders about this order."),
    }),
  };
}
