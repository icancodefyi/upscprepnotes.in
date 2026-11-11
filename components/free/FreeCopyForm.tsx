"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import Gilu, { type GiluPose } from "@/components/brand/Gilu";
import { identify } from "@/lib/track";
import { ATTEMPTS, MODES, OPTIONALS, PROFILE_KEY, STAGES, WORKING, type LeadProfile, type Option } from "@/lib/lead-profile";

type Saved = LeadProfile & { email?: string };
type Key = Exclude<keyof LeadProfile, "phone">;

/** One question per screen. Every question is required. Short lists show as rows, long lists as a chip grid. */
const TOP_OPTIONAL = ["PSIR", "Sociology", "Anthropology", "Geography", "History", "Public Administration", "Law", "Literature", "Economics", "Mathematics", "Medical Science", "Not decided"];

const QUESTIONS: { key: Key; title: string; hint: string; options: Option[]; grid?: boolean; top?: string[] }[] = [
  { key: "stage", title: "Where are you in your preparation?", hint: "Pick the closest one.", options: STAGES },
  { key: "attempt", title: "Which attempt is this?", hint: "Counting the one you are preparing for.", options: ATTEMPTS },
  { key: "mode", title: "How are you preparing?", hint: "So we send material that fits how you study.", options: MODES },
  { key: "working", title: "What describes you best?", hint: "Your daily routine shapes what helps most.", options: WORKING },
  { key: "optional", title: "What is your optional subject?", hint: "Choose “Not decided” if you have not picked yet.", options: OPTIONALS, grid: true, top: TOP_OPTIONAL },
];
const LAST = QUESTIONS.length; // the contact step
const GILU: { pose: GiluPose; line: (first: string) => string }[] = [
  { pose: "hello", line: (f) => `Hi! Five quick taps and ${f}'s copy is yours.` },
  { pose: "thinking", line: () => "Good start. Four to go." },
  { pose: "reading", line: () => "Three to go. You are quick." },
  { pose: "thinking", line: () => "Halfway there. Keep going." },
  { pose: "run", line: () => "Two to go. Nearly there." },
  { pose: "celebrating", line: (f) => `Unlocked! One last step and ${f}'s copy is on its way.` },
];
const TOTAL = QUESTIONS.length + 1;

const Req = () => (
  <>
    <span aria-hidden className="ml-0.5 text-[var(--mark-deep)]">*</span>
    <span className="sr-only"> (compulsory)</span>
  </>
);
const FieldError = ({ id, children }: { id: string; children?: string }) =>
  children ? <p id={id} role="alert" className="mt-1.5 text-s font-bold text-[var(--mark-deep)]">{children}</p> : null;

const maskEmail = (e: string) => {
  const [u, d] = e.split("@");
  return u && d ? `${u.slice(0, 2)}***@${d}` : e;
};

function read(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}") as Saved;
    return { ...raw, email: raw.email || localStorage.getItem("upsc-email") || "" };
  } catch {
    return {};
  }
}
function write(s: Saved) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(s));
    if (s.email) localStorage.setItem("upsc-email", s.email);
  } catch {
    /* private mode: the form still works, it just will not remember */
  }
}

