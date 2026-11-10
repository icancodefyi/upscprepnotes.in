import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { PRODUCTS } from "@/lib/store-products";
import {
  fileUrl,
  formatBytes,
  getProductFiles,
  groupFiles,
  zipUrl,
} from "@/lib/download-manifest";
import BrandShell from "@/components/brand/BrandShell";
import Gilu from "@/components/brand/Gilu";
import { DownloadIcon, ZipIcon } from "@/components/store/icons";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Downloads",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ slug?: string }>;
}

export default async function DownloadPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { slug: single } = await searchParams;

  await connectDB();
  const order = await OrderModel.findOne({ downloadToken: token, status: "paid" }).lean();

  if (!order) {
    return (
      <BrandShell>
        <div className="mx-auto max-w-lg px-6 pb-24 pt-32 text-center">
          <Gilu pose="sorry" size={150} className="mx-auto h-auto w-[130px]" />
          <h1 className="t-display mt-4 text-h1">This link is not active</h1>
          <p className="mt-4 text-m leading-[1.6] text-[var(--ink-2)]">
            The download link is either wrong or the payment has not been confirmed yet. Reply to your order email and we will sort it out.
          </p>
          <Link href="/store" className="btn btn-ink mt-8">
            ← Back to store
          </Link>
        </div>
      </BrandShell>
    );
  }

  const items = (order.items || []).filter((item: { slug: string }) => !single || item.slug === single);

  return (
    <BrandShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <div className={`${card} p-6 sm:p-8`}>
          <div className="flex items-center gap-4 sm:gap-6">
            <Gilu pose="celebrating" size={120} className="h-auto w-[84px] shrink-0 sm:w-[110px]" />
            <div className="min-w-0">
              <h1 className="t-display text-h1">Your files are ready</h1>
              <p className="mt-2 text-s text-[var(--muted)]">
                Order {String(order._id).slice(-8).toUpperCase()}
                {order.email && !String(order.email).includes("unknown@") ? ` · ${order.email}` : ""}
              </p>
            </div>
          </div>
          <p className="mt-5 rounded-[14px] bg-[#fff8d6] px-4 py-3 text-s leading-[1.55] text-[var(--hl-ink)]">
            Download each PDF separately: it works better than the big ZIP on a phone. Use Wi-Fi, and keep this link. It doesn&apos;t expire.
          </p>
        </div>

        {items.map((item: { slug: string; title: string }) => {
          const files = getProductFiles(item.slug);
          const product = PRODUCTS.find((p) => p.slug === item.slug);
          const title = product?.title || item.title;

          if (!files) {
            return (
              <section key={item.slug} className={`${card} mt-8 p-6`}>
                <h2 className="text-m font-bold">{title}</h2>
                <p className="mt-2 text-s leading-[1.6] text-[var(--ink-2)]">
                  Your files for this product are still being prepared. We have been notified and will email you the moment they are ready — usually within a few hours.
                </p>
              </section>
            );
          }

          const groups = groupFiles(files.files).map((group) => ({
            ...group,
            title: group.title === files.folder ? "All files" : group.title,
          }));

          return (
            <section key={item.slug} className="mt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="t-head text-l">{title}</h2>
                <p className="text-s text-[var(--muted)]">
                  {files.count} files · {formatBytes(files.size)}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {groups.map((group, index) => (
                  <details key={group.title} open={index === 0 && groups.length <= 6} className={`${card} group overflow-hidden`}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="text-m font-bold">{group.title}</span>
                      <span className="text-s text-[var(--muted)]">
                        {group.files.length} {group.files.length === 1 ? "file" : "files"}
                      </span>
                    </summary>
                    <ul className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
                      {group.files.map((file) => (
                        <li key={file.path}>
                          <a href={fileUrl(files.folder, file.path)} className="flex items-center justify-between gap-3 px-5 py-3 text-s transition hover:bg-[var(--canvas)]">
                            <span className="flex min-w-0 items-center gap-2">
                              <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e3e8fb] text-[var(--accent)]">
                                <DownloadIcon size={14} />
                              </span>
                              <span className="truncate">{file.name}</span>
                            </span>
                            <span className="tab shrink-0 text-[var(--muted)]">{formatBytes(file.size)}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>

              <a href={zipUrl(files.folder)} className={`${card} mt-3 flex items-center gap-4 p-4 transition-transform hover:-translate-y-[1px]`}>
                <ZipIcon size={44} />
                <span className="min-w-0 flex-1">
                  <span className="block text-m font-bold leading-snug">Download everything as one ZIP</span>
                  <span className="mt-0.5 block text-s text-[var(--muted)]">{formatBytes(files.size)}. Best on a laptop.</span>
                </span>
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white">
                  <DownloadIcon size={16} />
                </span>
              </a>
            </section>
          );
        })}

        {!items.length && <p className={`${card} mt-8 p-6 text-s text-[var(--ink-2)]`}>No matching product was found on this order.</p>}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-s text-[var(--muted)]">
          <span>
            Need help? Reply to your order email or write to{" "}
            <a href="mailto:impic.tech@gmail.com" className="font-bold text-[var(--accent)] hover:underline">
              impic.tech@gmail.com
            </a>
          </span>
          <Link href="/store" className="font-bold text-[var(--accent)] hover:underline">
            Browse store →
          </Link>
        </div>
      </div>
    </BrandShell>
  );
}
