import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { AdminSidebar } from "./admin-sidebar";
import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";
import { warmAdminCaches } from "@/lib/admin/warm";

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
  warmAdminCaches();

  return (
    <div className={`up admin-brand ${brandFonts} bg-white`}>
      <AdminSidebar />
      <div className="lg:pl-[272px]">
        <main className="relative mx-auto max-w-[1180px] px-4 pb-28 pt-16 sm:px-6 lg:px-10 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
