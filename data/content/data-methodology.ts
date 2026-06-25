import type { ContentPage } from "./index";

const page: ContentPage = {
  slug: "data-methodology-and-editorial-standards",
  title: "Data Methodology & Editorial Standards — How UPSCPrepNotes Sources and Verifies Topper Data",
  description:
    "How UPSCPrepNotes collects, verifies, and updates UPSC topper marks data. Our sourcing process, editorial standards, and data methodology explained transparently.",
  lastUpdated: "2026-06-25",
  h1: "Data Methodology & Editorial Standards",

  intro:
    "Every data point on UPSCPrepNotes is researched, extracted, and verified by **Zaid Rakhange** — a software engineer and founder of ImpicLabs who is genuinely fascinated by UPSC data and topper performance patterns. He personally studies UPSC result PDFs, topper interviews, and preparation transcripts to build this dataset. This page explains exactly how the data is sourced, verified, and maintained, so you can evaluate the authority of everything published here.",

  sections: [
    {
      heading: "Who Runs UPSCPrepNotes?",
      body: `UPSCPrepNotes is founded and run by **Zaid Rakhange**, a software engineer and founder of ImpicLabs. Zaid is not a UPSC aspirant or coach — he is genuinely fascinated by the structure of UPSC data: how toppers perform across papers, which optionals produce top ranks, and what the numbers actually say. What started as a curiosity about the data turned into a full research platform.

The platform is not affiliated with UPSC, any coaching institute, or any government body. It is an independent research project driven purely by an interest in understanding topper performance at scale.`,
    },
    {
      heading: "How Topper Marks Data Is Sourced",
      body: `All topper marks data published on UPSCPrepNotes comes exclusively from **officially published UPSC results**.

**The sourcing process:**
1. UPSC publishes final result PDFs on upsc.gov.in after each examination cycle. These PDFs contain the name, rank, and total marks of every successful candidate.
2. We manually extract marks from these PDFs — topper by topper, paper by paper (GS1, GS2, GS3, GS4, Essay, Optional 1, Optional 2, Interview, Written Total, Grand Total).
3. Each profile is cross-verified against the original UPSC PDF to ensure accuracy.
4. Optional subject information is collected from topper interviews, DAF disclosures, or coaching institute records and cross-referenced where possible.

**Current dataset size:** 50+ indexed topper profiles spanning UPSC CSE 2021–2025.`,
    },
    {
      heading: "How Strategy Pages Are Created",
      body: `Strategy pages (e.g., "How to Score 130+ in GS1") are built on three inputs:

**1. Topper marks data (primary)**
We analyze marks across 38+ topper profiles to identify score distributions, averages, and outliers. Every statistic on a strategy page is computed from this dataset.

**2. Topper strategy transcripts and interviews**
We analyze publicly available topper interviews, talks, and written strategies for preparation patterns. When a strategy claim is made (e.g., "focus on World History"), it is backed by patterns observed across multiple toppers — not a single anecdote.

**3. Subject-matter knowledge**
The booklists, topic weightages, and answer-writing tips come from the founder's own UPSC preparation experience and cross-referencing against coaching materials and topper recommendations.

**What strategy pages are not:**
- They are not AI-generated content spun from other websites
- They are not affiliate-marketing pages
- They are not generic blog posts rewritten from coaching brochures`,
    },
    {
      heading: "How Topper Profile Pages Are Structured",
      body: `Each topper profile page at /upsc-topper/[slug] presents:

- **Verified marks** extracted from UPSC's official result PDFs, organized paper-by-paper
- **Quick facts** (rank, year, optional subject, category when available)
- **Strategy content** — the topper's own preparation approach, sourced from their interviews, talks, or written contributions. Where a topper has shared detailed strategy, it is presented in their own words with minimal editing.
- **Answer copies** — scanned PDFs contributed by toppers directly or sourced from verified compilations. Each copy is cross-checked against published marksheets for authenticity.

If a profile includes an answer copy download, it is clearly marked with the source.`,
    },
    {
      heading: "Verification and Errors",
      body: `We aim for 100% accuracy, but errors can occur — especially in manual data extraction from PDFs.

**If you spot an error:**
- Use the **Report** button on any topper profile page
- Email us with the correction and source (e.g., a link to the official UPSC result PDF)

We review every report and correct verified errors within 48 hours. A correction log is maintained for transparency.

**Known limitations of our data:**
- We do not have marks data for every rank holder — only those we have successfully extracted from UPSC PDFs
- Optional subject information may be incomplete for some toppers
- Strategy content reflects what toppers have publicly shared, which may not cover their full preparation`,
    },
    {
      heading: "Update Frequency",
      body: `- **Topper profiles**: Updated within 7 days of every UPSC final result announcement
- **Strategy pages**: Reviewed and updated every 3 months, or within 7 days of new topper data that significantly changes a page's conclusions
- **Answer copies**: Updated as new copies are verified and added to the collection
- **This methodology page**: Updated whenever our processes change`,
    },
    {
      heading: "Contact and Corrections",
      body: `For corrections, data contributions, or questions about our methodology:

- **Email**: Contact through the contact page on the site
- **Report button**: Available on every topper profile page for quick error reporting
- **Social**: @zaidrakhange on Twitter/X

If you are a UPSC topper and would like to contribute your strategy or answer copies, we would love to feature your journey.`,
    },
  ],

  relatedPages: [
    {
      title: "Contact Us",
      href: "/contact",
      description: "Get in touch with the UPSCPrepNotes team for questions, corrections, or contributions.",
    },
    {
      title: "How to Score 130+ in GS1",
      href: "/content/how-to-score-130-plus-in-gs1",
      description: "Strategy page built using this methodology — see how we apply our data.",
    },
    {
      title: "UPSC Topper Answer Copies",
      href: "/content/upsc-topper-answer-copies",
      description: "Browse verified topper answer copies sourced through this process.",
    },
  ],
};

export default page;
