const DEV_SECRET = "unilink-dev-secret-change-me-0123456789abcdef";

export function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (!import.meta.dev) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(DEV_SECRET);
}

export const appUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const mailFrom = () => process.env.MAIL_FROM ?? "UniLink <onboarding@resend.dev>";

export const allowedEmailDomains = () =>
  (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

export const isSecureCookie = () => !import.meta.dev;

export const firebaseProjectId = () => process.env.FIREBASE_PROJECT_ID ?? process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";

export const firebaseJwksUrl = () =>
  process.env.FIREBASE_JWKS_URL ?? "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
