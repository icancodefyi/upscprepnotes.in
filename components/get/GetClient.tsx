"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useState, useSyncExternalStore } from "react";
import Gilu, { type GiluPose } from "@/components/brand/Gilu";
import { track } from "@/lib/track";

export type Promo = { id: string; title: string; body: string; cta: string; href: string; pose: GiluPose; external?: boolean };
type File = { name: string; url: string };
type Props = {
  kind: "answer-copy" | "free-material" | "guide" | "schemes";
  title: string;
  files: File[];
  pending: boolean;
  emailMasked: string;
  returnTo: string;
  promos: Promo[];
};

const C = { blue: "#1f3fd6", blueDeep: "#13238a", ink: "#0b0c10", ink2: "#3f4450", muted: "#5f6571", line: "rgba(11,12,16,0.12)", yellow: "#ffe45c", yellowSoft: "#fff8d6", green: "#1a8a4a" };

/** How long the "getting ready" screen runs before the files appear. */
const WAIT_MS = 7000;
const WAIT_REDUCED_MS = 1200;
const STEPS = ["Checking your email", "Packing your files", "Almost ready"];

const noop = () => () => {};
/** True when the visitor has turned animation off. Server and first paint assume false. */
function useReducedMotion(): boolean {
  return useSyncExternalStore(noop, () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, () => false);
}

function ev(event: string, props: Record<string, unknown> = {}) {
  track(event, props);
  try { posthog.capture(event, props); } catch {}
}

function withUtm(p: Promo, phase: "wait" | "ready", kind: string): string {
  if (p.external) return p.href;
  return `${p.href}${p.href.includes("?") ? "&" : "?"}utm_source=get&utm_medium=${phase}&utm_campaign=${kind}`;
}

function PromoCard({ p, phase, kind }: { p: Promo; phase: "wait" | "ready"; kind: string }) {
  const common = {
    href: withUtm(p, phase, kind),
    "data-track": `get-promo-${p.id}`,
    onClick: () => ev("get_promo_click", { promo: p.id, phase, kind }),
    className: "flex items-center gap-4 rounded-3xl bg-white p-4 text-left transition-transform hover:-translate-y-[1px]",
    style: { boxShadow: `0 0 0 1.5px ${C.line}, 0 10px 30px -20px rgba(11,12,16,.4)` },
  };
  const inner = (
    <>
      <Gilu pose={p.pose} size={88} className="h-auto w-[72px] shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold leading-snug" style={{ color: C.ink }}>{p.title}</span>
        <span className="mt-0.5 block text-[14.5px] leading-snug" style={{ color: C.ink2 }}>{p.body}</span>
        <span className="mt-2 inline-block rounded-full px-3.5 py-1.5 text-[14px] font-bold text-white" style={{ background: C.blue, boxShadow: `0 3px 0 ${C.blueDeep}` }}>{p.cta} →</span>
      </span>
    </>
  );
  return p.external ? (
    <a {...common} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link {...common}>{inner}</Link>
  );
}

