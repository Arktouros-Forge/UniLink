import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@database/index";
import { users } from "@database/schema/index";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export default defineEventHandler(async (event) => {
  const result = querySchema.safeParse(getQuery(event));

  if (!result.success) {
    setResponseStatus(event, 422);
    return errorResponse(
      "Invalid query parameters",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  const { q, page, limit } = result.data;
  const conditions = [eq(users.role, "student")];

  if (q) {
    conditions.push(
      or(ilike(users.username, `%${q}%`), ilike(users.fullName, `%${q}%`)),
    );
  }

  const where = and(...conditions);
  const offset = (page - 1) * limit;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        year: users.year,
        personalWebsite: users.personalWebsite,
        profilePhotoUrl: users.profilePhotoUrl,
      })
      .from(users)
      .where(where)
      .orderBy(asc(users.username))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(users).where(where),
  ]);

  return successResponse(
    {
      users: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Students retrieved successfully",
  );
});
