import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  getRelatedToppers,
  getTopperBySlug,
} from "@/services/topper.service";

export const revalidate = 86400;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const topper = await getTopperBySlug(slug);

  if (!topper) {
    return {
      title: "Topper Not Found",
    };
  }

  return {
    title: `${topper.firstName} ${topper.lastName} UPSC AIR ${topper.rank} (${topper.year}) – ${topper.optionalSubject} Strategy & Marksheet`,

    description: topper.bio?.slice(0, 160),
  };
}

export default async function TopperPage({ params }: Props) {
  const { slug } = await params;

  const topper = await getTopperBySlug(slug);

  if (!topper) {
    notFound();
  }

  const relatedToppers = await getRelatedToppers(
    topper.optionalSubject,
    topper.slug
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* HERO */}
      <section className="mb-14 flex flex-col gap-8 rounded-3xl border p-8 md:flex-row">
        <img
  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
  alt={`${topper.firstName} ${topper.lastName}`}
  className="h-52 w-52 rounded-3xl object-cover"
/>

        <div className="flex-1">
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full border px-4 py-1 text-sm font-medium">
              AIR {topper.rank}
            </span>

            <span className="rounded-full border px-4 py-1 text-sm font-medium">
              UPSC {topper.year}
            </span>

            <span className="rounded-full border px-4 py-1 text-sm font-medium">
              {topper.optionalSubject} Optional
            </span>
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            {topper.firstName} {topper.lastName}
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-600">
            {topper.bio}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border p-4">
              <p className="text-sm text-zinc-500">Total Marks</p>

              <p className="mt-2 text-2xl font-bold">
                {topper.marks.total}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm text-zinc-500">Written Marks</p>

              <p className="mt-2 text-2xl font-bold">
                {topper.marks.written}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm text-zinc-500">Interview</p>

              <p className="mt-2 text-2xl font-bold">
                {topper.marks.interview}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm text-zinc-500">Essay</p>

              <p className="mt-2 text-2xl font-bold">
                {topper.marks.essay}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKS */}
      <section className="mb-14">
        <h2 className="mb-6 text-3xl font-bold">
          Marks Breakdown
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* GS */}
          <div className="rounded-3xl border p-6">
            <h3 className="mb-4 text-xl font-semibold">
              General Studies
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>GS1</span>
                <span>{topper.marks.gs1}</span>
              </div>

              <div className="flex justify-between">
                <span>GS2</span>
                <span>{topper.marks.gs2}</span>
              </div>

              <div className="flex justify-between">
                <span>GS3</span>
                <span>{topper.marks.gs3}</span>
              </div>

              <div className="flex justify-between">
                <span>GS4</span>
                <span>{topper.marks.gs4}</span>
              </div>
            </div>
          </div>

          {/* OPTIONAL */}
          <div className="rounded-3xl border p-6">
            <h3 className="mb-4 text-xl font-semibold">
              Optional Subject
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subject</span>
                <span>{topper.optionalSubject}</span>
              </div>

              <div className="flex justify-between">
                <span>Paper 1</span>
                <span>{topper.marks.optional1}</span>
              </div>

              <div className="flex justify-between">
                <span>Paper 2</span>
                <span>{topper.marks.optional2}</span>
              </div>
            </div>
          </div>

          {/* FINAL */}
          <div className="rounded-3xl border p-6">
            <h3 className="mb-4 text-xl font-semibold">
              Final Scores
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Essay</span>
                <span>{topper.marks.essay}</span>
              </div>

              <div className="flex justify-between">
                <span>Written</span>
                <span>{topper.marks.written}</span>
              </div>

              <div className="flex justify-between">
                <span>Interview</span>
                <span>{topper.marks.interview}</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{topper.marks.total}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      {topper.insights?.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 text-3xl font-bold">
            Key Insights
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {topper.insights.map(
              (insight: string, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl border p-5"
                >
                  <p className="leading-7 text-zinc-700">
                    {insight}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* STRATEGY */}
      <section className="mb-14">
        <h2 className="mb-6 text-3xl font-bold">
          Preparation Strategy
        </h2>

        <article className="prose prose-zinc max-w-none">
          <ReactMarkdown>
            {topper.strategy}
          </ReactMarkdown>
        </article>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="mb-6 text-3xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="rounded-2xl border p-5">
            <h3 className="mb-2 font-semibold">
              What was {topper.firstName} {topper.lastName}'s UPSC rank?
            </h3>

            <p className="text-zinc-700">
              {topper.firstName} {topper.lastName} secured AIR{" "}
              {topper.rank} in UPSC CSE {topper.year}.
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <h3 className="mb-2 font-semibold">
              What was the optional subject?
            </h3>

            <p className="text-zinc-700">
              {topper.firstName} chose{" "}
              {topper.optionalSubject} as the optional subject.
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <h3 className="mb-2 font-semibold">
              What were the interview marks?
            </h3>

            <p className="text-zinc-700">
              {topper.firstName} scored{" "}
              {topper.marks.interview} marks in the UPSC personality test.
            </p>
          </div>
        </div>
      </section>

      {/* RELATED TOPPERS */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">
          Related {topper.optionalSubject} Toppers
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {relatedToppers.map((related: any) => (
            <a
              key={related.slug}
              href={`/upsc-topper/${related.slug}`}
              className="rounded-3xl border p-5 transition hover:border-black"
            >
              <img
  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${related.firstName}-${related.lastName}`}
  alt={`${related.firstName} ${related.lastName}`}
  className="h-52 w-52 rounded-3xl object-cover"
/>
              <h3 className="text-xl font-semibold">
                {related.firstName} {related.lastName}
              </h3>

              <p className="mt-2 text-zinc-600">
                AIR {related.rank} • {related.year}
              </p>

              <p className="mt-1 text-zinc-600">
                {related.optionalSubject}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}