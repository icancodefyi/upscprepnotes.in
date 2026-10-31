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
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-foreground">This link is not active</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The download link is either wrong or the payment has not been confirmed yet.
          Reply to your order email and we will sort it out.
        </p>
        <Link
          href="/store"
          className="mt-8 inline-flex text-sm font-medium text-brand hover:underline"
        >
          ← Back to store
        </Link>
      </main>
    );
  }

  const items = (order.items || []).filter(
    (item: { slug: string }) => !single || item.slug === single
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
          Order confirmed
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
          Your files are ready
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {order.email} · Order {String(order._id).slice(-8).toUpperCase()}
        </p>
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          Download each PDF separately — it works better than the big ZIP on a phone.
          Use Wi-Fi, and keep this link: it does not expire.
        </p>
      </div>

      {items.map((item: { slug: string; title: string }) => {
        const files = getProductFiles(item.slug);
        const product = PRODUCTS.find((p) => p.slug === item.slug);
        const title = product?.title || item.title;

        if (!files) {
          return (
            <section key={item.slug} className="mt-8 rounded-2xl border border-border bg-white p-6">
              <h2 className="text-base font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your files for this product are still being prepared. We have been notified
                and will email you the moment they are ready — usually within a few hours.
              </p>
            </section>
          );
        }

        const groups = groupFiles(files.files).map((group) => ({
          ...group,
          title: group.title === files.folder ? "All files" : group.title,
        }));

        return (
          <section key={item.slug} className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-foreground">{title}</h2>
              <p className="text-xs text-muted-foreground">
                {files.count} files · {formatBytes(files.size)}
              </p>
            </div>

            <div className="mt-3 space-y-3">
              {groups.map((group, index) => (
                <details
                  key={group.title}
                  open={index === 0 && groups.length <= 6}
                  className="group rounded-2xl border border-border bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground marker:content-none">
                    <span>{group.title}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {group.files.length} {group.files.length === 1 ? "file" : "files"}
                    </span>
                  </summary>
                  <ul className="divide-y divide-border border-t border-border">
                    {group.files.map((file) => (
                      <li key={file.path}>
                        <a
                          href={fileUrl(files.folder, file.path)}
                          className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-foreground transition hover:bg-muted/50"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="shrink-0 text-brand"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M4 19h16" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 15V5a2 2 0 012-2h8l4 4v8" />
                            </svg>
                            <span className="truncate">{file.name}</span>
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Prefer one file?{" "}
              <a href={zipUrl(files.folder)} className="font-medium text-brand hover:underline">
                Download all {formatBytes(files.size)} as a ZIP
              </a>{" "}
              — best on a laptop.
            </p>
          </section>
        );
      })}

      {!items.length && (
        <p className="mt-8 rounded-2xl border border-border bg-white p-6 text-sm text-muted-foreground">
          No matching product was found on this order.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
        <span>
          Need help? Reply to your order email or write to{" "}
          <a href="mailto:impic.tech@gmail.com" className="text-brand hover:underline">
            impic.tech@gmail.com
          </a>
        </span>
        <Link href="/store" className="font-medium text-brand hover:underline">
          Browse store →
        </Link>
      </div>
    </main>
  );
}
