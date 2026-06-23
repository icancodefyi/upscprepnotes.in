"use client";

import { useStoreVariant } from "@/components/store/useStoreVariant";
import StoreClient from "@/components/store/StoreClient";
import StoreList from "@/components/store/StoreList";
import FakePurchaseToast from "@/components/store/FakePurchaseToast";

export default function StoreRouter() {
  const variant = useStoreVariant();

  return (
    <>
      {variant === "list" ? <StoreList /> : <StoreClient />}
      {variant === "list" && <FakePurchaseToast />}
    </>
  );
}
