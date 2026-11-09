"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { track } from "@/lib/track";

/** Records that someone opened a "beat my score" link, so shares can be measured. */
export default function ChallengeSeen({ code, score }: { code: string; score: number }) {
  useEffect(() => {
    track("quiz_challenge_view", { code, score });
    try { posthog.capture("quiz_challenge_view", { code, score }); } catch {}
  }, [code, score]);
  return null;
}
