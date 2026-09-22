"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import IndiaCommunityMap from "@/components/IndiaCommunityMap";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  FileText,
  TrendingUp,
  Bot,
  Sparkles,
  Menu,
  X,
  Download,
  Award,
  FileCheck2,
  ExternalLink,
  MapPin,
  Users,
  Radio,
  Database,
  ShieldCheck,
  Code,
  GraduationCap,
  Layers,
  Search,
} from "lucide-react";
import Image from "next/image";
import {
  AltruistMarquee,
  AltruistPurpose,
  AltruistCuratedStore,
  AltruistMainsBlueprints,
  AltruistGazetteRecords,
  AltruistTestimonials,
  AltruistOptionalBenchmarks,
  AltruistFaq,
  AltruistStarterPackLead,
  AltruistCommunityVoices,
  AltruistFooter,
} from "./AltruistSections";


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// Official Premier UPSC Institutes & Test Series Logos
const MARQUEE_ITEMS = [
  { name: "Vision IAS", src: "/images/logos/visionias.png", heightClass: "h-9 sm:h-11" },
  { name: "ForumIAS", src: "/images/logos/forumias.png", heightClass: "h-8 sm:h-10" },
  { name: "Vajiram & Ravi", src: "/images/logos/vajiram.svg", heightClass: "h-9 sm:h-11" },
  { name: "Next IAS", src: "/images/logos/nextias.svg", heightClass: "h-7 sm:h-9" },
  { name: "Drishti IAS", src: "/images/logos/drishti.png", heightClass: "h-11 sm:h-13" },
  { name: "InsightsIAS", src: "/images/logos/insights.png", heightClass: "h-8 sm:h-10" },
  { name: "Shankar IAS Academy", src: "/images/logos/shankarias.png", heightClass: "h-9 sm:h-11" },
  { name: "IASbaba", src: "/images/logos/iasbaba.png", heightClass: "h-9 sm:h-11" },
];

// Purpose Tabs (Academic Pillars) with Authentic UPSC Imagery
const PURPOSE_TABS = [
  {
    id: "gs-papers",
    label: "GS Papers 1–4",
    icon: BookOpen,
    quote: "Break down real scoring benchmarks from GS1 through GS4 Ethics with exact paper marks.",
    image: "/images/altruist/upsc_hero_academic.webp",
  },
  {
    id: "answer-copies",
    label: "Handwritten Copies",
    icon: FileText,
    quote: "Study topper intros, structured diagrams, and examiner margin remarks line by line.",
    image: "/images/toppers/ishita-kishore.jpg",
  },
  {
    id: "optional-analysis",
    label: "Optional Analysis",
    icon: TrendingUp,
    quote: "Compare average marks, scoring shifts, and topper papers across 37 recognized optionals.",
    image: "/images/altruist/upsc_hero_academy.webp",
  },
  {
    id: "ai-mentor",
    label: "AI Mentor & Strategy",
    icon: Bot,
    quote: "Ask targeted syllabus queries and compare preparation paths against verified rank-1 frameworks.",
    image: "/images/altruist/upsc_hero_altruist.webp",
  },
];

// Core Academic Portals & Verification Tools
const CORE_TOOLS = [
  {
    icon: Database,
    title: "Marks Database",
    badge: "280+ Marksheets",
    badgeTheme: "bg-[#FEF9EE] border-[#F7E7CD] text-[#7A4B13]",
    desc: "Paper-wise score breakdown for 271+ UPSC toppers. Compare scores across CSE 2021–2025 and optionals.",
    href: "/toppers/marks-database",
    cta: "Compare Scores",
  },
  {
    icon: FileText,
    title: "Handwritten Copies",
    badge: "50+ Uncut Copies",
    badgeTheme: "bg-[#EEF7F2] border-[#D2E7D9] text-[#1A4D32]",
    desc: "Authentic handwritten answer booklets evaluated by premier academies with examiner margin remarks.",
    href: "/toppers/toppers-copy-compilation",
    cta: "Browse Copies",
  },
  {
    icon: Bot,
    title: "Ask AI Mentor",
    badge: "20 Free Daily",
    badgeTheme: "bg-[#F5F2FC] border-[#DFD5F2] text-[#4D2882]",
    desc: "Vector-search intelligence trained on verified ranker strategies to answer targeted preparation queries.",
    href: "/ask",
    cta: "Try AI Mentor Free",
  },
  {
    icon: Sparkles,
    title: "Monthly Current Affairs",
    badge: "60 Topics / Mo",
    badgeTheme: "bg-[#FAF0EC] border-[#F6D7CF] text-[#82331F]",
    desc: "High-yield monthly current affairs distilled across 12 syllabus sections with Prelims & Mains relevance.",
    href: "/current-affairs",
    cta: "Read Compilations",
  },
  {
    icon: BookOpen,
    title: "Free Study Materials",
    badge: "2,700+ Free PDFs",
    badgeTheme: "bg-[#EEF7F2] border-[#D2E7D9] text-[#1A4D32]",
    desc: "Curated repository of test series questions, answer keys, subject notes, and government reports.",
    href: "/free-materials",
    cta: "Access Materials",
  },
  {
    icon: FileCheck2,
    title: "Previous Year Questions",
    badge: "10-Year Archive",
    badgeTheme: "bg-[#FEF9EE] border-[#F7E7CD] text-[#7A4B13]",
    desc: "PYQs organized by year, paper, and topic with trend analysis and topper answer structure patterns.",
    href: "/pyq",
    cta: "Explore PYQs",
  },
];

