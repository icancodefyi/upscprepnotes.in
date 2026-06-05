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
        className="w-full rounded-xl border border-dashed border-zinc-200 px-4 py-2 text-xs text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50"
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
