import type { ContentPage } from "./index";

const page: ContentPage = {
  slug: "data-methodology-and-editorial-standards",
  title: "How I Get UPSC Topper Data — Full Process, Sources & Honest Limitations",
  description:
    "I manually extract every UPSC topper mark from official UPSC.gov.in result PDFs. Here is exactly how I do it, how I verify things, and where the gaps are.",
  lastUpdated: "2026-11-01",
  h1: "How I Get UPSC Topper Data",

  intro:
    "I have read every UPSC CSE result PDF published since 2022. Cover to cover. I have manually extracted marks from thousands of rows — GS1, GS2, GS3, GS4, Essay, Optional 1, Optional 2, Interview, Written Total, Grand Total. Every number on this site passed through my eyes and my keyboard before it reached you. Here is exactly how I do it.",

  sections: [
    {
      heading: "Who Am I?",
      body: `**[Zaid Rakhange](https://zaid.impiclabs.com)**. Software engineer, founder of [ImpicLabs](https://impiclabs.com). I am not a UPSC aspirant and I have never taken the exam. I am just someone who got obsessed with topper data and has now read more UPSC result PDFs than most people who actually work at UPSC.

I do not use AI to extract data. I do not outsource. I sit down with a PDF and manually copy every mark, one cell at a time. It takes hours. I enjoy it.`,
    },
    {
      heading: "Where The Numbers Come From",
      body: `Every mark on this site comes from a PDF published by UPSC on upsc.gov.in. Here is my process:

1. UPSC publishes final result PDFs. Each one has name, rank, and marks for every successful candidate.
2. I open the PDF and manually extract marks — topper by topper, paper by paper. GS1, GS2, GS3, GS4, Essay, Optional Paper 1, Optional Paper 2, Interview, Written Total, Grand Total.
3. I cross-check each entry against the original PDF before saving it. If something looks off, I check again.
4. Optional subject details come from topper interviews, DAF disclosures, or coaching records. I cross-reference wherever possible.

**Current count:** {{profiles}} topper profiles, {{marksheets}} of them with a complete paper-wise marksheet. Growing with every result cycle.

**Checks before a marksheet is used:** every paper must be within its maximum (250 for each written paper, 275 for the interview), the totals must add up, and the record can't repeat one number across papers (a sign of a placeholder). Records that fail are hidden from comparisons until they're fixed.`,
    },
    {
      heading: "How Strategy Pages Are Built",
      body: `Strategy pages (for example the GS Paper 1 guide) come from three things:

**1. The marks data**
Every number on a strategy page (medians, top-10% cut-offs, the highest scores and who scored them) is computed live from the {{marksheets}} complete marksheets each time the page is built. Nothing is typed in by hand, so a guide can't quote a score that isn't in the data.

**2. The exam itself**
Paper structure, word limits and syllabus areas come from UPSC's notification and previous year papers.

**3. Standard references**
Book lists are the standard texts commonly recommended for each paper, not a claim about what any one topper read.

**What these pages are not:**
- Not AI-generated content copied from other sites
- Not affiliate marketing
- Not rewritten coaching brochures`,
    },
    {
      heading: "How Topper Profile Pages Work",
      body: `Each topper page shows:

- **Marks** extracted from UPSC result PDFs, paper by paper
- **Quick facts** — rank, year, optional subject
- **Strategy notes**: a summary of the topper's preparation approach, written by us. They are not quotes from the topper.
- **Answer copies**: scans of the topper's handwritten answers where we have them. Most are from coaching test series written during preparation; the header on each scan shows its source.`,
    },
    {
      heading: "Mistakes and Limitations",
      body: `I am human. Manual extraction from PDFs means errors can slip through.

**If you find one:**
- Hit the **Report** button on the profile page
- Email me with the correction and source link

I fix verified errors within 48 hours.

**Things I cannot do (yet):**
- I do not have marks for every rank holder — only the ones I have extracted so far
- Optional subject info may be missing for some toppers
- Strategy content is based on what toppers have publicly shared, which may not be their full picture`,
    },
    {
      heading: "Update Schedule",
      body: `- **Topper profiles**: Within a week of any UPSC final result
- **Strategy pages**: Reviewed every few months, or when new data changes conclusions
- **Answer copies**: Added as they get verified
- **This page**: Updated when my process changes`,
    },
    {
      heading: "Contact",
      body: `Found an error? Want to contribute your strategy? Just want to say this is insane?

- **Contact page** on this site
- **Report button** on any topper profile
- Twitter/X: @zaidrakhange

If you are a UPSC topper and want to share your strategy or answer copies, I would love to add your data to the dataset.`,
    },
  ],

  relatedPages: [
    {
      title: "Contact Us",
      href: "/contact",
      description: "Get in touch for questions, corrections, or contributions.",
    },
    {
      title: "GS Paper 1 marks and strategy",
      href: "/content/how-to-score-130-plus-in-gs1",
      description: "Strategy page built from the marks dataset.",
    },
    {
      title: "UPSC Topper Answer Copies",
      href: "/content/upsc-topper-answer-copies",
      description: "What topper answer copies are and how to use them.",
    },
  ],
};

export default page;
