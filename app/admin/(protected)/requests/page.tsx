import { connectDB } from "@/lib/mongodb";
import { CustomerModel } from "@/models/customer.model";
import NotificationEmails from "./notification-emails";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  await connectDB();
  const customers = await CustomerModel.find()
    .sort({ createdAt: -1 })
    .lean();

  const statusColors: Record<string, string> = {
    paid: "bg-amber-50 text-amber-700",
    verified: "bg-blue-50 text-blue-700",
    access_granted: "bg-green-50 text-green-700",
  };

  return (
    <div className="space-y-16">
      {/* PURCHASES */}
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Purchase Requests
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {customers.length} total payments received
          </p>
        </div>

        {customers.length === 0 ? (
          <div className="rounded-[32px] border border-black/[0.06] bg-white p-16 text-center">
            <p className="text-lg text-zinc-500">No purchases yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[32px] border border-black/[0.06] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold">Order ID</th>
                  <th className="p-5 font-semibold">Name</th>
                  <th className="p-5 font-semibold">Email</th>
                  <th className="p-5 font-semibold">Phone</th>
                  <th className="p-5 font-semibold">Product</th>
                  <th className="p-5 font-semibold">Amount</th>
                  <th className="p-5 font-semibold">Screenshot</th>
                  <th className="p-5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: Record<string, unknown>) => (
                  <tr
                    key={String(c._id)}
                    className="border-b border-black/[0.04] last:border-b-0 hover:bg-zinc-50"
                  >
                    <td className="whitespace-nowrap p-5 text-zinc-600">
                      {new Date(String(c.createdAt)).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap p-5 font-mono text-xs text-zinc-500">
                      {String(c.orderId || "")}
                    </td>
                    <td className="p-5 font-medium">{String(c.name)}</td>
                    <td className="p-5 text-zinc-600">{String(c.email)}</td>
                    <td className="p-5 text-zinc-600">{String(c.phone)}</td>
                    <td className="p-5">
                      <span className="rounded-full border border-black/10 bg-zinc-100 px-3 py-1 text-xs font-medium">
                        {String(c.product)}
                      </span>
                    </td>
                    <td className="p-5 font-medium">₹{String(c.amount)}</td>
                    <td className="p-5">
                      {String(c.screenshotUrl) ? (
                        <a
                          href={String(c.screenshotUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline underline-offset-2"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusColors[String(c.status)] ||
                          "bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        {String(c.status).replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NOTIFICATION EMAILS */}
      <NotificationEmails />
    </div>
  );
}
