import React from "react";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** About, contact and legal pages: a plain document in the brand shell. Body markup is styled by `.legal` in brand.css. */
export default async function LegalPage({ title, description, children }: Props) {
  return (
    <BrandShell>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">{title}</span>
        </nav>
        <header className="mt-8 border-b border-[var(--line)] pb-10">
          <h1 className="t-display text-h1">{title}</h1>
          <p className="mt-2 text-s font-bold text-[var(--muted)]">UPSCPREPNOTES</p>
          {description && <p className="mt-5 max-w-2xl text-m leading-[1.6] text-[var(--ink-2)]">{description}</p>}
        </header>
        <article className="legal mt-12 space-y-12">{children}</article>
      </div>
    </BrandShell>
  );
}
