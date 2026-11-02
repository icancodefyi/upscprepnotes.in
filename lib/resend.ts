import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY env var");
  }
  return new Resend(key);
}

const fromName = process.env.EMAIL_FROM_NAME || "UPSCPrepNotes";
const fromEmail = process.env.EMAIL_FROM || "hello@upscprepnotes.in";

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  headers,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  headers?: Record<string, string>;
}) {
  const resend = getResend();
  return resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
    replyTo,
    headers,
  });
}

export default getResend;
