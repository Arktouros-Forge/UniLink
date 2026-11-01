import { locale, timezone, timezoneLabel, whatsappBase } from "@app/constants/site.json";

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export const formatDate = (iso, options = { day: "numeric", month: "short", year: "numeric" }) =>
  iso ? new Intl.DateTimeFormat(locale, { timeZone: timezone, ...options }).format(new Date(iso)) : "";

export const formatDeadline = (iso) =>
  `${formatDate(iso)} · ${formatDate(iso, { hour: "2-digit", minute: "2-digit", hour12: false })} ${timezoneLabel}`;

export const waLink = (phone = "", text = "") =>
  `${whatsappBase}${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const addDays = (days, from = new Date()) => new Date(new Date(from).getTime() + days * 86400000).toISOString();

export const isPast = (iso) => new Date(iso).getTime() < Date.now();

export const firstName = (name = "") => name.split(" ")[0];
