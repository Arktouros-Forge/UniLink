import { defineApi } from "@server/utils/api.js";
import { deleteTeam } from "@server/services/teams/teams.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "Team deleted" },
  ({ user, params }) => deleteTeam(user.id, params.id),
);
