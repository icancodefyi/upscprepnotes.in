import { connectDB } from "@/lib/mongodb";
import { PurchaseModel } from "@/models/purchase.model";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  await connectDB();
  const purchases = await PurchaseModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Purchase Requests
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {purchases.length} total submissions
        </p>
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
              {purchases.map((p: Record<string, unknown>) => (
                <tr key={String(p._id)} className="border-b border-black/[0.04] last:border-b-0 hover:bg-zinc-50">
                  <td className="whitespace-nowrap p-5 text-zinc-600">
                    {new Date(String(p.createdAt)).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-5 font-medium">{String(p.name)}</td>
                  <td className="p-5 text-zinc-600">{String(p.email)}</td>
                  <td className="p-5 text-zinc-600">{String(p.phone)}</td>
                  <td className="p-5">
                    <span className="rounded-full border border-black/10 bg-zinc-100 px-3 py-1 text-xs font-medium">
                      {String(p.package)}
                    </span>
                  </td>
                  <td className="p-5 font-medium">₹{String(p.amount)}</td>
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
                      {String(p.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