// Optional Subjects Pill Directory
const OPTIONAL_SUBJECTS = [
  { name: "PSIR", href: "/optional/psir", score: "★ 313 Record" },
  { name: "Anthropology", href: "/optional/anthropology", score: "298 Benchmark" },
  { name: "Sociology", href: "/optional/sociology", score: "Top GS-2 Pair" },
  { name: "Mathematics", href: "/optional/mathematics", score: "298 Technical" },
  { name: "Geography", href: "/optional/geography", score: "Map & Diagrams" },
  { name: "History", href: "/optional/history", score: "High Conversion" },
  { name: "Public Administration", href: "/optional/public-administration", score: "Governance" },
  { name: "Philosophy", href: "/optional/philosophy", score: "High Ethics Link" },
];

const YEARS = [2022, 2023, 2024, 2025];

// Strategy Guides & Paper Target Blueprints
const STRATEGY_GUIDES = [
  { title: "Score 130+ in GS1", desc: "Society, History & Geography topper-backed frameworks with real marks data.", href: "/content/how-to-score-130-plus-in-gs1", score: "130+", paper: "GS1" },
  { title: "Score 120+ in GS2", desc: "Polity, Governance & Social Justice — constitutional article frameworks.", href: "/content/how-to-score-120-plus-in-gs2", score: "120+", paper: "GS2" },
  { title: "Score 120+ in GS3", desc: "Economy, Agriculture & Security — data matrices and committee citations.", href: "/content/how-to-score-120-plus-in-gs3", score: "120+", paper: "GS3" },
  { title: "Score 100+ in GS4", desc: "Ethics & Case Studies — stakeholder analysis and administrative SOPs.", href: "/content/how-to-score-100-plus-in-gs4", score: "100+", paper: "GS4" },
  { title: "Score 300+ in PSIR", desc: "Political Science & IR — complete strategy with topper answer copies.", href: "/content/how-to-score-300-plus-in-psir-optional", score: "300+", paper: "PSIR" },
  { title: "Optional Subject Marks Analysis", desc: "Comprehensive scoring trend report across 37 optional subjects.", href: "/content/upsc-optional-subject-marks-analysis", score: "Analysis", paper: "All" },
];

// Curated Official Store Products (From Store Catalog)
const CURATED_PRODUCTS = [
  {
    slug: "top-10-rankers-strategy",
    title: "Top 10 Rankers Strategy",
    tagline: "AIR 1–10 complete strategies & marks deep dives in one PDF",
    price: 299,
    originalPrice: 990,
    badge: "Most Popular",
    badgeTheme: "bg-[#FEF9EE] border-[#F7E7CD] text-[#7A4B13]",
    image: "https://ik.imagekit.io/impiclabs/products/top-10-rankers-strategy.png?tr=w-464,h-600,f-auto,q-80",
    features: ["Paper-wise marks analysis", "Weakest vs strongest paper breakdown", "Interview insights"],
  },
  {
    slug: "answer-copies-compilation",
    title: "Answer Copies Compilation",
    tagline: "50+ actual handwritten answer sheets from rank holders (GS1–4, Essay)",
    price: 799,
    originalPrice: 1999,
    badge: "Top Rated",
    badgeTheme: "bg-[#EEF7F2] border-[#D2E7D9] text-[#1A4D32]",
    image: "https://ik.imagekit.io/impiclabs/products/answer-copies-compilation.png?tr=w-464,h-600,f-auto,q-80",
    features: ["50+ genuine exam hall booklets", "Examiner corrections & rubrics", "All 4 GS Papers + Essay"],
  },
  {
    slug: "government-schemes-compilation",
    title: "Government Schemes Compendium",
    tagline: "All ministry-wise schemes with objectives, budget, and key facts",
    price: 99,
    originalPrice: 199,
    badge: "Essential",
    badgeTheme: "bg-[#FAF0EC] border-[#F6D7CF] text-[#82331F]",
    image: "/images/altruist/starter_pack.webp",
    features: ["Organized by Ministry & Sector", "Prelims & Mains ready facts", "Updated for CSE 2025/2026"],
  },
  {
    slug: "all-strategy-reports",
    title: "All Strategy Reports Bundle",
    tagline: "Complete archive of paper-wise and optional strategy reports",
    price: 499,
    originalPrice: 1490,
    badge: "Best Value",
    badgeTheme: "bg-[#F5F2FC] border-[#DFD5F2] text-[#4D2882]",
    image: "/images/altruist/upsc_hero_academic.webp",
    features: ["GS1–4 Strategy Reports", "Optional scoring matrices", "Immediate PDF bundle"],
  },
];

// FAQs
const FAQS = [
  {
    q: "Where are the marksheets and answer copies sourced from?",
    a: "All marksheets are verified against official UPSC Gazette records and candidate roll numbers. Answer copies are sourced from candidate test submissions and institutional test-series evaluations from premier academies.",
  },
  {
    q: "Can I download handwritten answer sheets for my optional subject?",
    a: "Yes. We host evaluated answer copies for popular optionals including PSIR, Anthropology, Sociology, Geography, History, and Public Administration.",
  },
  {
    q: "Are the digital downloads instant?",
    a: "Yes. All digital compilations, answer copies, and sample dossiers are delivered instantly as high-resolution searchable PDFs.",
  },
  {
    q: "How frequently is the marksheet database updated?",
    a: "The archive is updated within 48 hours of every official UPSC CSE result declaration and marksheet notification by the Union Public Service Commission.",
  },
  {
    q: "Is there an AI mentor to help me analyze topper answers?",
    a: "Yes. Our AI Mentor assistant allows you to ask targeted syllabus questions, compare answer frameworks, and extract key case studies and diagrams directly from topper copies.",
  },
];

