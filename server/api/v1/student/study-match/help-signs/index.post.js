import { defineApi, ok } from "@server/utils/api.js";
import { createSign } from "@server/services/study-match/study-match.service.js";
import { signBody } from "@server/validators/study-match.js";

export default defineApi({ body: signBody }, async ({ user, body }) =>
  ok(await createSign(user.id, body), "Help sign posted", 201),
);
