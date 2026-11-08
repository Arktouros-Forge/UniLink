import { defineApi } from "@server/utils/api.js";
import { listJoinRequests } from "@server/services/teams/teams.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, ({ user, params }) =>
  listJoinRequests(user.id, params.id),
);
