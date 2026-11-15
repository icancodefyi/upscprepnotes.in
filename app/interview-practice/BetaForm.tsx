"use client";

import { use, useState } from "react";
import { getVisitorId } from "@/lib/track";
import { ATTEMPTS, DEVICES, FACED, FEATURES, OPTIONALS, PAY, STAGES } from "@/lib/interview-beta";
import type { Option } from "@/lib/lead-profile";

const input = "mt-1 h-11 w-full rounded-[12px] bg-[var(--canvas)] px-3 text-m outline-none focus:shadow-[0_0_0_2px_var(--accent)]";

function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; required?: boolean }) {
  return (
    <label className="block text-s">
      <span className="text-[var(--ink-2)]">{label}{required && " *"}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required} className={input}>
        <option value="">Choose</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export default function BetaForm({ searchParams }: { searchParams: Promise<{ src?: string }> }) {
  const { src } = use(searchParams);
  const [f, setF] = useState({ name: "", email: "", phone: "", stage: "", attempt: "", optional: "", faced: "", device: "", pay: "", wish: "" });
  const [features, setFeatures] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (v: string) => setFeatures((x) => (x.includes(v) ? x.filter((y) => y !== v) : [...x, v]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/interview-beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, features, source: src || "direct", visitorId: getVisitorId() }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="h-fit rounded-[24px] bg-white p-7 shadow-[0_0_0_1px_var(--line-2)]">
        <p className="t-head text-l">You are on the list</p>
        <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">Thank you, {f.name.split(" ")[0]}. We will email you when the test version is ready for you to try, and ask what you think.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} data-track="interview-beta-form" className="h-fit rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line-2)] sm:p-7">
      <p className="t-head text-l">Join the test group</p>
      <p className="mt-1 text-s text-[var(--muted)]">About one minute. * required</p>
      <div className="mt-5 grid gap-3">
        <label className="block text-s"><span className="text-[var(--ink-2)]">Your name *</span>
          <input required value={f.name} onChange={(e) => set("name")(e.target.value)} maxLength={80} autoComplete="name" className={input} /></label>
        <label className="block text-s"><span className="text-[var(--ink-2)]">Email *</span>
          <input required type="email" value={f.email} onChange={(e) => set("email")(e.target.value)} maxLength={120} autoComplete="email" className={input} /></label>
        <label className="block text-s"><span className="text-[var(--ink-2)]">WhatsApp number (optional, for the test invite)</span>
          <input type="tel" inputMode="numeric" value={f.phone} onChange={(e) => set("phone")(e.target.value)} maxLength={14} autoComplete="tel" className={input} /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Where are you in prep?" value={f.stage} onChange={set("stage")} options={STAGES} required />
          <Select label="Attempt" value={f.attempt} onChange={set("attempt")} options={ATTEMPTS} />
          <Select label="Optional subject" value={f.optional} onChange={set("optional")} options={OPTIONALS} />
          <Select label="Faced the UPSC interview before?" value={f.faced} onChange={set("faced")} options={FACED} />
          <Select label="You would practise on" value={f.device} onChange={set("device")} options={DEVICES} />
          <Select label="What would you pay for it?" value={f.pay} onChange={set("pay")} options={PAY} />
        </div>
        <fieldset className="mt-1">
          <legend className="text-s text-[var(--ink-2)]">What must it have? Pick all that matter</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FEATURES.map((o) => {
              const on = features.includes(o.value);
              return (
                <button key={o.value} type="button" aria-pressed={on} onClick={() => toggle(o.value)}
                  className={`rounded-full px-3 py-1.5 text-left text-s transition-colors ${on ? "bg-[var(--accent)] text-white" : "bg-[var(--canvas)] text-[var(--ink-2)] hover:bg-[#e9edff]"}`}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="block text-s"><span className="text-[var(--ink-2)]">Anything else you wish it did?</span>
          <textarea value={f.wish} onChange={(e) => set("wish")(e.target.value)} maxLength={600} rows={3} className="mt-1 w-full rounded-[12px] bg-[var(--canvas)] p-3 text-m outline-none focus:shadow-[0_0_0_2px_var(--accent)]" /></label>
      </div>
      {error && <p role="alert" className="mt-3 rounded-[12px] bg-[#fff1ef] p-3 text-s text-[#9b2c20]">{error}</p>}
      <button type="submit" disabled={state === "sending"} data-track="interview-beta-submit" className="btn btn-blue mt-5 h-12 w-full justify-center">
        {state === "sending" ? "Sending…" : "Count me in"}
      </button>
    </form>
  );
}
