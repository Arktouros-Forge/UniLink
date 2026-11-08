import { defineApi, ok } from "@server/utils/api.js";
import { createTeam } from "@server/services/teams/teams.service.js";
import { teamBody } from "@server/validators/teams.js";

export default defineApi({ body: teamBody }, async ({ user, body }) =>
  ok(await createTeam(user.id, body), "Team created", 201),
);
