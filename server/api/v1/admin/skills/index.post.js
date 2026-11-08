import { defineApi, ok } from "@server/utils/api.js";
import { skillRef } from "@server/services/reference/reference.service.js";
import { skillBody } from "@server/validators/reference.js";

export default defineApi({ auth: "admin", body: skillBody }, async ({ body }) =>
  ok(await skillRef.create(body), "Skill created", 201),
);