// Authentic Topper Profiles for Hero Showcase & Evaluated Dossiers
const HERO_TOPPERS = [
  {
    id: "ishita",
    name: "Ishita Kishore",
    badge: "AIR 1 · CSE 2022",
    rankNum: "AIR 01",
    year: "CSE 2022",
    initials: "IK",
    cadre: "IAS · Uttar Pradesh Cadre",
    photo: "/images/toppers/ishita-portrait.jpg",
    institute: "ForumIAS MGP",
    evaluatorLogo: "/images/logos/forumias.png",
    roll: "Roll No. 1910080460",
    testCode: "MGP Test 51061",
    paper: "GS Paper 1 (Society & Geography)",
    copyScanImage: "/images/toppers/ishita-kishore.jpg",
    total: "1,094 / 2,025",
    writtenTotal: "901",
    interviewTotal: "193",
    cutoffDelta: "+134 vs Cutoff (Top 0.01%)",
    downloads: "24,850",
    pages: "42 Pages",
    fileSize: "18.4 MB",
    optionalSubject: "PSIR",
    optionalScore: "313 / 500",
    optionalHighlight: "★ 313 in PSIR (5-Yr Record)",
    rankTheme: {
      badgeBg: "bg-[#FEF9EE]",
      badgeBorder: "border-[#F7E7CD]",
      badgeText: "text-[#7A4B13]",
      accent: "text-[#7A4B13]",
    },
    slug: "ishita-kishore-rank-1-2022",
    highlight: "Highest PSIR Optional score in 5 years (313/500). AIR 1 on 3rd attempt.",
    sampleQuestion: "Examine how rapid urbanization in peninsular India has exacerbated urban flash floods, and evaluate traditional micro-catchment harvesting as a sustainable resilience model.",
    evaluatorAnnotations: [
      { tag: "Structure (+3.5)", text: "Direct 3-tier subheadings with Article 21 & Sendai Framework cited in introduction." },
      { tag: "Visual Diagram (+3.0)", text: "Hand-drawn cross-section diagram of sponge-city drainage vs traditional Eri tanks." },
      { tag: "Policy Blueprint (+2.5)", text: "Integrated Mihir Shah Committee recommendations into concluding policy matrix." },
    ],
    evaluatorScore: "11.5 / 15",
    keyTakeaway: "Clear subheading hierarchy, structured 2-tier diagrams for geography, and constitutional articles quoted in every intro.",
    strategicQuote: "Don't write long narrative paragraphs. Break every 15-marker into 4 distinct dimensions: Constitutional, Socio-Economic, Environmental, and Administrative interventions.",
    marks: [
      { label: "Essay", val: "137", max: "250", pct: 55, tag: "Top 2%" },
      { label: "GS 1", val: "121", max: "250", pct: 48, tag: "Benchmark" },
      { label: "GS 2", val: "130", max: "250", pct: 52, tag: "Top 5" },
      { label: "GS 3", val: "88", max: "250", pct: 35, tag: "Balanced" },
      { label: "GS 4", val: "112", max: "250", pct: 45, tag: "High Ethics" },
      { label: "PSIR", val: "313", max: "500", pct: 63, tag: "★ 5-Yr Record" },
      { label: "Interview", val: "193", max: "275", pct: 70, tag: "Top Board" },
    ],
  },
  {
    id: "garima",
    name: "Garima Lohia",
    badge: "AIR 2 · CSE 2022",
    rankNum: "AIR 02",
    year: "CSE 2022",
    initials: "GL",
    cadre: "IAS · Bihar Cadre",
    photo: "/images/toppers/garima-portrait.jpg",
    institute: "ForumIAS MGP",
    evaluatorLogo: "/images/logos/forumias.png",
    roll: "Roll No. 1910102924",
    testCode: "MGP Test 51051",
    paper: "GS Paper 2 (Polity & Governance)",
    copyScanImage: "/images/toppers/garima-lohia.jpg",
    total: "1,063 / 2,025",
    writtenTotal: "876",
    interviewTotal: "187",
    cutoffDelta: "+103 vs Cutoff (Rank 2)",
    downloads: "19,420",
    pages: "38 Pages",
    fileSize: "16.2 MB",
    optionalSubject: "Commerce",
    optionalScore: "263 / 500",
    optionalHighlight: "★ 141 in Essay (Home Prep)",
    rankTheme: {
      badgeBg: "bg-[#F5F2FC]",
      badgeBorder: "border-[#DFD5F2]",
      badgeText: "text-[#4D2882]",
      accent: "text-[#4D2882]",
    },
    slug: "garima-lohia-rank-2-2022",
    highlight: "Scored 141 in Essay & 127 in GS2 purely through self-study at home in Buxar.",
    sampleQuestion: "Analyze how the Governor's discretionary authority under Article 163 impacts cooperative federalism during legislative deadlock, citing relevant Supreme Court precedents.",
    evaluatorAnnotations: [
      { tag: "Case Law (+3.5)", text: "Precise citation of S.R. Bommai (1994) & Nabam Rebia (2016) in active doctrine analysis." },
      { tag: "Commission Links (+3.0)", text: "Direct point-wise comparison of Sarkaria vs Punchhi commission recommendations." },
      { tag: "Judicial Restraint (+2.5)", text: "Clear normative conclusion distinguishing political convenience from constitutional morality." },
    ],
    evaluatorScore: "12.0 / 15",
    keyTakeaway: "Anecdotal essay openings, direct Committee recommendations (Punchhi, Sarkaria) in GS2, and crisp bullet-point summaries.",
    strategicQuote: "I prepared purely at home without classroom coaching. What mattered was solving test papers under strict timer and memorizing 40 landmark SC judgments.",
    marks: [
      { label: "Essay", val: "141", max: "250", pct: 56, tag: "★ Highest 2022" },
      { label: "GS 1", val: "110", max: "250", pct: 44, tag: "Structured" },
      { label: "GS 2", val: "127", max: "250", pct: 51, tag: "Top 1%" },
      { label: "GS 3", val: "92", max: "250", pct: 37, tag: "Data-Driven" },
      { label: "GS 4", val: "116", max: "250", pct: 46, tag: "Top 3%" },
      { label: "Commerce", val: "263", max: "500", pct: 53, tag: "Self-Prep" },
      { label: "Interview", val: "187", max: "275", pct: 68, tag: "Exceptional" },
    ],
  },
  {
    id: "divya",
    name: "Divya Tanwar",
    badge: "AIR 105 · CSE 2021",
    rankNum: "AIR 105",
    year: "CSE 2021",
    initials: "DT",
    cadre: "IPS / IAS · Haryana",
    photo: "/images/toppers/divya-portrait.jpg",
    institute: "Drishti IAS",
    evaluatorLogo: "/images/logos/drishti.png",
    roll: "Roll No. 0854715",
    testCode: "Mains Test 250",
    paper: "GS Paper 4 (Ethics & Cases)",
    copyScanImage: "/images/toppers/divya-tanwar.jpg",
    total: "994 / 2,025",
    writtenTotal: "815",
    interviewTotal: "179",
    cutoffDelta: "+34 vs Cutoff (1st Attempt)",
    downloads: "28,190",
    pages: "44 Pages",
    fileSize: "19.8 MB",
    optionalSubject: "Hindi Lit",
    optionalScore: "278 / 500",
    optionalHighlight: "★ Age 21, 1st Attempt (Hindi)",
    rankTheme: {
      badgeBg: "bg-[#EEF7F2]",
      badgeBorder: "border-[#D2E7D9]",
      badgeText: "text-[#1A4D32]",
      accent: "text-[#1A4D32]",
    },
    slug: "divya-tanwar-rank-105-2022",
    highlight: "Cracked UPSC at age 21 on first attempt from rural Mahendragarh, Haryana.",
    sampleQuestion: "प्रशासनिक निर्णय प्रक्रिया में भावनात्मक बुद्धिमत्ता (Emotional Intelligence) किस प्रकार सार्वजनिक हित और अंतरात्मा के संकट को साधने में सहायक सिद्ध होती है?",
    evaluatorAnnotations: [
      { tag: "Hindi Calligraphy (+3.5)", text: "Impeccable Hindi script structuring with distinct ethical matrix diagrams." },
      { tag: "Philosophical Depth (+3.0)", text: "Grounded quotes from Kabir, Gandhi, and modern civil service administrative dilemmas." },
      { tag: "Pragmatic Solution (+2.5)", text: "Constructed realistic 4-step administrative SOP addressing vulnerable tribal communities." },
    ],
    evaluatorScore: "11.5 / 15",
    keyTakeaway: "Exceptional Hindi calligraphy, balanced flowchart integration in GS answers, and concise quotes from classical Hindi poets.",
    strategicQuote: "Hindi medium is not a disadvantage if your answer presentation is clean, structured, and backed by authentic administrative case studies.",
    marks: [
      { label: "Essay", val: "131", max: "250", pct: 52, tag: "Hindi Top" },
      { label: "GS 1", val: "104", max: "250", pct: 42, tag: "High Flow" },
      { label: "GS 2", val: "115", max: "250", pct: 46, tag: "Precision" },
      { label: "GS 3", val: "90", max: "250", pct: 36, tag: "Balanced" },
      { label: "GS 4", val: "118", max: "250", pct: 47, tag: "Top Ethics" },
      { label: "Hindi Lit", val: "278", max: "500", pct: 56, tag: "★ Record" },
      { label: "Interview", val: "179", max: "275", pct: 65, tag: "1st Attempt" },
    ],
  },
  {
    id: "ayan",
    name: "Ayan Jain",
    badge: "AIR 16 · CSE 2023",
    rankNum: "AIR 16",
    year: "CSE 2023",
    initials: "AJ",
    cadre: "IAS · Madhya Pradesh Cadre",
    photo: "/images/toppers/ayan-portrait.jpg",
    institute: "Vision IAS",
    evaluatorLogo: "/images/logos/visionias.png",
    roll: "Roll No. 1040520",
    testCode: "Abhyas Test 2420",
    paper: "GS Paper 3 (Economy & Security)",
    copyScanImage: "/images/toppers/ayan-jain.jpg",
    total: "1,028 / 2,025",
    writtenTotal: "844",
    interviewTotal: "184",
    cutoffDelta: "+68 vs Cutoff (Top Engineering)",
    downloads: "14,310",
    pages: "36 Pages",
    fileSize: "15.7 MB",
    optionalSubject: "Maths",
    optionalScore: "298 / 500",
    optionalHighlight: "★ 298 in Maths (Top Rank)",
    rankTheme: {
      badgeBg: "bg-[#FAF0EC]",
      badgeBorder: "border-[#F6D7CF]",
      badgeText: "text-[#82331F]",
      accent: "text-[#82331F]",
    },
    slug: "ayan-jain-rank-16-2023",
    highlight: "Rank 16 in CSE 2023 with 298/500 in Mathematics Optional. Former IPS to IAS.",
    sampleQuestion: "Evaluate how unmanned aerial systems (drones) and cyber-kinetic warfare have reshaped border surveillance in difficult terrain like the Western Sector.",
    evaluatorAnnotations: [
      { tag: "Technical Depth (+3.5)", text: "Integrated Comprehensive Integrated Border Management System (CIBMS) technological blueprint." },
      { tag: "Threat Matrix (+3.0)", text: "Drawn 2x2 asymmetric warfare threat matrix linking radar surveillance with satellite data." },
      { tag: "Doctrinal Vision (+2.5)", text: "Cited Shekatkar Committee recommendations on theaterisation & modern electronic border warfare." },
    ],
    evaluatorScore: "12.5 / 15",
    keyTakeaway: "Mathematical precision in case study stakeholder matrices, ethical dilemma decision trees, and crisp analytical conclusions.",
    strategicQuote: "Bring engineering and mathematical precision into GS answers. Use tables, stakeholder impact matrices, and actionable timelines instead of long stories.",
    marks: [
      { label: "Essay", val: "128", max: "250", pct: 51, tag: "Structured" },
      { label: "GS 1", val: "114", max: "250", pct: 46, tag: "Analytical" },
      { label: "GS 2", val: "118", max: "250", pct: 47, tag: "Case Law" },
      { label: "GS 3", val: "96", max: "250", pct: 38, tag: "Scientific" },
      { label: "GS 4", val: "122", max: "250", pct: 49, tag: "Top 1% Ethics" },
      { label: "Maths", val: "298", max: "500", pct: 60, tag: "★ Record" },
      { label: "Interview", val: "184", max: "275", pct: 67, tag: "IPS to IAS" },
    ],
  },
];

