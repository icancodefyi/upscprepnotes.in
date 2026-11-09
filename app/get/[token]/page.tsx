import type { Metadata } from "next";
import Link from "next/link";
import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";
import Gilu from "@/components/brand/Gilu";
import GetClient, { type Promo } from "@/components/get/GetClient";
import { connectDB } from "@/lib/mongodb";
import { QUIZ_LIVE } from "@/lib/quiz/config";
import { PRODUCTS } from "@/lib/store-products";
import { DownloadHandoffModel, type DownloadHandoff } from "@/models/download-handoff.model";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Getting your files ready | UPSCPrepNotes",
  robots: { index: false, follow: false },
};

const TELEGRAM = "https://t.me/+2eV0YCTGdNcyNmFl";

/** Offers shown while people wait. Prices and availability come from the store, so they never go stale. */
function promos(kind: DownloadHandoff["kind"]): Promo[] {
  const list: Promo[] = [];
  const comp = PRODUCTS.find((p) => p.slug === "answer-copies-compilation" && !p.comingSoon);
  const mains = PRODUCTS.find((p) => p.slug === "upsc-mains-2027-pack" && !p.comingSoon);
  if (QUIZ_LIVE) {
    list.push({ id: "quiz", title: "Test yourself while you wait", body: "5 real UPSC Prelims questions, marked the exam way. Free, no sign-up.", cta: "Play today's 5", href: "/quiz", pose: "correct" });
  }
  if (comp && kind !== "answer-copy") {
    list.push({ id: "compilation", title: "See how toppers actually write", body: "63 handwritten topper answer copies, GS1–4 and Essay, each with rank and marks.", cta: `See the compilation, ₹${comp.price}`, href: "/store/answer-copies-compilation", pose: "reading" });
  }
  if (comp && kind === "answer-copy") {
    list.push({ id: "compilation", title: "Compare with 63 more toppers", body: "Every answer copy in one place: GS1–4 and Essay, with marks on each.", cta: `See the compilation, ₹${comp.price}`, href: "/store/answer-copies-compilation", pose: "reading" });
  }
  if (mains) {
    list.push({ id: "mains", title: "Writing Mains 2027?", body: "The Mains playbook (471 real questions) plus the topper marks spreadsheet.", cta: `See the Mains pack, ₹${mains.price}`, href: "/store/upsc-mains-2027-pack", pose: "hello" });
  }
  list.push({ id: "telegram", title: "Daily current affairs, free", body: "Join 100+ aspirants on our Telegram channel.", cta: "Join on Telegram", href: TELEGRAM, external: true, pose: "celebrating" });
  return list;
}

export default async function GetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let h: DownloadHandoff | null = null;
  if (/^[A-Za-z0-9_-]{8,40}$/.test(token)) {
    await connectDB();
    h = (await DownloadHandoffModel.findOne({ token }).lean()) as DownloadHandoff | null;
  }

  if (!h) {
    return (
      <div className={`up ${brandFonts} min-h-dvh`} style={{ background: "#f4f5f9" }}>
        <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-4 text-center">
          <Gilu pose="sorry" size={160} className="h-auto w-[120px]" />
          <h1 className="mt-4 text-[28px] font-bold tracking-[-0.02em]">This page has expired</h1>
          <p className="mt-2 text-[16px] leading-relaxed" style={{ color: "#3f4450" }}>
            Download pages last a few days. Your free material is still on the site, and if you gave us your email, the link is in your inbox.
          </p>
          <Link href="/free-materials" className="btn btn-blue mt-6 inline-flex">Browse free material</Link>
        </main>
      </div>
    );
  }

  return (
    <div className={`up ${brandFonts} min-h-dvh`} style={{ background: "#f4f5f9" }}>
      <GetClient
        kind={h.kind}
        title={h.title}
        files={h.files.map((f) => ({ name: f.name, url: f.url }))}
        pending={h.pending}
        emailMasked={h.emailMasked}
        returnTo={h.returnTo}
        promos={promos(h.kind)}
      />
    </div>
  );
}
