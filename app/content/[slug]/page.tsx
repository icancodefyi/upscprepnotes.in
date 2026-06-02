import { notFound } from "next/navigation";
import ContentLayout from "@/components/ContentLayout";

type Props = { params: Promise<{ slug: string }> };

// Register content pages here
const pages = {
  "upsc-full-form": () => import("@/data/content/upsc-full-form"),
} as const;

export async function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const mod = pages[slug as keyof typeof pages];
  if (!mod) return { title: "Page Not Found" };
  const { default: page } = await mod();
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://upscprepnotes.in/${slug}` },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const mod = pages[slug as keyof typeof pages];
  if (!mod) notFound();
  const { default: page } = await mod();
  return <ContentLayout page={page} />;
}