// Interactive Bento Intelligence Datasets
const BENTO_TOPPERS = [
  {
    id: "ishita",
    name: "Ishita Kishore",
    rank: "AIR 1 · CSE 2022",
    cadre: "IAS · Uttar Pradesh Cadre",
    roll: "1910080460",
    total: 1094,
    maxTotal: 2025,
    written: 901,
    interview: 193,
    cutoffDelta: "+134 vs Cutoff",
    pct: 54.0,
    optional: "PSIR",
    optionalScore: 313,
    papers: [
      { code: "Essay", name: "Essay Paper", score: 137, max: 250, pct: 54.8 },
      { code: "GS 1", name: "Heritage & Geography", score: 121, max: 250, pct: 48.4 },
      { code: "GS 2", name: "Polity & Governance", score: 130, max: 250, pct: 52.0 },
      { code: "GS 3", name: "Economy & Security", score: 88, max: 250, pct: 35.2 },
      { code: "GS 4", name: "Ethics & Integrity", score: 112, max: 250, pct: 44.8 },
      { code: "PSIR", name: "Optional Record", score: 313, max: 500, pct: 62.6, highlight: true },
      { code: "Interview", name: "Personality Test", score: 193, max: 275, pct: 70.2 },
    ],
  },
  {
    id: "garima",
    name: "Garima Lohia",
    rank: "AIR 2 · CSE 2022",
    cadre: "IAS · Bihar Cadre",
    roll: "1509177810",
    total: 1063,
    maxTotal: 2025,
    written: 876,
    interview: 187,
    cutoffDelta: "+103 vs Cutoff",
    pct: 52.5,
    optional: "Commerce",
    optionalScore: 263,
    papers: [
      { code: "Essay", name: "Essay Paper", score: 134, max: 250, pct: 53.6 },
      { code: "GS 1", name: "Heritage & Geography", score: 118, max: 250, pct: 47.2 },
      { code: "GS 2", name: "Polity & Governance", score: 124, max: 250, pct: 49.6 },
      { code: "GS 3", name: "Economy & Security", score: 94, max: 250, pct: 37.6 },
      { code: "GS 4", name: "Ethics & Integrity", score: 119, max: 250, pct: 47.6 },
      { code: "Commerce", name: "Commerce & Accountancy", score: 263, max: 500, pct: 52.6 },
      { code: "Interview", name: "Personality Test", score: 187, max: 275, pct: 68.0 },
    ],
  },
  {
    id: "divya",
    name: "Divya Tanwar",
    rank: "AIR 105 · CSE 2022",
    cadre: "IPS · Haryana Cadre",
    roll: "0844781940",
    total: 994,
    maxTotal: 2025,
    written: 815,
    interview: 179,
    cutoffDelta: "+34 vs Cutoff",
    pct: 49.1,
    optional: "Hindi Lit",
    optionalScore: 278,
    papers: [
      { code: "Essay", name: "Essay Paper", score: 128, max: 250, pct: 51.2 },
      { code: "GS 1", name: "Heritage & Geography", score: 110, max: 250, pct: 44.0 },
      { code: "GS 2", name: "Polity & Governance", score: 116, max: 250, pct: 46.4 },
      { code: "GS 3", name: "Economy & Security", score: 82, max: 250, pct: 32.8 },
      { code: "GS 4", name: "Ethics & Integrity", score: 105, max: 250, pct: 42.0 },
      { code: "Hindi Lit", name: "Hindi Literature", score: 278, max: 500, pct: 55.6, highlight: true },
      { code: "Interview", name: "Personality Test", score: 179, max: 275, pct: 65.1 },
    ],
  },
  {
    id: "ayan",
    name: "Ayan Jain",
    rank: "AIR 16 · CSE 2023",
    cadre: "IAS · MP Cadre",
    roll: "0803719402",
    total: 1028,
    maxTotal: 2025,
    written: 844,
    interview: 184,
    cutoffDelta: "+68 vs Cutoff",
    pct: 50.8,
    optional: "Maths",
    optionalScore: 298,
    papers: [
      { code: "Essay", name: "Essay Paper", score: 132, max: 250, pct: 52.8 },
      { code: "GS 1", name: "Heritage & Geography", score: 114, max: 250, pct: 45.6 },
      { code: "GS 2", name: "Polity & Governance", score: 118, max: 250, pct: 47.2 },
      { code: "GS 3", name: "Economy & Security", score: 96, max: 250, pct: 38.4 },
      { code: "GS 4", name: "Ethics & Integrity", score: 122, max: 250, pct: 48.8, highlight: true },
      { code: "Maths", name: "Mathematics Record", score: 298, max: 500, pct: 59.6, highlight: true },
      { code: "Interview", name: "Personality Test", score: 184, max: 275, pct: 66.9 },
    ],
  },
];

