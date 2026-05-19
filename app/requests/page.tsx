import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { PurchaseModel } from "@/models/purchase.model";
import { verifyAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }

  await connectDB();
  const purchases = await PurchaseModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-black">
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Purchase Requests
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {purchases.length} total submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              ← Admin
            </Link>
            <Link
              href="/"
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="rounded-[32px] border border-black/[0.06] bg-white p-16 text-center">
            <p className="text-lg text-zinc-500">No purchase requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[32px] border border-black/[0.06] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold">Name</th>
                  <th className="p-5 font-semibold">Email</th>
                  <th className="p-5 font-semibold">Phone</th>
                  <th className="p-5 font-semibold">Package</th>
                  <th className="p-5 font-semibold">Amount</th>
                  <th className="p-5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p: any) => (
                  <tr key={p._id.toString()} className="border-b border-black/[0.04] last:border-b-0 hover:bg-[#f8f7f4]">
                    <td className="p-5 text-zinc-600 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-5 font-medium">{p.name}</td>
                    <td className="p-5 text-zinc-600">{p.email}</td>
                    <td className="p-5 text-zinc-600">{p.phone}</td>
                    <td className="p-5">
                      <span className="rounded-full border border-black/10 bg-[#f8f7f4] px-3 py-1 text-xs font-medium">
                        {p.package}
                      </span>
                    </td>
                    <td className="p-5 font-medium">₹{p.amount}</td>
                    <td className="p-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          p.status === "lead"
                            ? "bg-amber-50 text-amber-700"
                            : p.status === "contacted"
                              ? "bg-blue-50 text-blue-700"
                              : p.status === "converted"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-400">
          This page displays all purchase requests. Data is fetched directly from the database.
        </p>
      </div>
    </main>
  );
}
