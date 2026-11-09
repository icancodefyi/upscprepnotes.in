import { randomBytes } from "node:crypto";
import { DownloadHandoffModel, type DownloadHandoff } from "@/models/download-handoff.model";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "abhishek@gmail.com" → "ab***@gmail.com". */
export function maskEmail(email: string): string {
  const [user, domain] = email.trim().toLowerCase().split("@");
  if (!user || !domain) return "";
  return `${user.slice(0, 2)}***@${domain}`;
}

/** Only a path on this site, never an outside address, so the page can't be used to send people elsewhere. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string") return "/";
  let path = value.trim();
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    return "/";
  }
  return path.startsWith("/") && !path.startsWith("//") ? path.slice(0, 200) : "/";
}

type NewHandoff = Omit<DownloadHandoff, "token" | "emailMasked" | "returnTo"> & { email: string; returnTo?: unknown };

/** Creates the record for a waiting page and returns the path to send the visitor to. */
export async function createHandoff(h: NewHandoff): Promise<string> {
  const token = randomBytes(12).toString("base64url");
  await DownloadHandoffModel.create({
    token,
    kind: h.kind,
    title: h.title,
    files: h.files,
    pending: h.pending,
    emailMasked: maskEmail(h.email),
    returnTo: safeReturnTo(h.returnTo),
  });
  return `/get/${token}`;
}
