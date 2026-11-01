import type { ContentPage } from "../index";

/** Numbers in {{braces}} are filled from the live marks database at render time. */
const page: ContentPage = {
  slug: "how-to-score-100-plus-in-gs4",
  paper: "gs4",
  title: "GS4 Ethics Marks of UPSC Toppers: Why 100 Is the Floor and 120+ the Target",
  description:
    "{{share:100}} of UPSC toppers scored 100+ in GS4 Ethics. Median {{median}}, top 10% from {{top10}}, highest {{best}}. Real scores, the top scorers, and a case-study framework.",
  lastUpdated: "2026-11-01",
  h1: "How to score 120+ in UPSC GS Paper 4 (Ethics)",
  intro:
    "100 in Ethics is where toppers start, not where they finish: **{{atLeast:100}} of {{n}}** scored 100 or more ({{share:100}}). The median topper scored **{{median}}**, the top 10% started at **{{top10}}**, and the highest score is **{{best}}**, by {{bestName}}. So the real target is 120+.",
  sections: [
    {
      heading: "What score you need in GS4",
      body: `GS Paper 4 (Ethics, Integrity and Aptitude) carries 250 marks.

Across {{n}} complete topper marksheets from CSE {{years}}:

- **{{median}}** is the median topper's score.
- **{{atLeast:120}}** toppers ({{share:120}}) scored 120 or more.
- **{{top10}}+** puts you in the top 10%.

GS4 is the most generous GS paper, which also means it is where weak preparation shows least, and strong preparation can still add 20–30 marks over the median.`,
    },
    {
      heading: "How the paper is built",
      body: `GS4 has two sections:

- **Section A: theory.** Ethics and human interface, attitude, aptitude and foundational values, emotional intelligence, moral thinkers, public service values, probity in governance.
- **Section B: case studies.** Scenario-based questions, usually six cases of 20 marks each.

Case studies carry roughly half the paper, and they are where most candidates run short of time. Practise them as much as theory.`,
    },
    {
      heading: "A case-study framework",
      body: `1. **Stakeholders.** List everyone affected, in two or three lines.
2. **The conflict.** Name the competing values directly: integrity vs loyalty, efficiency vs compassion.
3. **Options.** Two or three possible courses of action, each with its main consequence.
4. **Decision.** Choose one and justify it with a principle (constitutional values, a thinker, the civil service code).
5. **Way forward.** One line on what would prevent the situation next time.`,
    },
    {
      heading: "Standard references",
      body: `1. *Lexicon for Ethics, Integrity and Aptitude* for concepts and terms
2. 2nd ARC report, *Ethics in Governance*
3. Short notes on the main moral thinkers (Indian and Western) and one example for each
4. A set of 20–25 practice case studies across administrative, workplace and personal dilemmas`,
    },
    {
      heading: "Answer writing for GS4",
      body: `1. **Use the syllabus words.** Write "probity", "moral courage" or "emotional intelligence" where they apply.
2. **Define, then apply.** A one-line definition followed by a real example reads better than a paragraph of theory.
3. **Show both sides.** Acknowledge the counter-view in a line before you decide.
4. **One example per answer.** A well-known administrator or reform; more dilutes the answer.
5. **Protect time for Section B.** Keep Section A answers to the word limit so the cases get the time they need.`,
    },
  ],
  faq: [
    {
      q: "Is 100 a good score in UPSC GS Paper 4?",
      a: "It's the baseline among toppers: {{atLeast:100}} of {{n}} ({{share:100}}) scored 100 or more. 120+ is the competitive target; {{share:120}} of toppers reached it.",
    },
    {
      q: "What is the highest GS4 score among UPSC toppers?",
      a: "{{best}} out of 250, by {{bestName}}, among {{n}} complete topper marksheets from CSE {{years}}.",
    },
    {
      q: "How should I split time between theory and case studies?",
      a: "About evenly. Case studies carry roughly half the marks and need the most time in the exam hall.",
    },
  ],
  relatedPages: [
    { title: "UPSC marks database", href: "/toppers/marks-database?sort=gs4.desc", description: "Every topper's GS4 score, sortable." },
    { title: "GS Paper 3 marks and strategy", href: "/content/how-to-score-120-plus-in-gs3", description: "The toughest-marked GS paper." },
    { title: "Topper answer copies", href: "/content/upsc-topper-answer-copies", description: "See how high-scoring ethics answers were written." },
    { title: "Free ethics notes", href: "/free-materials?category=notes", description: "Free GS4 notes and case-study sets." },
  ],
  sources: [
    { label: "UPSC: marks of recommended candidates (Examinations → Results)", url: "https://upsc.gov.in" },
    { label: "How we collect and check marks", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
