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
      className="group block rounded-xl border border-border/50 bg-card p-5 transition duration-300 hover:-translate-y-[2px] hover:border-primary/20"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {topperName} {title}
        </h3>
        {available && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Available
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{marks} Marks</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {available
          ? `Access ${topperName}'s ${title.toLowerCase()} with detailed evaluation.`
          : `Check the complete compilation for ${topperName}'s ${title.toLowerCase()} and other toppers.`}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-foreground transition group-hover:translate-x-1">
        {available ? "View Copy" : "Check Compilation"} <span className="ml-1">→</span>
      </div>
    </Link>
  );
}
