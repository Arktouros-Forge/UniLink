import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@database/index";
import { users } from "@database/schema/index";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const validation = z.uuid().safeParse(id);

  if (!validation.success) {
    setResponseStatus(event, 400);
    return errorResponse("Invalid user ID");
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      role: users.role,
      year: users.year,
      personalWebsite: users.personalWebsite,
      profilePhotoUrl: users.profilePhotoUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, validation.data), eq(users.role, "student")))
    .limit(1);

  if (!user) {
    setResponseStatus(event, 404);
    return errorResponse("Student not found");
  }

  return successResponse(user, "Student profile retrieved successfully");
});
