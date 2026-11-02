"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Re-fetches the server component every `seconds`, with a pause toggle. */
export function AutoRefresh({ seconds = 10 }: { seconds?: number }) {
  const router = useRouter();
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [on, seconds, router]);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900"
    >
      <span className={`h-2 w-2 rounded-full ${on ? "animate-pulse bg-emerald-500" : "bg-zinc-300"}`} />
      {on ? `Live, every ${seconds}s` : "Paused"}
    </button>
  );
}
