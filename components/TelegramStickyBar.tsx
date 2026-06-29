"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "tg-bar-dismissed";
const TELEGRAM_LINK = "https://t.me/+VYMxrig-a8AzZmNl";

export default function TelegramStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[#0088cc]/20 bg-white px-5 py-3 shadow-lg shadow-black/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f4fd] shrink-0">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#0088cc]" fill="currentColor">
              <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <p className="flex-1 text-sm font-medium text-zinc-800">
            Join <span className="font-bold">100+ aspirants</span> on Telegram — daily current affairs at 7 AM
          </p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#0088cc] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0077b5]"
          >
            Join Free →
          </a>
          <button
            onClick={dismiss}
            className="shrink-0 rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
