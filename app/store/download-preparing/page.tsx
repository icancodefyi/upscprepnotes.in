import { Suspense } from "react";
import BrandShell from "@/components/brand/BrandShell";
import { Spinner } from "../_components/SuccessClient";
import PreparingClient from "../_components/PreparingClient";

export default async function DownloadPreparingPage() {
  return (
    <BrandShell>
      <Suspense fallback={<Spinner />}>
        <PreparingClient />
      </Suspense>
    </BrandShell>
  );
}
