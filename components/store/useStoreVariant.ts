"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";

export type StoreVariant = "grid" | "list";

const COOKIE_NAME = "upsc_store_variant";

function readCookie(): StoreVariant | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  if (match) {
    const val = match[2] as StoreVariant;
    if (val === "grid" || val === "list") return val;
  }
  return null;
}

function writeCookie(variant: StoreVariant) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${variant};expires=${expires};path=/;SameSite=Lax`;
}

function assignVariant(): StoreVariant {
  const existing = readCookie();
  if (existing) return existing;
  const chosen: StoreVariant = Math.random() < 0.5 ? "grid" : "list";
  writeCookie(chosen);
  return chosen;
}

/**
 * Returns the store A/B variant for the current user.
 * Defaults to "grid" during SSR to avoid hydration mismatch.
 * Persisted in a cookie for 30 days so the same user always sees the same variant.
 * Variant is attached to every PostHog event via `posthog.register()` (super property).
 *
 * @param captureStoreViewed - Whether to fire a `store_viewed` event. Default true.
 *                             Pass false when called from non-store pages (e.g. product detail)
 *                             to set the super property without double-counting views.
 */
export function useStoreVariant(captureStoreViewed = true): StoreVariant {
  const [variant, setVariant] = useState<StoreVariant>("grid");

  useEffect(() => {
    const v = assignVariant();
    // Register super property before any capture so it's attached to the event
    posthog.register({ store_layout_variant: v });
    if (captureStoreViewed) {
      posthog.capture("store_viewed", { variant: v, store_layout_variant: v });
    }
    setVariant(v);
  }, []);

  return variant;
}
