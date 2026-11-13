import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=1800, s-maxage=3600" },
  });
}
