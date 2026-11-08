import { defineApi } from "@server/utils/api.js";
import { updateSign } from "@server/services/study-match/study-match.service.js";
import { signPatch } from "@server/validators/study-match.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: signPatch, message: "Help sign updated" },
  ({ user, params, body }) => updateSign(user.id, params.id, body),
);
