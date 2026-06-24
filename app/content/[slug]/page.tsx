import { notFound } from "next/navigation";
import ContentLayout from "@/components/ContentLayout";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { getPage, getAllSlugs, getEnglishSlug, getHindiSlug } from "@/data/content/registry";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const mod = getPage(slug);
  if (!mod) return { title: "Page Not Found" };
  const { default: page } = await mod();
  const enSlug = getEnglishSlug(slug);
  const hiSlug = getHindiSlug(enSlug);
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
  const mod = getPage(slug);
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
