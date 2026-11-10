import type { Metadata } from "next";
import Link from "next/link";
import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import Quiz from "@/components/quiz/Quiz";
import { QUIZ_LIVE } from "@/lib/quiz/config";
import { PRELIMS_2024 } from "@/lib/quiz/prelims-2024";

const URL = "https://upscprepnotes.in/quiz";
const TITLE = "Daily UPSC Prelims Quiz: 5 Real Questions a Day, Marked the Exam Way";
const DESC = "Five real UPSC Prelims questions every day from CSE 2024 GS Paper I, marked like the exam: +2 for a right answer, −0.66 for a wrong one, 0 for a skip. Free, no sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, siteName: "UPSCPrepNotes", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  // Hidden from search until the answers are verified and QUIZ_LIVE is switched on.
  robots: { index: QUIZ_LIVE, follow: QUIZ_LIVE },
  manifest: "/quiz/manifest.webmanifest",
  appleWebApp: { capable: true, title: "UPSC Quiz", statusBarStyle: "default" },
};

/** Subject counts come from the question bank itself, so this text can never disagree with the quiz. */
function subjectCounts() {
  const counts = new Map<string, number>();
  for (const q of PRELIMS_2024) counts.set(q.subject, (counts.get(q.subject) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

const FAQS = [
  {
    q: "Are these real UPSC questions?",
    a: `Yes. The ${PRELIMS_2024.length} questions come from the UPSC Civil Services Prelims 2024, General Studies Paper I. Each daily set of five is drawn from that bank, and every question has a short explanation after you answer.`,
  },
  {
    q: "How is UPSC Prelims marked?",
    a: "GS Paper I has 100 questions for 200 marks. A right answer earns 2 marks, a wrong answer loses one third of that (0.66), and a skipped question scores zero. The quiz uses the same scheme, so your score here is comparable to the real exam.",
  },
  {
    q: "How much time do I get per question?",
    a: "The real paper gives 2 hours for 100 questions, which is about 72 seconds each. The quiz measures your pace against that figure.",
  },
  {
    q: "Is the quiz free?",
    a: "Yes. There is no sign-up, and your streak, score and badges are saved on your own device.",
  },
  {
    q: "When do new questions appear?",
    a: "A new set of five unlocks at midnight IST. After you finish today's set you can practise extra sets as well.",
  },
];

export default function QuizPage() {
  const subjects = subjectCounts();
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <div className={`up ${brandFonts} min-h-dvh`} style={{ background: "#f4f5f9" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Daily UPSC quiz", href: "/quiz" }]} />
      <Quiz />

      <section className="mx-auto max-w-[920px] px-6 pb-28 pt-16 sm:pt-20" aria-labelledby="about-quiz">
        <h2 id="about-quiz" className="t-head text-l">About the daily UPSC Prelims quiz</h2>
        <p className="mt-3 max-w-[44rem] text-m leading-[1.7] text-[var(--ink-2)]">
          Every day you get five real questions from UPSC Prelims 2024, General Studies Paper I. Each one is marked the way the exam marks it: +2 for a right answer, −0.66 for a wrong one and 0 for a skip. After every answer you see why it is right and what the trap was. Gilu, the squirrel, reacts as you go.
        </p>

        <h3 className="mt-8 text-m font-bold">What the question bank covers</h3>
        <p className="mt-2 max-w-[44rem] text-m leading-[1.7] text-[var(--ink-2)]">
          {`The bank has ${PRELIMS_2024.length} questions: ${subjects.map(([s, n]) => `${s} (${n})`).join(", ")}.`}
        </p>

        <h3 className="mt-8 text-m font-bold">How it helps your Prelims preparation</h3>
        <ul className="mt-2 max-w-[44rem] list-disc space-y-1.5 pl-5 text-m leading-[1.7] text-[var(--ink-2)]">
          <li>Practise the negative-marking decision: answer, or skip when unsure.</li>
          <li>Use the 50:50 hint to cut two options, the way many candidates narrow a multiple-choice question in the exam.</li>
          <li>Build a daily habit with a streak and the 30-day challenge, which unlocks study-material rewards.</li>
          <li>See which subjects you answer well and which need work.</li>
        </ul>

        <h2 className="t-head mt-12 text-l">Questions about the quiz</h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-[20px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)]">
              <summary className="cursor-pointer list-none text-m font-bold [&::-webkit-details-marker]:hidden">{f.q}</summary>
              <p className="mt-2 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-s text-[var(--muted)]">
          More for Mains: <Link href="/toppers/upsc-mains-marks-needed" className="underline">marks needed for a rank</Link> · <Link href="/content/how-to-write-upsc-mains-answers" className="underline">how to write Mains answers</Link> · <Link href="/pyq" className="underline">previous year questions</Link>
        </p>
      </section>
    </div>
  );
}
