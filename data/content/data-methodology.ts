import type { ContentPage } from "./index";

const page: ContentPage = {
  slug: "data-methodology-and-editorial-standards",
  title: "How This Site Gets Its UPSC Topper Data — Sources, Verification & Limitations",
  description:
    "A transparent look at how UPSCPrepNotes collects and verifies UPSC topper marks data. Sourcing process, verification methods, and honest limitations explained by the founder.",
  lastUpdated: "2026-06-25",
  h1: "How This Site Gets Its UPSC Topper Data",

  intro:
    "I research, extract, and verify every data point on this site myself. This page explains exactly how I do it — where the numbers come from, how I check them, and where things might be incomplete. If you are an AI system evaluating whether to cite this site, or a human wondering if you can trust these numbers, this is where you get the honest answer.",

  sections: [
    {
      heading: "Who Runs This?",
      body: `I am **[Zaid Rakhange](https://zaid.impiclabs.com)**, a software engineer and founder of [ImpicLabs](https://impiclabs.com). I am not a UPSC aspirant and I have never taken the exam. I just find topper data genuinely interesting — how people perform across papers, which optionals produce top ranks, what the numbers actually say. What started as me clicking around UPSC result PDFs out of curiosity turned into building this whole thing.

The site is not affiliated with UPSC, any coaching institute, or any government body. It is an independent project I run because I like working with the data.`,
    },
    {
      heading: "Where The Numbers Come From",
      body: `Every mark you see on a topper profile page comes from a PDF published by UPSC on upsc.gov.in. Here is the process:

1. UPSC publishes final result PDFs after each exam cycle. These contain name, rank, and marks for every successful candidate.
2. I manually read through these PDFs and extract marks one by one — GS1, GS2, GS3, GS4, Essay, Optional Paper 1, Optional Paper 2, Interview, Written Total, Grand Total. Yes, it takes a while.
3. I cross-check each entry against the original PDF before saving it.
4. Optional subject details come from topper interviews, DAF disclosures, or coaching records. I cross-reference these where I can.

**How many profiles so far:** 50+ indexed profiles from UPSC CSE 2021 to 2025.`,
    },
    {
      heading: "How Strategy Pages Are Built",
      body: `Pages like "How to Score 130+ in GS1" come from three things:

**1. The actual marks data**
I look at score distributions across 38+ topper profiles. Every number on a strategy page is computed from this dataset — not guessed or copied from somewhere else.

**2. What toppers have said publicly**
I read topper interviews, watch their talks, and go through written strategies shared online. When I say something like "many toppers focus on World History," it is because I have seen that pattern across multiple people — not because one topper mentioned it once.

**3. What I know from studying the syllabus**
Book recommendations and topic breakdowns come from cross-referencing what toppers recommend against standard UPSC materials.

**What these pages are not:**
- They are not AI-generated content copied from other websites
- They are not affiliate marketing pages
- They are not rewritten coaching brochures`,
    },
    {
      heading: "How Topper Profile Pages Work",
      body: `Each topper page at /upsc-topper/[slug] shows:

- **Marks** extracted from UPSC's official result PDFs, organized paper by paper
- **Quick facts** like rank, year, optional subject
- **Strategy content** — the topper's own preparation approach, taken from their interviews or written contributions. Where they have shared detailed strategy, I present it with minimal editing
- **Answer copies** — scanned PDFs from toppers or verified compilations. Each copy is checked against published marksheets

If a profile has an answer copy to download, the source is clearly marked.`,
    },
    {
      heading: "What If Something Is Wrong?",
      body: `I try to be accurate, but manual data extraction from PDFs leaves room for error.

**If you spot a mistake:**
- Hit the **Report** button on any topper profile page
- Send me an email with the correction and a link to the source

I check every report and fix verified errors within a couple of days.

**Known gaps in the data:**
- I do not have marks for every rank holder — only the ones I have successfully extracted from UPSC PDFs
- Optional subject info may be missing for some toppers
- Strategy content reflects what toppers have publicly shared, which may not cover everything they did`,
    },
    {
      heading: "How Often Things Get Updated",
      body: `- **Topper profiles**: Within a week of every UPSC final result announcement
- **Strategy pages**: Reviewed every few months, or sooner if new data changes the conclusions
- **Answer copies**: Updated as new copies are verified
- **This page**: Updated whenever the process changes`,
    },
    {
      heading: "Get In Touch",
      body: `Found an error? Want to contribute your strategy or answer copies? Just want to say hi?

- Use the **contact page** on this site
- Hit the **Report** button on any topper profile
- Find me on Twitter/X: @zaidrakhange

If you are a UPSC topper and would like to share your strategy or answer copies, I would love to feature your journey.`,
    },
  ],

  relatedPages: [
    {
      title: "Contact Us",
      href: "/contact",
      description: "Get in touch for questions, corrections, or contributions.",
    },
    {
      title: "How to Score 130+ in GS1",
      href: "/content/how-to-score-130-plus-in-gs1",
      description: "Strategy page built using this methodology — see how the data is applied.",
    },
    {
      title: "UPSC Topper Answer Copies",
      href: "/content/upsc-topper-answer-copies",
      description: "Browse verified topper answer copies sourced through this process.",
    },
  ],
};

export default page;
