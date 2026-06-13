export interface TopperData {
  name: string;
  rank: string;
  subject: string;
  year: string;
  previewImageUrl: string;
  slug: string;
}

export function topperSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export const TOPPERS: TopperData[] = [
  { name: "Ishita Kishore", slug: "ishita-kishore", rank: "AIR 1", subject: "PSIR", year: "2022", previewImageUrl: "/previews/ishita-kishore.png" },
  { name: "Garima Lohia", slug: "garima-lohia", rank: "AIR 2", subject: "Commerce & Accountancy", year: "2022", previewImageUrl: "/previews/garima-lohia.png" },
  { name: "Harshita Goyal", slug: "harshita-goyal", rank: "AIR 2", subject: "PSIR", year: "2024", previewImageUrl: "/previews/harshita-goyal.png" },
  { name: "Uma Harathi", slug: "uma-harathi", rank: "AIR 3", subject: "Anthropology", year: "2022", previewImageUrl: "/previews/uma-harathi.png" },
  { name: "Divya Tanwar", slug: "divya-tanwar", rank: "AIR 105", subject: "Hindi Literature", year: "2022", previewImageUrl: "/previews/divya-tanwar.png" },
  { name: "Ayan Jain", slug: "ayan-jain", rank: "AIR 16", subject: "Mathematics", year: "2023", previewImageUrl: "/previews/ayan-jain.png" },
  { name: "Shivani Ettaboyina", slug: "shivani-ettaboyina", rank: "AIR 11", subject: "Anthropology", year: "2024", previewImageUrl: "/previews/shivani-ettaboyina.png" },
  { name: "Vaishali Chopra", slug: "vaishali-chopra", rank: "AIR 23", subject: "Mathematics", year: "2022", previewImageUrl: "/previews/vaishali-chopra.png" },
];

export const FAQS = [
  { q: "Are these typed notes or handwritten answer copies?", a: "These are scanned copies of actual handwritten UPSC Mains answer sheets — exactly as toppers wrote them in the exam hall. If you're looking for typed notes, this compilation is not for you. These show you real handwriting, structure, underlining, and diagrams that scored 140+." },
  { q: "Are these the actual UPSC answer sheets?", a: "Yes. All 50+ copies are real handwritten UPSC Mains answer sheets from verified toppers (AIR 1–1249). Each copy includes the original scorecard for verification." },
  { q: "How is this different from free answer copies on Telegram?", a: "Free copies are scattered, unverified, and low-quality scans. This is a curated compilation organized by paper and marks — with original strategy guides, examiner commentary, and AI access that no free source provides." },
  { q: "How will I receive the files?", a: "After payment verification, we email you a download link. The compilation comes as a single ZIP file organized by paper (GS1–4, Essay, Optional). You get lifetime access and free updates." },
  { q: "What if I am not satisfied?", a: "Email us within 7 days of receiving the download link. We will refund your payment. No questions asked." },
  { q: "Can I pay via GPay or PhonePe?", a: 'Yes. Tap the "Pay ₹799" button anywhere on the page to open your UPI app. You can also manually pay to rakhangezaid8@pingpay via GPay, PhonePe, or any UPI app.' },
];

export const FEATURES = [
  "50+ actual handwritten topper answer copy PDFs (GS1–4, Essay, Optional)",
  "21 original strategy guides by rank holders",
  "Interview preparation pack with 100+ questions",
  "Ethics case studies with model answers",
  "AI assistant trained on these copies for instant feedback",
  "Organised by paper, marks, and year — ready to download",
  "Lifetime access + free updates",
];

export const WHATSAPP_NUMBER = "919152750079";
export const UPI_ID = "rakhangezaid8@pingpay";
export const SITE = "upscprepnotes.in";
export const TIER = "Ultimate Compilation";
export const PRICE = 799;
