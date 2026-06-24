import { notFound } from "next/navigation";
import ContentLayout from "@/components/ContentLayout";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

type Props = { params: Promise<{ slug: string }> };

// Register content pages here
const pages = {
  "upsc-full-form": () => import("@/data/content/upsc-full-form"),
  "upsc-syllabus": () => import("@/data/content/upsc-syllabus"),
  "upsc-free-material": () => import("@/data/content/upsc-free-material"),
  "upsc-full-form-hindi": () => import("@/data/content/upsc-full-form-hindi"),
  "how-to-write-upsc-mains-answers": () => import("@/data/content/how-to-write-upsc-mains-answers"),
  "upsc-topper-answer-copies": () => import("@/data/content/upsc-topper-answer-copies"),
  "upsc-syllabus-hindi": () => import("@/data/content/upsc-syllabus-hindi"),
  "upsc-free-material-hindi": () => import("@/data/content/upsc-free-material-hindi"),
  "how-to-write-upsc-mains-answers-hindi": () => import("@/data/content/how-to-write-upsc-mains-answers-hindi"),
} as const;

export async function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

const EN_TO_HI: Record<string, string> = {
  "upsc-full-form": "upsc-full-form-hindi",
  "upsc-syllabus": "upsc-syllabus-hindi",
  "upsc-free-material": "upsc-free-material-hindi",
  "how-to-write-upsc-mains-answers": "how-to-write-upsc-mains-answers-hindi",
};

const HI_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_HI).map(([en, hi]) => [hi, en])
);

const HI_SLUGS = new Set(Object.values(EN_TO_HI));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const mod = pages[slug as keyof typeof pages];
  if (!mod) return { title: "Page Not Found" };
  const { default: page } = await mod();
  const enSlug = HI_TO_EN[slug] || slug;
  const hiSlug = EN_TO_HI[enSlug];
  const languages: Record<string, string> = {
    "x-default": `https://upscprepnotes.in/${enSlug}`,
    en: `https://upscprepnotes.in/${enSlug}`,
  };
  if (hiSlug) {
    languages.hi = `https://upscprepnotes.in/${hiSlug}`;
  }
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://upscprepnotes.in/${slug}`,
      languages,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://upscprepnotes.in/${slug}`,
      siteName: "UPSCPrepNotes",
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og/default.png"],
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const mod = pages[slug as keyof typeof pages];
  if (!mod) notFound();
  const { default: page } = await mod();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1 || page.title,
    description: page.description,
    datePublished: page.lastUpdated,
    dateModified: page.lastUpdated,
    author: {
      "@type": "Organization",
      name: "UPSCPrepNotes",
      url: "https://upscprepnotes.in",
    },
    publisher: {
      "@type": "Organization",
      name: "UPSCPrepNotes",
      logo: {
        "@type": "ImageObject",
        url: "https://upscprepnotes.in/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://upscprepnotes.in/${slug}`,
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: page.h1 || page.title, href: `/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <ContentLayout page={page} />
    </>
  );
}
