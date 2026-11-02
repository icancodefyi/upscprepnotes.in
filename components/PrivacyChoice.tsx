"use client";

import { useEffect, useState } from "react";
import { getConsent, onConsentChange, setConsent, type Consent } from "@/lib/consent";

/** Lets a visitor see and change their analytics choice (used on the privacy policy). */
export default function PrivacyChoice() {
  const [choice, setChoice] = useState<Consent | undefined>(undefined);
  useEffect(() => {
    setChoice(getConsent());
    return onConsentChange(() => setChoice(getConsent()));
  }, []);
  if (choice === undefined) return null;
  const on = choice === "yes";
  return (
    <p className="leading-8 text-zinc-700">
      Your choice on this browser:{" "}
      <strong>{choice === null ? "not set yet" : on ? "analytics on" : "analytics off"}</strong>.{" "}
      <button type="button" onClick={() => setConsent(on ? "no" : "yes")} className="font-bold underline underline-offset-2">
        {on ? "Turn analytics off" : "Turn analytics on"}
      </button>
    </p>
  );
}
