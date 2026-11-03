import { locale } from "@app/constants/site.json";

export const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export const formatToday = () => {
  const parts = new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).formatToParts(new Date("2026-11-02"));
  const pick = (type) => parts.find((part) => part.type === type)?.value;
  return `${pick("weekday")}, ${pick("day")} ${pick("month")} ${pick("year")}`;
};

export const whatsappUrl = (base, phone) => `${base}${String(phone).replace(/\D/g, "")}`;
