import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

function categorize(subject: string): string {
  if (/answer copy/i.test(subject)) return "answer_copy";
  if (/free download|your free download/i.test(subject)) return "free_download";
  if (/free upsc study material/i.test(subject)) return "promotional";
  if (/you're one of/i.test(subject)) return "broadcast";
  if (/advertise|partnership|advertising/i.test(subject)) return "outreach";
  if (/sourcing/i.test(subject)) return "sourcing";
  if (/quick thought|random thought|question about advertising/i.test(subject)) return "outreach";
  return "other";
}

export async function GET() {
  try {
    const { data } = await resend.emails.list({ limit: 100 });

    const all = (data?.data ?? []).map((e: any) => ({
      id: e.id,
      to: e.to[0],
      subject: e.subject,
      category: categorize(e.subject),
      sent_at: e.created_at,
      status: e.last_event,
    }));

    const by_category: Record<string, any> = {};
    for (const e of all) {
      if (!by_category[e.category]) by_category[e.category] = [];
      by_category[e.category].push(e);
    }

    const summary: Record<string, any> = {
      total: all.length,
      delivered: all.filter((r: any) => r.status === "delivered").length,
      opened: all.filter((r: any) => r.status === "opened" || r.status === "clicked").length,
      clicked: all.filter((r: any) => r.status === "clicked").length,
      bounced: all.filter((r: any) => r.status === "bounced").length,
    };

    for (const [cat, emails] of Object.entries(by_category)) {
      summary[`${cat}_total`] = emails.length;
      summary[`${cat}_opened`] = emails.filter((r: any) => r.status === "opened" || r.status === "clicked").length;
      summary[`${cat}_clicked`] = emails.filter((r: any) => r.status === "clicked").length;
    }

    return NextResponse.json({ summary, emails: all });
  } catch (err) {
    console.error("Email status error:", err);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
