import type { ContentPage } from "../index";

/** Numbers in {{braces}} are filled from the live marks database at render time (PSIR toppers only). */
const page: ContentPage = {
  slug: "how-to-score-300-plus-in-psir-optional",
  paper: "psir",
  title: "PSIR Optional Marks of UPSC Toppers: Highest Score, Median and How to Reach 280+",
  description:
    "{{atLeast:300}} of {{n}} PSIR toppers scored 300+. Median {{median}}/500, highest {{best}}. Real PSIR scores by topper, paper-wise strategy and booklist.",
  lastUpdated: "2026-11-01",
  h1: "How to score high in UPSC PSIR optional",
  intro:
    "300 in PSIR is rare: **{{atLeast:300}} of {{n}}** PSIR toppers in UPSC's published marks got there. The median PSIR topper scored **{{median}}** out of 500, and the highest is **{{best}}**, by {{bestName}}. 280+ is an excellent, realistic target.",
  sections: [
    {
      heading: "What score is realistic in PSIR",
      body: `PSIR (Political Science and International Relations) carries 500 marks across two papers of 250.

Across {{n}} PSIR toppers with complete marksheets from CSE {{years}}:

- **{{median}}** is the median PSIR topper's total.
- **{{atLeast:280}}** scored 280 or more.
- **{{atLeast:300}}** scored 300 or more.

PSIR is one of the most chosen optionals among toppers, so this is one of the larger samples we have for any single optional.`,
    },
    {
      heading: "The two papers",
      body: `**Paper I: Political theory and Indian politics**
- Political theory: state, justice, equality, rights, democracy, power and ideologies
- Western political thought: Plato to Rawls
- Indian political thought: Kautilya to Ambedkar and Lohia
- Indian government and politics: the national movement, the Constitution, federalism, parties and social movements

**Paper II: Comparative politics and international relations**
- Comparative politics and IR theory: realism, liberalism, Marxism and their successors
- The changing international order and international institutions
- India and the world: foreign policy, neighbours, major powers and multilateral groupings

The Indian government and foreign-policy parts overlap heavily with GS2, so time spent here pays twice.`,
    },
    {
      heading: "Standard references",
      body: `1. IGNOU Political Science material, which follows the syllabus closely
2. NCERT Political Science (Class 11–12) for foundations
3. Andrew Heywood, *Political Theory* and *Politics*
4. O.P. Gauba, *An Introduction to Political Theory*
5. A standard IR text for theory (for example Baylis and Smith, *The Globalization of World Politics*)
6. MEA annual reports for India's foreign policy`,
    },
    {
      heading: "Answer writing for PSIR",
      body: `1. **Define precisely.** Open with a tight definition; examiners check conceptual clarity first.
2. **Name thinkers.** Quote Rawls, Marx or Ambedkar by name rather than "some scholars".
3. **Apply to India.** Close a theory answer with how the idea works in the Indian context.
4. **Keep IR current.** Paper II answers need recent, dated examples.
5. **Diagram models.** Bipolarity, balance of power and integration models are quicker to show than to describe.`,
    },
    {
      heading: "A simple eight-month plan",
      body: `This is a suggested structure, not a topper's timetable.

- **Months 1–3:** IGNOU and the standard texts. One page of notes per thinker.
- **Months 4–5:** Two answers a day, mostly Paper I thinkers and theory.
- **Months 6–7:** Paper II: IR theory plus a running foreign-policy file.
- **Month 8:** Revise both papers and write full-length tests.`,
    },
  ],
  faq: [
    {
      q: "How many PSIR toppers score 300+?",
      a: "{{atLeast:300}} of {{n}} PSIR toppers with complete marksheets scored 300 or more out of 500. The median is {{median}}.",
    },
    {
      q: "What is the highest PSIR score among UPSC toppers?",
      a: "{{best}} out of 500, by {{bestName}}.",
    },
    {
      q: "Does PSIR help in GS2?",
      a: "Yes for content: Indian government and international relations overlap with GS2. It doesn't guarantee a high GS2 score, which still needs GS-style answer practice.",
    },
  ],
  relatedPages: [
    { title: "PSIR toppers", href: "/optional/psir", description: "Every PSIR topper's profile and marks." },
    { title: "GS Paper 2 marks and strategy", href: "/content/how-to-score-120-plus-in-gs2", description: "The GS paper PSIR overlaps with most." },
    { title: "Optional subject marks analysis", href: "/content/upsc-optional-subject-marks-analysis", description: "How optionals compare." },
    { title: "PSIR toppers in the marks database", href: "/toppers/marks-database?optional=PSIR&sort=opt1.desc", description: "Every PSIR topper's marks, sortable." },
  ],
  sources: [
    { label: "UPSC: marks of recommended candidates (Examinations → Results)", url: "https://upsc.gov.in" },
    { label: "How we collect and check marks", url: "https://upscprepnotes.in/content/data-methodology-and-editorial-standards" },
  ],
};

export default page;
