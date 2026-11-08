import { defineApi } from "@server/utils/api.js";
import { getRequest } from "@server/services/study-match/study-match.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, ({ user, params }) =>
  getRequest(user.id, params.id),
);
