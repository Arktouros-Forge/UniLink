import { defineApi, ok } from "@server/utils/api.js";
import { joinTeam } from "@server/services/teams/teams.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, async ({ user, params }) =>
  ok(await joinTeam(user.id, params.id), "Join request sent", 201),
);
