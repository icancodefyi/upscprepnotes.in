import type { ContentPage } from "./index";

/** Numbers in {{braces}} are filled from the live marks database at render time. */
const page: ContentPage = {
  slug: "upsc-optional-subject-marks-analysis",
  dataset: "optionals",
  title: "UPSC Optional Subject Marks Analysis — Which Optional Scores Highest? Data from {{marksheets}} Toppers",
  description:
    "Which UPSC optional scores highest? Median optional marks for {{optCompared}} optionals from {{marksheets}} complete topper marksheets. Highest: {{optHighest}}. Plus how optional and GS marks relate.",
  lastUpdated: "2026-11-01",
  h1: "Which UPSC optional scores highest? The marks data",
  intro:
    "This page compares optional subjects using UPSC's published marks for {{marksheets}} toppers with a complete marksheet. Among optionals with at least {{optMinN}} toppers, **{{optHighest}}** has the highest median optional score and **{{optLowest}}** the lowest. Read the table as how toppers scored, not how hard each optional is for everyone.",
  sections: [
    {
      heading: "How to read this data",
      body: `The table below ranks optionals by their **median optional score** (Paper I + Paper II, out of 500) among toppers. Median, not average, so one unusually high or low score doesn't move the result.

It also shows each optional's median GS I–IV total and median final total, so you can see whether toppers of one optional did better overall or only in the optional.

Optionals with fewer than {{optMinN}} complete marksheets are left out: with three or four toppers, one person changes the median.`,
    },
    {
      heading: "Does your optional affect your GS marks?",
      body: `Barely. Across all {{marksheets}} complete marksheets, the correlation between a topper's GS I–IV total and their optional total is **{{gsOptCorr}}**, which is close to zero. A high optional score says almost nothing about that person's GS score, and the other way round.

So the worry that a "non-scoring" optional will drag your GS down isn't supported by the data. GS and the optional are prepared, and marked, largely independently.`,
    },
    {
      heading: "Which optionals toppers choose",
      body: `**{{optMostChosen}}** is the most common optional among the toppers in this data. That reflects who cleared the exam in these years, not which optional is better: popular optionals produce more toppers partly because more people take them.

Browse the toppers for any optional from its name in the table.`,
    },
    {
      heading: "What this data can't tell you",
      body: `- **Success rates.** We only have toppers. UPSC doesn't publish how many candidates took each optional or how they scored, so this can't show which optional gives anyone the best chance.
- **Difficulty for you.** An optional that suits a mathematician may be the wrong choice for a history graduate. Your background and interest matter more than a few marks of median difference.
- **Year-to-year swings.** Optional marking varies by year. The table pools CSE years together.

The best use of this table: once you've shortlisted two or three optionals you'd enjoy, check that none of them is far below the others.`,
    },
  ],
  faq: [
    {
      q: "Which optional subject scores the highest marks in UPSC?",
      a: "Among optionals with at least {{optMinN}} complete topper marksheets, {{optHighest}} has the highest median optional score; {{optLowest}} has the lowest. These are toppers' scores only.",
    },
    {
      q: "Does optional choice affect GS marks?",
      a: "Hardly. The correlation between toppers' GS I–IV totals and their optional totals is {{gsOptCorr}}, close to zero.",
    },
    {
      q: "Which optional do most toppers choose?",
      a: "{{optMostChosen}} is the most common among the toppers in our data. Popularity reflects how many people take an optional, not that it scores more.",
    },
    {
      q: "Should I pick the highest-scoring optional?",
      a: "Not on marks alone. The differences in medians are small next to the difference your interest and background make. Shortlist optionals you'd enjoy, then use the table to check none is far behind.",
    },
  ],
  relatedPages: [
    { title: "PSIR optional marks and strategy", href: "/content/how-to-score-300-plus-in-psir-optional", description: "The most chosen optional, in detail." },
    { title: "UPSC marks database", href: "/toppers/marks-database", description: "Filter every topper by optional and sort by any paper." },
    { title: "GS Paper 1 marks and strategy", href: "/content/how-to-score-130-plus-in-gs1", description: "What toppers really score in GS1." },
    { title: "How we collect and check marks", href: "/content/data-methodology-and-editorial-standards", description: "Where the numbers come from." },
  ],
  sources: [
    { label: "UPSC: marks of recommended candidates (Examinations → Results)", url: "https://upsc.gov.in" },
    { label: "How we collect and check marks", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
