import { defineApi } from "@server/utils/api.js";
import { listMembers } from "@server/services/teams/teams.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, ({ user, params }) =>
  listMembers(user.id, params.id),
);
