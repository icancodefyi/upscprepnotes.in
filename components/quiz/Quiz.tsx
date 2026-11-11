"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Gilu, { type GiluPose } from "@/components/brand/Gilu";
import posthog from "posthog-js";
import { track } from "@/lib/track";
import type { QuizQuestion } from "@/lib/quiz/prelims-2024";
import { HINTS_2024 } from "@/lib/quiz/hints-2024";
import { shareCode } from "@/lib/quiz/share";
import {
  BADGES, CUTOFF_2024_GENERAL, EMPTY, EXAM_PACE_S, SETS, SET_SIZE,
  MILESTONES, dailySetIndex, finishRun, fmtMarks, istDay, joinChallenge, levelFor, loadProgress, nextMilestone,
  resetProgress, saveProgress, totalMarks, xpFor,
  type Answer, type Badge, type Pick, type Progress, type Run,
} from "@/lib/quiz/engine";
import { Flame, Mark, Medal, TrackIcon } from "@/components/brand/icons";
import "./quiz.css";

/** Every quiz event goes to PostHog and to our own tracking under the same name, so both dashboards agree. */
function qev(event: string, props: Parameters<typeof track>[1] = {}) {
  track(event, props);
  try { posthog.capture(event, props as Record<string, unknown>); } catch {}
}

/* Phone first. At lg (1024px+) each screen becomes two columns and the bottom action bar moves into the page. */

const C = {
  blue: "#1f3fd6", blueDeep: "#13238a", blueSoft: "#eef1ff",
  red: "#ff4a3d", redDeep: "#c42b22", redSoft: "#fff1ef",
  green: "#1a8a4a", greenSoft: "#eafaf0",
  yellow: "#ffe45c", yellowSoft: "#fff8d6",
  ink: "#0b0c10", ink2: "#3f4450", muted: "#5f6571", line: "rgba(11,12,16,0.12)", canvas: "#f4f5f9", track: "#e3e6ee",
};
const LETTERS = ["a", "b", "c", "d"];
const card = { boxShadow: `inset 0 0 0 1.5px ${C.line}` };

const SAYS = {
  start: ["Five real UPSC questions. Let's see what you've got.", "Same questions UPSC asked in 2024. No pressure. Okay, a little pressure."],
  think: ["Read every statement. UPSC hides traps in small words.", "Not sure? A skip costs 0. A wrong answer costs 0.66.", "Cut two options first, then decide.", "Take your time. The real exam gives you 72 seconds.", "Trust what you've studied."],
  hint: "I crossed out two wrong ones. Your call now.",
  right: ["Sahi jawab! +2 in the bag.", "Topper move.", "Clean. Exactly how it's done.", "You read that like an examiner."],
  wrong: ["Oof, −0.66. UPSC loves this trap.", "Happens to the best. Read why.", "Classic trap. Now you'll never miss it."],
  skip: ["Smart skip. 0 beats −0.66 when you're unsure.", "Skipping is strategy, not weakness."],
};

function haptic(p: number | number[]) {
  try { navigator.vibrate?.(p); } catch {}
}

/* ---------- shared pieces ---------- */

function Bubble({ text, tone = "plain", side = "left" }: { text: string; tone?: "plain" | "good" | "bad"; side?: "left" | "top" }) {
  const bg = tone === "good" ? C.greenSoft : tone === "bad" ? C.redSoft : "#ffffff";
  const bd = tone === "good" ? C.green : tone === "bad" ? C.red : C.line;
  return (
    <div key={text} className="qz-pop relative rounded-2xl px-3.5 py-2.5 text-[15px] font-bold leading-snug lg:px-4 lg:py-3 lg:text-[16px]" style={{ background: bg, boxShadow: `0 0 0 1.5px ${bd}`, color: C.ink }}>
      {text}
      {side === "left" ? (
        <span aria-hidden="true" className="absolute -left-[7px] top-5 h-3 w-3 rotate-45" style={{ background: bg, boxShadow: `-1.5px 1.5px 0 0 ${bd}` }} />
      ) : (
        <span aria-hidden="true" className="absolute -bottom-[7px] left-10 h-3 w-3 rotate-45" style={{ background: bg, boxShadow: `1.5px 1.5px 0 0 ${bd}` }} />
      )}
    </div>
  );
}

function LevelBar({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const lv = levelFor(xp);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className={`${compact ? "text-[15px]" : "text-[17px]"} font-bold`} style={{ color: C.ink }}>Level {lv.index} · {lv.name}</p>
        <p className="tab text-[13px]" style={{ color: C.muted }}>{lv.next ? `${xp} / ${lv.next.xp} XP` : `${xp} XP`}</p>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: C.track }}>
        <div className="qz-fill h-full rounded-full" style={{ width: `${Math.round(lv.pct * 100)}%`, background: `linear-gradient(90deg, ${C.blue}, #6f87f7)` }} />
      </div>
      {lv.next && <p className="mt-1.5 text-[13px]" style={{ color: C.muted }}>{lv.next.xp - xp} XP to {lv.next.name}</p>}
    </div>
  );
}

type IconName = "share" | "whatsapp" | "replay" | "home" | "play" | "next" | "skip" | "half" | "flag";

/** One icon family for every button: bold rounded strokes, 24px grid, to sit with Gilu's outlined art. */
function Ico({ name, className = "h-[18px] w-[18px]" }: { name: IconName; className?: string }) {
  const st = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === "share" && <path {...st} d="M12 15V4M12 4 8 8M12 4l4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />}
      {name === "replay" && <path {...st} d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4.4h-4.4" />}
      {name === "home" && <path {...st} d="M4 11.5 12 4l8 7.5M6.5 10v9.5h4v-5.5h3v5.5h4V10" />}
      {name === "next" && <path {...st} d="M5 12h13M12.5 6 18.5 12l-6 6" />}
      {name === "flag" && <path {...st} d="M6 21V4M6 5h11.5l-2.3 4 2.3 4H6" />}
      {name === "play" && <path fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M8.5 5.5v13l10-6.5z" />}
      {name === "skip" && <><path fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M5.5 5.5v13l9-6.5z" /><path {...st} d="M18.5 5.5v13" /></>}
      {name === "half" && <><circle cx="12" cy="12" r="8" {...st} /><path fill="currentColor" d="M12 4a8 8 0 0 0 0 16z" /></>}
      {name === "whatsapp" && (
        <>
          <path fill="currentColor" d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.2A9.5 9.5 0 1 0 12 2.5Z" />
          <path fill="#25D366" d="M16.6 14.1c-.3-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2 4.7 4.7 0 0 0 1 2.5 10.7 10.7 0 0 0 4.2 3.7c1.6.6 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.3-.2-.6-.3Z" />
        </>
      )}
    </svg>
  );
}

type BtnKind = "primary" | "ghost" | "yellow" | "green";
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: BtnKind; icon?: IconName; iconAfter?: boolean; ref?: React.Ref<HTMLButtonElement> };

const BTN_STYLE: Record<BtnKind, { box: React.CSSProperties; chip: string }> = {
  primary: { box: { background: `linear-gradient(180deg, #3a58e4, ${C.blue})`, color: "#fff", boxShadow: `0 4px 0 ${C.blueDeep}, inset 0 1px 0 rgba(255,255,255,.3)` }, chip: "rgba(255,255,255,.2)" },
  yellow: { box: { background: `linear-gradient(180deg, #ffec85, ${C.yellow})`, color: C.ink, boxShadow: `0 4px 0 #c9a800, inset 0 1px 0 rgba(255,255,255,.6)` }, chip: "rgba(11,12,16,.1)" },
  green: { box: { background: "linear-gradient(180deg, #3ee27d, #25d366)", color: "#fff", boxShadow: "0 4px 0 #128c4a, inset 0 1px 0 rgba(255,255,255,.35)" }, chip: "rgba(255,255,255,.22)" },
  ghost: { box: { background: "#fff", color: C.ink, boxShadow: `inset 0 0 0 1.5px ${C.line}, 0 3px 0 #e3e6ee` }, chip: C.blueSoft },
};

function Btn({ children, kind = "primary", icon, iconAfter = false, className = "", ...rest }: BtnProps) {
  const { box, chip } = BTN_STYLE[kind];
  const mark = icon ? (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: chip, color: kind === "ghost" ? C.blue : "inherit" }}>
      <Ico name={icon} />
    </span>
  ) : null;
  return (
    <button type="button" className={`inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl px-4 text-[16.5px] font-bold leading-none transition-transform hover:brightness-105 active:translate-y-[3px] disabled:opacity-45 ${className}`} style={box} {...rest}>
      {!iconAfter && mark}
      <span className="min-w-0">{children}</span>
      {iconAfter && mark}
    </button>
  );
}

