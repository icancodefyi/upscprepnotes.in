import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "ImageKit private key not configured" },
        { status: 500 },
      );
    }

    const { ImageKit } = await import("@imagekit/nodejs");

    const imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });

    const fileName = `payment-screenshot-${Date.now()}.${(file.name || "png").split(".").pop() || "png"}`;

    const result = await imagekit.files.upload({
      file,
      fileName,
      folder: "upscprepnotes/payment-screenshots",
      useUniqueFileName: true,
    });

    return NextResponse.json({ url: result.url }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to upload file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
