import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-zinc-700">We couldn't find the page you're looking for.</p>

        <div className="mt-8">
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
