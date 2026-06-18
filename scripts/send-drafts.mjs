import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config({ path: ".env.local" });

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME || "upscprepnotes" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const REVIEW_EMAIL = "impic.tech@gmail.com";

const UTM = "utm_source=email&utm_medium=email&utm_campaign=free-download-followup";

const GUIDES = [
  { title: "Answer Writing Strategy Guide", url: `https://upscprepnotes.in/pdfs/free-guides/guide-answer-writing.pdf?${UTM}&utm_content=guide-answer-writing` },
  { title: "IBEC Method — Answer Framework Guide", url: `https://upscprepnotes.in/pdfs/free-guides/guide-ibec-method.pdf?${UTM}&utm_content=guide-ibec` },
  { title: "GS1 Strategy Guide", url: `https://upscprepnotes.in/pdfs/free-guides/guide-gs1-strategy.pdf?${UTM}&utm_content=guide-gs1` },
];

const guideItems = GUIDES.map(g =>
  `<tr>
    <td style="padding:0 0 10px 0">
      <table cellpadding="0" cellspacing="0" style="width:100%">
        <tr>
          <td style="width:28px;vertical-align:top;padding:2px 0 0 0"><span style="font-size:16px">📄</span></td>
          <td style="vertical-align:top"><a href="${g.url}" style="color:#059669;font-weight:600;font-size:14px;text-decoration:none;border-bottom:1px solid #d1fae5;padding-bottom:1px">${g.title}</a><span style="color:#888;font-size:12px;display:block;margin-top:1px">Free PDF download</span></td>
        </tr>
      </table>
    </td>
  </tr>`
).join("");

const BRAND_LOGO = "https://upscprepnotes.in/logo.png";

const brandHeader = `
  <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px">
    <tr>
      <td style="text-align:center;padding:0">
        <a href="https://upscprepnotes.in?${UTM}&utm_content=logo" style="text-decoration:none">
          <img src="${BRAND_LOGO}" alt="UPSCPrepNotes" width="180" style="display:inline-block;max-width:180px;height:auto;border:0">
        </a>
      </td>
    </tr>
  </table>
`;

const productCard = `
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f0fdf4;border-radius:12px;margin-bottom:12px">
    <tr>
      <td style="padding:24px">
        <table cellpadding="0" cellspacing="0" style="width:100%">
          <tr>
            <td style="font-size:13px;color:#065f46;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:0 0 4px 0">Hot Seller</td>
          </tr>
          <tr>
            <td style="font-size:18px;font-weight:700;color:#111;padding:0 0 6px 0">PRAHAAR Complete</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#444;line-height:1.5;padding:0 0 12px 0">GS 1–4 complete notes bundle — 15 files covering every paper. Structured, syllabus-complete, instant download.</td>
          </tr>
          <tr>
            <td style="padding:0 0 16px 0">
              <span style="font-size:22px;font-weight:800;color:#111">₹199</span>
              <span style="font-size:14px;color:#999;text-decoration:line-through;margin-left:8px">₹499</span>
              <span style="display:inline-block;background:#059669;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:8px;vertical-align:middle">60% OFF</span>
            </td>
          </tr>
          <tr>
            <td>
              <a href="https://upscprepnotes.in/store/prahaar-complete?${UTM}&utm_content=product-prahaar" style="display:inline-block;background:#059669;color:#fff;padding:12px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">View Product →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

const productCard2 = `
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f0fdf4;border-radius:12px;margin-bottom:12px">
    <tr>
      <td style="padding:24px">
        <table cellpadding="0" cellspacing="0" style="width:100%">
          <tr>
            <td style="font-size:13px;color:#065f46;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:0 0 4px 0">Best Value</td>
          </tr>
          <tr>
            <td style="font-size:18px;font-weight:700;color:#111;padding:0 0 6px 0">All Strategy Reports</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#444;line-height:1.5;padding:0 0 12px 0">280+ topper strategies with marks analysis — paper-wise breakdowns for every rank holder. Lifetime access.</td>
          </tr>
          <tr>
            <td style="padding:0 0 16px 0">
              <span style="font-size:22px;font-weight:800;color:#111">₹799</span>
              <span style="font-size:14px;color:#999;text-decoration:line-through;margin-left:8px">₹27,720</span>
              <span style="display:inline-block;background:#059669;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:8px;vertical-align:middle">97% OFF</span>
            </td>
          </tr>
          <tr>
            <td>
              <a href="https://upscprepnotes.in/store/all-strategy-reports?${UTM}&utm_content=product-strategy-reports" style="display:inline-block;background:#059669;color:#fff;padding:12px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:14px">View Product →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

