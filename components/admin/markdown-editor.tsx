"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MarkdownEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  rows?: number;
  placeholder?: string;
}

export function MarkdownEditor({
  id,
  value,
  onChange,
  label,
  rows = 6,
  placeholder,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <LabelSlot htmlFor={id}>{label}</LabelSlot>
        <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mode === "edit"
                ? "bg-black text-white"
                : "text-zinc-500 hover:text-black"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mode === "preview"
                ? "bg-black text-white"
                : "text-zinc-500 hover:text-black"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === "edit" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
        />
      ) : (
        <div className="prose prose-zinc max-w-none rounded-lg border border-black/10 bg-white px-4 py-3 text-sm prose-headings:font-semibold prose-p:leading-7 min-h-[100px]">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-zinc-400">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
}

function LabelSlot({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm leading-none font-medium select-none"
    >
      {children}
    </label>
  );
}
