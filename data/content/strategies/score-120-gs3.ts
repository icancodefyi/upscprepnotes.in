import type { ContentPage } from "../index";

/** Numbers in {{braces}} are filled from the live marks database at render time. */
const page: ContentPage = {
  slug: "how-to-score-120-plus-in-gs3",
  paper: "gs3",
  title: "GS3 Marks of UPSC Toppers: Highest Score, Median and What Is Realistic",
  description:
    "The highest GS3 score among {{n}} UPSC topper marksheets is {{best}}. Median {{median}}, top 10% from {{top10}}. Real scores by rank, the top scorers, and an economy, environment and security strategy.",
  lastUpdated: "2026-11-01",
  h1: "How to score high in UPSC GS Paper 3",
  intro:
    "GS Paper 3 is the toughest-marked GS paper. In UPSC's published marks, **{{atLeast:120}}** of {{n}} toppers reached 120: the highest score is **{{best}}**, by {{bestName}}. The median topper scored **{{median}}**, and **{{top10}}** was enough for the top 10%. Aim for 100, not 120.",
  sections: [
    {
      heading: "What score is realistic in GS3",
      body: `GS Paper 3 carries 250 marks and covers the Indian economy, agriculture, science and technology, environment, disaster management and internal security.

Across {{n}} complete topper marksheets from CSE {{years}}:

- **{{median}}** is the median topper's score.
- **{{top25}}+** puts you in the top quarter.
- **{{top10}}+** puts you in the top 10%.
- **{{atLeast:100}}** toppers scored 100 or more.

GS3 is marked lower than the other GS papers for nearly everyone, so a score in the 90s is good and 100+ is excellent.`,
    },
    {
      heading: "Where GS3 marks come from",
      body: `GS3 has 20 questions: ten 10-mark (about 150 words) and ten 15-mark (about 250 words). It draws from:

- **Economy**: growth and planning, inclusive growth, government budgeting, infrastructure and investment models.
- **Agriculture**: cropping patterns, irrigation, subsidies and MSP, food processing and land reforms.
- **Science and technology**: developments in IT, space, biotechnology and intellectual property.
- **Environment**: conservation, pollution, environmental impact assessment and disasters.
- **Internal security**: extremism, cyber security, money laundering, border management and security forces.

The marks each area carries change year to year. Sort the last ten years of [GS3 questions](/pyq) by area before you plan.`,
    },
    {
      heading: "Standard references",
      body: `1. NCERT *Indian Economic Development* (Class 11) and a standard Indian economy text (Ramesh Singh or Sanjiv Verma)
2. The latest *Economic Survey* and *Union Budget* summaries
3. Shankar IAS *Environment*
4. PIB and PRS summaries for security, science and technology, and new policies`,
    },
    {
      heading: "Answer writing for GS3",
      body: `1. **Use data.** A figure from the Economic Survey or Budget (fiscal deficit, MSP, emissions) is worth more than an opinion.
2. **Name the scheme or law.** Write PM-KISAN or PMFBY, not "government schemes".
3. **Draw where it helps.** A flow chart or a small table works well in economy and disaster-management answers.
4. **Make security answers recent.** Refer to a specific recent incident or policy, not a textbook definition.
5. **Keep to the word limit**: about 150 and 250 words. GS3 is long, so pace yourself to finish.`,
    },
    {
      heading: "A simple eight-month plan",
      body: `This is a suggested structure, not a topper's timetable.

- **Months 1–2:** NCERT economics and the economy text. Start a running economy and agriculture file.
- **Months 3–4:** Environment; start tracking PIB for security and S&T.
- **Months 5–6:** Two GS3 answers a day, rotating across all five areas.
- **Month 7:** Three full GS3 papers in three hours each.
- **Month 8:** Revise the Survey, Budget and last six months of current affairs.`,
    },
  ],
  faq: [
    {
      q: "Is 120 realistic in UPSC GS Paper 3?",
      a: "Very rarely. {{atLeast:120}} of {{n}} toppers scored 120 or more; the highest score is {{best}}. 100+ is an excellent GS3 score.",
    },
    {
      q: "What is the highest GS3 score among UPSC toppers?",
      a: "{{best}} out of 250, by {{bestName}}, among {{n}} complete topper marksheets from CSE {{years}}.",
    },
    {
      q: "Does an Economics optional help in GS3?",
      a: "It helps with the economy part, but the high GS3 scorers in the table above come from many optionals. Current affairs and answer practice matter more.",
    },
  ],
  relatedPages: [
    { title: "GS Paper 4 marks and strategy", href: "/content/how-to-score-100-plus-in-gs4", description: "Ethics, with live topper scores." },
    { title: "GS Paper 2 marks and strategy", href: "/content/how-to-score-120-plus-in-gs2", description: "Polity, governance and IR." },
    { title: "UPSC marks database", href: "/toppers/marks-database?sort=gs3.desc", description: "Every topper's GS3 score, sortable." },
    { title: "Previous year papers", href: "/pyq", description: "Official UPSC question papers, free to download." },
  ],
  sources: [
    { label: "UPSC: marks of recommended candidates (Examinations → Results)", url: "https://upsc.gov.in" },
    { label: "How we collect and check marks", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
