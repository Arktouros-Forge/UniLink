export const toneClass = {
  neutral: "bg-soft text-ink border-edge",
  blue: "bg-transparent text-brand-blue border-brand-blue",
  yellow: "bg-brand-yellow text-[#16151a] border-brand-yellow",
  red: "bg-transparent text-brand-red border-brand-red",
  green: "bg-transparent text-good border-good",
};

export const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export const whatsappLink = (base, phone, text) =>
  `${base}${String(phone).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