/** The request flow for one topper's free copy: six quick taps, then email and WhatsApp. Remembers answers in this browser. */
export default function FreeCopyForm({ topperSlug, topperName }: { topperSlug: string; topperName: string }) {
  const first = topperName.split(" ")[0];
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<LeadProfile>({});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [known, setKnown] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");
  const [fieldErr, setFieldErr] = useState<{ email?: string; phone?: string }>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Restore what we remember. Start at the first unanswered question, or at the last step when everything is known.
  useEffect(() => {
    const s = read();
    const { email: e, phone: p, ...rest } = s;
    if (e) {
      setEmail(e);
      setKnown(true);
    }
    if (p) setPhone(p);
    setProfile(rest);
    const firstOpen = QUESTIONS.findIndex((q) => !rest[q.key]);
    setStep(firstOpen === -1 ? LAST : firstOpen);
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  function go(n: number) {
    setError("");
    setStepError("");
    setStep(n);
    posthog.capture("free_copy_step", { topper_slug: topperSlug, step: n + 1, of: TOTAL });
  }

  function choose(k: Key, v: string) {
    const next = { ...profile, [k]: v };
    setProfile(next);
    write({ ...next, phone, email });
    clearTimeout(timer.current);
    const i = QUESTIONS.findIndex((q) => q.key === k);
    // A short beat so the tap is seen before the next question slides in.
    timer.current = setTimeout(() => go(i + 1), 220);
  }

  function forget() {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem("upsc-email");
    } catch {}
    setEmail("");
    setPhone("");
    setProfile({});
    setKnown(false);
    setEditEmail(false);
    go(0);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = QUESTIONS.findIndex((q) => !profile[q.key]);
    if (missing !== -1) {
      go(missing);
      setStepError("This question is compulsory. Please choose one.");
      return;
    }
    const fe: { email?: string; phone?: string } = {};
    if (!email.trim()) fe.email = "Email is compulsory. Please enter it.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) fe.email = "That email does not look right. Please check it.";
    if (!phone.trim()) fe.phone = "WhatsApp number is compulsory. Please enter it.";
    else if (!/^(\+?91|0)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""))) fe.phone = "That number does not look right. Enter the 10 digits of your WhatsApp number.";
    setFieldErr(fe);
    if (fe.email || fe.phone) {
      setEditEmail(true);
      document.getElementById(fe.email ? "free-copy-email" : "free-copy-phone")?.focus();
      return;
    }
    setLoading(true);
    setError("");
    let leaving = false;
    try {
      const clean = phone.replace(/[\s-]/g, "");
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), topperSlug, source: "free_page", sourceUrl: window.location.href, profile: { ...profile, phone: clean } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      write({ ...profile, phone: clean, email: email.trim() });
      identify(email.trim(), "free_copy");
      posthog.capture("free_copy_submitted", { topper_slug: topperSlug, returning: known });
      if (data.redirect) {
        leaving = true;
        window.location.assign(data.redirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      if (!leaving) setLoading(false);
    }
  }

  const q = step < LAST ? QUESTIONS[step] : null;
  const input = "mt-2 h-12 w-full rounded-full bg-white px-5 text-m text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] outline-none placeholder:text-[var(--muted)] focus:shadow-[0_0_0_2px_var(--accent)]";

  return (
    <form onSubmit={submit} noValidate className="min-w-0" data-track-view="free_copy_form">
      <style>{`@keyframes fcIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}.fc-step{animation:fcIn .26s cubic-bezier(.2,.7,.2,1)}@keyframes fcPop{0%{transform:scale(1)}45%{transform:scale(1.035)}100%{transform:scale(1)}}.pop-on[aria-checked=true]{animation:fcPop .22s ease-out}@media (prefers-reduced-motion:reduce){.fc-step,.pop-on{animation:none!important}}`}</style>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0}
          aria-label="Previous question"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--canvas)] disabled:pointer-events-none disabled:opacity-0"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-s font-bold">
            <span className="flex items-center gap-1.5 text-[var(--ink-2)]">
              <svg viewBox="0 0 24 24" className={`h-4 w-4 ${step === LAST ? "text-[var(--accent)]" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="5" y="11" width="14" height="9" rx="2.5" />
                <path d={step === LAST ? "M8.5 11V8a3.5 3.5 0 016.7-1.4" : "M8.5 11V8a3.5 3.5 0 017 0v3"} />
              </svg>
              {step === LAST ? "Unlocked" : `Unlocking ${first}'s copy`}
            </span>
            <span className="tab text-[var(--muted)]">{step + 1} of {TOTAL}</span>
          </div>
          <div role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={step + 1} aria-label="Progress" className="mt-2 flex gap-1">
            {Array.from({ length: TOTAL }, (_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-[var(--accent)]" : "bg-[var(--canvas)]"}`} />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => (q && !profile[q.key] ? setStepError("This question is compulsory. Please choose one.") : go(step + 1))}
          disabled={step === LAST}
          aria-label="Next question"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--canvas)] disabled:pointer-events-none disabled:opacity-0"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-[var(--canvas)] py-2 pl-2 pr-4 [@media(max-height:700px)]:hidden">
        <Gilu pose={GILU[step].pose} size={44} className="h-auto w-11 shrink-0" />
        <p className="text-s font-bold leading-snug text-[var(--ink-2)]">{GILU[step].line(first)}</p>
      </div>

      <div key={step} className="fc-step mt-5">
        {q ? (
          <>
            <h2 ref={heading} tabIndex={-1} className="t-head text-[22px] leading-[1.15] outline-none sm:text-[26px]">{q.title}<Req /></h2>
            <p className="mt-1.5 text-s text-[var(--ink-2)] sm:text-m">{q.hint}</p>
            <FieldError id="step-error">{stepError}</FieldError>
            <div role="radiogroup" aria-label={q.title} className={q.grid ? "mt-4 flex flex-wrap gap-2" : "mt-4 grid gap-2.5"}>
              {(q.top ? q.options.filter((o) => q.top!.includes(o.value)) : q.options).map((o) => {
                const on = profile[q.key] === o.value;
                return q.grid ? (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => choose(q.key, o.value)}
                    className={`pop-on h-10 rounded-full px-4 text-s font-bold transition-colors sm:h-11 sm:px-5 sm:text-m ${on ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)] hover:shadow-[0_0_0_1.5px_var(--ink)]"}`}
                  >
                    {o.label}
                  </button>
                ) : (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => choose(q.key, o.value)}
                    className={`pop-on flex min-h-[52px] items-center justify-between gap-4 rounded-[18px] px-5 text-left text-m font-bold transition-colors ${on ? "bg-[var(--ink)] text-white" : "bg-white shadow-[0_0_0_1px_var(--line-2)] hover:shadow-[0_0_0_1.5px_var(--ink)]"}`}
                  >
                    <span>{o.label}</span>
                    <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${on ? "bg-white text-[var(--ink)]" : "shadow-[0_0_0_1.5px_var(--line-2)]"}`}>
                      {on && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
                    </span>
                  </button>
                );
              })}
            </div>
            {q.top && (
              <div className="mt-3">
                <label htmlFor={`free-copy-${q.key}-other`} className="sr-only">Other</label>
                <select
                  id={`free-copy-${q.key}-other`}
                  value={profile[q.key] && !q.top.includes(profile[q.key]!) ? profile[q.key] : ""}
                  onChange={(e) => e.target.value && choose(q.key, e.target.value)}
                  className={`h-11 w-full rounded-full px-5 text-s font-bold outline-none sm:text-m ${profile[q.key] && !q.top.includes(profile[q.key]!) ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)]"}`}
                >
                  <option value="">Other subject</option>
                  {q.options.filter((o) => !q.top!.includes(o.value)).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 ref={heading} tabIndex={-1} className="t-head text-[22px] leading-[1.15] outline-none sm:text-[26px]">Where should we send {first}&apos;s copy?</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="free-copy-email" className="block text-s font-bold leading-5">Your email<Req /></label>
                {known && !editEmail ? (
                  <div className="mt-2 flex h-12 items-center justify-between gap-2 rounded-full bg-[var(--canvas)] pl-5 pr-1.5">
                    <span className="min-w-0 truncate text-m">{maskEmail(email)}</span>
                    <button type="button" onClick={() => setEditEmail(true)} className="h-9 shrink-0 rounded-full px-3.5 text-s font-bold text-[var(--accent)] hover:bg-white">Change</button>
                  </div>
                ) : (
                  <input id="free-copy-email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErr((f) => ({ ...f, email: undefined })); }} aria-required="true" aria-invalid={!!fieldErr.email} aria-describedby={fieldErr.email ? "email-error" : undefined} type="email" autoComplete="email" inputMode="email" className={`${input} ${fieldErr.email ? "!shadow-[0_0_0_2px_var(--mark-deep)]" : ""}`} placeholder="you@example.com" />
                )}
                <FieldError id="email-error">{fieldErr.email}</FieldError>
              </div>
              <div className="min-w-0">
                <label htmlFor="free-copy-phone" className="block text-s font-bold leading-5">WhatsApp number<Req /></label>
                <div className={`mt-2 flex h-12 items-center rounded-full bg-white focus-within:shadow-[0_0_0_2px_var(--accent)] ${fieldErr.phone ? "shadow-[0_0_0_2px_var(--mark-deep)]" : "shadow-[0_0_0_1px_var(--line-2)]"}`}>
                  <span className="pl-5 pr-2 text-m font-bold text-[var(--ink-2)]">+91</span>
                  <input id="free-copy-phone" value={phone} onChange={(e) => { setPhone(e.target.value); setFieldErr((f) => ({ ...f, phone: undefined })); }} aria-required="true" aria-invalid={!!fieldErr.phone} aria-describedby={fieldErr.phone ? "phone-error" : undefined} type="tel" inputMode="tel" autoComplete="tel-national" className="h-full min-w-0 flex-1 rounded-r-full bg-transparent pr-5 text-m text-[var(--ink)] outline-none placeholder:text-[var(--muted)]" placeholder="10-digit number" />
                </div>
                <FieldError id="phone-error">{fieldErr.phone}</FieldError>
              </div>
            </div>
            <p className="mt-2.5 text-[13px] leading-[1.45] text-[var(--ink-2)] sm:mt-3 sm:text-s sm:leading-[1.5]"><span aria-hidden className="font-bold text-[var(--mark-deep)]">*</span> Compulsory. <strong>Please enter accurate details</strong> so we can send you all the important, curated free study material as soon as it is available.</p>

            {/* What they told us, with a way back to change any of it */}
            <div className="mt-3 flex gap-3 rounded-[18px] bg-[#e3e8fb] p-3.5 text-[#172fa3]">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-4.5" /></svg>
              <p className="text-[13px] leading-[1.45] sm:text-s sm:leading-[1.5]"><strong>No spam.</strong> We use your email and WhatsApp number only to send this copy and a few study updates that match your answers. You can stop them any time.</p>
            </div>

            <div className="mt-3 hidden flex-wrap items-center gap-1.5 rounded-[18px] bg-[var(--canvas)] p-3 sm:flex">
              {QUESTIONS.map((x) => (
                <span key={x.key} className="rounded-full bg-white px-2.5 py-0.5 text-[13px] font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)]">{profile[x.key]}</span>
              ))}
              <button type="button" onClick={() => go(0)} className="ml-auto h-8 rounded-full px-3 text-s font-bold text-[var(--accent)] hover:bg-white">Edit</button>
            </div>

            {error && <p className="mt-4 text-s text-[var(--mark-deep)]" role="alert">{error}</p>}

            <button type="submit" disabled={loading} data-track="free-copy-submit" className="btn btn-blue mt-4 h-14 w-full justify-center disabled:opacity-60 [--btn-fs:16px]">
              {loading ? "Sending..." : `Send me ${first}'s copy`}
            </button>
            <p className="mt-2.5 text-center text-s text-[var(--muted)]">Free · Opens right after you send</p>
            {known && (
              <p className="mt-1 text-center text-s text-[var(--muted)]">
                Your answers are saved in this browser for next time. <button type="button" onClick={forget} className="font-bold text-[var(--ink-2)] underline underline-offset-2">Not you? Clear</button>
              </p>
            )}
          </>
        )}
      </div>
    </form>
  );
}
