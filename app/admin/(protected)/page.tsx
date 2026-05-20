import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { SearchBar } from "@/components/admin/search-bar";
import { Pagination } from "@/components/admin/pagination";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  await connectDB();

  const query = search
    ? {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
          { optionalSubject: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [toppers, total] = await Promise.all([
    TopperModel.find(query)
      .sort({ year: -1, rank: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TopperModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);
  const showingFrom = total === 0 ? 0 : skip + 1;
  const showingTo = Math.min(skip + limit, total);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Toppers</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {total > 0 ? (
              <>
                Showing {showingFrom}–{showingTo} of {total}
              </>
            ) : (
              "No toppers found"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar initialSearch={search} />
          <Link
            href="/admin/new"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            + Add Topper
          </Link>
        </div>
      </div>

      {toppers.length === 0 ? (
        <div className="rounded-[32px] border border-black/[0.06] bg-white p-16 text-center">
          <p className="text-lg text-zinc-500">
            {search
              ? "No toppers match your search."
              : "No toppers yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-[32px] border border-black/[0.06] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold">Optional</th>
                  <th className="p-4 font-semibold">Featured</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {toppers.map((t: Record<string, unknown>) => {
                  const id = String(t._id);
                  return (
                    <tr
                      key={id}
                      className="border-b border-black/[0.04] last:border-b-0 hover:bg-zinc-50"
                    >
                      <td className="p-4 font-medium">
                        {String(t.firstName || "")} {String(t.lastName || "")}
                      </td>
                      <td className="p-4 text-zinc-600">{String(t.rank)}</td>
                      <td className="p-4 text-zinc-600">{String(t.year)}</td>
                      <td className="p-4 text-zinc-600">
                        {String(t.optionalSubject || "-")}
                      </td>
                      <td className="p-4">
                        {t.isFeatured ? (
                          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                            No
                          </span>
                        )}
                      </td>
                      <td className="max-w-[160px] truncate p-4 font-mono text-xs text-zinc-500">
                        {String(t.slug || "")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/${id}`}
                            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium transition hover:bg-black hover:text-white"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/upsc-topper/${t.slug}`}
                            target="_blank"
                            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium transition hover:bg-black hover:text-white"
                          >
                            View
                          </Link>
                          <DeleteButton id={id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} search={search} />
        </>
      )}
    </div>
  );
}
