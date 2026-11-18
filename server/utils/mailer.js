import nodemailer from "nodemailer";
import { mailFrom, mailProvider, smtpUrl } from "./config.js";

const OUTBOX_LIMIT = 50;

const outbox = (globalThis.__unilinkOutbox ??= []);

export const getOutbox = () => outbox;

const parseAddress = (value) => {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(value);
  return match ? { name: match[1].replace(/^"|"$/g, ""), email: match[2] } : { name: "", email: value.trim() };
};

const transports = {
  async resend({ to, subject, html, text }) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: mailFrom(), to: [to], subject, html, text }),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
    return (await response.json()).id;
  },

  async brevo({ to, subject, html, text }) {
    const sender = parseAddress(mailFrom());
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: sender.name ? sender : { email: sender.email },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });
    if (!response.ok) throw new Error(`Brevo responded ${response.status}: ${await response.text()}`);
    return (await response.json()).messageId;
  },

  async smtp({ to, subject, html, text }) {
    const transporter = (globalThis.__unilinkSmtp ??= nodemailer.createTransport(smtpUrl()));
    const info = await transporter.sendMail({ from: mailFrom(), to, subject, html, text });
    return info.messageId;
  },
};

export async function sendMail(message) {
  const provider = mailProvider();
  const entry = { ...message, at: new Date().toISOString(), provider };

  if (import.meta.dev) {
    outbox.unshift(entry);
    outbox.length = Math.min(outbox.length, OUTBOX_LIMIT);
  }

  if (provider === "console") {
    console.info(`[mail:console] to=${message.to} subject="${message.subject}"\n${message.text}`);
    return { id: null, provider };
  }

  return { id: await transports[provider](message), provider };
}

export function sendMailSafely(message) {
  sendMail(message).catch((error) => console.error("[mail] delivery failed:", error.message));
}
