import { createApiError } from "@server/utils/api-error.js";

export default defineEventHandler(() => {
  throw createApiError(404, "Test resource not found");
});
