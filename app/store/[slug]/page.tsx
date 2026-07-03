import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, getProductBySlug } from "@/lib/store-products";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  const imageUrl = product.image || "/logo.png";
  return {
      title: product.title,
    description: product.description.slice(0, 160),
    alternates: {
      canonical: `https://upscprepnotes.in/store/${product.slug}`,
    },
    openGraph: {
    title: product.title,
      description: product.description.slice(0, 160),
      url: `https://upscprepnotes.in/store/${product.slug}`,
      siteName: "UPSCPrepNotes",
      images: [{ url: imageUrl, width: 464, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url: `https://upscprepnotes.in/store/${product.slug}`,
    image: product.image || "/logo.png",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.comingSoon
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      url: `https://upscprepnotes.in/store/${product.slug}`,
    },
  };

  if (product.rating && product.reviewCount) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
    };
    productSchema.review = [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: product.rating,
          bestRating: 5,
        },
        author: {
          "@type": "Organization",
          name: "UPSCPrepNotes",
        },
      },
    ];
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Store", href: "/store" },
          { name: product.title, href: `/store/${product.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
