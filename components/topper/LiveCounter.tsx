"use client";

import { useEffect, useState } from "react";

export default function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/downloads")
      .then((r) => r.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, []);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span className="font-semibold text-gray-700 tabular-nums">{count.toLocaleString("en-IN")}+</span>
      <span>downloads this month</span>
    </span>
  );
}
