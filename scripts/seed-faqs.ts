import { config } from "dotenv";
config({ path: ".env.local" });

import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface FAQ {
  question: string;
  answer: string;
}

function generateFAQs(topper: any): FAQ[] {
  const name = `${topper.firstName} ${topper.lastName}`;
  const rank = topper.rank;
  const year = topper.year;
  const subject = topper.optionalSubject || "their optional subject";
  const marks = topper.marks || {};
  const strategy = topper.strategy || "";

  const hasWritten = marks.written > 0;
  const hasInterview = marks.interview > 0;
  const subjectLower = subject.toLowerCase();

  const faqs: FAQ[] = [];

  // 1. Optional-specific question
  if (subject !== "their optional subject") {
    if (strategy.toLowerCase().includes(subjectLower) || strategy.toLowerCase().includes("optional")) {
      faqs.push({
        question: `How did ${name} prepare for ${subject} optional?`,
        answer: `${name} chose ${subject} as their optional subject and secured AIR ${rank} in UPSC CSE ${year}. Their optional strategy is covered in the preparation section above, including book list, answer writing practice, and revision approach for ${subject}.`,
      });
    } else {
      faqs.push({
        question: `Why did ${name} choose ${subject} as their optional?`,
        answer: `${name} opted for ${subject} as their UPSC optional subject and scored ${marks.optional1 + marks.optional2 || "well"} marks across both papers. ${subject} is a popular choice among UPSC toppers and has produced consistent results. View more ${subject} toppers on the optional page.`,
      });
    }
  }

  // 2. Strongest/weakest paper question
  const papers = [
    { label: "GS1", value: marks.gs1 },
    { label: "GS2", value: marks.gs2 },
    { label: "GS3", value: marks.gs3 },
    { label: "GS4", value: marks.gs4 },
    { label: "Essay", value: marks.essay },
  ].filter(p => p.value > 0);

  if (papers.length >= 2) {
    const sorted = [...papers].sort((a, b) => b.value - a.value);
    const best = sorted[0];
    faqs.push({
      question: `What was ${name}'s strongest UPSC paper?`,
      answer: `${name} scored highest in ${best.label} with ${best.value} marks. This was ${best.value - sorted[1].value} marks ahead of their next best paper, ${sorted[1].label} (${sorted[1].value} marks). Their total score was ${marks.total} in UPSC CSE ${year}.`,
    });
  }

  // 3. Study hours / schedule question
  if (strategy.toLowerCase().includes("hour") || strategy.toLowerCase().includes("study") || strategy.toLowerCase().includes("schedule") || strategy.toLowerCase().includes("daily")) {
    faqs.push({
      question: `How many hours did ${name} study daily for UPSC?`,
      answer: `${name}'s daily study routine is detailed in their preparation strategy section. Most UPSC toppers maintain 6-8 hours of focused study, with variations based on work status and personal circumstances. ${name}'s specific schedule is covered above.`,
    });
  }

  // 4. Attempts question
  if (strategy.toLowerCase().includes("attempt") || marks.written > 0) {
    faqs.push({
      question: `How many attempts did ${name} take to clear UPSC?`,
      answer: `${name} secured AIR ${rank} in UPSC CSE ${year}. The number of attempts and their preparation journey is covered in the strategy section above, including how they improved across attempts.`,
    });
  }

  // 5. Coaching question
  if (strategy.toLowerCase().includes("coaching") || strategy.toLowerCase().includes("coach") || strategy.toLowerCase().includes("test series") || strategy.toLowerCase().includes("mock")) {
    faqs.push({
      question: `Which coaching or test series did ${name} use?`,
      answer: `${name}'s coaching and test series details are covered in the preparation strategy section above. Many UPSC toppers rely on a combination of self-study, coaching, and mock test series for answer writing practice.`,
    });
  }

  // 6. Marks context question
  if (hasWritten && hasInterview) {
    const writtenPct = Math.round(marks.written / marks.total * 100);
    faqs.push({
      question: `How did ${name} score ${marks.total} marks in UPSC?`,
      answer: `${name} scored ${marks.written} marks in the written papers (${writtenPct}% of total) and ${marks.interview} marks in the interview. Their paper-wise breakdown: GS1: ${marks.gs1}, GS2: ${marks.gs2}, GS3: ${marks.gs3}, GS4: ${marks.gs4}, Essay: ${marks.essay}. Optional subject (${subject}): Paper 1: ${marks.optional1}, Paper 2: ${marks.optional2}.`,
    });
  }

  // 7. Book recommendations question
  if (strategy.toLowerCase().includes("book") || strategy.toLowerCase().includes("ncert") || strategy.toLowerCase().includes("standard") || strategy.toLowerCase().includes("resource") || strategy.toLowerCase().includes("material")) {
    faqs.push({
      question: `What books and resources did ${name} use?`,
      answer: `${name}'s recommended book list and study resources are detailed in the preparation strategy section above, covering NCERTs, standard reference books, and current affairs sources for UPSC CSE ${year}.`,
    });
  }

  // Limit to 5 most relevant
  return faqs.slice(0, 5);
}

async function main() {
  await connectDB();
  console.log("Connected to MongoDB");

  const toppers = await TopperModel.find({}).lean();
  console.log(`Found ${toppers.length} toppers`);

  let updated = 0;
  for (const topper of toppers) {
    const faqs = generateFAQs(topper);
    if (faqs.length > 0) {
      await TopperModel.updateOne(
        { _id: topper._id },
        { $set: { faqs } }
      );
      updated++;
      if (updated % 20 === 0) console.log(`Updated ${updated}/${toppers.length} toppers`);
    }
  }

  console.log(`Done! Updated ${updated} toppers with unique FAQs`);
  process.exit(0);
}

main().catch(console.error);
