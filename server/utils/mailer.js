import { mailFrom } from "./config.js";

const OUTBOX_LIMIT = 50;

const outbox = (globalThis.__unilinkOutbox ??= []);

export const getOutbox = () => outbox;

async function sendWithResend({ to, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: mailFrom(), to: [to], subject, html, text }),
  });

  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  return (await response.json()).id;
}

export async function sendMail(message) {
  const entry = { ...message, at: new Date().toISOString(), provider: process.env.RESEND_API_KEY ? "resend" : "console" };

  if (import.meta.dev) {
    outbox.unshift(entry);
    outbox.length = Math.min(outbox.length, OUTBOX_LIMIT);
  }

  if (!process.env.RESEND_API_KEY) {
    console.info(`[mail:console] to=${message.to} subject="${message.subject}"\n${message.text}`);
    return { id: null, provider: "console" };
  }

  return { id: await sendWithResend(message), provider: "resend" };
}

export function sendMailSafely(message) {
  sendMail(message).catch((error) => console.error("[mail] delivery failed:", error.message));
}
