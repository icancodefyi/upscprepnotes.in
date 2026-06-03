export default function PDFDetailLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
        {/* Breadcrumb skeleton */}
        <div className="mb-10 flex items-center gap-2">
          <div className="h-3 w-12 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-3 rounded bg-zinc-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-3 rounded bg-zinc-200" />
          <div className="h-3 w-40 animate-pulse rounded bg-zinc-200" />
        </div>

        {/* Header skeleton */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
          </div>
          <div className="mb-3 h-10 w-3/4 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mb-2 h-5 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200" />
        </section>

        {/* Content skeleton */}
        <section className="mb-12">
          <div className="mb-3 h-4 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-200" />
          </div>
        </section>

        {/* How to use skeleton */}
        <div className="mb-12 rounded-2xl bg-zinc-50 border border-zinc-200 p-6 sm:p-8">
          <div className="mb-3 h-4 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>

        {/* Search bar skeleton */}
        <div className="mb-6 h-12 w-full animate-pulse rounded-xl bg-zinc-100" />

        {/* Resources skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 p-4">
              <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
