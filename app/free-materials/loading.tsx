export default function FreeMaterialsLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
        {/* Hero skeleton */}
        <section className="mb-16">
          <div className="mb-3 h-3 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="mb-4 h-12 w-96 animate-pulse rounded-lg bg-zinc-200" />
          <div className="h-5 w-72 animate-pulse rounded bg-zinc-200" />
        </section>

        {/* Category cards skeleton */}
        <section className="mb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-200" />
                  <div className="h-4 w-16 animate-pulse rounded-full bg-zinc-200" />
                </div>
                <div className="mb-2 h-5 w-32 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        </section>

        {/* Search bar skeleton */}
        <div className="mb-6 h-12 w-full animate-pulse rounded-xl bg-zinc-100" />

        {/* PDF grid skeleton */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 p-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-200" />
                <div className="flex-1 min-w-0">
                  <div className="mb-1 h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
                  <div className="mb-1 h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
