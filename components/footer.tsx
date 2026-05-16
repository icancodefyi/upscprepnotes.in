import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-40 border-t border-black/10 pt-16 pb-10">
      <div className="grid gap-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        {/* BRAND */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-black" />

            <p className="text-sm uppercase tracking-[0.35em] text-zinc-700">
              UPSCPREPNOTES
            </p>
          </div>

          <p className="max-w-md text-sm leading-7 text-zinc-600">
            Structured educational intelligence platform
            for UPSC preparation research, topper analysis,
            marksheet indexing, optional subject trends,
            and preparation strategy exploration.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            <span>280+ Profiles</span>
            <span>•</span>
            <span>18 Subjects</span>
            <span>•</span>
            <span>Updated Regularly</span>
          </div>
        </div>

        {/* PLATFORM */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-zinc-400">
            Platform
          </p>

          <div className="flex flex-col gap-4 text-sm text-zinc-700">
            <Link href="/" className="transition hover:text-black">
              Toppers
            </Link>

            <Link href="/year/2025" className="transition hover:text-black">
              2025 CSE
            </Link>

            <Link href="/year/2024" className="transition hover:text-black">
              2024 CSE
            </Link>

            <Link href="/optional/psir" className="transition hover:text-black">
              Optional Subjects
            </Link>
          </div>
        </div>

        {/* RESEARCH */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-zinc-400">
            Research
          </p>

          <div className="flex flex-col gap-4 text-sm text-zinc-700">
            <Link href="/" className="transition hover:text-black">
              AIR Trends
            </Link>

            <Link href="/" className="transition hover:text-black">
              Essay Analysis
            </Link>

            <Link href="/" className="transition hover:text-black">
              Interview Scores
            </Link>

            <Link href="/" className="transition hover:text-black">
              Subject Insights
            </Link>
          </div>
        </div>

        {/* LEGAL */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-zinc-400">
            Legal
          </p>

          <div className="flex flex-col gap-4 text-sm text-zinc-700">
            <Link
              href="/about"
              className="transition hover:text-black"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-black"
            >
              Contact
            </Link>

            <Link
              href="/privacy-policy"
              className="transition hover:text-black"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-black"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/disclaimer"
              className="transition hover:text-black"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-16 flex flex-col gap-4 border-t border-black/10 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>
          © 2026 UPSCPREPNOTES. Structured UPSC intelligence archive.
        </p>

        <div className="flex items-center gap-5 uppercase tracking-[0.18em]">
          <span>Educational Use</span>
          <span>Research Platform</span>
          <span>India</span>
        </div>
      </div>
    </footer>
  );
}