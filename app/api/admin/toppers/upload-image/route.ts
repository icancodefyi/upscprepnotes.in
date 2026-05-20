import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  if (!(await authenticate(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ImageKit } = await import("@imagekit/nodejs");
    const imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const result = await imagekit.files.upload({
        file,
        fileName: `topper-${Date.now()}.${file.name.split(".").pop() || "jpg"}`,
        folder: "toppers",
        useUniqueFileName: true,
      });

      return NextResponse.json({ url: result.url }, { status: 200 });
    }

    const body = await request.json();
    const { url: imageUrl } = body;

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Download the image from the URL
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; UPSCPrepNotes/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: 502 }
      );
    }

    const blob = await response.blob();
    const fileName = `topper-${Date.now()}.${blob.type.split("/").pop() || "jpg"}`;
    const file = new File([blob], fileName, { type: blob.type });

    const result = await imagekit.files.upload({
      file,
      fileName,
      folder: "toppers",
      useUniqueFileName: true,
    });

    return NextResponse.json({ url: result.url }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
