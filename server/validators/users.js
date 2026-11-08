import { z } from "zod";

import {
  csvIds,
  nullableText,
  optionalUrl,
  pagination,
  phone,
  searchText,
  trimmed,
} from "./common.js";

export const YEARS = [
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
];

const profileFields = {
  fullName: trimmed(2, 100),
  phone,
  major: nullableText(100),
  bio: nullableText(500),
  personalWebsite: optionalUrl,
  profilePhotoUrl: optionalUrl,
  year: z.enum(YEARS),
  skills: z
    .array(z.uuid())
    .max(20)
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate skill IDs are not allowed",
    ),
};

const atLeastOne = (data) => Object.keys(data).length > 0;

export const profileBody = z
  .object({ ...profileFields, onboarded: z.boolean() })
  .partial()
  .refine(atLeastOne, "Provide at least one field to update");

export const adminUserBody = z
  .object({ ...profileFields, nim: trimmed(5, 20) })
  .partial()
  .refine(atLeastOne, "Provide at least one field to update");

export const emailBody = z.object({
  currentPassword: z.string().min(1),
  email: z
    .email()
    .max(200)
    .transform((v) => v.toLowerCase()),
});

export const passwordBody = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .max(100)
      .regex(/[A-Za-z]/, "Must contain a letter")
      .regex(/\d/, "Must contain a number"),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path: ["newPassword"],
    message: "New password must differ from the current one",
  });

export const studentsQuery = pagination(12, 50).extend({
  q: searchText,
  skillIds: csvIds,
  year: z.enum(YEARS).optional(),
  major: searchText,
});

export const adminUsersQuery = pagination(15, 100).extend({
  q: searchText,
  role: z.enum(["student", "admin"]).optional(),
  status: z.enum(["active", "blocked"]).optional(),
  year: z.enum(YEARS).optional(),
});

export const statusBody = z
  .object({
    status: z.enum(["active", "blocked"]),
    reason: trimmed(3, 300).optional(),
  })
  .refine((d) => d.status === "active" || !!d.reason, {
    path: ["reason"],
    message: "A reason is required when blocking",
  });

export const mockLoginBody = z
  .object({
    role: z.enum(["student", "admin"]).optional(),
    userId: z.uuid().optional(),
  })
  .default({});
