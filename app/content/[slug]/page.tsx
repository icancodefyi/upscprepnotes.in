import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import BrandShell from "@/components/brand/BrandShell";
import { getPage, getAllSlugs, getEnglishSlug, getHindiSlug } from "@/data/content/registry";
import type { ContentPage } from "@/data/content";
import { fillOptionalTokens, fillTokens, getOptionalStats, getPaperStats, getSiteFacts, type OptionalStats, type PaperStats } from "@/lib/paper-stats";
import Guide from "./_components/Guide";

export const revalidate = 3600;

/** Load a guide and, for strategy guides, fill its {{tokens}} with live marks data. */
async function load(slug: string): Promise<{ page: ContentPage; stats: PaperStats | null; optionals: OptionalStats | null } | null> {
  const mod = getPage(slug);
  if (!mod) return null;
  const { default: raw } = await mod();
  const [stats, site, optionals] = await Promise.all([
    raw.paper ? getPaperStats(raw.paper) : null,
    getSiteFacts(),
    raw.dataset === "optionals" ? getOptionalStats() : null,
  ]);
  const f = (t: string) => fillOptionalTokens(fillTokens(t, stats, site), optionals);
  const page: ContentPage = {
    ...raw,
    title: f(raw.title),
    description: f(raw.description),
    h1: f(raw.h1),
    intro: f(raw.intro),
    sections: raw.sections.map((s) => ({ heading: f(s.heading), body: f(s.body) })),
    faq: raw.faq?.map((x) => ({ q: f(x.q), a: f(x.a) })),
    relatedPages: raw.relatedPages?.map((r) => ({ ...r, description: f(r.description) })),
  };
  return { page, stats, optionals };
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
  const d = await load(slug);
  if (!d) notFound();
  const { page, stats, optionals } = d;

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
      <Guide page={page} stats={stats} optionals={optionals} />
    </BrandShell>
  );
}
