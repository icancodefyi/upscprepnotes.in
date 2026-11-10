"use client";

import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Gilu from "@/components/brand/Gilu";
import { ChatIcon, DownloadIcon, FileIcon, MailIcon, ZipIcon } from "@/components/store/icons";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

const ANIM = `
  @keyframes ok-up { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes ok-pop { 0% { transform: scale(.75); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
  @keyframes ok-bar { 0% { transform: translateX(-100%) } 100% { transform: translateX(250%) } }
  .ok-up { animation: ok-up .45s cubic-bezier(.22,1,.36,1) both }
  .ok-pop { animation: ok-pop .5s cubic-bezier(.34,1.56,.64,1) both }
  @media (prefers-reduced-motion: reduce) { .ok-up, .ok-pop { animation: none } .ok-bar { animation: none !important } }
`;

/** Shown while an order is being confirmed. Gilu reads while the bank and our server agree. */
export function Spinner({ label }: { label?: string }) {
  return (
    <div className="grid min-h-[64vh] place-items-center px-6">
      <style>{ANIM}</style>
      <div className="text-center" role="status" aria-live="polite">
        <Gilu pose="reading" size={150} className="mx-auto h-auto w-[130px]" />
        <p className="mt-3 text-l font-bold tracking-[-0.01em]">{label ?? "One moment"}</p>
        <p className="mt-1 text-s text-[var(--muted)]">This usually takes a few seconds.</p>
        <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-[var(--line-2)]">
          <div className="ok-bar h-full w-1/3 rounded-full bg-[var(--accent)]" style={{ animation: "ok-bar 1.3s ease-in-out infinite" }} />
        </div>
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
            // Reloading this page must not count the same payment twice.
            const seenKey = `purchase_tracked_${data.orderId}`;
            let seen = false;
            try { seen = sessionStorage.getItem(seenKey) === "1"; sessionStorage.setItem(seenKey, "1"); } catch {}
            if (!seen) posthog.capture("purchase_completed", { order_id: data.orderId, total_amount: data.total, item_slugs: data.items?.map((i: { slug: string }) => i.slug), item_count: data.items?.length });
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

  if (loading) return <Spinner label="Confirming your payment…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-32 text-center">
        <style>{ANIM}</style>
        <Gilu pose="dozing" size={150} className="ok-pop mx-auto h-auto w-[130px]" />
        <h1 className="t-display ok-up mt-4 text-h1">Almost there</h1>
        <p className="ok-up mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{error}</p>
        <Link href="/store" className="btn btn-ink mt-8">
          Back to the store
        </Link>
      </div>
    );
  }

  const downloadHref = (slug: string) => `/api/download/${order?.downloadToken}?slug=${slug}`;
  const listHref = (slug: string) => `/download/${order?.downloadToken}?slug=${slug}`;
  const many = (order?.items.length ?? 0) > 1;

  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-28 sm:pt-32">
      <style>{ANIM}</style>

      <div className="text-center">
        <div className="relative mx-auto grid h-[190px] w-[190px] place-items-center">
          <span aria-hidden className="absolute inset-3 rounded-full bg-[#fff8d6]" />
          <Gilu pose="celebrating" size={170} className="ok-pop relative h-auto w-[150px]" />
        </div>
        <h1 className="t-display ok-up mt-4 text-h1">You&apos;re all set</h1>
        <p className="ok-up mt-3 text-m leading-[1.55] text-[var(--ink-2)]">
          Thank you. {many ? "Your files are" : "Your file is"} ready to download.
        </p>
        <p className="ok-up mt-1 text-s text-[var(--muted)]">
          Order {order?.orderId}
          {order?.email && !order.email.includes("unknown@") ? <> · we also sent a backup link to <strong className="text-[var(--ink-2)]">{order.email}</strong></> : null}
        </p>
      </div>

      <div className={`${card} ok-up mt-9 p-5 sm:p-6`}>
        <h2 className="text-l font-bold tracking-[-0.01em]">Your downloads</h2>
        <div className="mt-4 space-y-3">
          {order?.items.map((item) => (
            <div key={item.slug} className="rounded-[18px] bg-[var(--canvas)] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <ZipIcon size={52} />
                  <div className="min-w-0">
                    <p className="text-m font-bold leading-snug">{item.title}</p>
                    <p className="mt-0.5 text-s text-[var(--muted)]">Everything in one ZIP</p>
                  </div>
                </div>
                <a
                  href={downloadHref(item.slug)}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-2xl px-5 text-[15px] font-bold text-white transition-transform hover:brightness-105 active:translate-y-[3px]"
                  style={{ background: "linear-gradient(180deg, #3a58e4, #1f3fd6)", boxShadow: "0 4px 0 #13238a, inset 0 1px 0 rgba(255,255,255,.3)" }}
                >
                  <DownloadIcon size={18} />
                  Download
                </a>
              </div>
              <p className="mt-3 flex items-start gap-2 border-t border-[var(--line)] pt-3 text-s leading-[1.5] text-[var(--muted)]">
                <FileIcon size={18} className="mt-[2px]" />
                <span>
                  On a phone? <Link href={listHref(item.slug)} className="font-bold text-[var(--accent)] hover:underline">Open the file list</Link> and download one PDF at a time.
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="ok-up mt-10 text-l font-bold tracking-[-0.01em]">Good to know</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { icon: <MailIcon size={42} />, title: "Backup in your inbox", body: "If you can't see it, check Spam or Promotions." },
          { icon: <FileIcon size={40} />, title: "Keep this link", body: "It doesn't expire, so you can come back any time." },
          { icon: <ChatIcon size={42} />, title: "A reply away", body: "Write back to the email and a real person answers." },
        ].map((t) => (
          <div key={t.title} className={`${card} ok-up p-4`}>
            {t.icon}
            <p className="mt-3 text-m font-bold leading-snug">{t.title}</p>
            <p className="mt-1 text-s leading-[1.5] text-[var(--muted)]">{t.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/store" className="text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
          Keep browsing the store →
        </Link>
      </div>
    </div>
  );
}
