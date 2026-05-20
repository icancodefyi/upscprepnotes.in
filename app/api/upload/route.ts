import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { ImageKit } = await import("@imagekit/nodejs");

    const imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });

    const result = await imagekit.files.upload({
      file,
      fileName: `payment-screenshot-${Date.now()}.${file.name.split(".").pop() || "png"}`,
      folder: "upscprepnotes/payment-screenshots",
      useUniqueFileName: true,
    });

    return NextResponse.json({ url: result.url }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
