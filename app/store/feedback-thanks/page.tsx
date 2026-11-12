import type { Metadata } from "next";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";
import Gilu from "@/components/brand/Gilu";
import { getProductBySlug } from "@/lib/store-products";

export const metadata: Metadata = { title: "Thank you | UPSCPrepNotes", robots: { index: false, follow: false } };

const COPY: Record<string, { head: string; body: string; cta: string; hash?: string }> = {
  expensive: {
    head: "Thank you for telling us.",
    body: "Price matters, and we hear you. If you want to tell us what would feel right, just reply to our email and a real person will read it. And if you do buy, the 7-day refund means you can try it with no risk.",
    cta: "See it again",
  },
  failed: {
    head: "Sorry the payment gave you trouble.",
    body: "Please try another UPI app or a card, or reply to our email and we will sort it out for you. Nothing was charged to you unless you got a confirmation.",
    cta: "Try the payment again",
  },
  unsure: {
    head: "That is completely fair.",
    body: "Take a look at the real sample pages first, so you can see exactly what you would get before you decide. There is no pressure and no deadline.",
    cta: "See the samples",
    hash: "#preview",
  },
};

export default async function FeedbackThanks({ searchParams }: { searchParams: Promise<{ r?: string; p?: string }> }) {
  const { r, p } = await searchParams;
  const c = COPY[r ?? ""] ?? COPY.unsure;
  const product = p ? getProductBySlug(p) : undefined;
  const href = product ? `/store/${product.slug}${c.hash ?? ""}` : "/store";
  return (
    <BrandShell>
      <main className="mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
        <Gilu pose="hello" size={140} className="h-auto w-[110px]" />
        <h1 className="t-display mt-4 text-[clamp(28px,6vw,40px)]">{c.head}</h1>
        <p className="mt-4 text-m leading-[1.65] text-[var(--ink-2)]">{c.body}</p>
        <Link href={href} className="btn btn-blue mt-7 h-12 px-7 [--btn-fs:15px]">{c.cta}</Link>
        <p className="mt-5 text-s text-[var(--muted)]">Your answer helps us make this better for everyone.</p>
      </main>
    </BrandShell>
  );
}