export default function GetClient({ kind, title, files, pending, emailMasked, returnTo, promos }: Props) {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [slide, setSlide] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const total = reduced ? WAIT_REDUCED_MS : WAIT_MS;
    const started = performance.now();
    ev("get_view", { kind, files: files.length, pending });
    const t1 = setTimeout(() => setStep(1), total * 0.34);
    const t2 = setTimeout(() => setStep(2), total * 0.68);
    const t3 = setTimeout(() => {
      setReady(true);
      ev("get_ready", { kind, waited_ms: Math.round(performance.now() - started) });
    }, total);
    const rot = setInterval(() => setSlide((s) => s + 1), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(rot); };
  }, [kind, files.length, pending, reduced]);

  const promo = promos.length ? promos[slide % promos.length] : null;
  const wait = reduced ? WAIT_REDUCED_MS : WAIT_MS;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-4 pb-14 pt-6">
      <style>{`
        @keyframes get-fill { from { width: 0% } to { width: 100% } }
        @keyframes get-up { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes get-pop { 0% { transform: scale(.7); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        .get-up { animation: get-up .4s cubic-bezier(.22,1,.36,1) both }
        .get-pop { animation: get-pop .4s cubic-bezier(.34,1.56,.64,1) both }
        @media (prefers-reduced-motion: reduce) { .get-up, .get-pop { animation: none } }
      `}</style>

      <Link href="/" className="text-center text-[15px] font-bold" style={{ color: C.ink }}>UPSCPrepNotes</Link>

      {!ready ? (
        <section className="mt-6 flex flex-1 flex-col items-center text-center" aria-live="polite" aria-busy="true">
          <Gilu pose="reading" size={190} className="h-auto w-[150px]" />
          <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em]" style={{ color: C.ink }}>
            {pending ? "Getting your request in" : "Getting your files ready"}
          </h1>
          <p className="mt-1.5 text-[15.5px]" style={{ color: C.ink2 }}>{STEPS[step]}…</p>

          <div className="mt-5 h-3.5 w-full max-w-[420px] overflow-hidden rounded-full" style={{ background: "#e3e6ee" }} role="progressbar" aria-label="Preparing your files">
            <div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${C.blue}, #6f87f7)`, animation: `get-fill ${wait}ms linear forwards` }} />
          </div>
          <div className="mt-2 flex w-full max-w-[420px] justify-between text-[12.5px]" style={{ color: C.muted }}>
            {STEPS.map((s, i) => (
              <span key={s} style={{ color: i <= step ? C.ink : C.muted, fontWeight: i === step ? 700 : 400 }}>{i + 1}. {s}</span>
            ))}
          </div>

          {promo && (
            <div key={promo.id} className="get-up mt-7 w-full">
              <p className="mb-2 text-[12.5px] font-bold" style={{ color: C.muted }}>While you wait</p>
              <PromoCard p={promo} phase="wait" kind={kind} />
              <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
                {promos.map((p, i) => (
                  <span key={p.id} className="h-2 w-2 rounded-full" style={{ background: i === slide % promos.length ? C.blue : "#c9cfdd" }} />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6 flex flex-col items-center text-center">
          <Gilu pose={pending ? "dozing" : "celebrating"} size={190} className="get-pop h-auto w-[150px]" />
          {pending ? (
            <>
              <h1 className="get-up mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em]" style={{ color: C.ink }}>We&apos;re getting your copy ready</h1>
              <p className="get-up mt-2 max-w-[44ch] text-[16px] leading-relaxed" style={{ color: C.ink2 }}>
                <b>{title}</b> is being scanned from the original answer sheet. It will reach <b>{emailMasked}</b>{" "}within 24–48 hours. Check Spam or Promotions if it doesn&apos;t show up.
              </p>
            </>
          ) : (
            <>
              <h1 className="get-up mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em]" style={{ color: C.ink }}>Your download is ready</h1>
              <p className="get-up mt-1.5 text-[16px]" style={{ color: C.ink2 }}>{title}</p>
              <div className="get-up mt-5 flex w-full flex-col gap-2.5">
                {files.map((f, i) => (
                  <a
                    key={f.url}
                    href={f.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={`get-download-${kind}`}
                    onClick={() => ev("get_download", { kind, file: f.name, index: i })}
                    className="flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl px-4 text-[17px] font-bold text-white transition-transform hover:brightness-105 active:translate-y-[3px]"
                    style={{ background: `linear-gradient(180deg, #3a58e4, ${C.blue})`, boxShadow: `0 4px 0 ${C.blueDeep}, inset 0 1px 0 rgba(255,255,255,.3)` }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true"><path d="M12 4v11M12 15l-4-4M12 15l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="min-w-0 truncate">{files.length > 1 ? f.name : "Download now"}</span>
                  </a>
                ))}
              </div>
              {emailMasked && (
                <p className="get-up mt-3 text-[13.5px]" style={{ color: C.muted }}>
                  We&apos;ve also emailed a copy to {emailMasked}, so you have it later. Check Spam or Promotions if you can&apos;t find it.
                </p>
              )}
            </>
          )}

          <div className="get-up mt-8 grid w-full gap-3">
            <p className="text-left text-[13px] font-bold" style={{ color: C.muted }}>More from UPSCPrepNotes</p>
            {promos.map((p) => <PromoCard key={p.id} p={p} phase="ready" kind={kind} />)}
          </div>

          <Link href={returnTo} onClick={() => ev("get_back", { kind })} className="mt-7 text-[15px] font-bold underline underline-offset-2" style={{ color: C.ink2 }}>
            ← Back to where you were
          </Link>
        </section>
      )}
    </main>
  );
}
