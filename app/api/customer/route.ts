import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CustomerModel } from "@/models/customer.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import { sendEmail } from "@/lib/resend";

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "UPSC-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const GUIDES = [
  {
    title: "Answer Writing Strategy Guide",
    url: "https://upscprepnotes.in/pdfs/free-guides/guide-answer-writing.pdf",
  },
  {
    title: "IBEC Method — Answer Framework Guide",
    url: "https://upscprepnotes.in/pdfs/free-guides/guide-ibec-method.pdf",
  },
  {
    title: "GS1 Strategy Guide",
    url: "https://upscprepnotes.in/pdfs/free-guides/guide-gs1-strategy.pdf",
  },
];

async function sendCustomerEmail(name: string, email: string, orderId: string) {
  const guideLinks = GUIDES.map(
    (g) =>
      `<tr><td style="padding:6px 0"><a href="${g.url}" style="color:#059669;font-weight:600;font-size:14px">${g.title}</a></td></tr>`
  ).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f4f4f4;margin:0">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 32px">
        <div style="text-align:center;margin-bottom:24px">
          <div style="width:56px;height:56px;border-radius:50%;background:#d1fae5;display:inline-flex;align-items:center;justify-content:center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align-center">Payment Received, ${name}!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 4px;line-height:1.6">Order ID: <strong>${orderId}</strong></p>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6">We're preparing your compilation download link. You'll receive another email with the ZIP within 2 hours.</p>

        <div style="background:#f0fdf4;border-radius:12px;padding:24px;margin-bottom:24px">
          <p style="margin:0 0 12px;font-size:14px;color:#065f46;font-weight:600">Meanwhile, here are 3 free strategy guides to get started:</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">${guideLinks}</table>
        </div>

        <p style="color:#999;font-size:12px;text-align:center;margin:0">Need help? Reply to this email or WhatsApp us at +919152750079</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Payment Confirmed — Your Compilation is Being Prepared (${orderId})`,
    html,
  });
}

async function sendNotificationEmails(customer: Record<string, unknown>) {
  const subscriberEmails = await SubscriberEmailModel.find().lean();
  if (subscriberEmails.length === 0) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f9f9f9">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
        <h2 style="margin:0 0 8px">New Purchase Received</h2>
        <p style="color:#666;margin:0 0 24px">A customer has completed payment for <strong>${customer.product}</strong></p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#888">Order ID</td><td style="padding:8px 0;font-weight:600">${customer.orderId}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Name</td><td style="padding:8px 0;font-weight:600">${customer.name}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0">${customer.email}</td></tr>
          <tr><td style="padding:8px 0;color:#888">UTR</td><td style="padding:8px 0">${customer.utr || "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Product</td><td style="padding:8px 0;font-weight:600">${customer.product}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Amount</td><td style="padding:8px 0;font-weight:600">₹${customer.amount}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Screenshot</td><td style="padding:8px 0"><a href="${customer.screenshotUrl}" style="color:#2563eb">View Screenshot</a></td></tr>
          <tr><td style="padding:8px 0;color:#888">Date</td><td style="padding:8px 0">${new Date().toLocaleString("en-IN")}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:12px;color:#999">Visit the admin panel to verify and grant access.</p>
      </div>
    </body>
    </html>
  `;

  for (const sub of subscriberEmails) {
    try {
      await sendEmail({
        to: sub.email,
        subject: `New Purchase: ${customer.name} — ${customer.product} (₹${customer.amount})`,
        html,
      });
    } catch (err) {
      console.error(`Failed to send email to ${sub.email}:`, err);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, utr, product, amount, screenshotUrl } = body;

    if (!name || !email || !product || !amount) {
      return NextResponse.json(
        { error: "Name, email, product, and amount are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const orderId = generateOrderId();

    const customer = await CustomerModel.create({
      name,
      email,
      utr: utr || "",
      product,
      amount,
      screenshotUrl: screenshotUrl || "",
      orderId,
      status: "paid",
    });

    try {
      await sendCustomerEmail(name, email, orderId);
    } catch (err) {
      console.error("Customer email error:", err);
    }

    try {
      await sendNotificationEmails({
        name,
        email,
        utr: utr || "",
        product,
        amount,
        screenshotUrl: screenshotUrl || "",
        orderId,
      });
    } catch (err) {
      console.error("Admin notification error:", err);
    }

    return NextResponse.json(
      { success: true, id: customer._id, orderId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Customer API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
