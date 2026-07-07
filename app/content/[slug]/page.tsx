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
  const contentPath = `/content/${slug}`;
  const enContentPath = `/content/${enSlug}`;
  const hiContentPath = hiSlug ? `/content/${hiSlug}` : null;
  const languages: Record<string, string> = {
    "x-default": `https://upscprepnotes.in${enContentPath}`,
    en: `https://upscprepnotes.in${enContentPath}`,
  };
  if (hiContentPath) {
    languages.hi = `https://upscprepnotes.in${hiContentPath}`;
  }
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://upscprepnotes.in${contentPath}`,
      languages,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://upscprepnotes.in${contentPath}`,
      siteName: "UPSCPrepNotes",
      locale: page.lang === "hi" ? "hi_IN" : "en_IN",
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og/default.png"],
    },
    other: {
      "content-language": page.lang === "hi" ? "hi" : "en",
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const mod = getPage(slug);
  if (!mod) notFound();
  const { default: page } = await mod();

  const contentPath = `/content/${slug}`;

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
      "@id": `https://upscprepnotes.in${contentPath}`,
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: page.h1 || page.title, href: contentPath },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {page.lang === "hi" && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang="hi"`,
          }}
        />
      )}
      <ContentLayout page={page} />
    </>
  );
}
