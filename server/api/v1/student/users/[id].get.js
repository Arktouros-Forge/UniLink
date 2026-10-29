import { z } from "zod";
import { getStudentById } from "@server/services/users/users.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

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

  const id = getRouterParam(event, "id");
  const validation = z.uuid().safeParse(id);

  if (!validation.success) {
    const response = errorResponse("Invalid user ID", null, 400);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const user = await getStudentById(validation.data);

  if (!user) {
    const response = errorResponse("Student not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(user, "Student profile retrieved successfully");
});
