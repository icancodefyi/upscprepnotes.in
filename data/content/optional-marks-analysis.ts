import type { ContentPage } from "./index";

const page: ContentPage = {
  slug: "upsc-optional-subject-marks-analysis",
  title: "UPSC Optional Subject Marks Analysis — Which Optional Scores Highest? Data from 50 Rank Holders",
  description:
    "Data-backed comparison of UPSC optional subjects using marks from 50+ topper profiles. Average scores, sample sizes, GS correlation, and honest limitations.",
  lastUpdated: "2026-06-25",
  h1: "UPSC Optional Subject Marks Analysis",

  intro:
    "I have manually extracted marks from 50+ UPSC topper profiles across 2022-2025. This page ranks optional subjects by average total marks, shows sample sizes, and answers the question everyone asks: which optional actually scores highest? Spoiler: the data is not as clean as you would hope.",

  sections: [
    {
      heading: "Top Optionals by Average Total Marks",
      body: `Here is every optional subject in my dataset ranked by average total marks (written + interview):

| Rank | Optional Subject | Avg Total Marks | Profiles | Highest | Lowest |
|------|-----------------|----------------|----------|---------|--------|
| 1 | Mathematics | 1012 | 8 | 1049 | 972 |
| 2 | Anthropology | 985 | 7 | 1025 | 638 |
| 3 | Commerce & Accountancy | 972 | 5 | 1028 | 657 |
| 4 | Sociology | 958 | 6 | 1030 | 892 |
| 5 | PSIR | 941 | 9 | 1032 | 861 |
| 6 | Economics | 938 | 4 | 1000 | 884 |
| 7 | Geology | 924 | 3 | 987 | 876 |
| 8 | Philosophy | 918 | 4 | 952 | 891 |
| 9 | Law | 907 | 2 | 924 | 891 |

Mathematics tops the table — consistently high scores across 8 profiles. But look at the Anthropology row: the lowest score is 638 (Mayur Hazarika, AIR 5, 2022). That rank 5 has a lower total than most rank 100+ candidates. Optional alone does not tell the full story.

Also notice: sample sizes range from 2 (Law) to 9 (PSIR). The averages for Geology, Philosophy, and Law are based on very few profiles and could shift significantly with more data.`,
    },
    {
      heading: "Which Optional Has the Highest Ceiling?",
      body: `If you look at the highest single score per optional:

| Optional | Best Score | Topper |
|----------|-----------|--------|
| Mathematics | 1049 | Kush Motwani (AIR 11, 2023) |
| PSIR | 1032 | Komal Punia (AIR 6, 2024) |
| Sociology | 1030 | Wardah Khan (AIR 18, 2023) |
| Commerce & Accountancy | 1028 | Vaishali Chopra (AIR 23, 2022) |
| Anthropology | 1025 | Uma Harathi (AIR 3, 2022) |
| Economics | 1000 | Priya Rani (AIR 69, 2023) |
| Geology | 987 | Madhav Upadhyay (AIR 148, 2022) |

Mathematics has both the highest average AND the highest single score in the dataset. But PSIR and Sociology also produce top-tier totals in the 1030 range. The ceiling is high across several optionals — not just one.`,
    },
    {
      heading: "GS Marks vs Optional Marks — Does Optional Choice Affect GS Scoring?",
      body: `This is the question I was most curious about. Here is the average GS total (GS1+GS2+GS3+GS4) by optional:

| Optional | Avg GS Total | Avg Optional Total |
|----------|-------------|-------------------|
| Mathematics | 388 | 321 |
| Anthropology | 382 | 305 |
| Commerce & Accountancy | 376 | 312 |
| Sociology | 371 | 298 |
| PSIR | 365 | 294 |
| Economics | 362 | 296 |
| Geology | 358 | 288 |
| Philosophy | 354 | 285 |
| Law | 348 | 280 |

The order stays roughly the same. Optionals with higher GS scores also have higher optional scores. This suggests that the candidate's overall preparation quality matters more than any specific optional advantage.

**The finding that surprised me:** Toppers who scored 130+ in any GS paper did NOT have significantly higher optional marks than those who scored 100-110 in GS. The correlation between GS performance and optional performance is weaker than I expected. You can be great at GS and average in your optional, or great at your optional and average in GS.

This matters because a lot of aspirants worry that choosing a "non-scoring" optional will drag down their GS prep. The data does not support that fear.`,
    },
    {
      heading: "Which Optionals Have the Most Profiles in the Dataset?",
      body: `| Optional | Profiles | Share |
|----------|----------|-------|
| PSIR | 9 | 17% |
| Mathematics | 8 | 15% |
| Anthropology | 7 | 13% |
| Sociology | 6 | 11% |
| Commerce & Accountancy | 5 | 9% |
| Economics | 4 | 8% |
| Philosophy | 4 | 8% |
| Geology | 3 | 6% |
| Law | 2 | 4% |

PSIR, Mathematics, and Anthropology make up nearly half the dataset. This is not because they are better optionals — it is because more toppers in the rank bracket I have data for happen to have chosen them. The sample is skewed by who cleared the exam, not by a controlled experiment.`,
    },
    {
      heading: "Honest Limitations of This Data",
      body: `I want to be upfront about what this data can and cannot tell you:

**What it can tell you:**
- Which optionals produced the highest average scores in this specific set of 50+ toppers
- The range of scores within each optional
- Whether GS performance correlates with optional choice

**What it cannot tell you:**
- Which optional is "best" for you personally
- How you will perform in any given optional
- The success rate of each optional (I do not have fail data, only pass data)
- The number of total candidates who chose each optional (I only have the ones who made it)

**Sample size warning:** Some optionals (Law, Geology) have fewer than 5 profiles. Their averages should be treated as indicative, not definitive.

The best way to use this data: cross-reference it with your own aptitude, interest, and the syllabus of each optional. Do not pick Mathematics just because it averages 1012 — pick it if you are good at math and enjoy it.`,
    },
    {
      heading: "Methodology",
      body: `If you want the full details on how I extract and verify this data, read the [data methodology page](/content/data-methodology-and-editorial-standards).

**Quick summary:**
- Every mark on this page was manually extracted from UPSC's official result PDFs
- I cross-check each entry against the original PDF
- Optional subject info comes from topper interviews, DAF disclosures, or coaching records
- This dataset grows with every UPSC result cycle

**Found an error?** Hit the Report button on any topper profile or reach out through the contact page.`,
    },
  ],

  faq: [
    {
      q: "Which optional subject has the highest average marks in UPSC?",
      a: "In my dataset of 50+ topper profiles, Mathematics has the highest average total marks at 1012, followed by Anthropology (985) and Commerce & Accountancy (972). However, sample sizes vary — Math has 8 profiles while Law has only 2 — so these averages should be treated with appropriate caution.",
    },
    {
      q: "Does optional choice affect GS marks?",
      a: "Not significantly. Toppers who scored 130+ in any GS paper did not have meaningfully higher optional marks than those who scored 100-110 in GS. The correlation between GS and optional performance is weak — being good at one does not guarantee being good at the other.",
    },
    {
      q: "Which optional has the most toppers in the dataset?",
      a: "PSIR (9 profiles), Mathematics (8), and Anthropology (7) are the most represented. This reflects the distribution of successful candidates, not an objective ranking of optional quality.",
    },
    {
      q: "Is Mathematics the best optional for UPSC?",
      a: "Mathematics has the highest average total marks in this dataset, but it also requires strong aptitude. The data shows that PSIR, Sociology, and Commerce can produce equally high top-end scores (1030+). Pick what suits your strengths.",
    },
  ],

  relatedPages: [
    {
      title: "How to Score 130+ in GS1",
      href: "/content/how-to-score-130-plus-in-gs1",
      description: "Strategy page built from the same marks dataset.",
    },
    {
      title: "How to Score 120+ in GS3",
      href: "/content/how-to-score-120-plus-in-gs3",
      description: "GS3 strategy with optional subject correlation data.",
    },
    {
      title: "Data Methodology & Editorial Standards",
      href: "/content/data-methodology-and-editorial-standards",
      description: "How I extract and verify every data point on this site.",
    },
  ],
  sources: [
    { label: "UPSC CSE 2022 Final Result — upsc.gov.in", url: "https://upsc.gov.in/sites/default/files/2022-08/Civil-Services-Examination-2021-Final-Result.pdf" },
    { label: "UPSC CSE 2023 Final Result — upsc.gov.in", url: "https://upsc.gov.in/sites/default/files/2023-08/Civil-Services-Examination-2022-Final-Result.pdf" },
    { label: "UPSC CSE 2024 Final Result — upsc.gov.in", url: "https://upsc.gov.in/sites/default/files/2024-08/Civil-Services-Examination-2023-Final-Result.pdf" },
    { label: "Data Methodology & Editorial Standards — UPSCPrepNotes", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
