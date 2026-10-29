import { z } from "zod";
import { updateUserProfile } from "@server/services/users/users.service.js";
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
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const body = await readBody(event);
  const result = profileSchema.safeParse(body);

  if (!result.success) {
    const response = errorResponse(
      "Validation failed",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      422,
    );

    setResponseStatus(event, response.statusCode);
    return response;
  }

  const updatedUser = await updateUserProfile(user.id, result.data);

  if (!updatedUser) {
    const response = errorResponse("User not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(updatedUser, "Profile updated successfully");
});
