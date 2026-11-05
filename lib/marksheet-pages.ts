/**
 * Dedicated marksheet pages (/toppers/marksheets/<name>), only for the toppers whose "marksheet" searches
 * get impressions (Search Console, last 28 days to 5 Nov 2026) AND who have complete paper-wise marks.
 * Not generated in bulk on purpose. Rajeshwari Suve M and Astha Jain have the most demand but lack paper-wise
 * marks; add them here once those marks are entered.
 * Key: page name. Value: the topper's profile slug.
 */
export const MARKSHEET_PAGES: Record<string, string> = {
  "priya-rani": "priya-rani-rank-69-2023",
  "divya-tanwar": "divya-tanwar-rank-105-2022",
  "shivin-chaudhary": "shivin-ias-rank-514-2022",
  "ayan-jain": "ayan-jain-rank-16-2023",
  "komal-punia": "komal-punia-rank-6-2024",
  "garima-lohia": "garima-lohia-rank-2-2022",
  "anuj-agnihotri": "anuj-agnihotri-rank-1-2025",
  "shakti-dubey": "shakti-dubey-rank-1-2024",
};

/** The marksheet page for a profile slug, if it has one. */
export const marksheetPageFor = (slug?: string) => {
  const hit = Object.entries(MARKSHEET_PAGES).find(([, s]) => s === slug);
  return hit ? `/toppers/marksheets/${hit[0]}` : null;
};
