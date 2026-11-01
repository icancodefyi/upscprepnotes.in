"use client";

import { useState } from "react";
import FeedbackDialog from "@/components/FeedbackDialog";

/** "This number looks wrong" — opens the existing feedback dialog with the page URL filled in. */
export default function ReportLink({ first }: { first: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} data-track="topper-report" className="w-full rounded-[10px] px-2 py-1.5 text-left text-s text-[var(--muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
        {`Spot a wrong number on ${first}'s page? Report it`}
      </button>
      <FeedbackDialog open={open} onClose={() => setOpen(false)} prefilledUrl={typeof window !== "undefined" ? window.location.href : ""} />
    </>
  );
}
