"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  ArrowUpRight,
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
} from "lucide-react";

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

// Purpose Tabs (Academic Pillars)
const PURPOSE_TABS = [
  {
    id: "gs-papers",
    label: "GS Papers 1–4",
    icon: BookOpen,
    quote: "Break down real scoring benchmarks from GS1 through GS4 Ethics with exact paper marks.",
    image: "/images/altruist/purpose_edu.webp",
  },
  {
    id: "answer-copies",
    label: "Handwritten Copies",
    icon: FileText,
    quote: "Study topper intros, structured diagrams, and examiner margin remarks line by line.",
    image: "/images/altruist/purpose_water.webp",
  },
  {
    id: "optional-analysis",
    label: "Optional Analysis",
    icon: TrendingUp,
    quote: "Compare average marks, scoring shifts, and topper papers across 37 recognized optionals.",
    image: "/images/altruist/purpose_house.webp",
  },
  {
    id: "ai-mentor",
    label: "AI Mentor & Strategy",
    icon: Bot,
    quote: "Ask targeted syllabus queries and compare preparation paths against verified rank-1 frameworks.",
    image: "/images/altruist/purpose_med.webp",
  },
];

// Featured Topper Dossiers (Ongoing Projects Layout)
const FEATURED_DOSSIERS = [
  {
    title: "Aditya Srivastava",
    rank: "AIR 01 · CSE 2023",
    scoreBadge: "1099 Marks",
    details: "Electrical Engg · Highest GS4 in CSE History (143/250)",
    slug: "/toppers/aditya-srivastava-air-1",
    image: "/images/altruist/project_1.png",
  },
  {
    title: "Donuru Ananya Reddy",
    rank: "AIR 03 · CSE 2023",
    scoreBadge: "1065 Marks",
    details: "Anthropology · 298/500 Optional on First Attempt",
    slug: "/toppers/donuru-ananya-reddy-air-3",
    image: "/images/altruist/project_2.png",
  },
  {
    title: "Animesh Pradhan",
    rank: "AIR 02 · CSE 2023",
    scoreBadge: "1067 Marks",
    details: "Sociology · Top Scorer in GS-2 (118) & Essay (128)",
    slug: "/toppers/animesh-pradhan-air-2",
    image: "/images/altruist/project_3.png",
  },
];

// Mission 2026 Goals
const MISSION_GOALS = [
  {
    badge: "280+ Marksheets Indexed in 2025",
    title: "Index 500+ Official Marksheets",
    desc: "Complete paper-by-paper score history across CSE 2021–2025, enabling transparent cut-off and scoring trend comparisons with zero guesswork.",
    img1: "/images/altruist/purpose_house.webp",
    img2: "/images/altruist/purpose_water.webp",
  },
  {
    badge: "50+ Copies Evaluated in 2025",
    title: "Curate 100+ Handwritten Answer Copies",
    desc: "Handwritten tests with original examiner rubrics, corrections, and margin comments from VisionIAS and ForumIAS test series.",
    img1: "/images/altruist/goal_bhu.webp",
    img2: "/images/altruist/goal_answ.webp",
  },
  {
    badge: "37 Optionals Mapped in 2025",
    title: "Complete Optional Subject Intelligence",
    desc: "Historical score variance, scaling data, and topper strategy notes for every recognized UPSC optional subject to calibrate your preparation.",
    img1: "/images/altruist/goal_kgma.webp",
    img2: "/images/altruist/goal_zqh.webp",
  },
];

// Aspirant Testimonials
const TESTIMONIALS = [
  {
    quote:
      "Comparing Aditya Srivastava's GS4 answers with my own test copies completely changed how I approach stakeholder dilemmas. The paper-wise score breakdown is something no coaching institute provides.",
    author: "Rank 48 Candidate",
    location: "New Delhi",
    avatar: "/images/altruist/test_1.png",
  },
  {
    quote:
      "The optional subject score distribution saved me from making the wrong choice. Seeing real marksheets with 290+ scores showed me exactly what depth of syllabus coverage was required.",
    author: "Mains 2024 Candidate",
    location: "Bengaluru",
    avatar: "/images/altruist/test_2.png",
  },
  {
    quote:
      "UPSCPrepNotes eliminates 90% of the noise on Telegram and YouTube. You get the raw marksheets, real evaluated copies, and factual marks without coaching marketing.",
    author: "First Attempt Aspirant",
    location: "Pune",
    avatar: "/images/altruist/test_3.png",
  },
];

