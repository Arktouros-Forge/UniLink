import { defineApi, ok } from "@server/utils/api.js";
import { createRequest } from "@server/services/study-match/study-match.service.js";
import { requestBody } from "@server/validators/study-match.js";

export default defineApi({ body: requestBody }, async ({ user, body }) =>
  ok(await createRequest(user.id, body), "Request sent", 201),
);
