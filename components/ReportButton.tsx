"use client";

import { useState } from "react";
import FeedbackDialog from "@/components/FeedbackDialog";

export default function ReportButton({ topperName }: { topperName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-track="topper-report"
        className="text-s text-[var(--muted)] underline decoration-[var(--line-2)] underline-offset-2 transition-colors hover:text-[var(--ink)]"
      >
        Report incorrect data
      </button>
      <FeedbackDialog
        open={open}
        onClose={() => setOpen(false)}
        prefilledUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </>
  );
}