/** Fixed to the bottom on phones; on laptops the same buttons sit in the page instead. */
function MobileBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden" style={{ borderColor: C.line }}>
      <div className="mx-auto max-w-[520px]">{children}</div>
    </div>
  );
}

function Shell({ children, wide = true }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={`mx-auto w-full max-w-[520px] px-4 pb-40 pt-4 sm:max-w-[600px] lg:pb-16 lg:pt-8 ${wide ? "lg:max-w-[1120px] lg:px-8" : ""}`}>{children}</div>;
}

function TopBar({ xp }: { xp: number }) {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-[15px] font-bold lg:text-[17px]" style={{ color: C.ink }}>UPSCPrepNotes</Link>
      <span className="rounded-full px-3 py-1 text-[13px] font-bold lg:text-[14px]" style={{ background: C.blueSoft, color: C.blue }}>Level {levelFor(xp).index} · {xp} XP</span>
    </header>
  );
}

/* ---------- the 30-day challenge ---------- */

/** Where along the track a streak sits: stops are evenly spaced, from day 0 to day 30. */
function trackPos(streak: number): number {
  const days = [0, ...MILESTONES.map((m) => m.day)];
  const last = days.length - 1;
  if (streak >= days[last]) return 100;
  let k = 0;
  while (streak >= days[k + 1]) k++;
  return ((k + (streak - days[k]) / (days[k + 1] - days[k])) / last) * 100;
}

function MilestoneTrack({ progress, onJoin }: { progress: Progress; onJoin: () => void }) {
  const joined = !!progress.joined;
  const streak = progress.streak;
  const next = nextMilestone(streak);
  const pos = trackPos(streak);
  const togo = next ? next.day - streak : 0;
  const nextLine = next
    ? next.worth
      ? <><b>{togo} more {togo === 1 ? "day" : "days"}</b> to {next.pay === 0 ? <>a free <b>{next.title}</b> (worth ₹{next.worth})</> : <><b>{next.reward}</b> the {next.title} (₹{next.pay} instead of ₹{next.worth})</>}</>
      : <><b>{togo} more {togo === 1 ? "day" : "days"}</b> to a <b>streak shield</b>: miss a day without losing your streak</>
    : <><b>Challenge complete.</b> You&apos;re in the top 1% of aspirants for consistency.</>;

  return (
    <section className="rounded-3xl bg-white p-4 lg:p-5" style={{ boxShadow: `inset 0 0 0 1.5px ${joined ? "#c6d1ff" : C.line}` }}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[19px] font-bold" style={{ color: C.ink }}>30-day challenge</h2>
        <p className="tab text-[13px] font-bold" style={{ color: joined ? C.blue : C.muted }}>
          {joined ? `Day ${streak} of 30` : "Not joined yet"}
        </p>
      </div>

      <div className="relative mx-2 mt-14 lg:mx-4" aria-hidden="true">
        <div className="h-2 rounded-full" style={{ background: C.track }} />
        <div className="qz-fill absolute left-0 top-0 h-2 rounded-full" style={{ width: `${pos}%`, background: `linear-gradient(90deg, ${C.yellow}, #ffb020)` }} />
        <div className="qz-fill absolute -top-[52px] transition-[left] duration-700" style={{ left: `${pos}%`, transform: "translateX(-55%)" }}>
          <Gilu pose={streak > 0 ? "run" : "hello"} size={streak > 0 ? 64 : 40} className={streak > 0 ? "h-auto w-[60px]" : "h-auto w-[38px]"} />
        </div>
        {MILESTONES.map((m, k) => {
          const left = ((k + 1) / MILESTONES.length) * 100;
          const got = progress.unlocked.includes(m.id);
          const isNext = next?.id === m.id;
          return (
            <div key={m.id} className="absolute top-1 -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%` }}>
              <span className={`block rounded-full ${isNext && joined ? "qz-glow" : ""}`}>
                <TrackIcon id={m.id} got={got} size={34} />
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-5 gap-1 text-center">
        {MILESTONES.map((m) => {
          const got = progress.unlocked.includes(m.id);
          return (
            <div key={m.id} className="min-w-0">
              <p className="tab text-[12px] font-bold" style={{ color: got ? "#8a6d00" : C.ink }}>Day {m.day}</p>
              <p className="text-[11.5px] font-bold leading-tight" style={{ color: m.pay === 0 ? C.green : C.ink2 }}>{m.reward}</p>
              <p className="tab text-[11px] leading-tight" style={{ color: C.muted }}>{m.worth ? `₹${m.worth}` : "for 1 day"}</p>
            </div>
          );
        })}
      </div>

      {joined ? (
        <p className="mt-4 rounded-2xl px-3.5 py-3 text-[14.5px] leading-snug" style={{ background: C.yellowSoft, color: C.ink }}>{nextLine}</p>
      ) : (
        <div className="mt-4">
          <p className="text-[14.5px] leading-snug" style={{ color: C.ink2 }}>
            Play the daily 5 every day. Get the <b style={{ color: C.ink }}>{MILESTONES[1].title}</b> free at day 7, the <b style={{ color: C.ink }}>{MILESTONES[2].title}</b> free at day 10, and big discounts at 21 and 30.
          </p>
          <Btn onClick={onJoin} kind="yellow" icon="flag" className="mt-3" data-track="quiz-join">Join the challenge</Btn>
          <p className="mt-2 text-[12px]" style={{ color: C.muted }}>Your progress is saved on this device.</p>
        </div>
      )}

      {progress.unlocked.some((id) => id !== "m3") && (
        <div className="mt-3 space-y-2">
          {MILESTONES.filter((m) => m.worth && progress.unlocked.includes(m.id)).map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ boxShadow: `inset 0 0 0 1.5px ${C.yellow}`, background: "#fffdf0" }}>
              <TrackIcon id={m.id} got size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold" style={{ color: C.ink }}>{m.title}</p>
                <p className="text-[12.5px]" style={{ color: C.ink2 }}>{m.pay === 0 ? `Free · worth ₹${m.worth}` : `${m.reward} · ₹${m.pay} instead of ₹${m.worth}`}</p>
              </div>
              <span className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: C.canvas, color: C.muted }}>Claim with sign-in</span>
            </div>
          ))}
        </div>
      )}
      {progress.shields > 0 && (
        <p className="mt-3 text-[13px] font-bold" style={{ color: C.blue }}>
          {progress.shields} streak shield{progress.shields > 1 ? "s" : ""} ready: miss a day and your streak survives.
        </p>
      )}
    </section>
  );
}

