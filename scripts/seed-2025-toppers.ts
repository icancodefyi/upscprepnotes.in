import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;
if (!MONGODB_URI || !DB_NAME) throw new Error("Missing MONGODB_URI or DB_NAME");

const topperSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Topper = mongoose.model("Topper", topperSchema, "toppers");

const toppersData = [
  {
    firstName: "Rajeshwari",
    lastName: "Suve M",
    rank: 2,
    year: 2025,
    optionalSubject: "Sociology",
    slug: "rajeshwari-suve-m-rank-2-2025",
    marks: {
      essay: 0,
      gs1: 0,
      gs2: 0,
      gs3: 0,
      gs4: 0,
      optional1: 150,
      optional2: 143,
      interview: 202,
      written: 865,
      total: 1067,
    },
    bio: "Rajeshwari Suve M secured All India Rank 2 in the UPSC Civil Services Examination 2025. She is the female topper of CSE 2025 and the highest-ranked OBC candidate. Hailing from Vadipatti in Madurai, Tamil Nadu, she completed her B.E. in Electrical and Electronics Engineering from Vel Tech Multi Tech Engineering College (Anna University, Chennai) in 2018. She chose Sociology as her optional subject and cleared the exam in her fifth attempt. Before this result, she was serving as a Deputy Collector (Training) at the District Collector Office in Dindigul, Tamil Nadu. Born on 3 May 1997, she is a testament to perseverance — proving that multiple attempts and a full-time government job can be balanced with disciplined UPSC preparation.",
    strategy: `## Background
Rajeshwari Suve M was born in Vadipatti, Madurai district, Tamil Nadu. Her father runs a business and her mother is an Associate Professor in a government institution. She completed her schooling under the Tamil Nadu State Board and graduated with a B.E. in Electrical and Electronics Engineering from Vel Tech Multi Tech Engineering College (Anna University) in 2018. While preparing for UPSC, she also cleared the Tamil Nadu PCS examination and served as a Deputy Collector (Training) in Dindigul.

## UPSC Journey
Rajeshwari appeared for the UPSC Civil Services Examination five times before securing AIR 2 in 2025. She also appeared for the Indian Forest Service Examination during this period. Her journey was one of constant improvement — each attempt taught her something new about the examination's demand and helped her refine her preparation strategy.

## Optional Subject — Sociology
Rajeshwari chose Sociology as her optional subject. Despite her engineering background, she developed a deep interest in understanding social structures, institutions, and governance. She scored 293 marks in Sociology (150 in Paper 1, 143 in Paper 2) — one of the highest in the 2025 examination. Her advice to aspirants is to choose an optional based on interest and syllabus comfort rather than scoring trends alone.

## Key Preparation Philosophy
1. **Foundation First**: Build strong conceptual clarity with NCERTs before moving to advanced sources.
2. **Answer Writing Practice**: Consistent answer writing was the key differentiator across her attempts.
3. **Current Affairs Integration**: Connect current events with static syllabus topics for multidimensional answers.
4. **Revision Strategy**: Multiple revisions of limited sources rather than covering too many books.
5. **Mock Interviews**: Participated in the Interview Guidance Programme to refine her DAF preparation and communication skills.

## Message for Aspirants
"Persistence is the key. The UPSC journey is long and demanding, but every attempt teaches you something valuable. Focus on improving 1% every day rather than aiming for perfection from day one."`,
    insights: [
      "Cleared UPSC CSE in her 5th attempt while working as Deputy Collector — proving that a government job and UPSC prep can coexist",
      "Scored 293/500 in Sociology optional — among the highest in CSE 2025",
      "Female topper of UPSC CSE 2025 — an inspiration for women aspirants across India",
      "Engineering background yet chose Sociology as optional — shows optional choice should be based on interest, not background",
      "Dreams of serving in the Indian Police Service (IPS) despite securing IAS eligibility",
    ],
    answerCopies: { gs1: [], gs2: [], gs3: [], gs4: [], essay: [] },
    resources: { essayLinks: [], gs1Links: [], gs2Links: [], gs3Links: [], gs4Links: [] },
    isFeatured: false,
    isIndexed: false,
    freeAnswerCopyUrls: [],
  },
  {
    firstName: "Akansh",
    lastName: "Dhull",
    rank: 3,
    year: 2025,
    optionalSubject: "Commerce & Accountancy",
    slug: "akansh-dhull-rank-3-2025",
    marks: {
      essay: 119,
      gs1: 117,
      gs2: 129,
      gs3: 98,
      gs4: 134,
      optional1: 136,
      optional2: 131,
      interview: 193,
      written: 864,
      total: 1057,
    },
    bio: "Akansh Dhull secured All India Rank 3 in the UPSC Civil Services Examination 2025 at the age of 22, making him one of the youngest top-3 rankers in UPSC history. A B.Com (Hons) graduate from Shri Ram College of Commerce (SRCC), Delhi University, he chose Commerce & Accountancy as his optional subject. His rank progression across attempts — AIR 342 (2023) → AIR 295 (2024) → AIR 3 (2025) — is a textbook example of systematic improvement. He is the son of Krishan Dhull, a BJP leader in Haryana, but credits his success to his own hard work and discipline rather than privilege.",
    strategy: `## Background
Akansh Dhull was born in Rohtak, Haryana and raised in Panchkula (Chandigarh region). He completed his Class 10 from St. Kabir Public School, Chandigarh with a 10/10 CGPA, and Class 12 from Bhavan Vidyalaya, Chandigarh with 98%. He then pursued B.Com (Hons) from Shri Ram College of Commerce (SRCC), Delhi University, graduating with an 8.5 CGPA in 2022. Despite a campus placement opportunity, he chose to pursue civil services — a decision driven by a childhood ambition to serve the nation.

## Rank Progression

| Attempt | Year | Rank | Key Learning |
|---------|------|------|-------------|
| 1st | 2023 | AIR 342 | Understood the exam pattern and syllabus depth |
| 2nd | 2024 | AIR 295 | Improved answer writing and current affairs integration |
| 3rd | 2025 | AIR 3 | Mastered revision strategy and mock practice |

## Optional Subject — Commerce & Accountancy
Akansh chose Commerce & Accountancy, leveraging his SRCC commerce background. He scored a total of 267 marks (Paper 1: 136, Paper 2: 131). His commerce foundation gave him a natural advantage in financial accounting, corporate law, and business economics — topics that also helped him in the interview when discussing fiscal policy and public sector enterprises.

## Preparation Strategy
1. **NCERT Foundation**: Started with basic NCERTs to build conceptual clarity before moving to standard textbooks.
2. **Current Affairs**: Integrated current affairs with static subjects rather than treating them as separate silos.
3. **Answer Writing**: Practiced daily answer writing and got them evaluated — this was his biggest area of improvement from AIR 342 to AIR 3.
4. **Mock Tests**: Took the GS Mains Advance Course from NEXT IAS for structured practice and feedback.
5. **Interview Preparation**: Worked on DAF thoroughly, participated in mock interviews to build confidence.

## Key Strengths
- GS Paper 2: Scored 129 — the highest among all 2025 toppers
- GS Paper 1: Scored 117 — the highest among all 2025 toppers
- Strong analytical and debating skills developed at SRCC
- Consistent improvement across attempts — proving that systematic effort beats talent

## Message for Aspirants
"I come from privilege, but I worked hard. Service was nurtured in my family, but the effort was mine. Don't let your background define your ceiling — let your discipline define it."`,
    insights: [
      "Youngest top-3 ranker in recent UPSC history at age 22",
      "Textbook rank progression: 342 → 295 → 3 — a case study in systematic improvement",
      "Highest scorer in GS Paper 1 (117) and GS Paper 2 (129) among all CSE 2025 toppers",
      "SRCC commerce graduate who chose Commerce & Accountancy optional — aligned optional with background",
      "Declined campus placement at SRCC to pursue civil services full-time",
      "Son of Haryana BJP leader but emphasizes personal hard work over privilege",
    ],
    answerCopies: { gs1: [], gs2: [], gs3: [], gs4: [], essay: [] },
    resources: { essayLinks: [], gs1Links: [], gs2Links: [], gs3Links: [], gs4Links: [] },
    isFeatured: false,
    isIndexed: false,
    freeAnswerCopyUrls: [],
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, bufferCommands: false });

  for (const data of toppersData) {
    const existing = await Topper.findOne({ slug: data.slug });
    if (existing) {
      console.log(`Skipping ${data.slug} — already exists`);
      continue;
    }
    const topper = await Topper.create(data);
    console.log(`Created ${data.firstName} ${data.lastName} (AIR ${data.rank}, ${data.year}) — ID: ${topper._id}`);
  }

  // Generate FAQs for toppers without any
  const allToppers = await Topper.find({ $or: [{ faqs: { $exists: false } }, { faqs: { $size: 0 } }], year: 2025 }).lean();
  let faqUpdated = 0;
  for (const t of allToppers) {
    const name = `${t.firstName} ${t.lastName}`;
    const rank = t.rank;
    const year = t.year;
    const subject = t.optionalSubject || "their optional subject";
    const marks = t.marks || {};
    const strategy = t.strategy || "";
    const faqs: { question: string; answer: string }[] = [];

    if (subject !== "their optional subject") {
      faqs.push({
        question: `Why did ${name} choose ${subject} as their optional?`,
        answer: `${name} opted for ${subject} as their UPSC optional subject and scored ${(marks.optional1 || 0) + (marks.optional2 || 0)} marks across both papers. ${subject} aligned with their academic background and interests, contributing to their AIR ${rank} in UPSC CSE ${year}.`,
      });
    }

    faqs.push({
      question: `How many attempts did ${name} take to clear UPSC?`,
      answer: `${name} secured AIR ${rank} in UPSC CSE ${year}. Their preparation journey and number of attempts are covered in the strategy section above.`,
    });

    if (marks.written > 0 && marks.interview > 0) {
      faqs.push({
        question: `How did ${name} score ${marks.total} marks in UPSC?`,
        answer: `${name} scored ${marks.written} marks in the written papers and ${marks.interview} marks in the interview (Personality Test), achieving a final total of ${marks.total} and securing AIR ${rank} in UPSC CSE ${year}.`,
      });
    }

    faqs.push({
      question: `What was ${name}'s optional subject marks breakdown?`,
      answer: `${name} chose ${subject} as their optional, scoring ${marks.optional1 || "—"} in Paper 1 and ${marks.optional2 || "—"} in Paper 2, for a combined optional total of ${(marks.optional1 || 0) + (marks.optional2 || 0)} marks out of 500.`,
    });

    faqs.push({
      question: `Where can I download ${name}'s answer copies?`,
      answer: `Answer copies for ${name} will be available on UPSCPrepNotes once sourced from official UPSC releases. Check back for updates, or explore other topper answer copies on the site.`,
    });

    await Topper.updateOne({ _id: t._id }, { $set: { faqs } });
    faqUpdated++;
  }

  console.log(`\nGenerated FAQs for ${faqUpdated} toppers`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
