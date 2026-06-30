import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { AdminSidebar } from "./admin-sidebar";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-28 pt-8 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