const footer = `
  <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:32px;padding-top:20px;border-top:1px solid #e4e4e7">
    <tr>
      <td style="text-align:center;font-size:12px;color:#a1a1aa;line-height:1.6">
        UPSCPrepNotes — Structured UPSC intelligence archive<br>
        280+ Profiles · 18 Subjects · Updated Regularly<br>
        <a href="https://upscprepnotes.in?${UTM}&utm_content=footer" style="color:#059669;text-decoration:none">upscprepnotes.in</a>
      </td>
    </tr>
  </table>
`;

// ── SCENARIO 1: BharatJai PrakashMeena — PDFs found ──
const emailBharatJai = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f4f4f5">
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f4f4f5;padding:40px 0">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
          <tr><td style="padding:40px 32px 32px">
            ${brandHeader}

            <div style="text-align:center;margin-bottom:20px"><span style="font-size:40px">🎉</span></div>
            <h1 style="margin:0 0 6px;font-size:24px;color:#18181b;text-align:center;font-weight:700;letter-spacing:-0.3px">Your Answer Copy is Ready!</h1>
            <p style="color:#52525b;font-size:15px;text-align:center;margin:0 0 28px;line-height:1.6">You requested <strong style="color:#18181b">BharatJai PrakashMeena</strong>'s answer copy — it's now available for download.</p>

            <table cellpadding="0" cellspacing="0" style="width:100%;background:#fafafa;border-radius:12px;margin-bottom:28px">
              <tr>
                <td style="padding:20px 24px">
                  <p style="margin:0 0 14px;font-size:13px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Download Links</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%">
                    <tr><td style="padding:0 0 10px 0"><a href="https://www.drishtiias.com/hindi/images/pdf/Bharat-jai-prakash-Meena-GS-3-(Test-7).pdf" style="color:#059669;font-weight:600;font-size:14px;text-decoration:none;border-bottom:1px solid #d1fae5;padding-bottom:1px">GS Paper 3 — BharatJai's Answer Copy</a></td></tr>
                    <tr><td style="padding:0 0 0 0"><a href="https://www.drishtiias.com/hindi/images/pdf/Bharat-jai-prakash-meena-GS-4-(Test-4).pdf" style="color:#059669;font-weight:600;font-size:14px;text-decoration:none;border-bottom:1px solid #d1fae5;padding-bottom:1px">GS Paper 4 — BharatJai's Answer Copy</a></td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <div style="text-align:center;margin-bottom:28px">
              <a href="https://upscprepnotes.in/upsc-topper/bharatjai-prakashmeena-rank-85-2022?${UTM}&utm_content=profile-bharatjai" style="display:inline-block;background:#18181b;color:#fff;padding:12px 28px;border-radius:40px;text-decoration:none;font-weight:600;font-size:14px">View Full Profile →</a>
            </div>

            <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e4e4e7;padding-top:24px;margin-bottom:24px">
              <tr>
                <td>
                  <p style="margin:0 0 12px;font-size:15px;color:#18181b;font-weight:600">📘 Free Strategy Guides</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%">${guideItems}</table>
                </td>
              </tr>
            </table>

            <p style="font-size:14px;color:#52525b;text-align:center;margin:0 0 18px;font-weight:500">🔥 Also check out our hot sellers:</p>
            ${productCard}
            ${productCard2}

            ${footer}
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── SCENARIO 2: Komal Meena — nothing found ──
const emailKomal = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f4f4f5">
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#f4f4f5;padding:40px 0">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
          <tr><td style="padding:40px 32px 32px">
            ${brandHeader}

            <div style="text-align:center;margin-bottom:20px"><span style="font-size:40px">🙏</span></div>
            <h1 style="margin:0 0 6px;font-size:24px;color:#18181b;text-align:center;font-weight:700;letter-spacing:-0.3px">We Apologize</h1>
            <p style="color:#52525b;font-size:15px;text-align:center;margin:0 0 8px;line-height:1.6">You requested <strong style="color:#18181b">Komal Meena</strong>'s answer copy. We searched thoroughly but weren't able to source it.</p>
            <p style="color:#52525b;font-size:15px;text-align:center;margin:0 0 10px;line-height:1.6">As a gesture, we've put together free strategy guides and a recommendation you can use right now:</p>

            <table cellpadding="0" cellspacing="0" style="width:100%;background:#f0fdf4;border-radius:12px;margin:0 0 28px 0">
              <tr>
                <td style="padding:24px">
                  <p style="margin:0 0 14px;font-size:14px;color:#065f46;font-weight:600">🎯 Try a similar topper's copy instead</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%">
                    <tr><td style="padding:0 0 10px 0"><a href="https://www.drishtiias.com/hindi/images/pdf/DIVYA-(438)-2021-GS.pdf" style="color:#059669;font-weight:600;font-size:14px;text-decoration:none;border-bottom:1px solid #d1fae5;padding-bottom:1px">Divya Tanwar (AIR 105) — Free Answer Copy</a></td></tr>
                    <tr><td style="padding:0 0 0 0"><a href="https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER_GS1_T01_SHAKTI_DUBEY_AIR01_9e6e373cbd.pdf" style="color:#059669;font-weight:600;font-size:14px;text-decoration:none;border-bottom:1px solid #d1fae5;padding-bottom:1px">Shakti Dubey (AIR 1) — Free Answer Copy</a></td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e4e4e7;padding-top:24px;margin-bottom:24px">
              <tr>
                <td>
                  <p style="margin:0 0 12px;font-size:15px;color:#18181b;font-weight:600">📘 Free Strategy Guides</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%">${guideItems}</table>
                </td>
              </tr>
            </table>

            <p style="font-size:14px;color:#52525b;text-align:center;margin:0 0 18px;font-weight:500">🔥 Also check out our hot sellers:</p>
            ${productCard}
            ${productCard2}

            ${footer}
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── SCENARIO 3: Arjun Gupta — nothing found ──
const emailArjun = emailKomal.replace(/Komal Meena/g, "Arjun Gupta");

const RECIPIENTS = [
  { email: "shyamkumar8252790105@gmail.com", name: "BharatJai PrakashMeena", scenario: "BharatJai PrakashMeena — PDFs Found", html: emailBharatJai, subject: "Your Requested Answer Copy — BharatJai PrakashMeena" },
  { email: "nargist91@gmail.com", name: "Komal Meena", scenario: "Komal Meena — Nothing Found", html: emailKomal, subject: "Update on Your Requested Answer Copy — Komal Meena" },
  { email: "prabhaswayam22@gmail.com", name: "Arjun Gupta", scenario: "Arjun Gupta — Nothing Found", html: emailArjun, subject: "Update on Your Requested Answer Copy — Arjun Gupta" },
];

console.log("─".repeat(50));
console.log("SENDING TO ACTUAL REQUESTERS...\n");

for (const r of RECIPIENTS) {
  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: r.email,
    bcc: REVIEW_EMAIL,
    subject: r.subject,
    html: r.html,
  });
  console.log(`✓ Sent to ${r.email} — ${r.scenario}`);
}

await mongoose.disconnect();
console.log("\n✓ All 3 emails sent to requesters (BCC'd impic.tech@gmail.com)");
