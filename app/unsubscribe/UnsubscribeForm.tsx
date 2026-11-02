"use client";

import { useState } from "react";

export default function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  if (!email || !token) {
    return <p className="text-m text-[var(--ink-2)]">This link is incomplete. Open the unsubscribe link from the bottom of one of our emails.</p>;
  }

  async function submit() {
    setState("busy");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ e: email, t: token }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <>
        <h1 className="t-head text-l">You are unsubscribed</h1>
        <p className="mt-3 text-m text-[var(--ink-2)]">We will not email {email} again. Order receipts and download links for purchases still arrive.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="t-head text-l">Stop emails to {email}?</h1>
      <p className="mt-3 text-m text-[var(--ink-2)]">You will no longer get our tips and reminders. Receipts and download links for anything you buy still arrive.</p>
      {state === "error" && <p className="mt-3 text-s text-[var(--mark-deep)]" role="alert">That did not work. Reply to any of our emails and we will remove you by hand.</p>}
      <button type="button" onClick={submit} disabled={state === "busy"} className="btn btn-ink mt-6 h-12 justify-center px-8 disabled:opacity-60">
        {state === "busy" ? "Working..." : "Unsubscribe"}
      </button>
    </>
  );
}
