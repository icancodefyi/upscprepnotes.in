import type { ContentPage } from "../index";

/** Numbers in {{braces}} are filled from the live marks database at render time. */
const page: ContentPage = {
  slug: "how-to-score-120-plus-in-gs2",
  paper: "gs2",
  title: "How to Score 120+ in UPSC GS Paper 2: Topper Marks and Strategy",
  description:
    "{{atLeast:120}} of {{n}} UPSC toppers ({{share:120}}) scored 120+ in GS2. Median {{median}}, highest {{best}}. Real scores, the toppers who scored most, and a polity, governance and IR strategy.",
  lastUpdated: "2026-11-01",
  h1: "How to score 120+ in UPSC GS Paper 2",
  intro:
    "120 in GS Paper 2 is a real, reachable target: **{{atLeast:120}} of {{n}}** toppers in UPSC's published marks got there ({{share:120}}). The median topper scored **{{median}}**, and the highest score is **{{best}}**, by {{bestName}}.",
  sections: [
    {
      heading: "What score you need in GS2",
      body: `GS Paper 2 carries 250 marks and covers the Constitution and polity, governance, social justice, and international relations.

Across {{n}} complete topper marksheets from CSE {{years}}:

- **{{median}}** is the median topper's score.
- **{{top25}}+** puts you in the top quarter.
- **{{top10}}+** puts you in the top 10%.
- **{{atLeast:130}}** toppers scored 130 or more.

GS2 is one of the more generous GS papers, so 120 is ambitious but common among high rankers.`,
    },
    {
      heading: "Where GS2 marks come from",
      body: `GS2 has 20 questions: ten 10-mark (about 150 words) and ten 15-mark (about 250 words). It draws from:

- **Polity**: the Constitution, its features and amendments, separation of powers, federalism, Parliament and state legislatures, the judiciary, and constitutional and statutory bodies.
- **Governance**: transparency and accountability, e-governance, civil services, pressure groups, self-help groups and NGOs.
- **Social justice**: welfare schemes for vulnerable sections, health, education and human resources, poverty and hunger.
- **International relations**: India and its neighbours, bilateral and global groupings, and international institutions.

How many marks each area carries changes year to year. Sort the last ten years of [GS2 questions](/pyq) by area before you plan.`,
    },
    {
      heading: "Does the optional matter for GS2?",
      body: `PSIR and Public Administration overlap with GS2, and the overlap does help with content. It is not required for a high score, though: open the table above and you will see high GS2 scorers with many different optionals. GS2 marks follow polity, governance and IR preparation more than the optional.

You can check this yourself in the [marks database](/toppers/marks-database?sort=gs2.desc), sorted by GS2.`,
    },
    {
      heading: "Answer writing for GS2",
      body: `1. **Anchor polity answers in the Constitution.** Cite the Article, schedule or landmark judgment where it applies.
2. **Give governance answers a source.** Name the committee, report (for example the 2nd ARC) or scheme instead of writing "the government has taken steps".
3. **Date your IR examples.** Link India's relations to recent events rather than textbook positions.
4. **Close with a way forward.** One or two concrete suggestions, not a generic "a holistic approach is needed".
5. **Keep to the word limit**: about 150 and 250 words. Finish the paper.`,
    },
    {
      heading: "A simple eight-month plan",
      body: `This is a suggested structure, not a topper's timetable.

- **Months 1–2:** Laxmikanth's *Indian Polity*, cover to cover, with a notebook of Articles and schedules.
- **Months 3–4:** 2nd ARC report summaries for governance; start a running IR file.
- **Months 5–6:** Two GS2 answers a day.
- **Month 7:** Three full GS2 papers in three hours each.
- **Month 8:** Revise static polity and the last six months of IR.`,
    },
  ],
  faq: [
    {
      q: "Is 120 a good score in UPSC GS Paper 2?",
      a: "Yes. {{atLeast:120}} of {{n}} toppers ({{share:120}}) scored 120 or more in GS2. The median topper scored {{median}}.",
    },
    {
      q: "What is the highest GS2 score among UPSC toppers?",
      a: "{{best}} out of 250, by {{bestName}}, among {{n}} complete topper marksheets from CSE {{years}}.",
    },
    {
      q: "Does PSIR optional help in GS2?",
      a: "It helps with content because the syllabi overlap, but high GS2 scorers come from many optionals. Preparation for polity, governance and IR matters more than the optional.",
    },
  ],
  relatedPages: [
    { title: "GS Paper 1 marks and strategy", href: "/content/how-to-score-130-plus-in-gs1", description: "What toppers really score in GS1." },
    { title: "PSIR optional marks and strategy", href: "/content/how-to-score-300-plus-in-psir-optional", description: "The optional that overlaps most with GS2." },
    { title: "UPSC marks database", href: "/toppers/marks-database?sort=gs2.desc", description: "Every topper's GS2 score, sortable." },
    { title: "Previous year papers", href: "/pyq", description: "Official UPSC question papers, free to download." },
  ],
  sources: [
    { label: "UPSC: marks of recommended candidates (Examinations → Results)", url: "https://upsc.gov.in" },
    { label: "How we collect and check marks", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
