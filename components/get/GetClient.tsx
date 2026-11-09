"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useState, useSyncExternalStore } from "react";
import Gilu, { type GiluPose } from "@/components/brand/Gilu";
import { track } from "@/lib/track";

export type Promo = { id: string; kicker: string; title: string; body: string; cta: string; href: string; pose: GiluPose; external?: boolean; image?: string; price?: number };
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

const C = { blue: "#1f3fd6", blueDeep: "#13238a", ink: "#0b0c10", ink2: "#3f4450", muted: "#5f6571", line: "rgba(11,12,16,0.12)", yellowSoft: "#fff8d6", green: "#1a8a4a" };

/** How long the "getting ready" screen runs before the files appear. */
const WAIT_MS = 6500;
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

function utmHref(p: Promo, phase: "wait" | "ready", kind: string): string {
  if (p.external) return p.href;
  return `${p.href}${p.href.includes("?") ? "&" : "?"}utm_source=get&utm_medium=${phase}&utm_campaign=${kind}`;
}

/** One offer card. "large" is the rotating feature while people wait; "small" is a shelf card on the results view. */
function OfferCard({ p, phase, kind, size }: { p: Promo; phase: "wait" | "ready"; kind: string; size: "large" | "small" }) {
  const large = size === "large";
  const price = p.price !== undefined ? `₹${p.price}` : "Free";
  const common = {
    href: utmHref(p, phase, kind),
    "data-track": `get-promo-${p.id}`,
    onClick: () => ev("get_promo_click", { promo: p.id, phase, kind }),
    className: large
      ? "flex items-stretch gap-4 rounded-3xl bg-white p-3.5 text-left transition-transform hover:-translate-y-[2px]"
      : "group flex w-[52vw] max-w-[230px] shrink-0 snap-start flex-col rounded-3xl bg-white p-2.5 text-left transition-transform hover:-translate-y-[3px] sm:w-auto sm:max-w-none sm:shrink",
    style: { boxShadow: `0 0 0 1.5px ${C.line}, 0 14px 30px -22px rgba(11,12,16,.45)` },
  };
  const coverBox = large ? "h-[170px] w-[128px] shrink-0" : "h-[84px] w-full sm:h-[clamp(110px,19vh,190px)]";
  const cover = p.image ? (
    <span className={`block overflow-hidden rounded-2xl bg-white ${coverBox}`} style={{ boxShadow: `inset 0 0 0 1.5px ${C.line}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
    </span>
  ) : (
    <span className={`grid place-items-center rounded-2xl ${coverBox}`} style={{ background: C.yellowSoft }}>
      <Gilu pose={p.pose} size={large ? 110 : 96} className={large ? "h-auto w-[104px]" : "h-auto w-[72px] sm:w-[clamp(72px,11vh,112px)]"} />
    </span>
  );
  const cta = (
    <span className="mt-2 block whitespace-nowrap rounded-full px-2 py-1.5 text-center text-[12.5px] font-bold text-white sm:text-[13.5px]" style={{ background: C.blue, boxShadow: `0 3px 0 ${C.blueDeep}` }}>{p.cta} →</span>
  );
  const body = large ? (
    <>
      {cover}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="block text-[20px] font-bold leading-snug" style={{ color: C.ink }}>{p.title}</span>
        <span className="mt-1 block text-[14.5px] leading-snug" style={{ color: C.ink2 }}>{p.body}</span>
        <span className="mt-auto block pt-2 text-[18px] font-bold" style={{ color: C.ink }}>{price}</span>
        {cta}
      </span>
    </>
  ) : (
    <>
      {cover}
      <span className="mt-2 block px-1 text-[14.5px] font-bold leading-snug" style={{ color: C.ink }}>{p.title}</span>
      <span className="mt-0.5 block px-1 text-[14px] font-bold" style={{ color: p.price === undefined ? C.green : C.ink2 }}>{price}</span>
      <span className="mt-auto block px-0.5 pt-1">{cta}</span>
    </>
  );
  return p.external ? (
    <a {...common} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <Link {...common}>{body}</Link>
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
    const rot = setInterval(() => setSlide((s) => s + 1), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(rot); };
  }, [kind, files.length, pending, reduced]);

  const wait = reduced ? WAIT_REDUCED_MS : WAIT_MS;
  const featured = promos.length ? promos[slide % promos.length] : null;

  return (
    <main className="mx-auto flex h-dvh max-h-dvh w-full max-w-[1200px] flex-col overflow-hidden px-4 pb-3 pt-4 sm:px-8">
      <style>{`
        @keyframes get-fill { from { width: 0% } to { width: 100% } }
        @keyframes get-up { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes get-pop { 0% { transform: scale(.7); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        .get-up { animation: get-up .4s cubic-bezier(.22,1,.36,1) both }
        .get-pop { animation: get-pop .4s cubic-bezier(.34,1.56,.64,1) both }
        @media (prefers-reduced-motion: reduce) { .get-up, .get-pop { animation: none } }
      `}</style>

      <Link href="/" className="text-center text-[14.5px] font-bold" style={{ color: C.ink }}>UPSCPrepNotes</Link>

      {!ready ? (
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center text-center" aria-live="polite" aria-busy="true">
          <Gilu pose="reading" size={150} className="h-auto w-[110px] sm:w-[130px]" />
          <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]" style={{ color: C.ink }}>
            {pending ? "Getting your request in" : "Getting your files ready"}
          </h1>
          <p className="mt-1 text-[15px]" style={{ color: C.ink2 }}>{STEPS[step]}…</p>
          <div className="mt-4 h-3 w-full max-w-[420px] overflow-hidden rounded-full" style={{ background: "#e3e6ee" }} role="progressbar" aria-label="Preparing your files">
            <div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${C.blue}, #6f87f7)`, animation: `get-fill ${wait}ms linear forwards` }} />
          </div>

          {featured && (
            <div key={featured.id} className="get-up mt-6 w-full max-w-[520px]">
              <p className="mb-2 text-[12px] font-bold" style={{ color: C.muted }}>While you wait</p>
              <OfferCard p={featured} phase="wait" kind={kind} size="large" />
              <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
                {promos.map((p, i) => (
                  <span key={p.id} className="h-2 w-2 rounded-full" style={{ background: i === slide % promos.length ? C.blue : "#c9cfdd" }} />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="flex min-h-0 flex-1 flex-col justify-center gap-4 sm:gap-6">
          <div className="get-pop flex items-center gap-3 sm:gap-6">
            <Gilu pose={pending ? "dozing" : "celebrating"} size={130} className="h-auto w-[64px] shrink-0 sm:w-[120px]" />
            <div className="min-w-0">
              <h1 className="text-[22px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]" style={{ color: C.ink }}>
                {pending ? "We're getting your copy ready" : "Your download is ready"}
              </h1>
              <p className="mt-1 text-[14.5px] leading-snug" style={{ color: C.ink2 }}>
                {pending
                  ? <><b>{title}</b> is being scanned from the original answer sheet. It reaches <b>{emailMasked}</b>{" "}within 24–48 hours.</>
                  : title}
              </p>
            </div>
          </div>

          {!pending && (
            <div className="get-up grid gap-2 sm:grid-cols-3">
              {files.map((f, i) => (
                <a
                  key={f.url}
                  href={f.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track={`get-download-${kind}`}
                  onClick={() => ev("get_download", { kind, file: f.name, index: i })}
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-2xl px-4 text-[15px] sm:h-12 sm:text-[16px] font-bold text-white transition-transform hover:brightness-105 active:translate-y-[3px]"
                  style={{ background: `linear-gradient(180deg, #3a58e4, ${C.blue})`, boxShadow: `0 4px 0 ${C.blueDeep}, inset 0 1px 0 rgba(255,255,255,.3)` }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true"><path d="M12 4v11M12 15l-4-4M12 15l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="min-w-0 truncate">{files.length > 1 ? f.name : "Download now"}</span>
                </a>
              ))}
            </div>
          )}
          {!pending && emailMasked && (
            <p className="get-up -mt-2 text-center text-[12px]" style={{ color: C.muted }}>We&apos;ve also emailed a copy to {emailMasked}. Check Spam or Promotions if you can&apos;t find it.</p>
          )}

          <div className="get-up flex min-h-0 flex-col">
            <h2 className="mb-2.5 text-[18px] font-bold tracking-[-0.01em] sm:text-[20px]" style={{ color: C.ink }}>Keep going while you are here</h2>
            {/* Phones: one card per swipe, no vertical scroll. Laptops: all offers side by side. */}
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-flow-col sm:auto-cols-fr sm:overflow-visible sm:px-0">
              {promos.map((p) => <OfferCard key={p.id} p={p} phase="ready" kind={kind} size="small" />)}
            </div>
          </div>

          <div className="text-center">
            <Link href={returnTo} onClick={() => ev("get_back", { kind })} className="text-[14.5px] font-bold underline underline-offset-2" style={{ color: C.ink2 }}>
              ← Back to where you were
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
