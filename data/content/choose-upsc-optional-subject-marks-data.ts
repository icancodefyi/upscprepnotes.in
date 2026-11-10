import { ContentPage } from "./index";

const IMG = "/blog/choose-upsc-optional-subject-marks-data";

const page: ContentPage = {
  slug: "choose-upsc-optional-subject-marks-data",
  title: "How to Choose a UPSC Optional Subject: What Topper Marks Show",
  description:
    "Optional subject marks of 239 UPSC toppers from 2022 to 2025: median scores for PSIR, Sociology, Anthropology, Geography, Maths, Law and more, plus a decision guide.",
  lastUpdated: "2026-11-10",
  datePublished: "2026-11-10",
  h1: "How to Choose a UPSC Optional Subject: What the Marks of 239 Toppers Show",
  image: `${IMG}/og-choose-upsc-optional-subject-marks-data.png`,
  imageAlt: "Gilu the squirrel thinking next to the title: How to choose a UPSC optional subject",
  author: { name: "Zaid Rakhange", url: "https://upscprepnotes.in/about" },
  sourcesTitle: "Data and method",
  byline: "Computed from marks we extracted from UPSC result documents for toppers in 2022 to 2025.",

  intro: `Everyone has an opinion on which optional to take, and most of those opinions come from people who sell something. We have something different: the marks of 239 rank holders from 2022 to 2025, with their optional subject and the marks in both optional papers. This guide shows what that data says, what it cannot say, and a simple way to decide.

The headline is modest. Optional marks across subjects are closer than the internet argument suggests, and a higher median score does not mean a better rank. Your background and interest matter more than any chart here.

**Read this caveat first.** This is toppers only, not all candidates. We found no public success-rate data by optional, so we cannot tell you which optional has the best odds. We can only show how toppers scored in the one they chose.`,

  sections: [
    {
      heading: "The short answer",
      body: `- There is no best optional in this data. Subjects with the highest medians were not the ones with the best ranks.
- **PSIR, Sociology and Anthropology** are the most common among toppers in our records, with 37, 36 and 28 records. Popularity brings more coaching, more notes and more peers, which helps some people.
- **Mathematics** has the highest median among subjects with 15 or more records, but only 17 records, so treat it carefully.
- **Law and Hindi Literature** have the lowest medians among subjects with ten or more records, yet both still produced toppers.
- Choose based on your background, your interest and how much material and guidance you can access, not on a one-point difference in median marks.

![Gilu says|gilu](/quiz/gilu-thinking.png "Tip: a 10-mark gap in a median is smaller than the gap between the same candidate's first and second attempt. Do not choose on it.")`,
    },
    {
      heading: "What marks toppers scored by optional",
      body: `Marks are the sum of Optional Paper I and Paper II, out of 500, for toppers in 2022 to 2025. We only show subjects with at least ten usable records.

| Optional | Records | Median | Middle half (25th to 75th) | Highest | Toppers in top 100 |
|---|---|---|---|---|---|
| Mathematics | 17 | 289 | 274 to 310 | 312 | 7 |
| Anthropology | 28 | 281.5 | 271 to 293 | 326 | 7 |
| Geography | 22 | 279 | 273 to 283 | 298 | 4 |
| Sociology | 36 | 278.5 | 262 to 288 | 315 | 15 |
| Economics | 10 | 278 | 262 to 295 | 299 | 3 |
| PSIR | 37 | 267 | 258 to 282 | 304 | 7 |
| Law | 14 | 259.5 | 253 to 274 | 288 | 5 |
| Hindi Literature | 10 | 258.5 | 252 to 266 | 282 | 1 |

![Median optional marks of toppers, 2022 to 2025|1200x860](${IMG}/optional-medians.png "Median of Paper I plus Paper II, out of 500, for toppers with a usable record. Subjects with fewer than ten records are not shown.")

**How we got these numbers.** Of 379 toppers in our database for 2022 to 2025, 239 had a recognisable optional subject and plausible marks in both optional papers (between 40 and 250 each). The other 140 records were excluded for missing or inconsistent marks. We merged spelling variants of the same subject, for example "Political Science & International Relations" with PSIR.`,
    },
    {
      heading: "What the table does and does not show",
      body: `**A higher median is not a better rank.** Mathematics has the highest median at 289, and its toppers in our records have a median rank of 120. PSIR has a median of 267 and a median rank of 210. Sociology has a median of 278.5 and a median rank of 194, with 15 of its 36 records in the top 100. Different subjects are marked differently, and the final rank also depends on GS, essay and interview.

**Small samples wobble.** Mathematics has 17 records, Economics has 10 and Hindi Literature has 10. One strong or weak year can move a median by several marks. We hid subjects with fewer than ten records for this reason.

**Survivorship bias.** These are people who ranked well. If a subject has a harder paper and many candidates fail with it, you do not see them here. Likewise, a popular subject may show up often simply because more people choose it.

**Marks are not the whole story.** Scoring depends on your answer writing and on the evaluator, and the same candidate can score differently in different attempts. Our [optional marks analysis](/content/upsc-optional-subject-marks-analysis) looks at total Mains marks and GS correlation for an earlier set of rank holders, and our guide on [how to write Mains answers](/content/how-to-write-upsc-mains-answers) covers the skill that decides your optional score.`,
    },
    {
      heading: "A simple way to decide",
      body: `Use these in order. Stop when one gives a clear answer.

1. **Your graduation subject, if you liked it.** Years of background help, but only if you want to keep studying it. A degree you disliked is not an advantage.
2. **Overlap with GS.** Subjects such as Geography, PSIR, History and Sociology share ground with GS papers. That saves time, but the optional paper still needs separate depth.
3. **Syllabus size and your time.** Look at the syllabus and last five years of papers. Can you finish it twice before Mains? If not, choose a smaller syllabus.
4. **Access to guidance.** Notes, a mentor or test series for the subject. Popular subjects have more, and rarer ones may require more self-reliance.
5. **Your interest.** You will read this subject for a year. Boredom costs more marks than a slightly lower median.

![Gilu says|gilu](/quiz/gilu-hello.png "Tip: read two years of question papers in the subject before you commit. If you can imagine answering them, that is a good sign.")`,
    },
    {
      heading: "Five mistakes people make",
      body: `- **Choosing on last year's topper.** One year's topper tells you about one person's preparation, not about the subject.
- **Choosing a subject for "scoring".** Our data shows medians sit within about 30 marks of each other for the larger subjects. Preparation quality outweighs that gap.
- **Switching late.** Changing optional close to Mains throws away months of effort.
- **Ignoring the paper pattern.** Some optionals reward structured theory, others diagrams, data or numerical working. Match it to how you answer best.
- **Skipping answer writing in the optional.** The optional is 500 marks, and half the work is practice. Review your answers against real copies.

If you want to see how toppers wrote their answers in their optional and GS papers, the [Answer Copies Compilation](/store/answer-copies-compilation) has 63 real Mains copies from 27 toppers, and the [Mains 2027 Pack](/store/upsc-mains-2027-pack) brings topper notes together.`,
    },
    {
      heading: "What we do not know",
      body: `We do not have success rates by optional, meaning the share of all candidates who clear Mains with each subject. We also do not have marks for candidates outside our topper records. Without those, any claim that one optional is "easier" or "safer" is a guess, including ours.

We will update this page when we extend the data. If you spot an error in a subject's records, write to us and we will check it against the UPSC documents.`,
    },
  ],

  faq: [
    {
      q: "Which optional subject is best for UPSC?",
      a: "There is no best optional in the data we have. Median optional marks of toppers range from about 259 to 289 out of 500 across the larger subjects, and the highest median did not match the best ranks. Choose on your background, interest, syllabus size and access to guidance.",
    },
    {
      q: "Which optional subject scores highest?",
      a: "Among subjects with at least ten records, Mathematics has the highest median (289 out of 500, 17 records), then Anthropology (281.5, 28 records). Samples are small and limited to toppers, so a few marks of difference means little.",
    },
    {
      q: "Is a popular optional like PSIR or Sociology safer?",
      a: "Popularity means more guidance and test series, which helps many people. In our records PSIR (37), Sociology (36) and Anthropology (28) are the most common among toppers, but we have no success-rate data to say they are safer.",
    },
    {
      q: "Should I choose my graduation subject as optional?",
      a: "If you liked it, yes, because the background saves time. If you did not enjoy it, a degree alone is not a good reason.",
    },
    {
      q: "How many marks does the optional carry?",
      a: "The optional has two papers of 250 marks each, 500 in total, out of 1,750 in Mains.",
    },
    {
      q: "Does the optional decide the final rank?",
      a: "It is 500 of 1,750 Mains marks, so it matters, but GS, Essay and the 275-mark interview also count. Marks in the optional vary by evaluator and by your answer writing.",
    },
  ],

  ctaIntro: "See what marks each rank band needed, and where toppers pull ahead.",
  ctaIntroBtn: "Open the marks calculator",
  ctaIntroHref: "/toppers/upsc-mains-marks-needed",
  ctaMid: "Choosing is the easy part. Writing answers that score in your optional is the work.",
  ctaMidSub: "63 handwritten Mains copies from 27 toppers, with marks. 7-day refund.",
  ctaMidBtn: "See the answer copies",
  ctaMidHref: "/store/answer-copies-compilation",
  ctaFinal: "Prepare your optional and GS with topper material",
  ctaFinalSub: "The Mains 2027 Pack. Instant email delivery, 7-day refund.",
  ctaFinalBtn: "See the Mains 2027 Pack",
  ctaFinalHref: "/store/upsc-mains-2027-pack",

  relatedPages: [
    { title: "UPSC Optional Subject Marks Analysis", href: "/content/upsc-optional-subject-marks-analysis", description: "Total Mains marks and GS correlation by optional for an earlier set of rank holders." },
    { title: "UPSC Mains Marks Needed for a Rank", href: "/toppers/upsc-mains-marks-needed", description: "The marks each rank band scored, with a calculator." },
    { title: "How to Write UPSC Mains Answers", href: "/content/how-to-write-upsc-mains-answers", description: "What strong openings, data use and time management look like in real copies." },
    { title: "Best UPSC Coaching 2027: 10 Institutes Compared", href: "/content/best-upsc-coaching-2027", description: "Fees, refund terms and the public record for ten institutes." },
    { title: "Toppers Marks Database", href: "/toppers/marks-database", description: "Search marks by rank, year and subject." },
  ],

  sources: [
    { label: "UPSC: Civil Services Examination marks and results", url: "https://upsc.gov.in/" },
    { label: "UPSCPrepNotes: Toppers Marks Database", url: "https://upscprepnotes.in/toppers/marks-database" },
    { label: "UPSCPrepNotes: data methodology and editorial standards", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
