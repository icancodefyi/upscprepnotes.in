import { notFound } from "next/navigation";
import ContentLayout from "@/components/ContentLayout";

type Props = { params: Promise<{ slug: string }> };

// Register content pages here
const pages = {
  "upsc-full-form": () => import("@/data/content/upsc-full-form"),
  "upsc-syllabus": () => import("@/data/content/upsc-syllabus"),
  "upsc-free-material": () => import("@/data/content/upsc-free-material"),
  "upsc-full-form-hindi": () => import("@/data/content/upsc-full-form-hindi"),
  "how-to-write-upsc-mains-answers": () => import("@/data/content/how-to-write-upsc-mains-answers"),
  "upsc-topper-answer-copies": () => import("@/data/content/upsc-topper-answer-copies"),
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
