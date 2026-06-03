export default function TopperDetailLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        {/* Breadcrumb skeleton */}
        <div className="mb-10 flex items-center gap-2">
          <div className="h-3 w-12 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-3 rounded bg-zinc-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-3 rounded bg-zinc-200" />
          <div className="h-3 w-36 animate-pulse rounded bg-zinc-200" />
        </div>

        {/* Profile header skeleton */}
        <div className="flex items-start gap-6 mb-12">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="flex-1">
            <div className="mb-2 h-8 w-56 animate-pulse rounded-lg bg-zinc-200" />
            <div className="mb-2 h-4 w-40 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mb-3 h-5 w-40 animate-pulse rounded bg-zinc-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 p-5">
                <div className="mb-2 h-4 w-28 animate-pulse rounded bg-zinc-200" />
                <div className="h-8 w-20 animate-pulse rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
