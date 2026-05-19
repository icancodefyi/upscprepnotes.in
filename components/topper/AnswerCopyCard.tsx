"use client";

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
  return (
    <Link
      href="/toppers/toppers-copy-compilation"
      className="group block rounded-xl border border-black/[0.06] bg-white p-5 transition duration-300 hover:-translate-y-[2px]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {topperName} {title}
        </h3>
        {available && (
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Available
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{marks} Marks</p>
      <p className="mt-2 text-sm text-zinc-500">
        {available
          ? `Access ${topperName}'s ${title.toLowerCase()} with detailed evaluation.`
          : `Check the complete compilation for ${topperName}'s ${title.toLowerCase()} and other toppers.`}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-black transition group-hover:translate-x-1">
        {available ? "View Copy" : "Check Compilation"} <span className="ml-1">→</span>
      </div>
    </Link>
  );
}