const MENTOR_PRESETS = [
  {
    id: "ethics",
    tabLabel: "GS4 Ethics SOPs",
    query: "How do rankers structure a 15-marker GS4 ethics question?",
    response: "Rankers construct a 2×2 Stakeholder Impact Grid (Primary vs Secondary Stakeholders). They map ethical dilemmas using constitutional values (Art. 14, 21), cite thinkers like Rawls (Veil of Ignorance) or Kant, and provide an actionable 3-phase administrative SOP with concrete 30-day milestones.",
    citations: ["Rawlsian Veil of Ignorance", "ARC-2 Ethical Framework", "Nolan Principles of Public Life"],
  },
  {
    id: "anthro",
    tabLabel: "Anthro 290+ Scoring",
    query: "What specific structural details push Anthropology Paper 1 past 150 marks?",
    response: "Physical anthropology answers must feature hand-drawn fossil cranium line sketches (Homo erectus vs Neanderthal) alongside clear morphometric indices. Ground social theory in contemporary Indian tribal micro-ethnographies.",
    citations: ["Ember & Ember Ch. 11", "Xaxa Committee (2014)", "Verrier Elwin Tribal Policy"],
  },
  {
    id: "psir",
    tabLabel: "Ishita 313 PSIR",
    query: "What was Ishita Kishore's exact synthesis technique for PSIR Paper 1 Section A?",
    response: "Every western political thought concept was bridged directly into contemporary Indian democratic friction. E.g., Gramscian hegemony was mapped onto civil society autonomy, and Rawlsian justice was cited in affirmative action debates.",
    citations: ["Antonio Gramsci Quaderni", "Amartya Sen Idea of Justice", "Subrata Mitra Federal Model"],
  },
];

