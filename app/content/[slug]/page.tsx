import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import BrandShell from "@/components/brand/BrandShell";
import { getPage, getAllSlugs, getEnglishSlug, getHindiSlug } from "@/data/content/registry";
import type { ContentPage } from "@/data/content";
import Guide from "./_components/Guide";
import PopularLinks from "@/components/brand/PopularLinks";
import QuizTeaser from "@/components/quiz/QuizTeaser";

/** Load a guide's original content, unchanged. */
async function load(slug: string): Promise<{ page: ContentPage } | null> {
  const mod = getPage(slug);
  if (!mod) return null;
  const { default: page } = await mod();
  return { page };
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const d = await load(slug);
  if (!d) return { title: "Page Not Found" };
  const { page } = d;
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
    ...(page.noindex ? { robots: { index: false, follow: true } } : {}),
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
    },
    twitter: {
      card: "summary_large_image",
    },
    other: {
      "content-language": page.lang === "hi" ? "hi" : "en",
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const d = await load(slug);
  if (!d) notFound();
  const { page } = d;

  const contentPath = `/content/${slug}`;
  const enSlug = getEnglishSlug(slug);
  const hiSlug = getHindiSlug(enSlug);
  const alt = page.lang === "hi" ? { href: `/content/${enSlug}`, label: "Read in English" } : hiSlug ? { href: `/content/${hiSlug}`, label: "हिंदी में पढ़ें" } : null;

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
    <BrandShell>
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
      {page.faq && page.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }),
          }}
        />
      )}
      <Guide page={page} stats={null} alt={alt} />
      <div className="mx-auto max-w-[1180px] px-6 pb-16">
        <PopularLinks track="guide-popular" />
        <QuizTeaser track="guide" />
      </div>
    </BrandShell>
  );
}
