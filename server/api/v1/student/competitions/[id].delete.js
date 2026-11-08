import { defineApi } from "@server/utils/api.js";
import { deleteCompetition } from "@server/services/competitions/competitions.service.js";
import { idParam } from "@server/validators/common.js";

export default defineApi(
  { params: idParam, message: "Competition deleted" },
  ({ user, params }) => deleteCompetition(user, params.id),
);
