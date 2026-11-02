"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <span aria-hidden className="mx-auto block h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--line-2)] border-t-[var(--accent)]" />
        {label && <p className="mt-4 text-s text-[var(--muted)]">{label}</p>}
      </div>
    </div>
  );
}

/** Order confirmation: polls the order until it is paid, then lists the downloads (original copy). */
export default function SuccessClient() {
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

  if (loading) return <Spinner label="Verifying your payment..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-36 text-center">
        <h1 className="t-display text-h1">Almost there!</h1>
        <p className="mt-4 text-m leading-[1.6] text-[var(--ink-2)]">{error}</p>
        <Link href="/store" className="btn btn-ink mt-8">
          ← Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-36">
      <div className="text-center">
        <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#d4f1df] text-l font-bold text-[#14532d]">✓</span>
        <h1 className="t-display mt-5 text-h1">Payment Successful!</h1>
        <p className="mt-3 text-m text-[var(--ink-2)]">
          Order <strong>{order?.orderId}</strong>
        </p>
        <p className="text-s text-[var(--muted)]">
          A confirmation email has been sent to <strong>{order?.email}</strong>
        </p>
      </div>

      <div className={`${card} mt-10 p-6`}>
        <h2 className="text-m font-bold">Your Downloads</h2>
        <div className="mt-4 space-y-3">
          {order?.items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between gap-4 rounded-[16px] bg-[var(--canvas)] p-4">
              <p className="text-m font-bold">{item.title}</p>
              <a href={`/api/download/${order?.downloadToken}?slug=${item.slug}`} className="btn btn-blue h-10 shrink-0 px-4 [--btn-fs:14px]">
                Download ZIP ↓
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[20px] bg-[#e9edff] p-5">
        <p className="text-s font-bold text-[var(--accent-deep)]">What happens next?</p>
        <ul className="mt-2 space-y-1.5 text-s text-[var(--accent-deep)]">
          {["Your files are ready for instant download above", "We've also emailed you a backup download link", "Need help? Reply to the email for support"].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span aria-hidden className="font-bold">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 text-center">
        <Link href="/store" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
          ← Continue Browsing Store
        </Link>
      </div>
    </div>
  );
}
