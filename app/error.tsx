"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-zinc-700">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
