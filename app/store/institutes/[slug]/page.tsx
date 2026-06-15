import { notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconShoppingCart } from "@tabler/icons-react";
import { INSTITUTES, getProductsByInstitute } from "@/lib/store-products";
import InstitutePageClient from "./InstitutePageClient";

export async function generateStaticParams() {
  return INSTITUTES.map((i) => ({ slug: i.slug }));
}

export default function InstitutePage({ params }: { params: { slug: string } }) {
  const institute = INSTITUTES.find((i) => i.slug === params.slug);
  if (!institute) notFound();

  const products = getProductsByInstitute(params.slug);

  return (
    <InstitutePageClient institute={institute} products={products} />
  );
}
