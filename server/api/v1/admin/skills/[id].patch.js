import { defineApi } from "@server/utils/api.js";
import { skillRef } from "@server/services/reference/reference.service.js";
import { skillPatch } from "@server/validators/reference.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    body: skillPatch,
    message: "Skill updated",
  },
  ({ params, body }) => skillRef.update(params.id, body),
);
