import { notFound } from "next/navigation";
import { INSTITUTES, getProductsByInstitute } from "@/lib/store-products";
import InstitutePageClient from "./InstitutePageClient";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return INSTITUTES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const institute = INSTITUTES.find((i) => i.slug === slug);
  if (!institute)
    return { title: "Institute Not Found" };
  return {
    title: `${institute.name} Products — UPSCPrepNotes Store`,
    description: `${institute.description}. Browse ${institute.name} products on UPSCPrepNotes — test series, notes, and more. Instant PDF download.`,
    alternates: {
      canonical: `https://upscprepnotes.in/store/institutes/${institute.slug}`,
    },
    openGraph: {
      title: `${institute.name} Products — UPSCPrepNotes Store`,
      description: `${institute.description}. Browse products on UPSCPrepNotes.`,
      url: `https://upscprepnotes.in/store/institutes/${institute.slug}`,
      siteName: "UPSCPrepNotes",
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og/default.png"],
    },
  };
}

export default async function InstitutePage({ params }: Props) {
  const { slug } = await params;
  const institute = INSTITUTES.find((i) => i.slug === slug);
  if (!institute) notFound();

  const products = getProductsByInstitute(slug);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Store", href: "/store" },
          { name: institute.name, href: `/store/institutes/${institute.slug}` },
        ]}
      />
      <InstitutePageClient institute={institute} products={products} />
    </>
  );
}