const SCRIPT_PREVIEWS = [
  {
    id: "gs1",
    author: "Ishita Kishore · AIR 01",
    paper: "GS Paper 1 (Society & Geography)",
    badge: "13.5 / 15",
    toggleLabel: "Flip to GS2 Polity",
    toggleTarget: "gs2",
    question: "Evaluate micro-catchment harvesting as a sustainable resilience model against urban flash floods.",
    examinerNote: "Strong 3-tier structure. Hand-drawn cross-section diagram of Eri tanks vs modern drainage adds +2.5 marks. NDMA guidelines properly integrated.",
    image: "/images/toppers/ishita-kishore.jpg",
  },
  {
    id: "gs2",
    author: "Garima Lohia · AIR 02",
    paper: "GS Paper 2 (Polity & Governance)",
    badge: "14.0 / 15",
    toggleLabel: "Flip to GS1 Geography",
    toggleTarget: "gs1",
    question: "Discuss the constitutional safeguards against arbitrary governor discretion under Article 163.",
    examinerNote: "Exceptional legal depth. Directly cited Shamsher Singh (1974), Nabam Rebia (2016), and Sarkaria Commission recommendations in tabular format.",
    image: "/images/toppers/garima-lohia.jpg",
  },
];

const OPTIONAL_BENCHMARKS = [
  {
    id: "psir",
    name: "PSIR",
    peak: "Peak: 313",
    topperScore: "313 / 500",
    topper: "Ishita Kishore (AIR 1)",
    tag: "PSIR Record",
    insight: "Quote classical Western & Indian political thinkers (Plato, Kautilya, Gramsci) in paper 1, ground Paper 2 in foreign policy whitepapers.",
  },
  {
    id: "anthro",
    name: "Anthropology",
    peak: "Peak: 298",
    topperScore: "298 / 500",
    topper: "Akshat Jain (AIR 2)",
    tag: "Anthro Top 0.1%",
    insight: "Physical anthropology answers require neat anatomical sketches. Paper 2 tribal studies require government committee citations (Xaxa Report).",
  },
  {
    id: "socio",
    name: "Sociology",
    peak: "Peak: 295",
    topperScore: "295 / 500",
    topper: "Shruti Sharma (AIR 1)",
    tag: "Sociology Peak",
    insight: "Integrate empirical sociological field studies (MN Srinivas, Andre Beteille) with contemporary demographic surveys and census trends.",
  },
  {
    id: "maths",
    name: "Mathematics",
    peak: "Peak: 298",
    topperScore: "298 / 500",
    topper: "Ayan Jain (AIR 16)",
    tag: "Maths Record",
    insight: "Unforgiving calculation precision required. Rankers solve entire 10-year question banks under strict 3-hour timed exam hall conditions.",
  },
];

