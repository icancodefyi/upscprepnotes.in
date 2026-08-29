"use client";

import { useState, useEffect, useCallback } from "react";

type Order = {
  id: string;
  ref: string;
  email: string;
  items: { slug: string; title: string; quantity: number; price: number }[];
  total: number;
  offeredPrice: number | null;
  status: "pending" | "paid" | "delivered";
  dodoSessionId: string | null;
  dodoPaymentId: string | null;
  createdAt: string | null;
};

type Stats = {
  totalOrders: number;
  byStatus: { pending: number; paid: number; delivered: number };
  paidRevenue: number;
  offeredRevenue: number;
  grossRevenue: number;
  conversionRate: number;
  pendingValue: number;
};

type PaymentsResponse = {
  success: boolean;
  stats: Stats;
  itemBreakdown: { slug: string; title: string; qty: number }[];
  topEmails: { email: string; orders: number; revenue: number }[];
  page: number;
  totalPages: number;
  count: number;
  orders: Order[];
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  delivered: "bg-blue-50 text-blue-700",
};

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPaymentsPage() {
  const [data, setData] = useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("q", search);
      params.set("page", String(page));
      params.set("limit", "50");
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  async function handleDelete() {
    if (!deleteEmail.trim()) return;
    const email = deleteEmail.trim().toLowerCase();
    if (!confirm(`Delete ALL orders for ${email}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: [email] }),
      });
      const json = await res.json();
      alert(json.success ? `Deleted ${json.deletedCount} order(s).` : json.error || "Failed");
      setDeleteEmail("");
      setPage(1);
      await fetchPayments();
    } catch {
      alert("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  const stats = data?.stats;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Orders, revenue and payment status
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total orders</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            {stats ? stats.totalOrders : "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-400">All time</p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Paid revenue</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600">
            {stats ? formatINR(stats.paidRevenue) : "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {stats ? `${stats.byStatus.paid} paid orders` : ""}
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Pending</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-600">
            {stats ? stats.byStatus.pending : "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {stats ? `${formatINR(stats.pendingValue)} abandoned value` : ""}
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Conversion</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            {stats ? `${stats.conversionRate}%` : "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-400">paid / all orders</p>
        </div>
      </div>

      {/* Filters + delete */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {["", "pending", "paid", "delivered"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === s
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-black/10 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search email / ref / payment id"
          className="ml-auto rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      {/* Delete by email box */}
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <div className="flex-1 min-w-52">
          <label className="text-xs font-medium uppercase tracking-wider text-red-400">
            Delete all orders by email (admin tool)
          </label>
          <input
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            placeholder="user@example.com"
            className="mt-1.5 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400/40"
          />
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting || !deleteEmail.trim()}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-40"
        >
          {deleting ? "Deleting…" : "Delete orders"}
        </button>
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
        {loading ? (
          <div className="p-16 text-center text-zinc-400">Loading…</div>
        ) : data && data.orders.length === 0 ? (
          <div className="p-16 text-center text-zinc-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wider text-zinc-400">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Ref</th>
                </tr>
              </thead>
              <tbody>
                {data?.orders.map((o) => (
                  <tr key={o.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                    <td className="whitespace-nowrap px-5 py-3 text-zinc-500">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3 font-medium text-zinc-800">{o.email}</td>
                    <td className="px-5 py-3 text-zinc-500">
                      <div className="flex flex-wrap gap-1">
                        {(o.items || []).map((i) => (
                          <span
                            key={i.slug}
                            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                          >
                            {i.title || i.slug} ×{i.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-zinc-900">
                      {formatINR(o.total)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[o.status] || "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-400">{o.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
