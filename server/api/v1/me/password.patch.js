import { z } from "zod";
import { changeUserPassword } from "@server/services/users/account.service";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = passwordSchema.safeParse(await readBody(event));

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

  const outcome = await changeUserPassword(
    user.id,
    result.data.currentPassword,
    result.data.newPassword,
  );

  if (!outcome.success) {
    const errors = {
      USER_NOT_FOUND: ["User not found", 404],
      INVALID_CURRENT_PASSWORD: ["Current password is incorrect", 401],
    };

    const [message, statusCode] = errors[outcome.reason];
    const response = errorResponse(message, null, statusCode);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(outcome.data, "Password changed successfully");
});
