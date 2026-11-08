import { defineApi, ok } from "@server/utils/api.js";
import { createCompetition } from "@server/services/competitions/competitions.service.js";
import { studentCompetitionBody } from "@server/validators/competitions.js";

export default defineApi(
  { body: studentCompetitionBody },
  async ({ user, body }) =>
    ok(await createCompetition(user, body), "Competition created", 201),
);
