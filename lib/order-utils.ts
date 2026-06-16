import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { join } from "path";
import nodemailer from "nodemailer";
import { PRODUCTS, StoreProduct } from "@/lib/store-products";

const ZIP_DIR = join(process.cwd(), "private", "zips");

export function generateDownloadToken(): string {
  return randomUUID();
}

export function slugToDir(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export function getZipPath(slug: string): string | null {
  const dirName = slugToDir(slug);
  const zipPath = join(ZIP_DIR, `${dirName}.zip`);
  return existsSync(zipPath) ? zipPath : null;
}

export function resolveProducts(items: { slug: string }[]): StoreProduct[] {
  return items
    .map((item) => PRODUCTS.find((p) => p.slug === item.slug))
    .filter((p): p is StoreProduct => !!p);
}

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  items: { title: string }[],
  downloadUrl: string
) {
  const transporter = createTransporter();
  const itemList = items
    .map(
      (i) =>
        `<tr><td style="padding:4px 0;color:#333;font-size:14px">• ${i.title}</td></tr>`
    )
    .join("");

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
        <h1 style="margin:0 0 8px;font-size:22px;color:#111;text-align:center">Payment Successful!</h1>
        <p style="color:#666;font-size:14px;text-align:center;margin:0 0 4px;line-height:1.6">Order ID: <strong>${orderId}</strong></p>
        <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin:24px 0">
          <p style="margin:0 0 8px;font-size:13px;color:#888;font-weight:600">ITEMS PURCHASED</p>
          <table style="width:100%;border-collapse:collapse">${itemList}</table>
        </div>
        <a href="${downloadUrl}" style="display:block;text-align:center;background:#059669;color:#fff;text-decoration:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:700;margin:24px 0">Download Your Files</a>
        <p style="color:#999;font-size:12px;text-align:center;margin:0">This link is unique to you. Do not share it.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#999;font-size:12px;text-align:center;margin:0">Need help? Reply to this email for support</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `Your Downloads Are Ready — ${orderId}`,
    html,
  });
}

export async function sendAdminNotification(
  email: string,
  items: { title: string }[],
  total: number
) {
  const transporter = createTransporter();
  const itemList = items
    .map((i) => `<tr><td style="padding:4px 0">• ${i.title}</td></tr>`)
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;padding:24px;background:#f9f9f9">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
        <h2 style="margin:0 0 8px">New Dodo Payment Received</h2>
        <p style="margin:0 0 24px;color:#666">${email} completed payment of ₹${total}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Amount</td><td style="padding:8px 0;font-weight:600">₹${total}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Items</td><td style="padding:8px 0"><table>${itemList}</table></td></tr>
        </table>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"UPSCPrepNotes" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER || "upscprepnotes.in@gmail.com",
    subject: `New Dodo Sale: ₹${total} — ${email}`,
    html,
  });
}
