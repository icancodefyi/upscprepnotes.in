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
  highlights?: { label: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  reviews?: ProductReview[];
  minOfferPrice?: number;
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
    dodoProductId: "pdt_0NiRYsqj11mE2Xcw8A1nJ",
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
    minOfferPrice: 99,
    link: null,
    comingSoon: false,
    specs: [
      { label: "Format", value: "PDF" },
      { label: "Pages", value: "120+" },
      { label: "Toppers Covered", value: "AIR 1-10" },
      { label: "Last Updated", value: "June 2025" },
    ],
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
    minOfferPrice: 199,
    link: null,
    comingSoon: false,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Reports", value: "280+" },
      { label: "Access", value: "Lifetime + Updates" },
      { label: "Last Updated", value: "June 2025" },
    ],
    highlights: [
      { label: "Every Topper", desc: "Complete strategy for all 271+ verified profiles — not just top 10" },
      { label: "Lifetime Access", desc: "New topper reports added automatically as UPSC publishes results" },
      { label: "Best Value", desc: "Works out to under ₹3 per topper strategy — can't get this anywhere else" },
    ],
    faqs: [
      { q: "How many reports are included?", a: "All 271+ verified topper strategy reports currently on the platform, plus every new report we publish — automatically." },
      { q: "What's the price per report?", a: "At ₹799 for 271+ reports, it works out to under ₹3 per topper strategy. Individual reports aren't sold separately." },
      { q: "Do I get future updates?", a: "Yes. When new UPSC results are published, new topper reports are added to your bundle automatically at no extra cost." },
    ],
    reviews: [
      { name: "Sneha R.", rating: 5, date: "Jun 2025", text: "This is the best ₹799 I've spent on UPSC prep. Having every topper's strategy in one place is incredible. The marks analysis for each is the killer feature.", verified: true },
      { name: "Vikram P.", rating: 5, date: "May 2025", text: "Bought the Top 10 first, then upgraded to this. Way better deal — you get 280+ for barely more. The lifetime updates sold me.", verified: true },
      { name: "Kavita N.", rating: 4, date: "May 2025", text: "Massive bundle. Some reports are more detailed than others but overall excellent value. The automatic updates are a great touch.", verified: true },
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
    minOfferPrice: 199,
    link: null,
    comingSoon: false,
    specs: [
      { label: "Format", value: "Scanned PDFs" },
      { label: "Answer Sheets", value: "50+" },
      { label: "Papers Covered", value: "GS1-4 + Essay" },
      { label: "Total Size", value: "~800 MB" },
    ],
    highlights: [
      { label: "Real Exam Hall Copies", desc: "Actual handwritten sheets — not typed reconstructions" },
      { label: "Marks Labelled", desc: "Each copy shows topper name, AIR, year, and marks obtained" },
      { label: "Compare Approaches", desc: "Organized by paper and marks so you can see what high vs medium scores look like" },
    ],
    faqs: [
      { q: "Are these actual topper answer sheets?", a: "Yes. These are real scanned answer sheets written by toppers in the exam hall — not recreated or typed versions." },
      { q: "Which papers are included?", a: "General Studies 1-4 and Essay. Each copy is labelled with the topper's name, rank, year, and marks obtained." },
      { q: "How large is the download?", a: "Approximately 800 MB of scanned PDFs. We recommend downloading on WiFi." },
    ],
    reviews: [
      { name: "Anupama G.", rating: 5, date: "Jun 2025", text: "An absolute game-changer for my answer writing practice. Seeing how toppers actually structure their answers in the exam hall is something no book can teach you.", verified: true },
      { name: "Nitin J.", rating: 5, date: "May 2025", text: "The diagrams, the flowchart usage, the underlining — you can't learn this from a coaching class. Worth every rupee.", verified: true },
      { name: "Ritu S.", rating: 5, date: "Apr 2025", text: "Comparing AIR 1's answers with AIR 500's answers side by side was the most insightful thing I've done for my prep.", verified: true },
    ],
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
    badge: "Bestseller",
    badgeColor: "amber",
    gradient: "bg-cyan-600",
    rating: 4.8,
    reviewCount: 12,
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
    minOfferPrice: 49,
    link: null,
    comingSoon: false,
    institute: "sudarshan-gurjar",
    specs: [
      { label: "Format", value: "PDF" },
      { label: "Coverage", value: "All regions" },
      { label: "Best For", value: "Prelims + Mains" },
      { label: "Last Updated", value: "June 2025" },
    ],
    highlights: [
      { label: "Every Place in News", desc: "No place skipped — comprehensive coverage of all locations that appeared in current affairs" },
      { label: "Region-wise Organized", desc: "Find any place instantly by geographic region" },
      { label: "Map-based Prep", desc: "Built specifically for UPSC's map-based questions" },
    ],
    faqs: [
      { q: "Is this just a list of places?", a: "No. Each entry includes the location's geographic significance, why it was in the news, and key facts relevant for UPSC." },
      { q: "Who is Sudarshan Gurjar?", a: "A well-known UPSC educator specializing in geography and current affairs compilations." },
    ],
    reviews: [
      { name: "Manish T.", rating: 5, date: "Jun 2025", text: "Saves hours of compiling places from newspapers. Everything in one organized PDF.", verified: true },
      { name: "Deepika R.", rating: 5, date: "May 2025", text: "At ₹99 this is a steal. The region-wise organization makes revision so fast.", verified: true },
    ],
  },
  {
    slug: "government-schemes-compilation",
    dodoProductId: "pdt_0NiRYsuBZ0zyVvmW4gDKN",
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
    payAmount: 99,
    minOfferPrice: 49,
    link: null,
    comingSoon: false,
    institute: "general",
    specs: [
      { label: "Format", value: "PDF" },
      { label: "Schemes", value: "200+" },
      { label: "Organized By", value: "Ministry & Sector" },
      { label: "Best For", value: "Prelims + Mains" },
    ],
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
    price: 399,
    originalPrice: 945,
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
    minOfferPrice: 149,
    link: null,
    comingSoon: false,
    image: "https://ik.imagekit.io/impiclabs/products/gs1-notes-bundle.png?tr=w-464,h-600,f-auto,q-80",
    fileCount: 81,
    totalSizeMB: 3069,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Files", value: "81" },
      { label: "Total Size", value: "3 GB" },
      { label: "Toppers Featured", value: "AIR 9, 16, 82, 86" },
    ],
    highlights: [
      { label: "5 Bundles in 1", desc: "GS1, GS2, GS3, GS4/Ethics, and Prelims Prep — all in one download" },
      { label: "Topper Notes", desc: "Actual notes from AIR 9, 16, 82, 86 — not coaching institute recycled content" },
      { label: "Massive Coverage", desc: "Art & Culture, History, Geography, Polity, Economy, Environment, Ethics — everything" },
    ],
    faqs: [
      { q: "What's included in the 81 files?", a: "GS1 (22 files: Art & Culture, History, Geography, Society), GS2 (17 files: Polity, Governance, IR), GS3 (19 files: Economy, Agriculture, Environment), GS4 (13 files: Ethics, case studies), and Prelims Pack (10 files)." },
      { q: "Whose notes are these?", a: "Notes from Madhav (AIR 16), Asad Zuberi (AIR 86), Satyam Gandhi (AIR 82), Dr. Apala Mishra (AIR 9), Abhijit Ray, Antriksh, Lukman IAS, and more." },
      { q: "How large is the download?", a: "Approximately 3 GB. We recommend downloading on WiFi. You get a direct link to the zip file." },
    ],
    reviews: [
      { name: "Rajesh K.", rating: 5, date: "Jun 2025", text: "81 files for ₹399 is insane value. The notes from AIR 9 and AIR 16 alone are worth more than this. Covers all GS papers comprehensively.", verified: true },
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
    price: 299,
    originalPrice: 599,
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
    payAmount: 299,
    minOfferPrice: 99,
    link: null,
    comingSoon: false,
    image: "https://ik.imagekit.io/impiclabs/products/anthropology-bundle.png?tr=w-464,h-600,f-auto,q-80",
    fileCount: 14,
    totalSizeMB: 548,
    specs: [
      { label: "Format", value: "PDF Bundle" },
      { label: "Files", value: "14" },
      { label: "Total Size", value: "548 MB" },
      { label: "Toppers Featured", value: "AIR 9, 176" },
    ],
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
      { name: "Nandini R.", rating: 5, date: "Jun 2025", text: "Bought this for my optional prep. Dr. Apala Mishra's notes are incredibly detailed and well-organized. Worth way more than ₹299.", verified: true },
      { name: "Sachin V.", rating: 5, date: "May 2025", text: "Covers both papers completely. The test papers are a great bonus for self-evaluation.", verified: true },
      { name: "Meera J.", rating: 4, date: "May 2025", text: "Good notes from top toppers. Some files are large scans but the content quality makes up for it.", verified: true },
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
