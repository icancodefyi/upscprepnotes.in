export interface ProductFile {
  name: string;
  sizeMB: number;
}

export type ProductCategory = "original" | "notes-bundle" | "teacher-brand" | "test-series" | "optional";

export interface StoreProduct {
  slug: string;
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
    gradient: "bg-emerald-600",
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
];

export const PRODUCTS: StoreProduct[] = [
  {
    slug: "top-10-rankers-strategy",
    title: "Top 10 Rankers Strategy",
    image: "https://ik.imagekit.io/impiclabs/products/top-10-rankers-strategy.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "AIR 1-10 complete strategies in one PDF",
    description: "Full strategies, marks analysis, paper-by-paper breakdowns, and score deep dives for AIR 1 through AIR 10.",
    longDescription: [
      "This compilation brings together the complete preparation strategies of the top 10 rank holders from recent UPSC CSE cycles. Every strategy is distilled from their interviews and published content, paired with verified marks from official UPSC records.",
      "You get paper-wise marks analysis with visual score charts, a score deep dive showing strongest and weakest papers, and key observations that reveal what actually worked for each topper.",
      "The report is formatted as a branded PDF, ready to save, print, or read on any device.",
    ],
    price: 299,
    originalPrice: 990,
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
    payAmount: 299,
    link: null,
    comingSoon: false,
  },
  {
    slug: "all-strategy-reports",
    title: "All Strategy Reports",
    image: "https://ik.imagekit.io/impiclabs/products/all-strategy-reports.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "All 280+ topper strategies bundled",
    description: "Every topper's complete strategy, marks analysis, and paper breakdown in one bundle.",
    longDescription: [
      "Get access to every strategy report in the UPSCPrepNotes library. This bundle includes the complete strategy, marks analysis, and paper breakdown for each of the 280+ topper profiles on the platform.",
      "Every report is built from verified UPSC data and the topper's own interviews. You get paper-wise marks, score deep dives, and key observations for every rank holder.",
      "One payment, lifetime access. New topper profiles are added automatically as they are published.",
    ],
    price: 799,
    originalPrice: 27720,
    rating: 4.7,
    reviewCount: 18,
    badge: "Best Value",
    badgeColor: "emerald",
    gradient: "from-emerald-600 via-emerald-500 to-teal-500",
    features: [
      "280+ complete strategy reports with marks analysis",
      "Paper-wise breakdowns and score deep dives for every topper",
      "One payment, lifetime access with automatic additions",
      "Branded PDF format, ready to save or print",
      "New reports added as new toppers are published",
    ],
    category: "original",
    payNote: "All Strategy Reports Bundle",
    payAmount: 799,
    link: null,
    comingSoon: false,
  },
  {
    slug: "answer-copies-compilation",
    title: "Answer Copies Compilation",
    image: "https://ik.imagekit.io/impiclabs/products/answer-copies-compilation.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "50+ handwritten answer sheets",
    description: "Actual handwritten answer sheets from 50+ toppers (AIR 1-1249). GS1-4, Essay.",
    longDescription: [
      "This compilation contains actual scanned answer sheets written by UPSC toppers in the exam hall. See exactly how rank holders structured their answers, used headings, diagrams, and underlining to score 140+.",
      "Covers GS Papers 1-4 and Essay. Each copy is labelled with the topper's name, rank, year, and marks obtained.",
      "Organised by paper and marks so you can compare approaches across different scorers.",
    ],
    price: 799,
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
    payAmount: 799,
    link: null,
    comingSoon: false,
  },
  {
    slug: "places-in-news",
    title: "Places in News",
    image: "https://ik.imagekit.io/impiclabs/products/places-in-news.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "Complete Places in News compilation by Sudarshan Gurjar",
    description: "Comprehensive compilation of all places in news for UPSC — geography, current affairs, and map-based questions covered.",
    longDescription: [
      "Sudarshan Gurjar's 'Places in News' is a must-have compilation for every UPSC aspirant. It covers every geographic location that appeared in the news, organized by region and topic.",
      "Each entry includes the location's geographic significance, why it was in the news, and key facts relevant for Prelims and Mains.",
      "Perfect for revising map-based questions and geography current affairs in one go.",
    ],
    price: 99,
    originalPrice: null,
    rating: null,
    reviewCount: null,
    badge: "Bestseller",
    badgeColor: "amber",
    gradient: "bg-cyan-600",
    features: [
      "Complete Places in News compilation",
      "Organized by region and topic",
      "Key facts for Prelims and Mains",
      "Map-based question preparation",
      "Instant PDF download",
    ],
    category: "original",
    payNote: "Places in News by Sudarshan Gurjar",
    payAmount: 99,
    link: null,
    comingSoon: false,
    institute: "sudarshan-gurjar",
  },
  {
    slug: "government-schemes-compilation",
    title: "Government Schemes Compilation",
    image: "https://ik.imagekit.io/impiclabs/products/government-schemes-compilation.png?tr=w-464,h-600,f-auto,q-80",
    tagline: "All important government schemes for UPSC 2026",
    description: "Comprehensive compilation of all central government schemes, categorized by ministry and sector.",
    longDescription: [
      "A complete compilation of all important government schemes relevant for UPSC CSE 2026. Each scheme is summarized with its objective, features, budget, and target beneficiaries.",
      "Organized by ministry and sector — education, health, agriculture, rural development, social welfare, and more.",
      "Ideal for both Prelims (scheme-based questions) and Mains (governance and social justice) preparation.",
    ],
    price: 99,
    originalPrice: null,
    rating: null,
    reviewCount: null,
    badge: "Popular",
    badgeColor: "amber",
    gradient: "bg-rose-600",
    features: [
      "All important schemes covered",
      "Organized by ministry and sector",
      "Objective, features, budget, beneficiaries",
      "Prelims and Mains focused",
      "Instant PDF download",
    ],
    category: "original",
    payNote: "Government Schemes Compilation",
    payAmount: 99,
    link: null,
    comingSoon: false,
    institute: "general",
  },
  {
    slug: "complete-gs-notes-bundle",
    title: "Complete GS Notes Bundle",
    tagline: "81 files — all GS 1-4 + Prelims notes in one bundle",
    description: "Every GS notes bundle on the platform — GS 1, GS 2, GS 3, Ethics & GS 4, and Prelims Prep Pack — merged into one complete set.",
    longDescription: [
      "This is every notes bundle we offer, combined into one massive compilation. GS 1 (Art & Culture, History, Geography, Society), GS 2 (Polity, Governance, IR, Social Justice), GS 3 (Economy, Agriculture, Environment, S&T, Security), GS 4 (Ethics, case studies), and a full Prelims Prep Pack with high-yield subject notes.",
      "Features notes from Madhav (AIR 16), Asad Zuberi (AIR 86), Satyam Gandhi (AIR 82), Dr. Apala Mishra (AIR 9), PRAHAAR, Antriksh, Abhijit Ray, Lukman IAS, Gunjita, and more. Over 3 GB of curated, organized UPSC material.",
      "Instead of buying 5 separate bundles, get everything in one download at a fraction of the price.",
    ],
    price: 399,
    originalPrice: 945,
    rating: null,
    reviewCount: null,
    badge: "81 Files",
    badgeColor: "emerald",
    gradient: "from-indigo-600 via-purple-500 to-pink-500",
    images: [
      "https://ik.imagekit.io/impiclabs/products/gs1-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/gs2-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/gs3-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/ethics-gs4-bundle.png?tr=w-464,h-600,f-auto,q-80",
      "https://ik.imagekit.io/impiclabs/products/prelims-prep-pack.png?tr=w-464,h-600,f-auto,q-80",
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
    payAmount: 399,
    link: null,
    comingSoon: false,
    image: "https://ik.imagekit.io/impiclabs/products/gs1-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
    fileCount: 81,
    totalSizeMB: 3069,
  },
  {
    slug: "anthropology-bundle",
    title: "Anthropology Optional Bundle",
    tagline: "14 files — complete Anthropology coverage by Laghima Tiwari (AIR 176) & Dr. Apala Mishra (AIR 9)",
    description: "Comprehensive Anthropology optional notes with test papers by rank holders.",
    longDescription: [
      "Anthropology is one of the most popular UPSC optionals with high scoring potential. This bundle covers both Paper 1 and Paper 2.",
      "Includes detailed notes by Laghima Tiwari (AIR 176) covering the entire syllabus. Plus Dr. Apala Mishra (AIR 9) anthropology PDFs. And test papers for practice.",
      "Everything you need for a top Anthropology score in one bundle.",
    ],
    price: 299,
    originalPrice: 599,
    rating: null,
    reviewCount: null,
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
    payAmount: 299,
    link: null,
    comingSoon: false,
    image: "https://ik.imagekit.io/impiclabs/products/anthropology-bundle.png?tr=w-464,h-600,f-auto,q-80",
    fileCount: 14,
    totalSizeMB: 548,
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
