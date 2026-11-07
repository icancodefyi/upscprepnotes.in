export interface ProductFile {
  name: string;
  sizeMB: number;
}

export type ProductCategory = "original" | "notes-bundle" | "teacher-brand" | "test-series" | "optional";

export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface StoreProduct {
  slug: string;
  dodoProductId?: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string[];
  price: number;
  originalPrice: number | null;
  rating: number | null;
  reviewCount: number | null;
  badge: string;
  badgeColor: "emerald" | "amber" | "gray";
  gradient: string;
  features: string[];
  payNote: string;
  payAmount: number;
  link: string | null;
  comingSoon: boolean;
  institute?: string;
  category?: ProductCategory;
  image?: string;
  images?: string[];
  fileCount?: number;
  totalSizeMB?: number;
  files?: ProductFile[];
  specs?: { label: string; value: string }[];
  sourceNote?: string;
  highlights?: { label: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  reviews?: ProductReview[];
}

export interface Institute {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  gradient: string;
  logo: string;
}

export const INSTITUTES: Institute[] = [
  {
    slug: "insight-ias",
    name: "Insight IAS",
    shortName: "Insight IAS",
    description: "Prelims test series and study material",
    gradient: "bg-blue-600",
    logo: "https://ik.imagekit.io/impiclabs/institutes/insight-ias.png?tr=f-auto,q-80",
  },
  {
    slug: "only-ias",
    name: "Only IAS",
    shortName: "Only IAS",
    description: "Prelims test series",
    gradient: "bg-orange-500",
    logo: "https://ik.imagekit.io/impiclabs/institutes/only-ias.png?tr=f-auto,q-80",
  },
  {
    slug: "ias-baba",
    name: "IAS BABA",
    shortName: "IAS BABA",
    description: "All India Open Mock Tests and Mains tests",
    gradient: "bg-[#1f3fd6]",
    logo: "https://ik.imagekit.io/impiclabs/institutes/ias-baba.png?tr=f-auto,q-80",
  },
  {
    slug: "csk-csat",
    name: "CSK's CSAT",
    shortName: "CSK CSAT",
    description: "CSAT micro tests and practice sets",
    gradient: "bg-purple-600",
    logo: "CS",
  },
  {
    slug: "sudarshan-gurjar",
    name: "Sudarshan Gurjar",
    shortName: "Sudarshan Gurjar",
    description: "Places in News and geography compilations",
    gradient: "bg-cyan-600",
    logo: "https://ik.imagekit.io/impiclabs/institutes/sudarshan-gurjar.png?tr=f-auto,q-80",
  },
  {
    slug: "general",
    name: "General Compilations",
    shortName: "Compilations",
    description: "Government schemes, PYQ analysis, and more",
    gradient: "bg-rose-600",
    logo: "GC",
  },
  {
    slug: "vision-ias",
    name: "Vision IAS",
    shortName: "Vision IAS",
    description: "Mains test series and practice papers",
    gradient: "bg-blue-700",
    logo: "https://ik.imagekit.io/impiclabs/institutes/vision-ias.png?tr=f-auto,q-80",
  },
];

export const PRODUCTS: StoreProduct[] = [
  {
    slug: "upsc-interview-pack",
    dodoProductId: "pdt_0Nr7VzNL2QmXkxu2jIRG7",
    title: "UPSC Interview Pack",
    image: "/store/interview-pack/page-1.jpg",
    images: [
      "/store/interview-pack/page-1.jpg",
      "/store/interview-pack/page-2.jpg",
      "/store/interview-pack/page-3.jpg",
      "/store/interview-pack/page-4.jpg",
      "/store/interview-pack/page-5.jpg",
    ],
    tagline: "DAF worksheet, 150 questions and a 30-day plan",
    description: "Prepare for the Personality Test with real data: interview marks of 282 toppers, 347 questions from 14 real 2026 board transcripts, a DAF worksheet and a 30-day plan.",
    longDescription: [
      "The interview is 275 marks, and most of the questions come from a form you fill in yourself: your DAF. This pack shows you what the interview is worth and what boards actually ask, then gives you a plan.",
      "We read 14 transcripts from the CSE 2025 interviews (January–February 2026) and sorted all 347 questions. About a third came straight from the DAF; most current-affairs questions were linked to the candidate's degree, job or home state. Home state came up in 10 of 11 interviews where it was known, and hobbies in 9 of 13.",
      "From our own data: the median topper scored 182 in the interview, and pairs with the same written marks finished hundreds of ranks apart because of it. Toppers who wrote 835–844 in Mains still lost ranks with interviews under 150.",
      "Then the work: a field-by-field DAF guide and worksheet, question patterns by degree (engineering, MBBS, commerce, law, humanities), a home district dossier, answer methods for opinion, \"As DM\" and \"I don't know\" questions, 150 practice questions, a day-by-day 30-day plan and a mock scorecard. A 22-page branded PDF, made to print and write on.",
    ],
    price: 299,
    originalPrice: null,
    rating: null,
    reviewCount: null,
    badge: "New",
    badgeColor: "amber",
    gradient: "bg-[#1f3fd6]",
    features: [
      "Interview marks of 282 toppers: median, by rank band, best and lowest",
      "What boards ask: 347 questions from 14 real 2026 transcripts, sorted",
      "DAF field by field, with a worksheet for every entry",
      "150 practice questions, including 12 \"As DM, what would you do?\"",
      "Day-by-day 30-day plan and a mock interview scorecard",
    ],
    category: "original",
    payNote: "UPSC Interview Pack",
    payAmount: 299,
    link: null,
    comingSoon: false,
    specs: [
      { label: "Format", value: "PDF, 22 pages" },
      { label: "Practice questions", value: "150" },
      { label: "Board transcripts analysed", value: "14 (Jan–Feb 2026)" },
      { label: "Interview marks", value: "282 toppers, CSE 2022–25" },
    ],
    sourceNote: "Original UPSCPrepNotes work. Interview marks are from UPSC's published marks of recommended candidates. Questions from the transcripts are paraphrased in our own words, with every source listed.",
    highlights: [
      { label: "Real board questions", desc: "347 questions from 14 interviews held in January–February 2026, sorted by type" },
      { label: "Real interview marks", desc: "What 282 toppers scored, and how far the interview moved their rank" },
      { label: "A plan, not a lecture", desc: "DAF worksheet, 150 questions and a 30-day schedule to fill in and use" },
    ],
    faqs: [
      { q: "When should I start?", a: "Before the Mains result. The DAF worksheet is useful the moment you start filling DAF-II, and the 30-day plan begins the day the result is out." },
      { q: "Is this a list of questions asked to toppers?", a: "Partly. We analysed 14 real board transcripts from the last interview round and show what each board asked, paraphrased. The 150 practice questions are written by us in the same style, grouped by type." },
      { q: "Does it cover Hindi-medium candidates?", a: "The pack is in English. The method, the DAF worksheet and the question types apply to every candidate." },
      { q: "Is it a physical book?", a: "No. It's a 22-page PDF, delivered to your email instantly after payment. It's designed to print and write on." },
      { q: "What if it isn't useful?", a: "Write to hello@upscprepnotes.in within 7 days and we'll refund you in full." },
    ],
  },
  {
    // Staged for result day. Hidden from the store and not buyable while comingSoon is true.
    // To launch: create the product in Dodo, paste its id below, set comingSoon: false, upload the files (see docs).
    slug: "upsc-mains-2027-pack",
    dodoProductId: "pdt_0NrRYNg7NaZYsHSAjJciw",
    title: "UPSC Mains 2027 Pack",
    image: "/store/mains-2027-pack/page-1.jpg",
    images: [
      "/store/mains-2027-pack/page-1.jpg",
      "/store/mains-2027-pack/page-2.jpg",
      "/store/mains-2027-pack/page-3.jpg",
      "/store/mains-2027-pack/page-4.jpg",
      "/store/mains-2027-pack/page-5.jpg",
    ],
    tagline: "The marks a rank needs, and 471 past questions by theme",
    description: "Plan Mains 2027 from real numbers: the marks each rank needed, paper by paper, from 236 topper marksheets and UPSC's official CSE 2025 list, plus 471 past GS questions sorted by theme.",
    longDescription: [
      "Most Mains advice is opinion. This pack is numbers: what rank holders actually scored in every paper, and what UPSC actually asked.",
      "The Mains 2027 Playbook (43 pages) shows the written marks each rank band needed in CSE 2025 (all 958 recommended candidates), the target marksheet for a top-100 rank, where top rankers pull away (the optional, then Essay and GS I), what toppers with your optional scored, and every GS question from 2019 and 2021–2026 that scanned cleanly, 471 in all, sorted by theme with counts, and 54 essay topics.",
      "Then the work: a month-by-month plan to Mains 2027, weekly answer-writing targets, and a \"Where I stand\" worksheet you fill in after every mock.",
      "Also inside: the Topper Marks Spreadsheet (236 marksheets, sortable, with a sheet that calculates your gaps).",
    ],
    price: 499,
    originalPrice: null,
    rating: null,
    reviewCount: null,
    badge: "New",
    badgeColor: "amber",
    gradient: "bg-[#1f3fd6]",
    features: [
      "Marks each rank needed: official CSE 2025 totals of all 958 rank holders",
      "Target marksheet by rank band, from 236 complete topper marksheets",
      "471 past Mains GS questions (2019, 2021–2026), sorted by theme",
      "What toppers scored in your optional, for every common optional",
      "Plan to Mains 2027, weekly targets and a Where I stand worksheet",
      "Plus: the Topper Marks Spreadsheet with a gap calculator",
    ],
    category: "original",
    payNote: "UPSC Mains 2027 Pack",
    payAmount: 499,
    link: null,
    comingSoon: true,
    specs: [
      { label: "Playbook", value: "PDF, 43 pages" },
      { label: "Spreadsheet", value: "Excel, 236 marksheets + 958 CSE 2025 totals" },
      { label: "Past questions", value: "471, 2019 and 2021–2026" },
    ],
    sourceNote: "Original UPSCPrepNotes work. Totals are from UPSC's published marks of recommended candidates; paper-wise marks from toppers' published marksheets; questions from UPSC's official question papers.",
    highlights: [
      { label: "Real marks, not estimates", desc: "Every target comes from published marksheets and UPSC's own CSE 2025 list" },
      { label: "What UPSC asks", desc: "471 GS questions from seven papers, sorted by theme, so you study where the weight is" },
      { label: "Your gaps, calculated", desc: "Enter your mock marks in the spreadsheet and see the gap to the target for your rank band" },
    ],
    faqs: [
      { q: "Who is this for?", a: "Anyone writing Mains in 2027: first attempt, or after not making the final list this year. The targets and themes help you decide where your next hundred hours go." },
      { q: "Is the question bank complete?", a: "It has 471 GS questions from UPSC's official papers for 2019 and 2021–2026. A few that did not scan cleanly, mostly long GS IV case studies, are left out; the official papers are free on upsc.gov.in." },
      { q: "Is it a physical book?", a: "No. It's a set of PDFs and a spreadsheet, delivered to your email instantly after payment. The Playbook is designed to print and write on." },
      { q: "What if it isn't useful?", a: "Write to hello@upscprepnotes.in within 7 days and we'll refund you in full." },
    ],
  },

  {
    slug: "top-10-rankers-strategy",
    dodoProductId: "pdt_0NiRYsqj11mE2Xcw8A1nJ",
    title: "Top 10 Rankers Strategy",
    image: "https://ik.imagekit.io/impiclabs/products/top-10-rankers-strategy.png?tr=w-464,h-600,f-auto,q-80",
    images: [
      "https://ik.imagekit.io/impiclabs/products/top-10-rankers-strategy.png?tr=w-800,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/top-10-rankers-strategy-1.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/top-10-rankers-strategy-2.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/top-10-rankers-strategy-3.jpg?tr=w-1000,f-auto,q-80",
    ],
    tagline: "AIR 1-10 complete strategies in one PDF",
    description: "Full strategies, marks analysis, paper-by-paper breakdowns, and score deep dives for AIR 1 through AIR 10.",
    longDescription: [
      "This compilation brings together the complete preparation strategies of the top 10 rank holders from recent UPSC CSE cycles. Every strategy is distilled from their interviews and published content, paired with verified marks from official UPSC records.",
      "You get paper-wise marks analysis with visual score charts, a score deep dive showing strongest and weakest papers, and key observations that reveal what actually worked for each topper.",
      "The report is formatted as a branded PDF, ready to save, print, or read on any device.",
    ],
    price: 99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 24,
    badge: "Most Popular",
    badgeColor: "emerald",
    gradient: "from-purple-600 via-purple-500 to-indigo-500",
    features: [
      "Complete strategy distilled from interviews and published content",
      "Paper-wise marks analysis with visual score charts",
      "Score deep dive: strongest paper, weakest paper, contribution %",
      "Key takeaways from each topper's UPSC journey",
      "Branded PDF, ready to save or print",
    ],
    category: "original",
    payNote: "Top 10 Rankers Strategy Compilation",
    payAmount: 99,
    link: null,
    comingSoon: false,
    specs: [
      { label: "Format", value: "PDF" },
      { label: "Pages", value: "34" },
      { label: "Toppers Covered", value: "AIR 1-10" },
      { label: "Last Updated", value: "June 2025" },
    ],
    sourceNote: "Original UPSCPrepNotes compilation built from publicly reported scorecards, interviews and strategy write-ups.",
    highlights: [
      { label: "Verified Marks", desc: "Every score pulled from official UPSC result PDFs" },
      { label: "Paper-wise Analysis", desc: "See exactly which papers each topper scored highest in" },
      { label: "Key Takeaways", desc: "Distilled patterns — what worked across all 10 toppers" },
    ],
    faqs: [
      { q: "Which toppers are included?", a: "AIR 1 through AIR 10 from the latest UPSC CSE cycle — complete strategies, marks, and paper breakdowns." },
      { q: "Is this a physical book?", a: "No, it's a digital PDF. You get instant access after payment — download and keep forever." },
      { q: "How is this different from free strategy videos?", a: "We distill strategies into a structured, printable format with verified marks data — no filler, no 2-hour videos to skim through." },
    ],
    reviews: [
      { name: "Rahul S.", rating: 5, date: "May 2025", text: "The paper-wise marks analysis alone is worth ₹10,000. Shows exactly which papers to focus on.", verified: true },
      { name: "Priya M.", rating: 5, date: "May 2025", text: "Finally, strategies without generic advice. Each topper's actual approach with real numbers.", verified: true },
      { name: "Amit K.", rating: 4, date: "Apr 2025", text: "Good compilation. Wish it included more toppers beyond top 10, but the depth for each is excellent.", verified: true },
    ],
  },

  {
    slug: "answer-copies-compilation",
    dodoProductId: "pdt_0NiRYspHtFcNZIxO9Jyop",
    title: "Answer Copies Compilation",
    image: "https://ik.imagekit.io/impiclabs/products/answer-copies-compilation.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "50+ handwritten answer sheets",
    description: "Actual handwritten answer sheets from 50+ toppers (AIR 1-1249). GS1-4, Essay.",
    longDescription: [
      "This compilation contains actual scanned answer sheets written by UPSC toppers in the exam hall. See exactly how rank holders structured their answers, used headings, diagrams, and underlining to score 140+.",
      "Covers GS Papers 1-4 and Essay. Each copy is labelled with the topper's name, rank, year, and marks obtained.",
      "Organised by paper and marks so you can compare approaches across different scorers.",
    ],
    price: 199,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 31,
    badge: "Top Rated",
    badgeColor: "amber",
    gradient: "bg-amber-500",
    features: [
      "50+ actual handwritten answer sheets from toppers",
      "Covers GS1-4 and Essay",
      "Each copy labelled with name, rank, year, and marks",
      "See real handwriting, structure, underlining, and diagrams",
      "Organised by paper and marks for easy comparison",
    ],
    category: "original",
    payNote: "Answer Copies Compilation",
    payAmount: 199,
    link: null,
    comingSoon: false,
    specs: [
      { label: "Format", value: "Scanned PDFs" },
      { label: "Answer Sheets", value: "60+" },
      { label: "Papers Covered", value: "GS1-4 + Essay" },
      { label: "Total Size", value: "832 MB" },
    ],
    sourceNote: "Each file is a full answer booklet written by the topper named on it, reproduced exactly as submitted. 27 toppers, 63 booklets.",
    highlights: [
      { label: "Real Exam Hall Copies", desc: "Actual handwritten sheets — not typed reconstructions" },
      { label: "Marks Labelled", desc: "Each copy shows topper name, AIR, year, and marks obtained" },
      { label: "Compare Approaches", desc: "Organized by paper and marks so you can see what high vs medium scores look like" },
    ],
    faqs: [
      { q: "Are these actual topper answer sheets?", a: "Yes. These are real scanned answer sheets written by toppers in the exam hall — not recreated or typed versions." },
      { q: "Which papers are included?", a: "General Studies 1-4 and Essay. Each copy is labelled with the topper's name, rank, year, and marks obtained." },
      { q: "How large is the download?", a: "About 832 MB of scanned PDFs. Your download page lists every booklet separately so you can download one at a time on a phone — no need to pull the whole ZIP." },
    ],
    reviews: [
      { name: "Anupama G.", rating: 5, date: "Jun 2025", text: "An absolute game-changer for my answer writing practice. Seeing how toppers actually structure their answers in the exam hall is something no book can teach you.", verified: true },
      { name: "Nitin J.", rating: 5, date: "May 2025", text: "The diagrams, the flowchart usage, the underlining — you can't learn this from a coaching class. Worth every rupee.", verified: true },
      { name: "Ritu S.", rating: 5, date: "Apr 2025", text: "Comparing AIR 1's answers with AIR 500's answers side by side was the most insightful thing I've done for my prep.", verified: true },
    ],
  },

  {
    slug: "all-strategy-reports",
    dodoProductId: "pdt_0NjVzyc2byQLoEW4VzgZv",
    title: "All Strategy Reports",
    image: "https://ik.imagekit.io/impiclabs/products/all-strategy-reports.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "All 280+ topper strategies bundled",
    description: "Every topper's complete strategy, marks analysis, and paper breakdown in one bundle.",
    longDescription: [
      "Get access to every strategy report in the UPSCPrepNotes library. This bundle includes the complete strategy, marks analysis, and paper breakdown for each of the 280+ topper profiles on the platform.",
      "Every report is built from verified UPSC data and the topper's own interviews. You get paper-wise marks, score deep dives, and key observations for every rank holder.",
      "One payment, lifetime access. New topper profiles are added automatically as they are published.",
    ],
    price: 199,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 18,
    badge: "Best Value",
    badgeColor: "emerald",
    gradient: "bg-[#1f3fd6]",
    features: [
      "280+ complete strategy reports with marks analysis",
      "Paper-wise breakdowns and score deep dives for every topper",
      "One payment, lifetime access with automatic additions",
      "Branded PDF format, ready to save or print",
      "New reports added as new toppers are published",
    ],
    category: "original",
    payNote: "All Strategy Reports Bundle",
    payAmount: 199,
    link: null,
    comingSoon: true,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Reports", value: "280+" },
      { label: "Access", value: "Lifetime + Updates" },
      { label: "Last Updated", value: "June 2025" },
    ],
    sourceNote: "Compiled strategy reports from multiple sources, delivered as PDF.",
    highlights: [
      { label: "Every Topper", desc: "Complete strategy for all 271+ verified profiles — not just top 10" },
      { label: "Lifetime Access", desc: "New topper reports added automatically as UPSC publishes results" },
      { label: "Best Value", desc: "Works out to under ₹3 per topper strategy — can't get this anywhere else" },
    ],
    faqs: [
      { q: "How many reports are included?", a: "All 271+ verified topper strategy reports currently on the platform, plus every new report we publish — automatically." },
      { q: "What's the price per report?", a: "At ₹199 for 271+ reports, it works out to under ₹3 per topper strategy. Individual reports aren't sold separately." },
      { q: "Do I get future updates?", a: "Yes. When new UPSC results are published, new topper reports are added to your bundle automatically at no extra cost." },
    ],
    reviews: [
      { name: "Sneha R.", rating: 5, date: "Jun 2025", text: "This is the best ₹199 I've spent on UPSC prep. Having every topper's strategy in one place is incredible. The marks analysis for each is the killer feature.", verified: true },
      { name: "Vikram P.", rating: 5, date: "May 2025", text: "Bought the Top 10 first, then upgraded to this. Way better deal — you get 280+ for barely more. The lifetime updates sold me.", verified: true },
      { name: "Kavita N.", rating: 4, date: "May 2025", text: "Massive bundle. Some reports are more detailed than others but overall excellent value. The automatic updates are a great touch.", verified: true },
    ],
  },

  {
    slug: "government-schemes-compilation",
    dodoProductId: "pdt_0NiRYsuBZ0zyVvmW4gDKN",
    title: "Government Schemes Compilation",
    image: "https://ik.imagekit.io/impiclabs/products/government-schemes-compilation.png?tr=w-464,h-600,f-auto,q-80",
    images: [
      "https://ik.imagekit.io/impiclabs/products/government-schemes-compilation.png?tr=w-800,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/government-schemes-compilation-1.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/government-schemes-compilation-2.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/government-schemes-compilation-3.jpg?tr=w-1000,f-auto,q-80",
    ],
    tagline: "All important government schemes for UPSC 2026",
    description: "Comprehensive compilation of all central government schemes, categorized by ministry and sector.",
    longDescription: [
      "A complete compilation of all important government schemes relevant for UPSC CSE 2026. Each scheme is summarized with its objective, features, budget, and target beneficiaries.",
      "Organized by ministry and sector — education, health, agriculture, rural development, social welfare, and more.",
      "Ideal for both Prelims (scheme-based questions) and Mains (governance and social justice) preparation.",
    ],
    price: 49,
    originalPrice: null,
    badge: "Popular",
    badgeColor: "amber",
    gradient: "bg-rose-600",
    rating: 4.9,
    reviewCount: 15,
    features: [
      "All important schemes covered",
      "Organized by ministry and sector",
      "Objective, features, budget, beneficiaries",
      "Prelims and Mains focused",
      "Instant PDF download",
    ],
    category: "original",
    payNote: "Government Schemes Compilation",
    payAmount: 49,
    link: null,
    comingSoon: false,
    institute: "general",
    specs: [
      { label: "Format", value: "PDF" },
      { label: "Schemes", value: "200+" },
      { label: "Organized By", value: "Ministry & Sector" },
      { label: "Best For", value: "Prelims + Mains" },
    ],
    sourceNote: "Original UPSCPrepNotes compilation of central government schemes, organised by ministry.",
    highlights: [
      { label: "Objective + Features + Budget", desc: "Every scheme broken down with objective, features, budget, and target beneficiaries" },
      { label: "Ministry-wise Organized", desc: "Education, health, agriculture, rural development, social welfare — find any scheme fast" },
      { label: "Prelims & Mains Ready", desc: "Scheme-based Prelims questions + governance/social justice Mains answers" },
    ],
    faqs: [
      { q: "How many schemes are covered?", a: "200+ central government schemes relevant for UPSC CSE 2026, organized by ministry and sector." },
      { q: "Does it include budgets and beneficiaries?", a: "Yes. Each scheme includes objective, key features, budget allocation, and target beneficiaries." },
      { q: "Is this updated for 2026?", a: "Yes, it includes the latest schemes announced in the most recent budget and policy updates." },
    ],
    reviews: [
      { name: "Gaurav V.", rating: 5, date: "Jun 2025", text: "For Prelims GS, this is gold. Every scheme with its objective, features, and beneficiaries in one PDF. No more scrambling.", verified: true },
      { name: "Anjali M.", rating: 5, date: "May 2025", text: "Used this for Mains governance questions — the ministry-wise organization makes it so easy to cite specific schemes in answers.", verified: true },
      { name: "Sunil K.", rating: 4, date: "May 2025", text: "Good coverage. Wish it had state-specific schemes too, but for central schemes it's comprehensive.", verified: true },
    ],
  },
  {
    slug: "complete-gs-notes-bundle",
    dodoProductId: "pdt_0NiRYsxdN5boMQWsxQb4O",
    title: "Complete GS Notes Bundle",
    tagline: "81 files — all GS 1-4 + Prelims notes in one bundle",
    description: "Every GS notes bundle on the platform — GS 1, GS 2, GS 3, Ethics & GS 4, and Prelims Prep Pack — merged into one complete set.",
    longDescription: [
      "This is every notes bundle we offer, combined into one massive compilation. GS 1 (Art & Culture, History, Geography, Society), GS 2 (Polity, Governance, IR, Social Justice), GS 3 (Economy, Agriculture, Environment, S&T, Security), GS 4 (Ethics, case studies), and a full Prelims Prep Pack with high-yield subject notes.",
      "Features notes from Madhav (AIR 16), Asad Zuberi (AIR 86), Satyam Gandhi (AIR 82), Dr. Apala Mishra (AIR 9), PRAHAAR, Antriksh, Abhijit Ray, Lukman IAS, Gunjita, and more. Over 3 GB of curated, organized UPSC material.",
      "Instead of buying 5 separate bundles, get everything in one download at a fraction of the price.",
    ],
    price: 149,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 22,
    badge: "81 Files",
    badgeColor: "emerald",
    gradient: "from-indigo-600 via-purple-500 to-pink-500",
    images: [
      "https://ik.imagekit.io/impiclabs/products/gs1-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/gs2-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/gs3-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/ethics-gs4-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/prelims-prep-pack.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/complete-gs-notes-bundle-1.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/complete-gs-notes-bundle-2.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/complete-gs-notes-bundle-3.jpg?tr=w-1000,f-auto,q-80",
    ],
    features: [
      "81+ files spanning GS 1-4, Ethics, and Prelims — over 3 GB",
      "GS 1: Art & Culture, History, Geography, Society (22 files)",
      "GS 2: Polity, Governance, IR, Social Justice (17 files)",
      "GS 3: Economy, Agriculture, Environment, S&T, Security (19 files)",
      "GS 4: Ethics theory, case studies, human interface (13 files)",
      "Prelims: Abhijit Ray high-yield notes + Ancient History + Environment (10 files)",
      "Notes from AIR 9, AIR 10, AIR 16, AIR 82, AIR 86, and more",
      "Instant PDF download after purchase",
    ],
    category: "notes-bundle",
    payNote: "Complete GS Notes Bundle",
    payAmount: 149,
    link: null,
    comingSoon: false,
    image: "https://ik.imagekit.io/impiclabs/products/gs1-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
    fileCount: 81,
    totalSizeMB: 3069,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Files", value: "81" },
      { label: "Total Size", value: "3.2 GB" },
      { label: "Toppers Featured", value: "AIR 9, 16, 82, 86" },
    ],
    sourceNote: "Compiled from the topper notes and coaching material named above (Madhav AIR 16, Asad Zuberi AIR 86, Satyam Gandhi AIR 82, Dr Apala Mishra AIR 9, PRAHAAR, Antriksh, Abhijit Ray, Lukman IAS, Gunjita). Not affiliated with or endorsed by any coaching institute.",
    highlights: [
      { label: "5 Bundles in 1", desc: "GS1, GS2, GS3, GS4/Ethics, and Prelims Prep — all in one download" },
      { label: "Topper Notes", desc: "Actual notes from AIR 9, 16, 82, 86 — not coaching institute recycled content" },
      { label: "Massive Coverage", desc: "Art & Culture, History, Geography, Polity, Economy, Environment, Ethics — everything" },
    ],
    faqs: [
      { q: "What's included in the 81 files?", a: "GS1 (22 files: Art & Culture, History, Geography, Society), GS2 (17 files: Polity, Governance, IR), GS3 (19 files: Economy, Agriculture, Environment), GS4 (13 files: Ethics, case studies), and Prelims Pack (10 files)." },
      { q: "Whose notes are these?", a: "Notes from Madhav (AIR 16), Asad Zuberi (AIR 86), Satyam Gandhi (AIR 82), Dr. Apala Mishra (AIR 9), Abhijit Ray, Antriksh, Lukman IAS, and more." },
      { q: "How large is the download?", a: "About 3.2 GB of PDFs. Your download page lists every file separately — download them one at a time on Wi-Fi. The whole bundle as one ZIP is also available." },
    ],
    reviews: [
      { name: "Rajesh K.", rating: 5, date: "Jun 2025", text: "81 files for ₹149 is insane value. The notes from AIR 9 and AIR 16 alone are worth more than this. Covers all GS papers comprehensively.", verified: true },
      { name: "Swati P.", rating: 5, date: "May 2025", text: "Saves me from buying 5 separate bundles. The quality of topper notes is way better than coaching PDFs I've seen.", verified: true },
      { name: "Arjun M.", rating: 4, date: "May 2025", text: "Huge bundle, covers everything. Some notes are handwritten scans which can be hard to read but mostly clear. Great value overall.", verified: true },
    ],
  },
  {
    slug: "anthropology-bundle",
    dodoProductId: "pdt_0NiRYsvx8ApjyGrPDbdeW",
    title: "Anthropology Optional Bundle",
    tagline: "14 files — complete Anthropology coverage by Laghima Tiwari (AIR 176) & Dr. Apala Mishra (AIR 9)",
    description: "Comprehensive Anthropology optional notes with test papers by rank holders.",
    longDescription: [
      "Anthropology is one of the most popular UPSC optionals with high scoring potential. This bundle covers both Paper 1 and Paper 2.",
      "Includes detailed notes by Laghima Tiwari (AIR 176) covering the entire syllabus. Plus Dr. Apala Mishra (AIR 9) anthropology PDFs. And test papers for practice.",
      "Everything you need for a top Anthropology score in one bundle.",
    ],
    price: 99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 9,
    badge: "14 Files",
    badgeColor: "emerald",
    gradient: "bg-amber-800",
    features: [
      "14 files covering Paper 1 & Paper 2",
      "Notes by Laghima Tiwari (AIR 176) & Dr. Apala Mishra (AIR 9)",
      "Test papers for practice included",
      "Complete syllabus coverage",
      "Instant PDF download",
    ],
    category: "optional",
    payNote: "Anthropology Optional Bundle",
    payAmount: 99,
    link: null,
    comingSoon: false,
    image: "https://ik.imagekit.io/impiclabs/products/anthropology-bundle.png?tr=w-464,h-600,f-auto,q-80",
    images: [
      "https://ik.imagekit.io/impiclabs/products/anthropology-bundle.png?tr=w-800,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/anthropology-bundle-1.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/anthropology-bundle-2.jpg?tr=w-1000,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/anthropology-bundle-3.jpg?tr=w-1000,f-auto,q-80",
    ],
    fileCount: 14,
    totalSizeMB: 548,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Files", value: "14" },
      { label: "Total Size", value: "574 MB" },
      { label: "Toppers Featured", value: "AIR 9, 176" },
    ],
    sourceNote: "Notes and answer booklets by the toppers named in each file, reproduced as-is. Includes Dr Apala Mishra (AIR 9) and Laghima Tiwari (AIR 176).",
    highlights: [
      { label: "Paper 1 + Paper 2", desc: "Complete syllabus coverage for both Anthropology papers" },
      { label: "Topper Notes", desc: "Notes by Laghima Tiwari (AIR 176) and Dr. Apala Mishra (AIR 9)" },
      { label: "Test Papers Included", desc: "Practice papers to test your preparation level" },
    ],
    faqs: [
      { q: "Whose notes are included?", a: "Notes by Laghima Tiwari (AIR 176) covering the entire syllabus, plus Dr. Apala Mishra (AIR 9) anthropology PDFs, and test papers for practice." },
      { q: "Does this cover both papers?", a: "Yes, both Paper 1 (Physical Anthropology) and Paper 2 (Indian Anthropology / Socio-cultural) are covered." },
      { q: "Is Anthropology a good optional choice?", a: "Anthropology is one of the highest-scoring optionals with consistent results. Check our optional subject marks analysis page for data." },
    ],
    reviews: [
      { name: "Nandini R.", rating: 5, date: "Jun 2025", text: "Bought this for my optional prep. Dr. Apala Mishra's notes are incredibly detailed and well-organized. Worth way more than ₹99.", verified: true },
      { name: "Sachin V.", rating: 5, date: "May 2025", text: "Covers both papers completely. The test papers are a great bonus for self-evaluation.", verified: true },
      { name: "Meera J.", rating: 4, date: "May 2025", text: "Good notes from top toppers. Some files are large scans but the content quality makes up for it.", verified: true },
    ],
  },
  {
    slug: "vision-ias-mains-2026-test-series",
    dodoProductId: "pdt_0Nifrye66JW2lrrGyHeum",
    institute: "vision-ias",
    title: "Vision IAS Mains Test Series 2026",
    tagline: "10 full-length Mains tests — GS Paper 1-4 by Vision IAS",
    description: "Complete Vision IAS Mains 2026 test series with 10 full-length papers covering GS 1-4. Practice with the same test format used by thousands of UPSC aspirants.",
    image: "https://ik.imagekit.io/impiclabs/products/vision-ias-mains-test-series.png?tr=w-464,h-600,f-auto,q-80",
    images: [
      "https://ik.imagekit.io/impiclabs/products/vision-ias-mains-test-series-1.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/vision-ias-mains-test-series-2.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/previews/vision-ias-mains-test-series-3b.jpg?tr=w-1000,f-auto,q-80",
    ],
    longDescription: [
      "This is the complete Vision IAS Mains 2026 test series — 10 full-length tests designed to simulate the actual UPSC CSE Mains examination. Each test covers GS Papers 1 through 4 with questions structured exactly like the real exam.",
      "Vision IAS is one of India's most trusted test series providers for UPSC preparation. These tests help you build answer-writing speed, practice within time limits, and identify weak areas before the actual exam.",
      "All 10 tests are compiled into a single PDF bundle for easy download and offline practice.",
    ],
    price: 199,
    originalPrice: null,
    rating: null,
    reviewCount: null,
    badge: "New",
    badgeColor: "emerald",
    gradient: "from-blue-700 via-blue-600 to-sky-500",
    features: [
      "10 full-length Mains tests covering GS 1-4",
      "Questions structured like actual UPSC CSE Mains",
      "Ideal for answer-writing practice and time management",
      "Compiled into a single bundle for easy download",
      "Trusted test series — Vision IAS quality",
    ],
    category: "test-series",
    payNote: "Vision IAS Mains Test Series 2026",
    payAmount: 199,
    link: null,
    // Hidden: this resells Vision IAS's paid test papers. Not for sale until we have a licence or our own papers.
    comingSoon: true,
    fileCount: 10,
    totalSizeMB: 34,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Tests", value: "10" },
      { label: "Papers Covered", value: "GS 1-4" },
      { label: "Total Size", value: "35 MB" },
    ],
    sourceNote: "Test papers from the Vision IAS Mains 2026 series, all 10 tests, GS 1-4. Not affiliated with or endorsed by Vision IAS.",
    highlights: [
      { label: "10 Full Tests", desc: "Complete Vision IAS Mains test series — all 10 tests in one download" },
      { label: "GS 1-4 Coverage", desc: "Every test covers all 4 GS papers just like the real Mains" },
      { label: "Instant Download", desc: "One ZIP file with all 10 tests — download and start practicing immediately" },
    ],
    faqs: [
      { q: "How many tests are included?", a: "10 full-length Mains tests from the Vision IAS 2026 test series, covering GS Papers 1-4." },
      { q: "Are answer keys included?", a: "The PDFs contain the question papers. Answer keys may not be included — these are for practice and time management." },
      { q: "Is this the latest 2026 series?", a: "Yes, these are the Vision IAS Mains 2026 test papers." },
    ],
  },
];

export function getProductBySlug(slug: string): StoreProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByInstitute(instituteSlug: string): StoreProduct[] {
  return PRODUCTS.filter((p) => p.institute === instituteSlug && !p.comingSoon);
}

export function getInstituteBySlug(slug: string): Institute | undefined {
  return INSTITUTES.find((i) => i.slug === slug);
}
