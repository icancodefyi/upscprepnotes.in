import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { LogoutButton } from "./logout-button";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }
}

const navLinks = [
  { href: "/admin", label: "Toppers" },
  { href: "/admin/new", label: "Add Topper" },
  { href: "/admin/pyq", label: "PYQ" },
  { href: "/admin/requests", label: "Requests" },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <div className="min-h-screen">
      <header className="relative border-b border-black/[0.06] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-tight"
            >
              Admin
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 transition hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-zinc-400 transition hover:text-zinc-600"
            >
              View site →
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-7xl px-6 pb-28 pt-8">
        {children}
      </main>
    </div>
  );
}
