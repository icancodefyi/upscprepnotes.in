import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { getZipPath, slugToDir } from "@/lib/order-utils";

const ZIP_DIR = join(process.cwd(), "private", "zips");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    await connectDB();
    const order = await OrderModel.findOne({ downloadToken: token, status: "paid" });

    if (!order) {
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 });
    }

    const single = request.nextUrl.searchParams.get("slug");

    if (single) {
      const dirName = slugToDir(single);
      const fileDir = join(process.cwd(), "public", "downloads", dirName);

      if (!existsSync(fileDir)) {
        return NextResponse.json({ error: "Product files not found" }, { status: 404 });
      }

      const { readdirSync } = await import("fs");
      const files = readdirSync(fileDir).filter((f) => f.endsWith(".pdf") || f.endsWith(".zip"));

      if (files.length === 0) {
        return NextResponse.json({ error: "No files available" }, { status: 404 });
      }

      if (files.length === 1) {
        const filePath = join(fileDir, files[0]);
        const buf = readFileSync(filePath);
        return new NextResponse(buf, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(files[0])}"`,
            "Content-Length": String(buf.length),
          },
        });
      }

      const zipPath = getZipPath(single);
      if (zipPath && existsSync(zipPath)) {
        const buf = readFileSync(zipPath);
        return new NextResponse(buf, {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${dirName}.zip"`,
            "Content-Length": String(buf.length),
          },
        });
      }

      return NextResponse.json({ error: "Files not available for download" }, { status: 404 });
    }

    const zipPath = getZipPath(order.items[0]?.slug || "");
    if (!zipPath || !existsSync(zipPath)) {
      return NextResponse.json({ error: "Download files not found" }, { status: 404 });
    }

    const buf = readFileSync(zipPath);
    const filename = `${slugToDir(order.items[0]?.slug || "download")}.zip`;

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buf.length),
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
