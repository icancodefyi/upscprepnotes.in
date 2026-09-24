export interface LandingFaqItem {
  q: string;
  a: string;
}

export const LANDING_FAQS: LandingFaqItem[] = [
  {
    q: "Is UPSCPrepNotes free?",
    a: "Yes. All topper profiles, marks data, 2,700+ free PDFs, and the AI tutor are completely free. We charge only for premium strategy reports and answer copy compilations.",
  },
  {
    q: "How is the topper data collected?",
    a: "Every mark is manually extracted from UPSC's official result PDFs on UPSC.gov.in. We verify each profile against the published gazette. Our dataset spans 2022-2025 with 271+ toppers.",
  },
  {
    q: "Can I download answer copies?",
    a: "Free sample answer copies are available on many topper profiles. The full compilation (50+ toppers, all GS papers + essay) is available in the store.",
  },
  {
    q: "How does the AI tutor work?",
    a: "Ask AI uses vector search over our topper strategy database to answer your UPSC questions with real, data-backed insights. Free tier: 20 queries/day.",
  },
  {
    q: "Which optional subjects are covered?",
    a: "We cover 37 optional subjects with marks analysis, score trends, and topper profiles — including PSIR, Anthropology, Sociology, Geography, History, and more.",
  },
  {
    q: "How often is the data updated?",
    a: "Topper profiles are updated within 2-4 weeks of UPSC results. Current affairs and free materials are updated weekly.",
  },
];
