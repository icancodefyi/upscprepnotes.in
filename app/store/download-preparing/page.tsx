import { Suspense } from "react";
import BrandShell from "@/components/brand/BrandShell";
import { Spinner } from "../_components/SuccessClient";
import PreparingClient from "../_components/PreparingClient";
import QuizTeaser from "@/components/quiz/QuizTeaser";

export default async function DownloadPreparingPage() {
  return (
    <BrandShell>
      <Suspense fallback={<Spinner />}>
        <PreparingClient />
      </Suspense>
      <div className="mx-auto w-full max-w-[1080px] px-4 pb-12">
        <QuizTeaser track="download-preparing" variant="compact" lead="While your files get ready:" />
      </div>
    </BrandShell>
  );
}
