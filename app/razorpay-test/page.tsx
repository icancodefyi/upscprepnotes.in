import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RazorpayCheckout from "@/components/razorpay/RazorpayCheckout";
import { PRODUCTS } from "@/lib/store-products";

export const metadata: Metadata = {
  title: "Razorpay checkout test",
  robots: { index: false, follow: false },
};

/** Test page for the Razorpay flow. Off unless RAZORPAY_TEST_PAGE=1 is set, so it never appears on the live site. */
export default function RazorpayTestPage() {
  if (process.env.RAZORPAY_TEST_PAGE !== "1") notFound();

  const product = PRODUCTS.find((p) => p.slug === "top-10-rankers-strategy");
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-[520px] px-6 py-16">
      <h1 className="text-[26px] font-bold">Razorpay checkout test</h1>
      <p className="mt-2 text-[15px] text-[#3f4450]">Test mode only. Use Razorpay&apos;s test card, for example 4111 1111 1111 1111, any future expiry, any CVV.</p>
      <div className="mt-8">
        <RazorpayCheckout slugs={[product.slug]} name="UPSCPrepNotes" description={product.title} displayTotal={product.price} />
      </div>
    </main>
  );
}
