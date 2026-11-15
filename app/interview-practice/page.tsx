import type { Metadata } from "next";
import BrandShell from "@/components/brand/BrandShell";
import BoardPortrait from "@/components/interview/BoardPortrait";
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
  ["Follow-ups and push-back", "Members take turns, probe what you said and challenge a weak answer, like the real panel."],
  ["Answer out loud, on camera", "You speak your answers. Your video stays on your device for you to watch back."],
  ["A scored report", "Content, clarity, balance, honesty and depth, with a stronger version of your weak answers."],
];

// Seat order on screen: the Chairman in the middle.
const SEATS = [
  { member: 1, title: "Member" },
  { member: 2, title: "Member" },
  { member: 0, title: "Chairman" },
  { member: 3, title: "Member" },
  { member: 4, title: "Member" },
];

/** A still of the practice board: five members behind the table, the Chairman speaking. */
function BoardPreview() {
  return (
    <figure className="overflow-hidden rounded-[28px] bg-[#0d1226] p-5 shadow-[0_30px_60px_-30px_rgba(13,18,38,0.7)] sm:p-7">
      <div className="flex items-center justify-between text-[12px] text-white/60">
        <span className="flex items-center gap-2 font-bold text-white"><span className="h-2 w-2 rounded-full bg-[#ff4a3d]" />Practice Board</span>
        <span>Question 3 of 8</span>
      </div>
      <div className="mt-5 grid grid-cols-5 items-end gap-2 sm:gap-3">
        {SEATS.map(({ member }) => {
          const talking = member === 0;
          return (
            <div key={member} className={member === 0 ? "" : "sm:scale-[0.94] sm:origin-bottom"}>
              <div className={`relative aspect-[4/5] overflow-hidden rounded-[10px] bg-gradient-to-b from-[#2c355c] to-[#1b2241] sm:rounded-[14px] ${talking ? "ring-2 ring-[#FFE45C]" : "ring-1 ring-white/10"}`}>
                <div className="absolute inset-x-0 bottom-0 top-[6%]"><BoardPortrait member={member} talking={false} label={member === 0 ? "Chairman" : "Board member"} /></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative z-10 -mt-3 grid grid-cols-5 gap-2 rounded-[8px] bg-gradient-to-b from-[#7d5735] via-[#5f4026] to-[#3f2a18] px-1 pb-2 pt-2.5 sm:-mt-4 sm:gap-3 sm:rounded-[12px] sm:px-2 sm:pb-3 sm:pt-3.5">
        {SEATS.map(({ member, title }) => (
          <span key={member} className={`mx-auto w-[92%] truncate rounded-[3px] bg-gradient-to-b from-[#efe0ad] to-[#b9995a] px-1 py-0.5 text-center text-[7px] font-bold uppercase tracking-[0.08em] text-[#2b2210] shadow-[0_2px_0_#6b5629] sm:text-[10px] ${member === 0 ? "outline outline-2 outline-[#FFE45C]" : ""}`}>{title}</span>
        ))}
      </div>
      <figcaption className="mt-5 rounded-[14px] bg-black/40 px-4 py-3 text-center text-[14px] leading-[1.5] text-white sm:text-[16px]">
        <span className="mr-1.5 text-[12px] font-bold text-[#FFE45C]">Chairman:</span>
        I see you are from Jaipur. As District Magistrate, how would you handle a summer water crisis?
      </figcaption>
    </figure>
  );
}

export default function InterviewPracticePage({ searchParams }: { searchParams: Promise<{ src?: string }> }) {
  return (
    <BrandShell>
      <div className="pb-24 pt-28 sm:pt-36">
        {/* Phones: headline, form, preview, points. Wide screens: everything left, the form sticks on the right. */}
        <div className="mx-auto grid max-w-[1160px] gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10">
          <header className="lg:col-start-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#e9edff] px-3 py-1 text-s font-bold text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />In testing · free for testers
            </p>
            <h1 className="t-display mt-5 max-w-[620px] text-[40px] leading-[1.05] sm:text-[54px]">The UPSC interview, practised before the real one</h1>
            <p className="mt-5 max-w-[560px] text-m leading-[1.65] text-[var(--ink-2)]">
              Human mock interviews cost money and need a booked slot. We are building a practice board you can face from home, as often as you like. Before we launch, we want aspirants to test it and tell us what it must do.
            </p>
          </header>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <BetaForm searchParams={searchParams} />
            </div>
          </div>

          <div className="space-y-8 lg:col-start-1">
            <BoardPreview />
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {POINTS.map(([h, p]) => (
                <li key={h} className="flex gap-4">
                  <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9edff] text-[var(--accent)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </span>
                  <div>
                    <p className="text-m font-bold">{h}</p>
                    <p className="mt-1 text-s leading-[1.55] text-[var(--ink-2)]">{p}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="max-w-[560px] border-t border-[var(--line)] pt-6 text-s leading-[1.6] text-[var(--muted)]">
              It is practice, not a prediction of your marks. Testers get free access first. We only use your details to invite you and ask for feedback.
            </p>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
