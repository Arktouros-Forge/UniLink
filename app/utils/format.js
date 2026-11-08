import { locale } from "@app/constants/site.json";

export const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export const formatToday = () => {
  const parts = new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).formatToParts(new Date());
  const pick = (type) => parts.find((part) => part.type === type)?.value;
  return `${pick("weekday")}, ${pick("day")} ${pick("month")} ${pick("year")}`;
};

export const whatsappUrl = (base, phone) => `${base}${String(phone).replace(/\D/g, "")}`;

const DAY = 86_400_000;

export const daysLeft = (iso) => Math.ceil((new Date(iso).getTime() - Date.now()) / DAY);

export const formatDate = (iso, options = { day: "2-digit", month: "short", year: "numeric" }) =>
  iso ? new Intl.DateTimeFormat(locale, options).format(new Date(iso)) : "";

export const formatDeadline = (iso) => {
  const days = daysLeft(iso);
  if (days < 0) return "Berakhir";
  if (days === 0) return "Hari ini";
  return `${days} hari lagi`;
};
