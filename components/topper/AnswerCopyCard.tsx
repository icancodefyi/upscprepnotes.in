"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  title: string;
  marks: number;
  topperName: string;
}

export default function AnswerCopyCard({
  title,
  marks,
  topperName,
}: Props) {
  const paper = title.split(" ")[0] || title;
  const isHighScore = marks >= 120;
  const isMidScore = marks >= 100;

  return (
    <Link
      href="/toppers/toppers-copy-compilation"
      data-track="answer-card-bundle"
      className="group block rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:-translate-y-[2px] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider">
          {paper}
        </Badge>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug">
        {topperName}&apos;s {title}
      </h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{marks}</span>
        <span className="text-xs text-muted-foreground">marks</span>
        {isHighScore && (
          <Badge className="ml-auto rounded-md px-2 py-0.5 text-[10px]">
            High Scoring
          </Badge>
        )}
        {isMidScore && !isHighScore && (
          <Badge variant="secondary" className="ml-auto rounded-md px-2 py-0.5 text-[10px]">
            Strong Score
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center text-sm font-medium text-foreground transition group-hover:translate-x-1">
        View Answer Copy &rarr;
      </div>
    </Link>
  );
}
