import { defineApi } from "@server/utils/api.js";
import { getTeam } from "@server/services/teams/teams.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, ({ user, params }) =>
  getTeam(user.id, params.id),
);
