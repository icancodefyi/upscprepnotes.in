import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const PDF_MAP: Record<string, string> = {
  "may-2026": "may-2026.pdf",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || "may-2026";

  const filename = PDF_MAP[month];
  if (!filename) {
    return new Response(`No PDF for "${month}"`, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public/pdfs/current-affairs", filename);

  try {
    const buf = fs.readFileSync(filePath);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": buf.length.toString(),
      },
    });
  } catch {
    return new Response("PDF not found. Run `npm run generate-pdfs` to generate it.", { status: 404 });
  }
}
