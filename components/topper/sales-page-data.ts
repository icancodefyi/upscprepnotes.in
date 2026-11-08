import { PRODUCTS } from "@/lib/store-products";
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
  { name: "Ishita Kishore", slug: "ishita-kishore", rank: "AIR 1", subject: "PSIR", year: "2022", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/ishita-kishore.png?tr=w-788,f-auto,q-80" },
  { name: "Garima Lohia", slug: "garima-lohia", rank: "AIR 2", subject: "Commerce & Accountancy", year: "2022", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/garima-lohia.png?tr=w-788,f-auto,q-80" },
  { name: "Harshita Goyal", slug: "harshita-goyal", rank: "AIR 2", subject: "PSIR", year: "2024", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/harshita-goyal.png?tr=w-788,f-auto,q-80" },
  { name: "Uma Harathi", slug: "uma-harathi", rank: "AIR 3", subject: "Anthropology", year: "2022", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/uma-harathi.png?tr=w-788,f-auto,q-80" },
  { name: "Divya Tanwar", slug: "divya-tanwar", rank: "AIR 105", subject: "Hindi Literature", year: "2022", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/divya-tanwar.png?tr=w-788,f-auto,q-80" },
  { name: "Ayan Jain", slug: "ayan-jain", rank: "AIR 16", subject: "Mathematics", year: "2023", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/ayan-jain.png?tr=w-788,f-auto,q-80" },
  { name: "Shivani Ettaboyina", slug: "shivani-ettaboyina", rank: "AIR 11", subject: "Anthropology", year: "2024", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/shivani-ettaboyina.png?tr=w-788,f-auto,q-80" },
  { name: "Vaishali Chopra", slug: "vaishali-chopra", rank: "AIR 23", subject: "Mathematics", year: "2022", previewImageUrl: "https://ik.imagekit.io/impiclabs/previews/vaishali-chopra.png?tr=w-788,f-auto,q-80" },
];

export const FAQS = [
  { q: "Are these typed notes or handwritten answer copies?", a: "These are scanned copies of actual handwritten UPSC Mains answer sheets — exactly as toppers wrote them in the exam hall. If you're looking for typed notes, this compilation is not for you. These show you real handwriting, structure, underlining, and diagrams that scored 140+." },
  { q: "Are these the actual UPSC answer sheets?", a: "Yes. All 50+ copies are real handwritten UPSC Mains answer sheets from verified toppers (AIR 1–1249). Each copy includes the original scorecard for verification." },
  { q: "How is this different from free answer copies on Telegram?", a: "Free copies are scattered and hard to compare. This compilation puts 63 copies in one place, organised by paper and marks, with each topper's rank, year and marks on the copy." },
  { q: "How will I receive the files?", a: "Right after payment you land on a download page with every PDF, organised by paper (GS1–4, Essay, Optional). We also email you the link, so you can download again later." },
  { q: "What if I am not satisfied?", a: "Email us within 7 days of receiving the download link. We will refund your payment. No questions asked." },
  { q: "Can I pay via GPay or PhonePe?", a: 'Yes. The secure checkout accepts UPI (GPay, PhonePe, Paytm and any UPI app), cards and net banking, and the download link is emailed right after payment.' },
];

export const FEATURES = [
  "63 handwritten topper answer copy PDFs (GS1–4, Essay, Optional)",
  "Each copy labelled with the topper's name, rank, year and marks",
  "Organised by paper and marks, ready to download",
  "Instant email delivery and a 7-day refund",
];

export const WHATSAPP_NUMBER = "919152750079";
export const UPI_ID = "rakhangezaid8@pingpay";
export const SITE = "upscprepnotes.in";
export const TIER = "Offer";
// This page sells the Answer Copies Compilation (its files are on the CDN).
export const PRODUCT_SLUG = "answer-copies-compilation";
export const PRICE = PRODUCTS.find((p) => p.slug === PRODUCT_SLUG)?.price ?? 199;
