import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = "hello@upscprepnotes.in";

const S = {
  name: "Zaid",
  site: "UPSCPrepNotes",
  url: "upscprepnotes.in",
  visitors: "1,400+",
  months: "just about a month old",
  advertise: "upscprepnotes.in/advertise",
};

const TEMPLATES: Record<string, { subject: string; html: (name: string, org: string) => string }> = {

  /* ───── GS SCORE ─────
   * Mid-sized Delhi institute (Karol Bagh). Known for test series + answer writing.
   * 350+ selections in 2023. Operates as iasscore.in
   * Key person: Piyush Kumar Sir (History optional). Known faculty.
   * They have "Samarth Answer Writing" program, GS Mains Q&A, Integrated Test Series.
   * Offer up to 70% scholarship via their own test.
   * Our audience of answer-writing aspirants maps perfectly to their test series.
   */
  gs_score: {
    subject: `GS SCORE x ${S.site} - quick thought`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I just started <strong>${S.site}</strong> (${S.url}) about a month back. It's a free UPSC study platform with notes, current affairs compilations, answer-writing resources. Completely bootstrapped, no ads, just trying to build something useful for aspirants.</p>
      <p>Honestly didn't expect it to pick up this fast, but we're already at <strong>${S.visitors} organic visitors a month</strong>, all from Google search. People are finding us when they search for topics like "mains answer writing" or "current affairs compilation" and they stick around.</p>
      <p>I've been following <strong>${org}</strong> for a while. Your GS Mains Q&A program and the Samarth Answer Writing course caught my eye specifically. The kind of students landing on our site are exactly the ones who would benefit from structured test series and answer evaluation. They are already in the practice mindset.</p>
      <p>We have a few banner slots open at pretty modest rates (₹3K to ₹5K/month, no contracts). Happy to set up a short test placement so you can see if the traffic is relevant for you.</p>
      <p>Worth a shot?</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── SLEEPY CLASSES ─────
   * Founded 2017 by Shekhar Dutt. ~37 people. Chandigarh + Mukherjee Nagar.
   * Philosophy: affordable UPSC prep for all.
   * Known for Sociology optional (Srushti Deshmukh AIR 5 scored 312 in Socio).
   * GS Mentorship course ₹36K, Socio ₹26K. Also do PSIR, Essay, CSAT.
   * Strong YouTube presence with free content.
   * Small team = quick decisions. Aligned philosophy (affordable + free content).
   */
  sleepy: {
    subject: `${S.site} x Sleepy Classes - random thought`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I started <strong>${S.site}</strong> (${S.url}) barely a month ago. It's a free UPSC prep site I built on the side. No funding, no team, just me putting out notes and current affairs compilations.</p>
      <p>It's growing faster than I expected. <strong>${S.visitors} organic visits/month</strong> already, all from search. Which tells me there's genuine hunger for good free content in this space.</p>
      <p>I've been a quiet follower of Sleepy Classes since the Srushti Deshmukh days. That 312 in Sociology with your test series was seriously impressive. Your whole ethos <em>"Making Top Rank Affordable to All"</em> is something I genuinely respect because I'm trying to do the same with free study content.</p>
      <p>I have no idea if you guys do banner advertising, but I have a slot open and thought I'd ask. <strong>₹3K/month, no contract</strong>. Happy to set up a short test placement so you can see if our audience converts for you. Or if banners are not your thing, I'm happy to just cross-promote your free YouTube content to our audience. Whatever works.</p>
      <p>No pressure at all. Just putting it out there.</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── VAJIRAO & REDDY ─────
   * Legacy institute est. 1988. Shakti Nagar, Delhi. Also Agra, Jaipur.
   * 645+ selections 2023, 560+ 2024. One of the biggest brands.
   * Complete Course: ₹1.98L (English), ₹1.48L (Hindi).
   * Recently pushing online courses hard — dedicated portal, live classes.
   * Big brand = longer sales cycle. But they have marketing budget.
   * Pitch: raw, honest, new platform finding its feet.
   */
  vajirao: {
    subject: `Question about advertising on ${S.site}`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I run a small UPSC study site called <strong>${S.site}</strong> (${S.url}). It's literally a month old, just me building it in my free time. No investors, no team, just putting out free notes and seeing what sticks.</p>
      <p>It's been getting traction way faster than I expected. <strong>${S.visitors} monthly organic visitors</strong> already. All from aspirants searching for study topics on Google.</p>
      <p><strong>${org}</strong> is obviously a giant in the Delhi coaching scene. I saw you've been expanding your online offerings, the live UPSC courses, the online portal. I won't pretend we are big enough to move the needle for you, but our audience is 100% UPSC aspirants actively looking for courses and coaching recommendations.</p>
      <p>We have banner placements at ₹3K to ₹5K/month. No contracts. Happy to set up a short test placement so you can check if the traffic quality is worth it.</p>
      <p>Worth a conversation?</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── TESTBOOK ─────
   * Massive platform: 1.8Cr+ students, 670+ exams.
   * Gurgaon-based. Formal org structure.
   * UPSC is a small slice. Test series starting ₹599.
   * They have publisher/affiliate programs — ask about those.
   * Pitch: short, professional, ask about their existing programs.
   */
  testbook: {
    subject: `${S.site} x Testbook - partnership?`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I started <strong>${S.site}</strong> (${S.url}) about a month ago. It's a free UPSC study platform. Grew to <strong>${S.visitors} monthly organic visitors</strong> already, all from search.</p>
      <p>I know <strong>${org}</strong> covers 670+ exams, but your UPSC Prelims Test Series (especially at that ₹599 price point) is exactly the kind of thing our audience would find useful. Budget-conscious students who land on our free content and are looking for affordable test practice.</p>
      <p>Do you have a publisher or affiliate program for website partnerships? Or if you do banner advertising, we have slots starting at ₹3K/month.</p>
      <p>Happy to chat if there is a fit.</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── LEVELUP IAS ─────
   * Young ed-tech, digital-first. Founder Santosh Kumar.
   * Karol Bagh. GS Foundation, Optional programs, Mentorship.
   * Known for Anthropology optional (Karandeep Sir).
   * Small/medium team = fast decisions. Digital-native.
   */
  levelup: {
    subject: `LevelUp IAS x ${S.site} - quick thought`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I started <strong>${S.site}</strong> (${S.url}) about a month ago. Free UPSC study platform — notes, current affairs, answer-writing resources. Bootstrapped, just building something useful.</p>
      <p>Already at <strong>${S.visitors} monthly organic visitors</strong>, all from search. Serious aspirants — the kind who'd benefit from structured coaching.</p>
      <p>I've been following LevelUp IAS. I particularly like your Anthropology optional program (Karandeep Sir's track record is solid) and the fact that you're trying to make quality prep affordable. Our audience skews budget-conscious and self-studying — they're exactly the ones looking for the next step beyond free resources.</p>
      <p>We have banner slots at <strong>₹3K to ₹5K/month, no contracts</strong>. Happy to set up a short test placement so you can see if the traffic converts.</p>
      <p>Worth a shot?</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── PREPP IAS ─────
   * ~27 employees, founded 2020. Young team, interview-appeared mentors.
   * Gurgaon + Old Rajinder Nagar. Mains test series ₹3,999, Prelims ₹4,999.
   * Very affordable products. Digital-first. Fast decisions.
   * Price points perfectly match our audience.
   */
  prepp: {
    subject: `Prepp IAS x ${S.site} - quick thought`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I started <strong>${S.site}</strong> (${S.url}) about a month ago. Free study platform — notes, compilations, answer-writing resources.</p>
      <p>Already at <strong>${S.visitors} monthly organic visitors</strong>, all from search. Aspirants actively looking for study material and test practice.</p>
      <p>I looked at Prepp's test series pricing — ₹3,999 for Mains, ₹4,999 for Prelims — and that ₹349/year Prepp+ subscription is exactly the kind of affordable, high-value product our audience responds to. Your model of young, interview-appeared mentors is something aspirants trust.</p>
      <p>We do banner ads at <strong>₹3K to ₹5K/month, no contracts</strong>. Happy to do a short test placement so you can see the traffic quality.</p>
      <p>Worth a conversation?</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── TATHASTU ICS ─────
   * Founded by Dr. Tanu Jain (ex-IAS). Growing fast.
   * UPSC+MBA/BA integrated programs, Philosophy optional.
   * Medium-sized, actively hiring. Strong brand.
   */
  tathastu: {
    subject: `Tathastu ICS x ${S.site} - quick thought`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I run <strong>${S.site}</strong> (${S.url}) — a free UPSC study platform I built about a month ago. Notes, current affairs compilations, answer-writing resources. Completely bootstrapped.</p>
      <p>We're already at <strong>${S.visitors} monthly organic visitors</strong>, all from search. Self-studying aspirants actively looking for courses and mentorship.</p>
      <p>Tathastu's approach — especially the UPSC+MBA/BA integrated model and Dr. Tanu Jain's Philosophy optional program — is genuinely unique. Our audience includes early-stage aspirants who might not know about integrated degree programs as a path. That feels like a natural fit.</p>
      <p>We have banner placements at <strong>₹3K to ₹5K/month, no contracts</strong>. Happy to set up a short test placement so you can check the traffic.</p>
      <p>Worth a try?</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },

  /* ───── EDEN IAS ─────
   * Estd 2018. Small team, personal approach.
   * Geography & Sociology optional. Foundation courses (1/2/3 year).
   * Old Rajinder Nagar. Very active on social media.
   * Small = fast decisions.
   */
  eden: {
    subject: `Quick thought — ${S.site} x EDEN IAS`,
    html: (name, org) => `
      <p>Hi,</p>
      <p>I'm Zaid. I started <strong>${S.site}</strong> (${S.url}) about a month ago. Free UPSC study platform with notes, current affairs compilations, and answer-writing resources. Just me building it.</p>
      <p>It crossed <strong>${S.visitors} monthly organic visitors</strong> already, all from search. Serious aspirants who are self-studying and looking for structured programs.</p>
      <p>EDEN IAS has a solid reputation for Geography and Sociology optional, and your 3-year Lakshya foundation program makes sense for early starters. Your team seems hands-on with students — that personal approach is valuable.</p>
      <p>We have banner slots at <strong>₹3K to ₹5K/month, no contracts</strong>. Happy to set up a short test placement so you can check the traffic for yourself.</p>
      <p>Worth a conversation?</p>
      <p>Best,<br>Zaid<br>${S.site}</p>
    `,
  },
};

export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(req, "outreach");
  if (rl) return rl;

  try {
    const { prospect, email, name, org } = await req.json();
    const template = TEMPLATES[prospect as string];
    if (!template) {
      return NextResponse.json({ error: "Invalid prospect" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: `Zaid from ${S.site} <${FROM}>`,
      to: email,
      subject: template.subject,
      html: template.html(name, org),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Outreach send error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const CONTACTS = [
  {
    key: "gs_score",
    name: "GS SCORE Team",
    email: "info@iasscore.in",
    org: "GS SCORE",
    notes: "Test series + answer writing focused. Mention Samarth + GS Mains Q&A.",
  },
  {
    key: "sleepy",
    name: "Sleepy Classes Team",
    email: "sleepy.classes@gmail.com",
    org: "Sleepy Classes",
    notes: "Small team, fast decisions. Mention Srushti Deshmukh + affordable philosophy.",
  },
  {
    key: "vajirao",
    name: "Marketing Team",
    email: "info@vajiraoinstitute.com",
    org: "Vajirao & Reddy Institute",
    notes: "Big legacy brand. Mention online course push. Longer cycle.",
  },
  {
    key: "testbook",
    name: "Partnerships Team",
    email: "support@testbook.com",
    org: "Testbook",
    notes: "Large org — ask about publisher/affiliate program.",
  },
  {
    key: "levelup",
    name: "LevelUp IAS Team",
    email: "info@levelupias.com",
    org: "LevelUp IAS",
    notes: "Young ed-tech, digital-first. Anthropology optional strength. Fast decisions.",
  },
  {
    key: "prepp",
    name: "Prepp IAS Team",
    email: "iasexam@prepp.in",
    org: "Prepp IAS",
    notes: "Young team, affordable test series. Interview-appeared mentors.",
  },
  {
    key: "tathastu",
    name: "Tathastu ICS Team",
    email: "enquiry@tathastuics.com",
    org: "Tathastu ICS",
    notes: "Dr. Tanu Jain. Integrated UPSC+degree programs. Philosophy optional.",
  },
  {
    key: "eden",
    name: "EDEN IAS Team",
    email: "connect.edenias@gmail.com",
    org: "EDEN IAS",
    notes: "Small team, personal approach. Geography/Sociology optional. Lakshya program.",
  },
];

export async function GET() {
  return NextResponse.json({
    prospects: Object.keys(TEMPLATES),
    contacts: CONTACTS,
  });
}