// Notes from the Community (Aspirant Voice Cards)
const COMMUNITY_NOTES = [
  {
    quote:
      "Finding verified marksheet breakdowns for GS1, GS2, GS3, and GS4 in one single place saved me weeks of frantic searching across Telegram channels.",
    from: "From New Delhi (Karol Bagh)",
  },
  {
    quote:
      "The evaluated handwritten answer copies showed me how toppers structure 15-marker questions under real 3-hour exam conditions.",
    from: "From Bengaluru",
  },
  {
    quote:
      "Seeing the exact interview marks compared to written mains scores gives a realistic perspective on how much cushion you need in written papers.",
    from: "From Hyderabad",
  },
  {
    quote:
      "The Anthropology optional score matrix helped me understand why topper scores range between 290 and 310, and how syllabus coverage impacts marks.",
    from: "From Pune",
  },
  {
    quote:
      "Zero coaching promotion, zero clickbait. Just clean official data and topper answer sheets organized with high academic quality.",
    from: "From Patna",
  },
  {
    quote:
      "The AI Mentor helped me cross-reference ethics case studies with Supreme Court judgments cited in actual AIR 1 answer sheets.",
    from: "From Jaipur",
  },
  {
    quote:
      "Instant PDF downloads with high-resolution handwritten copies. I keep them open side by side while writing my weekly test series.",
    from: "From Lucknow",
  },
];

