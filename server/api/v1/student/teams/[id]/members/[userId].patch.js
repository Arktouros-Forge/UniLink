import { defineApi } from "@server/utils/api.js";
import { respondToJoin } from "@server/services/teams/teams.service.js";
import { memberParams, respondBody } from "@server/validators/teams.js";

export default defineApi(
  { params: memberParams, body: respondBody, message: "Member updated" },
  ({ user, params, body }) =>
    respondToJoin(user.id, params.id, params.userId, body.decision),
);
