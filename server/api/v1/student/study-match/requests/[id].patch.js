import { defineApi } from "@server/utils/api.js";
import { respondToRequest } from "@server/services/study-match/study-match.service.js";
import { respondBody } from "@server/validators/study-match.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, body: respondBody, message: "Request updated" },
  ({ user, params, body }) => respondToRequest(user.id, params.id, body.action),
);