// Compilations & Releases (Schedule Layout)
const COMPILATIONS = [
  {
    date: "Mon, Sep 22",
    title: "CSE 2024 Topper Marksheet Dossier (Complete 280+ Profiles)",
    tag: "Instant PDF",
    image: "/images/altruist/purpose_med.webp",
  },
  {
    date: "Sat, Oct 05",
    title: "GS-4 Ethics Case Studies & Frameworks Compendium",
    tag: "140+ Pages",
    image: "/images/altruist/event_1.webp",
  },
  {
    date: "Wed, Oct 15",
    title: "VisionIAS Prelims 2026 Test Series 1–10 Archive",
    tag: "Full Keys",
    image: "/images/altruist/event_2.webp",
  },
  {
    date: "Wed, Oct 22",
    title: "ForumIAS Mains 2025 Evaluated Copies Compendium",
    tag: "50+ Tests",
    image: "/images/altruist/event_3.webp",
  },
  {
    date: "Sun, Nov 02",
    title: "37 Optional Subjects Score Trend Report 2021–2025",
    tag: "Verified Data",
    image: "/images/altruist/event_4.webp",
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
    institute: "ForumIAS MGP",
    evaluatorLogo: "/images/logos/forumias.png",
    roll: "Roll No. 1910080460",
    testCode: "Test Code: 51061",
    paper: "GS Paper 1 · Full Length Test",
    image: "/images/toppers/ishita-kishore.jpg",
    total: "1,094 / 2,025",
    writtenTotal: "901",
    interviewTotal: "193",
    downloads: "24,850",
    pages: "42 Pages",
    fileSize: "18.4 MB",
    optionalSubject: "PSIR",
    highlight: "Highest PSIR Optional score in 5 years (313/500). AIR 1 on 3rd attempt.",
    keyTakeaway: "Clear subheading hierarchy, structured 2-tier diagrams for geography, and constitutional articles quoted in every intro.",
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
    institute: "ForumIAS MGP",
    evaluatorLogo: "/images/logos/forumias.png",
    roll: "Roll No. 1910102924",
    testCode: "Test Code: 51051",
    paper: "GS Paper 2 & Essay",
    image: "/images/toppers/garima-lohia.jpg",
    total: "1,063 / 2,025",
    writtenTotal: "876",
    interviewTotal: "187",
    downloads: "19,420",
    pages: "38 Pages",
    fileSize: "16.2 MB",
    optionalSubject: "Commerce",
    highlight: "Scored 141 in Essay & 127 in GS2 purely through self-study at home in Buxar.",
    keyTakeaway: "Anecdotal essay openings, direct Committee recommendations (Punchhi, Sarkaria) in GS2, and crisp bullet-point summaries.",
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
    institute: "Drishti IAS",
    evaluatorLogo: "/images/logos/drishti.png",
    roll: "Roll No. 0854715",
    testCode: "Test Code: 250",
    paper: "Samanya Adhyayan (Hindi Medium)",
    image: "/images/toppers/divya-tanwar.jpg",
    total: "994 / 2025",
    writtenTotal: "815",
    interviewTotal: "179",
    downloads: "28,190",
    pages: "44 Pages",
    fileSize: "19.8 MB",
    optionalSubject: "Hindi Literature",
    highlight: "Cracked UPSC at age 21 on first attempt from rural Mahendragarh, Haryana.",
    keyTakeaway: "Exceptional Hindi calligraphy, balanced flowchart integration in GS answers, and concise quotes from classical Hindi poets.",
    marks: [
      { label: "Evaluated", val: "120.5", max: "250", pct: 48, tag: "Top Test" },
      { label: "Essay", val: "131", max: "250", pct: 52, tag: "Hindi Benchmark" },
      { label: "GS 1", val: "104", max: "250", pct: 42, tag: "High Flow" },
      { label: "GS 2", val: "115", max: "250", pct: 46, tag: "Precision" },
      { label: "GS 4", val: "118", max: "250", pct: 47, tag: "Top Ethics" },
      { label: "Hindi Lit", val: "278", max: "500", pct: 56, tag: "★ Record Score" },
      { label: "Interview", val: "179", max: "275", pct: 65, tag: "1st Attempt" },
    ],
  },
  {
    id: "ayan",
    name: "Ayan Jain",
    badge: "AIR 16 · CSE 2023",
    rankNum: "AIR 16",
    year: "CSE 2023",
    institute: "Vision IAS",
    evaluatorLogo: "/images/logos/visionias.png",
    roll: "Registration 1040520",
    testCode: "Test Code: 2420",
    paper: "GS Paper 4 Ethics & Case Studies",
    image: "/images/toppers/ayan-jain.jpg",
    total: "1,028 / 2025",
    writtenTotal: "844",
    interviewTotal: "184",
    downloads: "14,310",
    pages: "36 Pages",
    fileSize: "15.7 MB",
    optionalSubject: "Mathematics",
    highlight: "Rank 16 in CSE 2023 with 298/500 in Mathematics Optional. Former IPS to IAS.",
    keyTakeaway: "Mathematical precision in case study stakeholder matrices, ethical dilemma decision trees, and crisp analytical conclusions.",
    marks: [
      { label: "Essay", val: "128", max: "250", pct: 51, tag: "Structured" },
      { label: "GS 1", val: "114", max: "250", pct: 46, tag: "Analytical" },
      { label: "GS 2", val: "118", max: "250", pct: 47, tag: "Case Law" },
      { label: "GS 3", val: "96", max: "250", pct: 38, tag: "Scientific" },
      { label: "GS 4", val: "122", max: "250", pct: 49, tag: "Top 1% Ethics" },
      { label: "Maths", val: "298", max: "500", pct: 60, tag: "★ Maths Highest" },
      { label: "Interview", val: "184", max: "275", pct: 67, tag: "IPS to IAS" },
    ],
  },
];

