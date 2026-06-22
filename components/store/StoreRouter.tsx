"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { useStoreVariant } from "@/components/store/useStoreVariant";
import StoreClient from "@/components/store/StoreClient";
import StoreList from "@/components/store/StoreList";
import FakePurchaseToast from "@/components/store/FakePurchaseToast";

export default function StoreRouter() {
  const variant = useStoreVariant();

  useEffect(() => {
    posthog.capture("store_viewed", { variant });
  }, [variant]);

  return (
    <>
      {variant === "list" ? <StoreList /> : <StoreClient />}
      {variant === "list" && <FakePurchaseToast />}
    </>
  );
}
