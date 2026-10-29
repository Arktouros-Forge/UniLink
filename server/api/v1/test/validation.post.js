import { z } from "zod";
import { validateData } from "@server/utils/validate.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const testSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = validateData(testSchema, body);

  if (!result.success) {
    setResponseStatus(event, 422);

    return errorResponse("Validation failed", result.errors);
  }

  return successResponse(result.data, "Validation successful");
});
