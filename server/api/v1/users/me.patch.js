import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@database";
import { users } from "@database/schema/index";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const profileSchema = z
  .object({
    username: z.string().min(3).max(30).optional(),
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().nullable().optional(),
    year: z.number().int().min(2018).max(2030).nullable().optional(),
    personalWebsite: z.string().url().nullable().optional(),
    profilePhotoUrl: z.string().url().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    return errorResponse("You are not logged in");
  }

  const body = await readBody(event);
  const result = profileSchema.safeParse(body);

  if (!result.success) {
    setResponseStatus(event, 422);

    return errorResponse(
      "Validation failed",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      ...result.data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .returning({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      nim: users.nim,
      email: users.email,
      phone: users.phone,
      role: users.role,
      year: users.year,
      personalWebsite: users.personalWebsite,
      profilePhotoUrl: users.profilePhotoUrl,
      status: users.status,
    });

  return successResponse(updatedUser, "Profile updated successfully");
});
