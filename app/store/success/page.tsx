import { Suspense } from "react";
import BrandShell from "@/components/brand/BrandShell";
import SuccessClient, { Spinner } from "../_components/SuccessClient";

export default async function SuccessPage() {
  return (
    <BrandShell>
      <Suspense fallback={<Spinner />}>
        <SuccessClient />
      </Suspense>
    </BrandShell>
  );
}
