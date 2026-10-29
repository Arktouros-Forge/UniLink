import { z } from "zod";
import { getStudents } from "@server/services/users/users.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export default defineEventHandler(async (event) => {
  const currentUser = await getCurrentUser(event);

  if (!currentUser) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (currentUser.role !== "student") {
    const response = errorResponse("Student access required", null, 403);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = querySchema.safeParse(getQuery(event));

  if (!result.success) {
    const response = errorResponse(
      "Invalid query parameters",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      422,
    );

    setResponseStatus(event, response.statusCode);
    return response;
  }

  const data = await getStudents(result.data);

  return successResponse(data, "Students retrieved successfully");
});
