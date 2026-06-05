"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [excluded, setExcluded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExcluded(localStorage.getItem("_optex") === "1");
  }, []);

  function toggle() {
    const next = !excluded;
    setExcluded(next);
    if (next) {
      localStorage.setItem("_optex", "1");
    } else {
      localStorage.removeItem("_optex");
    }
    // reload so tracking script picks up the change
    window.location.reload();
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-lg font-bold">Settings</h1>
      <div className="mt-6 flex items-center justify-between rounded-xl border border-black/[0.06] bg-white p-5">
        <div>
          <p className="text-sm font-semibold">Exclude my browsing from analytics</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {excluded
              ? "Your activity is not being recorded"
              : "Your activity is currently being tracked"}
          </p>
        </div>
        <button
          onClick={toggle}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            excluded ? "bg-emerald-500" : "bg-zinc-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              excluded ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
