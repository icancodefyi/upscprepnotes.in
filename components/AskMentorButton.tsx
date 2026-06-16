"use client";

import Link from "next/link";

export default function AskMentorButton() {
  return (
    <Link
      href="/ask"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-zinc-800 hover:shadow-xl active:scale-[0.97]"
      data-track="ask-mentor-floating-cta"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      Ask AI Mentor
    </Link>
  );
}
