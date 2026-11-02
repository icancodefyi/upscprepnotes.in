import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/admin-auth";
import { FreeDownloadLeadModel } from "@/models/free-download-lead.model";
import { FreeGuideLeadModel } from "@/models/free-guide-lead.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { CopyRequestModel } from "@/models/copy-request.model";
import { OrderModel } from "@/models/order.model";

export const dynamic = "force-dynamic";

const csv = (v: unknown) => {
  const s = String(v ?? "");
  // Neutralise spreadsheet formulas in user-supplied text.
  const safe = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** Every unique email on any lead form, with first/last seen, the forms used and whether they bought. Admin only. */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sel = { email: 1, createdAt: 1 };
  const [dl, mat, guide, sub, cr, paid] = await Promise.all([
    FreeDownloadLeadModel.find({}, sel).lean(),
    FreeMaterialLeadModel.find({}, sel).lean(),
    FreeGuideLeadModel.find({}, sel).lean(),
    SubscriberEmailModel.find({}, sel).lean(),
    CopyRequestModel.find({}, sel).lean(),
    OrderModel.aggregate<{ _id: string; spent: number; orders: number }>([
      { $match: { status: { $in: ["paid", "delivered"] }, email: { $nin: [null, ""] } } },
      { $group: { _id: "$email", spent: { $sum: "$total" }, orders: { $sum: 1 } } },
    ]),
  ]);
  const people = new Map<string, { first: Date; last: Date; forms: Set<string> }>();
  const add = (rows: unknown[], label: string) => {
    for (const r of rows as { email?: string; createdAt?: Date }[]) {
      if (!r.email || !r.createdAt) continue;
      const p = people.get(r.email) ?? { first: r.createdAt, last: r.createdAt, forms: new Set<string>() };
      if (r.createdAt < p.first) p.first = r.createdAt;
      if (r.createdAt > p.last) p.last = r.createdAt;
      p.forms.add(label);
      people.set(r.email, p);
    }
  };
  add(dl, "free_answer_copy"); add(mat, "free_material"); add(guide, "free_guide"); add(sub, "newsletter"); add(cr, "copy_request");
  const bought = new Map(paid.map((p) => [p._id.toLowerCase(), p]));

  const lines = ["email,first_seen,last_seen,forms,bought,orders,total_spent"];
  for (const [email, p] of [...people].sort((a, b) => +b[1].last - +a[1].last)) {
    const b = bought.get(email);
    lines.push([email, p.first.toISOString().slice(0, 10), p.last.toISOString().slice(0, 10), [...p.forms].join("|"), b ? "yes" : "no", b?.orders ?? 0, b?.spent ?? 0].map(csv).join(","));
  }
  return new NextResponse(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="upscprepnotes-leads-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
}