const PYQ_THEMES = [
  {
    theme: "Polity & Governance",
    recurrence: "Very High",
    badgeTheme: "bg-[#FEF9EE] text-[#7A4B13] border-[#F7E7CD]",
    qCount: "420+ Questions",
    focus: "Judicial Review vs Due Process (Repeated 4x)",
  },
  {
    theme: "Modern History & Freedom Struggle",
    recurrence: "High",
    badgeTheme: "bg-[#EEF7F2] text-[#1A4D32] border-[#D2E7D9]",
    qCount: "310+ Questions",
    focus: "1940s Tribal Uprisings & Peasant Movements",
  },
  {
    theme: "Economy & Agriculture",
    recurrence: "Very High",
    badgeTheme: "bg-[#FEF9EE] text-[#7A4B13] border-[#F7E7CD]",
    qCount: "390+ Questions",
    focus: "Direct Benefit Transfer & Subsidies Restructuring",
  },
  {
    theme: "Internal Security & Defense",
    recurrence: "High",
    badgeTheme: "bg-[#F5F2FC] text-[#4D2882] border-[#DFD5F2]",
    qCount: "280+ Questions",
    focus: "Cyber-Kinetic Drone Warfare in Border Belts",
  },
  {
    theme: "Ethics & Integrity Case Studies",
    recurrence: "Critical",
    badgeTheme: "bg-[#FAF0EC] text-[#82331F] border-[#F6D7CF]",
    qCount: "340+ Questions",
    focus: "Public Land Encroachment & Administrative Discretion",
  },
];

