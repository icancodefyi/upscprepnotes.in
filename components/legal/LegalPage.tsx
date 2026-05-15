import React from "react";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function LegalPage({
  title,
  description,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16 border-b border-black/10 pb-10">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
            UPSCPREPNOTES
          </p>

          <h1 className="text-5xl font-semibold tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              {description}
            </p>
          )}
        </div>

        <article className="space-y-12">
          {children}
        </article>
      </div>
    </main>
  );
}