export default function AltruistUPSCPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroTopper, setActiveHeroTopper] = useState(0);
  const [activePurposeTab, setActivePurposeTab] = useState("gs-papers");
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const currentHeroTopper = HERO_TOPPERS[activeHeroTopper];
  const currentTab = PURPOSE_TABS.find((t) => t.id === activePurposeTab) || PURPOSE_TABS[0];
  const currentTestimonial = TESTIMONIALS[activeTestimonialIdx];

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden bg-[#FFFFFC] text-[#000000] selection:bg-[#DEEFF8] selection:text-[#116E99] ${plusJakartaSans.className}`}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION (Exact 1:1 Altruist Chassis: max-w-[880px], #FFFFFC, Inset Shadow)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed top-4 md:top-[25px] left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[880px]">
          <nav
            className="w-full rounded-[15px] border border-black/5 bg-[#FFFFFC] px-3.5 py-2 sm:px-5 sm:py-2.5 transition-all duration-200"
            style={{
              boxShadow: "inset 0px 0px 14px 0px rgba(22, 82, 110, 0.08)",
            }}
          >
            <div className="flex items-center justify-between">
              {/* Brand Logo Wordmark: Exact Altruist Clean Typography */}
              <div className="flex items-center pl-1 sm:pl-2">
                <Link
                  href="/"
                  className="whitespace-nowrap text-[18px] sm:text-[19px] font-bold tracking-tight text-[#16526E] transition hover:opacity-80"
                >
                  UPSCPrepNotes
                </Link>
              </div>

              {/* Right Group: Links + CTA Button (Matches Altruist right-aligned navigation cluster) */}
              <div className="flex items-center gap-5 lg:gap-7">
                {/* Desktop Navigation (visible on desktop) */}
                <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-[14px] font-semibold text-[#16526E]/70">
                  <Link
                    href="/toppers"
                    className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                  >
                    Toppers
                  </Link>
                  <a
                    href="#topper-showcase"
                    className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                  >
                    Answer Copies
                  </a>
                  <Link
                    href="/free-materials"
                    className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                  >
                    Materials
                  </Link>
                  <Link
                    href="/current-affairs"
                    className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                  >
                    Current Affairs
                  </Link>
                  <Link
                    href="/pyq"
                    className="whitespace-nowrap transition-colors hover:text-[#16526E]"
                  >
                    PYQs
                  </Link>
                  <Link
                    href="/ask"
                    className="whitespace-nowrap font-semibold text-[#116E99] transition-colors hover:text-[#16526E]"
                  >
                    Ask AI
                  </Link>
                </div>

                {/* Right Action: Altruist CTA button on desktop, Mobile Hamburger on smaller screens */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/store"
                    className="hidden lg:flex h-[40px] items-center justify-center rounded-[10px] bg-[#16526E] px-5 text-[14px] font-semibold text-white whitespace-nowrap transition hover:bg-[#0E3E55] active:scale-[0.98]"
                  >
                    Explore Store
                  </Link>

                  {/* Mobile Menu Hamburger (Altruist 3-bar style, visible below lg) */}
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-[#16526E] transition hover:bg-black/5 lg:hidden"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? (
                      <X size={20} className="text-[#16526E]" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-[4px] w-5">
                        <span className="h-[2px] w-5 rounded-full bg-[#116E99]" />
                        <span className="h-[2px] w-5 rounded-full bg-[#116E99]" />
                        <span className="h-[2px] w-5 rounded-full bg-[#116E99]" />
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
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#16526E]/80 transition hover:bg-[#DEEFF8]/50 hover:text-[#16526E]"
                >
                  Toppers Marksheets
                </Link>
                <a
                  href="#topper-showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#16526E]/80 transition hover:bg-[#DEEFF8]/50 hover:text-[#16526E]"
                >
                  Evaluated Answer Copies
                </a>
                <Link
                  href="/free-materials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#16526E]/80 transition hover:bg-[#DEEFF8]/50 hover:text-[#16526E]"
                >
                  Free Materials & Test Series
                </Link>
                <Link
                  href="/current-affairs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#16526E]/80 transition hover:bg-[#DEEFF8]/50 hover:text-[#16526E]"
                >
                  Current Affairs Hub
                </Link>
                <Link
                  href="/pyq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#16526E]/80 transition hover:bg-[#DEEFF8]/50 hover:text-[#16526E]"
                >
                  PYQs (2022–2025)
                </Link>
                <Link
                  href="/ask"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#116E99] transition hover:bg-[#DEEFF8]/50"
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Ask AI Mentor</span>
                  </div>
                  <span className="rounded-[4px] bg-[#116E99] px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
                </Link>
                <div className="pt-2 border-t border-black/5 mt-1">
                  <Link
                    href="/store"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-[42px] w-full items-center justify-center rounded-[10px] bg-[#16526E] text-[14px] font-semibold text-white shadow-xs transition hover:bg-[#0E3E55]"
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
          className="relative isolate flex h-[90vh] min-h-[620px] max-h-[860px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-6 py-12 text-center sm:px-12 sm:py-16"
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
            {/* Altruist gradient overlay: high text contrast while showcasing campus and mountains */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60" />
          </div>

          {/* Spacer top for floating nav */}
          <div className="h-10" />

          {/* Centered Straight Heading & Value Proposition (Airy & Uncluttered) */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center text-center px-2 sm:px-4">
            <h1 className="text-[23px] xs:text-[26px] sm:text-5xl md:text-[64px] font-extrabold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.4)] sm:leading-[1.15]">
              <span className="block">Every mark. Every topper.</span>
              <span className="mt-2 block sm:mt-3">
                Decoded with{" "}
                <span className="inline-flex items-center rounded-full bg-white px-3 py-0.5 sm:px-6 sm:py-1 text-[#116E99] shadow-2xl align-middle font-extrabold whitespace-nowrap">
                  zero fluff.
                </span>
              </span>
            </h1>

            <p className="mx-auto mt-4 sm:mt-5 max-w-xl text-sm sm:text-base md:text-[17px] leading-relaxed text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
              280+ verified marksheet breakdowns and authentic evaluated answer copies. Organized in one searchable archive for serious civil services aspirants.
            </p>
          </div>

          {/* Bottom CTA Button & Social Proof (Clean & Spacious) */}
          <div className="relative z-10 mx-auto flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-3">
              <a
                href="#topper-showcase"
                className="flex h-[46px] sm:h-[48px] items-center justify-center rounded-[12px] bg-[#16526E] px-7 sm:px-8 text-sm sm:text-base font-semibold text-white shadow-xl transition hover:bg-[#0E3E55] active:scale-[0.98]"
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
                <span className="text-[11px] sm:text-xs font-semibold text-[#16526E] whitespace-nowrap">
                  <span className="inline sm:hidden">280+ Marksheets Indexed · Verified</span>
                  <span className="hidden sm:inline">280+ Official Marksheets Indexed · Gazette Verified</span>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RECOGNIZED SECTION (Continuous Infinite Logo Marquee)
      ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold tracking-wider text-black/50 uppercase">
          Evaluated copies & test series sourced from premier institutes:
        </p>

        {/* Infinite Seamless Marquee */}
        <div className="relative mt-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-altruist-marquee flex items-center gap-14 sm:gap-20 py-4">
            {/* First Set of Large Direct Logos */}
            {MARQUEE_ITEMS.map((item, i) => (
              <div
                key={`m1-${i}`}
                className="flex shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.heightClass} w-auto max-w-[220px] object-contain opacity-85 transition-opacity duration-200 hover:opacity-100`}
                />
              </div>
            ))}

            {/* Second Set of Large Direct Logos (for seamless infinite loop) */}
            {MARQUEE_ITEMS.map((item, i) => (
              <div
                key={`m2-${i}`}
                className="flex shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.heightClass} w-auto max-w-[220px] object-contain opacity-85 transition-opacity duration-200 hover:opacity-100`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3.5 TOPPER INTELLIGENCE STAGE (Archival Examination Desk & Verified Downloads)
      ───────────────────────────────────────────────────────────── */}
     

      {/* ─────────────────────────────────────────────────────────────
          4. OUR PURPOSE SECTION (Interactive Tabs & Rotating Badge)
      ───────────────────────────────────────────────────────────── */}
      <section id="our-purpose" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
            Our Purpose
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px] md:leading-[1.2]">
            Topper preparation intelligence shouldn’t be a privilege
          </h2>
          <p className="mt-3 max-w-xl text-base text-black/70">
            From paper-wise mark distributions to real handwritten answer sheets with examiner feedback, we organize civil services intelligence with academic rigor.
          </p>
        </div>

        {/* Big Card Container */}
        <div className="relative mt-14 overflow-hidden rounded-[16px] bg-black p-6 sm:p-10 lg:p-14 text-white">
          
          {/* Curved rotating SVG text badge */}
          <div className="absolute top-4 right-4 z-20 hidden md:block" style={{ transform: "rotate(-10deg)" }}>
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[9px] font-bold tracking-widest text-[#EBF8FF] uppercase backdrop-blur-md animate-[spin_20s_linear_infinite]">
              ✦ For Every Aspirant ✦ For Every Attempt
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: What We Stand For + Tabs */}
            <div className="lg:col-span-5">
              <h3 className="text-xl font-bold tracking-tight text-white/90">
                What We Stand For
              </h3>

              <div className="mt-6 flex flex-col gap-2.5">
                {PURPOSE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activePurposeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePurposeTab(tab.id)}
                      className={`flex w-full items-center gap-3.5 rounded-[6px] px-4 py-3 text-left font-semibold transition-all ${
                        isActive
                          ? "bg-[rgba(230,237,245,0.18)] text-white shadow-inner"
                          : "bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-[5px] transition ${
                          isActive
                            ? "bg-[#16526E] text-[#EBF8FF] shadow-md"
                            : "bg-[#EBF8FF] text-[#16526E]"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="text-base">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Dynamic Image with Dark Overlay & Quote */}
            <div className="relative h-[340px] overflow-hidden rounded-[12px] bg-zinc-900 sm:h-[420px] lg:col-span-7">
              <img
                src={currentTab.image}
                alt={currentTab.label}
                className="h-full w-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
                <h4 className="text-xl font-bold text-white sm:text-2xl md:text-[28px] leading-snug">
                  “{currentTab.quote}”
                </h4>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FEATURED DOSSIERS (Ongoing Projects Layout)
      ───────────────────────────────────────────────────────────── */}
      <section id="dossiers" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl">
          <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
            In Progress
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
            Featured Topper Dossiers
          </h2>
          <p className="mt-3 text-base text-black/70">
            Deep-dive into verified marksheets, handwritten evaluated tests, and optional scores of recent UPSC toppers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_DOSSIERS.map((dossier, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[17px] bg-[#EBF8FF] p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-72 w-full overflow-hidden rounded-[12px]">
                <img
                  src={dossier.image}
                  alt={dossier.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Score Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-[6px] bg-white/95 px-3 py-1 text-xs font-bold text-black shadow-xs">
                  <span className="text-black/60">{dossier.rank}</span>
                  <span className="text-[#116E99]">· {dossier.scoreBadge}</span>
                </div>
              </div>

              {/* Bottom Card Info Stack */}
              <div className="mt-4 flex items-center justify-between rounded-[12px] bg-white p-4 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-black">{dossier.title}</h3>
                  <p className="text-xs text-black/60 line-clamp-1">{dossier.details}</p>
                </div>

                <Link
                  href={dossier.slug}
                  className="shrink-0 rounded-[10px] bg-[#16526E] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0E3E55]"
                >
                  View Marks
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. GOALS SECTION (Mission For CSE 2026 Layout)
      ───────────────────────────────────────────────────────────── */}
      <section id="goals" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center">
          <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
            Goals
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
            Mission For CSE 2026
          </h2>
          <p className="mt-3 max-w-xl text-base text-black/70">
            A single, transparent destination where civil services preparation is driven by verified data, not coaching hype.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {MISSION_GOALS.map((goal, i) => (
            <div
              key={i}
              className="flex flex-col justify-between overflow-hidden rounded-[17px] border border-black/5 bg-[#FFFFFC] p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <span className="inline-block rounded-full bg-[#FFF2E3] px-3 py-1 text-xs font-semibold text-[#6E4616]">
                  {goal.badge}
                </span>

                <h3 className="mt-4 text-xl font-bold text-black">
                  {goal.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-black/70">
                  {goal.desc}
                </p>
              </div>

              {/* Stacked Images */}
              <div className="mt-6 flex gap-3 overflow-hidden rounded-[12px]">
                <img
                  src={goal.img1}
                  alt={goal.title}
                  className="h-40 w-1/2 rounded-[10px] object-cover"
                />
                <img
                  src={goal.img2}
                  alt={goal.title}
                  className="h-40 w-1/2 rounded-[10px] object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. IMPACTS SECTION (Changes We Proudly Made Layout)
      ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center">
          <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
            Impacts
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
            Empowering Serious Aspirants Across India
          </h2>
          <p className="mt-3 max-w-xl text-base text-black/70">
            Thousands of aspirants use UPSCPrepNotes daily to calibrate their answers and benchmark their scores.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Bento Card 1 */}
          <div className="group relative h-80 overflow-hidden rounded-[17px] bg-black">
            <img
              src="/images/altruist/impact_1.webp"
              alt="Aspirants Prepared"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white">
                10,000+ Active Aspirants
              </h3>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="group relative h-80 overflow-hidden rounded-[17px] bg-black">
            <img
              src="/images/altruist/impact_2.webp"
              alt="PDF Downloads"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white">
                50,000+ PDF Downloads Across India
              </h3>
            </div>
          </div>

          {/* Bento Card 3 */}
          <div className="group relative h-80 overflow-hidden rounded-[17px] bg-black">
            <img
              src="/images/altruist/impact_3.webp"
              alt="Sub-Second Retrieval"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white">
                Sub-Second Retrieval Across All Papers
              </h3>
            </div>
          </div>
        </div>

        {/* Circular badge strip */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[#EBF8FF] px-5 py-2 text-xs font-semibold text-[#116E99]">
            <span>✦ Gazette Verified</span>
            <span>•</span>
            <span>Zero Fluff Intelligence ✦</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TESTIMONIALS SECTION (Trusted by Rankers Layout)
      ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
              Trusted by rankers and serious aspirants
            </h2>
            <p className="mt-2 text-base text-black/70">
              Here is what candidates preparing from Delhi, Bengaluru, and home libraries have to say.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevTestimonial}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-black hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextTestimonial}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-black hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Active Testimonial Card */}
        <div className="mt-10 overflow-hidden rounded-[17px] border border-black/6 bg-[#EBF8FF] p-8 sm:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <img
              src={currentTestimonial.avatar}
              alt={currentTestimonial.author}
              className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm sm:h-24 sm:w-24"
            />
            <div>
              <p className="text-xl font-medium leading-relaxed text-black/90 sm:text-2xl">
                “{currentTestimonial.quote}”
              </p>
              <p className="mt-4 text-sm font-bold text-[#16526E]">
                {currentTestimonial.author}, {currentTestimonial.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. COMMUNITY VOICES ("Notes from the community" Layout)
      ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
            Notes from the community
          </h2>
          <p className="mt-3 max-w-xl text-base text-black/70">
            Real voices from aspirants who replaced Telegram rumors with verified data.
          </p>
          <Link
            href="/store"
            className="mt-6 inline-flex h-[42px] items-center rounded-[10px] bg-[#16526E] px-6 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0E3E55]"
          >
            Explore Store Compilations
          </Link>
        </div>

        {/* Grid of Community Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_NOTES.map((note, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-[15px] border border-black/6 bg-white p-6 shadow-xs transition hover:shadow-sm"
            >
              <p className="text-sm sm:text-[15px] leading-relaxed text-black/80">
                “{note.quote}”
              </p>
              <div className="mt-4 pt-4 border-t border-black/5">
                <span className="text-xs font-bold text-[#116E99]">
                  {note.from}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. COMPILATIONS & RELEASES (Schedule Layout)
      ───────────────────────────────────────────────────────────── */}
      <section id="compilations" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div>
          <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
            Compilations
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
            Latest Study Materials & Archives
          </h2>
          <p className="mt-2 text-base text-black/70">
            Handpicked compilations, test series archives, and topper answer dossiers available for instant download.
          </p>
        </div>

        <div className="mt-12 flex flex-col divide-y divide-black/8 border-y border-black/8">
          {COMPILATIONS.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col justify-between gap-4 py-6 transition hover:bg-[#EBF8FF]/40 sm:flex-row sm:items-center px-4 -mx-4 rounded-[8px]"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded-[10px] object-cover"
                />
                <div>
                  <span className="text-xs font-semibold text-black/50">
                    {item.date}
                  </span>
                  <h3 className="text-lg font-bold text-black group-hover:text-[#116E99] transition">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/70">
                  {item.tag}
                </span>
                <Link
                  href="/store"
                  className="rounded-[8px] border border-[#16526E] px-4 py-1.5 text-xs font-semibold text-[#16526E] transition hover:bg-[#16526E] hover:text-white"
                >
                  Access
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. FAQ SECTION (Interactive Accordion)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="text-center">
          <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[42px]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-black/70">
            Everything you need to know about our data sources, answer copies, and downloads.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-[12px] border border-black/6 bg-white transition-shadow hover:shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-black transition"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-black/70 border-t border-black/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. STARTER PACK LEAD CAPTURE (Volunteer Layout)
      ───────────────────────────────────────────────────────────── */}
      <section id="join-us" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[20px] bg-[#EBF8FF] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left: Copy & Form */}
            <div className="lg:col-span-7">
              <span className="rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#116E99]">
                Starter Pack
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-[44px] md:leading-[1.15]">
                Get the Free UPSC Starter Pack
              </h2>
              <p className="mt-3 text-base text-black/70 leading-relaxed max-w-lg">
                Get instant access to 5 topper answer copies, the 4-year marksheet trend sheet, and high-scoring GS4 framework templates delivered straight to your email.
              </p>

              {/* Checklist */}
              <div className="mt-6 flex flex-col gap-2.5">
                {[
                  "Top 5 Verified Handwritten Answer Copies (PDF)",
                  "4-Year Paper-wise Marksheet Benchmarks",
                  "High-yield GS Ethics & Essay Frameworks",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-black/85">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16526E] text-white">
                      <Check size={12} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className="mt-8 rounded-[15px] bg-white p-6 shadow-sm sm:p-8">
                {formSubmitted ? (
                  <div className="rounded-[10px] bg-[#DEEFF8] p-6 text-center text-[#116E99]">
                    <h3 className="text-lg font-bold">Starter Pack Sent!</h3>
                    <p className="mt-1 text-sm">Check your inbox for your instant download links.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormSubmitted(true);
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-black/70 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Aspirant Name"
                          className="w-full rounded-[8px] border border-black/10 bg-[#FFFFFC] px-3.5 py-2 text-sm text-black placeholder:text-black/40 focus:border-[#16526E] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-black/70 mb-1">Email ID</label>
                        <input
                          type="email"
                          required
                          placeholder="aspirant@gmail.com"
                          className="w-full rounded-[8px] border border-black/10 bg-[#FFFFFC] px-3.5 py-2 text-sm text-black placeholder:text-black/40 focus:border-[#16526E] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-black/70 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="w-full rounded-[8px] border border-black/10 bg-[#FFFFFC] px-3.5 py-2 text-sm text-black placeholder:text-black/40 focus:border-[#16526E] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-black/70 mb-1">Optional Subject</label>
                        <select
                          className="w-full rounded-[8px] border border-black/10 bg-[#FFFFFC] px-3.5 py-2 text-sm text-black focus:border-[#16526E] focus:outline-hidden"
                        >
                          <option>PSIR</option>
                          <option>Anthropology</option>
                          <option>Sociology</option>
                          <option>Geography</option>
                          <option>History</option>
                          <option>Public Administration</option>
                          <option>Other Optional</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 flex h-[44px] w-full items-center justify-center rounded-[10px] bg-[#16526E] text-sm font-bold text-white shadow-xs transition hover:bg-[#0E3E55]"
                    >
                      Download Free Starter Pack
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Graphic Card with Rotating Badge (Loaded Locally) */}
            <div className="relative h-[480px] overflow-hidden rounded-[16px] lg:col-span-5">
              <img
                src="/images/altruist/starter_pack.webp"
                alt="Aspirants studying"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Rotating Circular Badge */}
              <div className="absolute bottom-6 right-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/20 text-[9px] font-bold tracking-widest text-white uppercase backdrop-blur-md animate-[spin_18s_linear_infinite]">
                  ✦ Free Starter Pack ✦
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/8 bg-[#FFFFFC] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            
            {/* Brand column */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#16526E] text-white shadow-xs">
                  <span className="text-sm font-bold">U</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-[#16526E]">
                  UPSCPrepNotes
                </span>
              </div>
              <p className="mt-4 text-sm text-black/60 max-w-sm">
                India&apos;s premier verified civil services preparation intelligence archive.
              </p>
              <p className="mt-2 text-sm font-semibold text-[#16526E]">
                <a href="mailto:support@upscprepnotes.in" className="hover:underline">
                  support@upscprepnotes.in
                </a>
              </p>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 gap-8 md:col-span-7 sm:grid-cols-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40">
                  Database
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-black/75">
                  <li><a href="#dossiers" className="hover:text-black">Topper Marksheets</a></li>
                  <li><a href="#our-purpose" className="hover:text-black">Handwritten Copies</a></li>
                  <li><a href="#goals" className="hover:text-black">Optional Analysis</a></li>
                  <li><Link href="/store" className="hover:text-black">Study Material Store</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40">
                  Platform
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-black/75">
                  <li><a href="#our-purpose" className="hover:text-black">Our Purpose</a></li>
                  <li><a href="#testimonials" className="hover:text-black">Aspirant Reviews</a></li>
                  <li><a href="#goals" className="hover:text-black">2026 Roadmap</a></li>
                  <li><a href="#faq" className="hover:text-black">FAQs</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40">
                  Ethics & Quality
                </h4>
                <p className="mt-4 text-xs leading-relaxed text-black/60">
                  All candidate marksheets are cross-verified against official UPSC Gazette records. No sponsored coaching endorsements.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 text-xs text-black/50 sm:flex-row">
            <p>© 2026 UPSCPrepNotes.in. All rights reserved.</p>
            <p>Crafted for Serious Civil Services Aspirants</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
