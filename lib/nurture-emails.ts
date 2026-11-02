import { PRODUCTS } from "@/lib/store-products";
import { layout, p, ul, button, link } from "@/lib/email-layout";

export interface NurtureContext {
  email: string;
  /** Only set when the person came from a topper page (not a guide or lead form). */
  topperName?: string;
  topperSlug?: string;
}

export interface NurtureEmail {
  subject: string;
  /** Days to wait after the previous email (email 1 waits after the signup). */
  delayDays: number;
  build: (c: NurtureContext) => string;
}

const compilation = PRODUCTS.find((x) => x.slug === "answer-copies-compilation")!;
const gsBundle = PRODUCTS.find((x) => x.slug === "complete-gs-notes-bundle")!;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Days between signup and the first nurture email. */
export const FIRST_EMAIL_DELAY_DAYS = 1;

export const NURTURE_EMAILS: NurtureEmail[] = [
  {
    subject: "How to read a topper's answer copy (3 things to look at)",
    delayDays: 1,
    build: (c) => {
      const who = c.topperName && c.topperSlug ? `${c.topperName}'s copy` : "a topper's copy";
      const back = c.topperSlug ? link(`/upsc-topper/${c.topperSlug}`, "nurture-1") : link("/toppers", "nurture-1");
      return layout({
        email: c.email,
        preheader: "Reading a copy for marks, not for content.",
        body:
          p("Hi,") +
          p(`Most people open ${who} and read the facts. The facts are not what you are there for. Read it for these three things instead:`) +
          ul([
            "<strong>The first two lines.</strong> How does the answer start? Usually a definition, a number or a one-line stance, never a long warm-up.",
            "<strong>The shape of the body.</strong> Count the headings and points. Most strong answers have a small, fixed number of points, each on its own line or short paragraph.",
            "<strong>Where the diagram sits.</strong> Note which questions got a diagram or flowchart and which did not, and how small it is.",
          ]) +
          p("Then close the copy and write the same question yourself in the same time. Put the two side by side and fix one thing. Doing that once a week beats reading ten copies.") +
          button(back, c.topperSlug ? "Back to the topper page" : "Browse topper pages"),
      });
    },
  },
  {
    subject: "Free things on the site you may have missed",
    delayDays: 2,
    build: (c) =>
      layout({
        email: c.email,
        preheader: "PYQs, current affairs and the marks database, no payment needed.",
        body:
          p("Hi,") +
          p("Before anything else, here is what is free on upscprepnotes.in:") +
          ul([
            `<a href="${link("/pyq", "nurture-2")}">Previous year questions</a> sorted by paper and topic`,
            `<a href="${link("/current-affairs", "nurture-2")}">Current affairs</a> you can read in a few minutes a day`,
            `<a href="${link("/toppers/marks-database", "nurture-2")}">The toppers marks database</a>, with paper-wise marks for past toppers`,
            `<a href="${link("/free-materials", "nurture-2")}">Free materials</a>`,
          ]) +
          p("Everything here opens without payment. If you are short on time, start with the marks database and see what the paper-wise totals look like for ranks you are aiming at.") +
          button(link("/toppers/marks-database", "nurture-2"), "Open the marks database"),
      }),
  },
  {
    subject: `63 topper answer booklets for ${inr(compilation.price)}, if you want to compare`,
    delayDays: 2,
    build: (c) =>
      layout({
        email: c.email,
        preheader: "One-time payment, instant delivery, 7-day refund.",
        body:
          p("Hi,") +
          p("The free copy shows you one topper on one paper. If you want to compare how different scorers handle the same papers, the compilation has more.") +
          ul([
            "63 scanned answer booklets from 27 toppers",
            "General Studies 1 to 4 and Essay",
            "Each copy labelled with the topper's name, rank, year and marks",
            "Split into separate files, so you can download one at a time on a phone",
          ]) +
          p(`<strong>${inr(compilation.price)}, one time.</strong> It reaches your email right after payment. If it is not useful, write to us within 7 days and we refund you. No subscription, nothing renews.`) +
          p("It does not include Optional papers, so check that before you buy.") +
          button(link(`/store/${compilation.slug}`, "nurture-3"), `See the compilation, ${inr(compilation.price)}`),
      }),
  },
  {
    subject: "A simple weekly loop for answer writing",
    delayDays: 3,
    build: (c) =>
      layout({
        email: c.email,
        preheader: "Write, compare, fix one thing.",
        body:
          p("Hi,") +
          p("People ask us how to improve answer writing without a test series. This is the loop that needs only a topper's copy and a timer:") +
          ul([
            "<strong>Monday:</strong> pick one question from a PYQ or a topper's copy. Write it in the time the exam allows.",
            "<strong>Tuesday:</strong> open the topper's answer to the same question. Compare structure, not content.",
            "<strong>Wednesday:</strong> rewrite your answer using one thing you noticed. Only one.",
            "<strong>Weekend:</strong> repeat with a new question and tick off the fix you made last week.",
          ]) +
          p(`If you want notes to go with it, the <a href="${link(`/store/${gsBundle.slug}`, "nurture-4")}">Complete GS Notes Bundle</a> has ${gsBundle.fileCount} files and costs ${inr(gsBundle.price)}. If not, the loop works with free material too.`) +
          button(link("/pyq", "nurture-4"), "Pick a PYQ to start with"),
      }),
  },
  {
    subject: "What is stopping your answers from improving?",
    delayDays: 4,
    build: (c) =>
      layout({
        email: c.email,
        preheader: "Reply with one line. A person reads every reply.",
        body:
          p("Hi,") +
          p("This is the last email in this series, and it is a question rather than an offer.") +
          p("<strong>What is the one thing that stops your answer writing from getting better?</strong> Is it feedback, time, the optional, a language issue, or something else?") +
          p("Reply to this email with a line or two. A person reads every reply, and what you tell us decides what we build next, including what we make free.") +
          p("If a payment or download ever failed on our site, tell us that too and we will sort it.") +
          p("Thank you,<br>The UPSCPrepNotes team"),
      }),
  },
];
