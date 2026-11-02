import { SITE, unsubscribePageUrl } from "@/lib/email-links";

const BLUE = "#1f3fd6";
const INK = "#0b0c10";
const BODY = "#2b2f3a";
const MUTED = "#6b7280";

export const p = (html: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${BODY}">${html}</p>`;

export const ul = (items: string[]) =>
  `<ul style="margin:0 0 16px;padding-left:20px;font-size:16px;line-height:1.65;color:${BODY}">${items
    .map((i) => `<li style="margin:0 0 6px">${i}</li>`)
    .join("")}</ul>`;

export const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:16px;font-weight:700">${label}</a></p>`;

/** Appends campaign tags to an on-site path. */
export function link(path: string, campaign: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${SITE}${path}${sep}utm_source=email&utm_medium=${campaign.split("-")[0]}&utm_campaign=${campaign}`;
}

/** Plain, single-column layout: reads like a personal email, not a newsletter. */
export function layout({ body, email, preheader }: { body: string; email: string; preheader?: string }): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:${INK}">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 20px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:100%">
<tr><td style="padding-bottom:20px;font-size:18px;font-weight:800;color:${BLUE}">UPSCPrepNotes</td></tr>
<tr><td>${body}</td></tr>
<tr><td style="padding-top:24px;border-top:1px solid #e5e7eb;font-size:13px;line-height:1.6;color:${MUTED}">
You are getting this because you used upscprepnotes.in with this email address.<br>
<a href="${unsubscribePageUrl(email)}" style="color:${MUTED}">Unsubscribe</a> &middot; <a href="${SITE}" style="color:${MUTED}">upscprepnotes.in</a>
</td></tr>
</table></td></tr></table></body></html>`;
}
