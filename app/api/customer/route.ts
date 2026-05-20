import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CustomerModel } from "@/models/customer.model";
import { SubscriberEmailModel } from "@/models/subscriber-email.model";
import nodemailer from "nodemailer";

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "UPSC-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function sendNotificationEmails(customer: Record<string, unknown>) {
  const subscriberEmails = await SubscriberEmailModel.find().lean();
  if (subscriberEmails.length === 0) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

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
          <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0">${customer.phone}</td></tr>
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
      await transporter.sendMail({
        from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
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
    const { name, email, phone, product, amount, screenshotUrl } = body;

    if (!name || !email || !phone || !product || !amount) {
      return NextResponse.json(
        { error: "Name, email, phone, product, and amount are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const orderId = generateOrderId();

    const customer = await CustomerModel.create({
      name,
      email,
      phone,
      product,
      amount,
      screenshotUrl: screenshotUrl || "",
      orderId,
      status: "paid",
    });

    try {
      await sendNotificationEmails({
        name,
        email,
        phone,
        product,
        amount,
        screenshotUrl: screenshotUrl || "",
        orderId,
      });
    } catch (err) {
      console.error("Email notification error:", err);
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
