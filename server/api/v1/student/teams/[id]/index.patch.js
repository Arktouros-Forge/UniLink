import { defineApi } from "@server/utils/api.js";
import { updateTeam } from "@server/services/teams/teams.service.js";
import { teamPatch } from "@server/validators/teams.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: teamPatch, message: "Team updated" },
  ({ user, params, body }) => updateTeam(user.id, params.id, body),
);
