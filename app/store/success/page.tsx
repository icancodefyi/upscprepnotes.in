import { Suspense } from "react";
import BrandShell from "@/components/brand/BrandShell";
import SuccessClient, { Spinner } from "../_components/SuccessClient";
import QuizTeaser from "@/components/quiz/QuizTeaser";

export default async function SuccessPage() {
  return (
    <BrandShell>
      <Suspense fallback={<Spinner />}>
        <SuccessClient />
      </Suspense>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="purchase-success" variant="compact" lead="While you wait:" />
      </div>
    </BrandShell>
  );
}
