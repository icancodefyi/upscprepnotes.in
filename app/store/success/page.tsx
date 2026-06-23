"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconCheck, IconDownload, IconShoppingBag, IconArrowLeft } from "@tabler/icons-react";
import { Suspense } from "react";
import { useStoreVariant } from "@/components/store/useStoreVariant";

function SuccessInner() {
  // Ensure store_layout_variant is set even on page reload / direct success page access
  useStoreVariant(false);
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<{
    status: string;
    items: { slug: string; title: string }[];
    total: number;
    downloadToken: string;
    orderId: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ref) {
      setError("No order reference found");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    function poll() {
      fetch(`/api/order/status?ref=${ref}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.found && data.status === "paid") {
            setOrder(data);
            setLoading(false);
            posthog.capture("purchase_completed", {
              order_id: data.orderId,
              total_amount: data.total,
              item_slugs: data.items?.map((i: { slug: string }) => i.slug),
              item_count: data.items?.length,
            });
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 1500);
          } else {
            setError("Your payment is confirmed but files are still being prepared. Check your email for the download link.");
            setLoading(false);
          }
        })
        .catch(() => {
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 1500);
          } else {
            setError("Could not verify order status. Check your email for the download link.");
            setLoading(false);
          }
        });
    }

    poll();
  }, [ref]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-10 w-10 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Almost there!</h1>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <Link href="/store" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
          <IconArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <IconCheck size={28} className="text-emerald-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="mt-1 text-sm text-gray-500">
          Order <strong>{order?.orderId}</strong>
        </p>
        <p className="text-xs text-gray-400">
          A confirmation email has been sent to <strong>{order?.email}</strong>
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Downloads</h2>
        <div className="mt-4 space-y-3">
          {order?.items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <IconShoppingBag size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <a
                    href={`/api/download/${order?.downloadToken}?slug=${item.slug}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <IconDownload size={12} />
                    Download ZIP
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 p-5">
        <p className="text-xs font-semibold text-emerald-800">What happens next?</p>
        <ul className="mt-2 space-y-1.5 text-xs text-emerald-700">
          <li className="flex items-start gap-2">
            <IconCheck size={13} className="mt-0.5 shrink-0" />
            Your files are ready for instant download above
          </li>
          <li className="flex items-start gap-2">
            <IconCheck size={13} className="mt-0.5 shrink-0" />
            We&apos;ve also emailed you a backup download link
          </li>
          <li className="flex items-start gap-2">
            <IconCheck size={13} className="mt-0.5 shrink-0" />
            Need help? Reply to the email for support
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          <IconArrowLeft size={15} />
          Continue Browsing Store
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <svg className="h-10 w-10 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
