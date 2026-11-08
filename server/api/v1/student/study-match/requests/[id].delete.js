import { defineApi } from "@server/utils/api.js";
import { removeRequest } from "@server/services/study-match/study-match.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "Request removed" },
  ({ user, params }) => removeRequest(user.id, params.id),
);
