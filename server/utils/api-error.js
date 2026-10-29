import { createError } from "h3";
import { errorResponse } from "./api-response.js";

export function createApiError(
  statusCode = 500,
  message = "Internal server error",
  errors = null,
) {
  return createError({
    statusCode,
    statusMessage: message,
    data: errorResponse(message, errors),
  });
}
