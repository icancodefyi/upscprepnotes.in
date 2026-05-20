import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-40 border-t border-border pt-16 pb-10">
      <div className="grid gap-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        {/* BRAND */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-foreground" />

            <p className="text-sm uppercase tracking-[0.35em] text-foreground/70 font-medium">
              UPSCPREPNOTES
            </p>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Structured educational intelligence platform
            for UPSC preparation research, topper analysis,
            marksheet indexing, optional subject trends,
            and preparation strategy exploration.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>280+ Profiles</span>
            <span>&bull;</span>
            <span>18 Subjects</span>
            <span>&bull;</span>
            <span>Updated Regularly</span>
          </div>
        </div>

        {/* PLATFORM */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Platform
          </p>

          <div className="flex flex-col gap-4 text-sm text-foreground">
            <Link href="/" className="transition hover:text-foreground/70">
              Toppers
            </Link>

            <Link href="/year/2025" className="transition hover:text-foreground/70">
              2025 CSE
            </Link>

            <Link href="/year/2024" className="transition hover:text-foreground/70">
              2024 CSE
            </Link>

            <Link href="/optional/psir" className="transition hover:text-foreground/70">
              Optional Subjects
            </Link>
            <Link href="/ask" className="transition hover:text-foreground/70">
              Ask AI
            </Link>
          </div>
        </div>

        {/* LEGAL */}
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Legal
          </p>

          <div className="flex flex-col gap-4 text-sm text-foreground">
            <Link
              href="/about"
              className="transition hover:text-foreground/70"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-foreground/70"
            >
              Contact
            </Link>

            <Link
              href="/privacy-policy"
              className="transition hover:text-foreground/70"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-foreground/70"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/disclaimer"
              className="transition hover:text-foreground/70"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          &copy; 2026 UPSCPREPNOTES. Structured UPSC intelligence archive.
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
