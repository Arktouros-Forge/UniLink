import { defineApi } from "@server/utils/api.js";
import { getCompetition } from "@server/services/competitions/competitions.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi({ params: idParam }, ({ user, params }) =>
  getCompetition(user, params.id),
);
