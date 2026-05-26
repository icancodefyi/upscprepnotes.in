import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto max-w-7xl px-6 pt-6 md:px-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-foreground" />
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/70 md:text-sm font-medium">
            UPSCPREPNOTES
          </p>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex">
          <Link href="/" className="transition hover:text-foreground">
            Toppers
          </Link>
          <Link href="/optional/psir" className="transition hover:text-foreground">
            Optional Subjects
          </Link>
          <Link href="/ask" className="transition hover:text-foreground">
            Ask AI
          </Link>
        </nav>
      </div>
    </header>
  );
}
