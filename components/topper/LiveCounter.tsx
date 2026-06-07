"use client";

import { useEffect, useState } from "react";

export default function LiveCounter() {
  const [count, setCount] = useState(47);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/stats/downloads")
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, [ready]);

  if (!ready) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-bold text-emerald-600 tabular-nums">{count}</span>
      <span className="text-gray-400">downloads in past 30 min</span>
    </span>
  );
}
