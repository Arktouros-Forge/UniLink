import { defineApi } from "@server/utils/api.js";
import { updateCompetition } from "@server/services/competitions/competitions.service.js";
import { competitionPatch } from "@server/validators/competitions.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  {
    auth: "admin",
    params: idParam,
    body: competitionPatch,
    message: "Competition updated",
  },
  ({ user, params, body }) => updateCompetition(user, params.id, body),
);
