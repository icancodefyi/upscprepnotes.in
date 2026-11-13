"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Gilu from "./Gilu";
import { track } from "@/lib/track";

/**
 * One invitation to the daily quiz, once per visitor. It slides in at the bottom right after 20 seconds
 * and stays until the visitor plays or closes it. Once closed, or once they have played the quiz,
 * it never comes back on this browser.
 *
 * Not shown where someone is already doing something that matters: the store, checkout, the free
 * copy and free material forms, downloads, the quiz itself and the admin area.
 */
const KEY = "upn-quiz-toast"; // "seen" while waiting for a decision, "done" once handled
const QUIZ_KEY = "upn-quiz-v1";
const DELAY_MS = 20_000;
const SKIP = [/^\/quiz/, /^\/store/, /^\/free/, /^\/admin/, /^\/download/, /^\/get/, /^\/unsubscribe/, /^\/requests/, /^\/api/, /^\/ask/];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}
function alreadyPlayed(): boolean {
  const raw = read(QUIZ_KEY);
  if (!raw) return false;
  try {
    const p = JSON.parse(raw);
    return !!(p?.joined || p?.lastDailyDay || p?.history?.length);
  } catch {
    return false;
  }
}

export default function QuizToast() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const blocked = SKIP.some((r) => r.test(pathname));

  useEffect(() => {
    if (blocked) {
      setOpen(false);
      return;
    }
    if (read(KEY) === "done" || alreadyPlayed()) return;
    // Shown already on an earlier page and not closed yet: keep it there without another wait.
    const wait = read(KEY) === "seen" ? 1200 : DELAY_MS;
    const t = window.setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      if (read(KEY) !== "seen") {
        write(KEY, "seen");
        track("quiz_promo_shown", { page: pathname });
      }
      setOpen(true);
    }, wait);
    return () => window.clearTimeout(t);
  }, [blocked, pathname]);

  function close(how: "dismiss" | "play") {
    write(KEY, "done");
    track(how === "play" ? "quiz_promo_click" : "quiz_promo_dismiss", { page: pathname });
    setLeaving(true);
    window.setTimeout(() => setOpen(false), 260);
  }

  if (!open || blocked) return null;

  return (
    <aside
      role="complementary"
      aria-label="Daily quiz invitation"
      className={`quiz-toast ${leaving ? "quiz-toast-out" : ""}`}
    >
      <button type="button" onClick={() => close("dismiss")} aria-label="Close" className="quiz-toast-x">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <div className="quiz-toast-gilu" aria-hidden="true">
        <Gilu pose="hello" size={104} className="h-auto w-[92px]" />
      </div>

      <div className="quiz-toast-body">
        <p className="quiz-toast-title">
          Try today&apos;s <mark>UPSC quiz</mark>, free
        </p>
        <p className="quiz-toast-sub">Five real Prelims questions, marked the exam way. No sign-up, about 5 minutes.</p>
        <div className="quiz-toast-row">
          <Link
            href="/quiz?utm_source=site&utm_medium=toast&utm_campaign=quiz_toast"
            onClick={() => close("play")}
            className="quiz-toast-cta"
          >
            Play now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button type="button" onClick={() => close("dismiss")} className="quiz-toast-later">
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
