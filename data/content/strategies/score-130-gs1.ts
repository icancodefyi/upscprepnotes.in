import type { ContentPage } from "../index";

/** Numbers in {{braces}} are filled from the live marks database at render time. */
const page: ContentPage = {
  slug: "how-to-score-130-plus-in-gs1",
  paper: "gs1",
  title: "GS1 Marks of UPSC Toppers: Highest Score, Median and What Is Realistic",
  description:
    "The highest GS1 score among {{n}} UPSC topper marksheets is {{best}}. Median {{median}}, top 10% from {{top10}}. Real scores by rank, the toppers who scored most, and a GS1 strategy.",
  lastUpdated: "2026-11-01",
  h1: "How to score high in UPSC GS Paper 1",
  intro:
    "Many guides promise 130+ in GS Paper 1. In UPSC's own published marks, no topper in our {{n}} complete marksheets reached that: the highest is **{{best}}**, by {{bestName}}. The median topper scored **{{median}}**, and **{{top10}}** was enough for the top 10%. This guide shows the real numbers and what the high scorers had in common.",
  sections: [
    {
      heading: "What score is realistic in GS1",
      body: `GS Paper 1 carries 250 marks and covers Indian heritage and culture, history (modern, post-independence and world), geography, and Indian society.

Across {{n}} complete topper marksheets from CSE {{years}}:

- **{{median}}** is the median topper's score.
- **{{top25}}+** puts you in the top quarter of toppers.
- **{{top10}}+** puts you in the top 10%.
- **{{atLeast:120}}** toppers scored 120 or more. **{{atLeast:130}}** scored 130 or more.

GS1 is marked tightly for everyone, so a score in the low 100s is already strong. Treat **110+** as an ambitious, realistic target rather than 130+.`,
    },
    {
      heading: "Where GS1 marks come from",
      body: `UPSC sets 20 questions in GS1: ten 10-mark questions (about 150 words) and ten 15-mark questions (about 250 words). The paper draws from four areas:

- **History**: modern India and the freedom struggle, post-independence consolidation, and world history from the 18th century.
- **Art and culture**: architecture, literature and art forms from ancient to modern times.
- **Geography**: physical geography, resources, and the distribution of industries, along with geophysical phenomena.
- **Indian society**: diversity, women, population, urbanisation, globalisation, communalism, regionalism and secularism.

The split between these areas changes every year. Solve the last ten years of GS1 questions topic by topic to see the pattern for yourself before deciding where to spend time; [previous year papers are free here](/pyq).`,
    },
    {
      heading: "Standard references",
      body: `These are the books most commonly recommended for GS1. None of them is a shortcut; the marks come from answer writing.

1. NCERT History (Class 11–12) and *India's Struggle for Independence* (Bipan Chandra) for modern history
2. NCERT *Themes in World History* and a standard world-history text
3. NCERT *Indian Society* and *Social Change and Development in India* (Class 12)
4. NCERT Geography (Class 11–12) and G.C. Leong, *Certificate Physical and Human Geography*
5. Nitin Singhania, *Indian Art and Culture*`,
    },
    {
      heading: "Answer writing for GS1",
      body: `1. **Answer the directive.** "Critically examine", "discuss" and "comment" ask for different things. Address the word in the first two lines.
2. **Keep to the word limit.** About 150 words for 10-mark questions and 250 for 15-mark ones. Finishing all 20 questions matters more than polishing a few.
3. **Use structure.** A short introduction, the body in clear points or short paragraphs, and a one-line conclusion.
4. **Add specifics.** A date, a name, a place, a census figure or a small map sketch makes a history, geography or society answer stand out from a generic one.
5. **Read real copies.** Compare your answers with [topper answer copies](/toppers) next to the marks that paper earned.`,
    },
    {
      heading: "A simple eight-month plan",
      body: `This is a suggested structure, not a topper's timetable.

- **Months 1–2:** NCERTs and the modern history text. Short topic notes.
- **Months 3–4:** World history, art and culture, society. Start two answers a day.
- **Months 5–6:** Five answers a day across all four areas; mark them against topper copies.
- **Month 7:** Three full GS1 papers in three hours each.
- **Month 8:** Revise your notes and the last ten years of questions.`,
    },
  ],
  faq: [
    {
      q: "What is the highest GS1 score among UPSC toppers?",
      a: "Among {{n}} complete topper marksheets from CSE {{years}}, the highest GS1 score is {{best}}, by {{bestName}}. {{atLeast:130}} toppers scored 130 or more.",
    },
    {
      q: "What is a good score in GS Paper 1?",
      a: "The median topper scored {{median}} out of 250. {{top10}} or more puts you in the top 10% of toppers, so 110+ is a strong score in GS1.",
    },
    {
      q: "Is there a map question in UPSC Mains GS1?",
      a: "No. UPSC Mains GS1 has 20 written questions of 10 and 15 marks. Map sketches are optional additions inside answers, not a separate question.",
    },
    {
      q: "Can I prepare GS1 without coaching?",
      a: "Our data doesn't record who took coaching, so we can't say from the numbers. The standard references above are self-study books, and answer writing practice is what moves the score.",
    },
  ],
  relatedPages: [
    { title: "GS Paper 2 marks and strategy", href: "/content/how-to-score-120-plus-in-gs2", description: "Polity, governance and IR, with live topper scores." },
    { title: "UPSC marks database", href: "/toppers/marks-database?sort=gs1.desc", description: "Every topper's GS1 score, sortable." },
    { title: "Topper answer copies", href: "/content/upsc-topper-answer-copies", description: "See how high-scoring answers were written." },
    { title: "Previous year papers", href: "/pyq", description: "Official UPSC question papers, free to download." },
  ],
  sources: [
    { label: "UPSC: marks of recommended candidates (Examinations → Results)", url: "https://upsc.gov.in" },
    { label: "How we collect and check marks", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