export default function AltruistUPSCPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inspectingTopper, setInspectingTopper] = useState<typeof HERO_TOPPERS[0] | null>(null);
  const [activePurposeTab, setActivePurposeTab] = useState("gs-papers");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Interactive Bento Deck States
  const [activeBentoTopperId, setActiveBentoTopperId] = useState("ishita");
  const [activeMentorQueryId, setActiveMentorQueryId] = useState("ethics");
  const [activeScriptCopyId, setActiveScriptCopyId] = useState("gs1");
  const [activeOptionalId, setActiveOptionalId] = useState("psir");
  
  // Starter Pack Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadOptional, setLeadOptional] = useState("PSIR");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const currentTab = PURPOSE_TABS.find((t) => t.id === activePurposeTab) || PURPOSE_TABS[0];

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadLoading(true);
    setLeadError("");
    try {
      const res = await fetch("/api/hero-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: leadEmail,
          name: leadName,
          phone: leadPhone,
          optional: leadOptional,
          source: "landing_starter_pack",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setLeadError(data.error || "Failed to register. Please try again.");
        setLeadLoading(false);
        return;
      }
      setFormSubmitted(true);
      setLeadLoading(false);
    } catch {
      setLeadError("Network error. Please try again.");
      setLeadLoading(false);
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden bg-white text-[#000000] selection:bg-[#EAEAEA] selection:text-black ${plusJakartaSans.className}`}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION (Exact 1:1 Altruist Chassis: max-w-[880px], #FFFFFC, Inset Shadow)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed top-4 md:top-[25px] left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[880px]">
          <nav
            className="w-full rounded-[15px] border border-black/5 bg-white px-3.5 py-2 sm:px-5 sm:py-2.5 transition-all duration-200"
            style={{
              boxShadow: "inset 0px 0px 14px 0px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="flex items-center justify-between">
              {/* Brand Logo Wordmark: Exact Altruist Clean Typography */}
              <div className="flex items-center pl-1 sm:pl-2">
                <Link
                  href="/"
                  className="whitespace-nowrap text-[18px] sm:text-[19px] font-bold tracking-tight text-black transition hover:opacity-80"
                >
                 <Image
  src="/logo.png"
  alt="Altruist Wordmark Logo"
  width={180}
  height={42}
  className="h-[42px] w-auto sm:h-[46px]"
/>

                </Link>
              </div>

              {/* Right Group: Links + CTA Button (Matches Altruist right-aligned navigation cluster) */}
              <div className="flex items-center gap-5 lg:gap-7">
                {/* Desktop Navigation (visible on desktop) */}
                <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-[14px] font-semibold text-black/65">
                  <Link
                    href="/toppers"
                    className="whitespace-nowrap transition-colors hover:text-black"
                  >
                    Toppers
                  </Link>
                  <a
                    href="#topper-showcase"
                    className="whitespace-nowrap transition-colors hover:text-black"
                  >
                    Answer Copies
                  </a>
                  <Link
                    href="/free-materials"
                    className="whitespace-nowrap transition-colors hover:text-black"
                  >
                    Materials
                  </Link>
                  <Link
                    href="/current-affairs"
                    className="whitespace-nowrap transition-colors hover:text-black"
                  >
                    Current Affairs
                  </Link>
                  <Link
                    href="/pyq"
                    className="whitespace-nowrap transition-colors hover:text-black"
                  >
                    PYQs
                  </Link>
                  <Link
                    href="/ask"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-[#4D2882] bg-[#F5F2FC] border border-[#DFD5F2] px-2.5 py-1 rounded-full text-[13px] transition hover:bg-[#EDE7F6]"
                  >
                    <Sparkles size={13} />
                    <span>Ask AI</span>
                  </Link>
                </div>

                {/* Right Action: Altruist CTA button on desktop, Mobile Hamburger on smaller screens */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/store"
                    className="hidden lg:flex h-[40px] items-center justify-center rounded-[10px] bg-black px-5 text-[14px] font-semibold text-white whitespace-nowrap transition hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    Explore Store
                  </Link>

                  {/* Mobile Menu Hamburger (Altruist 3-bar style, visible below lg) */}
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-black transition hover:bg-black/5 lg:hidden"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? (
                      <X size={20} className="text-black" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-[4px] w-5">
                        <span className="h-[2px] w-5 rounded-full bg-black" />
                        <span className="h-[2px] w-5 rounded-full bg-black" />
                        <span className="h-[2px] w-5 rounded-full bg-black" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Dropdown (Altruist styling expanding inside card) */}
            {mobileMenuOpen && (
              <div className="mt-3 flex flex-col gap-1 border-t border-black/5 pt-3 lg:hidden animate-in fade-in duration-150">
                <Link
                  href="/toppers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-black"
                >
                  Toppers Marksheets
                </Link>
                <a
                  href="#topper-showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-black"
                >
                  Evaluated Answer Copies
                </a>
                <Link
                  href="/free-materials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-black"
                >
                  Free Materials & Test Series
                </Link>
                <Link
                  href="/current-affairs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-black"
                >
                  Current Affairs Hub
                </Link>
                <Link
                  href="/pyq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black/80 transition hover:bg-black/5 hover:text-black"
                >
                  PYQs (2022–2025)
                </Link>
                <Link
                  href="/ask"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[14px] font-semibold text-black transition hover:bg-black/5"
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Ask AI Mentor</span>
                  </div>
                  <span className="rounded-[4px] bg-black px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
                </Link>
                <div className="pt-2 border-t border-black/5 mt-1">
                  <Link
                    href="/store"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-[42px] w-full items-center justify-center rounded-[10px] bg-black text-[14px] font-semibold text-white shadow-xs transition hover:bg-neutral-800"
                  >
                    Explore Store
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Uncluttered, Majestic LBSNAA Academy Background)
      ───────────────────────────────────────────────────────────── */}
      <div className="px-2.5 pt-2.5 sm:px-3 sm:pt-3">
        <main
          id="hero"
          className="relative isolate flex min-h-[640px] max-h-[860px] h-[90vh] w-full flex-col items-center justify-between overflow-hidden rounded-[16px] px-4 pt-20 pb-12 sm:px-12 sm:pt-28 sm:pb-16 text-center"
        >
          {/* Hero Background Image: Historic LBSNAA Academy Campus at Golden Hour */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[16px]">
            <picture>
              <source srcSet="/images/altruist/upsc_hero_academy.webp" type="image/webp" />
              <img
                src="/images/altruist/upsc_hero_academy.jpg"
                alt="LBSNAA Mussoorie Academy campus against Himalayas"
                loading="eager"
                decoding="sync"
                className="h-full w-full object-cover object-center"
              />
            </picture>
            {/* Altruist gradient overlay: calibrated for high contrast and razor-sharp text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
            {/* Subtle radial scrim behind central text */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,transparent_75%)]" />
          </div>

          {/* Centered Straight Heading & Value Proposition (Airy & Uncluttered) */}
          <div className="relative z-10 mx-auto my-auto flex max-w-4xl flex-col items-center justify-center text-center px-2 sm:px-4">
            <h1 className="text-[25px] xs:text-[28px] sm:text-5xl md:text-[64px] font-extrabold tracking-tight text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.5)] sm:leading-[1.15]">
              <span className="block">Every mark. Every topper.</span>
              <span className="mt-2 block sm:mt-3">
                Decoded with{" "}
                <span className="inline-flex items-center rounded-[12px] sm:rounded-[18px] bg-[#FEF9EE] px-3.5 py-0.5 sm:px-6 sm:py-1 text-[#7A4B13] border border-[#F7E7CD] shadow-2xl align-middle font-extrabold whitespace-nowrap ml-1 sm:ml-2">
                  zero fluff.
                </span>
              </span>
            </h1>

            <p className="mx-auto mt-4 sm:mt-5 max-w-xl text-[14px] sm:text-base md:text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
              280+ verified marksheet breakdowns and authentic evaluated answer copies. Organized in one searchable archive for serious civil services aspirants.
            </p>
          </div>

          {/* Bottom CTA Button & Social Proof (Clean & Spacious) */}
          <div className="relative z-10 mx-auto flex flex-col items-center gap-3.5 sm:gap-4 pb-2 sm:pb-4">
            <div className="flex flex-col items-center gap-3">
              <a
                href="#topper-showcase"
                className="flex h-[48px] sm:h-[50px] items-center justify-center rounded-[12px] bg-black px-7 sm:px-8 text-sm sm:text-base font-semibold text-white shadow-xl transition hover:bg-neutral-800 active:scale-[0.98]"
              >
                Explore Marksheets Database
              </a>

              {/* Topper Proof Chip with Local Avatars */}
              <div className="flex max-w-[95vw] sm:max-w-none items-center gap-2.5 sm:gap-3 rounded-full bg-white/95 px-3.5 sm:px-4 py-1.5 shadow-md backdrop-blur-xs">
                <div className="flex -space-x-2 shrink-0">
                  <img
                    src="/images/altruist/avatar_1.jpg"
                    alt="Topper Avatar"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="/images/altruist/avatar_2.jpg"
                    alt="Topper Avatar"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="/images/altruist/avatar_3.jpg"
                    alt="Topper Avatar"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="/images/altruist/avatar_4.jpg"
                    alt="Topper Avatar"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-black whitespace-nowrap">
                  <span className="inline sm:hidden">280+ Marksheets Indexed · Verified</span>
                  <span className="hidden sm:inline">280+ Official Marksheets Indexed · Gazette Verified</span>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. EXACT ALTRUIST SECTIONS (DERIVED DIRECTLY FROM EXTRACTION)
      ───────────────────────────────────────────────────────────── */}
      <div className="framer-pOLR9 framer-0EsbE framer-pqx4O framer-AB6d5 framer-xhscK framer-8ZgQf framer-7Em8r framer-hXo03 framer-jVAG2 framer-72rtr7" style={{ width: "100%", position: "relative", overflow: "hidden" }}>
        <AltruistMarquee />
        <AltruistPurpose />
        <AltruistCuratedStore />
        <AltruistMainsBlueprints />
        <AltruistGazetteRecords />
        <AltruistTestimonials />
        <AltruistOptionalBenchmarks />
        <AltruistFaq />
        <AltruistStarterPackLead />
        <AltruistCommunityVoices />
      </div>
      <AltruistFooter />
    </div>
  );
}
