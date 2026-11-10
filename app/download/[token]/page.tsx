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
import FileLibrary from "@/components/store/FileLibrary";
import { TopperModel } from "@/models/topper.model";
import { topperImageSrc } from "@/lib/utils";
import { parseTopperTitle } from "@/lib/topper-title";

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

/** Pictures for the toppers named in the file list, matched by exam year and rank. Same images the toppers pages use. */
async function loadAvatars(titles: string[]): Promise<Map<string, string>> {
  const wanted = titles.map(parseTopperTitle).filter((t) => t.yearNumber && t.rankNumber);
  const map = new Map<string, string>();
  if (!wanted.length) return map;
  try {
    const rows = (await TopperModel.find(
      { year: { $in: [...new Set(wanted.map((t) => t.yearNumber))] }, rank: { $in: [...new Set(wanted.map((t) => t.rankNumber))] } },
      { firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, ProfileImage: 1 },
    ).lean()) as unknown as { firstName?: string; lastName?: string; rank?: number; year?: number; slug?: string; ProfileImage?: string }[];
    for (const r of rows) {
      map.set(`${r.year}-${r.rank}`, topperImageSrc({ slug: r.slug, ProfileImage: r.ProfileImage, firstName: r.firstName ?? "", lastName: r.lastName ?? "" }));
    }
  } catch {
    // Pictures are a nicety. The list still works without them.
  }
  return map;
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

  const allTitles = items.flatMap((item: { slug: string }) => {
    const f = getProductFiles(item.slug);
    return f ? groupFiles(f.files).map((g) => g.title) : [];
  });
  const avatars = await loadAvatars(allTitles);

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

              <div className="mt-4">
                <FileLibrary
                  storageKey={`${token}:${item.slug}`}
                  zipUrl={zipUrl(files.folder)}
                  groups={groups.map((group) => {
                    const t = parseTopperTitle(group.title);
                    return {
                    title: group.title,
                    avatar: t.yearNumber && t.rankNumber ? avatars.get(`${t.yearNumber}-${t.rankNumber}`) : undefined,
                    files: group.files.map((file) => ({
                      name: file.name,
                      path: file.path,
                      size: formatBytes(file.size),
                      url: fileUrl(files.folder, file.path),
                    })),
                    };
                  })}
                />
              </div>
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