/* ---------- home ---------- */

function Home({ progress, onPlay, onReset, onJoin, install }: { progress: Progress; onPlay: (set: number, daily: boolean) => void; onReset: () => void; onJoin: () => void; install: InstallState }) {
  // Re-check the Indian calendar day every minute, so the new set appears at midnight without a reload.
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);
  const today = istDay();
  const doneToday = progress.lastDailyDay === today;
  const daily = dailySetIndex(today);
  const subjects = Object.entries(progress.subjects)
    .map(([s, v]) => ({ s, pct: v && v.total ? v.right / v.total : 0, n: v?.total ?? 0 }))
    .sort((a, b) => b.n - a.n);
  const weakest = [...subjects].filter((x) => x.n >= 2).sort((a, b) => a.pct - b.pct)[0];
  const say = progress.history.length === 0 ? SAYS.start[0]
    : doneToday ? "Done for today! Come back tomorrow for 5 new questions."
      : progress.streak > 0 ? `Day ${progress.streak + 1} is waiting. Don't break the streak!`
        : SAYS.start[1];

  const cta = doneToday ? (
    <p className="rounded-2xl px-5 py-4 text-[16px] font-bold" style={{ background: C.yellowSoft, color: C.ink }}>Come back tomorrow at midnight for 5 new questions.</p>
  ) : (
    <Btn onClick={() => onPlay(daily, true)} icon="play" className="qz-glow" data-track="quiz-start">Play today&apos;s 5</Btn>
  );
  const ctaNote = doneToday ? "Everyone gets the same five each day. New set at 12am IST." : "Everyone gets the same five each day · About 5 minutes · no sign-up needed";

  return (
    <Shell>
      <TopBar xp={progress.xp} />
      <div className="lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <section className="mt-6 flex items-end gap-3 lg:mt-0 lg:gap-5">
            <Gilu pose={doneToday ? "celebrating" : "hello"} size={200} className="h-auto w-[112px] shrink-0 lg:w-[190px]" />
            <div className="mb-6 min-w-0 flex-1 lg:mb-14"><Bubble text={say} /></div>
          </section>
          <h1 className="mt-2 text-[34px] font-bold leading-[1.05] tracking-[-0.03em] lg:mt-6 lg:text-[56px]" style={{ color: C.ink }}>Daily UPSC quiz</h1>
          <p className="mt-2 text-[16px] leading-relaxed lg:mt-4 lg:max-w-[46ch] lg:text-[19px]" style={{ color: C.ink2 }}>
            Five real questions a day from the UPSC Prelims 2024 paper, marked the exam way: <b style={{ color: C.green }}>+2</b> right,{" "}
            <b style={{ color: C.redDeep }}>−0.66</b> wrong, <b>0</b> skipped.
          </p>
          <div className="mt-8 hidden max-w-[380px] lg:block">
            {cta}
            <p className="mt-2.5 text-[14px]" style={{ color: C.muted }}>{ctaNote}</p>
          </div>
          <ul className="mt-8 hidden gap-5 text-[14px] lg:flex" style={{ color: C.ink2 }}>
            <li><b style={{ color: C.ink }}>Gilu</b> reacts to every answer</li>
            <li><b style={{ color: C.ink }}>50:50</b> hint once a set</li>
            <li><b style={{ color: C.ink }}>Streaks</b>, XP and badges</li>
          </ul>
        </div>

        <div>
          <div className="mt-5 grid grid-cols-3 gap-2.5 lg:mt-0 lg:gap-3">
            <div className="rounded-2xl bg-white p-3 lg:p-4" style={card}>
              <div className="flex items-center gap-1"><Flame on={progress.streak > 0} size={24} /><span className="tab text-[24px] font-bold lg:text-[28px]" style={{ color: C.ink }}>{progress.streak}</span></div>
              <p className="mt-0.5 text-[13px]" style={{ color: C.muted }}>day streak</p>
            </div>
            <div className="rounded-2xl bg-white p-3 lg:p-4" style={card}>
              <p className="tab text-[24px] font-bold lg:text-[28px]" style={{ color: C.ink }}>{progress.xp}</p>
              <p className="mt-0.5 text-[13px]" style={{ color: C.muted }}>XP earned</p>
            </div>
            <div className="rounded-2xl bg-white p-3 lg:p-4" style={card}>
              <p className="tab text-[24px] font-bold lg:text-[28px]" style={{ color: C.ink }}>{progress.best === null ? "–" : fmtMarks(progress.best)}</p>
              <p className="mt-0.5 text-[13px]" style={{ color: C.muted }}>best score</p>
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-white p-4 lg:p-5" style={card}><LevelBar xp={progress.xp} /></div>

          <div className="mt-3"><MilestoneTrack progress={progress} onJoin={onJoin} /></div>

          <section className="mt-6">
            <h2 className="text-[19px] font-bold" style={{ color: C.ink }}>Your prep</h2>
            <div className="mt-3 rounded-2xl bg-white p-4 lg:p-5" style={card}>
              {subjects.length === 0 ? (
                <p className="text-[15px] leading-relaxed" style={{ color: C.ink2 }}>Play a set and Gilu will show how strong you are in each subject: Polity, Economy, Geography and more.</p>
              ) : (
                <div className="space-y-3">
                  {subjects.map(({ s, pct, n }) => (
                    <div key={s}>
                      <div className="flex justify-between text-[14px]">
                        <span className="font-bold" style={{ color: C.ink }}>{s}</span>
                        <span className="tab" style={{ color: C.muted }}>{Math.round(pct * 100)}% of {n}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: C.track }}>
                        <div className="qz-fill h-full rounded-full" style={{ width: `${Math.max(3, Math.round(pct * 100))}%`, background: pct >= 0.6 ? C.green : pct >= 0.4 ? "#e0a400" : C.red }} />
                      </div>
                    </div>
                  ))}
                  {weakest && weakest.pct < 0.6 && (
                    <p className="pt-1 text-[14px]" style={{ color: C.ink2 }}>Gilu&apos;s tip: <b>{weakest.s}</b> needs work. More questions on it soon.</p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[19px] font-bold" style={{ color: C.ink }}>Badges</h2>
              <p className="tab text-[13px]" style={{ color: C.muted }}>{progress.badges.length} of {BADGES.length}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {BADGES.map((b) => {
                const got = progress.badges.includes(b.id);
                return (
                  <div key={b.id} className="flex items-center gap-2.5 rounded-2xl bg-white p-3" style={{ boxShadow: `inset 0 0 0 1.5px ${got ? C.yellow : C.line}` }}>
                    <Medal id={b.id} locked={!got} size={40} />
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold leading-tight" style={{ color: C.ink }}>{b.name}</p>
                      <p className="text-[12px] leading-tight" style={{ color: C.muted }}>{b.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-8">
            <InstallCard install={install} />
          </div>

          <p className="mt-8 text-[13px] leading-relaxed" style={{ color: C.muted }}>
            Questions are from UPSC Civil Services Prelims 2024, GS Paper I. Progress is saved on this device.{" "}
            <button type="button" onClick={onReset} className="underline underline-offset-2">Reset my progress</button>
          </p>
        </div>
      </div>

      <MobileBar>
        {cta}
        <p className="mt-2 text-center text-[13px]" style={{ color: C.muted }}>{ctaNote}</p>
      </MobileBar>
    </Shell>
  );
}

/* ---------- play ---------- */

function Play({ setIndex, daily, onDone, onExit }: { setIndex: number; daily: boolean; onDone: (run: Run) => void; onExit: () => void }) {
  const questions = SETS[setIndex];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Pick | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [hidden, setHidden] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintNow, setHintNow] = useState(false);
  // 0 = no hint, 1 = Gilu is crossing options out, 2 = done.
  const [hintPhase, setHintPhase] = useState<0 | 1 | 2>(0);
  const started = useRef(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const optsRef = useRef<HTMLDivElement>(null);
  const q = questions[i];
  const score = totalMarks(answers);
  const revealed = picked !== null;
  const last = answers[answers.length - 1];
  const isLast = i === questions.length - 1;

  useEffect(() => {
    started.current = performance.now();
    const t = setInterval(() => setElapsed(Math.floor((performance.now() - started.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [i]);

  const answer = useCallback((p: Pick) => {
    if (picked !== null) return;
    if (typeof p === "number" && hidden.includes(p)) return;
    const correct = p !== "skip" && p === q.answer;
    const a: Answer = { qid: q.id, pick: p, correct, ms: Math.round(performance.now() - started.current) };
    const nextCombo = p === "skip" ? combo : correct ? combo + 1 : 0;
    setPicked(p);
    setAnswers((prev) => [...prev, a]);
    setCombo(nextCombo);
    setMaxCombo((m) => Math.max(m, nextCombo));
    setXp((x) => x + Math.max(2, xpFor(a, nextCombo) - (hintNow && correct ? 10 : 0)));
    if (p === "skip") haptic(15); else if (correct) haptic(30); else haptic([40, 50, 40]);
    qev("quiz_answer", { qid: q.id, result: p === "skip" ? "skip" : correct ? "right" : "wrong", ms: a.ms, daily, hint: hintNow });
    // Let the reaction play, then bring the explanation into view (on phones it sits below the options).
    setTimeout(() => {
      if (window.matchMedia("(max-width: 1023px)").matches) whyRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      nextRef.current?.focus({ preventScroll: true });
    }, 900);
  }, [picked, hidden, q, combo, daily, hintNow]);

  const applyHint = useCallback(() => {
    if (hintUsed || revealed) return;
    const preset = HINTS_2024[q.id];
    const wrong = [0, 1, 2, 3].filter((k) => k !== q.answer);
    const cross = preset ? preset.cross : wrong.filter((k) => k !== wrong[(q.qno + i) % wrong.length]);
    setHidden([...cross]);
    setHintUsed(true);
    setHintNow(true);
    setHintPhase(1);
    // Two strikes at 0s and 0.55s, each 0.5s long, then Gilu hands it back.
    setTimeout(() => setHintPhase((ph) => (ph === 1 ? 2 : ph)), 1400);
    haptic(20);
    setTimeout(() => haptic(20), 550);
    // On phones the lower options can sit under the button bar; bring them all into view.
    if (window.matchMedia("(max-width: 1023px)").matches) optsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    qev("quiz_hint", { qid: q.id });
  }, [hintUsed, revealed, q, i]);

  const next = useCallback(() => {
    if (!isLast) {
      setI(i + 1);
      setPicked(null);
      setElapsed(0);
      setHidden([]);
      setHintNow(false);
      setHintPhase(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onDone({ setIndex, daily, answers, maxCombo, xp });
    }
  }, [isLast, i, onDone, setIndex, daily, answers, maxCombo, xp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (!revealed && ["1", "2", "3", "4", "a", "b", "c", "d"].includes(k)) answer(/\d/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k));
      else if (!revealed && k === "s") answer("skip");
      else if (!revealed && k === "h") applyHint();
      else if (revealed && k === "enter" && document.activeElement !== nextRef.current) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, revealed, next, applyHint]);

  let pose: GiluPose = "thinking";
  let say = hintNow && !revealed ? (hintPhase === 1 ? "Watch. Crossing out two wrong ones…" : SAYS.hint) : SAYS.think[i % SAYS.think.length];
  let tone: "plain" | "good" | "bad" = "plain";
  if (revealed && last) {
    if (last.pick === "skip") { pose = "reading"; say = SAYS.skip[i % SAYS.skip.length]; }
    else if (last.correct) { pose = "correct"; tone = "good"; say = combo >= 2 ? `${combo} in a row! You're on fire.` : SAYS.right[i % SAYS.right.length]; }
    else { pose = "wrong"; tone = "bad"; say = SAYS.wrong[i % SAYS.wrong.length]; }
  }
  const float = revealed && last && last.pick !== "skip" ? (last.correct ? "+2" : "−0.66") : null;

  const actions = revealed ? (
    <Btn ref={nextRef} onClick={next} icon="next" iconAfter data-track="quiz-next">{isLast ? "See my score" : "Next question"}</Btn>
  ) : (
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <Btn onClick={() => answer("skip")} kind="ghost" icon="skip" data-track="quiz-skip">Skip <span className="font-normal" style={{ color: C.muted }}>· 0 marks</span></Btn>
      <Btn onClick={applyHint} kind="yellow" icon="half" disabled={hintUsed} className="!w-auto px-4" data-track="quiz-hint" aria-label={hintUsed ? "50:50 hint already used this set" : "Use the 50:50 hint: remove two wrong options"}>
        50:50
      </Btn>
    </div>
  );

  const progressBar = (
    <div className="flex flex-1 gap-1.5" aria-label={`Question ${i + 1} of ${questions.length}`}>
      {questions.map((_, k) => {
        const a = answers[k];
        const bg = a ? (a.pick === "skip" ? "#c9cfdd" : a.correct ? C.green : C.red) : k === i ? C.blue : C.track;
        return <span key={k} className="h-2.5 flex-1 rounded-full transition-colors lg:h-3" style={{ background: bg }} />;
      })}
    </div>
  );

  const scorePill = (
    <span key={score} className="qz-bump tab min-w-[68px] rounded-full px-3 py-1 text-center text-[15px] font-bold lg:text-[16px]" style={{ background: score > 0 ? C.greenSoft : score < 0 ? C.redSoft : "#fff", color: score > 0 ? C.green : score < 0 ? C.redDeep : C.ink, boxShadow: `inset 0 0 0 1.5px ${C.line}` }}>
      {fmtMarks(score)}
    </span>
  );

  const giluFig = (size: number, cls: string) => (
    <div className="relative shrink-0">
      <Gilu key={pose + i} pose={pose} size={size} className={cls} />
      {float && (
        <span key={`f${i}`} className="qz-float tab absolute left-1/2 top-0 text-[22px] font-bold lg:text-[30px]" style={{ color: last?.correct ? C.green : C.redDeep }} aria-hidden="true">{float}</span>
      )}
    </div>
  );

  return (
    <Shell>
      <div className="sticky top-0 z-20 -mx-4 bg-[#f4f5f9]/95 px-4 pb-3 pt-2 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:backdrop-blur-none">
        <div className="flex items-center gap-3 lg:gap-5">
          <button type="button" onClick={onExit} aria-label="Quit the quiz" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white hover:bg-[#f7f8fb]" style={card}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
          <span className="hidden text-[15px] font-bold lg:inline" style={{ color: C.ink }}>Question {i + 1} of {questions.length}</span>
          {progressBar}
          {scorePill}
        </div>
      </div>

      <div className="lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <div>
          <div className="relative mt-2 flex items-end gap-2 lg:hidden">
            {giluFig(96, "h-auto w-[84px]")}
            <div className="mb-5 min-w-0 flex-1" aria-live="polite"><Bubble text={say} tone={tone} /></div>
          </div>

          <article key={q.id} className={`qz-in mt-3 rounded-3xl bg-white p-5 lg:mt-0 lg:p-8 ${revealed && last && last.pick !== "skip" && !last.correct ? "qz-shake" : ""}`} style={{ boxShadow: `0 0 0 1.5px ${C.line}, 0 10px 30px -18px rgba(11,12,16,.35)` }}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] lg:text-[14px]" style={{ color: C.muted }}>
              <span><b style={{ color: C.blue }}>{q.subject}</b> · UPSC {q.year} · Q{q.qno}</span>
              <span className="tab rounded-full px-2 py-0.5" style={{ background: C.canvas }}>{revealed ? `${Math.round((last?.ms ?? 0) / 1000)}s` : `${elapsed}s`}</span>
            </div>
            <h2 className="mt-3 text-[18px] font-bold leading-snug lg:mt-4 lg:text-[22px]" style={{ color: C.ink }}>{q.question}</h2>
            {q.items && (
              <ul className="mt-3 space-y-2 lg:mt-4">
                {q.items.map((it) => (
                  <li key={it} className="rounded-xl px-3 py-2 text-[15.5px] leading-snug lg:px-4 lg:py-2.5 lg:text-[17px]" style={{ background: C.canvas, color: C.ink }}>{it}</li>
                ))}
              </ul>
            )}
            {q.ask && <p className="mt-3 text-[16px] font-bold leading-snug lg:mt-4 lg:text-[18px]" style={{ color: C.ink }}>{q.ask}</p>}

            <div ref={optsRef} className="mt-4 space-y-2.5 lg:mt-6 lg:space-y-3" role="group" aria-label="Options" style={{ scrollMarginBottom: 120, scrollMarginTop: 80 }}>
              {q.options.map((opt, k) => {
                const isAns = k === q.answer;
                const isPick = picked === k;
                const gone = !revealed && hidden.includes(k);
                const order = hidden.indexOf(k);
                const delay = order * 0.55;
                const why = gone ? HINTS_2024[q.id]?.why[HINTS_2024[q.id].cross.indexOf(k)] : undefined;
                let bg = "#fff", ring = C.line, dot = C.canvas, dotInk = C.ink, op = 1;
                if (revealed) {
                  if (isAns) { bg = C.greenSoft; ring = C.green; dot = C.green; dotInk = "#fff"; }
                  else if (isPick) { bg = C.redSoft; ring = C.red; dot = C.red; dotInk = "#fff"; }
                  else op = 0.5;
                } else if (gone) { bg = "#fbfbfc"; ring = "rgba(255,74,61,0.35)"; }
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={revealed || gone}
                    onClick={() => answer(k)}
                    aria-label={gone ? `Option ${LETTERS[k]} crossed out by the hint${why ? `: ${why}` : ""}` : undefined}
                    className="group flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[16px] leading-snug transition-[transform,box-shadow,background] enabled:hover:-translate-y-[1px] enabled:hover:bg-[#f7f8ff] enabled:active:scale-[0.99] lg:min-h-[64px] lg:gap-4 lg:px-5 lg:text-[17px]"
                    style={{ background: bg, boxShadow: `inset 0 0 0 ${revealed && (isAns || isPick) ? 2.5 : 1.5}px ${ring}`, opacity: op, color: C.ink }}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[15px] font-bold transition-colors group-enabled:group-hover:bg-[#dfe5ff] lg:h-9 lg:w-9" style={{ background: dot, color: dotInk }}>
                      {revealed && isAns ? <Mark kind="check" size={16} /> : revealed && isPick ? <Mark kind="cross" size={16} /> : LETTERS[k]}
                    </span>
                    <span className="flex-1">
                      <span className={gone ? "qz-strike" : undefined} style={gone ? { animationDelay: `${delay}s`, color: "#8a8f9a", transition: `color .3s ${delay + 0.3}s` } : undefined}>{opt}</span>
                      {why && (
                        <span className="qz-why mt-1.5 flex items-start gap-1.5 text-[13px] font-bold leading-snug lg:text-[14px]" style={{ color: C.redDeep, animationDelay: `${delay + 0.4}s` }}>
                          <span className="mt-[2px] shrink-0"><Mark kind="cross" size={13} /></span><span>{why}</span>
                        </span>
                      )}
                    </span>
                    <span className="hidden text-[12px] font-bold lg:inline" style={{ color: "#a3a8b4" }} aria-hidden="true">{revealed || gone ? "" : k + 1}</span>
                  </button>
                );
              })}
            </div>
          </article>

          {revealed && (
            <section ref={whyRef} className="qz-up mt-3 rounded-3xl p-5 lg:mt-4 lg:p-7" style={{ background: C.yellowSoft, boxShadow: `inset 0 0 0 1.5px #f2d36b`, scrollMarginBottom: 120 }}>
              <p className="text-[15px] font-bold lg:text-[17px]" style={{ color: C.ink }}>Answer: ({LETTERS[q.answer]}) {q.options[q.answer]}</p>
              <p className="mt-2 text-[15.5px] leading-relaxed lg:text-[17px]" style={{ color: C.ink2 }}>{q.explain}</p>
              <p className="mt-3 text-[12px] lg:text-[13px]" style={{ color: C.muted }}>UPSC CSE Prelims {q.year}, GS Paper I, Q{q.qno}</p>
            </section>
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-8 lg:block">
          <div className="rounded-3xl bg-white p-6" style={{ boxShadow: `0 0 0 1.5px ${C.line}, 0 10px 30px -18px rgba(11,12,16,.35)` }}>
            <div aria-live="polite"><Bubble text={say} tone={tone} side="top" /></div>
            <div className="mt-4 flex justify-center">{giluFig(220, "h-auto w-[200px]")}</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl py-2" style={{ background: C.greenSoft }}><p className="tab text-[20px] font-bold" style={{ color: C.green }}>{answers.filter((a) => a.pick !== "skip" && a.correct).length}</p><p className="text-[12px]" style={{ color: C.green }}>right</p></div>
              <div className="rounded-xl py-2" style={{ background: C.redSoft }}><p className="tab text-[20px] font-bold" style={{ color: C.redDeep }}>{answers.filter((a) => a.pick !== "skip" && !a.correct).length}</p><p className="text-[12px]" style={{ color: C.redDeep }}>wrong</p></div>
              <div className="rounded-xl py-2" style={{ background: "#eef0f4" }}><p className="tab text-[20px] font-bold" style={{ color: C.ink2 }}>{answers.filter((a) => a.pick === "skip").length}</p><p className="text-[12px]" style={{ color: C.ink2 }}>skipped</p></div>
            </div>
            {combo >= 2 && <p className="qz-pop mt-3 text-center text-[14px] font-bold" style={{ color: "#c2410c" }}>{combo} in a row · combo XP</p>}
            <div className="mt-5">{actions}</div>
            <p className="mt-4 text-center text-[12px]" style={{ color: C.muted }}>
              Keys: <b>1–4</b> answer · <b>S</b> skip · <b>H</b> 50:50 · <b>Enter</b> next
            </p>
          </div>
        </aside>
      </div>

      <MobileBar>{actions}</MobileBar>
    </Shell>
  );
}

/* ---------- result ---------- */

/** A recognisable one-liner for the review list: generic stems like "Consider the following:" say nothing on their own. */
function reviewLabel(q: QuizQuestion): string {
  if (!/^consider the following[^:]{0,12}:$/i.test(q.question.trim())) return q.question;
  if (q.items?.[0]?.startsWith("Statement-I")) return q.items[0];
  if (q.ask && !/^(select the|which of the statements given above|which one of the following is correct|how many of the)/i.test(q.ask)) return q.ask;
  return `${q.question} ${q.items?.[0] ?? ""}`;
}

type Outcome = ReturnType<typeof finishRun>;

function Confetti() {
  const bits = useMemo(() => Array.from({ length: 44 }, (_, k) => ({
    left: (k * 37) % 100, delay: (k % 12) * 0.08, dur: 1.8 + ((k * 13) % 10) / 10,
    color: [C.blue, C.yellow, C.red, C.green, "#9fb0ff", "#ff8f84"][k % 6],
  })), []);
  return (
    <div className="qz-confetti" aria-hidden="true">
      {bits.map((b, k) => <i key={k} style={{ left: `${b.left}%`, background: b.color, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }} />)}
    </div>
  );
}

/** Draws the shareable score card (1080×1350, the shape Instagram and WhatsApp status show best). */
async function shareImage(o: Outcome, streak: number): Promise<Blob | null> {
  const W = 1080, H = 1350;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return null;
  const font = getComputedStyle(document.querySelector(".up") || document.body).fontFamily || "sans-serif";
  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  };
  const pill = (x: number, y: number, label: string, bg: string, fg: string) => {
    g.font = `700 40px ${font}`;
    const w = g.measureText(label).width + 56;
    g.fillStyle = bg; rr(x, y, w, 72, 36); g.fill();
    g.fillStyle = fg; g.fillText(label, x + 28, y + 50);
    return x + w + 16;
  };

  // Background and header
  g.fillStyle = C.canvas; g.fillRect(0, 0, W, H);
  const grad = g.createLinearGradient(0, 0, W, 460);
  grad.addColorStop(0, C.blue); grad.addColorStop(1, "#3a58e4");
  g.fillStyle = grad; g.fillRect(0, 0, W, 460);
  g.fillStyle = "#c6d1ff"; g.font = `700 36px ${font}`; g.fillText("UPSCPrepNotes", 72, 108);
  g.fillStyle = "#ffffff"; g.font = `700 80px ${font}`; g.fillText("Daily UPSC quiz", 72, 204);
  g.fillStyle = "#dfe5ff"; g.font = `400 38px ${font}`; g.fillText("Real Prelims questions, exam marking", 72, 264);

  // Score card
  g.save(); g.shadowColor = "rgba(11,12,16,0.18)"; g.shadowBlur = 40; g.shadowOffsetY = 16;
  g.fillStyle = "#ffffff"; rr(56, 320, W - 112, 800, 48); g.fill(); g.restore();
  g.fillStyle = C.muted; g.font = `400 42px ${font}`; g.fillText("My score today", 112, 420);
  g.fillStyle = o.score > 0 ? C.green : o.score < 0 ? C.redDeep : C.ink;
  g.font = `800 220px ${font}`; g.fillText(fmtMarks(o.score), 100, 640);
  g.fillStyle = C.muted; g.font = `400 44px ${font}`; g.fillText("out of 10", 112, 712);
  let x = 112;
  x = pill(x, 770, `${o.right} right`, C.greenSoft, C.green);
  x = pill(x, 770, `${o.wrong} wrong`, C.redSoft, C.redDeep);
  pill(x, 770, `${o.skipped} skipped`, "#eef0f4", C.ink2);
  if (streak > 1) pill(112, 866, `Day ${streak} streak`, "#fff3e6", "#c2410c");
  const projected = Math.round(o.score * (100 / SET_SIZE));
  g.fillStyle = C.ink2; g.font = `400 38px ${font}`;
  const py = streak > 1 ? 1010 : 930;
  g.fillText(`At this rate: about ${projected} out of 200`, 112, py);
  g.fillText(`2024 cut-off (General): ${CUTOFF_2024_GENERAL}`, 112, py + 52);

  // Gilu
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => { g.drawImage(img, 690, 610, 340, 374); resolve(); };
    img.onerror = () => resolve();
    img.src = `/quiz/gilu-${o.score >= 4 ? "celebrating" : "thinking"}.png`;
  });

  // Footer
  g.fillStyle = C.yellow; g.fillRect(0, H - 190, W, 190);
  g.fillStyle = C.ink; g.font = `800 60px ${font}`; g.fillText("Can you beat me?", 72, H - 100);
  g.font = `400 40px ${font}`; g.fillText("upscprepnotes.in/quiz", 72, H - 44);
  return new Promise((r) => cv.toBlob((b) => r(b), "image/png"));
}

/** Android offers an install prompt when the browser allows it; otherwise (and on iPhone) the steps are shown instead. */
type InstallState = { prompt: (() => void) | null; ios: boolean; android: boolean };

/** "Play every day from your home screen": one card, used on the home screen and the results screen. */
function InstallCard({ install }: { install: InstallState }) {
  const manual = !install.prompt && (install.ios || install.android);
  useEffect(() => {
    if (manual && install.ios) qev("quiz_install_ios_seen", {});
    if (manual && install.android) qev("quiz_install_android_steps_seen", {});
  }, [manual, install.ios, install.android]);
  if (!install.prompt && !install.ios && !install.android) return null;
  return (
    <div className="qz-up flex items-center gap-3 rounded-2xl bg-white p-4" style={{ boxShadow: `inset 0 0 0 1.5px #c6d1ff` }} data-track="quiz-install-card">
      <Gilu pose="hello" size={64} className="h-auto w-14 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold" style={{ color: C.ink }}>Play every day from your home screen</p>
        {install.prompt ? (
          <button type="button" onClick={install.prompt} className="mt-2 rounded-xl px-3.5 py-2 text-[14px] font-bold text-white" style={{ background: C.blue }} data-track="quiz-install">
            Add Gilu&apos;s quiz to home screen
          </button>
        ) : install.ios ? (
          <p className="mt-1 text-[13.5px] leading-snug" style={{ color: C.ink2 }}>Tap the <b>Share</b> button at the bottom of Safari, then <b>Add to Home Screen</b>.</p>
        ) : (
          <p className="mt-1 text-[13.5px] leading-snug" style={{ color: C.ink2 }}>Tap the <b>⋮ menu</b> at the top right of Chrome, then <b>Add to Home screen</b> or <b>Install app</b>.</p>
        )}
      </div>
    </div>
  );
}

function Result({ run, outcome, before, after, live, install, onJoin, onHome }: { run: Run; outcome: Outcome; before: Progress; after: Progress; live: Progress; install: InstallState; onJoin: () => void; onHome: () => void }) {
  const questions = SETS[run.setIndex];
  const [open, setOpen] = useState<number | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const levelUp = levelFor(after.xp).index > levelFor(before.xp).index;
  const projected = Math.round(outcome.score * (100 / SET_SIZE) * 10) / 10;
  const milestoneDay = outcome.milestones.length > 0;
  const pose: GiluPose = milestoneDay || outcome.score >= 6 ? "celebrating" : outcome.score >= 2 ? "thinking" : "sorry";
  const headline = milestoneDay ? `Day ${after.streak}! Reward unlocked.` : outcome.score >= 8 ? "Topper energy!" : outcome.score >= 6 ? "Great set!" : outcome.score >= 2 ? "Good effort. Keep going." : outcome.right > 0 ? "Tough set. That's how you learn." : "UPSC got you this time.";
  const gained = run.xp + outcome.bonus;
  const pace = Math.round(outcome.avgS);

  const code = shareCode({ right: outcome.right, wrong: outcome.wrong, skipped: outcome.skipped, streak: after.streak });
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/quiz/s/${code}` : `https://upscprepnotes.in/quiz/s/${code}`;
  const shareText = `I scored ${fmtMarks(outcome.score)}/10 on today's UPSC Prelims quiz. Real 2024 questions, exam marking. Can you beat me?`;

  const share = async () => {
    try {
      const blob = await shareImage(outcome, after.streak);
      const file = blob ? new File([blob], "my-upsc-score.png", { type: "image/png" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) {
        qev("quiz_share", { score: outcome.score, method: "image" });
        await navigator.share({ files: [file], text: `${shareText} ${shareUrl}` });
        return;
      }
      if (navigator.share) {
        qev("quiz_share", { score: outcome.score, method: "link" });
        await navigator.share({ text: shareText, url: shareUrl });
        return;
      }
      qev("quiz_share", { score: outcome.score, method: "download" });
      if (blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "my-upsc-score.png"; a.click(); }
      await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
      setShareMsg("Score card saved and the link copied. Paste it anywhere.");
    } catch {
      /* the share sheet was closed */
    }
  };

  const whatsapp = () => {
    qev("quiz_share", { score: outcome.score, method: "whatsapp" });
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank", "noopener");
  };

  const buttons = (
    <div className="grid gap-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <Btn onClick={share} kind="yellow" icon="share" data-track="quiz-share">Share score</Btn>
        <Btn onClick={whatsapp} kind="green" icon="whatsapp" data-track="quiz-share-whatsapp" aria-label="Challenge a friend on WhatsApp">WhatsApp</Btn>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Btn onClick={onHome} kind="ghost" icon="home" data-track="quiz-home">Home</Btn>
        <p className="flex items-center justify-center rounded-full text-center text-[13px] font-bold" style={{ color: C.ink2 }}>Come back tomorrow for 5 more</p>
      </div>
      {shareMsg && <p className="text-center text-[13px]" style={{ color: C.green }} role="status">{shareMsg}</p>}
    </div>
  );

  return (
    <Shell>
      {(outcome.score >= 6 || outcome.milestones.length > 0) && <Confetti />}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-8">
          <div className="rounded-3xl lg:bg-white lg:p-8 lg:shadow-[0_0_0_1.5px_rgba(11,12,16,0.12),0_10px_30px_-18px_rgba(11,12,16,0.35)]">
            <div className="flex flex-col items-center text-center">
              <Gilu pose={pose} size={220} className="qz-pop h-auto w-[150px] lg:w-[190px]" />
              <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.02em] lg:text-[36px]" style={{ color: C.ink }}>{headline}</h1>
              <p className="qz-pop tab mt-3 text-[64px] font-bold leading-none tracking-[-0.04em] lg:text-[80px]" style={{ color: outcome.score > 0 ? C.green : outcome.score < 0 ? C.redDeep : C.ink }}>{fmtMarks(outcome.score)}</p>
              <p className="mt-1 text-[15px]" style={{ color: C.muted }}>marks out of 10</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[14px] font-bold">
                <span className="rounded-full px-3 py-1.5" style={{ background: C.greenSoft, color: C.green }}>{outcome.right} right</span>
                <span className="rounded-full px-3 py-1.5" style={{ background: C.redSoft, color: C.redDeep }}>{outcome.wrong} wrong</span>
                <span className="rounded-full px-3 py-1.5" style={{ background: "#eef0f4", color: C.ink2 }}>{outcome.skipped} skipped</span>
              </div>
            </div>
          {outcome.milestones.length > 0 && (
            <div className="mt-5 space-y-2 text-left">
              {outcome.milestones.map((m) => (
                <div key={m.id} className="qz-pop flex items-center gap-3 rounded-2xl p-4" style={{ background: C.yellow, boxShadow: `0 4px 0 #c9a800` }}>
                  <Gilu pose="celebrating" size={72} className="h-auto w-14 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "#5c4a00" }}>Day {m.day} reward unlocked</p>
                    <p className="text-[17px] font-bold leading-snug" style={{ color: C.ink }}>
                      {m.worth ? (m.pay === 0 ? `${m.title}, free (worth ₹${m.worth})` : `${m.title}: ${m.reward}, ₹${m.pay} instead of ₹${m.worth}`) : `${m.title}: ${m.detail}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
            <div className="mt-6 hidden lg:block">{buttons}</div>
          </div>
        </div>

        <div>
          <div className="mt-6 grid grid-cols-2 gap-2.5 lg:mt-0">
            <div className="qz-up rounded-2xl bg-white p-4" style={card}>
              <p className="tab text-[26px] font-bold" style={{ color: C.blue }}>+{gained}</p>
              <p className="text-[13px]" style={{ color: C.muted }}>XP earned</p>
            </div>
            <div className="qz-up rounded-2xl bg-white p-4" style={card}>
              <div className="flex items-center gap-1"><Flame on={after.streak > 0} size={26} /><p className="tab text-[26px] font-bold" style={{ color: C.ink }}>{after.streak}</p></div>
              <p className="text-[13px]" style={{ color: C.muted }}>{run.daily ? "day streak" : "day streak (daily set only)"}</p>
            </div>
          </div>

          <div className="qz-up mt-2.5 rounded-2xl bg-white p-4" style={{ boxShadow: `inset 0 0 0 1.5px ${levelUp ? C.yellow : C.line}` }}>
            {levelUp && <p className="mb-2 text-[15px] font-bold" style={{ color: "#8a6d00" }}>Level up! You&apos;re now a {levelFor(after.xp).name}.</p>}
            <LevelBar xp={after.xp} compact />
          </div>

          {outcome.usedShield && (
            <p className="qz-pop mt-2.5 rounded-2xl p-3.5 text-[14.5px] font-bold" style={{ background: C.blueSoft, color: C.blue }}>
              Your streak shield saved your streak for the day you missed.
            </p>
          )}
          {live.joined && run.daily && outcome.milestones.length === 0 && nextMilestone(after.streak) && (() => {
            const m = nextMilestone(after.streak)!;
            const left = m.day - after.streak;
            return (
              <p className="qz-up mt-2.5 rounded-2xl p-3.5 text-[14.5px] leading-snug" style={{ background: C.yellowSoft, color: C.ink }}>
                Day {after.streak} done. <b>{left} more {left === 1 ? "day" : "days"}</b> to {m.worth ? (m.pay === 0 ? `your free ${m.title}` : `${m.reward} the ${m.title}`) : "a streak shield"}.
              </p>
            );
          })()}
          {!live.joined && (
            <div className="qz-up mt-2.5 rounded-2xl p-4" style={{ background: C.yellowSoft, boxShadow: `inset 0 0 0 1.5px #f2d36b` }}>
              <p className="text-[16px] font-bold" style={{ color: C.ink }}>Join the 30-day challenge</p>
              <p className="mt-1 text-[14.5px] leading-snug" style={{ color: C.ink2 }}>
                Keep your streak going and get the {MILESTONES[2].title} free at day 10 (worth ₹{MILESTONES[2].worth}), plus more rewards at 7, 21 and 30 days.
              </p>
              <Btn onClick={onJoin} kind="yellow" icon="flag" className="mt-3" data-track="quiz-join-result">Join the challenge</Btn>
            </div>
          )}

          {outcome.earned.length > 0 && (
            <div className="mt-2.5 space-y-2">
              {outcome.earned.map((b: Badge) => (
                <div key={b.id} className="qz-pop flex items-center gap-3 rounded-2xl p-3.5" style={{ background: C.yellowSoft, boxShadow: `inset 0 0 0 1.5px ${C.yellow}` }}>
                  <Medal id={b.id} size={48} />
                  <div>
                    <p className="text-[15px] font-bold" style={{ color: C.ink }}>New badge: {b.name}</p>
                    <p className="text-[13px]" style={{ color: C.ink2 }}>{b.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <section className="mt-2.5 rounded-2xl bg-white p-4 lg:p-5" style={card}>
            <p className="text-[16px] font-bold" style={{ color: C.ink }}>If the whole paper went like this</p>
            <p className="mt-1 text-[15px] leading-relaxed" style={{ color: C.ink2 }}>
              You&apos;d score about <b className="tab" style={{ color: C.ink }}>{projected}</b> out of 200. The 2024 cut-off for General was <b className="tab" style={{ color: C.ink }}>{CUTOFF_2024_GENERAL}</b>.
            </p>
            <div className="relative mt-3 h-3 rounded-full" style={{ background: C.track }}>
              <div className="qz-fill h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, projected / 2))}%`, background: projected >= CUTOFF_2024_GENERAL ? C.green : "#e0a400" }} />
              <span className="absolute -top-1 h-5 w-[3px] rounded" style={{ left: `${CUTOFF_2024_GENERAL / 2}%`, background: C.ink }} aria-hidden="true" />
            </div>
            <p className="mt-2 text-[13px]" style={{ color: C.muted }}>
              {projected >= CUTOFF_2024_GENERAL ? "Above the cut-off line. Keep this up." : "Below the cut-off line, for now. Daily practice moves it."} A rough guide from 5 questions.
            </p>
            {outcome.right + outcome.wrong > 0 && (
              <p className="mt-3 text-[14px]" style={{ color: C.ink2 }}>Your pace: <b className="tab">{pace}s</b> a question. The exam allows <b>{EXAM_PACE_S}s</b>.</p>
            )}
          </section>

          <section className="mt-6">
            <h2 className="text-[19px] font-bold" style={{ color: C.ink }}>Review your answers</h2>
            <div className="mt-3 space-y-2">
              {questions.map((q: QuizQuestion, k) => {
                const a = run.answers[k];
                const tag = !a || a.pick === "skip" ? { t: "Skipped · 0", c: C.ink2, b: "#eef0f4" } : a.correct ? { t: "Right · +2", c: C.green, b: C.greenSoft } : { t: "Wrong · −0.66", c: C.redDeep, b: C.redSoft };
                const isOpen = open === k;
                return (
                  <div key={q.id} className="rounded-2xl bg-white" style={card}>
                    <button type="button" onClick={() => setOpen(isOpen ? null : k)} aria-expanded={isOpen} className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left hover:bg-[#fafbfd]">
                      <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: tag.b, color: tag.c }}>{tag.t}</span>
                      <span className="line-clamp-2 flex-1 text-[14px] font-bold" style={{ color: C.ink }}>{reviewLabel(q)}</span>
                      <span aria-hidden="true" style={{ color: C.muted }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="qz-up border-t px-3.5 pb-3.5 pt-3 text-[14.5px] leading-relaxed" style={{ borderColor: C.line, color: C.ink2 }}>
                        {a && a.pick !== "skip" && !a.correct && <p>You picked ({LETTERS[a.pick as number]}) {q.options[a.pick as number]}</p>}
                        <p className="font-bold" style={{ color: C.green }}>Answer: ({LETTERS[q.answer]}) {q.options[q.answer]}</p>
                        <p className="mt-1.5">{q.explain}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-6">
            <InstallCard install={install} />
          </div>

          <Link href="/store/answer-copies-compilation?utm_source=quiz&utm_medium=result&utm_campaign=quiz_v1" data-track="quiz-store" className="mt-6 flex items-center gap-3 rounded-2xl p-4 transition-transform hover:-translate-y-[1px]" style={{ background: C.blueSoft, boxShadow: `inset 0 0 0 1.5px #c6d1ff` }}>
            <Gilu pose="reading" size={64} className="h-auto w-14 shrink-0" />
            <span className="text-[15px] leading-snug" style={{ color: C.ink }}><b>Prelims clears you. Mains ranks you.</b> See how toppers wrote their Mains answers →</span>
          </Link>
        </div>
      </div>

      <MobileBar>{buttons}</MobileBar>
    </Shell>
  );
}

/* ---------- app ---------- */

type Screen =
  | { name: "home" }
  | { name: "play"; setIndex: number; daily: boolean; key: number }
  | { name: "result"; run: Run; outcome: Outcome; before: Progress; after: Progress };

const noop = () => () => {};

export default function Quiz() {
  // Progress lives on this device. The server renders a loading frame; the browser then shows the saved state.
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const [progress, setProgress] = useState<Progress>(() => (typeof window === "undefined" ? EMPTY : loadProgress()));
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => { qev("quiz_view", {}); }, []);
  // Installability: Chrome needs a registered service worker before it fires the install prompt.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/quiz/sw.js", { scope: "/quiz/" }).catch(() => {});
  }, []);

  // Install to home screen: keep Android's prompt for the results screen; detect iPhones that aren't installed yet.
  const [deferred, setDeferred] = useState<(Event & { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> }) | null>(null);
  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as Event & { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> }); };
    const onInstalled = () => { qev("quiz_installed", {}); setDeferred(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);
  const installed = typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
  const install: InstallState = {
    prompt: deferred && !installed ? () => {
      qev("quiz_install_prompt", {});
      void deferred.prompt();
      // The browser's own answer: accepted (added to home screen) or dismissed.
      deferred.userChoice?.then((c) => qev("quiz_install_choice", { outcome: c.outcome, platform: c.platform })).catch(() => {});
    } : null,
    ios: !installed && typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent),
    android: !installed && typeof navigator !== "undefined" && /android/i.test(navigator.userAgent),
  };

  const join = () => {
    const p = joinChallenge(progress);
    saveProgress(p);
    setProgress(p);
    qev("quiz_join", { streak: p.streak });
    haptic(30);
  };


  const play = (setIndex: number, daily: boolean) => {
    qev("quiz_start", { set: setIndex, daily });
    setScreen({ name: "play", setIndex, daily, key: Date.now() });
    window.scrollTo({ top: 0 });
  };

  const done = (run: Run) => {
    const outcome = finishRun(progress, run, SETS[run.setIndex]);
    saveProgress(outcome.progress);
    qev("quiz_complete", { set: run.setIndex, daily: run.daily, score: outcome.score, right: outcome.right, wrong: outcome.wrong, skipped: outcome.skipped });
    setScreen({ name: "result", run, outcome, before: progress, after: outcome.progress });
    setProgress(outcome.progress);
    window.scrollTo({ top: 0 });
    if (outcome.score >= 6) haptic([30, 40, 30, 40, 60]);
  };

  if (!ready) {
    return <div className="grid min-h-dvh place-items-center"><Gilu pose="reading" size={120} className="h-auto w-[100px]" /></div>;
  }

  if (screen.name === "play") {
    return (
      <Play
        key={screen.key}
        setIndex={screen.setIndex}
        daily={screen.daily}
        onDone={done}
        onExit={() => { if (window.confirm("Quit this set? Your answers so far won't count.")) setScreen({ name: "home" }); }}
      />
    );
  }

  if (screen.name === "result") {
    return (
      <Result
        run={screen.run}
        outcome={screen.outcome}
        before={screen.before}
        after={screen.after}
        live={progress}
        install={install}
        onJoin={join}
        onHome={() => { setScreen({ name: "home" }); window.scrollTo({ top: 0 }); }}
      />
    );
  }

  return (
    <Home
      progress={progress}
      install={install}
      onPlay={play}
      onJoin={join}
      onReset={() => {
        if (!window.confirm("Reset your streak, XP and badges on this device?")) return;
        resetProgress();
        setProgress({ ...EMPTY });
      }}
    />
  );
}
