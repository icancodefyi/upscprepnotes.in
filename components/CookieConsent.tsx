"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "upsctn-cookie-consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      setConsent(raw === "true" ? true : raw === "false" ? false : null);
    } catch {
      setConsent(null);
    }
  }, []);

  function accept() {
    setConsent(true);
    try {
      localStorage.setItem(CONSENT_KEY, "true");
    } catch {}
  }

  function decline() {
    setConsent(false);
    try {
      localStorage.setItem(CONSENT_KEY, "false");
    } catch {}
  }

  return { consent, accept, decline };
}

export default function CookieConsent() {
  const { consent, accept, decline } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-gray-600 sm:text-sm">
          We use cookies to understand how you use our site and improve your experience.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
