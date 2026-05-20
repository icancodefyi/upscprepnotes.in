import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

interface Props {
  params: Promise<{ year: string }>;
}

async function getToppersByYear(year: number) {
  await connectDB();

  const toppers = await TopperModel.find({ year }).sort({ rank: 1 }).lean();

  return toppers;
}

export default async function YearPage({ params }: Props) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);

  if (isNaN(yearNum)) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold">Invalid year</h1>
        </div>
      </main>
    );
  }

  const toppers = await getToppersByYear(yearNum);

  return (
    <main className="min-h-screen bg-background text-black">
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Yearly Archive
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">UPSC {yearNum} Toppers</h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-zinc-800">
            Browse featured toppers and their preparation intelligence for UPSC {yearNum}.
          </p>
        </div>

        {toppers.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center py-24">
            <p className="text-zinc-600">No topper profiles found for this year.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {toppers.map((topper: any) => (
              <Link
                key={topper._id}
                href={`/upsc-topper/${topper.slug}`}
                className="group grid gap-3 md:gap-4 rounded-[32px] border border-transparent bg-transparent px-3 py-4 md:px-6 md:py-6 transition duration-300 hover:border-black/[0.04] hover:bg-background/70 md:grid-cols-[100px_minmax(0,1fr)_120px] grid-cols-1"
              >
                <div>
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`}
                    alt={`${topper.firstName} ${topper.lastName}`}
                    className="md:h-20 md:w-20 h-16 w-16 rounded-2xl border border-black/5 bg-background shadow-sm"
                  />
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1">
                    {topper.firstName} {topper.lastName}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                    <span>AIR {topper.rank}</span>
                    <span>•</span>
                    <span>{topper.year}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-right">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                      Total
                    </p>

                    <p className="mt-1 text-lg md:text-2xl font-semibold">
                      {topper.marks?.total || "—"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
