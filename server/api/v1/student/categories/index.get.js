import { z } from "zod";
import { getQuery, setResponseStatus } from "h3";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";
import { getCategories } from "@server/services/categories/categories.service.js";

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (user.role !== "student") {
    const response = errorResponse("Access denied", null, 403);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = querySchema.safeParse(getQuery(event));

  if (!result.success) {
    const response = errorResponse(
      "Invalid query parameters",
      result.error.issues,
      422,
    );
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const data = await getCategories(result.data);

  return successResponse(data, "Categories retrieved successfully");
});
