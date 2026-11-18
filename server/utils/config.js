const DEV_SECRET = "unilink-dev-secret-change-me-0123456789abcdef";

export function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (!import.meta.dev) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(DEV_SECRET);
}

export const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const smtpUrl = () => process.env.SMTP_URL ?? "";

export const mailProvider = () => {
  if (smtpUrl()) return "smtp";
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.RESEND_API_KEY) return "resend";
  return "console";
};

const smtpUser = () => {
  try {
    return decodeURIComponent(new URL(smtpUrl()).username);
  } catch {
    return "";
  }
};

export const mailFrom = () => {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  if (mailProvider() === "smtp" && smtpUser().includes("@")) return `UniLink <${smtpUser()}>`;
  return "UniLink <onboarding@resend.dev>";
};

export const allowedEmailDomains = () =>
  (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

export const isSecureCookie = () => !import.meta.dev;

export const firebaseProjectId = () => process.env.FIREBASE_PROJECT_ID ?? process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";

export const firebaseJwksUrl = () =>
  process.env.FIREBASE_JWKS_URL ?? "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
