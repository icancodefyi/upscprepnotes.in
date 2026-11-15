import type { Metadata } from "next";
import BrandShell from "@/components/brand/BrandShell";
import BetaForm from "./BetaForm";

export const metadata: Metadata = {
  title: "AI Mock Interview for UPSC: Join the Test Group | UPSCPrepNotes",
  description: "We are building a mock interview for the UPSC personality test: questions from your DAF, a board of five, follow-ups and a scored report. Join the free test group and tell us what you need.",
  alternates: { canonical: "https://upscprepnotes.in/interview-practice" },
  // A signup page for the test group, not a content page yet.
  robots: { index: false, follow: true },
};

const POINTS = [
  ["Questions from your DAF", "Home state, education, optional, hobbies, work: the board asks from your own form."],
  ["A board of five", "A Chairman and four members take turns, follow up and push back, like the real panel."],
  ["Answer out loud, on camera", "You speak your answers. The video stays on your device for you to watch back."],
  ["A scored report", "Content, clarity, balance, honesty and depth, with a stronger version of your weak answers."],
];

export default function InterviewPracticePage({ searchParams }: { searchParams: Promise<{ src?: string }> }) {
  return (
    <BrandShell>
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-x-14 lg:gap-y-0">
          <div className="lg:col-start-1">
            <p className="inline-flex rounded-full bg-[#e9edff] px-3 py-1 text-s font-bold text-[var(--accent)]">In testing · free for testers</p>
            <h1 className="t-display mt-4 text-l">A UPSC mock interview you can take any time</h1>
            <p className="mt-4 max-w-[600px] text-m leading-[1.65] text-[var(--ink-2)]">
              Human mock interviews cost money and need a booked slot. We are building a practice board you can face from home, as often as you like. Before we launch, we want aspirants to test it and tell us what it must do.
            </p>
          </div>
          {/* Phones: the form comes right after the headline. Wide screens: it sits in the right column. */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <BetaForm searchParams={searchParams} />
          </div>
          <div className="lg:col-start-1">
            <ul className="grid gap-4 sm:grid-cols-2 lg:mt-8">
              {POINTS.map(([h, p]) => (
                <li key={h} className="rounded-[20px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2)]">
                  <p className="text-m font-bold">{h}</p>
                  <p className="mt-1.5 text-s leading-[1.55] text-[var(--ink-2)]">{p}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[600px] text-s leading-[1.6] text-[var(--muted)]">
              It is practice, not a prediction of your marks. Testers get free access first. We will only use your details to invite you and to ask for feedback.
            </p>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
