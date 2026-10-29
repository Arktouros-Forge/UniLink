import { z } from "zod";
import { addUserSkill } from "@server/services/users/user-skills.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const bodySchema = z.object({
  skillId: z.uuid(),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (user.role !== "student") {
    const response = errorResponse("Student access required", null, 403);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const body = await readBody(event);
  const result = bodySchema.safeParse(body);

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

  const resultData = await addUserSkill(user.id, result.data.skillId);

  if (!resultData.success) {
    const statusCode = resultData.reason === "SKILL_NOT_FOUND" ? 404 : 409;

    const message =
      resultData.reason === "SKILL_NOT_FOUND"
        ? "Skill not found"
        : "Skill already added";

    const response = errorResponse(message, null, statusCode);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const response = successResponse(
    resultData.data,
    "Skill added successfully",
    201,
  );

  setResponseStatus(event, response.statusCode);
  return response;
});
