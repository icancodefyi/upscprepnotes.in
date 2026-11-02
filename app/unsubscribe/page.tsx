import type { Metadata } from "next";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe | UPSCPrepNotes",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ e?: string; t?: string }> }) {
  const { e = "", t = "" } = await searchParams;
  return (
    <main className="up mx-auto flex min-h-[70dvh] max-w-[480px] flex-col justify-center px-5 py-16">
      <UnsubscribeForm email={e} token={t} />
    </main>
  );
}
