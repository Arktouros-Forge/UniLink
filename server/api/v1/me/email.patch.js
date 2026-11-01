import { z } from "zod";
import { changeUserEmail } from "@server/services/users/account.service";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const emailSchema = z.object({
  currentPassword: z.string().min(1),
  newEmail: z
    .string()
    .trim()
    .email()
    .transform((email) => email.toLowerCase()),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = emailSchema.safeParse(await readBody(event));

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

  const outcome = await changeUserEmail(
    user.id,
    result.data.currentPassword,
    result.data.newEmail,
  );

  if (!outcome.success) {
    const errors = {
      USER_NOT_FOUND: ["User not found", 404],
      INVALID_CURRENT_PASSWORD: ["Current password is incorrect", 401],
      EMAIL_ALREADY_IN_USE: ["Email is already in use", 409],
    };

    const [message, statusCode] = errors[outcome.reason];
    const response = errorResponse(message, null, statusCode);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(outcome.data, "Email changed successfully");
});
