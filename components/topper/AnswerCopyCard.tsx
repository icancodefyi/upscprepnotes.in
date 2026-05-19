"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  title: string;
  marks: number;
  available: boolean;
  topperName: string;
}

export default function AnswerCopyCard({
  title,
  marks,
  available,
  topperName,
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "not-found">("idle");

  if (available) {
    return (
      <Link
        href="#resources"
        className="group block rounded-xl border border-black/[0.06] bg-white p-4 transition duration-300 hover:-translate-y-[2px]"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm font-medium text-green-600">Available</span>
        </div>
        <p className="mt-2 text-sm text-zinc-500">{marks} Marks</p>
        <p className="mt-3 text-sm text-zinc-600">
          {topperName}'s answer copy is ready. Open to view.
        </p>
        <div className="mt-4 flex items-center text-sm font-medium">
          <span>Open Copy</span>
          <span className="ml-2 transition group-hover:translate-x-1">→</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-4 transition duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm font-medium text-zinc-400">
          {state === "loading" ? "Searching" : state === "not-found" ? "Unavailable" : "Not Available"}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-500">{marks} Marks</p>

      {state === "idle" && (
        <>
          <p className="mt-3 text-sm text-zinc-600">
            Check if answer copies are available for {topperName}.
          </p>
          <button
            onClick={() => {
              setState("loading");
              setTimeout(() => setState("not-found"), 1400);
            }}
            className="mt-4 flex items-center text-sm font-medium text-zinc-700 transition hover:text-black"
          >
            <span>Get Answer Copy</span>
            <span className="ml-2">→</span>
          </button>
        </>
      )}

      {state === "loading" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-400 border-t-transparent" />
          Loading answer copies...
        </div>
      )}

      {state === "not-found" && (
        <>
          <p className="mt-3 text-sm text-zinc-500 italic">
            No answer copies found for this paper.
          </p>
          <Link
            href="/toppers/toppers-copy-compilation"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            View 50+ Answer Copy Compilation
            <span>→</span>
          </Link>
        </>
      )}
    </div>
  );
}
