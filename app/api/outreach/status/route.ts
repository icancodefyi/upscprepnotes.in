import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY!);

const OUTREACH_SUBJECTS = [
  "GS SCORE x UPSCPrepNotes - quick thought",
  "UPSCPrepNotes x Sleepy Classes - random thought",
  "Question about advertising on UPSCPrepNotes",
  "UPSCPrepNotes x Testbook - partnership?",
  "LevelUp IAS x UPSCPrepNotes - quick thought",
  "Prepp IAS x UPSCPrepNotes - quick thought",
  "Tathastu ICS x UPSCPrepNotes - quick thought",
  "Quick thought — UPSCPrepNotes x EDEN IAS",
];

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, "outreach");
  if (rl) return rl;

  try {
    const { data } = await resend.emails.list({ limit: 100 });

    const outreach = (data?.data ?? []).filter((e: any) =>
      OUTREACH_SUBJECTS.includes(e.subject)
    );

    const rows = outreach.map((e: any) => ({
      id: e.id,
      to: e.to[0],
      subject: e.subject,
      sent_at: e.created_at,
      status: e.last_event,
    }));

    return NextResponse.json({
      total: rows.length,
      opened: rows.filter((r: any) => r.status === "opened" || r.status === "clicked").length,
      clicked: rows.filter((r: any) => r.status === "clicked").length,
      emails: rows,
    });
  } catch (err) {
    console.error("Outreach status error:", err);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
