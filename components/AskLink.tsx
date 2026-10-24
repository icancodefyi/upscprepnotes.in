"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Question to prefill on the /ask page. */
  query: string;
};

/**
 * Link to /ask that carries the question in sessionStorage instead of the URL.
 *
 * Why: `/ask?q=...` links are server-rendered across ~1,050 pages (290 topper
 * pages + the yearly current-affairs page). Crawlers followed those links and
 * the page auto-submitted the query, which turned /ask into a free, unauthenticated
 * LLM endpoint — ~200 requests/day from rotating cloud IPs in Oct 2026.
 * Keeping the question out of the HTML and the URL removes the trigger entirely.
 */
export default function AskLink({ query, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      href="/ask"
      onClick={(event) => {
        try {
          sessionStorage.setItem("ask:prefill", query);
        } catch {
          // sessionStorage can throw in private mode; the link still works.
        }
        onClick?.(event);
      }}
    />
  );
}
