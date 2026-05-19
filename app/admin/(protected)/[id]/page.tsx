import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { TopperForm } from "@/components/admin/topper-form";
import type { Topper } from "@/types/topper";

export const dynamic = "force-dynamic";

export default async function EditTopperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const topper = await TopperModel.findById(id).lean();

  if (!topper) {
    notFound();
  }

  const serialized: Topper = {
    ...topper,
    _id: topper._id.toString(),
    createdAt: topper.createdAt,
    updatedAt: topper.updatedAt,
  } as unknown as Topper;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">
        Edit: {serialized.firstName} {serialized.lastName}
      </h1>
      <TopperForm topper={serialized} />
    </div>
  );
}
