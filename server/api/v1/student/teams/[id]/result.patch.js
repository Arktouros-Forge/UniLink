import { defineApi } from "@server/utils/api.js";
import { reportResult } from "@server/services/teams/teams.service.js";
import { resultBody } from "@server/validators/teams.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: resultBody, message: "Result reported" },
  ({ user, params, body }) => reportResult(user.id, params.id, body.result),
);
