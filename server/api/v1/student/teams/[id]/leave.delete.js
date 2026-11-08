import { defineApi } from "@server/utils/api.js";
import { leaveTeam } from "@server/services/teams/teams.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "You left the team" },
  ({ user, params }) => leaveTeam(user.id, params.id),
);
