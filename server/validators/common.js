import { z } from "zod";

export const idParam = z.object({ id: z.uuid() });

export const pagination = (defaultLimit = 10, maxLimit = 50) =>
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(maxLimit).default(defaultLimit),
  });

export const searchText = z.string().trim().max(100).optional();

export const optionalUrl = z.url().max(500).nullable().optional();

export const trimmed = (min = 1, max = 200) =>
  z.string().trim().min(min).max(max);

export const nullableText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable()
    .optional();

export const csvIds = z
  .string()
  .optional()
  .transform((value) => (value ? value.split(",").filter(Boolean) : []))
  .pipe(z.array(z.uuid()).max(20));

export const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Use HH:MM");

export const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return `+62${digits.slice(2).replace(/^0+/, "")}`;
  return `+62${digits.replace(/^0+/, "")}`;
};

export const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s().-]{9,22}$/, "Invalid phone number")
  .transform(normalizePhone)
  .refine((value) => /^\+62[0-9]{8,13}$/.test(value), "Use an Indonesian number, for example 0812 3456 7890");
